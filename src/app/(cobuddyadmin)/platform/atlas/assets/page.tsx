"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import { Search, Plus, Package, MoreHorizontal, Layout } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    useAtlasAssets,
    AssetFormDialog,
    DeleteAssetDialog,
    AssetDetailsSheet,
    type AtlasAsset
} from "@/features/atlas/assets";
import { useAtlasCategories } from "@/features/atlas/categories";

export default function AtlasAssetsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [selectedAsset, setSelectedAsset] = useState<AtlasAsset | null>(null);
    const [viewingAsset, setViewingAsset] = useState<AtlasAsset | null>(null);
    const [assetToDelete, setAssetToDelete] = useState<AtlasAsset | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { assets, loading, refresh, deleteAsset } = useAtlasAssets();
    const { categories } = useAtlasCategories();

    const filtered = useMemo(() => {
        return assets.filter((asset) => {
            const matchesSearch =
                search.trim().length === 0 ||
                asset.name.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || asset.status === statusFilter;

            const matchesCategory =
                categoryFilter === "all" || asset.category_id === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [assets, search, statusFilter, categoryFilter]);

    const handleDelete = async (id: string) => {
        const result = await deleteAsset(id);
        if (!result.success) {
            alert(result.error?.message || "Failed to delete asset");
        }
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Assets</h2>
                    <p className="text-sm text-muted-foreground">
                        Global asset definitions and hardware specifications for the platform.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Asset
                            </Button>
                        </DialogTrigger>
                        <AssetFormDialog
                            onSuccess={() => {
                                setIsCreateOpen(false);
                                refresh();
                            }}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </Dialog>
                </div>

                <Dialog
                    open={!!selectedAsset}
                    onOpenChange={(open) => !open && setSelectedAsset(null)}
                >
                    {selectedAsset && (
                        <AssetFormDialog
                            asset={selectedAsset}
                            onSuccess={() => {
                                setSelectedAsset(null);
                                refresh();
                            }}
                            onCancel={() => setSelectedAsset(null)}
                        />
                    )}
                </Dialog>

                <DeleteAssetDialog
                    asset={assetToDelete}
                    open={!!assetToDelete}
                    onOpenChange={(open) => !open && setAssetToDelete(null)}
                    onConfirm={handleDelete}
                />
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
                            onValueChange={(value) => setStatusFilter(value as any)}
                        >
                            <SelectTrigger className="h-9 w-[130px] rounded-lg cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={categoryFilter}
                            onValueChange={(value) => setCategoryFilter(value)}
                        >
                            <SelectTrigger className="h-9 w-[160px] rounded-lg cursor-pointer">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
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
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Asset Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Scale</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {loading && assets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            Loading assets...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            {search || statusFilter !== "all" || categoryFilter !== "all"
                                                ? "No assets match your filters."
                                                : "No assets found. Create your first asset to get started."}
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((asset) => (
                                    <TableRow
                                        key={asset.id}
                                        className="group hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => setViewingAsset(asset)}
                                    >
                                        <TableCell>
                                            <div className="h-10 w-10 rounded-md bg-muted overflow-hidden border border-border/50">
                                                {asset.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={asset.image}
                                                        alt={asset.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center">
                                                        <Layout className="size-4 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold">{asset.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary">
                                                {asset.atlas_categories?.name || "Uncategorized"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary capitalize">
                                                {asset.placement_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-amber-500/20 bg-amber-500/5 text-amber-600 capitalize">
                                                {asset.default_scale}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`font-normal ${asset.status === 'active'
                                                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                                                    : 'border-red-500/20 bg-red-500/5 text-red-600'
                                                    }`}
                                            >
                                                {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setSelectedAsset(asset)} className="cursor-pointer">
                                                        Edit Asset
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setViewingAsset(asset)} className="cursor-pointer">
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive cursor-pointer"
                                                        onClick={() => setAssetToDelete(asset)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
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
                open={!!viewingAsset}
                onOpenChange={(open) => !open && setViewingAsset(null)}
                onEdit={(asset) => setSelectedAsset(asset)}
            />
        </div>
    );
}
