export interface Tenant {
    id: string;
    slug: string;
    status: 'active' | 'suspended' | 'deleted';
    name: string;
}

/**
 * Resolves a tenant by its slug.
 * In a real-world scenario, this would fetch from a database or a cached store.
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
    // Mocking the database for Milestone 1 (Foundation Proof)
    const mockTenants: Record<string, Tenant> = {
        'tenant-a': { id: 't1', slug: 'tenant-a', status: 'active', name: 'Tenant A' },
        'tenant-b': { id: 't2', slug: 'tenant-b', status: 'active', name: 'Tenant B' },
    };

    return mockTenants[slug] || null;
}
