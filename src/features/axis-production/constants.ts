import { Mic2, Video, Lightbulb, LayoutGrid, Cable } from "lucide-react";

export const CATEGORY_ICONS: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    Audio: Mic2,
    Video: Video,
    Lighting: Lightbulb,
    "Tech Table Items": LayoutGrid,
    "Cable Trunk Hardware": Cable,
};
