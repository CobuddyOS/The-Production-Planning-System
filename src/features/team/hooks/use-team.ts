import { useState, useCallback, useEffect } from 'react';
import { TeamMember, TeamResponse, CreateMemberData } from '../types';
import { TeamRoleValue } from '../constants';
import { isValidUUID } from '@/lib/validation';

export function useTeam() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [canManage, setCanManage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Action loading states
    const [creating, setCreating] = useState(false);
    const [savingUserId, setSavingUserId] = useState<string | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    const loadTeam = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/team');
            const data: TeamResponse = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || 'Failed to load team');
                setMembers([]);
                setCanManage(false);
                return;
            }

            setMembers(data.members);
            setCanManage(data.canManage);
        } catch {
            setError('Network error while loading team');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTeam();
    }, [loadTeam]);

    // Auto-dismiss success after 4 seconds
    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(null), 4000);
        return () => clearTimeout(t);
    }, [success]);

    const addMember = async (data: CreateMemberData) => {
        setCreating(true);
        setError(null);
        try {
            const res = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name?.trim() || undefined,
                    email: data.email.trim(),
                    password: data.password,
                    role: data.role,
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.ok) {
                setError(result.error || 'Failed to create member');
                return false;
            }

            setSuccess('Team member added successfully.');
            await loadTeam();
            return true;
        } catch {
            setError('Network error while creating member');
            return false;
        } finally {
            setCreating(false);
        }
    };

    const updateRole = async (userId: string, role: TeamRoleValue) => {
        if (!isValidUUID(userId)) {
            setError('Invalid user ID');
            return;
        }

        setSavingUserId(userId);
        setError(null);

        try {
            const res = await fetch(`/api/team/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });

            const result = await res.json();

            if (!res.ok || !result.ok) {
                setError(result.error || 'Failed to update role');
                return;
            }

            setSuccess('Role updated successfully.');
            await loadTeam();
        } catch {
            setError('Network error while updating role');
        } finally {
            setSavingUserId(null);
        }
    };

    const removeMember = async (userId: string) => {
        if (!isValidUUID(userId)) {
            setError('Invalid user ID');
            return false;
        }

        setDeletingUserId(userId);
        setError(null);

        try {
            const res = await fetch(`/api/team/${userId}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok || !result.ok) {
                setError(result.error || 'Failed to remove member');
                return false;
            }

            setSuccess('Member removed from team.');
            await loadTeam();
            return true;
        } catch {
            setError('Network error while removing member');
            return false;
        } finally {
            setDeletingUserId(null);
        }
    };

    return {
        members,
        loading,
        canManage,
        error,
        success,
        states: {
            creating,
            savingUserId,
            deletingUserId
        },
        actions: {
            addMember,
            updateRole,
            removeMember,
            refresh: loadTeam,
            setError
        }
    };
}
