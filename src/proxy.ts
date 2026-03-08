import { NextRequest, NextResponse } from 'next/server';
import { extractSlugFromHostname } from '@/features/tenant';

/**
 * Next.js Proxy for Subdomain Tenant Detection
 *
 * This is the official Next.js proxy entry point (must be at src/proxy.ts).
 * Next.js 16+ uses the `proxy` convention instead of the deprecated `middleware`.
 *
 * Flow:
 * 1. Extract hostname (e.g., tenant-a.localhost:3000)
 * 2. Extract subdomain slug via shared utility
 * 3. Add to headers so the app knows the current tenant
 */
export async function proxy(req: NextRequest) {
    const url = req.nextUrl.clone();
    const hostname = req.headers.get('host') || '';

    // Use the single shared slug extraction function
    const slug = extractSlugFromHostname(hostname);

    // Skip tenant detection for static assets and internal routes
    const isPublicFile = url.pathname.match(/\.(.*)$/);
    const isInternal = url.pathname.startsWith('/_next') || url.pathname.startsWith('/api/auth');

    if (isPublicFile || isInternal) {
        return NextResponse.next();
    }

    // Add the slug to the headers for easy retrieval in pages and APIs
    const requestHeaders = new Headers(req.headers);
    if (slug) {
        requestHeaders.set('x-tenant-slug', slug);
    }
    const protocol = req.headers.get('x-forwarded-proto') || (hostname.includes('localhost') ? 'http' : 'https');
    requestHeaders.set('x-tenant-url', `${protocol}://${hostname}`);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

// Add matcher to only run proxy on relevant paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
