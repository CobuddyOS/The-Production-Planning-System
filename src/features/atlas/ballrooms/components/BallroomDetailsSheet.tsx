import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ruler, Users, Info, Grid } from "lucide-react";
import { AtlasBallroom } from "../types";

interface BallroomDetailsSheetProps {
    ballroom: AtlasBallroom | null;
}

export function BallroomDetailsSheet({ ballroom }: BallroomDetailsSheetProps) {
    if (!ballroom) return null;

    return (
        <SheetContent className="neon-glass-drawer sm:max-w-lg overflow-y-auto">
            <SheetHeader className="pb-6 px-8 border-b text-left">
                <div className="flex items-center gap-2 mb-2">
                    <Badge
                        variant="outline"
                        className={`${ballroom.status === 'active'
                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                            : 'border-red-500/20 bg-red-500/5 text-red-600'
                            }`}
                    >
                        {ballroom.status.charAt(0).toUpperCase() + ballroom.status.slice(1)}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                        {ballroom.atlas_ballroom_categories?.name || 'Uncategorized'}
                    </Badge>
                </div>
                <SheetTitle className="text-2xl font-bold">{ballroom.name}</SheetTitle>
                <SheetDescription className="text-sm">
                    Technical specifications and layout details for the ballroom template.
                </SheetDescription>
            </SheetHeader>

            <div className="space-y-8 py-8 px-8">
                {/* Image Preview */}
                {ballroom.image && (
                    <div className="rounded-xl overflow-hidden border shadow-sm aspect-video bg-muted relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={ballroom.image}
                            alt={ballroom.name}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Main Specs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Ruler className="size-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Dimensions</span>
                        </div>
                        <p className="text-lg font-bold">
                            {ballroom.width} x {ballroom.depth} <span className="text-sm font-normal text-muted-foreground">{ballroom.unit_type}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">Area: {(ballroom.width * ballroom.depth).toFixed(2)} {ballroom.unit_type}²</p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Users className="size-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Max Capacity</span>
                        </div>
                        <p className="text-lg font-bold">
                            {ballroom.capacity || '—'} <span className="text-sm font-normal text-muted-foreground">pax</span>
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold border-b pb-2">
                        <Info className="size-4 text-primary" />
                        About Template
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {ballroom.description || "No description provided for this ballroom template."}
                    </p>
                </div>

                {/* Creation Metadata */}
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Created Date</span>
                            </div>
                            <span className="font-mono font-medium">{new Date(ballroom.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </SheetContent>
    );
}
