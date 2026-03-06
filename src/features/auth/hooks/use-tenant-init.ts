'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { extractSlugFromHostname } from '@/features/tenant';
import type { TenantInfo } from '@/features/tenant';

/**
 * Hook to auto-detect the tenant from the current subdomain.
 * 
 * On mount:
 * 1. Checks for an existing session — redirects if logged in
 * 2. Extracts tenant slug from hostname
 * 3. Fetches tenant info via Supabase RPC
 * 4. Redirects to 404 if slug exists but is invalid
 */
export function useTenantInit() {
    const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            // 1. Check existing session
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/debug/user');
                return;
            }

            // 2. Extract slug from subdomain using centralized utility
            const hostname = window.location.hostname;
            const slug = extractSlugFromHostname(hostname);

            if (!slug) {
                console.warn('No tenant slug found in subdomain');
                setLoading(false);
                return;
            }

            // 3. Fetch tenant info via RPC
            const { data, error: rpcError } = await supabase
                .rpc('get_public_tenant_info', { lookup_slug: slug });

            if (rpcError || !data) {
                console.error('Failed to fetch tenant info:', rpcError);
                router.push('/404');
                return;
            }

            // 4. Store tenant info
            setTenantInfo({
                id: data.id,
                name: data.name
            });
            setLoading(false);
        };

        initializeAuth();
    }, [router]);

    return { tenantInfo, loading };
}
