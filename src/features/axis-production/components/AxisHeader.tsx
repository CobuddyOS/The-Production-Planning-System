import { useState, useEffect } from "react";
import Image from "next/image";
import {
    PanelLeft,
    PanelRight,
    Layers,
    CalendarDays,
    HelpCircle,
    Bell,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AxisToolbar } from "./AxisToolbar";
import { LAYOUT } from "../constants";

interface AxisHeaderProps {
    leftSidebarOpen: boolean;
    setLeftSidebarOpen: (v: boolean) => void;
    rightSidebarOpen: boolean;
    setRightSidebarOpen: (v: boolean) => void;
    onOpenSummary: () => void;
    onOpenGuide: () => void;
    totalCost?: number;
    numberOfDays?: number;
    setNumberOfDays?: (v: number) => void;
    eventName?: string;
    eventDate?: string;
}

export function AxisHeader({
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen,
    onOpenSummary,
    onOpenGuide,
    totalCost = 0,
    numberOfDays = 1,
    setNumberOfDays = () => { },
    eventName = "New Event",
    eventDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
}: AxisHeaderProps) {
    const { middle } = LAYOUT;

    const [localDays, setLocalDays] = useState(numberOfDays.toString());

    useEffect(() => {
        setLocalDays(numberOfDays.toString());
    }, [numberOfDays]);

    const handleDaysChange = (val: string) => {
        setLocalDays(val);
        const parsed = parseInt(val);
        if (!isNaN(parsed) && parsed > 0) {
            setNumberOfDays(parsed);
        }
    };

    /**
     * Mirror the middle section column template for perfect alignment.
     */
    const gridColTemplate = [
        leftSidebarOpen ? `${middle.ballroom}fr` : "0fr",
        `${middle.canvas}fr`,
        rightSidebarOpen ? `${middle.assets}fr` : "0fr",
    ].join(" ");

    return (
        <header className="flex flex-col z-30 glass-header h-full min-h-0 relative overflow-hidden">
            {/* Global Header Ambient Light */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-sky-500/[0.03] to-black/20 pointer-events-none" />
            <div
                className="grid items-center h-full transition-[grid-template-columns] duration-300 ease-in-out overflow-hidden"
                style={{ gridTemplateColumns: gridColTemplate }}
            >
                {/* ─── Column 1: Logo & Sidebar Toggle ─── */}
                <div className="flex items-center justify-center gap-4 px-6 py-2 h-full border-r border-white/5 bg-black/20 overflow-hidden">
                    <Image
                        src="/cobuddy_logo.png"
                        alt="Cobuddy"
                        width={600}
                        height={200}
                        className="max-h-10 w-full object-contain shrink-0"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "size-8 transition-colors hover:bg-white/10 md:hidden",
                            leftSidebarOpen && "bg-white/10 text-white"
                        )}
                        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                    >
                        <PanelLeft className="size-4" />
                    </Button>
                </div>

                {/* ─── Column 2: Toolbar (Starts from Canva) ─── */}
                <div className="flex items-center pl-1 pr-6 h-full min-w-0 overflow-x-auto scrollbar-hide relative group">
                    {/* Aura Ambient Light */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.22)_0%,transparent_70%)] transition-colors duration-700" />

                    <div className="relative z-10 w-full flex items-center">
                        <AxisToolbar />
                    </div>
                </div>

                {/* ─── Column 3: Event Info & Actions ─── */}
                <div className="flex items-center justify-end gap-3 px-4 h-full bg-black/10 border-l border-white/5 min-w-0">
                    <div className="neon-banner-accent rounded-full px-5 py-1.5 flex items-center gap-4 shrink-0 shadow-[0_0_15px_rgba(30,30,30,0.5)]">
                        <div className="flex items-center gap-2">
                            <Layers className="size-3.5 text-primary" />
                            <span className="text-[11px] font-bold text-white tracking-wide uppercase">
                                {eventName}
                            </span>
                        </div>
                        <Separator orientation="vertical" className="h-3 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <CalendarDays className="size-3.5 text-emerald-400" />
                            <span className="text-[11px] font-medium text-white/70">
                                {eventDate}
                            </span>
                        </div>
                    </div>

                    {/* Days Input */}
                    <div className="flex items-center px-3 h-full relative border-l border-white/5 bg-white/[0.02] gap-2 z-10">
                        <div className="relative flex items-center z-10">
                            <input
                                type="number"
                                min={1}
                                value={localDays}
                                onChange={(e) => handleDaysChange(e.target.value)}
                                onBlur={() => {
                                    if (parseInt(localDays) <= 0 || isNaN(parseInt(localDays))) {
                                        setLocalDays("1");
                                        setNumberOfDays(1);
                                    }
                                }}
                                className="w-12 h-7 bg-black/40 border border-white/10 rounded-lg text-xs font-black text-[#bef264] text-center focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative z-10"
                            />
                        </div>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                            Days
                        </span>
                    </div>

                    {/* Cost Counter */}
                    <div className="flex items-center px-4 h-full relative border-l border-white/5 bg-black/5">
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-lg font-black font-orbitron text-primary tracking-tighter drop-shadow-[0_0_8px_oklch(0.75_0.18_190_/_0.5)]">
                                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/40 hover:text-white hover:bg-white/10 rounded-full size-8"
                            onClick={onOpenGuide}
                        >
                            <HelpCircle className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/40 hover:text-white hover:bg-white/10 rounded-full size-8"
                        >
                            <Bell className="size-4" />
                        </Button>
                    </div>

                    <Button
                        variant="default"
                        size="sm"
                        className="bg-primary text-black font-black text-[10px] tracking-widest uppercase h-8 px-5 rounded-full hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                        onClick={onOpenSummary}
                    >
                        SUMMARY
                        <ChevronRight className="size-3.5 ml-1" />
                    </Button>

                    <Separator orientation="vertical" className="md:hidden h-5 bg-white/10 mx-1" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "size-8 transition-colors hover:bg-white/10 md:hidden",
                            rightSidebarOpen && "bg-white/10 text-white"
                        )}
                        onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                    >
                        <PanelRight className="size-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
