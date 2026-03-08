import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSlugFromHeaders } from '@/features/tenant';
import { headers } from 'next/headers';

/**
 * GET /api/debug/tenant
 *
 * A diagnostic endpoint that shows tenant resolution details.
 * Attempts to authenticate via server-side cookies and resolve
 * the tenant from the hostname subdomain.
 *
 * This route intentionally does NOT use requireAuth() because it
 * should return debug info even for unauthenticated users (showing
 * what went wrong).
 */
export async function GET() {
    const headerList = await headers();
    const host = headerList.get('host') || '';

    // ─── Authentication ─────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    const authenticated = !!user;

    // ─── Slug Extraction ────────────────────────────────────────────────
    const tenantSlug = getSlugFromHeaders(headerList);

    // ─── Tenant Lookup ──────────────────────────────────────────────────
    let tenantId: string | null = null;
    let tenantName: string | null = null;
    let dbError: string | null = null;

    if (tenantSlug) {
        const { data, error } = await supabase
            .from('tenants')
            .select('id, name')
            .eq('slug', tenantSlug)
            .single();

        if (data) {
            tenantId = data.id;
            tenantName = data.name;
        }

        if (error) {
            dbError = error.message;
        }
    }

    return NextResponse.json({
        host,
        tenant_slug: tenantSlug,
        tenant_id: tenantId,
        tenant_name: tenantName,
        user_id: user?.id || null,
        authenticated,
        status: tenantId ? 'found' : 'not_found',
        debug: {
            auth_error: authError?.message || null,
            db_error: dbError,
            has_session: authenticated,
        },
    });
}
