import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, revokeSession } from '@/lib/auth';

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  const token = match?.[1] ? decodeURIComponent(match[1]) : null;
  await revokeSession(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return response;
}
