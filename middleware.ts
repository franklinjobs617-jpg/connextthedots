// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

const handleI18n = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = handleI18n(request);
  // This new worksheet exists only in English; do not advertise untranslated URLs.
  if (/^\/(?:(?:en|de|es|pt|fr|it|nl)\/)?printables\/mountain-landscape-120\/?$/.test(request.nextUrl.pathname)) {
    response.headers.delete('link');
  }
  return response;
}

export const config = {
  // 匹配所有路径，排除静态文件和 API
  matcher: ['/', '/(de|en|es|pt|fr|it|nl)/:path*', '/((?!api|_next|_vercel|shopping-guide|.*\\.(?!html$)[^/]*$).*)']
};
