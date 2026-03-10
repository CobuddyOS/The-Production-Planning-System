'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

import { useTeam } from '@/features/team/hooks/use-team';
import { TeamTable } from '@/features/team/components/team-table';
import { AddMemberDialog } from '@/features/team/components/add-member-dialog';
import { RemoveMemberDialog } from '@/features/team/components/remove-member-dialog';
import { TeamMember } from '@/features/team/types';

export default function TeamPage() {
    const {
        members,
        loading,
        canManage,
        error,
        success,
        states,
        actions
    } = useTeam();

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

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
                        <PlusIcon className="mr-2 h-4 w-4" />
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

                    <TeamTable
                        members={members}
                        loading={loading}
                        canManage={canManage}
                        savingUserId={states.savingUserId}
                        deletingUserId={states.deletingUserId}
                        onRoleChange={actions.updateRole}
                        onRemoveClick={setMemberToRemove}
                        onAddClick={() => setAddDialogOpen(true)}
                    />
                </CardContent>
            </Card>

            <AddMemberDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onConfirm={actions.addMember}
                creating={states.creating}
            />

            <RemoveMemberDialog
                member={memberToRemove}
                onClose={() => setMemberToRemove(null)}
                onConfirm={async () => {
                    if (memberToRemove) {
                        const success = await actions.removeMember(memberToRemove.userId);
                        if (success) setMemberToRemove(null);
                    }
                }}
                deleting={!!states.deletingUserId}
            />
        </div>
    );
}
