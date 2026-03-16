"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Layers, Grid, Zap, Activity, ChevronRight, Layout, Search } from "lucide-react";
import { useAtlasAssets } from "@/features/atlas/assets";
import { useAtlasCategories } from "@/features/atlas/categories";
import { useAtlasBundles } from "@/features/atlas/bundles";
import { cn } from "@/lib/utils";

function formatDate(dateString: string) {
    try {
        return new Date(dateString).toLocaleDateString();
    } catch {
        return dateString;
    }
}

export default function AtlasPage() {
    const { assets, loading: assetsLoading } = useAtlasAssets();
    const { categories, loading: categoriesLoading } = useAtlasCategories();
    const { bundles, loading: bundlesLoading } = useAtlasBundles();

    const recentAssets = assets.slice(0, 6);

    const overviewStats = {
        totalAssets: assets.length,
        totalCategories: categories.length,
        totalBundles: bundles.length,
        recentAssets: recentAssets.length,
    };

    const recentActivity = [
        ...assets.slice(0, 2).map((asset) => ({
            id: asset.id,
            type: "asset_created" as const,
            title: "Asset created",
            description: `“${asset.name}” added to ${asset.atlas_categories?.name || "Atlas"}`,
            timestamp: formatDate(asset.created_at),
        })),
        ...bundles.slice(0, 2).map((bundle) => ({
            id: bundle.id,
            type: "bundle_created" as const,
            title: "Bundle created",
            description: `“${bundle.name}” bundle configured`,
            timestamp: formatDate(bundle.created_at),
        })),
    ];
    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-wrap items-center justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <span className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_10px_oklch(0.75_0.18_190_/_0.5)]" />
                        Atlas <span className="text-primary/80 font-light">Overview</span>
                    </h2>
                    <p className="text-sm text-muted-foreground/80 font-medium">
                        Central management for global assets, categories, and bundles.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            placeholder="Search assets..."
                            className="bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 w-64 transition-all focus:w-80"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Assets", value: overviewStats.totalAssets, icon: Package, desc: "Across all categories", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
                    { title: "Total Categories", value: overviewStats.totalCategories, icon: Grid, desc: "Logical asset groups", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
                    { title: "Total Bundles", value: overviewStats.totalBundles, icon: Layers, desc: "Reusable packages", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
                    { title: "Recently Added", value: overviewStats.recentAssets, icon: Zap, desc: "Most recent assets", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
                ].map((stat, i) => (
                    <Card key={i} className="neon-glass-card group hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`${stat.bg} ${stat.border} border p-2.5 rounded-xl transition-all group-hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                                <stat.icon className={`h-4 w-4 ${stat.color} transition-transform group-hover:scale-110`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white tracking-tight">{stat.value.toLocaleString()}</div>
                            <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium flex items-center gap-1 uppercase tracking-tighter">
                                {stat.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 neon-glass-card overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-6 px-6 pt-6 border-b border-white/5">
                        <CardTitle className="text-lg font-bold flex items-center gap-3 text-white">
                            <Activity className="h-5 w-5 text-primary drop-shadow-[0_0_8px_oklch(0.75_0.18_190_/_0.5)]" />
                            Recent Asset Definitions
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary hover:bg-primary/10">
                            View All <ChevronRight className="ml-1 size-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="">
                            <Table>
                                <TableHeader className="bg-white/[0.02]">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="pl-6 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Asset Name</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Category</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Status</TableHead>
                                        <TableHead className="text-right pr-6 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assetsLoading && recentAssets.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-16 text-muted-foreground italic">
                                                Loading assets from global registry...
                                            </TableCell>
                                        </TableRow>
                                    ) : recentAssets.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
                                                No assets found in registry.
                                            </TableCell>
                                        </TableRow>
                                    ) : recentAssets.map((asset) => (
                                        <TableRow key={asset.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                                            <TableCell className="font-bold text-sm text-white pl-6 py-4">{asset.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-bold border-primary/20 bg-primary/5 text-primary text-[10px] px-2.5 py-0.5 rounded-full">
                                                    {asset.atlas_categories?.name || "Uncategorized"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                                                        asset.status === "active" ? "bg-emerald-400 text-emerald-400" : "bg-red-400 text-red-400"
                                                    )} />
                                                    <span className={cn(
                                                        "text-xs font-bold",
                                                        asset.status === "active" ? "text-emerald-400/80" : "text-red-400/80"
                                                    )}>
                                                        {asset.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-[11px] text-muted-foreground font-mono pr-6">
                                                {formatDate(asset.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="neon-glass-card">
                    <CardHeader className="pb-6 border-b border-white/5">
                        <CardTitle className="text-lg font-bold flex items-center gap-3 text-white">
                            <Layout className="h-5 w-5 text-primary drop-shadow-[0_0_8px_oklch(0.75_0.18_190_/_0.5)]" />
                            System Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-8 px-6">
                        {(assetsLoading || bundlesLoading) && recentActivity.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">Syncing activity logs...</p>
                        ) : recentActivity.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent activity detected.</p>
                        ) : recentActivity.map((item, i) => (
                            <div key={item.id} className="relative flex gap-5">
                                {i !== recentActivity.length - 1 && (
                                    <div className="absolute left-[9px] top-7 bottom-[-32px] w-0.5 bg-gradient-to-b from-primary/30 to-transparent" />
                                )}
                                <div className="z-10 mt-1 h-5 w-5 rounded-full bg-sidebar border border-primary/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_oklch(0.75_0.18_190_/_0.3)]">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="font-bold text-sm text-white tracking-tight">{item.title}</p>
                                    <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                                        {item.description}
                                    </p>
                                    <p className="text-[10px] font-bold text-primary/70 pt-1 flex items-center gap-1.5 uppercase tracking-widest">
                                        <Zap className="h-3 w-3" /> {item.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

