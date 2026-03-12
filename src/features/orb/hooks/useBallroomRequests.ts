import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { BallroomRequest } from "../types";

export function useBallroomRequests() {
    const [requests, setRequests] = useState<BallroomRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const supabase = createClient();

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("tenant_ballrooms")
                .select(`*, tenant:tenants (*), atlas_ballroom:atlas_ballrooms (*)`)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRequests((data as BallroomRequest[]) || []);
        } catch (err: unknown) {
            console.error("Error fetching ballroom requests:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    const updateStatus = async (id: string, status: "approved" | "rejected") => {
        try {
            const { error } = await supabase
                .from("tenant_ballrooms")
                .update({ status })
                .eq("id", id);

            if (error) throw error;
            await fetchRequests();
            return { success: true };
        } catch (err: unknown) {
            console.error("Error updating ballroom request status:", err);
            return { success: false, error: err };
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return { requests, loading, error, refresh: fetchRequests, updateStatus };
}
