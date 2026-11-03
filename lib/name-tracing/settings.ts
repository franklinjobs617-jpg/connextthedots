export type PaperSize = 'a4' | 'letter';
export type WorksheetSettings = { name: string; paper: PaperSize; rows: number; guides: boolean };
export const PAPER = { a4: { label: 'A4', width: 595.28, height: 841.89 }, letter: { label: 'US Letter', width: 612, height: 792 } } as const;
export const ENTRY_PATH = '/name-tracing-worksheet/';
export const CANONICAL_URL = 'https://connectthedotsprintable.online/name-tracing-worksheet/';
export const FONT_FAMILY = 'NameTracingDots';
export const DEFAULT_SETTINGS: WorksheetSettings = { name: '', paper: 'a4', rows: 6, guides: true };
export function settingsKey(settings: WorksheetSettings): string { return JSON.stringify(settings); }
