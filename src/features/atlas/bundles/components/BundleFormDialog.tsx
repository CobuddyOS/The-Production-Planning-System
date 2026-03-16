import { useState, useEffect } from "react";
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
import { AlertCircleIcon, Loader2, Plus, Trash2, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { bundleSchema } from "../schemas";
import { AtlasBundle } from "../types";
import { AssetSelectionDialog } from "./AssetSelectionDialog";
import { AtlasAsset } from "../../assets/types";

interface BundleFormDialogProps {
    bundle?: AtlasBundle;
    onSuccess: () => void;
    onCancel: () => void;
}

export function BundleFormDialog({
    bundle,
    onSuccess,
    onCancel
}: BundleFormDialogProps) {
    const isEdit = Boolean(bundle);
    const [name, setName] = useState(bundle?.name || "");
    const [category, setCategory] = useState(bundle?.category || "");
    const [description, setDescription] = useState(bundle?.description || "");
    const [status, setStatus] = useState<"active" | "inactive">(bundle?.status || "active");

    // Dynamic items state
    const [items, setItems] = useState<{ asset_id: string; quantity: number; asset?: AtlasAsset }[]>(
        bundle?.items?.map(item => ({
            asset_id: item.asset_id,
            quantity: item.quantity,
            asset: item.asset
        })) || []
    );

    const [loading, setLoading] = useState(false);
    const [isSelectingAsset, setIsSelectingAsset] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleSelectAsset = (asset: AtlasAsset) => {
        const exists = items.some(item => item.asset_id === asset.id);
        if (exists) {
            setError(`"${asset.name}" is already in the bundle. Please increase its quantity instead of adding it again.`);
            setIsSelectingAsset(false);
            return;
        }

        setItems([...items, { asset_id: asset.id, quantity: 1, asset }]);
        setIsSelectingAsset(false);
        setError(null);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const updateQuantity = (index: number, quantity: number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], quantity: Math.max(1, quantity) };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setError(null);

        // Validation: At least one item
        if (items.length === 0) {
            setError("Please add at least one item to the bundle before saving.");
            return;
        }

        const payload = {
            name,
            category: category || null,
            description: description || null,
            status,
            items: items.map(i => ({ asset_id: i.asset_id, quantity: i.quantity })),
        };

        const validation = bundleSchema.safeParse(payload);

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

            if (isEdit && bundle) {
                const { error: bundleError } = await supabase
                    .from('atlas_bundles')
                    .update({
                        name: validation.data.name,
                        category: validation.data.category,
                        description: validation.data.description,
                        status: validation.data.status,
                    })
                    .eq('id', bundle.id);

                if (bundleError) throw bundleError;

                const { error: deleteError } = await supabase
                    .from('atlas_bundle_items')
                    .delete()
                    .eq('bundle_id', bundle.id);

                if (deleteError) throw deleteError;

                const itemsToInsert = validation.data.items.map(item => ({
                    bundle_id: bundle.id,
                    asset_id: item.asset_id,
                    quantity: item.quantity
                }));

                const { error: itemsError } = await supabase
                    .from('atlas_bundle_items')
                    .insert(itemsToInsert);

                if (itemsError) throw itemsError;
            } else {
                const { data: newBundle, error: bundleError } = await supabase
                    .from('atlas_bundles')
                    .insert({
                        name: validation.data.name,
                        category: validation.data.category,
                        description: validation.data.description,
                        status: validation.data.status,
                    })
                    .select()
                    .single();

                if (bundleError) throw bundleError;

                const itemsToInsert = validation.data.items.map(item => ({
                    bundle_id: newBundle.id,
                    asset_id: item.asset_id,
                    quantity: item.quantity
                }));

                const { error: itemsError } = await supabase
                    .from('atlas_bundle_items')
                    .insert(itemsToInsert);

                if (itemsError) throw itemsError;
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error saving bundle:', err);
            setError(err.message || "Failed to save bundle");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="neon-glass-form neon-form sm:max-w-[700px] overflow-hidden flex flex-col p-0">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="p-6 pb-2 text-left">
                    <DialogTitle className="text-xl">
                        {isEdit ? "Edit Equipment Bundle" : "Create Equipment Bundle"}
                    </DialogTitle>
                    <DialogDescription>
                        Define the bundle name and include equipment pieces to build your reusable kit.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] scrollbar-hide">
                    {error && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-600 rounded-md flex items-center gap-2">
                            <AlertCircleIcon className="size-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="bundle-name">Bundle Name</label>
                            <Input
                                id="bundle-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Standard Lighting Kit"
                                className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.name && (
                                <p className="text-xs text-destructive">{fieldErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="bundle-category">Category</label>
                            <Input
                                id="bundle-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Lighting, Audio"
                                className={fieldErrors.category ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.category && (
                                <p className="text-xs text-destructive">{fieldErrors.category}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium" htmlFor="bundle-desc">Description</label>
                        <Textarea
                            id="bundle-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe the purpose or contents of this bundle..."
                            className={`resize-none h-20 ${fieldErrors.description ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        />
                        {fieldErrors.description && (
                            <p className="text-xs text-destructive">{fieldErrors.description}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-xs font-medium">Included Assets</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsSelectingAsset(true)}
                                className="h-8 gap-2 cursor-pointer"
                            >
                                <Plus className="size-4" /> Add Asset
                            </Button>
                        </div>

                        {fieldErrors.items && (
                            <p className="text-xs text-destructive">{fieldErrors.items}</p>
                        )}

                        <div className="space-y-3 min-h-[50px]">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-md bg-muted/5">
                                    <Package className="size-8 text-muted-foreground/20 mb-2" />
                                    <p className="text-xs text-muted-foreground">No assets added yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    {items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-2 rounded-md border bg-background group"
                                        >
                                            <div className="size-10 rounded overflow-hidden bg-muted border flex-shrink-0">
                                                {item.asset?.image ? (
                                                    <img
                                                        src={item.asset.image}
                                                        alt={item.asset.name}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="size-full flex items-center justify-center">
                                                        <Package className="size-4 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.asset?.name || "Asset"}</p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {item.asset?.placement_type} • Scale {item.asset?.default_scale}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="text-[10px] font-medium text-muted-foreground">QTY</label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                                    className="w-14 h-8 text-xs text-center px-1"
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(index)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="space-y-0.5 text-left">
                            <p className="text-xs font-medium">Bundle Status</p>
                            <p className="text-[11px] text-muted-foreground">
                                {status === "active" ? "Bundle is available for use." : "Bundle is hidden."}
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
                            isEdit ? "Update Bundle" : "Create Bundle"
                        )}
                    </Button>
                </DialogFooter>
            </form>

            <AssetSelectionDialog
                open={isSelectingAsset}
                onOpenChange={setIsSelectingAsset}
                onSelect={handleSelectAsset}
                selectedAssetIds={items.map(i => i.asset_id)}
            />
        </DialogContent>
    );
}
