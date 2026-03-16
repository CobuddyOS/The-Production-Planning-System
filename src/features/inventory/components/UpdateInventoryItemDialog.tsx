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
import { AlertCircleIcon, Loader2, Save, X } from "lucide-react";
import { warehouseItemSchema, WarehouseItemSchemaValues } from "../schemas";
import { WarehouseItem } from "../types";

interface UpdateInventoryItemDialogProps {
    item: WarehouseItem;
    onSuccess: (id: string, data: Partial<WarehouseItemSchemaValues>) => Promise<void>;
    onCancel: () => void;
}

export function UpdateInventoryItemDialog({
    item,
    onSuccess,
    onCancel
}: UpdateInventoryItemDialogProps) {
    const [title, setTitle] = useState(item.title || "");
    const [description, setDescription] = useState(item.description || "");
    const [quantity, setQuantity] = useState(item.quantity?.toString() || "0");
    const [location, setLocation] = useState(item.warehouse_location || "");
    const [brand, setBrand] = useState(item.brand || "");
    const [model, setModel] = useState(item.model || "");
    const [pricing, setPricing] = useState(item.pricing?.toString() || "");

    // Technical specs
    const [dimensions, setDimensions] = useState(item.dimensions || "");
    const [weight, setWeight] = useState(item.weight?.toString() || "");
    const [power, setPower] = useState(item.power || "");
    const [footprintWidth, setFootprintWidth] = useState(item.footprint_width?.toString() || "");
    const [footprintDepth, setFootprintDepth] = useState(item.footprint_depth?.toString() || "");

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldErrors({});
        setError(null);

        const payload = {
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
            rotation_allowed: item.rotation_allowed,
            approval_status: item.approval_status,
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
            await onSuccess(item.id, validation.data);
        } catch (err: any) {
            console.error('Error updating item:', err);
            setError(err.message || "Failed to update item in inventory");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent className="neon-glass-form neon-form sm:max-w-[700px] overflow-hidden flex flex-col p-0">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="p-6 pb-2 bg-muted/20 text-left relative">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-12 rounded-lg bg-background border p-1 shadow-sm overflow-hidden flex-shrink-0">
                            {item.asset?.image && <img src={item.asset.image} alt={item.title || ""} className="size-full object-contain" />}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Update Inventory Item</DialogTitle>
                            <DialogDescription>
                                Modify details for "{item.title}" in your warehouse.
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
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-title">Inventory Title</label>
                            <Input
                                id="item-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Display name in your warehouse"
                                className={`rounded-xl ${fieldErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            {fieldErrors.title && <p className="text-xs text-destructive">{fieldErrors.title}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-quantity">Stock Quantity</label>
                            <Input
                                id="item-quantity"
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className={`rounded-xl ${fieldErrors.quantity ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            {fieldErrors.quantity && <p className="text-xs text-destructive">{fieldErrors.quantity}</p>}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-brand">Brand</label>
                            <Input id="item-brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Sony, Martin..." className="rounded-xl" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-model">Model</label>
                            <Input id="item-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="VPL-PHZ50..." className="rounded-xl" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-pricing">Rental Pricing</label>
                            <Input id="item-pricing" type="number" step="0.01" value={pricing} onChange={(e) => setPricing(e.target.value)} placeholder="0.00" className="rounded-xl" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-desc">Description (Local)</label>
                        <Textarea
                            id="item-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Internal notes..."
                            className="resize-none h-24 rounded-xl"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <h3 className="text-xs font-black uppercase tracking-tighter text-primary bg-primary/5 w-fit px-2 py-0.5 rounded">Warehouse Specs</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-location">Storage Location</label>
                                <Input id="item-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Shelf A-04" className="rounded-xl" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-power">Power Req.</label>
                                <Input id="item-power" value={power} onChange={(e) => setPower(e.target.value)} placeholder="240V / 13A" className="rounded-xl" />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-dims">Dimensions</label>
                                <Input id="item-dims" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="W x H x D" className="rounded-xl" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-weight">Weight (kg)</label>
                                <Input id="item-weight" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="rounded-xl" />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-f-width">Footprint Width (m)</label>
                                <Input id="item-f-width" type="number" step="0.01" value={footprintWidth} onChange={(e) => setFootprintWidth(e.target.value)} className="rounded-xl" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="item-f-depth">Footprint Depth (m)</label>
                                <Input id="item-f-depth" type="number" step="0.01" value={footprintDepth} onChange={(e) => setFootprintDepth(e.target.value)} className="rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/20 border-t flex items-center justify-between gap-4">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest hidden sm:block">
                        Status: <span className="text-primary">{item.approval_status}</span>
                    </p>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={loading} className="cursor-pointer rounded-xl hover:bg-background">
                            Discard
                        </Button>
                        <Button type="submit" size="sm" disabled={loading} className="cursor-pointer rounded-xl gap-2 px-6 shadow-lg shadow-primary/20">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
