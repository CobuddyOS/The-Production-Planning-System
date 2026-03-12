"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { TenantBallroom } from "../types";

interface DeleteBallroomDialogProps {
    ballroom: TenantBallroom | null;
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
        setIsDeleting(true);
        try {
            await onConfirm(ballroom.id);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl bg-background rounded-3xl">
                <div className="p-8">
                    <div className="size-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                        <AlertTriangle className="size-8 text-red-500" />
                    </div>

                    <div className="space-y-2">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">Delete Ballroom?</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground font-medium leading-relaxed">
                                Are you sure you want to remove <span className="font-bold text-foreground">"{ballroom?.name}"</span>? This will permanently delete the space from your local warehouse.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 h-12 rounded-xl font-bold hover:bg-muted/10"
                        >
                            Keep Space
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 h-12 rounded-xl font-black shadow-lg shadow-red-500/20 gap-2 transition-all active:scale-95"
                        >
                            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="px-8 py-4 bg-red-50/50 border-t border-red-100/50">
                    <p className="text-[10px] font-bold text-red-600/60 uppercase tracking-widest text-center">
                        This action cannot be undone
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
