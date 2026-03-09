import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/api/auth-guard';
import { isValidUUID } from '@/lib/validation';
import { TEAM_ROLE_VALUES, type TeamRoleValue } from '@/features/team/constants';

type RouteParams = { params: Promise<{ userId: string }> | { userId: string } };

export async function PATCH(req: Request, { params }: RouteParams) {
    const result = await requireRole(['admin']);
    if (!result.ok) return result.response;

    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.userId;

    if (!isValidUUID(userId)) {
        return NextResponse.json(
            { ok: false, error: 'Invalid user ID' },
            { status: 400 }
        );
    }

    const { supabase, tenant } = result.ctx;

    const body = await req.json();
    const { role } = body as { role?: string };

    if (!role) {
        return NextResponse.json(
            { ok: false, error: 'role is required' },
            { status: 400 }
        );
    }

    if (!TEAM_ROLE_VALUES.includes(role as TeamRoleValue)) {
        return NextResponse.json(
            { ok: false, error: 'Invalid role' },
            { status: 400 }
        );
    }

    const { error } = await supabase
        .from('membership')
        .update({ role })
        .eq('user_id', userId)
        .eq('tenant_id', tenant.id);

    if (error) {
        return NextResponse.json(
            { ok: false, error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(_req: Request, { params }: RouteParams) {
    const result = await requireRole(['admin']);
    if (!result.ok) return result.response;

    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.userId;

    if (!isValidUUID(userId)) {
        return NextResponse.json(
            { ok: false, error: 'Invalid user ID' },
            { status: 400 }
        );
    }

    const { supabase, tenant } = result.ctx;

    const { error } = await supabase
        .from('membership')
        .delete()
        .eq('user_id', userId)
        .eq('tenant_id', tenant.id);

    if (error) {
        return NextResponse.json(
            { ok: false, error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}
