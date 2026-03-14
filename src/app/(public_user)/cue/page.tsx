"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar,
    Clock,
    Users,
    ChevronRight,
    ArrowLeft,
    Briefcase,
    Settings,
    Sparkles,
    CheckCircle2,
    Building2,
    Info,
    CalendarDays
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CuePage() {
    const [step, setStep] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [serviceMode, setServiceMode] = useState<"production" | "rental" | null>(null);
    const [formData, setFormData] = useState({
        event_type: "",
        event_name: "",
        event_date: "",
        start_date: "",
        end_date: "",
        start_time: "18:00",
        end_time: "23:00",
        expected_guests: 450,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header & Progress */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="size-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Project Cue</h1>
                        <p className="text-muted-foreground font-medium">Configure your event requirements for the OUL partner.</p>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`size-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                                {step > 1 ? <CheckCircle2 className="size-3.5" /> : "1"}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Details</span>
                        </div>
                        <div className="w-8 h-[1px] bg-muted-foreground/20" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`size-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all ${step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                                2
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Service</span>
                        </div>
                    </div>
                </div>

                {step === 1 ? (
                    <Card className="border shadow-lg bg-muted/30 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-background/50 border-b p-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Info className="size-4 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Event Specifications</CardTitle>
                                    <CardDescription>Enter the core details for Ali & Sara Wedding</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8 bg-background/20 backdrop-blur-sm">
                            <form onSubmit={handleContinue} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Event Name */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Event Name</label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-3 top-2.5 size-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                required
                                                placeholder="e.g. Ali & Sara Wedding"
                                                className="pl-10 h-10 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                                                value={formData.event_name}
                                                onChange={(e) => handleChange('event_name', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Event Type */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Event Category</label>
                                        <Select
                                            required
                                            onValueChange={(v) => handleChange('event_type', v)}
                                            value={formData.event_type}
                                        >
                                            <SelectTrigger className="h-10 bg-background border-muted-foreground/20 rounded-xl focus:ring-1 focus:ring-primary shadow-sm">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Wedding">Wedding</SelectItem>
                                                <SelectItem value="Corporate">Corporate</SelectItem>
                                                <SelectItem value="Concert">Concert</SelectItem>
                                                <SelectItem value="Private Party">Private Party</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Expected Guests */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Expected Guests</label>
                                        <div className="relative group">
                                            <Users className="absolute left-3 top-2.5 size-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="number"
                                                required
                                                className="pl-10 h-10 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                                                value={formData.expected_guests}
                                                onChange={(e) => handleChange('expected_guests', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CalendarDays className="size-4 text-primary" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Date & Time Mapping</span>
                                            <Separator className="flex-1" />
                                        </div>
                                    </div>

                                    {/* Event Date */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Primary Event Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-2.5 size-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="date"
                                                required
                                                className="pl-10 h-10 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                                                value={formData.event_date}
                                                onChange={(e) => handleChange('event_date', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Start/End Dates */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Load-in Date</label>
                                        <Input
                                            type="date"
                                            required
                                            className="h-10 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                                            value={formData.start_date}
                                            onChange={(e) => handleChange('start_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Load-out Date</label>
                                        <Input
                                            type="date"
                                            required
                                            className="h-10 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                                            value={formData.end_date}
                                            onChange={(e) => handleChange('end_date', e.target.value)}
                                        />
                                    </div>

                                    {/* Start/End Times */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Operation Start</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-3 top-2.5 size-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="time"
                                                required
                                                className="pl-10 h-10 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                                                value={formData.start_time}
                                                onChange={(e) => handleChange('start_time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Operation Close</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-3 top-2.5 size-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="time"
                                                required
                                                className="pl-10 h-10 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                                                value={formData.end_time}
                                                onChange={(e) => handleChange('end_time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-muted-foreground/10">
                                    <Button
                                        type="submit"
                                        className="w-full h-11 rounded-xl text-sm font-bold shadow-md shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group"
                                    >
                                        Continue to Service Mode
                                        <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground font-medium mt-4">
                                        Data is stored as a draft until final selection is made.
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <Button
                            variant="ghost"
                            onClick={() => setStep(1)}
                            className="gap-2 text-muted-foreground hover:text-foreground font-bold uppercase tracking-[0.2em] text-[10px] h-8 -ml-2"
                        >
                            <ArrowLeft className="size-3.5" />
                            Return to Configuration
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
                            {/* Option Cards */}
                            <button
                                onClick={() => setServiceMode("production")}
                                className={`flex flex-col text-left group border rounded-[2rem] transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary p-1 ${serviceMode === "production" ? 'border-primary bg-primary/10' : 'border-border/50 bg-muted/20 hover:bg-muted/40'}`}
                            >
                                <div className="bg-background rounded-[1.8rem] p-8 flex-1 space-y-6 shadow-sm border border-border/10 group-hover:border-primary/20 transition-colors">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Briefcase className="size-6 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold">Production</h3>
                                            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">Full Service</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Comprehensive execution including logistics, labor, technical operation, and equipment management.
                                        </p>
                                    </div>
                                    <ul className="space-y-2 pt-2">
                                        {['Labor included', 'Post-event reports', 'Technical support'].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/70">
                                                <div className="size-1 rounded-full bg-primary/40" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </button>

                            <button
                                onClick={() => setServiceMode("rental")}
                                className={`flex flex-col text-left group border rounded-[2rem] transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-zinc-900 p-1 ${serviceMode === "rental" ? 'border-zinc-900 bg-zinc-900/10' : 'border-border/50 bg-zinc-900/5 hover:bg-zinc-900/10'}`}
                            >
                                <div className="bg-background rounded-[1.8rem] p-8 flex-1 space-y-6 shadow-sm border border-border/10 group-hover:border-zinc-900/20 transition-colors">
                                    <div className="size-12 rounded-2xl bg-zinc-900/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Settings className="size-6 text-zinc-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold">Rental Only</h3>
                                            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-zinc-900/20 bg-zinc-900/5 text-zinc-900">Dry Hire</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            High-quality hardware procurement. You manage the team; we provide the precision tools.
                                        </p>
                                    </div>
                                    <ul className="space-y-2 pt-2">
                                        {['Equipment only', 'Self-operation', 'Logistics optional'].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/70">
                                                <div className="size-1 rounded-full bg-zinc-900/40" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </button>
                        </div>

                        {/* Proceed Button Fixed at Bottom Right */}
                        {serviceMode && (
                            <div className="fixed bottom-10 right-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Button
                                    className="h-14 px-10 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group shadow-primary/20"
                                    onClick={() => window.location.href = `/axis/${serviceMode}`}
                                >
                                    Proceed to {serviceMode.charAt(0).toUpperCase() + serviceMode.slice(1)} View
                                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-2 text-muted-foreground/50 pt-4">
                            <Settings className="size-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Enterprise mode selector • Cobuddy Cue System</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
