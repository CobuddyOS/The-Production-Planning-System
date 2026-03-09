import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/api/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { TEAM_ROLE_VALUES, type TeamRoleValue } from '@/features/team/constants';

interface TeamMember {
    userId: string;
    email: string | null;
    name: string | null;
    role: string;
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

    const currentUserRole = currentMembership?.role ?? null;
    const canManage = currentUserRole === 'admin';

    // Fetch all memberships for this tenant joined with profile data.
    // This solves the N+1 query problem by getting everything in one go.
    const { data: memberships, error: membershipError } = await supabase
        .from('membership')
        .select(`
            user_id,
            role,
            profiles (
                email,
                full_name,
                created_at
            )
        `)
        .eq('tenant_id', tenant.id)
        .order('user_id', { ascending: true });

    if (membershipError) {
        return NextResponse.json(
            { ok: false, error: membershipError.message },
            { status: 500 }
        );
    }

    // Map the results into the TeamMember interface.
    // We filter out any memberships that might not have a profile (though our POST ensures they exist).
    const members: TeamMember[] = (memberships || [])
        .map((m: any) => ({
            userId: m.user_id,
            email: m.profiles?.email ?? null,
            name: m.profiles?.full_name ?? null,
            role: m.role,
            createdAt: m.profiles?.created_at ?? null,
        }));

    return NextResponse.json({
        ok: true,
        members,
        currentUserRole,
        canManage,
    });
}

export async function POST(req: Request) {
    const result = await (await import('@/lib/api/auth-guard')).requireRole(['admin']);
    if (!result.ok) return result.response;

    const { supabase, tenant } = result.ctx;

    const body = await req.json();
    const { name, email, password, role } = body as {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
    };

    if (!email || !password || !role) {
        return NextResponse.json(
            { ok: false, error: 'email, password and role are required' },
            { status: 400 }
        );
    }

    if (!TEAM_ROLE_VALUES.includes(role as TeamRoleValue)) {
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
            user_metadata:
                typeof name === 'string' && name.trim()
                    ? { full_name: name.trim() }
                    : undefined,
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

    // Insert profile row
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            email: email,
            full_name: name?.trim() || null,
        });

    if (profileError) {
        // Rollback: Delete the auth user if profile insertion fails
        await adminClient.auth.admin.deleteUser(userId);
        return NextResponse.json(
            { ok: false, error: `Failed to create profile: ${profileError.message}` },
            { status: 500 }
        );
    }

    // Insert membership row
    const { error: membershipInsertError } = await supabase
        .from('membership')
        .insert({
            user_id: userId,
            tenant_id: tenant.id,
            role,
        });

    if (membershipInsertError) {
        // Rollback: Delete the auth user if membership insertion fails
        await adminClient.auth.admin.deleteUser(userId);
        return NextResponse.json(
            { ok: false, error: `Failed to create membership: ${membershipInsertError.message}` },
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

