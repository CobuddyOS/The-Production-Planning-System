import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type AtlasCategory = {
    id: string;
    name: string;
    icon_url: string | null;
    sort_order: number;
};

export function useAtlasCategories() {
    const [categories, setCategories] = useState<AtlasCategory[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true);
            const { data, error } = await supabase
                .from("atlas_categories")
                .select("id, name, icon_url, sort_order")
                .eq("status", "active")
                .order("sort_order", { ascending: true });

            if (error) {
                console.error("Atlas Categories Fetch Error:", error);
                // Try fetching without active filter as fallback for diagnostic
                const { data: allData } = await supabase
                    .from("atlas_categories")
                    .select("id, name, icon_url, sort_order")
                    .order("sort_order", { ascending: true });
                if (allData) setCategories(allData as AtlasCategory[]);
            } else if (data) {
                setCategories(data as AtlasCategory[]);
                if (data.length > 0) {
                    setActiveCategoryId(data[0].id);
                }
            }
            setLoading(false);
        }
        fetchCategories();
    }, []);

    return { categories, activeCategoryId, setActiveCategoryId, loading };
}
