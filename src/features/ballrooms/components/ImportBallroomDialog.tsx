"use client";

import { useState } from "react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Box, Maximize2, Users, FileText, Info } from "lucide-react";
import { AtlasBallroom } from "@/features/atlas/ballrooms/types";

interface ImportBallroomDialogProps {
    ballroom: AtlasBallroom;
    onSuccess: (values: any) => Promise<void>;
    onCancel: () => void;
}

export function ImportBallroomDialog({ ballroom, onSuccess, onCancel }: ImportBallroomDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState(ballroom.name);
    const [description, setDescription] = useState(ballroom.description || "");
    const [width, setWidth] = useState(ballroom.width.toString());
    const [depth, setDepth] = useState(ballroom.depth.toString());
    const [unitType, setUnitType] = useState(ballroom.unit_type);
    const [capacity, setCapacity] = useState(ballroom.capacity?.toString() || "0");
    const [status, setStatus] = useState('pending');

    const handleImport = async () => {
        setIsSubmitting(true);
        try {
            await onSuccess({
                atlas_ballroom_id: ballroom.id,
                name,
                description,
                image: ballroom.image,
                width: parseFloat(width),
                depth: parseFloat(depth),
                unit_type: unitType,
                capacity: parseInt(capacity),
                status
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DialogContent className="neon-glass-form neon-form max-w-2xl p-0 overflow-hidden rounded-3xl font-montserrat">
            <DialogHeader className="sr-only">
                <DialogTitle>Import {ballroom.name}</DialogTitle>
                <DialogDescription>Configure details to import this space template into your local inventory.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col h-[90vh] md:h-auto max-h-[85vh]">
                {/* Visual Header */}
                <div className="relative h-48 bg-muted/30 overflow-hidden border-b border-border/40">
                    <div className="absolute inset-0 flex items-center justify-end p-6 mr-4">
                        {ballroom.image ? (
                            <div className="h-full w-[40%] overflow-hidden rounded-3xl border-2 border-primary/20 shadow-2xl isolate">
                                <img src={ballroom.image} alt={ballroom.name} className="h-full w-full object-cover" />
                            </div>
                        ) : (
                            <Box className="size-20 text-muted-foreground/20 mr-6" />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute inset-y-0 left-6 right-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <Badge variant="outline" className="bg-background/50 backdrop-blur border-border/50 text-[10px] font-black uppercase tracking-tighter py-0">
                                {ballroom.atlas_ballroom_categories?.name || "Global Space"}
                            </Badge>
                            <h2 className="text-2xl font-black tracking-tighter leading-none text-foreground">{ballroom.name}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pt-6 scrollbar-hide">
                    <div className="space-y-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name & Specs */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Info className="size-4" />
                                    <span className="text-xs font-semibold uppercase tracking-widest">General Information</span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Internal Name</label>
                                    <Input
                                        placeholder="e.g. Grand Ballroom A"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-10 rounded-xl font-bold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            <Users className="size-3" /> Max Capacity
                                        </label>
                                        <Input
                                            type="number"
                                            value={capacity}
                                            onChange={(e) => setCapacity(e.target.value)}
                                            className="h-10 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            Unit
                                        </label>
                                        <Select value={unitType} onValueChange={(v: any) => setUnitType(v)}>
                                            <SelectTrigger className="h-10 rounded-xl font-bold">
                                                <SelectValue placeholder="Unit" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/40 shadow-xl">
                                                <SelectItem value="ft">Feet (ft)</SelectItem>
                                                <SelectItem value="m">Meters (m)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Maximize2 className="size-4" />
                                    <span className="text-xs font-semibold uppercase tracking-widest">Dimensions</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Width</label>
                                        <Input
                                            type="number"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value)}
                                            className="h-10 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Depth</label>
                                        <Input
                                            type="number"
                                            value={depth}
                                            onChange={(e) => setDepth(e.target.value)}
                                            className="h-10 rounded-xl font-bold"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Description */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                    <FileText className="size-3" /> Description
                                </label>
                                <Textarea
                                    placeholder="Describe the space..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[120px] rounded-xl resize-none font-medium text-xs"
                                />
                            </div>
                        </div>

                        {/* Admin Approval Notice */}
                        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start">
                            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                <Info className="size-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary uppercase tracking-widest">Admin Approval Required</p>
                                <p className="text-[11px] text-primary/70 font-medium leading-tight">
                                    Your request will be sent to the admin for approval. Once approved, the ballroom will be available for use in your inventory.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 border-t border-border/40">
                    <Button variant="ghost" onClick={onCancel} className="rounded-xl font-bold h-11 px-6 hover:bg-muted/10 cursor-pointer">
                        Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={isSubmitting} className="rounded-xl px-8 h-11 shadow-xl shadow-primary/20 font-black tracking-tight gap-2 transition-all active:scale-95 cursor-pointer">
                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Box className="size-4" />}
                        Send for Approval
                    </Button>
                </DialogFooter>
            </div>
        </DialogContent>
    );
}
