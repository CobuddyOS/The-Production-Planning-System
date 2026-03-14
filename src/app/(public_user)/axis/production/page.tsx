"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    LayoutDashboard,
    Users,
    Clock,
    Calendar,
    CheckCircle2,
    Workflow,
    ArrowLeft,
    Boxes,
    Truck,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AxisProductionPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Header Area */}
            <header className="border-b bg-muted/40 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => window.location.href = '/cue'}
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <Workflow className="size-5 text-primary" />
                            <span className="font-bold tracking-tight">Axis Production</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold uppercase tracking-tighter text-[10px]">
                            Live View
                        </Badge>
                        <div className="size-8 rounded-full bg-muted border border-border/50" />
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8">
                {/* Project Overview Card */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-2">
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-bold text-[10px] uppercase tracking-widest px-3">
                            Currently Active
                        </Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight">Ali & Sara Wedding</h1>
                        <p className="text-muted-foreground text-lg">Detailed production management and live execution tracking.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20">Finalize Specs</Button>
                        <Button variant="outline" className="rounded-xl font-bold px-6">Export PDF</Button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Personnel", value: "12 Staff", icon: Users, sub: "4 Techs, 8 Hands" },
                        { title: "Timeline", value: "3 Days", icon: Clock, sub: "Sept 10 - Sept 12" },
                        { title: "Status", value: "Load-in", icon: CheckCircle2, sub: "Pending Final Approval" },
                        { title: "Assets", value: "148 Items", icon: Boxes, sub: "95% Warehouse Ready" }
                    ].map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm bg-muted/20 rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</span>
                                    <stat.icon className="size-4 text-primary/60" />
                                </div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tasks Column */}
                    <Card className="lg:col-span-2 border-none shadow-xl shadow-black/[0.02] rounded-3xl">
                        <CardHeader className="p-8 border-b pb-6">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <LayoutDashboard className="size-5 text-primary" />
                                Production Milestones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {[
                                { task: "Technical Infrastructure Setup", status: "completed", time: "Day 1 - 08:00" },
                                { task: "Audio Configuration & Tuning", status: "in-progress", time: "Day 1 - 12:00" },
                                { task: "Lighting Programming", status: "pending", time: "Day 1 - 16:00" },
                                { task: "Visual Content Sync", status: "pending", time: "Day 2 - 09:00" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 border-b last:border-none hover:bg-muted/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-xl flex items-center justify-center ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : item.status === 'in-progress' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {item.status === 'completed' ? <CheckCircle2 className="size-5" /> : <Clock className="size-5" />}
                                        </div>
                                        <div>
                                            <div className="font-bold">{item.task}</div>
                                            <div className="text-xs text-muted-foreground">{item.time}</div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`font-bold text-[10px] uppercase tracking-tighter ${item.status === 'completed' ? 'text-emerald-500' : item.status === 'in-progress' ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Logistics Card */}
                    <Card className="border-none shadow-xl shadow-black/[0.02] rounded-3xl bg-zinc-900 text-white">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Truck className="size-5 text-primary" />
                                Logistics Hub
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">Transport Status</span>
                                    <Badge className="bg-emerald-500 text-white border-none">On Schedule</Badge>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Zap className="size-5 text-primary fill-primary" />
                                    <span className="font-bold">2 Trucks Dispatched</span>
                                </div>
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Equipment Breakdown</h4>
                                <div className="space-y-3">
                                    {[
                                        { label: "Audio Gear", value: "100%" },
                                        { label: "Visual Displays", value: "85%" },
                                        { label: "Trussing Systems", value: "92%" }
                                    ].map((row, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span>{row.label}</span>
                                                <span className="text-white/50">{row.value}</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: row.value }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
