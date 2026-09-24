import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/login';

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/buyurtmalar', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_static|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
