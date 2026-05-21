import generatedPrintables from "./generated-standalone-printables.json";

export type ShowcasePrintable = (typeof generatedPrintables)[number];

const printableMap = new Map(
  generatedPrintables.map((item) => [item.id, item] as const)
);

export function getShowcasePrintable(id: string): ShowcasePrintable {
  const item = printableMap.get(id);
  if (!item) {
    throw new Error(`Missing showcase printable: ${id}`);
  }
  return item;
}

export const animalShowcaseIds = [
  "simple-rabbit-outline",
  "puppy-sketch",
  "cat-outline",
  "turtle-crawling-line-art",
  "cute-fox-line-art",
  "owl-line-art",
  "cute-bear-sitting",
  "dolphin",
  "whale",
  "giraffe",
  "koala-sleeping",
  "frog",
  "snail-lineart",
  "squirrel",
] as const;

export const animalShowcase = animalShowcaseIds.map(getShowcasePrintable);

export const conversionExamples = {
  pet: getShowcasePrintable("puppy-sketch"),
  outline: getShowcasePrintable("cute-fox-line-art"),
  worksheet: getShowcasePrintable("simple-rabbit-outline"),
};
