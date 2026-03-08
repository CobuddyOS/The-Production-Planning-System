/**
 * Tenant slug extraction utility.
 * 
 * Centralized logic for extracting tenant slug from hostname.
 * Used by middleware, API routes, and client-side components.
 */

/**
 * Extracts the tenant slug from a hostname string.
 *
 * Local dev:  tenant-a.localhost:3000 → parts = ['tenant-a','localhost:3000'] → slug
 * Production: tennanta.cobuddy.net   → parts = ['tennanta','cobuddy','net']  → slug
 * Root:       cobuddy.net            → parts = ['cobuddy','net']             → '' (no slug)
 * Root:       localhost:3000          → parts = ['localhost:3000']            → '' (no slug)
 *
 * @example
 * extractSlugFromHostname('tenant-a.localhost:3000') // 'tenant-a'
 * extractSlugFromHostname('tennanta.cobuddy.net')    // 'tennanta'
 * extractSlugFromHostname('cobuddy.net')             // ''
 * extractSlugFromHostname('localhost:3000')           // ''
 */
export function extractSlugFromHostname(hostname: string): string {
    // Strip port if present (e.g., tenant-a.localhost:3000 -> tenant-a.localhost)
    const cleanHost = hostname.split(':')[0];
    const parts = cleanHost.split('.');

    if (cleanHost.includes('localhost')) {
        // Local dev: tenant-a.localhost -> 2 parts -> slug is parts[0]
        //            localhost          -> 1 part  -> no slug
        return parts.length > 1 ? parts[0] : '';
    }

    // Production: tennanta.cobuddy.net -> 3 parts -> slug is parts[0]
    //             cobuddy.net         -> 2 parts -> root domain, no slug
    return parts.length > 2 ? parts[0] : '';
}

/**
 * Extracts the tenant slug from request headers.
 * Falls back to hostname-based extraction if the x-tenant-slug header is not set.
 */
export function getSlugFromHeaders(headers: { get: (name: string) => string | null }): string {
    const headerSlug = headers.get('x-tenant-slug');
    if (headerSlug) return headerSlug;

    const host = headers.get('host') || '';
    return extractSlugFromHostname(host);
}
