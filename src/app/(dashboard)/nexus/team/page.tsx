'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MemberRole = "owner" | "admin" | "editor" | "viewer";

interface TeamMember {
    userId: string;
    name: string | null;
    email: string | null;
    role: MemberRole;
    createdAt: string | null;
}

interface TeamResponse {
    ok: boolean;
    members: TeamMember[];
    currentUserRole: MemberRole | null;
    canManage: boolean;
    error?: string;
}

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [canManage, setCanManage] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createEmail, setCreateEmail] = useState("");
    const [createPassword, setCreatePassword] = useState("");
    const [createRole, setCreateRole] = useState<MemberRole>("viewer");
    const [savingUserId, setSavingUserId] = useState<string | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    const loadTeam = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/team");
            const data: TeamResponse = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || "Failed to load team");
                setMembers([]);
                setCanManage(false);
                return;
            }

            setMembers(data.members);
            setCanManage(data.canManage);
        } catch {
            setError("Network error while loading team");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeam();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canManage) return;

        setCreating(true);
        setError(null);

        try {
            const res = await fetch("/api/team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: createEmail,
                    password: createPassword,
                    role: createRole,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || "Failed to create member");
                return;
            }

            setCreateEmail("");
            setCreatePassword("");
            setCreateRole("viewer");
            await loadTeam();
        } catch {
            setError("Network error while creating member");
        } finally {
            setCreating(false);
        }
    };

    const handleRoleChange = async (userId: string, role: MemberRole) => {
        if (!canManage) return;

        setSavingUserId(userId);
        setError(null);

        try {
            const res = await fetch(`/api/team/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || "Failed to update role");
                return;
            }

            await loadTeam();
        } catch {
            setError("Network error while updating role");
        } finally {
            setSavingUserId(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!canManage) return;

        setDeletingUserId(userId);
        setError(null);

        try {
            const res = await fetch(`/api/team/${userId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data.error || "Failed to remove member");
                return;
            }

            await loadTeam();
        } catch {
            setError("Network error while removing member");
        } finally {
            setDeletingUserId(null);
        }
    };

    const renderRoleBadge = (role: MemberRole) => {
        const variant =
            role === "owner"
                ? "outline"
                : role === "admin"
                ? "default"
                : role === "editor"
                ? "secondary"
                : "ghost";

        return <Badge variant={variant}>{role}</Badge>;
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Team</h2>
                    <p className="text-muted-foreground">
                        Manage your team members and roles for this tenant.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Team Directory</CardTitle>
                        <CardDescription>
                            A list of all members in this tenant.
                        </CardDescription>
                    </div>
                    {canManage && (
                        <span className="text-xs font-medium text-muted-foreground">
                            You have admin permissions in this tenant.
                        </span>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {canManage && (
                        <form
                            onSubmit={handleCreate}
                            className="grid gap-3 rounded-xl border bg-muted/40 p-4 md:grid-cols-[2fr,2fr,1.5fr,auto]"
                        >
                            <Input
                                type="email"
                                placeholder="new-user@example.com"
                                value={createEmail}
                                onChange={(e) => setCreateEmail(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Temporary password"
                                value={createPassword}
                                onChange={(e) => setCreatePassword(e.target.value)}
                                required
                            />
                            <select
                                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                value={createRole}
                                onChange={(e) => setCreateRole(e.target.value as MemberRole)}
                            >
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                                <option value="owner">Owner</option>
                            </select>
                            <Button type="submit" disabled={creating}>
                                {creating ? "Creating..." : "Add member"}
                            </Button>
                        </form>
                    )}

                    {loading ? (
                        <div className="rounded-md border p-8 flex justify-center text-muted-foreground">
                            Loading team...
                        </div>
                    ) : members.length === 0 ? (
                        <div className="rounded-md border p-8 flex justify-center text-muted-foreground">
                            No team members found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Created</TableHead>
                                    {canManage && <TableHead className="text-right">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.userId}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {member.name || "—"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {member.email || "—"}
                                            </span>
                                        </TableCell>
                                        <TableCell>{renderRoleBadge(member.role)}</TableCell>
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">
                                                {member.createdAt
                                                    ? new Date(member.createdAt).toLocaleDateString()
                                                    : "—"}
                                            </span>
                                        </TableCell>
                                        {canManage && (
                                            <TableCell className="text-right space-x-2">
                                                <select
                                                    className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                                    value={member.role}
                                                    onChange={(e) =>
                                                        handleRoleChange(
                                                            member.userId,
                                                            e.target.value as MemberRole
                                                        )
                                                    }
                                                    disabled={savingUserId === member.userId}
                                                >
                                                    <option value="viewer">Viewer</option>
                                                    <option value="editor">Editor</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="owner">Owner</option>
                                                </select>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(member.userId)}
                                                    disabled={deletingUserId === member.userId}
                                                >
                                                    {deletingUserId === member.userId
                                                        ? "Removing..."
                                                        : "Remove"}
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
        </div>
    );
}

