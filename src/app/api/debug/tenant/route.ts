import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
    const headerList = await headers();
    const host = headerList.get('host') || '';

    // Extract slug using logic from proxy.ts
    const parts = host.split('.');
    let tenant_slug = '';
    if (parts.length > 2 || (parts.length === 2 && !host.includes('localhost'))) {
        tenant_slug = parts[0];
    }

    // Fallback to header if already set by proxy/middleware
    tenant_slug = headerList.get('x-tenant-slug') || tenant_slug;

    let tenant_id = null;
    let tenant_name = null;

    if (tenant_slug) {
        const { data, error } = await supabase
            .from('tenants')
            .select('id, name')
            .eq('slug', tenant_slug)
            .single();

        if (data) {
            tenant_id = data.id;
            tenant_name = data.name;
        }
    }

    return NextResponse.json({
        host,
        tenant_slug,
        tenant_id,
        tenant_name,
        status: tenant_id ? 'found' : 'not_found'
    });
}
