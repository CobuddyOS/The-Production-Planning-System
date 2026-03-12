import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AtlasBallroom } from "../types";

export function useAtlasBallrooms() {
    const [ballrooms, setBallrooms] = useState<AtlasBallroom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();

    const fetchBallrooms = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('atlas_ballrooms')
                .select(`
                    *,
                    atlas_ballroom_categories (
                        id,
                        name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBallrooms(data || []);
        } catch (err: any) {
            console.error('Error fetching ballrooms:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchBallrooms();
    }, [fetchBallrooms]);

    const deleteBallroom = async (id: string) => {
        try {
            const { error } = await supabase
                .from('atlas_ballrooms')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchBallrooms();
            return { success: true };
        } catch (err: any) {
            console.error('Error deleting ballroom:', err);
            return { success: false, error: err };
        }
    };

    return {
        ballrooms,
        loading,
        error,
        refresh: fetchBallrooms,
        deleteBallroom,
    };
}
