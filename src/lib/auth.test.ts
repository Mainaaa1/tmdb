import { beforeEach, describe, expect, it } from 'vitest';
import {
  authenticateUser,
  changePassword,
  createSession,
  createUser,
  getSessionFromToken,
  resetDbForTests,
  validatePasswordStrength,
} from '@/lib/auth';

describe('auth helpers', () => {
  beforeEach(async () => {
    await resetDbForTests();
  });

  it('creates, authenticates, and resolves a session', async () => {
    const user = await createUser({
      username: 'Cine Guest',
      email: 'guest@example.com',
      password: 'StrongPass123',
    });
    const authenticated = await authenticateUser('guest@example.com', 'StrongPass123');
    const session = await createSession(authenticated.id);
    const resolved = await getSessionFromToken(session.token);

    expect(authenticated.username).toBe(user.username);
    expect(resolved?.user.email).toBe('guest@example.com');
  });

  it('changes passwords and rejects the old password', async () => {
    const user = await createUser({
      username: 'Movie Fan',
      email: 'fan@example.com',
      password: 'StrongPass123',
    });

    await createSession(user.id);
    await changePassword({
      userId: user.id,
      currentPassword: 'StrongPass123',
      newPassword: 'EvenStronger456',
    });

    await expect(authenticateUser('fan@example.com', 'StrongPass123')).rejects.toThrow();
    await expect(authenticateUser('fan@example.com', 'EvenStronger456')).resolves.toBeTruthy();
  });

  it('enforces password strength', () => {
    expect(validatePasswordStrength('weak')).toContain('at least');
  });
});
