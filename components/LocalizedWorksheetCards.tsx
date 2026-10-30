"use client";
import { useState } from "react";
import worksheets from "@/public/localized-printables/manifest.json";
import { localizedCopy, localizedLocale } from "@/lib/localized-copy";

const frenchParts: Record<string, string> = {
  "body and ear tufts": "Corps et aigrettes", "left facial disc": "Disque facial gauche", "right facial disc": "Disque facial droit", "left eye": "Œil gauche", "right eye": "Œil droit", beak: "Bec", "left flight feathers": "Rémiges gauches", "right flight feathers": "Rémiges droites", "breast chevrons": "Chevrons de la poitrine", "lower plumage": "Plumage inférieur",
  "dome and building": "Dôme et bâtiment", "dome shutter": "Volet du dôme", "left dome ribs": "Nervure gauche du dôme", "right dome ribs": "Nervure droite du dôme", "left window": "Fenêtre gauche", "right window": "Fenêtre droite", "arched door": "Porte cintrée", "telescope tube": "Tube du télescope", "foundation steps": "Marches du soubassement",
};

function WorksheetCard({ sheet, language }: { sheet: typeof worksheets[number]; language: "fr" | "it" | "es" }) {
  const [paper, setPaper] = useState("A4");
  const [kind, setKind] = useState("Puzzle");
  const copy = localizedCopy[language];
  const active = sheet.exports.find(item => item.paper === paper && item.kind === kind)!;
  const puzzle = sheet.exports.find(item => item.paper === paper && item.kind === "Puzzle")!;
  const answer = sheet.exports.find(item => item.paper === paper && item.kind === "Solution")!;
  return <article data-localized-sheet={sheet.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-2xl font-bold">{sheet.title}</h3>
    <p className="mt-2 font-semibold">1–{sheet.count} · {sheet.count} {copy.points}{sheet.segments.length > 0 && <> · {sheet.segments.length} {copy.segments} ({sheet.segments.filter(s => s.closed).length} {copy.closed}, {sheet.segments.filter(s => !s.closed).length} {copy.open})</>}</p>
    <p className="mt-3 text-sm leading-6 text-slate-600">{copy.rule}</p>
    <div className="mt-5 grid grid-cols-2 gap-3">
      <label className="text-sm font-semibold">{copy.paper}<select value={paper} onChange={e => setPaper(e.target.value)} data-paper className="mt-1 block w-full rounded-lg border p-2"><option>A4</option><option value="Letter">{language === "es" ? "Carta (EE. UU.)" : language === "fr" ? "Lettre US" : "Letter USA"}</option></select></label>
      <label className="text-sm font-semibold">{copy.preview}<select value={kind} onChange={e => setKind(e.target.value)} data-preview className="mt-1 block w-full rounded-lg border p-2"><option value="Puzzle">{copy.puzzle}</option><option value="Solution">{copy.answer}</option></select></label>
    </div>
    <a href={active.preview} className="mt-4 block rounded-lg bg-slate-50 p-2">
      {/* Existing PDF page, rasterized after its translated instructions are final. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={active.preview} alt={`${sheet.title} · ${paper} · ${kind === "Puzzle" ? copy.puzzle : copy.answer}`} width={paper === "A4" ? 893 : 918} height={paper === "A4" ? 1263 : 1188} loading="lazy" className="h-[28rem] w-full object-contain" />
    </a>
    <div className="mt-5 flex flex-wrap gap-3">
      <a data-download="Puzzle" href={puzzle.pdf} hrefLang={language} download className="rounded-lg bg-brand-blue px-4 py-3 font-semibold text-white">{copy.download} {copy.puzzle} PDF</a>
      <a data-download="Solution" href={answer.pdf} hrefLang={language} download className="rounded-lg border border-brand-blue px-4 py-3 font-semibold text-brand-blue">{copy.download} {copy.answer} PDF</a>
    </div>
    {sheet.segments.length > 0 && <details className="mt-5"><summary className="cursor-pointer font-semibold">{copy.table}</summary><table className="mt-3 w-full text-left text-sm"><thead><tr><th>{copy.range}</th><th>{copy.part}</th><th>{copy.action}</th></tr></thead><tbody>{sheet.segments.map(segment => <tr key={segment.start} className="border-t"><td className="py-2">{segment.start}–{segment.end}</td><td>{frenchParts[segment.name]}</td><td>{segment.closed ? "C" : "O"}</td></tr>)}</tbody></table></details>}
  </article>;
}

export default function LocalizedWorksheetCards({ locale }: { locale: string }) {
  const language = localizedLocale(locale);
  if (!language) return null;
  const copy = localizedCopy[language];
  return <section lang={language} aria-labelledby="localized-worksheets" data-localized-collection className="mx-auto max-w-6xl px-6 py-10">
    <h2 id="localized-worksheets" className="text-3xl font-bold">{copy.collectionHeading}</h2>
    <p className="mt-4 max-w-4xl leading-7 text-slate-700">{copy.collectionIntro}</p>
    <div className="mt-7 grid items-start gap-6 lg:grid-cols-2">{worksheets.filter(sheet => sheet.locale === language).map(sheet => <WorksheetCard key={sheet.id} sheet={sheet} language={language} />)}</div>
    <p className="mt-6 leading-7 text-slate-700">{copy.print}</p>
    <p className="mt-3 text-sm text-slate-600">{copy.license} <a href={`/${language}/terms/`} className="underline">{copy.terms}</a></p>
    <p className="mt-3 text-sm text-slate-600">{copy.limitation}</p>
  </section>;
}
