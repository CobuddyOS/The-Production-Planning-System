import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSlugFromHeaders } from '@/features/tenant';
import { headers } from 'next/headers';
import type { User } from '@supabase/supabase-js';

// ─── Types ──────────────────────────────────────────────────────────────

/** The verified context returned when authentication succeeds. */
export interface AuthContext {
    /** The authenticated Supabase user (verified via `getUser()`). */
    user: User;
    /** The Supabase client scoped to this user's session (for RLS). */
    supabase: Awaited<ReturnType<typeof createClient>>;
}

/** Auth + tenant context returned when tenant resolution succeeds. */
export interface TenantContext extends AuthContext {
    /** The tenant slug extracted from the hostname. */
    tenantSlug: string;
    /** The tenant row from the database. */
    tenant: { id: string; slug: string; name: string };
}

/** Auth + tenant + role context returned when role check succeeds. */
export interface RoleContext extends TenantContext {
    /** The user's role within the tenant (e.g. 'owner', 'admin', 'member'). */
    role: string;
}

type AuthResult =
    | { ok: true; ctx: AuthContext }
    | { ok: false; response: NextResponse };

type TenantResult =
    | { ok: true; ctx: TenantContext }
    | { ok: false; response: NextResponse };

type RoleResult =
    | { ok: true; ctx: RoleContext }
    | { ok: false; response: NextResponse };

// ─── Guards ─────────────────────────────────────────────────────────────

/**
 * Verifies the user is authenticated via server-side cookies.
 *
 * Uses `supabase.auth.getUser()` which securely revalidates the JWT
 * against Supabase servers. Never relies on `getSession()` for
 * protection logic.
 *
 * @example
 * ```ts
 * export async function GET() {
 *   const result = await requireAuth();
 *   if (!result.ok) return result.response;
 *   const { user, supabase } = result.ctx;
 *   // ... use user and supabase
 * }
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            ok: false,
            response: NextResponse.json(
                { ok: false, error: 'Unauthorized — not logged in or session expired' },
                { status: 401 }
            ),
        };
    }

    return { ok: true, ctx: { user, supabase } };
}

/**
 * Verifies the user is authenticated AND resolves the tenant from
 * the current hostname's subdomain slug.
 *
 * @example
 * ```ts
 * export async function GET() {
 *   const result = await requireTenant();
 *   if (!result.ok) return result.response;
 *   const { user, tenant, supabase } = result.ctx;
 * }
 * ```
 */
export async function requireTenant(): Promise<TenantResult> {
    const authResult = await requireAuth();
    if (!authResult.ok) return authResult;

    const { user, supabase } = authResult.ctx;
    const headerList = await headers();
    const tenantSlug = getSlugFromHeaders(headerList);

    if (!tenantSlug) {
        return {
            ok: false,
            response: NextResponse.json(
                { ok: false, error: 'Forbidden — could not detect tenant from hostname' },
                { status: 403 }
            ),
        };
    }

    const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, slug, name')
        .eq('slug', tenantSlug)
        .single();

    if (tenantError || !tenant) {
        return {
            ok: false,
            response: NextResponse.json(
                {
                    ok: false,
                    error: `Forbidden — tenant "${tenantSlug}" not found or you do not belong to it`,
                },
                { status: 403 }
            ),
        };
    }

    return {
        ok: true,
        ctx: { user, supabase, tenantSlug, tenant },
    };
}

/**
 * Verifies auth + tenant + ensures the user has one of the allowed roles
 * in the tenant's `membership` table.
 *
 * @param allowedRoles - An array of role strings that are permitted.
 *
 * @example
 * ```ts
 * import { ADMIN_ALLOWED_ROLES } from '@/features/admin';
 *
 * export async function GET() {
 *   const result = await requireRole(ADMIN_ALLOWED_ROLES);
 *   if (!result.ok) return result.response;
 *   const { user, tenant, role } = result.ctx;
 * }
 * ```
 */
export async function requireRole(
    allowedRoles: readonly string[]
): Promise<RoleResult> {
    const tenantResult = await requireTenant();
    if (!tenantResult.ok) return tenantResult;

    const { user, supabase, tenantSlug, tenant } = tenantResult.ctx;

    const { data: membership, error: membershipError } = await supabase
        .from('membership')
        .select('role')
        .eq('user_id', user.id)
        .eq('tenant_id', tenant.id)
        .single();

    if (membershipError || !membership) {
        return {
            ok: false,
            response: NextResponse.json(
                { ok: false, error: 'Forbidden — you are not a member of this tenant' },
                { status: 403 }
            ),
        };
    }

    if (!allowedRoles.includes(membership.role)) {
        return {
            ok: false,
            response: NextResponse.json(
                {
                    ok: false,
                    error: `Forbidden — role "${membership.role}" is not allowed. Required: ${allowedRoles.join(' or ')}`,
                },
                { status: 403 }
            ),
        };
    }

    return {
        ok: true,
        ctx: { user, supabase, tenantSlug, tenant, role: membership.role },
    };
}
