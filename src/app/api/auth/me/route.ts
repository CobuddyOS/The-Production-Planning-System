import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/api/auth-guard";

export async function GET() {
    const tenantResult = await requireTenant();
    if (!tenantResult.ok) return tenantResult.response;

    const { user, supabase, tenant } = tenantResult.ctx;

    const { data: membership, error } = await supabase
        .from("membership")
        .select("role")
        .eq("user_id", user.id)
        .eq("tenant_id", tenant.id)
        .single();

    if (error || !membership?.role) {
        return NextResponse.json(
            { ok: false, error: "Forbidden — you are not a member of this tenant" },
            { status: 403 }
        );
    }

    return NextResponse.json({ ok: true, role: membership.role });
}

