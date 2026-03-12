"use client";

import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Home, Clock, CheckCircle2, XCircle, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { useAssetRequests } from "@/features/orb/hooks/useAssetRequests";
import { useBallroomRequests } from "@/features/orb/hooks/useBallroomRequests";

export default function OrbPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const { requests: assetRequests } = useAssetRequests();
    const { requests: ballroomRequests } = useBallroomRequests();

    const stats = useMemo(() => {
        const pendingAssets = assetRequests.filter(r => r.approval_status === "pending").length;
        const approvedAssets = assetRequests.filter(r => r.approval_status === "approved").length;
        const pendingBallrooms = ballroomRequests.filter(r => r.status === "pending").length;
        const approvedBallrooms = ballroomRequests.filter(r => r.status === "approved").length;
        return { pendingAssets, approvedAssets, pendingBallrooms, approvedBallrooms };
    }, [assetRequests, ballroomRequests]);

    /* Latest 5 pending items (either type) */
    const recentPending = useMemo(() => {
        const assets = assetRequests
            .filter(r => r.approval_status === "pending")
            .map(r => ({
                id: r.id,
                name: r.title || r.asset?.name || "Untitled",
                tenant: r.tenant?.name || "Unknown",
                type: "Asset" as const,
                date: r.created_at,
            }));
        const ballrooms = ballroomRequests
            .filter(r => r.status === "pending")
            .map(r => ({
                id: r.id,
                name: r.name,
                tenant: r.tenant?.name || "Unknown",
                type: "Ballroom" as const,
                date: r.created_at,
            }));
        return [...assets, ...ballrooms]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [assetRequests, ballroomRequests]);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">ORB Overview</h2>
                    <p className="text-sm text-muted-foreground">
                        Central oversight for tenant resource requests.
                    </p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Pending Assets", value: stats.pendingAssets, icon: Clock, desc: "Awaiting review", color: "text-amber-500", bg: "bg-amber-500/10" },
                    { title: "Approved Assets", value: stats.approvedAssets, icon: CheckCircle2, desc: "Approved items", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { title: "Pending Ballrooms", value: stats.pendingBallrooms, icon: Clock, desc: "Awaiting review", color: "text-amber-500", bg: "bg-amber-500/10" },
                    { title: "Approved Ballrooms", value: stats.approvedBallrooms, icon: CheckCircle2, desc: "Approved spaces", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-muted/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`${stat.bg} p-2 rounded-lg`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent pending table */}
            <Card className="border-none shadow-sm bg-muted/30 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-6 px-6 pt-6">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Pending Requests
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button size="xs" variant="ghost" className="text-primary hover:bg-primary/5 gap-1" asChild>
                            <Link href="/platform/orb/assets">Asset Queue <ChevronRight className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="xs" variant="ghost" className="text-primary hover:bg-primary/5 gap-1" asChild>
                            <Link href="/platform/orb/ballrooms">Ballroom Queue <ChevronRight className="h-4 w-4" /></Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="pl-6">Name</TableHead>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right pr-6">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background/50">
                                {recentPending.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                            No pending requests 🎉
                                        </TableCell>
                                    </TableRow>
                                ) : recentPending.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium pl-6">{item.name}</TableCell>
                                        <TableCell>{item.tenant}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary gap-1">
                                                {item.type === "Asset" ? <Package className="h-3 w-3" /> : <Home className="h-3 w-3" />}
                                                {item.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground font-mono pr-6">
                                            {new Date(item.date).toLocaleDateString()}
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
