import { NextResponse } from 'next/server';
import { changePassword, getSessionFromCookieHeader } from '@/lib/auth';

export async function POST() {
  return NextResponse.json(
    { error: 'Password changes are disabled in this demo.' },
    { status: 403 },
  );
}
