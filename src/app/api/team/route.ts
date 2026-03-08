import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/api/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';

type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

interface TeamMember {
    userId: string;
    email: string | null;
    name: string | null;
    role: MemberRole;
    createdAt: string | null;
}

export async function GET() {
    const tenantResult = await requireTenant();
    if (!tenantResult.ok) return tenantResult.response;

    const { supabase, tenant, user } = tenantResult.ctx;

    // Fetch current user's role in this tenant for UI permissions.
    const { data: currentMembership } = await supabase
        .from('membership')
        .select('role')
        .eq('user_id', user.id)
        .eq('tenant_id', tenant.id)
        .single();

    const currentUserRole = (currentMembership?.role ?? null) as MemberRole | null;
    const canManage = currentUserRole === 'admin';

    // Fetch all memberships for this tenant.
    const { data: memberships, error: membershipError } = await supabase
        .from('membership')
        .select('user_id, role')
        .eq('tenant_id', tenant.id)
        .order('user_id', { ascending: true });

    if (membershipError) {
        return NextResponse.json(
            { ok: false, error: membershipError.message },
            { status: 500 }
        );
    }

    const adminClient = createAdminClient();

    const members: TeamMember[] = [];

    for (const membership of memberships || []) {
        const { data, error } = await adminClient.auth.admin.getUserById(
            membership.user_id
        );

        if (error) {
            // Skip users that cannot be loaded, but continue building the list.
            continue;
        }

        const u = data.user;

        members.push({
            userId: u.id,
            email: u.email,
            name:
                (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) ||
                (u.email ? u.email.split('@')[0] : null),
            role: membership.role as MemberRole,
            createdAt: u.created_at ?? null,
        });
    }

    return NextResponse.json({
        ok: true,
        members,
        currentUserRole,
        canManage,
    });
}

export async function POST(req: Request) {
    const { ok, ctx, response } = await (async () => {
        const result = await import('@/lib/api/auth-guard').then((m) =>
            m.requireRole(['admin'])
        );
        if (!result.ok) return { ok: false as const, response: result.response, ctx: null };
        return { ok: true as const, response: null, ctx: result.ctx };
    })();

    if (!ok || !ctx) return response!;

    const { supabase, tenant } = ctx;

    const body = await req.json();
    const { email, password, role } = body as {
        email?: string;
        password?: string;
        role?: MemberRole;
    };

    if (!email || !password || !role) {
        return NextResponse.json(
            { ok: false, error: 'email, password and role are required' },
            { status: 400 }
        );
    }

    if (!['owner', 'admin', 'editor', 'viewer'].includes(role)) {
        return NextResponse.json(
            { ok: false, error: 'Invalid role' },
            { status: 400 }
        );
    }

    const adminClient = createAdminClient();

    const { data: created, error: createError } =
        await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

    if (createError || !created.user) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    createError?.message ||
                    'Failed to create user. Make sure the email is not already in use.',
            },
            { status: 400 }
        );
    }

    const userId = created.user.id;

    const { error: membershipInsertError } = await supabase
        .from('membership')
        .insert({
            user_id: userId,
            tenant_id: tenant.id,
            role,
        });

    if (membershipInsertError) {
        return NextResponse.json(
            { ok: false, error: membershipInsertError.message },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            ok: true,
            userId,
        },
        { status: 201 }
    );
}

