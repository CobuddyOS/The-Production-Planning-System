import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/api/auth-guard';

type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

export async function PATCH(
    req: Request,
    { params }: { params: { userId: string } }
) {
    const result = await requireRole(['admin']);
    if (!result.ok) return result.response;

    const { supabase, tenant } = result.ctx;
    const { userId } = params;

    const body = await req.json();
    const { role } = body as { role?: MemberRole };

    if (!role) {
        return NextResponse.json(
            { ok: false, error: 'role is required' },
            { status: 400 }
        );
    }

    if (!['owner', 'admin', 'editor', 'viewer'].includes(role)) {
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

export async function DELETE(
    _req: Request,
    { params }: { params: { userId: string } }
) {
    const result = await requireRole(['admin']);
    if (!result.ok) return result.response;

    const { supabase, tenant } = result.ctx;
    const { userId } = params;

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

