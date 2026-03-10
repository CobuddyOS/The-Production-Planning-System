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
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2Icon, Trash2Icon, PlusIcon } from 'lucide-react';
import { TEAM_ROLES, getRoleLabel, type TeamRoleValue } from '../constants';
import { TeamMember } from '../types';

interface TeamTableProps {
    members: TeamMember[];
    loading: boolean;
    canManage: boolean;
    savingUserId: string | null;
    deletingUserId: string | null;
    onRoleChange: (userId: string, role: TeamRoleValue) => void;
    onRemoveClick: (member: TeamMember) => void;
    onAddClick: () => void;
}

export function TeamTable({
    members,
    loading,
    canManage,
    savingUserId,
    deletingUserId,
    onRoleChange,
    onRemoveClick,
    onAddClick,
}: TeamTableProps) {
    if (loading) {
        return (
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
                        {canManage && <Skeleton className="h-8 w-10" />}
                    </div>
                ))}
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                <p className="text-muted-foreground">No team members yet.</p>
                {canManage && (
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={onAddClick}
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add your first member
                    </Button>
                )}
            </div>
        );
    }

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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    {canManage && <TableHead className="w-[80px]">Actions</TableHead>}
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
                                        onRoleChange(
                                            member.userId,
                                            e.target.value as TeamRoleValue
                                        )
                                    }
                                    disabled={savingUserId === member.userId}
                                >
                                    {TEAM_ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                    {!TEAM_ROLES.some((r) => r.value === member.role) && (
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
                                ? new Date(member.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : '—'}
                        </TableCell>
                        {canManage && (
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => onRemoveClick(member)}
                                    disabled={deletingUserId === member.userId}
                                >
                                    {deletingUserId === member.userId ? (
                                        <Loader2Icon className="size-4 animate-spin" />
                                    ) : (
                                        <Trash2Icon className="size-4" />
                                    )}
                                </Button>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
