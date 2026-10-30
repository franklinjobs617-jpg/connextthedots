'use client';
import { useState } from 'react';
import Image from 'next/image';
import designs from '@/scripts/skip-counting/designs.json';

export default function Collection() {
  const [step, setStep] = useState(2);
  const [id, setId] = useState(designs[0].id);
  const [paper, setPaper] = useState('A4');
  const [kind, setKind] = useState('Puzzle');
  const available = designs.filter(d => d.step === step);
  return <section aria-label="Choose a skip-counting worksheet" className="mt-8">
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
      <label className="grid gap-2 font-semibold">Count by<select className="rounded border p-3" aria-label="Count by" value={step} onChange={e => { const value = Number(e.target.value); setStep(value); setId(designs.find(d => d.step === value)!.id); }}><option value={2}>2s</option><option value={5}>5s</option><option value={10}>10s</option></select></label>
      <label className="grid gap-2 font-semibold">Worksheet<select className="rounded border p-3" aria-label="Worksheet" value={id} onChange={e => setId(e.target.value)}>{available.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}</select></label>
      <label className="grid gap-2 font-semibold">Paper size<select className="rounded border p-3" aria-label="Paper size" value={paper} onChange={e => setPaper(e.target.value)}><option>A4</option><option value="Letter">US Letter</option></select></label>
      <label className="grid gap-2 font-semibold">Preview<select className="rounded border p-3" aria-label="Preview" value={kind} onChange={e => setKind(e.target.value)}><option>Puzzle</option><option>Answer</option></select></label>
    </div>
    {designs.map(d => {
      const end = d.step * d.dotCount;
      const asset = (type: string, ext: string) => `/skip-counting/${d.id}/v1/${d.id}-${paper}-${type}.${ext}`;
      return <article key={d.id} hidden={d.id !== id} aria-label={`${d.title} counting by ${d.step}`} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid items-start gap-7 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">{d.title} — count by {d.step}</h2>
            <p className="mt-3 text-lg">{d.dotCount} dots · start {d.step} · end {end} · add {d.step}</p>
            <p className="mt-3">Connect {d.step}, {d.step * 2}, {d.step * 3}, …, {end} in order. Then connect {end} back to {d.step} to close the picture.</p>
            <p className="mt-3 text-slate-600">The ending number is {end}; this worksheet has {d.dotCount} dots.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a data-download="Puzzle" className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white" href={asset('Puzzle', 'pdf')} download>Download {paper} puzzle PDF</a>
              <a data-download="Answer" className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-800" href={asset('Answer', 'pdf')} download>Download {paper} answer PDF</a>
            </div>
            <p className="mt-4 text-sm">Preview: {paper} {kind.toLowerCase()}, rendered from the matching final PDF.</p>
            <details className="mt-5"><summary className="cursor-pointer font-semibold">Read the complete counting sequence</summary><p className="mt-2 leading-8">{Array.from({ length: d.dotCount }, (_, i) => d.step * (i + 1)).join(', ')}. Then return to {d.step}.</p></details>
          </div>
          <a href={asset(kind, 'png')} aria-label={`Open full-size ${d.title} ${paper} ${kind} preview`}><Image src={asset(kind, 'png')} alt={`${d.title}: ${d.dotCount} dots counting by ${d.step}, ${d.step} to ${end}; ${paper} ${kind}`} width={paper === 'A4' ? 893 : 918} height={paper === 'A4' ? 1263 : 1188} unoptimized className="h-auto w-full border border-slate-100" /></a>
        </div>
      </article>;
    })}
    <h2 className="mt-10 text-2xl font-bold">Six original pictures</h2>
    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{designs.map(d => <li key={d.id}><button type="button" onClick={() => { setStep(d.step); setId(d.id); }} className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-600" aria-pressed={id === d.id}><strong>{d.title}</strong><br />By {d.step} · {d.dotCount} dots · {d.step}–{d.step * d.dotCount}</button></li>)}</ul>
  </section>;
}
