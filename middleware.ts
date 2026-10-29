// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';
import { segmentedSheetIds } from './lib/segmented-sheet-ids';
// Explicit English-only routes: five accepted Wave A plus five approved Wave B routes.
const waveAIds = new Set([
  'elephant-100', 'hot-air-balloon-100', 'seahorse-100',
  'hummingbird-120', 'shark-140',
  'flamingo-150', 'chameleon-160', 'cactus-160', 'swan-90', 'maple-leaf-90',
  ...segmentedSheetIds,
]);

const handleI18n = createMiddleware(routing);
// Ignore language preference only on the exact unprefixed English resources.
// Keep the user's cookie intact for all subsequent unrelated navigation.
const handleEnglishSheet = createMiddleware({
  ...routing, localeDetection: false, localeCookie: false, alternateLinks: false,
});

export default function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/(?:(en|de|es|pt|fr|it|nl)\/)?printables\/([^/]+)\/?$/);
  const isWaveA = Boolean(match && waveAIds.has(match[2]));
  const hundredMatch = request.nextUrl.pathname.match(/^\/(?:(en|de|es|pt|fr|it|nl)\/)?connect-the-dots-1-to-100\/?$/);
  const alphabetMatch = request.nextUrl.pathname.match(/^\/(?:(en|de|es|pt|fr|it|nl)\/)?alphabet-dot-to-dot\/?$/);
  const isEnglishResource = isWaveA || Boolean(hundredMatch) || Boolean(alphabetMatch);
  const response = isEnglishResource && !(match?.[1] || hundredMatch?.[1] || alphabetMatch?.[1]) ? handleEnglishSheet(request) : handleI18n(request);
  // This new worksheet exists only in English; do not advertise untranslated URLs.
  if (/^\/(?:(?:en|de|es|pt|fr|it|nl)\/)?printables\/mountain-landscape-120\/?$/.test(request.nextUrl.pathname)) {
    response.headers.delete('link');
  }
  // Remove only language alternatives on these explicit English resources.
  // Preserve any unrelated Link values (for example image preloads).
  if (isEnglishResource) {
    const link = response.headers.get('link');
    if (link) {
      const retained = link.split(/,(?=\s*<)/).filter((value) => !/;\s*hreflang\s*=/i.test(value)).join(',');
      if (retained) response.headers.set('link', retained);
      else response.headers.delete('link');
    }
  }
  return response;
}

export const config = {
  // 匹配所有路径，排除静态文件和 API
  matcher: ['/', '/(de|en|es|pt|fr|it|nl)/:path*', '/((?!api|_next|_vercel|shopping-guide|.*\\.(?!html$)[^/]*$).*)']
};
