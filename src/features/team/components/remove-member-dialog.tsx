import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { TeamMember } from '../types';

interface RemoveMemberDialogProps {
    member: TeamMember | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    deleting: boolean;
}

export function RemoveMemberDialog({
    member,
    onClose,
    onConfirm,
    deleting,
}: RemoveMemberDialogProps) {
    return (
        <Dialog
            open={!!member}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent showCloseButton>
                <DialogHeader>
                    <DialogTitle>Remove team member</DialogTitle>
                    <DialogDescription>
                        {member
                            ? `Are you sure you want to remove ${member.name || member.email || 'this member'} from the team? They will lose access to this tenant.`
                            : ''}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Removing...
                            </>
                        ) : (
                            'Remove'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
