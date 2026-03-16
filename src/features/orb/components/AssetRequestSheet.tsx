import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Info,
    Package,
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";
import type { AssetRequest } from "../types";

interface AssetRequestSheetProps {
    request: AssetRequest | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateStatus: (id: string, status: "approved" | "rejected") => void;
}

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
    pending: { label: "Pending", className: "bg-amber-500 text-white border-none shadow-lg", icon: Clock },
    approved: { label: "Approved", className: "bg-emerald-500 text-white border-none shadow-lg", icon: CheckCircle2 },
    rejected: { label: "Rejected", className: "bg-red-500 text-white border-none shadow-lg", icon: XCircle },
};

export function AssetRequestSheet({
    request,
    open,
    onOpenChange,
    onUpdateStatus,
}: AssetRequestSheetProps) {
    if (!request) return null;

    const status = statusConfig[request.approval_status] || statusConfig.pending;
    const imageUrl = request.asset?.image || null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="neon-glass-form neon-form sm:max-w-[450px] gap-0 p-0 overflow-y-auto scrollbar-hide">
                {/* Image preview */}
                {imageUrl ? (
                    <div className="w-full aspect-video relative bg-muted overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt={request.title || ""}
                            className="h-full w-full object-contain p-4"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        <div className="absolute top-4 left-4">
                            <Badge className={status.className}>{status.label}</Badge>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 shrink-0 relative">
                        <Package className="h-20 w-20 text-primary/10" />
                        <div className="absolute top-4 left-4">
                            <Badge className={status.className}>{status.label}</Badge>
                        </div>
                    </div>
                )}

                <div className="p-8 space-y-8">
                    {/* Title section */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="font-semibold px-2 py-0 border-primary/20 bg-primary/10 text-primary uppercase text-[10px] tracking-widest">
                                Warehouse Item
                            </Badge>
                        </div>
                        <SheetTitle className="text-2xl font-bold tracking-tight text-left">
                            {request.title || request.asset?.name || "Untitled"}
                        </SheetTitle>
                        <SheetDescription className="text-sm mt-1">
                            {request.brand || "Generic"} • {request.model || "Standard"}
                        </SheetDescription>
                    </div>

                    {/* Tenant info */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tenant</span>
                            <p className="text-sm font-semibold">{request.tenant?.name || "Unknown Tenant"}</p>
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Info className="h-3 w-3" /> Technical Specs
                        </h4>
                        <div className="grid grid-cols-2 gap-px bg-border/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quantity</span>
                                <span className="text-lg font-semibold">×{request.quantity}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pricing</span>
                                <span className="text-lg font-semibold">{request.pricing ? `$${request.pricing}` : "—"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight</span>
                                <span className="text-lg font-semibold">{request.weight ? `${request.weight} kg` : "—"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Power</span>
                                <span className="text-lg font-semibold">{request.power || "—"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dimensions</span>
                                <span className="text-lg font-semibold">{request.dimensions || "—"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Location</span>
                                <span className="text-lg font-semibold">{request.warehouse_location || "—"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Footprint</span>
                                <span className="text-lg font-semibold">
                                    {request.footprint_width && request.footprint_depth
                                        ? `${request.footprint_width} × ${request.footprint_depth}`
                                        : "—"}
                                </span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Rotation</span>
                                <span className="text-lg font-semibold">{request.rotation_allowed ? "Yes" : "No"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-semibold border-b pb-2">
                                <Info className="size-4 text-primary" />
                                Description
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {request.description}
                            </p>
                        </div>
                    )}

                    {/* Date */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Submitted</span>
                            </div>
                            <span className="font-mono font-medium">{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Action buttons — always visible */}
                    <div className="pt-4 border-t space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Review Decision
                        </h4>
                        <div className="flex gap-2">
                            <Button
                                className="flex-1 gap-2 cursor-pointer border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                                variant="outline"
                                disabled={request.approval_status === "approved"}
                                onClick={() => onUpdateStatus(request.id, "approved")}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                {request.approval_status === "approved" ? "Approved" : "Approve"}
                            </Button>
                            <Button
                                className="flex-1 gap-2 cursor-pointer border-red-500/30 text-red-600 hover:bg-red-500/10"
                                variant="outline"
                                disabled={request.approval_status === "rejected"}
                                onClick={() => onUpdateStatus(request.id, "rejected")}
                            >
                                <XCircle className="h-4 w-4" />
                                {request.approval_status === "rejected" ? "Rejected" : "Reject"}
                            </Button>
                        </div>
                        {request.approval_status !== "pending" && (
                            <p className="text-[11px] text-muted-foreground text-center">
                                You can change this decision at any time.
                            </p>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
