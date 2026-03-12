"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, Package, CheckCircle2, XCircle, Clock, Building2, Layout } from "lucide-react";
import { useAssetRequests } from "@/features/orb/hooks/useAssetRequests";
import { AssetRequestSheet } from "@/features/orb/components/AssetRequestSheet";
import type { AssetRequest } from "@/features/orb/types";

export default function OrbAssetsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [tenantFilter, setTenantFilter] = useState("all");
    const [viewingRequest, setViewingRequest] = useState<AssetRequest | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const { requests, loading, updateStatus, refresh } = useAssetRequests();

    const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
        await updateStatus(id, status);
        // Keep the sheet in sync after status change
        setViewingRequest((prev) => prev ? { ...prev, approval_status: status } : null);
    };

    /* Derive unique tenants from the data itself */
    const tenants = useMemo(() => {
        const map = new globalThis.Map<string, string>();
        requests.forEach((r) => {
            if (r.tenant) map.set(r.tenant.id, r.tenant.name);
        });
        return Array.from(map.entries()); // [id, name][]
    }, [requests]);

    const filtered = useMemo(() => {
        return requests.filter((req: AssetRequest) => {
            const matchesSearch =
                search.trim().length === 0 ||
                (req.title?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
                (req.tenant?.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
                (req.brand?.toLowerCase().includes(search.toLowerCase()) ?? false);

            const matchesStatus =
                statusFilter === "all" || req.approval_status === statusFilter;

            const matchesTenant =
                tenantFilter === "all" || req.tenant_id === tenantFilter;

            return matchesSearch && matchesStatus && matchesTenant;
        });
    }, [requests, search, statusFilter, tenantFilter]);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Asset Requests</h2>
                    <p className="text-sm text-muted-foreground">
                        Review warehouse inventory import requests from all tenants.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Request Queue
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search items..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 h-9 rounded-lg"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
                        >
                            <SelectTrigger className="h-9 w-[140px] rounded-lg cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={tenantFilter} onValueChange={setTenantFilter}>
                            <SelectTrigger className="h-9 w-[180px] rounded-lg cursor-pointer">
                                <SelectValue placeholder="Tenant" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tenants</SelectItem>
                                {tenants.map(([id, name]) => (
                                    <SelectItem key={id} value={id}>{name}</SelectItem>
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
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {loading && requests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            Loading requests...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            {search || statusFilter !== "all" || tenantFilter !== "all"
                                                ? "No requests match your filters."
                                                : "No asset requests found."}
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((req) => (
                                    <TableRow
                                        key={req.id}
                                        className="group hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => setViewingRequest(req)}
                                    >
                                        <TableCell>
                                            <div className="h-10 w-10 rounded-md bg-muted overflow-hidden border border-border/50">
                                                {req.asset?.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={req.asset.image} alt={req.title || ""} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center">
                                                        <Layout className="size-4 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold">{req.title || req.asset?.name || "Untitled"}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {req.brand || "Generic"} • {req.model || "Standard"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="text-sm font-medium">{req.tenant?.name || "Unknown"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary">
                                                ×{req.quantity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={req.approval_status} />
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            {req.approval_status === "pending" ? (
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 gap-1 cursor-pointer border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                                                        onClick={() => handleUpdateStatus(req.id, "approved")}
                                                    >
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 gap-1 cursor-pointer border-red-500/30 text-red-600 hover:bg-red-500/10"
                                                        onClick={() => handleUpdateStatus(req.id, "rejected")}
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AssetRequestSheet
                request={viewingRequest}
                open={!!viewingRequest}
                onOpenChange={(open) => !open && setViewingRequest(null)}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
}

/* ── Shared status badge matching Atlas style ── */
function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string; icon: typeof Clock }> = {
        pending: { label: "Pending", className: "border-amber-500/20 bg-amber-500/5 text-amber-600", icon: Clock },
        approved: { label: "Approved", className: "border-emerald-500/20 bg-emerald-500/5 text-emerald-600", icon: CheckCircle2 },
        rejected: { label: "Rejected", className: "border-red-500/20 bg-red-500/5 text-red-600", icon: XCircle },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;

    return (
        <Badge variant="outline" className={`font-normal gap-1 ${c.className}`}>
            <Icon className="h-3 w-3" />
            {c.label}
        </Badge>
    );
}
