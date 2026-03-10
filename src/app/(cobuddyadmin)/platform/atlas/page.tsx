import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                        Create Category
                    </Button>
                    <Button size="sm" variant="outline">
                        Create Bundle
                    </Button>
                    <Button size="sm">Add Asset</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Assets
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {overviewStats.totalAssets.toLocaleString()}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Across all global categories
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {overviewStats.totalCategories}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Logical groupings for assets
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bundles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {overviewStats.totalBundles}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Reusable packages for tenants
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Recently Added
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {overviewStats.recentAssets}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Assets added in the last 7 days
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                        <CardTitle className="text-sm font-medium">
                            Recent Assets
                        </CardTitle>
                        <Button size="xs" variant="outline">
                            View all
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Created
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentAssets.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-medium">
                                            {asset.name}
                                        </TableCell>
                                        <TableCell>{asset.category}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    asset.status === "Active"
                                                        ? "secondary"
                                                        : "outline"
                                                }
                                            >
                                                {asset.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {asset.createdAt}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="mt-1 h-2 w-2 rounded-full bg-foreground" />
                                <div className="space-y-1">
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.description}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {item.timestamp}
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

