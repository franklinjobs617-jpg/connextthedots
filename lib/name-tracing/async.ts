export function abortError(): Error { return new Error('ABORTED'); }
export function checkAbort(signal: AbortSignal): void { if (signal.aborted) throw abortError(); }
export function bounded<T>(promise: Promise<T>, ms: number, signal: AbortSignal, code: string): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback: () => void) => { if (settled) return; settled = true; clearTimeout(timer); signal.removeEventListener('abort', abort); callback(); };
    const abort = () => finish(() => reject(abortError()));
    const timer = setTimeout(() => finish(() => reject(new Error(code))), ms);
    if (signal.aborted) { abort(); return; }
    signal.addEventListener('abort', abort, { once: true });
    promise.then(value => finish(() => resolve(value)), () => finish(() => reject(new Error(code))));
  });
}
export function nextFrame(signal: AbortSignal): Promise<void> {
  return bounded(new Promise(resolve => requestAnimationFrame(() => resolve())), 1500, signal, 'RENDER');
}
