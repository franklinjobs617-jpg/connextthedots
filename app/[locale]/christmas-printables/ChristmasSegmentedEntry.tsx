import Image from "next/image";
import { findSegmentedSheet } from "@/lib/segmented-sheets";
import { sheetAsset } from "@/lib/original-sheets";

export function getChristmasSegmentedSheet() {
    return findSegmentedSheet("christmas-candle-window");
}

export default function ChristmasSegmentedEntry() {
    const sheet = getChristmasSegmentedSheet();
    if (!sheet || sheet.task?.type !== "segmented") return null;
    const task = sheet.task;
    return <article id={sheet.id} data-christmas-segmented={sheet.id} lang="en" className="grid min-w-0 scroll-mt-5 gap-6 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-6">
        <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-purple">Segmented worksheet · English</p>
            <h2 className="mt-2 text-2xl font-bold">{sheet.title}</h2>
            <a href={`/printables/${sheet.id}/`} hrefLang="en" className="mt-4 block rounded-xl bg-slate-50 p-3 focus-visible:outline-2">
                <Image src={sheetAsset(sheet, "A4", "Puzzle", "png")} alt={`${sheet.title}: actual A4 puzzle PDF preview`} width={893} height={1263} unoptimized className="h-72 w-full object-contain sm:h-80" />
            </a>
            <details className="mt-4 rounded-xl border border-slate-200 p-4">
                <summary className="min-h-11 cursor-pointer font-semibold">Show matching A4 answer preview</summary>
                <Image src={sheetAsset(sheet, "A4", "Solution", "png")} alt={`${sheet.title}: matching A4 solution PDF preview`} width={893} height={1263} unoptimized className="mt-3 h-auto w-full" />
            </details>
        </div>
        <div className="min-w-0 space-y-4">
            <p className="font-semibold">{sheet.count} numbered dots · {task.segments.length} separate segments</p>
            <p className="leading-7">{sheet.description}</p>
            <p className="text-sm leading-6">Follow consecutive numbers within each range. C closes back to that range’s first point; O stops at its last point. Lift your pen between every range. Never bridge ranges or close the whole worksheet back to 1.</p>
            <a href={`/printables/${sheet.id}/#segment-rules`} hrefLang="en" className="inline-flex min-h-11 items-center font-semibold text-brand-blue underline focus-visible:outline-2">Preview, range rules &amp; details →</a>
            {(["A4", "Letter"] as const).map(paper => <div key={paper} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold">{paper === "A4" ? "A4 · 210 × 297 mm" : "US Letter · 8.5 × 11 in"}</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(["Puzzle", "Solution"] as const).map(kind => <a key={kind} href={sheetAsset(sheet, paper, kind)} hrefLang="en" download className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-blue px-3 py-3 text-center text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2">Download {paper} {kind} PDF</a>)}
                </div>
            </div>)}
            <details className="rounded-xl border border-slate-200 p-4">
                <summary className="min-h-11 cursor-pointer font-semibold">Number ranges and pen lifts</summary>
                <ol className="mt-3 space-y-2 text-sm leading-6">{task.segments.map(segment => <li key={segment.start} className="break-words">{segment.start}–{segment.end} · {segment.closed ? "C — close this range" : "O — stop here"} · {segment.name}</li>)}</ol>
            </details>
            <p className="text-sm leading-6 text-slate-600">Print at Actual size / 100% on the matching paper; check the 50 mm line. Physical printing and independent full human solving are NOT TESTED. Difficulty, age suitability and solve time are unmeasured.</p>
        </div>
    </article>;
}
