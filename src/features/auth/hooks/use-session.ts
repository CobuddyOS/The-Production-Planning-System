'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook to track the current Supabase auth session.
 * Subscribes to auth state changes and auto-updates.
 */
export function useSession() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { session, loading };
}
