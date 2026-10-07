import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BACKEND_URL } from './src/config/api';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('vendor_token')?.value;

  // 1. If trying to access login page
  if (pathname === '/login') {
    if (token) {
      try {
        const verifyRes = await fetch(`${BACKEND_URL}/api/auth/session`, {
          headers: { 'Cookie': `vendor_token=${token}` }
        });
        const data = await verifyRes.json();
        if (data.user) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (err) {
        // Token invalid, proceed to login
      }
    }
    return NextResponse.next();
  }

  // 2. Protect all other routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token with backend
  try {
    const verifyRes = await fetch(`${BACKEND_URL}/api/auth/session`, {
      headers: { 'Cookie': `vendor_token=${token}` }
    });
    const data = await verifyRes.json();
    if (!data.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|AuthixLogo.svg).*)',
  ],
};
