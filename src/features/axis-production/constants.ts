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

/**
 * Layout proportions derived from the 1920×1080 wireframe.
 * All values are percentages so the layout stays responsive.
 *
 * Rows  (of 1080):  Header 90  | Middle 630  | Bottom 360
 * Mid   (of 1920):  Ballroom 273 | Canvas 1177 | Assets 470
 * Bot   (of 1920):  Table 780    | Case 420    | Staff 520  | Slider 200
 */
export const LAYOUT = {
    /** Row ratios — used as CSS Grid `fr` units */
    rows: {
        header: 90,   // 8.33 %
        middle: 630,  // 58.33 %
        bottom: 360,  // 33.33 %
    },

    /** Middle-section column ratios */
    middle: {
        ballroom: 273,  // 14.22 %
        canvas: 1177,   // 61.30 %
        assets: 470,    // 24.48 %
    },

    /** Bottom-section column ratios */
    bottom: {
        table: 780,   // 40.63 %
        case: 420,    // 21.88 %
        staff: 520,   // 27.08 %
        slider: 200,  // 10.42 %
    },
} as const;
