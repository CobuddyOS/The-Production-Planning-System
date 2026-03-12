import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Info, Layout, Box, Package, ExternalLink } from "lucide-react";
import { AtlasAsset } from "../types";

interface AssetDetailsSheetProps {
    asset: AtlasAsset | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (asset: AtlasAsset) => void;
}

export function AssetDetailsSheet({
    asset,
    open,
    onOpenChange,
    onEdit
}: AssetDetailsSheetProps) {
    if (!asset) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[450px] p-0 border-l border-border/50 shadow-2xl overflow-y-auto">
                <div className="h-64 w-full relative bg-muted overflow-hidden">
                    {asset.image ? (
                        <div className="h-full w-full relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={asset.image}
                                alt={asset.name}
                                className="h-full w-full object-contain p-4"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <Package className="h-24 w-24 text-primary/10" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <Badge
                            className={asset.status === "active"
                                ? "bg-emerald-500 text-white border-none shadow-lg"
                                : "bg-red-500 text-white border-none shadow-lg"}
                        >
                            {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                        </Badge>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="font-semibold px-2 py-0 border-primary/20 bg-primary/10 text-primary uppercase text-[10px] tracking-widest">
                                {asset.atlas_categories?.name || "Uncategorized"}
                            </Badge>
                        </div>
                        <SheetTitle className="text-2xl font-bold tracking-tight text-left">{asset.name}</SheetTitle>
                        <SheetDescription className="mt-4 text-muted-foreground leading-relaxed text-sm text-left">
                            Global asset definition for {asset.name}. This template is available for all tenants.
                        </SheetDescription>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Info className="h-3 w-3" /> Technical Specs
                        </h4>
                        <div className="grid grid-cols-2 gap-px bg-border/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Placement</span>
                                <span className="text-lg font-semibold capitalize">{asset.placement_type}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Default Scale</span>
                                <span className="text-lg font-semibold capitalize">{asset.default_scale}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Created Date</span>
                                </div>
                                <span className="font-mono font-medium">{new Date(asset.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
