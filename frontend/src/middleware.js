import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('booklab_token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/login' || pathname === '/register';

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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};