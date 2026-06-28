import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define public paths that don't require authentication
  const isPublicPath = pathname === '/login' || pathname.startsWith('/api/auth');
  
  const token = request.cookies.get('admin_token')?.value;

  // 1. If trying to access protected path without token -> redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If trying to access login page WITH token -> redirect to dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|AuthixLogo.svg).*)',
  ],
};
