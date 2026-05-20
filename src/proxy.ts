import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // First update session (supabase)
  const supabaseResponse = await updateSession(request)

  // Avoid running i18n middleware for API routes or static files
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return supabaseResponse;
  }

  // Run next-intl middleware
  const intlResponse = handleI18nRouting(request);

  // Merge cookies from supabaseResponse (which might have refreshed auth tokens)
  const setCookieHeaders = supabaseResponse.headers.getSetCookie();
  for (const cookie of setCookieHeaders) {
    intlResponse.headers.append('set-cookie', cookie);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
