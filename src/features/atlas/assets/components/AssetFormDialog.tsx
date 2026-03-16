import { useState, useRef, useEffect } from "react";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, Loader2, Upload, Link, FileImage, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { assetSchema } from "../schemas";
import { AtlasAsset } from "../types";
import { useAtlasCategories } from "../../categories";

interface AssetFormDialogProps {
    asset?: AtlasAsset;
    onSuccess: () => void;
    onCancel: () => void;
}

export function AssetFormDialog({
    asset,
    onSuccess,
    onCancel
}: AssetFormDialogProps) {
    const isEdit = Boolean(asset);
    const [name, setName] = useState(asset?.name || "");
    const [categoryId, setCategoryId] = useState(asset?.category_id || "none");
    const [imageUrl, setImageUrl] = useState(asset?.image || "");
    const [placementType, setPlacementType] = useState(asset?.placement_type || "click");
    const [defaultScale, setDefaultScale] = useState(asset?.default_scale || "medium");
    const [status, setStatus] = useState<"active" | "inactive">(asset?.status || "active");

    const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const { categories } = useAtlasCategories();
    const supabase = createClient();

    // Auto-detect image mode on edit
    useEffect(() => {
        if (isEdit && asset?.image) {
            if (asset.image.includes('atlas_assets_images')) {
                setImageInputMode("upload");
            } else {
                setImageInputMode("url");
            }
        }
    }, [isEdit, asset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: .jpeg and .png only, 2MB limit
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setError("Only .jpeg and .png files are allowed");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("File size must be less than 2MB");
            return;
        }

        setError(null);
        setSelectedFile(file);
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `assets/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('atlas_assets_images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('atlas_assets_images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setError(null);

        let finalImageUrl = imageUrl;

        try {
            setLoading(true);

            // Handle file upload if in upload mode
            if (imageInputMode === "upload" && selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            } else if (imageInputMode === "upload" && !selectedFile && !isEdit) {
                setError("Please select a file to upload or provide a URL");
                setLoading(false);
                return;
            }

            const payload = {
                name,
                category_id: categoryId === "none" ? null : categoryId,
                image: finalImageUrl,
                placement_type: placementType,
                default_scale: defaultScale,
                status,
            };

            const validation = assetSchema.safeParse(payload);

            if (!validation.success) {
                const errors: Record<string, string> = {};
                validation.error.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        errors[issue.path[0].toString()] = issue.message;
                    }
                });
                setFieldErrors(errors);
                setLoading(false);
                return;
            }

            if (isEdit && asset) {
                const { error: updateError } = await supabase
                    .from('atlas_assets')
                    .update(validation.data)
                    .eq('id', asset.id);

                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('atlas_assets')
                    .insert(validation.data);

                if (insertError) throw insertError;
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error saving asset:', err);
            setError(err.message || "Failed to save asset");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="neon-glass-card sm:max-w-[600px] overflow-hidden flex flex-col p-0">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="p-6 pb-2 text-left">
                    <DialogTitle className="text-xl">
                        {isEdit ? "Edit Asset" : "Create Asset"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the global asset definition and specifications."
                            : "Define a new global asset for the Atlas platform."}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    {error && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-600 rounded-md flex items-center gap-2">
                            <AlertCircleIcon className="size-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="asset-name">Asset Name</label>
                            <Input
                                id="asset-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. LED Uplight Pro"
                                className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.name && (
                                <p className="text-xs text-destructive mt-1">{fieldErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium">Category</label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className={`cursor-pointer ${fieldErrors.category_id ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Category</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldErrors.category_id && (
                                <p className="text-xs text-destructive mt-1">{fieldErrors.category_id}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium">Asset Image</label>
                        <div className="flex p-1 bg-muted rounded-lg w-fit mb-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setImageInputMode("url")}
                                className={`h-8 text-xs gap-1.5 transition-all cursor-pointer ${imageInputMode === "url"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Link className="size-3" /> Paste URL
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setImageInputMode("upload")}
                                className={`h-8 text-xs gap-1.5 transition-all cursor-pointer ${imageInputMode === "upload"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Upload className="size-3" /> Upload File
                            </Button>
                        </div>

                        {imageInputMode === "url" ? (
                            <div className="space-y-1">
                                <Input
                                    value={imageUrl.includes('atlas_assets_images') ? "" : imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.png"
                                    className={fieldErrors.image ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {fieldErrors.image && (
                                    <p className="text-xs text-destructive mt-1">{fieldErrors.image}</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile || (isEdit && imageUrl.includes('atlas_assets_images')) ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/30 hover:bg-muted/50'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".png,.jpg,.jpeg"
                                        className="hidden"
                                    />
                                    {selectedFile ? (
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="bg-primary/10 p-2 rounded relative overflow-hidden size-12 flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Preview"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                }}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ) : isEdit && imageUrl.includes('atlas_assets_images') ? (
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="bg-primary/10 p-2 rounded relative overflow-hidden size-12 flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={imageUrl}
                                                    alt="Current"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">Current Asset Image</p>
                                            </div>
                                            <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-[10px] uppercase font-bold">
                                                Active
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="size-6 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium">Click to upload image</p>
                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG (max 2MB)</p>
                                        </>
                                    )}
                                </div>
                                {fieldErrors.image && (
                                    <p className="text-xs text-destructive mt-1">{fieldErrors.image}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Placement Type</label>
                            <Select value={placementType} onValueChange={(val: any) => setPlacementType(val)}>
                                <SelectTrigger className="cursor-pointer">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="click">Click</SelectItem>
                                    <SelectItem value="drag">Drag</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldErrors.placement_type && (
                                <p className="text-xs text-destructive mt-1">{fieldErrors.placement_type}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium">Default Scale</label>
                            <Select value={defaultScale} onValueChange={(val: any) => setDefaultScale(val)}>
                                <SelectTrigger className="cursor-pointer">
                                    <SelectValue placeholder="Select scale" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldErrors.default_scale && (
                                <p className="text-xs text-destructive mt-1">{fieldErrors.default_scale}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium">Status</p>
                            <p className="text-[11px] text-muted-foreground">
                                {status === "active" ? "Asset is active and visible." : "Asset is inactive and hidden."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setStatus(prev => prev === 'active' ? 'inactive' : 'active')}
                            className={`inline-flex h-6 w-11 items-center rounded-full border border-input transition-colors px-0.5 text-[10px] cursor-pointer ${status === 'active' ? 'bg-primary' : 'bg-muted'
                                }`}
                        >
                            <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-background shadow transition-transform cursor-pointer ${status === 'active' ? 'translate-x-5' : 'translate-x-0'
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
                            isEdit ? "Save Changes" : "Create Asset"
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent >
    );
}
