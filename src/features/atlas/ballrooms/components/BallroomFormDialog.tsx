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
import { Textarea } from "@/components/ui/textarea";
import { AlertCircleIcon, Loader2, Upload, Link, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { ballroomSchema } from "../schemas";
import { AtlasBallroom } from "../types";
import { useAtlasBallroomCategories } from "../../ballroom-categories";

interface BallroomFormDialogProps {
    ballroom?: AtlasBallroom;
    onSuccess: () => void;
    onCancel: () => void;
}

export function BallroomFormDialog({
    ballroom,
    onSuccess,
    onCancel
}: BallroomFormDialogProps) {
    const isEdit = Boolean(ballroom);
    const [name, setName] = useState(ballroom?.name || "");
    const [categoryId, setCategoryId] = useState(ballroom?.category_id || "none");
    const [description, setDescription] = useState(ballroom?.description || "");
    const [imageUrl, setImageUrl] = useState(ballroom?.image || "");
    const [width, setWidth] = useState<string>(ballroom?.width?.toString() || "");
    const [depth, setDepth] = useState<string>(ballroom?.depth?.toString() || "");
    const [unitType, setUnitType] = useState<'ft' | 'm'>(ballroom?.unit_type || "ft");
    const [capacity, setCapacity] = useState<string>(ballroom?.capacity?.toString() || "");
    const [status, setStatus] = useState<"active" | "inactive">(ballroom?.status || "active");

    const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const { categories } = useAtlasBallroomCategories();
    const supabase = createClient();

    // Auto-detect image mode on edit
    useEffect(() => {
        if (isEdit && ballroom?.image) {
            if (ballroom.image.includes('atlas_ballrooms_images')) {
                setImageInputMode("upload");
            } else {
                setImageInputMode("url");
            }
        }
    }, [isEdit, ballroom]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setError("Only .jpeg and .png files are allowed");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        setError(null);
        setSelectedFile(file);
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `ballrooms/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('atlas_ballrooms_images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('atlas_ballrooms_images')
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

            if (imageInputMode === "upload" && selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            }

            const payload = {
                name,
                category_id: categoryId === "none" ? null : categoryId,
                description: description || null,
                image: finalImageUrl || null,
                width: parseFloat(width),
                depth: parseFloat(depth),
                unit_type: unitType,
                capacity: capacity ? parseInt(capacity) : null,
                status,
            };

            const validation = ballroomSchema.safeParse(payload);

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

            if (isEdit && ballroom) {
                const { error: updateError } = await supabase
                    .from('atlas_ballrooms')
                    .update(validation.data)
                    .eq('id', ballroom.id);

                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('atlas_ballrooms')
                    .insert(validation.data);

                if (insertError) throw insertError;
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error saving ballroom:', err);
            setError(err.message || "Failed to save ballroom");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[700px] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="p-6 pb-2 bg-muted/20 text-left">
                    <DialogTitle className="text-xl">
                        {isEdit ? "Edit Ballroom Template" : "Create Ballroom Template"}
                    </DialogTitle>
                    <DialogDescription>
                        Define the physical dimensions and core specifications for this ballroom template.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                    {error && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-600 rounded-md flex items-center gap-2">
                            <AlertCircleIcon className="size-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="ballroom-name">Ballroom Name</label>
                            <Input
                                id="ballroom-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Grand Ballroom"
                                className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.name && (
                                <p className="text-xs text-destructive">{fieldErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium">Category</label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className={`cursor-pointer ${fieldErrors.category_id ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                                    <SelectValue placeholder="Select segment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Uncategorized</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldErrors.category_id && (
                                <p className="text-xs text-destructive">{fieldErrors.category_id}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium" htmlFor="ballroom-desc">Description</label>
                        <Textarea
                            id="ballroom-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe the ballroom layout or features..."
                            className={`resize-none h-20 ${fieldErrors.description ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        />
                        {fieldErrors.description && (
                            <p className="text-xs text-destructive">{fieldErrors.description}</p>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Width ({unitType})</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="0.0"
                                className={fieldErrors.width ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.width && (
                                <p className="text-xs text-destructive">{fieldErrors.width}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Depth ({unitType})</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={depth}
                                onChange={(e) => setDepth(e.target.value)}
                                placeholder="0.0"
                                className={fieldErrors.depth ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.depth && (
                                <p className="text-xs text-destructive">{fieldErrors.depth}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Max Capacity</label>
                            <Input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="e.g. 500"
                                className={fieldErrors.capacity ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.capacity && (
                                <p className="text-xs text-destructive">{fieldErrors.capacity}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium">Unit Measurement</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="unitType"
                                    value="ft"
                                    checked={unitType === 'ft'}
                                    onChange={() => setUnitType('ft')}
                                    className="accent-primary"
                                />
                                <span className="text-sm">Feet (ft)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="unitType"
                                    value="m"
                                    checked={unitType === 'm'}
                                    onChange={() => setUnitType('m')}
                                    className="accent-primary"
                                />
                                <span className="text-sm">Meters (m)</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium">Ballroom Image (Optional)</label>
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
                                    value={imageUrl.includes('atlas_ballrooms_images') ? "" : imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/ballroom-preview.png"
                                    className={fieldErrors.image ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile || (isEdit && imageUrl.includes('atlas_ballrooms_images')) ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/30 hover:bg-muted/50'
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
                                            <div className="bg-primary/10 p-2 rounded relative overflow-hidden size-14 flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Preview"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
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
                                    ) : isEdit && imageUrl.includes('atlas_ballrooms_images') ? (
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="bg-primary/10 p-2 rounded relative overflow-hidden size-14 flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={imageUrl}
                                                    alt="Current"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="text-sm font-medium truncate">Current Ballroom Image</p>
                                                <Badge variant="outline" className="mt-1 bg-primary/10 text-[10px] uppercase font-bold">Active</Badge>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="size-8 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium">Click to upload ballroom preview</p>
                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG (max 5MB)</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {fieldErrors.image && (
                            <p className="text-xs text-destructive">{fieldErrors.image}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="space-y-0.5 text-left">
                            <p className="text-xs font-medium">Template Status</p>
                            <p className="text-[11px] text-muted-foreground">
                                {status === "active" ? "Template is available for use." : "Template is hidden."}
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
                <DialogFooter className="p-6 bg-muted/20 border-t">
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
                            isEdit ? "Update Template" : "Create Template"
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent >
    );
}
