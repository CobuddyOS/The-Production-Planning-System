import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in Client Components (browser).
 *
 * Uses `createBrowserClient` from @supabase/ssr which automatically
 * manages cookies for session persistence. Call this function per-usage
 * rather than storing it as a module-level singleton — the SSR package
 * handles deduplication internally.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    );
}
