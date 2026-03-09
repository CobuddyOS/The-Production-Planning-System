'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    TEAM_ROLES,
    getRoleLabel,
    type TeamRoleValue,
} from '@/features/team/constants';
import { PlusIcon, Loader2Icon, Trash2Icon } from 'lucide-react';
import { isValidUUID } from '@/lib/validation';

interface TeamMember {
    userId: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: string | null;
}

interface TeamResponse {
    ok: boolean;
    members: TeamMember[];
    currentUserRole: string | null;
    canManage: boolean;
    error?: string;
}

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [canManage, setCanManage] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
    const [creating, setCreating] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createEmail, setCreateEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [createRole, setCreateRole] = useState<TeamRoleValue>('sales');
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canManage) return;

        setCreating(true);
        setError(null);

        try {
            const res = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: createName.trim() || undefined,
                    email: createEmail.trim(),
                    password: createPassword,
                    role: createRole,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || 'Failed to create member');
                return;
            }

            setCreateName('');
            setCreateEmail('');
            setCreatePassword('');
            setCreateRole('sales');
            setAddDialogOpen(false);
            setSuccess('Team member added successfully.');
            await loadTeam();
        } catch {
            setError('Network error while creating member');
        } finally {
            setCreating(false);
        }
    };

    const handleRoleChange = async (userId: string, role: TeamRoleValue) => {
        if (!canManage) return;
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

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || 'Failed to update role');
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

    const openRemoveConfirm = (member: TeamMember) => {
        if (!isValidUUID(member.userId)) return;
        setMemberToRemove(member);
    };

    const handleConfirmRemove = async () => {
        if (!canManage || !memberToRemove) return;
        const userId = memberToRemove.userId;
        if (!isValidUUID(userId)) {
            setError('Invalid user ID');
            setMemberToRemove(null);
            return;
        }

        setDeletingUserId(userId);
        setError(null);

        try {
            const res = await fetch(`/api/team/${userId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || 'Failed to remove member');
                return;
            }

            setMemberToRemove(null);
            setSuccess(`${memberToRemove.name || memberToRemove.email || 'Member'} removed from team.`);
            await loadTeam();
        } catch {
            setError('Network error while removing member');
        } finally {
            setDeletingUserId(null);
        }
    };

    const renderRoleBadge = (role: string) => {
        const variant =
            role === 'admin'
                ? 'default'
                : role === 'warehouse_manager'
                  ? 'secondary'
                  : 'outline';

        return <Badge variant={variant}>{getRoleLabel(role)}</Badge>;
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Team</h2>
                    <p className="text-muted-foreground">
                        Manage your team members and roles for this tenant.
                    </p>
                </div>
                {canManage && (
                    <Button onClick={() => setAddDialogOpen(true)} size="lg">
                        <PlusIcon />
                        Add team member
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Directory</CardTitle>
                    <CardDescription>
                        A list of all members in this tenant.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-200">
                            {success}
                        </div>
                    )}

                    {loading ? (
                        <div className="space-y-3">
                            <div className="flex gap-4">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-20" />
                            </div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex gap-4 py-2">
                                    <Skeleton className="h-8 flex-1" />
                                    <Skeleton className="h-8 flex-1" />
                                    <Skeleton className="h-8 w-28" />
                                    <Skeleton className="h-8 w-24" />
                                    {canManage && (
                                        <Skeleton className="h-8 w-10" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                            <p className="text-muted-foreground">
                                No team members yet.
                            </p>
                            {canManage && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => setAddDialogOpen(true)}
                                >
                                    <PlusIcon />
                                    Add your first member
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    {canManage && (
                                        <TableHead className="w-[80px]">
                                            Actions
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.userId}>
                                        <TableCell className="font-medium">
                                            {member.name || '—'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {member.email || '—'}
                                        </TableCell>
                                        <TableCell>
                                            {canManage ? (
                                                <select
                                                    className="h-8 min-w-[140px] rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                                    value={member.role}
                                                    onChange={(e) =>
                                                        handleRoleChange(
                                                            member.userId,
                                                            e.target.value as TeamRoleValue
                                                        )
                                                    }
                                                    disabled={
                                                        savingUserId ===
                                                        member.userId
                                                    }
                                                >
                                                    {TEAM_ROLES.map((r) => (
                                                        <option
                                                            key={r.value}
                                                            value={r.value}
                                                        >
                                                            {r.label}
                                                        </option>
                                                    ))}
                                                    {!TEAM_ROLES.some(
                                                        (r) => r.value === member.role
                                                    ) && (
                                                        <option value={member.role}>
                                                            {getRoleLabel(member.role)}
                                                        </option>
                                                    )}
                                                </select>
                                            ) : (
                                                renderRoleBadge(member.role)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {member.createdAt
                                                ? new Date(
                                                      member.createdAt
                                                  ).toLocaleDateString(
                                                      undefined,
                                                      {
                                                          year: 'numeric',
                                                          month: 'short',
                                                          day: 'numeric',
                                                      }
                                                  )
                                                : '—'}
                                        </TableCell>
                                        {canManage && (
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() =>
                                                        openRemoveConfirm(member)
                                                    }
                                                    disabled={
                                                        deletingUserId ===
                                                        member.userId
                                                    }
                                                >
                                                    {deletingUserId ===
                                                    member.userId ? (
                                                        <Loader2Icon className="size-4 animate-spin" />
                                                    ) : (
                                                        <Trash2Icon className="size-4" />
                                                    )}
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add member dialog (centred popup) */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent showCloseButton className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add team member</DialogTitle>
                        <DialogDescription>
                            Create a new user and add them to this tenant. They
                            will receive access based on the role you select.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleCreate}
                        className="mt-4 flex flex-col gap-4"
                    >
                        <div className="space-y-2">
                            <label
                                htmlFor="add-name"
                                className="text-sm font-medium"
                            >
                                Name
                            </label>
                            <Input
                                id="add-name"
                                placeholder="Jane Doe"
                                value={createName}
                                onChange={(e) =>
                                    setCreateName(e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="add-email"
                                className="text-sm font-medium"
                            >
                                Email
                            </label>
                            <Input
                                id="add-email"
                                type="email"
                                placeholder="jane@example.com"
                                value={createEmail}
                                onChange={(e) =>
                                    setCreateEmail(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="add-password"
                                className="text-sm font-medium"
                            >
                                Password
                            </label>
                            <Input
                                id="add-password"
                                type="password"
                                placeholder="••••••••"
                                value={createPassword}
                                onChange={(e) =>
                                    setCreatePassword(e.target.value)
                                }
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                They can change this after first login.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="add-role"
                                className="text-sm font-medium"
                            >
                                Role
                            </label>
                            <select
                                id="add-role"
                                className="h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={createRole}
                                onChange={(e) =>
                                    setCreateRole(
                                        e.target.value as TeamRoleValue
                                    )
                                }
                            >
                                {TEAM_ROLES.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <DialogFooter className="mt-4 gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAddDialogOpen(false)}
                                disabled={creating}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={creating}>
                                {creating ? (
                                    <>
                                        <Loader2Icon className="size-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Add member'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Remove confirmation dialog */}
            <Dialog
                open={!!memberToRemove}
                onOpenChange={(open) => !open && setMemberToRemove(null)}
            >
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <DialogTitle>Remove team member</DialogTitle>
                        <DialogDescription>
                            {memberToRemove
                                ? `Are you sure you want to remove ${memberToRemove.name || memberToRemove.email || 'this member'} from the team? They will lose access to this tenant.`
                                : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setMemberToRemove(null)}
                            disabled={!!deletingUserId}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmRemove}
                            disabled={!!deletingUserId}
                        >
                            {deletingUserId ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Removing...
                                </>
                            ) : (
                                'Remove'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
