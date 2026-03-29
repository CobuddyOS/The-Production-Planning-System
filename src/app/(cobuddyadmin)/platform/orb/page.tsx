"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Home, Clock, CheckCircle2, ChevronRight, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAssetRequests } from "@/features/orb/hooks/useAssetRequests";
import { useBallroomRequests } from "@/features/orb/hooks/useBallroomRequests";

export default function OrbPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { requests: assetRequests } = useAssetRequests();
    const { requests: ballroomRequests } = useBallroomRequests();

    const stats = useMemo(() => {
        const pendingAssets = assetRequests.filter(r => r.approval_status === "pending").length;
        const approvedAssets = assetRequests.filter(r => r.approval_status === "approved").length;
        const pendingBallrooms = ballroomRequests.filter(r => r.status === "pending").length;
        const approvedBallrooms = ballroomRequests.filter(r => r.status === "approved").length;
        return { pendingAssets, approvedAssets, pendingBallrooms, approvedBallrooms };
    }, [assetRequests, ballroomRequests]);

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

    const wallPanels = [
        {
            key: "oul",
            title: "OUL",
            subtitle: "Directory Control",
            desc: "Onboarding approvals, directory card edits, rankings, and live public-directory scene state.",
        },
        {
            key: "cue",
            title: "CUE",
            subtitle: "Calendar Gateway",
            desc: "Calendar logic, visitor-entry trail, date-block snapshots, and repeat-user path control.",
        },
        {
            key: "enodios",
            title: "ENODIOS",
            subtitle: "Rental / Transport",
            desc: "Rental edits, specs, transport breakdowns, and operational package structure.",
        },
        {
            key: "nio",
            title: "NIO",
            subtitle: "System Intelligence",
            desc: "Warnings, analytics, flagged outputs, guidance text control, and assistant behavior slots.",
        },
        {
            key: "libra",
            title: "LIBRA",
            subtitle: "Blueprint Routing",
            desc: "Blueprint generation controls, pricing blocks, disclaimers, emails, and submission routing.",
        },
    ];

    return (
        <div className="space-y-6 p-4 md:p-6">

            {/* TOP 20% */}
            <Card className="neon-glass-card overflow-hidden">
                <CardContent className="p-0">
                    <div className="grid min-h-[140px] grid-cols-1 border-white/10 md:grid-cols-3">

                        {/* 33% NIO SLOT */}
                        <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 md:border-b-0 md:border-r">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold tracking-[0.25em]">
                                NIO
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                    Network Intelligence Operator
                                </p>
                                <p className="text-sm font-semibold">ORB System Active</p>
                                <p className="text-xs text-muted-foreground">Placeholder slot for official NIO asset</p>
                            </div>
                        </div>

                        {/* 33% LOGO / ORB IDENTITY */}
                        <div className="flex flex-col items-center justify-center border-b border-white/10 px-5 py-5 text-center md:border-b-0 md:border-r">
                            <div className="space-y-2">
                                <div className="text-lg font-bold tracking-[0.45em] md:text-2xl">
                                    COBUDDY OS
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 rounded-full border border-primary/40 bg-primary/10" />
                                    <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                                        ORB
                                    </span>
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                                    Placeholder slot for official wordmark / orb symbol
                                </p>
                            </div>
                        </div>

                        {/* 33% MENU */}
                        <div className="flex flex-wrap items-center justify-end gap-2 px-5 py-5">
                            <Button variant="outline" size="sm">System</Button>
                            <Button variant="outline" size="sm">Queues</Button>
                            <Button variant="outline" size="sm">Warnings</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* MIDDLE 40% */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                {wallPanels.map((panel) => (
                    <Card
                        key={panel.key}
                        className="neon-glass-card min-h-[240px] cursor-pointer transition-colors hover:border-primary/40"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-sm tracking-[0.3em]">
                                <span>{panel.title}</span>
                                <span className="text-[10px] font-normal tracking-[0.2em] text-muted-foreground">
                                    LIVE
                                </span>
                            </CardTitle>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                {panel.subtitle}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex h-[92px] items-center justify-center rounded-md border border-dashed border-primary/20 bg-primary/5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                Scene Panel Placeholder
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {panel.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* BOTTOM 40% */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_3fr_1fr]">

                {/* LEFT 20% */}
                <Card className="neon-glass-card min-h-[420px]">
                    <CardHeader>
                        <CardTitle className="text-sm tracking-[0.3em]">ORBITSWAY</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <button
                            type="button"
                            onClick={() => router.push("/orbitsway")}
                            className="flex h-[320px] w-full flex-col items-center justify-center rounded-md border border-dashed border-primary/20 bg-primary/5 text-center transition-colors hover:border-primary/40 hover:bg-primary/10"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                Redirect Space
                            </span>
                            <span className="mt-3 text-sm font-semibold">Open OrbitsWay</span>
                            <ArrowRight className="mt-3 h-4 w-4 text-primary" />
                        </button>
                    </CardContent>
                </Card>

                {/* CENTER 60% */}
                <Card className="neon-glass-card min-h-[420px]">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-base font-semibold">ORB Nexus Runtime</CardTitle>
                            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                                Public / Private ORB Nexus Space
                            </p>
                        </div>
                        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                            Redirect Active
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <button
                            type="button"
                            onClick={() => router.push("/tenantc/nexus")}
                            className="flex h-[320px] w-full flex-col items-center justify-center rounded-md border border-dashed border-primary/20 bg-black/30 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                ORB Runtime Center
                            </span>
                            <span className="mt-3 text-lg font-semibold">Enter ORB Nexus</span>
                            <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground">
                                This space routes into the Cobuddy-owned ORB runtime where public/private ORB Nexus activity is controlled.
                            </p>
                            <ArrowRight className="mt-4 h-5 w-5 text-primary" />
                        </button>
                    </CardContent>
                </Card>

                {/* RIGHT 20% */}
                <Card className="neon-glass-card min-h-[420px]">
                    <CardHeader>
                        <CardTitle className="text-sm tracking-[0.3em]">EXOGALAXY</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <button
                            type="button"
                            onClick={() => router.push("/exogalaxy")}
                            className="flex h-[320px] w-full flex-col items-center justify-center rounded-md border border-dashed border-primary/20 bg-primary/5 text-center transition-colors hover:border-primary/40 hover:bg-primary/10"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                Public Reflection
                            </span>
                            <span className="mt-3 text-sm font-semibold">Open ExoGalaxy</span>
                            <ArrowRight className="mt-3 h-4 w-4 text-primary" />
                        </button>
                    </CardContent>
                </Card>
            </div>

            {/* CONTROL CONSOLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Pending Assets", value: stats.pendingAssets, icon: Clock, desc: "Awaiting review", color: "text-amber-500", bg: "bg-amber-500/10" },
                    { title: "Approved Assets", value: stats.approvedAssets, icon: CheckCircle2, desc: "Approved items", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { title: "Pending Ballrooms", value: stats.pendingBallrooms, icon: Clock, desc: "Awaiting review", color: "text-amber-500", bg: "bg-amber-500/10" },
                    { title: "Approved Ballrooms", value: stats.approvedBallrooms, icon: CheckCircle2, desc: "Approved spaces", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="neon-glass-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`${stat.bg} rounded-lg p-2`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="mt-1 text-xs text-muted-foreground">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="neon-glass-card overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between gap-4 px-6 pb-6 pt-6">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Pending Requests
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button size="xs" variant="ghost" className="gap-1 text-primary hover:bg-primary/5" asChild>
                            <Link href="/platform/orb/assets">
                                Asset Queue <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="xs" variant="ghost" className="gap-1 text-primary hover:bg-primary/5" asChild>
                            <Link href="/platform/orb/ballrooms">
                                Ballroom Queue <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="border-t">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Name</TableHead>
                                    <TableHead>Tenant</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="pr-6 text-right">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPending.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                            No pending requests 🎉
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentPending.map((item) => (
                                        <TableRow key={item.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="pl-6 font-medium">{item.name}</TableCell>
                                            <TableCell>{item.tenant}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1 border-primary/20 bg-primary/5 font-normal text-primary"
                                                >
                                                    {item.type === "Asset" ? (
                                                        <Package className="h-3 w-3" />
                                                    ) : (
                                                        <Home className="h-3 w-3" />
                                                    )}
                                                    {item.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right font-mono text-xs text-muted-foreground">
                                                {new Date(item.date).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
