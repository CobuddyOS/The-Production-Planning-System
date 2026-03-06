/**
 * Tenant slug extraction utility.
 * 
 * Centralized logic for extracting tenant slug from hostname.
 * Used by middleware, API routes, and client-side components.
 */

/**
 * Extracts the tenant slug from a hostname string.
 * 
 * @example
 * extractSlugFromHostname('tenant-a.localhost:3000') // 'tenant-a'
 * extractSlugFromHostname('tennanta.cobuddy.net')    // 'tennanta'
 * extractSlugFromHostname('localhost:3000')           // ''
 */
export function extractSlugFromHostname(hostname: string): string {
    const parts = hostname.split('.');

    if (!hostname.includes('localhost')) {
        // Production: tennanta.cobuddy.net → 'tennanta'
        if (parts.length > 1) {
            return parts[0];
        }
    } else if (parts.length > 1) {
        // Local dev: tennanta.localhost:3000 → 'tennanta'
        return parts[0];
    }

    return '';
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
