import { PAPER, FONT_FAMILY, type WorksheetSettings } from './settings';
import { bounded, checkAbort, nextFrame } from './async';
import { validatedSettings } from './input';
import { ensureLettering } from './font';
export type GenerationPhase = 'font' | 'render' | 'pdf';
export type WorksheetResult = { blob: Blob; fontSize: number; width: number; height: number; settings: WorksheetSettings };
export async function generateWorksheet(canvas: HTMLCanvasElement, raw: WorksheetSettings, signal: AbortSignal, phase: (value: GenerationPhase) => void): Promise<WorksheetResult> {
  const settings = validatedSettings(raw); checkAbort(signal);
  phase('font');
  await ensureLettering(signal);
  checkAbort(signal); phase('render'); await nextFrame(signal);
  const paper = PAPER[settings.paper], scale = 300 / 72;
  canvas.width = Math.ceil(paper.width * scale); canvas.height = Math.ceil(paper.height * scale);
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('RENDER');
  // Paint all integer pixels before scaling, including the fractional paper edge.
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.scale(scale, scale);
  ctx.font = `48px ${FONT_FAMILY}`;
  const fontSize = Math.min(48, 48 * (paper.width - 72) * .98 / ctx.measureText(settings.name).width);
  if (fontSize < 24) throw new Error('TOO_WIDE');
  ctx.font = `${fontSize}px ${FONT_FAMILY}`;
  const metrics = ctx.measureText(settings.name), x = (paper.width - metrics.width) / 2;
  for (let row = 0; row < settings.rows; row++) {
    const y = 100 + row * 90;
    if (x - metrics.actualBoundingBoxLeft < 36 || x + metrics.actualBoundingBoxRight > paper.width - 36 || y - metrics.actualBoundingBoxAscent < 36 || y + metrics.actualBoundingBoxDescent > paper.height - 36) throw new Error('TOO_WIDE');
    if (settings.guides) {
      ctx.strokeStyle = '#aaaaaa'; ctx.lineWidth = .5;
      for (const offset of [-fontSize * .75, -fontSize * .3, fontSize * .22]) {
        ctx.setLineDash(offset === -fontSize * .3 ? [3, 3] : []); ctx.beginPath(); ctx.moveTo(36, y + offset); ctx.lineTo(paper.width - 36, y + offset); ctx.stroke();
      }
    }
    ctx.fillStyle = '#000000'; ctx.fillText(settings.name, x, y);
  }
  checkAbort(signal); phase('pdf'); await nextFrame(signal);
  const png = await bounded(new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('PNG')), 'image/png')), 10000, signal, 'PNG');
  const bytes = new Uint8Array(await bounded(png.arrayBuffer(), 10000, signal, 'PNG'));
  const { jsPDF } = await bounded(import('jspdf'), 15000, signal, 'PDF');
  checkAbort(signal); await nextFrame(signal);
  const doc = new jsPDF({ unit: 'pt', format: settings.paper, compress: true, putOnlyUsedFonts: true });
  doc.addImage(bytes, 'PNG', 0, 0, paper.width, paper.height, undefined, 'FAST');
  const blob = doc.output('blob'); checkAbort(signal);
  if (!blob.size) throw new Error('PDF');
  return { blob, fontSize, width: canvas.width, height: canvas.height, settings };
}
export function releaseCanvas(canvas: HTMLCanvasElement | null): void { if (canvas) { canvas.width = 1; canvas.height = 1; } }
export function errorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  if (code === 'TOO_WIDE') return 'That name is too wide to keep the lettering readable. Use a shorter name and try again.';
  if (code === 'FONT') return 'The dotted lettering could not load in time. Check your connection, then try again.';
  if (code === 'INPUT' || code === 'SETTINGS') return 'Check the name and page settings, then try again.';
  return 'The worksheet could not be prepared. Try again, or change the name and settings.';
}
