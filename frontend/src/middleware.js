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

  // Admin bo'lmagan foydalanuvchilar xodimlar va moliya sahifalariga kira olmasin
  if (token) {
    const adminOnlyPaths = ['/xodimlar', '/moliya'];
    const isAdminPath = adminOnlyPaths.some(
      (path) => pathname === path || pathname.startsWith(path + '/')
    );

    if (isAdminPath) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decoded = JSON.parse(
            Buffer.from(payloadBase64, 'base64').toString('utf8')
          );
          if (!decoded?.is_admin) {
            return NextResponse.redirect(new URL('/buyurtmalar', request.url));
          }
        }
      } catch (err) {
        return NextResponse.redirect(new URL('/buyurtmalar', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|_static|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
