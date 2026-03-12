import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AtlasBundle } from "../types";

export function useAtlasBundles() {
    const [bundles, setBundles] = useState<AtlasBundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();

    const fetchBundles = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('atlas_bundles')
                .select(`
                    *,
                    items:atlas_bundle_items (
                        *,
                        asset:atlas_assets (*)
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBundles(data || []);
        } catch (err: any) {
            console.error('Error fetching bundles:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchBundles();
    }, [fetchBundles]);

    const deleteBundle = async (id: string) => {
        try {
            const { error } = await supabase
                .from('atlas_bundles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchBundles();
            return { success: true };
        } catch (err: any) {
            console.error('Error deleting bundle:', err);
            return { success: false, error: err };
        }
    };

    return {
        bundles,
        loading,
        error,
        refresh: fetchBundles,
        deleteBundle,
    };
}
