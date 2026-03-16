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
        <div className="min-h-screen bg-[url('/bg-img.png')] bg-cover bg-center bg-fixed text-foreground selection:bg-white/10 selection:text-white flex items-center justify-center p-6 font-montserrat relative">
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 w-full max-w-2xl space-y-8 py-10">
                {/* Header & Progress */}
                <div className="flex flex-col items-center text-center space-y-4">

                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight font-orbitron text-white">Project Cue</h1>
                        <p className="text-white/70 font-orbitron text-sm">Configure your event requirements for the OUL partner.</p>
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
                    <Card className="neon-glass-form neon-form border shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-white/5 border-b border-white/10 p-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/20">
                                    <Info className="size-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-orbitron text-white">Event Specifications</CardTitle>
                                    <CardDescription className="text-white/60">Enter the core details for your project</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <form onSubmit={handleContinue} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Event Name */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 ml-1">Event Name</label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-4 top-3.5 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                required
                                                placeholder="e.g. Ali & Sara Wedding"
                                                className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 text-white placeholder:text-white/20 transition-all font-medium"
                                                value={formData.event_name}
                                                onChange={(e) => handleChange('event_name', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Event Type */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 ml-1">Event Category</label>
                                        <Select
                                            required
                                            onValueChange={(v) => handleChange('event_type', v)}
                                            value={formData.event_type}
                                        >
                                            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 text-white transition-all font-medium">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-white/10 rounded-xl">
                                                <SelectItem value="Wedding">Wedding</SelectItem>
                                                <SelectItem value="Corporate">Corporate</SelectItem>
                                                <SelectItem value="Concert">Concert</SelectItem>
                                                <SelectItem value="Private Party">Private Party</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Expected Guests */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 ml-1">Expected Guests</label>
                                        <div className="relative group">
                                            <Users className="absolute left-4 top-3.5 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="number"
                                                required
                                                className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all font-medium hide-spinner"
                                                value={formData.expected_guests}
                                                onChange={(e) => handleChange('expected_guests', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center gap-3 mb-4">
                                            <CalendarDays className="size-5 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">Date & Time Mapping</span>
                                            <Separator className="flex-1 bg-white/10" />
                                        </div>
                                    </div>

                                    {/* Event Date */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 ml-1">Primary Event Date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-3.5 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="date"
                                                required
                                                className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all font-medium"
                                                value={formData.event_date}
                                                onChange={(e) => handleChange('event_date', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Start/End Dates */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 ml-1">Load-in Date</label>
                                        <Input
                                            type="date"
                                            required
                                            className="h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all font-medium"
                                            value={formData.start_date}
                                            onChange={(e) => handleChange('start_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 ml-1">Load-out Date</label>
                                        <Input
                                            type="date"
                                            required
                                            className="h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all font-medium"
                                            value={formData.end_date}
                                            onChange={(e) => handleChange('end_date', e.target.value)}
                                        />
                                    </div>

                                    {/* Start/End Times */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 ml-1">Start Date</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-3.5 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="time"
                                                required
                                                className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all font-medium"
                                                value={formData.start_time}
                                                onChange={(e) => handleChange('start_time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 ml-1">End Date</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-3.5 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="time"
                                                required
                                                className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/50 text-white transition-all font-medium"
                                                value={formData.end_time}
                                                onChange={(e) => handleChange('end_time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <button
                                        type="submit"
                                        className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 group active:scale-[0.98] transition-all"
                                    >
                                        Continue
                                        <ChevronRight className="size-5 group-hover:translate-x-1.5 transition-transform" />
                                    </button>

                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <button
                            onClick={() => setStep(1)}
                            className="group flex items-center gap-2 text-white/50 hover:text-white font-bold uppercase tracking-[0.3em] text-[10px] transition-all cursor-pointer"
                        >
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Configuration
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
                            {/* Option Cards */}
                            <button
                                onClick={() => setServiceMode("production")}
                                className={`flex flex-col text-left group border rounded-[2.5rem] transition-all duration-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50 p-1 relative ${serviceMode === "production" ? 'border-primary shadow-[0_0_30px_oklch(0.75_0.18_190_/_0.2)] scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
                            >
                                <div className="bg-zinc-900/60 backdrop-blur-xl rounded-[2.3rem] p-8 flex-1 space-y-6 shadow-2xl relative z-10">
                                    <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-primary/20 shadow-[0_0_15px_oklch(0.75_0.18_190_/_0.1)]">
                                        <Briefcase className="size-8 text-primary" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black font-orbitron text-white">Production</h3>
                                            <Badge className="text-[9px] font-black uppercase tracking-widest border border-primary/30 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">Full Service</Badge>
                                        </div>
                                        <p className="text-sm text-white/50 leading-relaxed font-medium">
                                            Comprehensive execution including logistics, labor, technical operation, and equipment management.
                                        </p>
                                    </div>
                                    <ul className="space-y-3 pt-2">
                                        {['Labor included', 'Post-event reports', 'Technical support'].map(item => (
                                            <li key={item} className="flex items-center gap-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                                                <div className="size-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_oklch(0.75_0.18_190_/_0.5)]" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </button>

                            <button
                                onClick={() => setServiceMode("rental")}
                                className={`flex flex-col text-left group border rounded-[2.5rem] transition-all duration-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50 p-1 relative ${serviceMode === "rental" ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
                            >
                                <div className="bg-zinc-900/60 backdrop-blur-xl rounded-[2.3rem] p-8 flex-1 space-y-6 shadow-2xl relative z-10">
                                    <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 border border-white/10">
                                        <Settings className="size-8 text-white" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black font-orbitron text-white">Rental Only</h3>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border border-white/30 bg-white/5 text-white px-2.5 py-0.5 rounded-full">Dry Hire</Badge>
                                        </div>
                                        <p className="text-sm text-white/50 leading-relaxed font-medium">
                                            High-quality hardware procurement. You manage the team; we provide the precision tools.
                                        </p>
                                    </div>
                                    <ul className="space-y-3 pt-2">
                                        {['Equipment only', 'Self-operation', 'Logistics optional'].map(item => (
                                            <li key={item} className="flex items-center gap-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                                                <div className="size-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </button>
                        </div>

                        {/* Proceed Button Fixed at Bottom Right */}
                        {serviceMode && (
                            <div className="fixed bottom-12 right-12 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700 z-50">
                                <button
                                    className="btn-primary h-16 px-12 rounded-[1.8rem] font-black text-xl flex items-center gap-4 group active:scale-95 transition-all shadow-2xl"
                                    onClick={() => window.location.href = `/axis/${serviceMode}`}
                                >
                                    Proceed to {serviceMode.charAt(0).toUpperCase() + serviceMode.slice(1)} View
                                    <ChevronRight className="size-6 group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-3 text-white/20 pt-8">
                            <Settings className="size-4 animate-spin-slow" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Enterprise Selection • Cobuddy Cue System</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
