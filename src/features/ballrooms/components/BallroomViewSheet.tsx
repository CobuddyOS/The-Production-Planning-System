"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Maximize2,
    Users,
    Calendar,
    Info,
    Box,
    CheckCircle2,
    AlertCircle,
    Archive
} from "lucide-react";
import { TenantBallroom } from "../types";

interface BallroomViewSheetProps {
    ballroom: TenantBallroom | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BallroomViewSheet({ ballroom, open, onOpenChange }: BallroomViewSheetProps) {
    if (!ballroom) return null;

    const statusConfig = {
        approved: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        pending: { icon: Info, color: "text-amber-500", bg: "bg-amber-500/10" },
        rejected: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
    };

    const config = statusConfig[ballroom.status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl p-0 border-l border-border/40 bg-background flex flex-col">
                <SheetHeader className="sr-only">
                    <SheetTitle>{ballroom.name}</SheetTitle>
                    <SheetDescription>View technical specifications and details for this ballroom space.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    {/* Visual Hero */}
                    <div className="relative h-72 bg-muted/20 flex items-center justify-center p-12 overflow-hidden border-b border-border/40">
                        {ballroom.image ? (
                            <img src={ballroom.image} alt={ballroom.name} className="h-full w-full object-contain drop-shadow-2xl z-10" />
                        ) : (
                            <Box className="size-24 text-muted-foreground/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className={`${config.bg} ${config.color} border-none text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg flex items-center gap-1.5`}>
                                    <config.icon className="size-3" />
                                    {ballroom.status}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="size-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        Imported {new Date(ballroom.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-4xl font-black tracking-tighter leading-none">{ballroom.name}</h2>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                {ballroom.description || "No description provided for this space."}
                            </p>
                        </div>

                        <Separator className="bg-border/40" />

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-5 rounded-2xl border border-border/40 space-y-3">
                                <div className="flex items-center gap-2 text-primary">
                                    <Maximize2 className="size-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Dimensions</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black tracking-tighter leading-none">
                                        {ballroom.width} <span className="text-sm text-muted-foreground font-bold">W</span> × {ballroom.depth} <span className="text-sm text-muted-foreground font-bold">D</span>
                                    </p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{ballroom.unit_type === 'ft' ? 'Feet' : 'Meters'}</p>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-5 rounded-2xl border border-border/40 space-y-3">
                                <div className="flex items-center gap-2 text-primary">
                                    <Users className="size-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Capacity</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black tracking-tighter leading-none">{ballroom.capacity || "—"}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Maximum Guests</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 relative overflow-hidden group">
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Info className="size-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-0.5">Asset Reference</p>
                                    <p className="text-sm font-black text-primary truncate leading-none">
                                        {ballroom.atlas_ballroom?.name || "Independent Local Space"}
                                    </p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Box className="size-16 rotate-12" />
                            </div>
                        </div>

                        {ballroom.status === 'pending' && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2">
                                <div className="size-10 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                    <Info className="size-5 text-amber-500" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-amber-600 uppercase tracking-widest leading-none">Awaiting Admin Approval</p>
                                    <p className="text-xs text-amber-700/70 font-medium leading-relaxed">
                                        This space is currently pending review. You will be able to use it in your layouts once an admin approves the request.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
