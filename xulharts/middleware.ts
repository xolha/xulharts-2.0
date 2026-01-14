import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // rotas admin protegidas (exceto página de login)
  if (pathname.startsWith('/src/admin') && !pathname.startsWith('/src/admin/login')) {
    const sessionCookie = request.cookies.get('better-auth.session_token');

    if (!sessionCookie) {
      // redireciona para login se não autenticado
      const loginUrl = new URL('/src/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/src/admin/:path*'],
};
