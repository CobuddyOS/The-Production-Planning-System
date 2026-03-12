import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { extractSlugFromHostname } from "@/features/tenant";
import { AtlasAsset } from "@/features/atlas/assets/types";
import { WarehouseItem, ImportAssetInput } from "../types";

export function useInventory() {
    const [catalog, setCatalog] = useState<AtlasAsset[]>([]);
    const [inventory, setInventory] = useState<WarehouseItem[]>([]);
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
            setLoading(true);
            const { data, error } = await supabase
                .from('atlas_assets')
                .select('*, atlas_categories(name)')
                .eq('status', 'active')
                .order('name');

            if (error) throw error;
            setCatalog(data || []);
        } catch (err: any) {
            console.error('Error fetching catalog:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    const fetchInventory = useCallback(async (currentTenantId: string) => {
        try {
            const { data, error } = await supabase
                .from('warehouse_items')
                .select(`
                    *,
                    asset:atlas_assets (*)
                `)
                .eq('tenant_id', currentTenantId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInventory(data || []);
        } catch (err: any) {
            console.error('Error fetching inventory:', err);
        }
    }, [supabase]);

    const importAsset = async (input: ImportAssetInput) => {
        try {
            if (!tenantId) {
                const id = await fetchTenantId();
                if (!id) throw new Error("Could not resolve tenant identity");
            }

            const { data, error } = await supabase
                .from('warehouse_items')
                .insert({
                    ...input,
                    tenant_id: tenantId,
                })
                .select()
                .single();

            if (error) throw error;

            // Refresh inventory
            if (tenantId) await fetchInventory(tenantId);

            return { success: true, data };
        } catch (err: any) {
            console.error('Error importing asset:', err);
            return { success: false, error: err };
        }
    };

    const updateItem = async (id: string, input: Partial<ImportAssetInput>) => {
        try {
            const { data, error } = await supabase
                .from('warehouse_items')
                .update(input)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            if (tenantId) await fetchInventory(tenantId);
            return { success: true, data };
        } catch (err: any) {
            console.error('Error updating inventory item:', err);
            return { success: false, error: err };
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const { error } = await supabase
                .from('warehouse_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            if (tenantId) await fetchInventory(tenantId);
            return { success: true };
        } catch (err: any) {
            console.error('Error deleting inventory item:', err);
            return { success: false, error: err };
        }
    };


    useEffect(() => {
        const init = async () => {
            const id = await fetchTenantId();
            await fetchCatalog();
            if (id) {
                await fetchInventory(id);
            }
        };
        init();
    }, [fetchCatalog, fetchInventory, fetchTenantId]);

    return {
        catalog,
        inventory,
        tenantId,
        loading,
        error,
        refresh: async () => {
            await fetchCatalog();
            if (tenantId) await fetchInventory(tenantId);
        },
        importAsset,
        updateItem,
        deleteItem,
    };

}
