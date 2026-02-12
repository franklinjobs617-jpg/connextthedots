// lib/data.ts
import { printablesData, PrintableItem } from "./printables-data";

export function getAllPrintables(): PrintableItem[] {
    return Object.values(printablesData).flat();
}

export function getPrintableBySlug(slug: string): PrintableItem | undefined {
    const all = getAllPrintables();

    return all.find((item) => item.id === slug);
}