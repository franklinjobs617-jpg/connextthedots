import { originalSheet } from "@/lib/original-sheets";

export const hundredDotCollection = {
    path: "/connect-the-dots-1-to-100/",
    title: "100-Dot Printables | Free 1–100 Puzzles & Answer PDFs",
    description: "Choose from three connect-the-dots worksheets with exactly 100 numbered dots. Preview each puzzle and answer, then download free A4 or US Letter PDFs.",
} as const;

// Explicit membership: a range such as 100–200 is not an exact 1–100 worksheet.
export const hundredDotSheets = [
    { id: "elephant-100", note: "A broad silhouette with a trunk and two legs. The eye, ear and tail are already drawn." },
    { id: "hot-air-balloon-100", note: "Follow the balloon envelope down to the basket and back up. Panel seams and the basket rim are already drawn." },
    { id: "seahorse-100", note: "Follow a projecting snout, small crest and curled tail. Read the sequence carefully around the coil." },
].map(({ id, note }) => {
    const sheet = originalSheet(id);
    if (sheet.count !== 100) throw new Error(`Not an exact 100-dot worksheet: ${id}`);
    return { ...sheet, note };
});
