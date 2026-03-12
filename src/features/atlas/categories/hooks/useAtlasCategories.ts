import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AtlasCategory } from "../types";

export function useAtlasCategories() {
    const [categories, setCategories] = useState<AtlasCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('atlas_categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setCategories(data || []);
        } catch (err: any) {
            console.error('Error fetching categories:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const deleteCategory = async (id: string) => {
        try {
            const { error } = await supabase
                .from('atlas_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchCategories();
            return { success: true };
        } catch (err: any) {
            console.error('Error deleting category:', err);
            return { success: false, error: err };
        }
    };

    return {
        categories,
        loading,
        error,
        refresh: fetchCategories,
        deleteCategory,
    };
}
