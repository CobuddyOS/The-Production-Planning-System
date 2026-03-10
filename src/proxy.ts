import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { extractSlugFromHostname } from '@/features/tenant';

/**
 * Next.js Proxy for Session Refresh + Subdomain Tenant Detection
 *
 * This is the official Next.js proxy entry point (must be at src/proxy.ts).
 * Next.js 16+ uses the `proxy` convention instead of the deprecated `middleware`.
 *
 * Responsibilities:
 * 1. Refresh the Supabase auth session using `getSession()` (Passive)
 * 2. Extract tenant slug from the hostname subdomain
 * 3. Inject `x-tenant-slug` and `x-tenant-url` headers for downstream use
 * 4. Sync cookies between request and response
 */
export async function proxy(req: NextRequest) {
    const url = req.nextUrl.clone();
    const hostname = req.headers.get('host') || '';

    // Skip for static assets and internal routes
    const isPublicFile = url.pathname.match(/\.(.*)$/);
    const isInternal =
        url.pathname.startsWith('/_next') ||
        url.pathname.startsWith('/api/auth');

    if (isPublicFile || isInternal) {
        return NextResponse.next();
    }

    // ─── 1. Supabase Session Refresh ─────────────────────────────────────
    // Initialize headers with existing request headers
    const requestHeaders = new Headers(req.headers);

    // EXTREMELY IMPORTANT: We bypass auth session management for Prefetching.
    // Next.js Link components prefetch in the background which causes bursts of 
    // network calls. This is the primary driver of 429 errors.
    const isPrefetch =
        req.headers.get('x-middleware-prefetch') === '1' ||
        req.headers.get('purpose') === 'prefetch';

    // Create the initial response that we will return or modify
    let supabaseResponse = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    if (!isPrefetch) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    getAll() {
                        return req.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        // FIX: We must update the request cookies so downstream 
                        // Server Components (layouts/pages) see the new tokens.
                        cookiesToSet.forEach(({ name, value }) =>
                            req.cookies.set(name, value)
                        );

                        // FIX: Instead of re-instantiating NextResponse.next, we 
                        // update the session cookies on the existing response object.
                        // This prevents race conditions and redundant header duplication.
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // API routes handle their own auth. Bypassing here saves network calls.
        const isApi = url.pathname.startsWith('/api/');
        if (!isApi) {
            /** 
             * getSession() is used for passive session management in the proxy.
             * Unlike getUser(), it avoids a heavy network round-trip to the
             * auth server if the local token is valid, drastically reducing 
             * 429 Rate Limit errors.
             */
            await supabase.auth.getSession();
        }
    }

    // ─── 2. Tenant Slug Injection ────────────────────────────────────────
    const slug = extractSlugFromHostname(hostname);

    if (slug) {
        requestHeaders.set('x-tenant-slug', slug);
        supabaseResponse.headers.set('x-tenant-slug', slug);
    }

    const protocol =
        req.headers.get('x-forwarded-proto') ||
        (hostname.includes('localhost') ? 'http' : 'https');

    const tenantUrl = `${protocol}://${hostname}`;
    requestHeaders.set('x-tenant-url', tenantUrl);
    supabaseResponse.headers.set('x-tenant-url', tenantUrl);

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - static assets (.svg, .png, .jpg, .jpeg, .gif, .webp)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
