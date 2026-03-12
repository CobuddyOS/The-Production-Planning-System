import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Info, CheckCircle2 } from "lucide-react";
import { AtlasBundle } from "../types";

interface BundleDetailsSheetProps {
    bundle: AtlasBundle | null;
}

export function BundleDetailsSheet({ bundle }: BundleDetailsSheetProps) {
    if (!bundle) return null;

    return (
        <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader className="pb-6 px-8 border-b text-left">
                <div className="flex items-center gap-2 mb-2">
                    <Badge
                        variant="outline"
                        className={`${bundle.status === 'active'
                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                            : 'border-red-500/20 bg-red-500/5 text-red-600'
                            }`}
                    >
                        {bundle.status.charAt(0).toUpperCase() + bundle.status.slice(1)}
                    </Badge>
                    {bundle.category && (
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                            {bundle.category}
                        </Badge>
                    )}
                </div>
                <SheetTitle className="text-2xl font-bold">{bundle.name}</SheetTitle>
                <SheetDescription className="text-sm">
                    Review bundle configuration and included equipment.
                </SheetDescription>
            </SheetHeader>

            <div className="space-y-8 py-8 px-8">
                {/* Description */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold border-b pb-2">
                        <Info className="size-4 text-primary" />
                        Bundle Overview
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {bundle.description || "No description provided for this equipment bundle."}
                    </p>
                </div>

                {/* Bundle Items List */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold border-b pb-2">
                        <Package className="size-4 text-primary" />
                        Included Assets ({bundle.items?.length || 0})
                    </div>
                    <div className="space-y-3">
                        {bundle.items && bundle.items.length > 0 ? (
                            bundle.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl border bg-muted/20 group hover:border-primary/40 transition-all hover:bg-muted/40">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-xl overflow-hidden bg-background border shadow-sm shrink-0">
                                            {item.asset?.image ? (
                                                <img
                                                    src={item.asset.image}
                                                    alt={item.asset?.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <div className="size-full flex items-center justify-center">
                                                    <Package className="size-6 text-muted-foreground/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold truncate text-foreground/90">{item.asset?.name || "Unknown Asset"}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                                                {item.asset?.placement_type} • Scale: {item.asset?.default_scale}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                                        <span className="text-[10px] font-black text-primary/60">X</span>
                                        <span className="text-sm font-black text-primary">
                                            {item.quantity}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/5">
                                <Package className="size-8 mx-auto opacity-10 mb-3" />
                                <p className="text-xs font-medium">No assets included in this bundle.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Creation Metadata */}
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Created Date</span>
                            </div>
                            <span className="font-mono font-medium">{new Date(bundle.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </SheetContent>
    );
}
