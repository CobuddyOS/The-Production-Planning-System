import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
    const headerList = await headers();
    const host = headerList.get('host') || '';

    console.log('[DEBUG TENANT API] Host:', host);

    // --- AUTHENTICATION ---
    // We support two methods of auth:
    // 1. Cookie-based (works on root domain, same origin)
    // 2. Bearer token (works cross-subdomain - sent by the page's fetch call)

    let session = null;
    let authError = null;

    // Method 1: Try reading the Authorization: Bearer <JWT> header sent from the page
    const authHeader = headerList.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const accessToken = authHeader.split(' ')[1];
        console.log('[DEBUG TENANT API] Found Authorization header — using Bearer token');

        // Create a fresh Supabase client and set the session manually via the token
        const supabaseWithToken = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        );

        const { data, error } = await supabaseWithToken.auth.getUser(accessToken);

        if (data?.user) {
            console.log('[DEBUG TENANT API] Auth via Bearer token — User ID:', data.user.id);
            console.log('[DEBUG TENANT API] Auth via Bearer token — User Email:', data.user.email);
            session = { user: data.user, access_token: accessToken };
        } else {
            console.error('[DEBUG TENANT API] Bearer token invalid:', error?.message);
            authError = error;
        }
    } else {
        // Method 2: Fall back to cookie-based session (works on same domain)
        console.log('[DEBUG TENANT API] No Authorization header — trying cookie-based session');
        const supabase = await createServerClient();
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        session = sessionData.session;
        authError = sessionError;
    }

    console.log('[DEBUG TENANT API] Auth Session:', session ? 'EXISTS' : 'NULL');
    if (authError) {
        console.error('[DEBUG TENANT API] Auth Error:', authError.message);
    }

    // --- SLUG EXTRACTION (from proxy.ts logic) ---
    const parts = host.split('.');
    let tenant_slug = '';
    if (!host.includes('localhost')) {
        tenant_slug = parts[0];
    } else if (parts.length > 1) {
        // e.g. tennanta.localhost:3000 → detect 'tennanta'
        tenant_slug = parts[0];
    }

    // Fallback to header if already set by proxy/middleware
    tenant_slug = headerList.get('x-tenant-slug') || tenant_slug;

    console.log('[DEBUG TENANT API] Detected Slug:', tenant_slug);

    // --- TENANT LOOKUP ---
    let tenant_id = null;
    let tenant_name = null;
    let db_error = null;

    if (tenant_slug) {
        // Create an authenticated Supabase client with the user's JWT
        // so auth.uid() works in RLS policies
        const queryClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            session?.access_token
                ? {
                    global: {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    },
                }
                : undefined
        );

        console.log('[DEBUG TENANT API] Querying tenants table for slug:', tenant_slug);
        console.log('[DEBUG TENANT API] Using authenticated client:', !!session?.access_token);

        const { data, error } = await queryClient
            .from('tenants')
            .select('id, name')
            .eq('slug', tenant_slug)
            .single();

        if (data) {
            console.log('[DEBUG TENANT API] ✅ Tenant Found:', data.name, '(', data.id, ')');
            tenant_id = data.id;
            tenant_name = data.name;
        }

        if (error) {
            console.error('[DEBUG TENANT API] ❌ Database Error:', error.message);
            console.error('[DEBUG TENANT API] Error details:', error);
            db_error = error.message;
        }
    } else {
        console.warn('[DEBUG TENANT API] No tenant slug detected from host.');
    }

    return NextResponse.json({
        host,
        tenant_slug,
        tenant_id,
        tenant_name,
        user_id: session?.user?.id || null,
        authenticated: !!session,
        status: tenant_id ? 'found' : 'not_found',
        debug: {
            auth_error: authError?.message || null,
            db_error: db_error,
            has_session: !!session,
            using_bearer: !!headerList.get('authorization'),
            cookies_present: !!headerList.get('cookie'),
        },
    });
}
