import type { OriginalSheet, SheetSegment } from "@/lib/original-sheets";
import owl from "@/public/printables/tufted-owl-study-207/v2/geometry.json";
import observatory from "@/public/printables/hilltop-observatory-202/v2/geometry.json";
import dragonfly from "@/public/printables/dragonfly-water-lily/v1/task-contract.json";
import candleWindow from "@/public/printables/christmas-candle-window/v1/task-contract.json";

// Read the exact frozen ranges used by the PDFs, not a second handwritten rule list.
function task(geometry: { count: number; segments: SheetSegment[] }) {
    let next = 1;
    for (const segment of geometry.segments) {
        if (segment.start !== next || segment.end < segment.start) throw new Error("Invalid segmented worksheet range");
        next = segment.end + 1;
    }
    if (next !== geometry.count + 1) throw new Error("Incomplete segmented worksheet sequence");
    return { type: "segmented" as const, segments: geometry.segments.map(({ name, start, end, closed }) => ({ name, start, end, closed })) };
}

export const segmentedSheets: readonly OriginalSheet[] = [
    {
        id: "tufted-owl-study-207", assetStem: owl.id, assetVersion: "v2", title: owl.title, count: owl.count,
        description: "Connect 207 numbered dots in 10 separate segments to draw a tufted owl with facial discs, eyes, wing feathers and breast markings. Free A4 and US Letter puzzles include separate matching answer PDFs.",
        reveal: "The body and ear tufts form the first contour. Separate numbered ranges build the two facial discs, eyes, beak, wing feathers and breast plumage. Follow the range table to close the six closed segments and stop at the ends of the four open ones.",
        solveTip: "Read the next number around each eye ring rather than jumping to the neighboring ring. Lift your pen before starting every new range; the wing and breast feather ranges remain open.",
        learningNote: "This is a stylized owl study. Internal features are part of the numbered task, with no pre-drawn details. Difficulty, age suitability and solve time have not been measured.",
        hasPreDrawnDetails: false, task: task(owl),
    },
    {
        id: "hilltop-observatory-202", assetStem: observatory.id, assetVersion: "v2", title: observatory.title, count: observatory.count,
        description: "Join 202 numbered dots in 9 separate segments to reveal an observatory with a dome, telescope, windows, arched doorway and steps. Download free A4 or US Letter puzzle and matching answer PDFs.",
        reveal: "The first range follows the open building boundary. Further ranges add the dome shutter, two dome ribs, windows, an open doorway, telescope tube and foundation steps. Five ranges close; four stop at their final point.",
        solveTip: "Do not draw a baseline across the open building or doorway. The dome ribs are also open. Close only the ranges marked C, then lift your pen before the next range.",
        learningNote: "Curved dome sections alternate with angular architectural details and a tilted telescope. The long step edges provide sequence tracking rather than extra pictorial detail. Difficulty and solve time are unmeasured.",
        hasPreDrawnDetails: false, task: task(observatory),
    },
    {
        id: dragonfly.id, assetStem: dragonfly.assetStem, assetVersion: "v1", title: dragonfly.title, count: dragonfly.count,
        description: `Follow ${dragonfly.count} numbered dots in ${dragonfly.task.segments.length} separate segments to draw a dragonfly and water lily. Download separate A4 or US Letter puzzle and matching answer PDFs.`,
        reveal: "Numbered ranges form the dragonfly body, four wing outlines, the water lily flower and its leaf. Four separate wing veins and the flower stem are also numbered tasks; no interior details are pre-drawn.",
        solveTip: "Keep each wing outline separate from its inner vein. Close only the ranges marked C, stop at the end of O ranges, and lift your pen before the next range; never bridge the gaps between parts.",
        learningNote: "This original nature scene combines insect and plant structures. Its point count is not an age or difficulty rating, and completion time has not been measured.",
        hasPreDrawnDetails: dragonfly.hasPreDrawnDetails,
        task: task({ count: dragonfly.count, segments: dragonfly.task.segments }),
    },
    {
        id: candleWindow.id, assetStem: candleWindow.assetStem, assetVersion: "v1", title: candleWindow.title, count: candleWindow.count,
        description: `Connect ${candleWindow.count} numbered dots in ${candleWindow.task.segments.length} separate segments to reveal a Christmas candle window. Free A4 and US Letter puzzle PDFs include separate matching answers.`,
        reveal: "The arched window frame, two panes, candles, flames and bow are separate numbered contours. The holly sprigs and trailing ribbons are open numbered ranges. No interior scene or decoration is pre-drawn.",
        solveTip: "Close each C range only to its own first point. Stop at the final point of each O holly or ribbon range, lift your pen, and do not add a global last-number-to-1 line.",
        learningNote: "The window frames keep meaningful corners rather than extra points along straight lines. The scene is a segmented tracing task, not an independently rated Extreme or large-print puzzle.",
        hasPreDrawnDetails: candleWindow.hasPreDrawnDetails,
        task: task({ count: candleWindow.count, segments: candleWindow.task.segments }),
    },
];

export function segmentedSheet(id: string): OriginalSheet {
    const item = findSegmentedSheet(id);
    if (!item) throw new Error(`Unknown segmented worksheet: ${id}`);
    return item;
}

/** A prepared entry stays unavailable until its frozen asset record is registered. */
export function findSegmentedSheet(id: string): OriginalSheet | undefined {
    return segmentedSheets.find((sheet) => sheet.id === id);
}
