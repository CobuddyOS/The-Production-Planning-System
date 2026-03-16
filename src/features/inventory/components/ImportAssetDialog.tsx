import React, { useState, useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircleIcon, Loader2, Package, Save, ArrowRight } from "lucide-react";
import { warehouseItemSchema, WarehouseItemSchemaValues } from "../schemas";
import { AtlasAsset } from "@/features/atlas/assets/types";

interface ImportAssetDialogProps {
    asset: AtlasAsset;
    onSuccess: (data: WarehouseItemSchemaValues) => Promise<void>;
    onCancel: () => void;
}

export function ImportAssetDialog({
    asset,
    onSuccess,
    onCancel
}: ImportAssetDialogProps) {
    const [title, setTitle] = useState(asset.name);
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [location, setLocation] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [pricing, setPricing] = useState("");

    // Technical specs
    const [dimensions, setDimensions] = useState("");
    const [weight, setWeight] = useState("");
    const [power, setPower] = useState("");
    const [footprintWidth, setFootprintWidth] = useState("");
    const [footprintDepth, setFootprintDepth] = useState("");


    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setError(null);

        const payload = {
            atlas_asset_id: asset.id,
            title,
            description: description || null,
            quantity: parseInt(quantity) || 0,
            warehouse_location: location || null,
            brand: brand || null,
            model: model || null,
            dimensions: dimensions || null,
            weight: weight ? parseFloat(weight) : null,
            power: power || null,
            footprint_width: footprintWidth ? parseFloat(footprintWidth) : null,
            footprint_depth: footprintDepth ? parseFloat(footprintDepth) : null,
            pricing: pricing ? parseFloat(pricing) : null,
            approval_status: 'pending' as const,
            rotation_allowed: true,
        };

        const validation = warehouseItemSchema.safeParse(payload);

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
            await onSuccess(validation.data);
        } catch (err: any) {
            console.error('Error importing item:', err);
            setError(err.message || "Failed to import item to inventory");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="neon-glass-form neon-form sm:max-w-[700px] overflow-hidden flex flex-col p-0">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="p-6 pb-2 bg-muted/20 text-left">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-12 rounded-lg bg-background border p-1 shadow-sm overflow-hidden flex-shrink-0">
                            <img src={asset.image} alt={asset.name} className="size-full object-contain" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Import to Inventory</DialogTitle>
                            <DialogDescription>
                                Add "{asset.name}" from Global Catalog to your warehouse.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-hide">
                    {error && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-600 rounded-md flex items-center gap-2">
                            <AlertCircleIcon className="size-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="item-title">Inventory Title</label>
                            <Input
                                id="item-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Display name in your warehouse"
                                className={fieldErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.title && (
                                <p className="text-xs text-destructive">{fieldErrors.title}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="item-quantity">Stock Quantity</label>
                            <Input
                                id="item-quantity"
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className={fieldErrors.quantity ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {fieldErrors.quantity && (
                                <p className="text-xs text-destructive">{fieldErrors.quantity}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="item-brand">Brand</label>
                            <Input
                                id="item-brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder="e.g. Sony, Martin"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="item-model">Model</label>
                            <Input
                                id="item-model"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                placeholder="e.g. VPL-PHZ50"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="item-pricing">Rental Pricing</label>
                            <Input
                                id="item-pricing"
                                type="number"
                                step="0.01"
                                value={pricing}
                                onChange={(e) => setPricing(e.target.value)}
                                placeholder="Daily rate"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium" htmlFor="item-desc">Description (Local)</label>
                        <Textarea
                            id="item-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add internal notes or specific configuration..."
                            className="resize-none h-20"
                        />
                    </div>

                    <div className="space-y-4 pt-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b pb-1">Warehouse Metrics</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="item-location">Storage Location</label>
                                <Input
                                    id="item-location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Shelf A-04"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="item-power">Power Req.</label>
                                <Input
                                    id="item-power"
                                    value={power}
                                    onChange={(e) => setPower(e.target.value)}
                                    placeholder="e.g. 240V / 13A"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="item-dims">Dimensions</label>
                                <Input
                                    id="item-dims"
                                    value={dimensions}
                                    onChange={(e) => setDimensions(e.target.value)}
                                    placeholder="W x H x D"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="item-weight">Weight (kg)</label>
                                <Input
                                    id="item-weight"
                                    type="number"
                                    step="0.1"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="item-f-width">Footprint Width (m)</label>
                                <Input
                                    id="item-f-width"
                                    type="number"
                                    step="0.01"
                                    value={footprintWidth}
                                    onChange={(e) => setFootprintWidth(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="item-f-depth">Footprint Depth (m)</label>
                                <Input
                                    id="item-f-depth"
                                    type="number"
                                    step="0.01"
                                    value={footprintDepth}
                                    onChange={(e) => setFootprintDepth(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-1"></div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/20 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={loading} className="cursor-pointer w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={loading} className="cursor-pointer gap-2">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ArrowRight className="h-4 w-4" />
                            )}
                            Import to Inventory
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
