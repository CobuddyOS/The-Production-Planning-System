import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/api/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { isValidUUID } from '@/lib/validation';
import { TEAM_ROLE_VALUES, type TeamRoleValue } from '@/features/team/constants';

// Cleaned up Next.js 15+ params typing
type RouteParams = { params: Promise<{ userId: string }> };

export async function PATCH(req: Request, { params }: RouteParams) {
    const result = await requireRole(['admin']);
    if (!result.ok) return result.response;

    const { userId } = await params;

    if (!isValidUUID(userId)) {
        return NextResponse.json({ ok: false, error: 'Invalid user ID' }, { status: 400 });
    }

    const { supabase, tenant, user } = result.ctx;

    // 1. Self-Sabotage Prevention
    if (userId === user.id) {
        return NextResponse.json(
            { ok: false, error: 'You cannot change your own role.' },
            { status: 403 }
        );
    }

    // 2. Safe JSON Parsing
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { role } = body as { role?: string };

    if (!role) {
        return NextResponse.json({ ok: false, error: 'Role is required' }, { status: 400 });
    }

    if (!TEAM_ROLE_VALUES.includes(role as TeamRoleValue)) {
        return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
        .from('membership')
        .update({ role })
        .eq('user_id', userId)
        .eq('tenant_id', tenant.id);

    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(_req: Request, { params }: RouteParams) {
    const result = await requireRole(['admin']);
    if (!result.ok) return result.response;

    const { userId } = await params;

    if (!isValidUUID(userId)) {
        return NextResponse.json({ ok: false, error: 'Invalid user ID' }, { status: 400 });
    }

    const { tenant, user } = result.ctx;

    // 1. Self-Sabotage Prevention
    if (userId === user.id) {
        return NextResponse.json(
            { ok: false, error: 'You cannot remove yourself from the team.' },
            { status: 403 }
        );
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
        .from('membership')
        .delete()
        .eq('user_id', userId)
        .eq('tenant_id', tenant.id);

    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
}