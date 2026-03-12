import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AtlasAsset } from "../types";

export function useAtlasAssets() {
    const [assets, setAssets] = useState<AtlasAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();

    const fetchAssets = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('atlas_assets')
                .select('*, atlas_categories(name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAssets(data || []);
        } catch (err: any) {
            console.error('Error fetching assets:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const deleteAsset = async (id: string) => {
        try {
            // First get the asset to see if we should delete the image from storage
            const { data: asset } = await supabase
                .from('atlas_assets')
                .select('image')
                .eq('id', id)
                .single();

            const { error: deleteError } = await supabase
                .from('atlas_assets')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            // Optional: If image is a storage URL, delete it. 
            // For now, focusing on database deletion.

            await fetchAssets();
            return { success: true };
        } catch (err: any) {
            console.error('Error deleting asset:', err);
            return { success: false, error: err };
        }
    };

    return {
        assets,
        loading,
        error,
        refresh: fetchAssets,
        deleteAsset,
    };
}
