"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Users, Calendar, Filter, X, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Dummy Data exactly as requested with additional diverse records
const DUMMY_TENANTS = [
    {
        id: "1",
        name: "Apex Production",
        location: "Dubai, UAE",
        event_types: ["Wedding", "Corporate"],
        max_capacity: 1000,
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=Apex",
        description: "Premium AV for large scale events and high-end productions."
    },
    {
        id: "2",
        name: "Neon Nights AV",
        location: "New York, NY",
        event_types: ["Concert", "Corporate"],
        max_capacity: 5000,
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=Neon",
        description: "Specializing in concert lighting and immersive sound experiences."
    },
    {
        id: "3",
        name: "Intimate I Do's",
        location: "Los Angeles, CA",
        event_types: ["Wedding", "Private Party"],
        max_capacity: 300,
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=Intimate",
        description: "Boutique setups for intimate gatherings and bespoke weddings."
    },
    {
        id: "4",
        name: "Skyline Events",
        location: "Dubai, UAE",
        event_types: ["Corporate", "Concert"],
        max_capacity: 2500,
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=Skyline",
        description: "Elevated event planning and technical execution for the modern enterprise."
    },
    {
        id: "5",
        name: "Velvet Rope Productions",
        location: "London, UK",
        event_types: ["Private Party", "Wedding"],
        max_capacity: 500,
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=Velvet",
        description: "Exclusive access to premium event services and luxury management."
    },
    {
        id: "6",
        name: "Global Stage Systems",
        location: "Berlin, DE",
        event_types: ["Concert", "Corporate"],
        max_capacity: 15000,
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=Global",
        description: "Massive scale audio and visual engineering for stadiums and festivals."
    },
    {
        id: "7",
        name: "Corporate Core AV",
        location: "New York, NY",
        event_types: ["Corporate"],
        max_capacity: 800,
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=Core",
        description: "Reliable, streamlined AV solutions for business meetings and conferences."
    },
    {
        id: "8",
        name: "Desert Rose Events",
        location: "Dubai, UAE",
        event_types: ["Wedding", "Corporate"],
        max_capacity: 1200,
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=Desert",
        description: "Creating magical experiences in unique desert landscapes and beyond."
    }
];

const EVENT_TYPES = ["Wedding", "Corporate", "Concert", "Private Party"];

export default function OulDiscoveryPage() {
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [eventTypeFilter, setEventTypeFilter] = useState("all");
    const [minCapacity, setMinCapacity] = useState<number | "">("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const locations = useMemo(() => {
        const unique = new Set(DUMMY_TENANTS.map(t => t.location));
        return Array.from(unique).sort();
    }, []);

    const filteredTenants = useMemo(() => {
        return DUMMY_TENANTS.filter(tenant => {
            const matchesSearch = search === "" ||
                tenant.name.toLowerCase().includes(search.toLowerCase()) ||
                tenant.description.toLowerCase().includes(search.toLowerCase());

            const matchesLocation = locationFilter === "all" || tenant.location === locationFilter;

            const matchesEventType = eventTypeFilter === "all" || tenant.event_types.includes(eventTypeFilter);

            const matchesCapacity = minCapacity === "" || tenant.max_capacity >= Number(minCapacity);

            return matchesSearch && matchesLocation && matchesEventType && matchesCapacity;
        });
    }, [search, locationFilter, eventTypeFilter, minCapacity]);

    const resetFilters = () => {
        setSearch("");
        setLocationFilter("all");
        setEventTypeFilter("all");
        setMinCapacity("");
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground lg:flex-row">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-80 border-r bg-muted/30 p-6 space-y-8 lg:sticky lg:top-0 lg:h-screen overflow-y-auto scrollbar-hide">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                            <Building2 className="size-5 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">OUL</h1>
                    </div>
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Discovery Directory</h2>
                </div>

                <div className="space-y-6">
                    {/* Search Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Search className="size-3" />
                            Search
                        </label>
                        <Input
                            placeholder="Find companies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-background border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary h-10"
                        />
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="size-3" />
                            Location
                        </label>
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger className="bg-background border-none shadow-sm h-10 focus:ring-1 focus:ring-primary">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {locations.map(loc => (
                                    <SelectItem key={loc} value={loc} className="cursor-pointer">{loc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Event Type Filter */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="size-3" />
                            Event Type
                        </label>
                        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                            <SelectTrigger className="bg-background border-none shadow-sm h-10 focus:ring-1 focus:ring-primary">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {EVENT_TYPES.map(type => (
                                    <SelectItem key={type} value={type} className="cursor-pointer">{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Capacity Filter */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Users className="size-3" />
                            Min Capacity
                        </label>
                        <Input
                            type="number"
                            placeholder="Capacity needed..."
                            value={minCapacity}
                            onChange={(e) => setMinCapacity(e.target.value === "" ? "" : Number(e.target.value))}
                            className="bg-background border-none shadow-sm h-10 focus-visible:ring-1 focus-visible:ring-primary"
                        />
                    </div>

                    <Separator className="bg-border/50" />

                    <Button
                        variant="ghost"
                        className="w-full gap-2 text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest h-10"
                        onClick={resetFilters}
                    >
                        <X className="size-3" />
                        Clear All Filters
                    </Button>
                </div>
            </aside>

            {/* Main Grid Content */}
            <main className="flex-1 p-6 lg:p-10 space-y-8 bg-background">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Browse Partners</h2>
                        <p className="text-muted-foreground mt-1">
                            Discover high-quality production partners for your specific event needs.
                        </p>
                    </div>
                    <div className="bg-muted px-4 py-2 rounded-full border border-border/50 shadow-sm">
                        <span className="text-sm font-semibold text-primary">{filteredTenants.length}</span>
                        <span className="text-sm font-medium text-muted-foreground ml-1.5 uppercase tracking-tighter">Results found</span>
                    </div>
                </header>

                {filteredTenants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 rounded-3xl border-2 border-dashed border-muted">
                        <div className="p-6 rounded-3xl bg-muted/50">
                            <Filter className="size-12 text-muted-foreground/30" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold">No partners match your criteria</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Adjust your filters (location, event type, or capacity) to see more results.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="rounded-full px-8 mt-4 hover:bg-primary hover:text-primary-foreground border-primary/20 transition-all font-bold"
                            onClick={resetFilters}
                        >
                            Reset Navigation
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredTenants.map((tenant) => (
                            <Card
                                key={tenant.id}
                                className="group overflow-hidden border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 bg-muted/10 hover:bg-muted/20 flex flex-col rounded-3xl"
                            >
                                <CardHeader className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="size-20 rounded-2xl bg-background border flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                                            <img
                                                src={tenant.logo}
                                                alt={tenant.name}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/10 text-primary font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">
                                            Partner
                                        </Badge>
                                    </div>
                                    <div className="mt-6 space-y-1">
                                        <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                                            {tenant.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground pt-1">
                                            <MapPin className="size-3.5 text-primary/60" />
                                            <span>{tenant.location}</span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 pt-0 space-y-6 flex-1">
                                    <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium">
                                        {tenant.description}
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {tenant.event_types.map(type => (
                                                <Badge key={type} className="bg-primary/5 hover:bg-primary/10 text-primary border-none font-bold text-[10px] uppercase tracking-tighter px-2.5 py-0.5 transition-colors">
                                                    {type}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground border-t border-border/10 pt-4">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="size-3.5 text-primary/40" />
                                                <span>{tenant.max_capacity.toLocaleString()} Capacity</span>
                                            </div>
                                            <Badge variant="ghost" className="text-[10px] p-0 font-bold text-emerald-500">
                                                Verified
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 pt-0">
                                    <Button
                                        className="w-full rounded-2xl font-bold py-6 group-hover:translate-y-[-2px] transition-transform shadow-lg shadow-primary/10"
                                        onClick={() => window.location.href = '/cue'}
                                    >
                                        Select Company
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
