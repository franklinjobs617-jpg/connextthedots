/** Task-scoped contract; all PDF/preview names share these exact dimensions. */
export const alphabetDesigns = [
    { id: "fish", title: "Fish", description: "A broad fish body and a pointed tail, with an eye and short mouth already drawn." },
    { id: "rocket", title: "Rocket", description: "A pointed rocket with two side fins, an exhaust opening and a pre-drawn round window." },
    { id: "house", title: "House", description: "A house with a sloping roof, chimney and doorway; two windows are already drawn." },
] as const;
export type LetterCase = "uppercase" | "lowercase";
export type Paper = "A4" | "Letter";
export function alphabetAsset(id: string, letterCase: LetterCase, paper: Paper, kind: "Puzzle" | "Answer", ext: "pdf" | "png" = "pdf") {
    return `/alphabet-dot-to-dot/v1/${id}-${letterCase}-${paper}-${kind}.${ext}`;
}
