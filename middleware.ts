import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected =
    pathname.startsWith('/dashboard') || pathname.startsWith('/movies') || pathname.startsWith('/account');
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const loggedIn = Boolean(token);

  if (isProtected && !loggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/movies/:path*', '/account/:path*'],
};
