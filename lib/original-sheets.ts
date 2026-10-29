import { segmentedSheetIds } from "@/lib/segmented-sheet-ids";

export type SheetSegment = {
    name: string;
    start: number;
    end: number;
    closed: boolean;
};

/** English-only resource contract. Omitted task retains the original closed path. */
export type OriginalSheet = {
    id: string;
    title: string;
    count: number;
    description: string;
    reveal: string;
    solveTip: string;
    learningNote: string;
    hasPreDrawnDetails?: boolean;
    assetStem?: string;
    assetVersion?: "v1" | "v2";
    task?: { type: "segmented"; segments: readonly SheetSegment[] };
};

export const originalSheets: readonly OriginalSheet[] = [
    {
        id: "elephant-100", title: "Elephant", count: 100,
        description: "Join 100 numbered dots to draw a left-facing elephant with a hanging trunk and two broad legs. Get the free A4 or US Letter puzzle and separate answer PDF.",
        reveal: "The numbered outline runs over the rounded back, down the rear leg, under the belly and around the trunk. The ear, eye and thin tail are already drawn as solid details on both versions.",
        solveTip: "Follow the inward turn below the head carefully: it separates the trunk from the front leg. Finish by joining 100 back to 1 at the forehead.",
        learningNote: "Use this sheet for counting through 100 while following a broad animal silhouette. It is a stylized side view rather than an anatomical illustration.",
    },
    {
        id: "hot-air-balloon-100", title: "Hot-air Balloon", count: 100,
        description: "Connect dots 1–100 around a hot-air balloon and its basket. Download a free single-page puzzle plus matching answer in A4 and US Letter sizes.",
        reveal: "Start at the top of the envelope, follow the right side down to the basket, then return up the left side. Two panel seams and the basket rim are pre-drawn; the outside boundary is the numbered task.",
        solveTip: "The sequence stays continuous through the narrow section above the basket. Do not jump across from one side of the envelope to the other. Join 100 to 1 at the top to close it.",
        learningNote: "This mostly symmetrical design offers long curved stretches followed by short basket turns, making it a different tracing task from the animal outlines.",
    },
    {
        id: "seahorse-100", title: "Seahorse", count: 100,
        description: "Trace a curled seahorse using exactly 100 numbered dots. Free A4 and US Letter puzzle PDFs each have a separate solution made from the same points.",
        reveal: "The right-facing seahorse has a projecting snout, a small angular crest and a coiled tail. The eye and two short body accents are already inked; the curl belongs to the numbered outline.",
        solveTip: "At the tail, follow consecutive numbers into the coil and back out. Nearby dots across the curl are not necessarily the next dot. Close the contour by joining 100 to 1 near the crest.",
        learningNote: "Choose this sheet when you want a compact spiral section as well as an outer silhouette. The seahorse is an original stylized drawing, with no species identification implied.",
    },
    {
        id: "hummingbird-120", title: "Hummingbird", count: 120,
        description: "Follow 120 numbered dots to reveal a hovering hummingbird with raised wings, a long bill and a forked tail. Free puzzle and answer PDFs come in A4 and US Letter.",
        reveal: "One closed path describes the raised upper wing, the spread lower wing, the tail, the breast and the long bill. The eye and short feather accents are pre-drawn on the puzzle and solution.",
        solveTip: "Keep following the labels around each wing tip and both tail turns. At the bill, the path returns along its lower edge; finish with 120 back to 1 beside the wing root.",
        learningNote: "This sheet extends counting beyond 100 and includes pointed changes of direction. It is not rated by age or difficulty, and no completion time has been measured.",
    },
    {
        id: "shark-140", title: "Shark", count: 140,
        description: "Draw a right-facing shark by joining dots 1–140, then close the outline. Download free A4 and US Letter puzzle PDFs with separate matching answer keys.",
        reveal: "The profile includes a tall dorsal fin, a lower fin and an asymmetric tail. The eye, mouth and three short gill marks are solid starting details, while the body and fins form the numbered contour.",
        solveTip: "Follow the short turns at the dorsal fin and tail by number rather than by the nearest dot. After 140, join back to 1 at the upper tail-to-body junction.",
        learningNote: "The 140-point sequence provides a longer counting task than the 100-dot sheets. The shark is a stylized original profile, not a species guide or an extreme-difficulty claim.",
    },
    {
        id: "flamingo-150",
        title: "Flamingo",
        count: 150,
        description: "Connect 150 numbered dots around a flamingo with a curved neck, long beak and bent legs. Free A4 and US Letter puzzles each have a separate matching answer PDF.",
        reveal: "One continuous outline follows the head, beak, neck, broad body and both legs. The space between the legs is part of the numbered contour; there are no pre-drawn interior details.",
        solveTip: "Follow each number through the narrow leg turns rather than connecting nearby points across the gap. Join 150 back to 1 near the head to close the outline.",
        learningNote: "This stylized standing-bird profile offers long body stretches and short directional changes at the feet. Its 150-point count does not imply a measured age or difficulty rating.",
        hasPreDrawnDetails: false,
    },
    {
        id: "chameleon-160",
        title: "Chameleon",
        count: 160,
        description: "Follow exactly 160 dots to draw a right-facing chameleon with a curled tail, raised head crest and bent legs. Download free A4 or US Letter puzzle and answer PDFs.",
        reveal: "The numbered silhouette wraps around the body, crest, snout, legs and open tail curl. There are no pre-drawn scales or eye; the full task is a single closed outline.",
        solveTip: "Around the tail curl and feet, read consecutive numbers carefully: dots across a narrow gap are not necessarily next. Complete the contour by joining 160 back to 1.",
        learningNote: "The tail curl makes a different tracking task from the straighter cactus sheet. This is a stylized profile rather than a species illustration; human solve time is unmeasured.",
        hasPreDrawnDetails: false,
    },
    {
        id: "cactus-160",
        title: "Cactus",
        count: 160,
        description: "Join dots 1–160 around a branching cactus with a tall central stem and two unequal arms. Free A4 and US Letter PDFs include separate puzzles and matching solutions.",
        reveal: "The path traces both arms and the central stem in a single closed contour. All branches belong to the numbered outline, with no spines or other interior detail already drawn.",
        solveTip: "Keep following the sequence into and out of each arm before continuing around the stem. After 160, join back to 1 across the base to finish.",
        learningNote: "Long upright sections alternate with short corners at the branch joins. The cactus is an original geometric plant silhouette, with no botanical species claim.",
        hasPreDrawnDetails: false,
    },
    {
        id: "swan-90",
        title: "Swan",
        count: 90,
        description: "Draw a swan with a curved neck, pointed beak and broad body by connecting exactly 90 dots. Get free A4 and US Letter puzzle PDFs with separate answer keys.",
        reveal: "A single outline runs over the body, around the neck and beak, then underneath the body. No wing or eye is pre-drawn, so the numbered contour provides the whole illustration.",
        solveTip: "Follow the inward neck bend by number instead of jumping across to the outside edge. Close the body by joining 90 back to 1.",
        learningNote: "This sheet uses fewer dots than the 150- and 160-point sheets. Labels remain ordinary 9 pt; it is not a verified large-print activity, and age suitability has not been measured.",
        hasPreDrawnDetails: false,
    },
    {
        id: "maple-leaf-90",
        title: "Maple Leaf",
        count: 90,
        description: "Connect 90 numbered dots to reveal a maple-shaped leaf with pointed lobes and a narrow stem. Free A4 and US Letter puzzles come with separate matching solution PDFs.",
        reveal: "The sequence follows the stem, pointed lobes and inward notches as one continuous outline. There are no pre-drawn veins; the task is to recover the whole leaf boundary.",
        solveTip: "At every notch, follow the next number rather than drawing straight across between neighboring tips. Finish by joining 90 to 1 across the stem end.",
        learningNote: "Alternating tips and notches make this an angular tracing task distinct from the animal profiles. The leaf is stylized. Labels are ordinary 9 pt; print readability has not been independently tested.",
        hasPreDrawnDetails: false,
    },
];
export const originalSheetIds = originalSheets.map((item) => item.id);
export function originalSheet(id: string): OriginalSheet {
    const item = originalSheets.find((item) => item.id === id);
    if (!item) throw new Error(`Unknown original worksheet: ${id}`);
    return item;
}
export function sheetAsset(item: OriginalSheet, paper: "A4" | "Letter", kind: "Puzzle" | "Solution", extension: "pdf" | "png" = "pdf") {
    return `${sheetSource(item)}/${item.assetStem ?? item.id}-${paper}-${kind}.${extension}`;
}

export function sheetSource(item: OriginalSheet) {
    return `/printables/${item.id}/${item.assetVersion ?? "v1"}`;
}

/** A language switch on a new English sheet leads to the selected home page. */
export function sheetLanguageTarget(pathname: string, locale: string): string {
    const isOriginal = [...originalSheetIds, ...segmentedSheetIds].some((id) => pathname.replace(/\/$/, "") === `/printables/${id}`);
    return isOriginal && locale !== "en" ? "/" : pathname;
}
