import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BACKEND_URL } from './src/config/api';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('vendor_token')?.value;

  // 1. If we have a token, verify it with the Backend Server
  let isTokenValid = false;
  if (token) {
    try {
      const verifyRes = await fetch(`${BACKEND_URL}/api/auth/session`, {
        headers: { 'Cookie': `vendor_token=${token}` }
      });
      const data = await verifyRes.json();
      isTokenValid = !!data.user;
    } catch (err) {
      isTokenValid = false;
    }
  }

  // 2. Redirection Logic based on SERVER verification
  if (pathname === '/login' && isTokenValid) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If you add protected routes later, use this:
  // if (pathname.startsWith('/dashboard') && !isTokenValid) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
