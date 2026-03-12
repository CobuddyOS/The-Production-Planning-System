import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Home } from "lucide-react";
import { useState } from "react";
import { AtlasBallroom } from "../types";

interface DeleteBallroomDialogProps {
    ballroom: AtlasBallroom | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string) => Promise<void>;
}

export function DeleteBallroomDialog({
    ballroom,
    open,
    onOpenChange,
    onConfirm,
}: DeleteBallroomDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!ballroom) return;
        try {
            setIsDeleting(true);
            await onConfirm(ballroom.id);
            onOpenChange(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                        <Home className="h-6 w-6 text-red-600 dark:text-red-500" />
                    </div>
                    <DialogTitle className="text-center text-xl">Delete Ballroom</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete <span className="font-semibold text-foreground">"{ballroom?.name}"</span>?
                        This will permanently remove the template and all its specifications.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 sm:justify-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="flex-1 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 cursor-pointer"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Template"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
