import { NextResponse } from 'next/server';
import { authenticateUser, createSession, getCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { identifier?: string; username?: string; email?: string; password?: string }
    | null;

  const identifier = body?.identifier?.trim() || body?.username?.trim() || body?.email?.trim();
  const password = body?.password?.trim();

  if (!identifier || !password) {
    return NextResponse.json({ error: 'Username/email and password are required.' }, { status: 400 });
  }

  try {
    const user = await authenticateUser(identifier, password);
    const session = await createSession(user.id);
    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.username,
        email: user.email,
      },
    });
    response.cookies.set('filamu_session', session.token, getCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to sign in.' },
      { status: 401 },
    );
  }
}
