import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSlugFromHeaders } from '@/features/tenant';
import { ADMIN_ALLOWED_ROLES } from '@/features/admin';

/**
 * GET /api/admin/ping
 *
 * A protected endpoint that validates:
 *  1. User is authenticated (JWT via Authorization header)
 *  2. User belongs to the tenant inferred from the Host subdomain
 *  3. User has role 'owner' or 'admin' in that tenant
 *
 * Errors:
 *  401 - Not logged in / invalid token
 *  403 - Logged in but wrong tenant or insufficient role
 *  200 - All checks pass
 */
export async function GET(req: NextRequest) {
    // ─── 1. Extract JWT from Authorization: Bearer <token> ──────────────────
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
            { ok: false, error: 'Unauthorized — no token provided' },
            { status: 401 }
        );
    }
    const accessToken = authHeader.split(' ')[1];

    // ─── 2. Validate token & get user ────────────────────────────────────────
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
        console.error('[ADMIN PING] Invalid token:', userError?.message);
        return NextResponse.json(
            { ok: false, error: 'Unauthorized — invalid or expired token' },
            { status: 401 }
        );
    }

    console.log('[ADMIN PING] Authenticated user:', user.id, user.email);

    // ─── 3. Detect tenant slug using centralized utility ───────────────────
    const tenant_slug = getSlugFromHeaders(req.headers);

    if (!tenant_slug) {
        console.warn('[ADMIN PING] No tenant slug detected from host:', req.headers.get('host'));
        return NextResponse.json(
            { ok: false, error: 'Forbidden — could not detect tenant from hostname' },
            { status: 403 }
        );
    }

    console.log('[ADMIN PING] Detected tenant slug:', tenant_slug);

    // ─── 4. Use authenticated client (JWT in global headers) for RLS ─────────
    const authedClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            global: {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        }
    );

    // ─── 5. Resolve tenant_id from slug ──────────────────────────────────────
    const { data: tenant, error: tenantError } = await authedClient
        .from('tenants')
        .select('id, slug')
        .eq('slug', tenant_slug)
        .single();

    if (tenantError || !tenant) {
        console.error('[ADMIN PING] Tenant not found or RLS blocked:', tenantError?.message);
        return NextResponse.json(
            { ok: false, error: `Forbidden — tenant "${tenant_slug}" not found or you do not belong to it` },
            { status: 403 }
        );
    }

    console.log('[ADMIN PING] Tenant resolved:', tenant.id);

    // ─── 6. Look up the user's membership in this tenant ───────────────────
    const { data: membership, error: membershipError } = await authedClient
        .from('membership')
        .select('role')
        .eq('user_id', user.id)
        .eq('tenant_id', tenant.id)
        .single();

    if (membershipError || !membership) {
        console.error('[ADMIN PING] Membership not found — user not in this tenant:', membershipError?.message);
        return NextResponse.json(
            { ok: false, error: 'Forbidden — you are not a member of this tenant' },
            { status: 403 }
        );
    }

    console.log('[ADMIN PING] User role in tenant:', membership.role);

    // ─── 7. Check role ───────────────────────────────────────────────────────
    if (!ADMIN_ALLOWED_ROLES.includes(membership.role as any)) {
        console.warn('[ADMIN PING] Insufficient role:', membership.role);
        return NextResponse.json(
            { ok: false, error: `Forbidden — role "${membership.role}" is not allowed. Required: owner or admin` },
            { status: 403 }
        );
    }

    // ─── 8. All checks passed ────────────────────────────────────────────────
    console.log('[ADMIN PING] ✅ Access granted for user:', user.id, 'role:', membership.role);

    return NextResponse.json(
        {
            ok: true,
            tenant_slug,
            tenant_id: tenant.id,
            role: membership.role,
            user_id: user.id,
        },
        { status: 200 }
    );
}
