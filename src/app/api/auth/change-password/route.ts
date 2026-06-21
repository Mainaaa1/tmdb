import { NextResponse } from 'next/server';
import { changePassword, getSessionFromCookieHeader } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getSessionFromCookieHeader(request.headers.get('cookie'));
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { currentPassword?: string; newPassword?: string; confirmPassword?: string }
    | null;

  const currentPassword = body?.currentPassword?.trim();
  const newPassword = body?.newPassword?.trim();
  const confirmPassword = body?.confirmPassword?.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
  }

  try {
    await changePassword({
      userId: session.user.id,
      currentPassword,
      newPassword,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set('filamu_session', '', { path: '/', maxAge: 0 });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to change password.' },
      { status: 400 },
    );
  }
}
