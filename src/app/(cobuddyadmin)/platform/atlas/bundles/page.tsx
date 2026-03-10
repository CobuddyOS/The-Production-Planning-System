"use client";

import { useMemo } from "react";
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

type Bundle = {
    id: string;
    name: string;
    description: string;
    category: string;
    assetCount: number;
    imageUrl?: string;
    status: "Active" | "Inactive";
    createdAt: string;
};

const mockBundleCategories = ["Lighting Packages", "Audio Packages", "Full Show"];

const mockBundleAssets = [
    { id: "A-1023", name: "LED Uplight Pro", category: "Lighting" },
    { id: "A-1024", name: "Moving Head Spot 300W", category: "Lighting" },
    { id: "A-2051", name: "Wireless Handheld Mic", category: "Audio" },
    { id: "A-3050", name: "2x18\" Subwoofer", category: "Audio" },
];

const mockBundles: Bundle[] = [
    {
        id: "B-001",
        name: "Wedding Lighting Package",
        description: "16x uplights, 4x moving heads, control console.",
        category: "Lighting Packages",
        assetCount: 24,
        status: "Active",
        createdAt: "2026-02-21",
    },
    {
        id: "B-002",
        name: "Conference Audio Essentials",
        description: "4x speakers, 4x wireless mics, mixer.",
        category: "Audio Packages",
        assetCount: 12,
        status: "Active",
        createdAt: "2026-02-28",
    },
];

export default function AtlasBundlesPage() {
    const bundles = useMemo(() => mockBundles, []);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Bundles</h2>
                    <p className="text-sm text-muted-foreground">
                        Curated packages of assets that tenants can import as presets.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm">Create Bundle</Button>
                    </DialogTrigger>
                    <CreateBundleDialog />
                </Dialog>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-3">
                    <CardTitle className="text-sm font-medium">
                        Bundle Library
                    </CardTitle>
                    <Input
                        placeholder="Search bundles..."
                        className="h-8 max-w-xs"
                    />
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bundle Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead># of Assets</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bundles.map((bundle) => (
                                    <TableRow key={bundle.id}>
                                        <TableCell className="max-w-xs">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">
                                                    {bundle.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {bundle.description}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{bundle.category}</TableCell>
                                        <TableCell>{bundle.assetCount}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    bundle.status === "Active"
                                                        ? "secondary"
                                                        : "outline"
                                                }
                                            >
                                                {bundle.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {bundle.createdAt}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button size="xs" variant="outline">
                                                        View assets
                                                    </Button>
                                                </SheetTrigger>
                                                <BundleAssetsSheet />
                                            </Sheet>
                                            <Button size="xs" variant="outline">
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function CreateBundleDialog() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Bundle</DialogTitle>
                <DialogDescription>
                    Group multiple assets into a reusable bundle that tenants can
                    import as a package.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-1">
                    <label className="text-xs font-medium">Bundle Name</label>
                    <Input placeholder="e.g. Wedding Lighting Package" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Description</label>
                    <Input placeholder="Short description of what this bundle includes" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Category</label>
                    <Select>
                        <SelectTrigger size="sm" className="w-full">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockBundleCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Bundle Image</label>
                    <Input type="file" />
                    <p className="text-[11px] text-muted-foreground">
                        Mock upload field for now. Connect to Supabase storage later.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium">Select Assets</label>
                    <div className="rounded-md border bg-muted/40 p-3 space-y-2">
                        {mockBundleAssets.map((asset) => (
                            <div
                                key={asset.id}
                                className="flex items-center justify-between gap-2 rounded-md bg-background px-3 py-2 text-xs"
                            >
                                <div>
                                    <div className="font-medium text-sm">
                                        {asset.name}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                        {asset.category}
                                    </div>
                                </div>
                                <Button size="xs" variant="outline">
                                    Add
                                </Button>
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                        Multi-select UI is mocked. Backend will later persist the
                        selected asset IDs.
                    </p>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium">Status</label>
                    <Select defaultValue="Active">
                        <SelectTrigger size="sm" className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" size="sm">
                    Cancel
                </Button>
                <Button size="sm">Create Bundle</Button>
            </DialogFooter>
        </DialogContent>
    );
}

function BundleAssetsSheet() {
    return (
        <SheetContent side="right">
            <SheetHeader>
                <SheetTitle>Bundle Assets</SheetTitle>
                <SheetDescription>
                    Preview of assets included in this bundle. Backend will later
                    populate this dynamically.
                </SheetDescription>
            </SheetHeader>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-2">
                {mockBundleAssets.map((asset) => (
                    <div
                        key={asset.id}
                        className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-xs"
                    >
                        <div>
                            <div className="font-medium text-sm">{asset.name}</div>
                            <div className="text-[11px] text-muted-foreground">
                                {asset.category}
                            </div>
                        </div>
                        <Badge variant="outline">Included</Badge>
                    </div>
                ))}
            </div>
            <SheetFooter>
                <Button size="sm" variant="outline">
                    Close
                </Button>
            </SheetFooter>
        </SheetContent>
    );
}

