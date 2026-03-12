"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Info,
    Home,
    Ruler,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    Box,
} from "lucide-react";
import { TenantBallroom } from "../types";

interface BallroomViewSheetProps {
    ballroom: TenantBallroom | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
    pending: { label: "Pending", className: "bg-amber-500 text-white border-none shadow-lg", icon: Clock },
    approved: { label: "Approved", className: "bg-emerald-500 text-white border-none shadow-lg", icon: CheckCircle2 },
    rejected: { label: "Rejected", className: "bg-red-500 text-white border-none shadow-lg", icon: XCircle },
};

export function BallroomViewSheet({ ballroom, open, onOpenChange }: BallroomViewSheetProps) {
    if (!ballroom) return null;

    const status = statusConfig[ballroom.status] || statusConfig.pending;
    const imageUrl = ballroom.image || ballroom.atlas_ballroom?.image || null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[450px] gap-0 p-0 overflow-y-auto">
                {/* Image preview */}
                {imageUrl ? (
                    <div className="w-full aspect-video relative bg-muted overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt={ballroom.name}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        <div className="absolute top-4 left-4">
                            <Badge className={status.className}>{status.label}</Badge>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 shrink-0 relative">
                        <Home className="h-20 w-20 text-primary/10" />
                        <div className="absolute top-4 left-4">
                            <Badge className={status.className}>{status.label}</Badge>
                        </div>
                    </div>
                )}

                <div className="p-8 space-y-8">
                    {/* Title */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="font-semibold px-2 py-0 border-primary/20 bg-primary/10 text-primary uppercase text-[10px] tracking-widest">
                                Ballroom Space
                            </Badge>
                        </div>
                        <SheetTitle className="text-2xl font-bold tracking-tight text-left">
                            {ballroom.name}
                        </SheetTitle>
                        <SheetDescription className="text-sm mt-1">
                            Technical specifications and layout details.
                        </SheetDescription>
                    </div>

                    {/* Specs */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Info className="h-3 w-3" /> Technical Specs
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-muted/30 border space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Ruler className="size-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Dimensions</span>
                                </div>
                                <p className="text-lg font-bold">
                                    {ballroom.width} × {ballroom.depth} <span className="text-sm font-normal text-muted-foreground">{ballroom.unit_type}</span>
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Area: {(ballroom.width * ballroom.depth).toFixed(2)} {ballroom.unit_type}²
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-muted/30 border space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Users className="size-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">Max Capacity</span>
                                </div>
                                <p className="text-lg font-bold">
                                    {ballroom.capacity || "—"} <span className="text-sm font-normal text-muted-foreground">pax</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Atlas reference */}
                    {ballroom.atlas_ballroom && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Box className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Template Reference</span>
                                <p className="text-sm font-semibold text-primary">{ballroom.atlas_ballroom.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold border-b pb-2">
                            <Info className="size-4 text-primary" />
                            Description
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {ballroom.description || "No description provided for this space."}
                        </p>
                    </div>

                    {/* Pending notice */}
                    {ballroom.status === 'pending' && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                            <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-amber-600">Awaiting Admin Approval</p>
                                <p className="text-[11px] text-amber-600/70 mt-0.5">
                                    This space is pending review. You&apos;ll be able to use it in layouts once approved.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Imported</span>
                            </div>
                            <span className="font-mono font-medium">{new Date(ballroom.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
