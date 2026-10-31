import Image from "next/image";
import { segmentedSheets } from "@/lib/segmented-sheets";
import { sheetAsset } from "@/lib/original-sheets";

/** Existing English worksheets and their final-PDF previews; no new assets. */
export default function AdultNumberedChallenges({ legacyAnchor = true }: { legacyAnchor?: boolean }) {
  return <section id="numbered-challenges" aria-labelledby="numbered-challenges-title" className="scroll-mt-24 border-b border-slate-100 bg-white py-12">
    {legacyAnchor && <span id="featured-puzzles" className="block scroll-mt-24" aria-hidden="true" />}
    <div className="container mx-auto max-w-6xl px-4 sm:px-6">
      <h2 id="numbered-challenges-title" className="text-2xl font-extrabold text-slate-900">Numbered worksheets: previews and downloads</h2>
      <p className="mt-3 max-w-3xl text-slate-600">Two original worksheets include numbered internal features as well as their main contours. Choose separate A4 or US Letter puzzle and matching answer PDFs. Lift your pen between ranges; close only ranges marked C and stop at the end of ranges marked O.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {segmentedSheets.map(sheet => <article key={sheet.id} data-adult-worksheet={sheet.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <a href={`/printables/${sheet.id}/`} hrefLang="en" className="block bg-slate-50 p-4 focus-visible:outline-2 focus-visible:outline-offset-2">
            <Image src={sheetAsset(sheet, "A4", "Puzzle", "png")} alt={`${sheet.title}: ${sheet.count} numbered dots in ${sheet.task?.type === "segmented" ? sheet.task.segments.length : 1} segments, A4 puzzle preview`} width={794} height={1123} unoptimized className="h-80 w-full object-contain sm:h-96" />
          </a>
          <div className="p-5 sm:p-6">
            <h3 className="text-xl font-bold text-slate-900"><a href={`/printables/${sheet.id}/`} className="text-brand-blue underline">{sheet.title} — {sheet.count} dots, {sheet.task?.type === "segmented" ? sheet.task.segments.length : 1} segments</a></h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{sheet.description}</p>
            <a href={`/printables/${sheet.id}/`} className="mt-3 inline-block text-sm font-semibold text-brand-blue underline">Preview, range rules &amp; details</a>
            <ul className="mt-4 space-y-3 border-t border-slate-100 pt-4" aria-label={`${sheet.title} PDF downloads`}>
              {(["A4", "Letter"] as const).map(paper => <li key={paper} className="flex flex-wrap items-center gap-3 text-sm">
                <span className="w-16 font-bold">{paper === "Letter" ? "US Letter" : "A4"}</span>
                <a href={sheetAsset(sheet, paper, "Puzzle")} download className="rounded-md bg-indigo-50 px-3 py-2 font-semibold text-brand-blue underline">Puzzle PDF</a>
                <a href={sheetAsset(sheet, paper, "Solution")} download className="rounded-md bg-slate-100 px-3 py-2 font-semibold text-slate-700 underline">Answer PDF</a>
              </li>)}
            </ul>
          </div>
        </article>)}
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-600">Print at Actual size / 100% on the matching paper size; numbers are 9 pt. Never join separate ranges. Difficulty, age suitability and solve time are unmeasured. Physical printing and independent human full-solve are NOT TESTED.</p>
    </div>
  </section>;
}
