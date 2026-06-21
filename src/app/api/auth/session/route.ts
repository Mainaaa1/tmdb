import { NextResponse } from 'next/server';
import { getSessionFromCookieHeader } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSessionFromCookieHeader(request.headers.get('cookie'));

  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
