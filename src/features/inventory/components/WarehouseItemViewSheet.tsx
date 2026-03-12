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
    Package,
    MapPin,
    Zap,
    Maximize2,
    Weight,
    DollarSign,
    Layers,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { WarehouseItem } from "../types";

interface WarehouseItemViewSheetProps {
    item: WarehouseItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
    pending: { label: "Pending", className: "bg-amber-500 text-white border-none shadow-lg", icon: Clock },
    approved: { label: "Approved", className: "bg-emerald-500 text-white border-none shadow-lg", icon: CheckCircle2 },
    rejected: { label: "Rejected", className: "bg-red-500 text-white border-none shadow-lg", icon: XCircle },
};

export function WarehouseItemViewSheet({
    item,
    open,
    onOpenChange,
}: WarehouseItemViewSheetProps) {
    if (!item) return null;

    const status = statusConfig[item.approval_status] || statusConfig.pending;
    const imageUrl = item.asset?.image || null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[450px] gap-0 p-0 overflow-y-auto">
                {/* Image preview */}
                {imageUrl ? (
                    <div className="w-full aspect-video relative bg-muted overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt={item.title || ""}
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
                    {/* Title */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="font-semibold px-2 py-0 border-primary/20 bg-primary/10 text-primary uppercase text-[10px] tracking-widest">
                                {item.asset?.atlas_categories?.name || "Warehouse Item"}
                            </Badge>
                            <Badge variant="outline" className="font-medium px-2 py-0 text-[10px]">
                                Qty: {item.quantity}
                            </Badge>
                        </div>
                        <SheetTitle className="text-2xl font-bold tracking-tight text-left">
                            {item.title}
                        </SheetTitle>
                        <SheetDescription className="text-sm mt-1">
                            {item.brand} {item.model}
                        </SheetDescription>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <MapPin className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Location</span>
                                <p className="text-sm font-semibold">{item.warehouse_location || "Not assigned"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Rate</span>
                                <p className="text-sm font-semibold">{item.pricing ? `$${item.pricing}/day` : "TBD"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Info className="h-3 w-3" /> Technical Specs
                        </h4>
                        <div className="grid grid-cols-2 gap-px bg-border/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dimensions</span>
                                <span className="text-lg font-semibold">{item.dimensions || "—"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Weight</span>
                                <span className="text-lg font-semibold">{item.weight ? `${item.weight} kg` : "—"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Power</span>
                                <span className="text-lg font-semibold">{item.power || "—"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Footprint</span>
                                <span className="text-lg font-semibold">
                                    {item.footprint_width && item.footprint_depth
                                        ? `${item.footprint_width} × ${item.footprint_depth}`
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-semibold border-b pb-2">
                                <Info className="size-4 text-primary" />
                                Description
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Pending notice */}
                    {item.approval_status === 'pending' && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                            <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-amber-600">Awaiting Admin Approval</p>
                                <p className="text-[11px] text-amber-600/70 mt-0.5">
                                    This item is pending review. You&apos;ll be able to use it once approved.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Added</span>
                            </div>
                            <span className="font-mono font-medium">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
