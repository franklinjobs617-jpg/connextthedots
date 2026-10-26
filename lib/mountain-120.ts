import type { PrintableItem } from "./printables-data";

// An isolated English record: do not inject this into legacy difficulty buckets.
const assets = "/printables/mountain-landscape-120/v0.2";
export const mountain120 = {
    id: "mountain-landscape-120",
    title: "Mountain Landscape — 120-Point Dot to Dot",
    description: "Connect 120 numbered dots to reveal three mountain peaks and a foreground fir tree. Download the free A4 puzzle and its matching solution PDF.",
    difficulty: "Unrated",
    tagColor: "bg-brand-blue",
    imageUrl: `${assets}/Mountain-Landscape-120-Puzzle-preview.png`,
    imageSrcset: `${assets}/Mountain-Landscape-120-Puzzle-preview.png 1191w`,
    altText: "A4 Mountain Landscape puzzle with 120 numbered dots and a website credit in the footer",
    detailPage: "/printables/mountain-landscape-120/",
    solutionUrl: `${assets}/Mountain-Landscape-120-Solution-preview.png`,
    solutionAltText: "Matching Mountain Landscape solution connecting points 1 through 120 and back to 1",
    category: ["Landscape"],
    dotRange: [120, 120],
    ageRecommendation: "Adults",
    popularity: 0,
    pointCount: 120,
    puzzlePdf: `${assets}/Mountain-Landscape-120-Puzzle.pdf`,
    solutionPdf: `${assets}/Mountain-Landscape-120-Solution.pdf`,
} satisfies PrintableItem & { pointCount: number; puzzlePdf: string; solutionPdf: string };
