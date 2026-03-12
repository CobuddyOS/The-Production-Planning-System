import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Info,
    Box,
    Package,
    MapPin,
    Tag,
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

export function WarehouseItemViewSheet({
    item,
    open,
    onOpenChange,
}: WarehouseItemViewSheetProps) {
    if (!item) return null;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved': return { color: 'bg-emerald-500', icon: CheckCircle2, label: 'Approved' };
            case 'pending': return { color: 'bg-amber-500', icon: Clock, label: 'Pending Approval' };
            case 'rejected': return { color: 'bg-red-500', icon: XCircle, label: 'Rejected' };
            default: return { color: 'bg-slate-500', icon: Info, label: status };
        }
    };

    const statusObj = getStatusConfig(item.approval_status);
    const StatusIcon = statusObj.icon;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[500px] p-0 border-l border-border/50 shadow-2xl overflow-y-auto bg-background">
                <div className="h-64 w-full relative bg-muted/30 overflow-hidden flex items-center justify-center p-8">
                    {item.asset?.image ? (
                        <img
                            src={item.asset.image}
                            alt={item.title || ""}
                            className="h-full w-full object-contain drop-shadow-2xl"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <Box className="h-24 w-24 text-primary/10" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <Badge className={`${statusObj.color} text-white border-none shadow-lg px-3 py-1 gap-1.5 flex items-center`}>
                            <StatusIcon className="size-3.5" />
                            {statusObj.label}
                        </Badge>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-black px-2 py-0 border-primary/20 bg-primary/5 text-primary uppercase text-[10px] tracking-widest rounded-md">
                                {item.asset?.atlas_categories?.name || "Global Asset"}
                            </Badge>
                            <Badge variant="secondary" className="px-2 py-0 text-[10px] font-bold uppercase rounded-md">
                                Qty: {item.quantity}
                            </Badge>
                        </div>
                        <SheetTitle className="text-3xl font-black tracking-tighter text-left leading-none">{item.title}</SheetTitle>
                        <p className="text-sm text-muted-foreground mt-2 font-medium">
                            {item.brand} {item.model}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                                <MapPin className="size-5 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-1">Location</span>
                                <span className="text-sm font-bold truncate">{item.warehouse_location || "Not assigned"}</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                                <DollarSign className="size-5 text-emerald-500" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-1">Rental Rate</span>
                                <span className="text-sm font-bold truncate">{item.pricing ? `$${item.pricing} / day` : "TBD"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-1">
                            Technical Specifications
                        </h4>
                        <div className="grid grid-cols-2 gap-px bg-border/50 border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-background p-4 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Maximize2 className="size-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Dimensions</span>
                                </div>
                                <span className="text-sm font-bold">{item.dimensions || "N/A"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Weight className="size-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Weight</span>
                                </div>
                                <span className="text-sm font-bold">{item.weight ? `${item.weight} kg` : "N/A"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Zap className="size-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Power</span>
                                </div>
                                <span className="text-sm font-bold">{item.power || "N/A"}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Layers className="size-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Footprint</span>
                                </div>
                                <span className="text-sm font-bold">
                                    {item.footprint_width && item.footprint_depth
                                        ? `${item.footprint_width}m x ${item.footprint_depth}m`
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {item.description && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Description</h4>
                            <div className="p-4 rounded-2xl bg-muted/10 border border-dashed border-border text-sm leading-relaxed text-muted-foreground italic">
                                "{item.description}"
                            </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="size-4" />
                            <span>Added {new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
