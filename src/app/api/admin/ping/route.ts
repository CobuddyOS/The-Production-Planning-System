import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/api/auth-guard';
import { ADMIN_ALLOWED_ROLES } from '@/features/admin';

/**
 * GET /api/admin/ping
 *
 * A protected endpoint that validates:
 *  1. User is authenticated (server-side cookie session)
 *  2. User belongs to the tenant inferred from the Host subdomain
 *  3. User has role 'owner' or 'admin' in that tenant
 *
 * Errors:
 *  401 - Not logged in / invalid session
 *  403 - Wrong tenant, not a member, or insufficient role
 *  200 - All checks pass
 */
export async function GET() {
    const result = await requireRole(ADMIN_ALLOWED_ROLES);
    if (!result.ok) return result.response;

    const { user, tenant, tenantSlug, role } = result.ctx;

    return NextResponse.json(
        {
            ok: true,
            tenant_slug: tenantSlug,
            tenant_id: tenant.id,
            role,
            user_id: user.id,
        },
        { status: 200 }
    );
}
