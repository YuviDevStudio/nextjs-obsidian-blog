import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Next.js throws "failed to decode param" (HTTP 500) for any URL containing a
 * malformed percent-escape such as /tags/%E0%A4%A or /%25. The error happens
 * while route params are decoded, before any page code runs, so it cannot be
 * caught with notFound(). Intercept those requests first and serve the regular
 * 404 page instead.
 */
const INVALID_PERCENT = /%(?![0-9A-Fa-f]{2})/;

/**
 * Next decodes route params more than once: /tags/%25 becomes "%" and the
 * second decode throws. Any real slug is plain text, so a pathname that still
 * contains "%" after one decode is always malformed.
 */
function isMalformedPath(pathname) {
  if (INVALID_PERCENT.test(pathname)) return true;
  try {
    return decodeURIComponent(pathname).includes('%');
  } catch {
    return true;
  }
}

export function proxy(request) {
  if (isMalformedPath(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL('/_not-found', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
