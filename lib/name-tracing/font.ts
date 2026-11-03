import { bounded, checkAbort } from './async';
import { FONT_FAMILY } from './settings';
const FONT_URL = '/fonts/name-tracing/v1/RalewayDots-Regular.ttf';
let loaded: FontFace | null = null;
let pending: Promise<FontFace> | null = null;
let attempt = 0;
export async function ensureLettering(signal: AbortSignal): Promise<void> {
  checkAbort(signal);
  if (loaded?.status === 'loaded') return;
  if (!pending) {
    const id = ++attempt;
    // A new explicit attempt can recover from a failed or stalled browser font request.
    const url = id === 1 ? FONT_URL : `${FONT_URL}?load=${id}`;
    const face = new FontFace(FONT_FAMILY, `url("${url}")`, { style: 'normal', weight: '400' });
    const promise = face.load().then(value => {
      if (id === attempt) { document.fonts.add(value); loaded = value; }
      return value;
    });
    pending = promise;
    void promise.then(() => { if (pending === promise) pending = null; }, () => { if (pending === promise) pending = null; });
  }
  const current = pending;
  try { await bounded(current, 10000, signal, 'FONT'); }
  catch (error) { if (pending === current) pending = null; throw error; }
  checkAbort(signal);
}
