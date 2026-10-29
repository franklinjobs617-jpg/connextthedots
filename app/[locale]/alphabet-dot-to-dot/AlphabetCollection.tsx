"use client";
import { useState } from "react";
import Image from "next/image";
import { alphabetAsset, alphabetDesigns, type LetterCase, type Paper } from "@/lib/alphabet-sheets";

export default function AlphabetCollection() {
    const [letterCase, setLetterCase] = useState<LetterCase>("uppercase");
    const [paper, setPaper] = useState<Paper>("A4");
    return <section aria-label="Alphabet worksheets" className="mt-8">
        <div className="sticky top-0 z-10 flex flex-wrap gap-5 rounded-xl border bg-white p-4 shadow-sm">
            <label className="font-semibold">Letters <select aria-label="Letter case" value={letterCase} onChange={e => setLetterCase(e.target.value as LetterCase)} className="ml-2 rounded border p-2">
                <option value="uppercase">Uppercase A–Z</option><option value="lowercase">Lowercase a–z</option>
            </select></label>
            <label className="font-semibold">Paper <select aria-label="Paper size" value={paper} onChange={e => setPaper(e.target.value as Paper)} className="ml-2 rounded border p-2">
                <option value="A4">A4 · 210 × 297 mm</option><option value="Letter">US Letter · 8.5 × 11 in</option>
            </select></label>
            <p role="status" className="w-full text-sm">Showing {letterCase} · {paper} puzzles and matching answers.</p>
        </div>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">{alphabetDesigns.map(item => <article key={item.id} data-design={item.id} className="rounded-2xl border bg-white p-5">
            <h2 className="text-2xl font-bold">{item.title}</h2><p className="mt-2">{item.description}</p>
            <a href={alphabetAsset(item.id, letterCase, paper, "Puzzle", "png")} aria-label={`Open ${item.title} ${letterCase} ${paper} puzzle preview`}>
                <Image data-preview="Puzzle" src={alphabetAsset(item.id, letterCase, paper, "Puzzle", "png")} alt={`${item.title} ${letterCase} ${paper} puzzle, rendered from its PDF`} width={893} height={paper === "A4" ? 1263 : 1157} unoptimized className="mt-4 h-auto w-full" />
            </a>
            <p className="text-sm text-slate-600">Preview rendered from the selected final PDF.</p>
            <div className="mt-4 grid gap-3">{(["Puzzle", "Answer"] as const).map(kind => <a key={kind} data-download={kind} href={alphabetAsset(item.id, letterCase, paper, kind)} download className="rounded-lg bg-brand-blue px-4 py-3 text-center font-semibold text-white">Download {item.title} {letterCase} {paper} {kind} PDF</a>)}</div>
            <details className="mt-4"><summary className="cursor-pointer font-semibold">Show matching answer preview</summary>
                <Image data-preview="Answer" src={alphabetAsset(item.id, letterCase, paper, "Answer", "png")} alt={`${item.title} ${letterCase} ${paper} answer, same 26 points with the closed path drawn`} width={893} height={paper === "A4" ? 1263 : 1157} unoptimized className="mt-3 h-auto w-full" />
            </details>
        </article>)}</div>
    </section>;
}
