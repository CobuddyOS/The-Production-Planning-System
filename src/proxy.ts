import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Proxy for Subdomain Tenant Detection
 * 
 * This is the official Next.js proxy entry point (must be at src/proxy.ts).
 * Next.js 16+ uses the `proxy` convention instead of the deprecated `middleware`.
 * 
 * Flow:
 * 1. Extract hostname (e.g., tenant-a.localhost:3000)
 * 2. Extract subdomain slug (e.g., tenant-a)
 * 3. Add to headers so the app knows the current tenant
 */
export async function proxy(req: NextRequest) {
    const url = req.nextUrl.clone();
    const hostname = req.headers.get('host') || '';

    // Domain logic: Adjust for production and localhost
    // Example for local: tenant.localhost:3000 -> slug is 'tenant'
    // Example for prod:  tennanta.cobuddy.net -> slug is 'tenanta'

    let slug = '';

    // Basic logic: Get the first part of the hostname
    const parts = hostname.split('.');

    // If it's localhost or an IP, first part may be the slug if more than 1 part
    if (parts.length > 2 || (parts.length === 2 && !hostname.includes('localhost'))) {
        slug = parts[0];
    }

    // Define URLs that don't need tenant detection or are core (e.g., login, global marketing)
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

    // You can also handle rewrites here if you want separate dashboards for each tenant
    // return NextResponse.rewrite(new URL(`/${slug}${url.pathname}`, req.url));

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
