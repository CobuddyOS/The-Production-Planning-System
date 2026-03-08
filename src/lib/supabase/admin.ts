import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client.
 *
 * Uses the service role key and MUST only be imported in server-side
 * contexts (Route Handlers, Server Actions, etc.). Never import this
 * into Client Components or send the key to the browser.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(url, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

