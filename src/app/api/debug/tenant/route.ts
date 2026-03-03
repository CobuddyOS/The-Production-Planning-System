import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const headerList = await headers();
    const host = headerList.get('host') || '';

    console.log('[DEBUG TENANT API] Host:', host);

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    console.log('[DEBUG TENANT API] Auth Session:', session ? 'Exists' : 'NULL');
    if (session?.user) {
        console.log('[DEBUG TENANT API] User ID:', session.user.id);
        console.log('[DEBUG TENANT API] User Email:', session.user.email);
    }
    if (authError) {
        console.error('[DEBUG TENANT API] Auth Error:', authError.message);
    }

    // Extract slug using logic from proxy.ts (as updated by user)
    const parts = host.split('.');
    let tenant_slug = '';
    if (!host.includes('localhost')) {
        tenant_slug = parts[0];
    } else if (parts.length > 1) {
        // e.g. tenanta.localhost → detect tenanta
        tenant_slug = parts[0];
    }

    // Fallback to header if already set by proxy/middleware
    tenant_slug = headerList.get('x-tenant-slug') || tenant_slug;

    console.log('[DEBUG TENANT API] Detected Slug:', tenant_slug);

    let tenant_id = null;
    let tenant_name = null;
    let db_error = null;

    if (tenant_slug) {
        // Query using the server client which respects RLS via the session token
        console.log('[DEBUG TENANT API] Querying database for slug:', tenant_slug);
        const { data, error } = await supabase
            .from('tenants')
            .select('id, name')
            .eq('slug', tenant_slug)
            .single();

        if (data) {
            console.log('[DEBUG TENANT API] Tenant Found:', data.name, '(', data.id, ')');
            tenant_id = data.id;
            tenant_name = data.name;
        }

        if (error) {
            console.error('[DEBUG TENANT API] Database Error:', error.message);
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
            cookies_present: !!headerList.get('cookie')
        }
    });
}
