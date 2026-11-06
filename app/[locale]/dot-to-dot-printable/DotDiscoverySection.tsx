import { segmentedSheet } from "@/lib/segmented-sheets";
import { sheetAsset } from "@/lib/original-sheets";
import { printableCollections } from "@/lib/printable-collections";

const featured = [segmentedSheet("tufted-owl-study-207"), segmentedSheet("hilltop-observatory-202")];
const collectionLabels = { hundred: "100 dots", alphabet: "Alphabet A–Z", skip: "Skip counting" };

/** Page-local server presentation; the client receives rendered nodes, not geometry. */
export default function DotDiscoverySection() {
    return <section data-dot-discovery lang="en" aria-labelledby="dot-featured-originals" className="my-5 rounded-2xl border border-slate-200 bg-white/60 p-3 sm:p-5">
        <h3 id="dot-featured-originals" className="text-lg font-bold text-slate-900">Featured originals</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">A4 and US Letter puzzles with matching answers, on these two English detail pages.</p>
        <nav aria-label="More printable collections" className="my-3 flex flex-wrap gap-2">
            {printableCollections.flatMap(collection => {
                if (!(collection.id in collectionLabels)) return [];
                const label = collectionLabels[collection.id as keyof typeof collectionLabels];
                return [<a key={collection.id} href={collection.path} hrefLang="en" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-brand-blue underline decoration-slate-300 underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">{label}</a>];
            })}
        </nav>
        <div className="grid gap-3 sm:grid-cols-2">
            {featured.map(sheet => <a key={sheet.id} href={`/printables/${sheet.id}/`} hrefLang="en" data-dot-featured={sheet.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 focus-visible:outline-2 focus-visible:outline-offset-2 hover:border-brand-blue">
                {/* Existing v2 preview from the final PDF; preserve its full page and ratio. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sheetAsset(sheet, "A4", "Puzzle", "png")} alt={`${sheet.title}: actual A4 puzzle PDF preview`} width={893} height={1263} loading="lazy" decoding="async" className="h-auto w-20 shrink-0 object-contain lg:w-28" />
                <div className="min-w-0">
                    <h4 className="text-base font-bold leading-5 text-slate-900 lg:text-lg lg:leading-6">{sheet.title}</h4>
                    <p className="mt-2 text-xs font-semibold text-slate-600 lg:text-sm">{sheet.count} dots · {sheet.task?.segments.length} segments</p>
                    <span className="mt-3 inline-block text-sm font-semibold text-brand-blue underline">Preview &amp; PDFs →</span>
                </div>
            </a>)}
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-600">Close only C ranges; lift your pen between ranges. Physical printing and independent full solves not tested; difficulty and time unrated. Filters below apply to the catalog.</p>
    </section>;
}
