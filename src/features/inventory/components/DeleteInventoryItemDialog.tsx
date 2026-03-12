import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Box } from "lucide-react";
import { useState } from "react";
import { WarehouseItem } from "../types";

interface DeleteInventoryItemDialogProps {
    item: WarehouseItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (id: string) => Promise<void>;
}

export function DeleteInventoryItemDialog({
    item,
    open,
    onOpenChange,
    onConfirm,
}: DeleteInventoryItemDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!item) return;
        try {
            setIsDeleting(true);
            await onConfirm(item.id);
            onOpenChange(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4 border-4 border-background">
                        <Box className="h-7 w-7 text-red-600 dark:text-red-500" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold">Remove from Inventory</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Are you sure you want to remove <span className="font-bold text-foreground">"{item?.title}"</span> from your warehouse?
                        <br />
                        <span className="text-xs mt-2 block text-muted-foreground italic">This action cannot be undone.</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 sm:justify-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="flex-1 cursor-pointer hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 cursor-pointer shadow-lg shadow-red-500/20"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Item"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
