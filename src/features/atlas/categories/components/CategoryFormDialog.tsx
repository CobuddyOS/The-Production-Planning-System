import { useState, useRef } from "react";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, Loader2, Upload, Trash2, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { categorySchema } from "../schemas";
import { AtlasCategory } from "../types";
import { useAtlasCategories } from "../hooks/useAtlasCategories";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryFormDialogProps {
    category?: AtlasCategory;
    onSuccess: () => void;
    onCancel: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPE = "image/svg+xml";

export function CategoryFormDialog({
    category,
    onSuccess,
    onCancel
}: CategoryFormDialogProps) {
    const isEdit = Boolean(category);
    const { categories: existingCategories } = useAtlasCategories();
    
    const [name, setName] = useState(category?.name || "");
    const [description, setDescription] = useState(category?.description || "");
    const [status, setStatus] = useState<'active' | 'inactive'>(category?.status || 'active');
    const [sortOrder, setSortOrder] = useState<number>(category?.sort_order ?? 0);
    const [iconUrl, setIconUrl] = useState(category?.icon_url || "");
    
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(category?.icon_url || null);
    
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== ALLOWED_TYPE) {
            setError("Only SVG files are allowed.");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("Max file size (2MB) exceeded.");
            return;
        }

        setFile(selectedFile);
        setError(null);
        
        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const removeImage = () => {
        setFile(null);
        setPreviewUrl(category?.icon_url || null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const uploadIcon = async (file: File): Promise<string> => {
        const fileExt = "svg";
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
            .from('atlas_category_icons')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('atlas_category_icons')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setError(null);

        const dataToValidate = { 
            name, 
            description: description || null, 
            status, 
            sort_order: sortOrder,
            icon_url: iconUrl || null
        };

        const validation = categorySchema.safeParse(dataToValidate);

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

            let currentIconUrl = iconUrl;
            if (file) {
                currentIconUrl = await uploadIcon(file);
            }

            const finalData = {
                ...validation.data,
                icon_url: currentIconUrl
            };

            if (isEdit && category) {
                const { error } = await supabase
                    .from('atlas_categories')
                    .update(finalData)
                    .eq('id', category.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('atlas_categories')
                    .insert(finalData);

                if (error) throw error;
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error saving category:', err);
            setError(err.message || "Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="neon-glass-form neon-form sm:max-w-[550px] overflow-hidden flex flex-col p-0">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="p-6 pb-2 text-left">
                    <DialogTitle className="text-xl">
                        {isEdit ? "Edit Category" : "Create Category"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the global category definition. These changes will affect all tenants."
                            : "Define a new global category for Atlas assets. Tenants will use these for their inventory."}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] scrollbar-hide">
                    {error && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-600 rounded-md flex items-center gap-2">
                            <AlertCircleIcon className="size-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="cat-name">Category Name</label>
                            <Input
                                id="cat-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Lighting"
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
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium" htmlFor="cat-sort">Sort Order</label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="size-3 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[250px] p-2">
                                            <p className="text-[10px] font-bold mb-1 border-b pb-1">Current Order Ref:</p>
                                            <div className="max-h-[150px] overflow-y-auto space-y-0.5">
                                                {existingCategories.length > 0 ? (
                                                    existingCategories.map(cat => (
                                                        <div key={cat.id} className="flex justify-between gap-4 text-[10px]">
                                                            <span className={cat.id === category?.id ? "text-primary font-bold" : ""}>
                                                                {cat.name}
                                                                {cat.id === category?.id && " (Current)"}
                                                            </span>
                                                            <span className="text-muted-foreground">{cat.sort_order}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-[10px] italic">No categories yet</p>
                                                )}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Input
                                id="cat-sort"
                                type="number"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                placeholder="0"
                                className={fieldErrors.sort_order ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium">Category Icon (SVG, max 2MB)</label>
                        <div className="flex items-start gap-4">
                            <div className="relative size-16 rounded-md border-2 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden group">
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="size-10 object-contain" />
                                        <button 
                                            type="button" 
                                            onClick={removeImage}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                        >
                                            <Trash2 className="size-4 text-white" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-muted-foreground p-2 text-center">
                                        <Upload className="size-4 mx-auto mb-1 opacity-50" />
                                        <span className="text-[8px]">No Icon</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={ALLOWED_TYPE}
                                    onChange={handleFileChange}
                                    className="h-9 cursor-pointer"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Used in sidebars and toolbars across the platform.
                                </p>
                            </div>
                        </div>
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
                            className={`inline-flex h-6 w-11 items-center rounded-full border border-input transition-colors px-0.5 text-[10px] ${status === 'active' ? 'bg-primary' : 'bg-muted'
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
                    <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={loading}>
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
        </DialogContent>
    );
}
