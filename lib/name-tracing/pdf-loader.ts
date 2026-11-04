import { bounded, checkAbort } from './async';

type PdfModule = { jsPDF: typeof import('jspdf').jsPDF };
type LoadRequest = { promise: Promise<PdfModule>; dispose: () => void };
const PDF_SCRIPT = '/name-tracing/vendor/v1/jspdf-4.2.0.db83fc811c81.umd.min.js';
const PDF_INTEGRITY = 'sha384-QgylrxI5Yl5GgBcwJUoY+eXWrJ8Hdd2yCLHPCD/q90kMXcaRulJnwQ0U94saGFR1';
let pending: LoadRequest | null = null;

function loadedPdf(): PdfModule | null {
  const ctor = (window as Window & { jspdf?: Partial<PdfModule> }).jspdf?.jsPDF;
  return typeof ctor === 'function' && ctor.version === '4.2.0' ? { jsPDF: ctor } : null;
}
function requestPdf(): LoadRequest {
  const script = document.createElement('script');
  const dispose = () => { script.onload = null; script.onerror = null; script.remove(); };
  let resolve!: (value: PdfModule) => void, reject!: (error: Error) => void;
  const promise = new Promise<PdfModule>((yes, no) => { resolve = yes; reject = no; });
  const request = { promise, dispose };
  const finish = (api: PdfModule | null = null) => {
    if (pending === request) pending = null;
    dispose();
    if (api) resolve(api); else reject(new Error('PDF'));
  };
  pending = request;
  script.src = PDF_SCRIPT; script.async = true; script.integrity = PDF_INTEGRITY;
  script.onload = () => finish(loadedPdf());
  script.onerror = () => finish();
  try { document.head.append(script); } catch { finish(); }
  return request;
}
// Each explicit attempt gets a fresh script request after failure/timeout/cancel.
// Only the fixed library constructor is cached; no worksheet data enters this loader.
export async function loadPdf(signal: AbortSignal): Promise<PdfModule> {
  checkAbort(signal);
  const api = loadedPdf();
  if (api) return api;
  const request = pending ?? requestPdf();
  try { return await bounded(request.promise, 15000, signal, 'PDF'); }
  catch (error) {
    if (pending === request) { pending = null; request.dispose(); }
    throw error;
  }
}
