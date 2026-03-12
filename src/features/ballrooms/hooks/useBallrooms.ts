import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { extractSlugFromHostname } from "@/features/tenant";
import { AtlasBallroom } from "@/features/atlas/ballrooms/types";
import { TenantBallroom } from "../types";

export function useBallrooms() {
    const [catalog, setCatalog] = useState<AtlasBallroom[]>([]);
    const [ballrooms, setBallrooms] = useState<TenantBallroom[]>([]);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();

    const fetchTenantId = useCallback(async () => {
        try {
            const hostname = window.location.hostname;
            const slug = extractSlugFromHostname(hostname);

            if (!slug) return null;

            const { data: tenant, error } = await supabase
                .from('tenants')
                .select('id')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            setTenantId(tenant.id);
            return tenant.id;
        } catch (err: any) {
            console.error('Error fetching tenant ID:', err);
            return null;
        }
    }, [supabase]);

    const fetchCatalog = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('atlas_ballrooms')
                .select('*, atlas_ballroom_categories(name)')
                .eq('status', 'active')
                .order('name');

            if (error) throw error;
            setCatalog(data || []);
        } catch (err: any) {
            console.error('Error fetching ballroom catalog:', err);
            setError(err);
        }
    }, [supabase]);

    const fetchBallrooms = useCallback(async (currentTenantId: string) => {
        try {
            const { data, error } = await supabase
                .from('tenant_ballrooms')
                .select(`
                    *,
                    atlas_ballroom:atlas_ballrooms (*)
                `)
                .eq('tenant_id', currentTenantId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBallrooms(data || []);
        } catch (err: any) {
            console.error('Error fetching tenant ballrooms:', err);
        }
    }, [supabase]);

    const importBallroom = async (input: any) => {
        try {
            let currentTenantId = tenantId;
            if (!currentTenantId) {
                currentTenantId = await fetchTenantId();
                if (!currentTenantId) throw new Error("Could not resolve tenant identity");
            }

            const { data, error } = await supabase
                .from('tenant_ballrooms')
                .insert({
                    ...input,
                    tenant_id: currentTenantId,
                })
                .select()
                .single();

            if (error) throw error;

            if (currentTenantId) await fetchBallrooms(currentTenantId);

            return { success: true, data };
        } catch (err: any) {
            console.error('Error importing ballroom:', err);
            return { success: false, error: err };
        }
    };

    const updateBallroom = async (id: string, input: any) => {
        try {
            const { data, error } = await supabase
                .from('tenant_ballrooms')
                .update(input)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            if (tenantId) await fetchBallrooms(tenantId);
            return { success: true, data };
        } catch (err: any) {
            console.error('Error updating ballroom:', err);
            return { success: false, error: err };
        }
    };

    const deleteBallroom = async (id: string) => {
        try {
            const { error } = await supabase
                .from('tenant_ballrooms')
                .delete()
                .eq('id', id);

            if (error) throw error;
            if (tenantId) await fetchBallrooms(tenantId);
            return { success: true };
        } catch (err: any) {
            console.error('Error deleting ballroom:', err);
            return { success: false, error: err };
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const id = await fetchTenantId();
            await fetchCatalog();
            if (id) {
                await fetchBallrooms(id);
            }
            setLoading(false);
        };
        init();
    }, [fetchCatalog, fetchBallrooms, fetchTenantId]);

    return {
        catalog,
        ballrooms,
        tenantId,
        loading,
        error,
        refresh: async () => {
            await fetchCatalog();
            if (tenantId) await fetchBallrooms(tenantId);
        },
        importBallroom,
        updateBallroom,
        deleteBallroom,
    };
}
