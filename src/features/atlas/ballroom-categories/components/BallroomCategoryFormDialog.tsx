import { useState } from "react";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ballroomCategorySchema } from "../schemas";
import { AtlasBallroomCategory } from "../types";

interface BallroomCategoryFormDialogProps {
    category?: AtlasBallroomCategory;
    onSuccess: () => void;
    onCancel: () => void;
}

export function BallroomCategoryFormDialog({
    category,
    onSuccess,
    onCancel
}: BallroomCategoryFormDialogProps) {
    const isEdit = Boolean(category);
    const [name, setName] = useState(category?.name || "");
    const [description, setDescription] = useState(category?.description || "");
    const [status, setStatus] = useState<'active' | 'inactive'>(category?.status || 'active');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setError(null);

        const validation = ballroomCategorySchema.safeParse({ name, description, status });

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

        try {
            setLoading(true);

            if (isEdit && category) {
                const { error } = await supabase
                    .from('atlas_ballroom_categories')
                    .update(validation.data)
                    .eq('id', category.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('atlas_ballroom_categories')
                    .insert(validation.data);

                if (error) throw error;
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error saving ballroom category:', err);
            setError(err.message || "Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="neon-glass-card sm:max-w-[500px] overflow-hidden flex flex-col p-0">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="p-6 pb-2 text-left">
                    <DialogTitle className="text-xl">
                        {isEdit ? "Edit Ballroom Category" : "Create Ballroom Category"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the ballroom category definition. These changes will affect the platform architecture."
                            : "Define a new category for ballroom templates."}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    {error && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-600 rounded-md flex items-center gap-2">
                            <AlertCircleIcon className="size-4" />
                            {error}
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-xs font-medium" htmlFor="cat-name">Category Name</label>
                        <Input
                            id="cat-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Wedding"
                            className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {fieldErrors.name && (
                            <p className="flex items-center gap-1.5 text-xs text-destructive">
                                <AlertCircleIcon className="size-3" />
                                {fieldErrors.name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium" htmlFor="cat-desc">Description</label>
                        <Input
                            id="cat-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description for internal admins"
                            className={fieldErrors.description ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {fieldErrors.description && (
                            <p className="flex items-center gap-1.5 text-xs text-destructive">
                                <AlertCircleIcon className="size-3" />
                                {fieldErrors.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium">Status</p>
                            <p className="text-[11px] text-muted-foreground">
                                {status === 'active' ? 'Category is active and visible.' : 'Category is inactive and hidden.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setStatus(prev => prev === 'active' ? 'inactive' : 'active')}
                            className={`inline-flex h-6 w-11 items-center rounded-full border border-input transition-colors px-0.5 text-[10px] cursor-pointer ${status === 'active' ? 'bg-primary' : 'bg-muted'
                                }`}
                        >
                            <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-background shadow transition-transform ${status === 'active' ? 'translate-x-5' : 'translate-x-0'
                                }`}>
                                {status === 'active' ? "On" : "Off"}
                            </span>
                        </button>
                    </div>
                </div>
                <DialogFooter className="p-6 border-t">
                    <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={loading} className="cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={loading} className="cursor-pointer">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            isEdit ? "Save Changes" : "Create Category"
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent >
    );
}
