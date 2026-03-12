import { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAtlasAssets } from "../../assets";
import { AtlasAsset } from "../../assets/types";

interface AssetSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (asset: AtlasAsset) => void;
    selectedAssetIds: string[];
}

export function AssetSelectionDialog({
    open,
    onOpenChange,
    onSelect,
    selectedAssetIds,
}: AssetSelectionDialogProps) {
    const { assets, loading } = useAtlasAssets();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const filteredAssets = useMemo(() => {
        return assets.filter((asset) => {
            const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
            const matchesType = typeFilter === "all" || asset.placement_type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [assets, search, typeFilter]);

    const placementTypes = useMemo(() => {
        const types = new Set(assets.map(a => a.placement_type));
        return Array.from(types);
    }, [assets]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] max-h-[85vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                <DialogHeader className="p-6 pb-2 bg-muted/20 text-left">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Package className="size-5 text-primary" />
                        Asset Selection
                    </DialogTitle>
                    <DialogDescription>
                        Search and select global assets to include in this bundle.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 border-b bg-background flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 h-10 rounded-lg text-sm"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide w-full md:w-auto">
                        <Button
                            variant={typeFilter === "all" ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setTypeFilter("all")}
                            className="h-9 px-4 rounded-lg text-xs"
                        >
                            All
                        </Button>
                        {placementTypes.map(type => (
                            <Button
                                key={type}
                                variant={typeFilter === type ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setTypeFilter(type)}
                                className="h-9 px-4 rounded-lg text-xs capitalize"
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pt-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Package className="size-10 animate-pulse mb-4 opacity-20" />
                            <p className="text-sm">Loading assets...</p>
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/5">
                            <Search className="size-8 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground text-sm font-medium">No assets found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredAssets.map((asset) => {
                                const isAlreadySelected = selectedAssetIds.includes(asset.id);
                                return (
                                    <div
                                        key={asset.id}
                                        className={`group relative p-3.5 rounded-xl border transition-all flex items-center gap-4 shadow-sm ${isAlreadySelected
                                            ? 'bg-primary/5 border-primary/20 opacity-60 pointer-events-none'
                                            : 'hover:border-primary/40 hover:bg-muted/5 bg-background'
                                            }`}
                                    >
                                        <div className="size-16 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                                            {asset.image ? (
                                                <img
                                                    src={asset.image}
                                                    alt={asset.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <div className="size-full flex items-center justify-center">
                                                    <Package className="size-6 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h4 className="text-sm font-bold truncate">{asset.name}</h4>
                                                <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 py-0">
                                                    {asset.placement_type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-muted-foreground font-medium">Scale: {asset.default_scale}</span>
                                                <Button
                                                    size="sm"
                                                    variant={isAlreadySelected ? "ghost" : "default"}
                                                    disabled={isAlreadySelected}
                                                    onClick={() => onSelect(asset)}
                                                    className="h-7 text-[10px] px-3 gap-1 cursor-pointer"
                                                >
                                                    {isAlreadySelected ? "Added" : <><Plus className="size-3" /> Select</>}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
