export type PaperSize = 'a4' | 'letter';
export type RequestedRows = 'full' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type WorksheetSettings = { name: string; paper: PaperSize; rows: RequestedRows; guides: boolean };
export const PAPER = { a4: { label: 'A4', width: 595.28, height: 841.89 }, letter: { label: 'US Letter', width: 612, height: 792 } } as const;
export const ENTRY_PATH = '/name-tracing-worksheet/';
export const CANONICAL_URL = 'https://connectthedotsprintable.online/name-tracing-worksheet/';
export const FONT_FAMILY = 'NameTracingDots';
export const DEFAULT_SETTINGS: WorksheetSettings = { name: '', paper: 'a4', rows: 'full', guides: true };
export function settingsKey(settings: WorksheetSettings): string { return JSON.stringify(settings); }
