import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Layers, Grid, Zap, Activity, ChevronRight, Layout } from "lucide-react";

const overviewStats = {
    totalAssets: 248,
    totalCategories: 19,
    totalBundles: 34,
    recentAssets: 12,
};

const recentAssets = [
    {
        id: "A-1023",
        name: "LED Uplight Pro",
        category: "Lighting",
        status: "Active",
        createdAt: "2026-03-08",
    },
    {
        id: "A-0982",
        name: "Wireless Handheld Mic",
        category: "Audio",
        status: "Active",
        createdAt: "2026-03-06",
    },
    {
        id: "A-0871",
        name: "4K Projector 6K Lumens",
        category: "Visual",
        status: "Draft",
        createdAt: "2026-03-05",
    },
    {
        id: "A-0799",
        name: "Truss Corner Block",
        category: "Rigging",
        status: "Active",
        createdAt: "2026-03-02",
    },
];

const recentActivity = [
    {
        id: 1,
        type: "asset_created",
        title: "New asset created",
        description: "“LED Uplight Pro” added to Lighting",
        timestamp: "5 minutes ago",
    },
    {
        id: 2,
        type: "bundle_updated",
        title: "Bundle updated",
        description: "“Wedding Lighting Package” now includes 16 fixtures",
        timestamp: "32 minutes ago",
    },
    {
        id: 3,
        type: "category_created",
        title: "Category created",
        description: "“Special FX” category created",
        timestamp: "Today, 09:12",
    },
    {
        id: 4,
        type: "asset_archived",
        title: "Asset archived",
        description: "Legacy smoke machine marked inactive",
        timestamp: "Yesterday, 18:23",
    },
];

export default function AtlasPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Atlas Overview</h2>
                    <p className="text-sm text-muted-foreground">
                        Central management for global assets, categories, and bundles.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Category
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Bundle
                    </Button>
                    <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
                        <Package className="h-4 w-4" />
                        Add Asset
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Assets", value: overviewStats.totalAssets, icon: Package, desc: "Across all categories", color: "text-blue-500", bg: "bg-blue-500/10" },
                    { title: "Total Categories", value: overviewStats.totalCategories, icon: Grid, desc: "Logical asset groups", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { title: "Total Bundles", value: overviewStats.totalBundles, icon: Layers, desc: "Reusable packages", color: "text-purple-500", bg: "bg-purple-500/10" },
                    { title: "Recently Added", value: overviewStats.recentAssets, icon: Zap, desc: "Added last 7 days", color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-muted/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`${stat.bg} p-2 rounded-lg`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {stat.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-sm bg-muted/30 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-6 px-6 pt-6">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Recent Asset Definitions
                        </CardTitle>
                        <Button size="xs" variant="ghost" className="text-primary hover:bg-primary/5 gap-1">
                            View library <ChevronRight className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border-t">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="pl-6">Asset Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right pr-6">Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-background/50">
                                    {recentAssets.map((asset) => (
                                        <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium pl-6">{asset.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary">
                                                    {asset.category}
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
                                            <TableCell className="text-right text-xs text-muted-foreground font-mono pr-6">
                                                {asset.createdAt}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-muted/30">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Layout className="h-5 w-5 text-primary" />
                            Global Activity Feed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {recentActivity.map((item, i) => (
                            <div key={item.id} className="relative flex gap-4">
                                {i !== recentActivity.length - 1 && (
                                    <div className="absolute left-2.5 top-8 bottom-0 w-px bg-border" />
                                )}
                                <div className="z-10 mt-1 h-5 w-5 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center shrink-0 shadow-sm" />
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">{item.title}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {item.description}
                                    </p>
                                    <p className="text-[10px] font-medium text-muted-foreground pt-1 flex items-center gap-1">
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

