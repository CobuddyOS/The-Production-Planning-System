import { headers } from 'next/headers';
import SignupClient from './SignupClient';

export default async function SignupPage() {
    const headersList = await headers();
    const tenantUrl = headersList.get('x-tenant-url') || 'http://localhost:3000';

    return <SignupClient tenantUrl={tenantUrl} />;
}
