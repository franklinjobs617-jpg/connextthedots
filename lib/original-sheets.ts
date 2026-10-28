/** New English-only resource contract. Intentionally separate from legacy data. */
export type OriginalSheet = {
    id: string;
    title: string;
    count: number;
    description: string;
    reveal: string;
    solveTip: string;
    learningNote: string;
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
];
export const originalSheetIds = originalSheets.map((item) => item.id);
export function originalSheet(id: string): OriginalSheet {
    const item = originalSheets.find((item) => item.id === id);
    if (!item) throw new Error(`Unknown original worksheet: ${id}`);
    return item;
}
export function sheetAsset(item: OriginalSheet, paper: "A4" | "Letter", kind: "Puzzle" | "Solution", extension: "pdf" | "png" = "pdf") {
    return `/printables/${item.id}/v1/${item.id}-${paper}-${kind}.${extension}`;
}

/** A language switch on a new English sheet leads to the selected home page. */
export function sheetLanguageTarget(pathname: string, locale: string): string {
    const isOriginal = originalSheets.some((item) => pathname.replace(/\/$/, "") === `/printables/${item.id}`);
    return isOriginal && locale !== "en" ? "/" : pathname;
}
