import crypto from 'node:crypto';
import { readDb, resetDbForTests, updateDb } from '@/lib/file-db';
import type { AuthSession, AuthUser, SessionUser } from '@/lib/types';

export const SESSION_COOKIE_NAME = 'filamu_session';
const DEFAULT_SECRET = 'filamu-dev-secret';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const PASSWORD_MIN_LENGTH = 10;

function getSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET must be configured in production.');
  }
  return DEFAULT_SECRET;
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('base64url');
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString('base64url')) {
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('base64url')}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, hash] = passwordHash.split(':');
  if (!salt || !hash) return false;

  const derivedKey = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'base64url');
  return expected.length === derivedKey.length && crypto.timingSafeEqual(expected, derivedKey);
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function sanitizeUsername(username: string) {
  return username.trim().replace(/\s+/g, ' ');
}

export function sanitizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validatePasswordStrength(password: string) {
  const trimmed = password.trim();
  if (trimmed.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
  }
  if (!/[A-Z]/.test(trimmed) || !/[a-z]/.test(trimmed) || !/\d/.test(trimmed)) {
    return 'Password must include upper-case, lower-case, and a number.';
  }
  return null;
}

function toSessionUser(user: AuthUser): SessionUser {
  return {
    id: user.id,
    username: user.username,
    name: user.username,
    email: user.email,
  };
}

function buildSessionToken(userId: string, sessionId: string, exp: string) {
  const payload = base64UrlEncode(JSON.stringify({ userId, sessionId, exp }));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function parseSessionToken(token: string | undefined | null) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as {
      userId: string;
      sessionId: string;
      exp: string;
    };
    if (!parsed.userId || !parsed.sessionId || !parsed.exp) return null;
    if (Date.parse(parsed.exp) < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function createUser(input: { username: string; email: string; password: string }) {
  const username = sanitizeUsername(input.username);
  const email = sanitizeEmail(input.email);
  const passwordIssue = validatePasswordStrength(input.password);

  if (!username) {
    throw new Error('Username is required.');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('A valid email address is required.');
  }
  if (passwordIssue) {
    throw new Error(passwordIssue);
  }

  const existing = await readDb();
  const duplicate = existing.users.find(
    (user) =>
      user.username.toLowerCase() === username.toLowerCase() || user.email.toLowerCase() === email,
  );

  if (duplicate) {
    throw new Error('An account with that username or email already exists.');
  }

  const now = new Date().toISOString();
  const user: AuthUser = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash: hashPassword(input.password.trim()),
    createdAt: now,
    updatedAt: now,
    passwordChangedAt: now,
  };

  await updateDb(async (db) => ({
    ...db,
    users: [...db.users, user],
  }));

  return toSessionUser(user);
}

export async function authenticateUser(identifier: string, password: string) {
  const trimmedIdentifier = sanitizeUsername(identifier);
  const email = sanitizeEmail(identifier);
  const db = await readDb();
  const user = db.users.find(
    (candidate) =>
      candidate.username.toLowerCase() === trimmedIdentifier.toLowerCase() ||
      candidate.email.toLowerCase() === email,
  );

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error('Invalid username/email or password.');
  }

  return user;
}

export async function createSession(userId: string) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();
  const token = buildSessionToken(userId, sessionId, expiresAt);

  return { token, expiresAt };
}

export async function revokeSession(token: string | undefined | null) {
  // Stateless demo session: no server-side session store is used.
  return;
}

export async function revokeAllUserSessions(userId: string) {
  // Stateless demo session: session revocation is not supported in this mock setup.
  return;
}

export async function getSessionFromToken(token: string | undefined | null) {
  const parsed = parseSessionToken(token);
  if (!parsed) return null;

  const db = await readDb();
  const user = db.users.find((candidate) => candidate.id === parsed.userId);
  if (!user) return null;

  return {
    user: toSessionUser(user),
    session: {
      id: parsed.sessionId,
      userId: parsed.userId,
      tokenHash: hashToken(token ?? ''),
      createdAt: parsed.exp,
      expiresAt: parsed.exp,
      revokedAt: null,
    },
  };
}

export async function getSessionFromCookieHeader(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  const token = match?.[1] ? decodeURIComponent(match[1]) : null;
  return getSessionFromToken(token);
}

export function getSessionCookieValue(token: string) {
  return token;
}

export async function changePassword(args: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const passwordIssue = validatePasswordStrength(args.newPassword);
  if (passwordIssue) {
    throw new Error(passwordIssue);
  }

  const db = await readDb();
  const user = db.users.find((candidate) => candidate.id === args.userId);
  if (!user) {
    throw new Error('User not found.');
  }
  if (!verifyPassword(args.currentPassword, user.passwordHash)) {
    throw new Error('Current password is incorrect.');
  }

  const now = new Date().toISOString();
  const updatedUser: AuthUser = {
    ...user,
    passwordHash: hashPassword(args.newPassword.trim()),
    updatedAt: now,
    passwordChangedAt: now,
  };

  await updateDb(async (current) => ({
    ...current,
    users: current.users.map((candidate) => (candidate.id === user.id ? updatedUser : candidate)),
    sessions: current.sessions.map((session) =>
      session.userId === user.id && !session.revokedAt
        ? { ...session, revokedAt: now }
        : session,
    ),
  }));
}

export { resetDbForTests };
