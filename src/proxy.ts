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
 * 1. Refresh the Supabase auth session using `getClaims()` (JWT-verified)
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
    // Create a proxy-aware Supabase client that can read and write cookies
    // on both the request and response objects.

    let supabaseResponse = NextResponse.next({ request: req });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // Update the request cookies so downstream Server Components
                    // see the refreshed session.
                    cookiesToSet.forEach(({ name, value }) =>
                        req.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request: req });
                    // Update the response cookies so the browser stores the
                    // refreshed session.
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // getClaims() validates the JWT signature and refreshes expired tokens.
    // Do not place any code between createServerClient and this call.
    await supabase.auth.getClaims();

    // ─── 2. Tenant Slug Injection ────────────────────────────────────────
    const slug = extractSlugFromHostname(hostname);

    if (slug) {
        supabaseResponse.headers.set('x-tenant-slug', slug);
    }

    const protocol =
        req.headers.get('x-forwarded-proto') ||
        (hostname.includes('localhost') ? 'http' : 'https');
    supabaseResponse.headers.set('x-tenant-url', `${protocol}://${hostname}`);

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
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
