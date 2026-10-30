import { originalSheets, sheetAsset } from "@/lib/original-sheets";
import { collectionCopy } from "@/lib/printable-collections";

/** Existing published files; no generated images, point counts or PDFs. */
export default function OriginalWorksheetCards({ locale }: { locale: string }) {
  const copy = collectionCopy(locale);
  return <section aria-labelledby="original-pdfs" className="mx-auto max-w-6xl px-6 py-10">
    <h2 id="original-pdfs" className="text-2xl font-bold text-slate-900">{copy.worksheets} <span className="text-base font-normal">({copy.english})</span></h2>
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {originalSheets.map(sheet => <article key={sheet.id} data-worksheet={sheet.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <a href={`/printables/${sheet.id}/`} hrefLang="en" className="block bg-slate-100 p-3 focus-visible:outline-2">
          {/* These PNGs are the existing final-PDF previews, shown without cropping. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sheetAsset(sheet, "A4", "Puzzle", "png")} alt={`${sheet.title} · 1–${sheet.count} · A4 · ${copy.puzzle}`} loading="lazy" width={794} height={1123} className="h-56 w-full object-contain" />
        </a>
        <div className="p-5">
          <h3 className="text-xl font-bold" lang="en">{sheet.title}</h3>
          <p className="mt-2 font-semibold text-slate-600">1–{sheet.count} · {sheet.count} {copy.dots}</p>
          <a href={`/printables/${sheet.id}/`} hrefLang="en" className="mt-3 inline-block text-brand-blue underline">{copy.preview} ({copy.english})</a>
          <ul className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            {(["A4", "Letter"] as const).map(paper => <li key={paper} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="w-14 font-bold">{paper === "Letter" ? "US Letter" : paper}</span>
              <a href={sheetAsset(sheet, paper, "Puzzle")} download className="rounded-md bg-indigo-50 px-3 py-2 text-brand-blue underline">{copy.puzzle} PDF</a>
              <a href={sheetAsset(sheet, paper, "Solution")} download className="rounded-md bg-slate-100 px-3 py-2 text-slate-700 underline">{copy.answer} PDF</a>
            </li>)}
          </ul>
        </div>
      </article>)}
    </div>
  </section>;
}
