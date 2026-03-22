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
 * Mid   (of 1920):  Ballroom 260 | Canvas 1190 | Assets 470
 * Bot   (of 1920):  NIO 260      | Table 820   | Case 370    | Staff 320  | Slider 150
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
        ballroom: 260,
        canvas: 1190,
        assets: 470,
    },

    /** Bottom-section column ratios */
    bottom: {
        nio: 260,
        table: 820,
        case: 370,
        staff: 320,
        slider: 150,
    },
} as const;
