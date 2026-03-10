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

type AtlasAsset = {
    id: string;
    name: string;
    category: string;
    description: string;
    widthCm: number;
    heightCm: number;
    depthCm: number;
    weightKg: number;
    power: string;
    manufacturer: string;
    model: string;
    imageUrl?: string;
    tags: string[];
    status: "Active" | "Inactive";
    createdAt: string;
};

const mockAssetCategories = ["Lighting", "Audio", "Visual", "Rigging"];

const mockAssets: AtlasAsset[] = [
    {
        id: "A-1023",
        name: "LED Uplight Pro",
        category: "Lighting",
        description: "RGBAW uplight with wireless DMX.",
        widthCm: 18,
        heightCm: 22,
        depthCm: 18,
        weightKg: 3.2,
        power: "230V / 150W",
        manufacturer: "BrightStage",
        model: "UP-150",
        imageUrl: "/placeholder/led-uplight.png",
        tags: ["uplight", "wash", "wireless"],
        status: "Active",
        createdAt: "2026-03-08",
    },
    {
        id: "A-0982",
        name: "Wireless Handheld Mic",
        category: "Audio",
        description: "Digital wireless handheld microphone system.",
        widthCm: 5,
        heightCm: 25,
        depthCm: 5,
        weightKg: 0.7,
        power: "AA Batteries",
        manufacturer: "SoundField",
        model: "VX-4",
        imageUrl: "/placeholder/mic.png",
        tags: ["wireless", "handheld"],
        status: "Active",
        createdAt: "2026-03-06",
    },
    {
        id: "A-0871",
        name: "4K Projector 6K Lumens",
        category: "Visual",
        description: "High brightness 4K projector for large venues.",
        widthCm: 45,
        heightCm: 18,
        depthCm: 38,
        weightKg: 11.4,
        power: "230V / 600W",
        manufacturer: "ViewCast",
        model: "4K-6000",
        imageUrl: "/placeholder/projector.png",
        tags: ["4k", "projector"],
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

    const assets = useMemo(() => mockAssets, []);

    const filtered = assets.filter((asset) => {
        const matchesSearch =
            search.trim().length === 0 ||
            asset.name.toLowerCase().includes(search.toLowerCase()) ||
            asset.category.toLowerCase().includes(search.toLowerCase()) ||
            asset.tags.some((tag) =>
                tag.toLowerCase().includes(search.toLowerCase())
            );

        const matchesStatus =
            statusFilter === "all" || asset.status === statusFilter;

        const matchesCategory =
            categoryFilter === "all" || asset.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Assets</h2>
                    <p className="text-sm text-muted-foreground">
                        Global asset definitions used by all tenants.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm">Create Asset</Button>
                    </DialogTrigger>
                    <CreateAssetDialog />
                </Dialog>
            </div>

            <Card>
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-sm font-medium">
                        Asset Library
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                        <Input
                            placeholder="Search assets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8 w-full max-w-xs"
                        />
                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as "all" | "Active" | "Inactive")
                            }
                        >
                            <SelectTrigger size="sm">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={categoryFilter}
                            onValueChange={(value) => setCategoryFilter(value)}
                        >
                            <SelectTrigger size="sm">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {mockAssetCategories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Dimensions</TableHead>
                                    <TableHead>Power</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell className="max-w-xs">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">
                                                    {asset.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {asset.manufacturer} · {asset.model}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{asset.category}</TableCell>
                                        <TableCell className="text-xs">
                                            {asset.widthCm}×{asset.depthCm}×
                                            {asset.heightCm} cm
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {asset.power}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {asset.weightKg} kg
                                        </TableCell>
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
                                        <TableCell className="text-xs text-muted-foreground">
                                            {asset.createdAt}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button size="xs" variant="outline">
                                                Edit
                                            </Button>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                className="text-destructive border-destructive/40"
                                            >
                                                Archive
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

function CreateAssetDialog() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Asset</DialogTitle>
                <DialogDescription>
                    Define a new global asset. Tenants will later import this into
                    their own inventory.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Asset Name</label>
                        <Input placeholder="e.g. LED Uplight Pro" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Category</label>
                        <Select>
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
                    <label className="text-xs font-medium">Description</label>
                    <Input placeholder="Short internal description of the asset" />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Width (cm)</label>
                        <Input type="number" min={0} step="0.1" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Height (cm)</label>
                        <Input type="number" min={0} step="0.1" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Depth (cm)</label>
                        <Input type="number" min={0} step="0.1" />
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Weight (kg)</label>
                        <Input type="number" min={0} step="0.1" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Power Requirements
                        </label>
                        <Input placeholder="e.g. 230V / 150W" />
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Manufacturer</label>
                        <Input placeholder="e.g. BrightStage" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Model</label>
                        <Input placeholder="e.g. UP-150" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium">Asset Image Upload</label>
                    <Input type="file" />
                    <p className="text-[11px] text-muted-foreground">
                        Mock upload field for now. Backend will connect to Supabase
                        storage later.
                    </p>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium">Tags</label>
                    <Input placeholder="Comma separated tags, e.g. uplight, wireless" />
                </div>

                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="space-y-0.5">
                        <p className="text-xs font-medium">Status</p>
                        <p className="text-[11px] text-muted-foreground">
                            Inactive assets won&apos;t be visible to tenants for new
                            imports.
                        </p>
                    </div>
                    <Select defaultValue="Active">
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
            <DialogFooter>
                <Button variant="outline" size="sm">
                    Cancel
                </Button>
                <Button size="sm">Create Asset</Button>
            </DialogFooter>
        </DialogContent>
    );
}

