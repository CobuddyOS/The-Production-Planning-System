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
import { Loader2, Box, Maximize2, Users, FileText, Info, Save } from "lucide-react";
import { TenantBallroom } from "../types";

interface UpdateBallroomDialogProps {
    ballroom: TenantBallroom;
    onSuccess: (id: string, values: any) => Promise<void>;
    onCancel: () => void;
}

export function UpdateBallroomDialog({ ballroom, onSuccess, onCancel }: UpdateBallroomDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState(ballroom.name);
    const [description, setDescription] = useState(ballroom.description || "");
    const [width, setWidth] = useState(ballroom.width.toString());
    const [depth, setDepth] = useState(ballroom.depth.toString());
    const [unitType, setUnitType] = useState(ballroom.unit_type);
    const [capacity, setCapacity] = useState(ballroom.capacity?.toString() || "0");
    const [status, setStatus] = useState(ballroom.status);

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            await onSuccess(ballroom.id, {
                name,
                description,
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
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl bg-background rounded-3xl">
            <DialogHeader className="sr-only">
                <DialogTitle>Edit {ballroom.name}</DialogTitle>
                <DialogDescription>Update the specifications and details of your local ballroom space.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col h-[90vh] md:h-auto max-h-[85vh]">
                {/* Visual Header */}
                <div className="relative h-48 bg-muted/30 overflow-hidden border-b border-border/40">
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        {(ballroom.image || ballroom.atlas_ballroom?.image) ? (
                            <img src={(ballroom.image || ballroom.atlas_ballroom?.image) || ""} alt={ballroom.name} className="h-full w-full object-contain drop-shadow-2xl" />
                        ) : (
                            <Box className="size-20 text-muted-foreground/20" />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                        <div className="space-y-1">
                            <Badge variant="outline" className="bg-background/50 backdrop-blur border-border/50 text-[10px] font-black uppercase tracking-tighter py-0">
                                Edit Ballroom Space
                            </Badge>
                            <h2 className="text-2xl font-black tracking-tighter leading-none text-foreground">{ballroom.name}</h2>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col items-center px-3 py-1 bg-background/50 backdrop-blur rounded-xl border border-border/50">
                                <span className="text-xs font-black text-primary leading-none">{width}x{depth}</span>
                                <span className="text-[8px] font-black uppercase text-muted-foreground">{unitType}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pt-6">
                    <div className="space-y-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name & Specs */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Info className="size-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">General Information</span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal Name</label>
                                    <Input
                                        placeholder="e.g. Grand Ballroom A"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary font-bold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            <Users className="size-3" /> Max Capacity
                                        </label>
                                        <Input
                                            type="number"
                                            value={capacity}
                                            onChange={(e) => setCapacity(e.target.value)}
                                            className="h-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            Status
                                        </label>
                                        <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                            <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary font-bold">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/40 shadow-xl">
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Dimensions & Description */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Maximize2 className="size-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Dimensions</span>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Width</label>
                                        <Input
                                            type="number"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value)}
                                            className="h-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary font-bold"
                                        />
                                    </div>
                                    <div className="col-span-1 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Depth</label>
                                        <Input
                                            type="number"
                                            value={depth}
                                            onChange={(e) => setDepth(e.target.value)}
                                            className="h-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary font-bold"
                                        />
                                    </div>
                                    <div className="col-span-1 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit</label>
                                        <Select value={unitType} onValueChange={(v: any) => setUnitType(v)}>
                                            <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary font-bold">
                                                <SelectValue placeholder="Unit" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/40 shadow-xl">
                                                <SelectItem value="ft">ft</SelectItem>
                                                <SelectItem value="m">m</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                        <FileText className="size-3" /> Description
                                    </label>
                                    <Textarea
                                        placeholder="Describe the space..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="min-h-[100px] rounded-xl bg-muted/30 border-none focus-visible:ring-primary resize-none font-medium text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/5 border-t border-border/40">
                    <Button variant="ghost" onClick={onCancel} className="rounded-xl font-bold h-11 px-6 hover:bg-muted/10 cursor-pointer">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} disabled={isSubmitting} className="rounded-xl px-8 h-11 shadow-xl shadow-primary/20 font-black tracking-tight gap-2 transition-all active:scale-95 cursor-pointer">
                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </div>
        </DialogContent>
    );
}
