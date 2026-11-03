"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { DEFAULT_SETTINGS, ENTRY_PATH, PAPER, settingsKey, type WorksheetSettings } from '@/lib/name-tracing/settings';
import { validateName } from '@/lib/name-tracing/input';
import { errorMessage, generateWorksheet, releaseCanvas, type GenerationPhase, type WorksheetResult } from '@/lib/name-tracing/render';

type Status = 'idle' | 'working' | 'ready' | 'error';
type CurrentResult = WorksheetResult & { version: number; key: string };
const phaseText: Record<GenerationPhase, string> = { font: 'Loading dotted lettering…', render: 'Drawing your worksheet…', pdf: 'Preparing your PDF… The page may pause during this step.' };

export default function NameTracingClient() {
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [settings, setSettings] = useState<WorksheetSettings>({ ...DEFAULT_SETTINGS });
  const [status, setStatus] = useState<Status>('idle');
  const [phase, setPhase] = useState<GenerationPhase>('font');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const [composing, setComposing] = useState(false);
  const [summary, setSummary] = useState<{ paper: string; rows: number; fontSize: number; guides: boolean; pitch: number; reason: string | null } | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const version = useRef(0);
  const running = useRef<AbortController | null>(null);
  const current = useRef<CurrentResult | null>(null);
  const downloadUrls = useRef(new Set<string>());
  const downloadTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const lastDownload = useRef(0);
  const validation = validateName(settings.name);
  const fieldError = !composing && touched && !validation.ok ? validation.message : '';

  useEffect(() => {
    // Recovery reduces later propagation; it cannot erase a prior request or hosting log.
    if (window.location.pathname === ENTRY_PATH && (window.location.search || (window.location.hash && !['#name-tracing-main', '#name-tracing-examples'].includes(window.location.hash)))) window.location.replace(ENTRY_PATH);
    const node = canvas.current, urls = downloadUrls.current, timers = downloadTimers.current;
    return () => { running.current?.abort(); current.current = null; releaseCanvas(node); for (const url of urls) URL.revokeObjectURL(url); for (const timer of timers) clearTimeout(timer); };
  }, []);

  const invalidate = () => {
    version.current++; running.current?.abort(); running.current = null; current.current = null;
    releaseCanvas(canvas.current); setSummary(null); setStatus('idle'); setMessage('');
  };
  const update = (next: Partial<WorksheetSettings>) => { invalidate(); setSettings(previous => ({ ...previous, ...next })); };
  const generate = async () => {
    setTouched(true);
    const name = validateName(settings.name);
    if (!name.ok || composing || !canvas.current) { nameInput.current?.focus(); return; }
    invalidate();
    const id = version.current, controller = new AbortController(); running.current = controller;
    const normalized = { ...settings, name: name.value };
    setStatus('working'); setPhase('font');
    try {
      const result = await generateWorksheet(canvas.current, normalized, controller.signal, value => { if (id === version.current) setPhase(value); });
      if (id !== version.current || controller.signal.aborted) return;
      current.current = { ...result, version: id, key: settingsKey(normalized) };
      setSummary({ paper: PAPER[result.settings.paper].label, rows: result.layout.actualRows, fontSize: result.fontSize, guides: result.settings.guides, pitch: result.layout.rowPitchPt, reason: result.layout.resolutionReason });
      setStatus('ready');
    } catch (error) {
      if (id !== version.current || controller.signal.aborted) return;
      current.current = null; releaseCanvas(canvas.current); setSummary(null); setStatus('error'); setMessage(errorMessage(error));
    } finally { if (id === version.current) running.current = null; }
  };
  const download = () => {
    const result = current.current, name = validateName(settings.name);
    if (!result || result.version !== version.current || status !== 'ready' || !name.ok || result.key !== settingsKey({ ...settings, name: name.value })) return;
    if (Date.now() - lastDownload.current < 800) return;
    lastDownload.current = Date.now();
    try {
      const url = URL.createObjectURL(result.blob); downloadUrls.current.add(url);
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `name-tracing-worksheet-${result.settings.paper}.pdf`;
      document.body.append(anchor); anchor.click(); anchor.remove();
      const timer = setTimeout(() => { URL.revokeObjectURL(url); downloadUrls.current.delete(url); downloadTimers.current.delete(timer); }, 10000);
      downloadTimers.current.add(timer); setMessage('Your PDF download has started.');
    } catch { setMessage('The download could not start. Select Download PDF to try again.'); }
  };
  const startOver = () => { invalidate(); setSettings({ ...DEFAULT_SETTINGS }); setTouched(false); setComposing(false); nameInput.current?.focus(); };

  return <div className="nt-page">
    <a className="nt-skip" href="#name-tracing-main">Skip to the worksheet generator</a>
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Native document links preserve root isolation and avoid RSC under connect-src none. */}
    <header className="nt-brand"><a href="/" rel="noreferrer">ConnectTheDotsPrintable</a><a href="/printable-connect-the-dots/" rel="noreferrer">Printable activities <span aria-hidden="true">↗</span></a></header>
    <main id="name-tracing-main">
      <div className="nt-heading"><p className="nt-eyebrow">ONE NAME. ONE PRINTABLE PAGE.</p><h1>Name Tracing Worksheet Generator</h1><p className="nt-intro">Make a dotted name worksheet in A4 or US Letter. Choose your practice rows and guide lines, then preview and download a PDF.</p></div>
      <div className="nt-workspace" data-clarity-mask="true">
        <section className="nt-panel nt-controls" aria-labelledby="nt-customize">
          <div className="nt-section-title"><span className="nt-step" aria-hidden="true">1</span><h2 id="nt-customize">Make it yours</h2></div>
          <form onSubmit={event => { event.preventDefault(); void generate(); }} method="post" noValidate>
            <label className="nt-label" htmlFor="nt-name">Name</label>
            <input ref={nameInput} id="nt-name" className="nt-name" type="text" value={settings.name} autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="Enter one name" aria-invalid={Boolean(fieldError)} aria-describedby="nt-name-help nt-name-error" onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)} onChange={event => { setTouched(true); update({ name: event.target.value }); }} onBlur={() => setTouched(true)} />
            <p id="nt-name-help" className="nt-help">Up to 40 characters. Latin letters, spaces, hyphens and apostrophes; supported accents are welcome.</p>
            <p id="nt-name-error" className="nt-field-error" aria-live="polite">{fieldError || '\u00a0'}</p>
            <div className="nt-fields">
              <div><label className="nt-label" htmlFor="nt-paper">Paper size</label><select id="nt-paper" value={settings.paper} onChange={event => update({ paper: event.target.value as WorksheetSettings['paper'] })}><option value="a4">A4 · 210 × 297 mm</option><option value="letter">US Letter · 8.5 × 11 in</option></select></div>
              <div><label className="nt-label" htmlFor="nt-rows">Practice rows</label><select id="nt-rows" value={settings.rows} onChange={event => update({ rows: (event.target.value === 'full' ? 'full' : Number(event.target.value)) as WorksheetSettings['rows'] })}><option value="full">Full page · Recommended</option>{[1,2,3,4,5,6,7,8].map(count => <option value={count} key={count}>{count} {count === 1 ? 'row' : 'rows'}</option>)}</select></div>
            </div>
            <label className="nt-check" htmlFor="nt-guides"><input id="nt-guides" type="checkbox" checked={settings.guides} onChange={event => update({ guides: event.target.checked })} /><span><strong>Show guide lines</strong><small>Top, middle and baseline guides</small></span></label>
            <div className="nt-form-actions"><button id="nt-generate" className="nt-button nt-primary" type="submit" disabled={!hydrated || !validation.ok || composing || status === 'working'}>{status === 'working' ? 'Preparing worksheet…' : 'Generate worksheet'}</button><button className="nt-text-button" type="button" onClick={startOver}>Start over</button></div>
            <noscript><p className="nt-notice">Enable JavaScript to create and download a worksheet in your browser.</p></noscript>
          </form>
          <p className="nt-local-note"><span aria-hidden="true">◇</span> Type names here, not in a web address.</p>
        </section>
        <section className="nt-panel nt-preview-panel" aria-labelledby="nt-preview-title" aria-busy={status === 'working'}>
          <div className="nt-preview-top"><div className="nt-section-title"><span className="nt-step" aria-hidden="true">2</span><h2 id="nt-preview-title">Your worksheet</h2></div><span className="nt-paper-tag">{PAPER[settings.paper].label}</span></div>
          <div className="nt-status" aria-live="polite" role="status">{status === 'working' ? phaseText[phase] : status === 'ready' ? 'Ready to download. Your preview matches this PDF.' : status === 'error' ? 'The worksheet is not ready yet.' : 'Generate a worksheet to see your current settings.'}</div>
          <div className="nt-paper" style={{ aspectRatio: `${PAPER[settings.paper].width} / ${PAPER[settings.paper].height}` }}>
            <canvas id="nt-canvas" ref={canvas} width={1} height={1} className="nt-canvas" hidden={status !== 'ready'} role="img" aria-label="Current name tracing worksheet preview" />
            {status !== 'ready' && <div className="nt-preview-placeholder"><div className="nt-paper-icon" aria-hidden="true">Aa</div><p>{status === 'working' ? 'Creating your printable page…' : 'A little practice starts here.'}</p><span>{status === 'working' ? phase === 'pdf' ? 'Please wait for completion or an error. Cancellation is unavailable during PDF preparation.' : 'You can cancel before PDF preparation starts.' : 'Enter a name and select Generate worksheet.'}</span>{status === 'working' && phase !== 'pdf' && <button type="button" className="nt-text-button" onClick={() => { invalidate(); setMessage('Generation cancelled. You can adjust the settings and try again.'); }}>Cancel generation</button>}</div>}
          </div>
          {status === 'error' && <div className="nt-error" role="alert"><p>{message}</p><button type="button" className="nt-button nt-secondary" onClick={() => void generate()} disabled={!validation.ok}>Try again</button><button type="button" className="nt-text-button" onClick={() => nameInput.current?.focus()}>Change the name</button><p className="nt-reopen">If retrying still fails, <a href={ENTRY_PATH} rel="noreferrer">reopen the clean tool</a>. This clears the entered name and current result.</p></div>}
          {summary && <p className="nt-preview-caption">{summary.rows} {summary.rows === 1 ? 'row' : 'rows'} · {summary.paper} · {summary.guides ? 'Guide lines on' : 'No guide lines'} · {Number(summary.fontSize.toFixed(1))} pt lettering · {summary.pitch.toFixed(1)} pt row spacing{summary.reason && <> · {summary.reason}</>}</p>}
          <button id="nt-download" type="button" className="nt-button nt-download" disabled={status !== 'ready'} onClick={download}>Download PDF <span aria-hidden="true">↓</span></button>
          {status !== 'error' && <p className="nt-message" aria-live="polite">{message || 'One page · Black and white · Print at actual size (100%)'}</p>}
        </section>
      </div>
      <section className="nt-info" aria-labelledby="nt-about"><h2 id="nt-about">Simple settings, a clear printable</h2><div className="nt-info-grid"><div><h3>Choose your page</h3><p>Use A4 or US Letter paper. Print at actual size (100%) to keep the page dimensions and margins.</p></div><div><h3>Keep longer names readable</h3><p>Lettering fits the available width. If a name would become too small, the tool asks you to shorten it instead of cutting it off.</p></div><div><h3>Dotted letters, optional guides</h3><p>Guide lines help position the lettering. This worksheet does not show stroke order or provide handwriting instruction.</p></div></div></section>
      <section className="nt-privacy" aria-labelledby="nt-privacy-title"><h2 id="nt-privacy-title">About your name and privacy</h2><p>The name you type is used in this browser to make the preview and PDF. This tool does not add it to the web address or download file name, or send it to an application API.</p><p>Keep names out of links. A name placed manually in a web address may reach hosting logs or appear in an initial framework response before the clean entry opens. Clearing the address later does not undo that initial handling.</p><p className="nt-font-credit">Dotted lettering: Raleway Dots, under the <a href="/fonts/name-tracing/v1/OFL.txt" rel="noreferrer">SIL Open Font License</a>.</p></section>
    </main>
    <footer className="nt-footer"><span>ConnectTheDotsPrintable</span><a href={ENTRY_PATH} rel="noreferrer">Open a clean worksheet</a></footer>
  </div>;
}
