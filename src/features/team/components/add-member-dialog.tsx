import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon, AlertCircleIcon } from 'lucide-react';
import { TEAM_ROLES, type TeamRoleValue } from '../constants';
import { CreateMemberData } from '../types';
import { addMemberSchema } from '../schemas';
import { z } from 'zod';

interface AddMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: CreateMemberData) => Promise<boolean>;
    creating: boolean;
}

export function AddMemberDialog({
    open,
    onOpenChange,
    onConfirm,
    creating,
}: AddMemberDialogProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<TeamRoleValue>('sales');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        const validation = addMemberSchema.safeParse({ name, email, password, role });

        if (!validation.success) {
            const errors: Record<string, string> = {};
            validation.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    errors[issue.path[0].toString()] = issue.message;
                }
            });
            setFieldErrors(errors);
            return;
        }

        const success = await onConfirm(validation.data as CreateMemberData);
        if (success) {
            setName('');
            setEmail('');
            setPassword('');
            setRole('sales');
            setFieldErrors({});
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add team member</DialogTitle>
                    <DialogDescription>
                        Create a new user and add them to this tenant. They will
                        receive access based on the role you select.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div className="space-y-2">
                        <label htmlFor="add-name" className="text-sm font-medium">
                            Name
                        </label>
                        <Input
                            id="add-name"
                            placeholder="Jane Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {fieldErrors.name && (
                            <p className="flex items-center gap-1.5 text-xs text-destructive">
                                <AlertCircleIcon className="size-3" />
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="add-email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="add-email"
                            type="email"
                            placeholder="jane@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {fieldErrors.email && (
                            <p className="flex items-center gap-1.5 text-xs text-destructive">
                                <AlertCircleIcon className="size-3" />
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="add-password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="add-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {fieldErrors.password && (
                            <p className="flex items-center gap-1.5 text-xs text-destructive">
                                <AlertCircleIcon className="size-3" />
                                {fieldErrors.password}
                            </p>
                        )}
                        {!fieldErrors.password && (
                            <p className="text-xs text-muted-foreground">
                                They can change this after first login.
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="add-role" className="text-sm font-medium">
                            Role
                        </label>
                        <select
                            id="add-role"
                            className={`h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${fieldErrors.role ? "border-destructive ring-destructive" : ""}`}
                            value={role}
                            onChange={(e) => setRole(e.target.value as TeamRoleValue)}
                        >
                            {TEAM_ROLES.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.role && (
                            <p className="flex items-center gap-1.5 text-xs text-destructive">
                                <AlertCircleIcon className="size-3" />
                                {fieldErrors.role}
                            </p>
                        )}
                    </div>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={creating}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={creating}>
                            {creating ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
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
    );
}
