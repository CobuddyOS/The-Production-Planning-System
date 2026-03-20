"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Boxes,
    ArrowLeft,
    ShoppingCart,
    Calendar,
    PackageSearch,
    Info,
    CheckCircle2,
    DollarSign,
    Zap,
    LayoutGrid,
    List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function AxisRentalPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header Area */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => router.push('/cue')}
                        >
                            <ArrowLeft className="size-4" />
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <Boxes className="size-5 text-primary" />
                            <span className="font-bold tracking-tight">Axis Rental Hub</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <PackageSearch className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <Input placeholder="Search inventory..." className="pl-10 h-10 w-64 bg-muted/50 border-none rounded-xl" />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full relative">
                            <ShoppingCart className="size-4" />
                            <Badge className="absolute -top-1 -right-1 size-4 p-0 flex items-center justify-center bg-primary text-[8px]">4</Badge>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8 flex-1 w-full">
                <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-zinc-600 border-zinc-200 bg-zinc-50 font-bold text-[10px] uppercase tracking-widest px-3">
                                Dry Hire Mode
                            </Badge>
                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 font-bold text-[10px] uppercase tracking-widest px-3">
                                Stock Verified
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Technical Inventory</h1>
                        <p className="text-muted-foreground text-lg">Select individual units for your custom event configuration.</p>
                    </div>
                    <div className="flex bg-muted p-1 rounded-xl">
                        <Button variant="ghost" size="sm" className="bg-background shadow-sm rounded-lg px-3">
                            <LayoutGrid className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg px-3">
                            <List className="size-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[
                        { name: "L-Acoustics K2", category: "Audio", price: "$450/day", img: "https://api.dicebear.com/7.x/initials/svg?seed=K2&backgroundColor=000000" },
                        { name: "MA Lighting grandMA3", category: "Lighting", price: "$800/day", img: "https://api.dicebear.com/7.x/initials/svg?seed=MA3&backgroundColor=27272a" },
                        { name: "Barco UDX-4K40", category: "Visual", price: "$1,200/day", img: "https://api.dicebear.com/7.x/initials/svg?seed=Barco&backgroundColor=0ea5e9" },
                        { name: "Shure Axient Digital", category: "Audio", price: "$120/day", img: "https://api.dicebear.com/7.x/initials/svg?seed=Shure&backgroundColor=10b981" },
                        { name: "Robe BMFL Blade", category: "Lighting", price: "$220/day", img: "https://api.dicebear.com/7.x/initials/svg?seed=Robe&backgroundColor=8b5cf6" },
                        { name: "Blackmagic URSA 12K", category: "Visual", price: "$350/day", img: "https://api.dicebear.com/7.x/initials/svg?seed=BMG&backgroundColor=f43f5e" }
                    ].map((item, i) => (
                        <Card key={i} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-muted/20 hover:bg-white border hover:border-border">
                            <div className="aspect-square bg-white border-b relative">
                                <img src={item.img} alt={item.name} className="size-full object-cover p-8 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-white/80 backdrop-blur-md text-zinc-900 border-none font-bold text-[10px]">IN STOCK</Badge>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{item.category}</div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm font-bold">
                                        <DollarSign className="size-3.5 text-emerald-500" />
                                        {item.price}
                                    </div>
                                    <Button size="sm" className="rounded-xl font-bold px-4 h-9">
                                        Add to Project
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>

            {/* Bottom Project Summary */}
            <div className="border-t bg-zinc-900 py-6 px-10 flex items-center justify-between text-white">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Zap className="size-5 text-primary fill-primary" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Rental Quote</div>
                            <div className="text-xl font-bold">$3,140.00 <span className="text-xs text-white/40 font-medium">/ 3 Days</span></div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="bg-transparent border-white/20 hover:bg-white/10 text-white rounded-xl font-bold px-8">Save Draft</Button>
                    <Button className="bg-primary text-white hover:bg-primary/90 rounded-xl font-bold px-10 shadow-lg shadow-primary/20">Confirm Configuration</Button>
                </div>
            </div>
        </div>
    );
}
