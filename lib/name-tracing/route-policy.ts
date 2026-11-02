import { NextResponse, type NextRequest } from 'next/server';
import { ENTRY_PATH } from './settings';
const robots = 'noindex, nofollow'; // Draft stays noindex even in production. Release needs a separate reviewed diff.
export function nameTracingResponse(request: NextRequest): NextResponse | null {
  const match = request.nextUrl.pathname.match(/^\/(?:(en|de|es|pt|fr|it|nl)\/)?name-tracing-worksheet\/?$/);
  if (!match) return null;
  const headers = { 'X-Robots-Tag': robots, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' };
  // Next may normalize a slash or strip framework parameters before this handler.
  if (request.nextUrl.search) return new NextResponse(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Open the name tracing tool</title><body><p>Enter names in the tool, not in a web address.</p><a href="${ENTRY_PATH}" rel="noreferrer">Open the name tracing worksheet generator</a></body></html>`,
    { status: 400, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'" } }
  );
  if (match[1] === 'en') return NextResponse.redirect(new URL(ENTRY_PATH, request.url), { status: 308, headers });
  if (match[1]) return new NextResponse('Not found', { status: 404, headers });
  const nonce = crypto.randomUUID().replaceAll('-', '');
  const csp = `default-src 'none'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src data: blob:; font-src 'self'; connect-src 'none'; worker-src 'none'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'`;
  const forwarded = new Headers(request.headers); forwarded.set('x-nonce', nonce); forwarded.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers: forwarded } });
  for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
  response.headers.set('Content-Security-Policy', csp);
  return response;
}
