"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter, Package, Zap, Scale, Layout, Box, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Calendar, Info, ExternalLink } from "lucide-react";

type AtlasAsset = {
    id: string;
    name: string;
    category: string;
    placementType: "click" | "drag";
    defaultScale: "low" | "medium" | "large";
    description?: string;
    manufacturer?: string;
    model?: string;
    imageUrl?: string;
    status: "Active" | "Inactive";
    createdAt: string;
};

const mockAssetCategories = ["Lighting", "Audio", "Visual", "Rigging"];

const mockAssets: AtlasAsset[] = [
    {
        id: "A-1023",
        name: "LED Uplight Pro",
        category: "Lighting",
        placementType: "drag",
        defaultScale: "medium",
        description: "RGBAW uplight with wireless DMX.",
        manufacturer: "BrightStage",
        model: "UP-150",
        imageUrl: "/placeholder/led-uplight.png",
        status: "Active",
        createdAt: "2026-03-08",
    },
    {
        id: "A-0982",
        name: "Wireless Handheld Mic",
        category: "Audio",
        placementType: "click",
        defaultScale: "low",
        description: "Digital wireless handheld microphone system.",
        manufacturer: "SoundField",
        model: "VX-4",
        imageUrl: "/placeholder/mic.png",
        status: "Active",
        createdAt: "2026-03-06",
    },
    {
        id: "A-0871",
        name: "4K Projector 6K Lumens",
        category: "Visual",
        placementType: "drag",
        defaultScale: "large",
        description: "High brightness 4K projector for large venues.",
        manufacturer: "ViewCast",
        model: "4K-6000",
        imageUrl: "/placeholder/projector.png",
        status: "Inactive",
        createdAt: "2026-03-05",
    },
];

export default function AtlasAssetsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">(
        "all"
    );
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [selectedAsset, setSelectedAsset] = useState<AtlasAsset | null>(null);
    const [viewingAsset, setViewingAsset] = useState<AtlasAsset | null>(null);

    const assets = useMemo(() => mockAssets, []);

    const filtered = assets.filter((asset) => {
        const matchesSearch =
            search.trim().length === 0 ||
            asset.name.toLowerCase().includes(search.toLowerCase()) ||
            asset.category.toLowerCase().includes(search.toLowerCase()) ||
            asset.description?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || asset.status === statusFilter;

        const matchesCategory =
            categoryFilter === "all" || asset.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Assets</h2>
                    <p className="text-sm text-muted-foreground">
                        Global asset definitions and hardware specifications for the platform.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Asset
                        </Button>
                    </DialogTrigger>
                    <AssetFormDialog />
                </Dialog>

                <Dialog
                    open={!!selectedAsset}
                    onOpenChange={(open) => !open && setSelectedAsset(null)}
                >
                    {selectedAsset && (
                        <AssetFormDialog asset={selectedAsset} />
                    )}
                </Dialog>
            </div>

            <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Asset Library
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search assets..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 h-9 rounded-lg"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as "all" | "Active" | "Inactive")
                            }
                        >
                            <SelectTrigger className="h-9 w-[130px] rounded-lg">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={categoryFilter}
                            onValueChange={(value) => setCategoryFilter(value)}
                        >
                            <SelectTrigger className="h-9 w-[160px] rounded-lg">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {mockAssetCategories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-b-xl border-t">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Asset Details</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Scale</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {filtered.map((asset) => (
                                    <TableRow
                                        key={asset.id}
                                        className="group hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => setViewingAsset(asset)}
                                    >
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{asset.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {asset.manufacturer} · {asset.model}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary">
                                                {asset.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary capitalize">
                                                {asset.placementType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-amber-500/20 bg-amber-500/5 text-amber-600 capitalize">
                                                {asset.defaultScale}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={asset.status === "Active"
                                                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"}
                                            >
                                                {asset.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setSelectedAsset(asset)}>
                                                        Edit Asset
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setViewingAsset(asset)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AssetDetailsSheet
                asset={viewingAsset}
                onClose={() => setViewingAsset(null)}
            />
        </div>
    );
}

function AssetFormDialog({ asset }: { asset?: AtlasAsset }) {
    const isEdit = Boolean(asset);

    return (
        <DialogContent className="sm:max-w-[600px] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
            <DialogHeader className="p-6 pb-2 bg-muted/20 text-left">
                <DialogTitle className="text-xl">
                    {isEdit ? "Edit Asset" : "Create Asset"}
                </DialogTitle>
                <DialogDescription>
                    {isEdit
                        ? "Update the global asset definition and specifications."
                        : "Define a new global asset. Tenants will later import this into their own inventory."}
                </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Asset Name</label>
                        <Input
                            defaultValue={asset?.name}
                            placeholder="e.g. LED Uplight Pro"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Category</label>
                        <Select defaultValue={asset?.category}>
                            <SelectTrigger size="sm" className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockAssetCategories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium">Description (Optional)</label>
                    <Input
                        defaultValue={asset?.description}
                        placeholder="Short internal description of the asset"
                    />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Placement Type</label>
                        <Select defaultValue={asset?.placementType ?? "click"}>
                            <SelectTrigger size="sm" className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="click">Click</SelectItem>
                                <SelectItem value="drag">Drag</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Default Scale</label>
                        <Select defaultValue={asset?.defaultScale ?? "medium"}>
                            <SelectTrigger size="sm" className="w-full">
                                <SelectValue placeholder="Select scale" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Manufacturer (Optional)</label>
                        <Input
                            defaultValue={asset?.manufacturer}
                            placeholder="e.g. BrightStage"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Model (Optional)</label>
                        <Input
                            defaultValue={asset?.model}
                            placeholder="e.g. UP-150"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium">Asset Image Upload</label>
                    <Input type="file" />
                    <p className="text-[11px] text-muted-foreground">
                        Mock upload field. In the future, this will be connected to Supabase storage.
                    </p>
                </div>

                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="space-y-0.5">
                        <p className="text-xs font-medium">Status</p>
                        <p className="text-[11px] text-muted-foreground">
                            Inactive assets won&apos;t be visible to tenants for new
                            imports.
                        </p>
                    </div>
                    <Select defaultValue={asset?.status ?? "Active"}>
                        <SelectTrigger size="sm" className="w-28">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter className="p-6 bg-muted/20 border-t">
                <Button variant="outline" onClick={() => { }}>
                    Cancel
                </Button>
                <Button>{isEdit ? "Save Changes" : "Create Asset"}</Button>
            </DialogFooter>
        </DialogContent >
    );
}

function AssetDetailsSheet({
    asset,
    onClose
}: {
    asset: AtlasAsset | null;
    onClose: () => void;
}) {
    if (!asset) return null;

    return (
        <Sheet open={!!asset} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-[450px] p-0 border-l border-border/50 shadow-2xl overflow-y-auto">
                <div className="h-56 w-full relative bg-muted">
                    {asset.imageUrl ? (
                        <div className="h-full w-full flex items-center justify-center p-8 bg-gradient-to-br from-muted to-muted/50">
                            <Package className="h-24 w-24 text-primary/20 absolute opacity-50" />
                            <div className="relative z-10 w-full h-full flex items-center justify-center border-2 border-dashed border-primary/20 rounded-xl">
                                <span className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                                    <Layout className="h-4 w-4" /> Asset Preview Image
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-16 w-16 text-muted-foreground/20" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <Badge
                            className={asset.status === "Active"
                                ? "bg-emerald-500 text-white border-none shadow-lg"
                                : "bg-red-500 text-white border-none shadow-lg"}
                        >
                            {asset.status}
                        </Badge>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="font-semibold px-2 py-0 border-primary/20 bg-primary/10 text-primary uppercase text-[10px] tracking-widest">
                                {asset.category}
                            </Badge>
                        </div>
                        <SheetTitle className="text-2xl font-bold tracking-tight text-left">{asset.name}</SheetTitle>
                        <SheetDescription className="mt-4 text-muted-foreground leading-relaxed text-sm text-left">
                            {asset.description}
                        </SheetDescription>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Info className="h-3 w-3" /> Basic Configuration
                        </h4>
                        <div className="grid grid-cols-2 gap-px bg-border/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Placement</span>
                                <span className="text-lg font-semibold capitalize">{asset.placementType}</span>
                            </div>
                            <div className="bg-background p-4 flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Default Scale</span>
                                <span className="text-lg font-semibold capitalize">{asset.defaultScale}</span>
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
                                <span className="font-mono font-medium">{asset.createdAt}</span>
                            </div>
                            {asset.manufacturer && (
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Layout className="h-4 w-4" />
                                        <span>Manufacturer</span>
                                    </div>
                                    <span className="font-mono font-medium">{asset.manufacturer}</span>
                                </div>
                            )}
                            {asset.model && (
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Box className="h-4 w-4" />
                                        <span>Model</span>
                                    </div>
                                    <span className="font-mono font-medium">{asset.model}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button className="flex-1 shadow-lg shadow-primary/20">Edit Asset</Button>
                        <Button variant="outline" className="flex-1 gap-2">
                            <ExternalLink className="h-3 w-3" /> Specs
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

