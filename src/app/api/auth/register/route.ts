import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Account creation is disabled for this public demo.' },
    { status: 403 },
  );
}
