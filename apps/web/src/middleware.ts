import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static files and API routes bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // We rely on the client-side Zustand store for actual JWT validation.
  // Next.js middleware cannot easily read localStorage, but we can check if
  // this is a protected route and potentially redirect if a cookie was set.
  // Since we use localStorage in Phase 1, we handle the *hard* redirect
  // in client-side hooks. Here, we just ensure root path goes to dashboard or login.

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
