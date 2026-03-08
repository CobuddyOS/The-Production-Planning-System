import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase auth session and syncs cookies between
 * the request and response.
 *
 * Must be called from the Next.js proxy (src/proxy.ts) on every request.
 *
 * Uses `getClaims()` instead of `getSession()` — this validates the JWT
 * signature against the project's published public keys every time,
 * making it safe to trust on the server.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs#hook-up-proxy
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Do not run code between createServerClient and getClaims().
    // A simple mistake could make it very hard to debug issues with
    // users being randomly logged out.

    // IMPORTANT: getClaims() validates the JWT signature against the project's
    // published public keys. Never replace this with getSession().
    await supabase.auth.getClaims();

    return supabaseResponse;
}
