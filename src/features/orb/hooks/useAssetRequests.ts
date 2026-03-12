import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AssetRequest } from "../types";

export function useAssetRequests() {
    const [requests, setRequests] = useState<AssetRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("warehouse_items")
                .select(`*, tenant:tenants (*), asset:atlas_assets (*)`)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRequests((data as AssetRequest[]) || []);
        } catch (err: unknown) {
            console.error("Error fetching asset requests:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    const updateStatus = async (id: string, status: "approved" | "rejected") => {
        try {
            const { error } = await supabase
                .from("warehouse_items")
                .update({ approval_status: status })
                .eq("id", id);

            if (error) throw error;
            await fetchRequests();
            return { success: true };
        } catch (err: unknown) {
            console.error("Error updating asset request status:", err);
            return { success: false, error: err };
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return { requests, loading, error, refresh: fetchRequests, updateStatus };
}
