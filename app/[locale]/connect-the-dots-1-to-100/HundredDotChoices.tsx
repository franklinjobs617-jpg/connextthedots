"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { hundredDotSheets } from "@/lib/hundred-dot-collection";
import { sheetAsset } from "@/lib/original-sheets";

const papers = ["A4", "Letter"] as const;

export default function HundredDotChoices() {
    const [paper, setPaper] = useState<(typeof papers)[number]>("A4");
    return <section aria-labelledby="choose-worksheet" className="mt-10">
        <h2 id="choose-worksheet" className="text-2xl font-bold">Choose your 100-dot worksheet</h2>
        <fieldset className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <legend className="px-2 font-semibold">Paper size</legend>
            <div className="flex flex-wrap gap-3">
                {papers.map((size) => <label key={size} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 ${paper === size ? "border-brand-blue bg-blue-50" : "border-slate-300"}`}>
                    <input type="radio" name="paper-size" value={size} checked={paper === size} onChange={() => setPaper(size)} className="accent-brand-blue" />
                    {size === "A4" ? "A4 · 210 × 297 mm" : "US Letter · 8.5 × 11 in"}
                </label>)}
            </div>
            <p className="mt-3 text-sm text-slate-600">This choice updates every preview and download below. Puzzle and answer are separate one-page PDFs.</p>
        </fieldset>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
            {hundredDotSheets.map((item, index) => <article key={item.id} aria-labelledby={`title-${item.id}`} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-brand-purple">Exactly 100 dots · labels 1–100</p>
                <h3 id={`title-${item.id}`} className="mt-2 text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{item.note}</p>
                <a href={sheetAsset(item, paper, "Puzzle", "png")} target="_blank" rel="noopener" aria-label={`Open full-size ${item.title} ${paper} puzzle preview`} className="mt-4 block rounded-lg focus-visible:outline-2 focus-visible:outline-brand-blue">
                    <Image src={sheetAsset(item, paper, "Puzzle", "png")} alt={`${item.title} ${paper} puzzle PDF preview, numbers 1–100`} width={paper === "A4" ? 893 : 918} height={paper === "A4" ? 1263 : 1188} unoptimized priority={index === 0} className="h-auto w-full" />
                </a>
                <p className="mt-2 text-sm text-slate-600">Open the preview at full size to inspect the labels.</p>
                <details className="mt-4 border-t border-slate-200 pt-4">
                    <summary className="cursor-pointer py-2 font-semibold">Show {item.title} answer preview</summary>
                    <a href={sheetAsset(item, paper, "Solution", "png")} target="_blank" rel="noopener" aria-label={`Open full-size ${item.title} ${paper} answer preview`}>
                        <Image src={sheetAsset(item, paper, "Solution", "png")} alt={`${item.title} ${paper} answer PDF preview, the same 100 points joined in order`} width={paper === "A4" ? 893 : 918} height={paper === "A4" ? 1263 : 1188} unoptimized className="mt-3 h-auto w-full" />
                    </a>
                </details>
                {papers.map((size) => <div key={size} hidden={paper !== size} className="mt-5 space-y-3" aria-label={`${item.title} ${size} downloads`}>
                    <a href={sheetAsset(item, size, "Puzzle")} download className="block rounded-lg bg-brand-blue px-4 py-3 text-center font-semibold text-white">Download {size} Puzzle PDF</a>
                    <a href={sheetAsset(item, size, "Solution")} download className="block rounded-lg bg-brand-purple px-4 py-3 text-center font-semibold text-white">Download {size} Answer PDF</a>
                </div>)}
                <Link href={`/printables/${item.id}/`} className="mt-5 inline-block py-2 text-brand-blue underline">{item.title} worksheet details</Link>
            </article>)}
        </div>
        <noscript><p className="mt-5">A4 downloads are shown above. For US Letter PDFs, open each worksheet’s details page; all four files are available there without a paper selector.</p></noscript>
    </section>;
}
