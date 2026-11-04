import { PAPER, FONT_FAMILY, type WorksheetSettings } from './settings';

// G0-approved geometry: preserve the width-fit rule and >=90pt practice pitch.
// The extra raster inset protects the nominal 36pt margin at fractional pixel edges.
export const GEOMETRY = { safeMarginPt: 36, rasterInsetPt: 1, minimumPitchPt: 90, maximumRows: 8 } as const;
export type WorksheetLayout = {
  requestedRows: WorksheetSettings['rows']; actualRows: number; availableRows: number;
  fontSizePt: number; rowPitchPt: number; baselines: number[]; x: number;
  guideOffsets: number[]; guideLeftPt: number; guideRightPt: number;
  safeMarginPt: number; rasterInsetPt: number; resolutionReason: string | null;
};
export function resolveWorksheetLayout(ctx: CanvasRenderingContext2D, settings: WorksheetSettings): WorksheetLayout {
  const paper = PAPER[settings.paper];
  ctx.font = `48px ${FONT_FAMILY}`;
  const fontSizePt = Math.min(48, 48 * (paper.width - 72) * .98 / ctx.measureText(settings.name).width);
  if (!Number.isFinite(fontSizePt) || fontSizePt < 24) throw new Error('TOO_WIDE');
  ctx.font = `${fontSizePt}px ${FONT_FAMILY}`;
  const metrics = ctx.measureText(settings.name), x = (paper.width - metrics.width) / 2;
  const activeMargin = GEOMETRY.safeMarginPt + GEOMETRY.rasterInsetPt;
  const topExtent = Math.max(metrics.actualBoundingBoxAscent, settings.guides ? fontSizePt * .75 + .25 : 0);
  const bottomExtent = Math.max(metrics.actualBoundingBoxDescent, settings.guides ? fontSizePt * .22 + .25 : 0);
  const firstBaseline = activeMargin + topExtent, lastBaseline = paper.height - activeMargin - bottomExtent;
  const availableRows = Math.max(0, Math.min(GEOMETRY.maximumRows, Math.floor((lastBaseline - firstBaseline) / GEOMETRY.minimumPitchPt) + 1));
  const actualRows = settings.rows === 'full' ? availableRows : settings.rows;
  if (actualRows < 1 || actualRows > availableRows) throw new Error('ROW_COUNT_TOO_HIGH');
  const rowPitchPt = actualRows === GEOMETRY.maximumRows ? (lastBaseline - firstBaseline) / (actualRows - 1) : GEOMETRY.minimumPitchPt;
  const baselines = Array.from({ length: actualRows }, (_, index) => firstBaseline + index * rowPitchPt);
  const guideOffsets = settings.guides ? [-fontSizePt * .75, -fontSizePt * .3, fontSizePt * .22] : [];
  for (const y of baselines) {
    if (x - metrics.actualBoundingBoxLeft < 36 || x + metrics.actualBoundingBoxRight > paper.width - 36 || y - metrics.actualBoundingBoxAscent < 36 || y + metrics.actualBoundingBoxDescent > paper.height - 36) throw new Error('TOO_WIDE');
    for (const offset of guideOffsets) if (y + offset - .25 < 36 || y + offset + .25 > paper.height - 36) throw new Error('ROW_COUNT_TOO_HIGH');
  }
  return { requestedRows: settings.rows, actualRows, availableRows, fontSizePt, rowPitchPt, baselines, x, guideOffsets, guideLeftPt: activeMargin, guideRightPt: paper.width - activeMargin, safeMarginPt: 36, rasterInsetPt: 1, resolutionReason: settings.rows === 'full' && actualRows < 8 ? 'The lettering and guide lines limit the rows on this paper.' : null };
}
