import { PAPER, FONT_FAMILY, type WorksheetSettings } from './settings';
import { bounded, checkAbort, nextFrame } from './async';
import { validatedSettings } from './input';
import { ensureLettering } from './font';
import { resolveWorksheetLayout, type WorksheetLayout } from './layout';
export type GenerationPhase = 'font' | 'render' | 'pdf';
export type WorksheetResult = { blob: Blob; fontSize: number; width: number; height: number; settings: WorksheetSettings; layout: WorksheetLayout };
export async function generateWorksheet(canvas: HTMLCanvasElement, raw: WorksheetSettings, signal: AbortSignal, phase: (value: GenerationPhase) => void): Promise<WorksheetResult> {
  const settings = validatedSettings(raw); checkAbort(signal);
  phase('font');
  await ensureLettering(signal);
  checkAbort(signal); phase('render'); await nextFrame(signal);
  const paper = PAPER[settings.paper], scale = 300 / 72;
  canvas.width = Math.ceil(paper.width * scale); canvas.height = Math.ceil(paper.height * scale);
  const ctx = canvas.getContext('2d', { alpha: false }); if (!ctx) throw new Error('RENDER');
  // Paint all integer pixels before scaling, including the fractional paper edge.
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.scale(scale, scale);
  const layout = resolveWorksheetLayout(ctx, settings);
  const fontSize = layout.fontSizePt;
  ctx.font = `${fontSize}px ${FONT_FAMILY}`;
  for (const y of layout.baselines) {
    if (settings.guides) {
      ctx.strokeStyle = '#aaaaaa'; ctx.lineWidth = .5;
      for (const offset of layout.guideOffsets) {
        ctx.setLineDash(offset === -fontSize * .3 ? [3, 3] : []); ctx.beginPath(); ctx.moveTo(layout.guideLeftPt, y + offset); ctx.lineTo(layout.guideRightPt, y + offset); ctx.stroke();
      }
    }
    ctx.fillStyle = '#000000'; ctx.fillText(settings.name, layout.x, y);
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
  return { blob, fontSize, width: canvas.width, height: canvas.height, settings, layout };
}
export function releaseCanvas(canvas: HTMLCanvasElement | null): void { if (canvas) { canvas.width = 1; canvas.height = 1; } }
export function errorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  if (code === 'TOO_WIDE') return 'That name is too wide to keep the lettering readable. Use a shorter name and try again.';
  if (code === 'ROW_COUNT_TOO_HIGH') return 'Those rows do not fit this name and paper safely. Choose Full page or fewer rows and try again.';
  if (code === 'FONT') return 'The dotted lettering could not load in time. Check your connection, then try again.';
  if (code === 'INPUT' || code === 'SETTINGS') return 'Check the name and page settings, then try again.';
  return 'The worksheet could not be prepared. Try again, or change the name and settings.';
}
