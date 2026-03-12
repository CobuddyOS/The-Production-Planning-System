import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { AtlasBallroomCategory } from "../types";

interface DeleteBallroomCategoryDialogProps {
    category: AtlasBallroomCategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string) => Promise<void>;
}

export function DeleteBallroomCategoryDialog({
    category,
    open,
    onOpenChange,
    onConfirm,
}: DeleteBallroomCategoryDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!category) return;
        try {
            setIsDeleting(true);
            await onConfirm(category.id);
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
                        <Trash2 className="h-6 w-6 text-red-600 dark:text-red-500" />
                    </div>
                    <DialogTitle className="text-center text-xl">Delete Category</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete <span className="font-semibold text-foreground">"{category?.name}"</span>?
                        This action cannot be undone and may affect ballrooms using this category.
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
                            "Delete Category"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
