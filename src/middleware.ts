import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import authService from './services/authService';
import { CheckAuthResponse } from './types/auth';
import { locales } from './navigation';

const publicPages = ['/login', '/signup'];

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix: 'as-needed',
  defaultLocale: 'en',
});

export default async function middleware(req: NextRequest) {
  // Check if the current page is a public page
  const publicPathnameRegex = RegExp(`^(/(${locales.join('|')}))?(${publicPages.join('|')})/?$`, 'i');
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  // Check if the user is authenticated
  const { data, error }: CheckAuthResponse = await authService.checkAuth(req.cookies.getAll());

  try {
    // Handle public pages
    if (isPublicPage) {
      // Redirect authenticated user from `/login` to home
      if (data && (req.nextUrl.pathname.endsWith('/login') || req.nextUrl.pathname.endsWith('/signup'))) {
        return Response.redirect(new URL('/', req.nextUrl.origin));
      }
    } else {
      // Handle protected routes
      // Throw error for unauthenticated user on protected routes
      if (error) throw new Error(error.message);
    }
  } catch (error) {
    // Redirect unauthenticated user from protected routes to `/login`
    if (!isPublicPage) {
      return Response.redirect(new URL('/login', req.nextUrl.origin));
    }
  }

  // Apply intlMiddleware (if no redirect occurs)
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
