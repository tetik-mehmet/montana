import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin kontrolü - Sadece admin'ler erişebilir
    const adminOnlyPaths = ['/dashboard', '/members', '/packages', '/memberships', '/users'];
    const isAdminPath = adminOnlyPaths.some(path => pathname.startsWith(path));

    if (isAdminPath && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/pricing', req.url));
    }

    // Normal kullanıcı kontrolü - pricing dışında başka yere gidemez
    if (token?.role === 'user' && !pathname.startsWith('/pricing')) {
      return NextResponse.redirect(new URL('/pricing', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/members/:path*',
    '/packages/:path*',
    '/memberships/:path*',
    '/users/:path*',
    '/pricing/:path*'
  ],
};
