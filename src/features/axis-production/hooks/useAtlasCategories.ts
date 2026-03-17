import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type AtlasCategory = {
    id: string;
    name: string;
};

export function useAtlasCategories() {
    const [categories, setCategories] = useState<AtlasCategory[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true);
            const { data } = await supabase
                .from("atlas_categories")
                .select("id, name")
                .eq("status", "active")
                .order("name");

            if (data) {
                setCategories(data);
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
