'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { TenantInfo } from '@/features/tenant';

export interface SignupFormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UseSignupOptions {
    tenantInfo: TenantInfo | null;
    tenantUrl: string;
}

export interface UseSignupReturn {
    formData: SignupFormData;
    setField: (field: keyof SignupFormData, value: string) => void;
    loading: boolean;
    error: string | null;
    success: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Hook to manage the signup form state and submission.
 * 
 * Handles:
 * - Form field state management
 * - Supabase signUp call with tenant metadata
 * - Loading, error, and success states
 */
export function useSignup({ tenantInfo, tenantUrl }: UseSignupOptions): UseSignupReturn {
    const [formData, setFormData] = useState<SignupFormData>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const setField = (field: keyof SignupFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    tenant_id: tenantInfo?.id,
                },
                emailRedirectTo: `${tenantUrl}/`,
            },
        });

        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
        } else {
            setSuccess(true);
        }
    };

    return { formData, setField, loading, error, success, handleSubmit };
}
