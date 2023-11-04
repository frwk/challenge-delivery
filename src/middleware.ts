import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import authService from './services/authService';
import { CheckAuthResponse } from './types/auth';

export async function middleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup';
  try {
    const { data, error }: CheckAuthResponse = await authService.checkAuth(request.cookies.getAll());
    if (error) throw new Error(error.message);
    if (data) {
      if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }
    }
  } catch (error) {
    if (isProtectedRoute) {
      console.log('Redirecting to login');
      return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
    }
  }
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
