import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { originalSheets, sheetAsset, type OriginalSheet } from "@/lib/original-sheets";
import { siteConfig } from "@/lib/metadata";

export type OriginalSheetProps = { params: Promise<{ locale: string }> };

export async function originalSheetMetadata(item: OriginalSheet, props: OriginalSheetProps): Promise<Metadata> {
    if ((await props.params).locale !== "en") notFound();
    const title = `${item.title} ${item.count}-Dot Printable | Free Puzzle & Answer PDFs`;
    const canonical = `${siteConfig.baseUrl}/printables/${item.id}/`;
    return {
        title, description: item.description,
        alternates: { canonical, languages: {} },
        robots: { index: true, follow: true },
        openGraph: { title, description: item.description, url: canonical, type: "article", images: [{ url: `${siteConfig.baseUrl}${sheetAsset(item, "A4", "Puzzle", "png")}`, alt: `${item.title} ${item.count}-dot A4 puzzle` }] },
        twitter: { card: "summary_large_image", title, description: item.description, images: [`${siteConfig.baseUrl}${sheetAsset(item, "A4", "Puzzle", "png")}`] },
    };
}

export async function OriginalSheetPage({ item, params }: OriginalSheetProps & { item: OriginalSheet }) {
    if ((await params).locale !== "en") notFound();
    const source = `/printables/${item.id}/v1`;
    return <main className="bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-blue">
                <Link href="/">Home</Link> / <Link href="/printable-connect-the-dots/">Printables</Link> / {item.title}
            </nav>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-purple">Original numbered worksheet · English</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">{item.title} — {item.count}-Dot Printable</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed">{item.description}</p>
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
                <section aria-labelledby="puzzle-preview" className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                    <h2 id="puzzle-preview" className="text-xl font-bold">Puzzle preview</h2>
                    <a href={sheetAsset(item, "A4", "Puzzle", "png")} aria-label={`Open full-size ${item.title} puzzle preview`}>
                        <Image src={sheetAsset(item, "A4", "Puzzle", "png")} alt={`Actual A4 puzzle PDF preview: ${item.title}, numbers 1–${item.count}, with pre-drawn details`} width={893} height={1263} unoptimized priority className="mt-4 h-auto w-full" />
                    </a>
                    <p className="mt-3 text-sm text-slate-600">Rasterized from the A4 Puzzle PDF. Open the image to inspect labels; use a PDF below for printing.</p>
                    <details className="mt-5 border-t border-slate-200 pt-4">
                        <summary className="cursor-pointer font-semibold">Show matching answer preview</summary>
                        <Image src={sheetAsset(item, "A4", "Solution", "png")} alt={`${item.title} answer joining the same ${item.count} points in order and back to 1`} width={893} height={1263} unoptimized className="mt-4 h-auto w-full" />
                    </details>
                </section>
                <div className="space-y-6">
                    <section aria-labelledby="downloads" className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 id="downloads" className="text-2xl font-bold">Free PDF downloads</h2>
                        <p className="mt-3 leading-relaxed">Four separate one-page files. No account or payment required. Each answer uses the exact point sequence of its puzzle.</p>
                        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <dt>Numbered dots</dt><dd className="font-semibold">{item.count} · 1–{item.count}, each once</dd>
                            <dt>Label font size</dt><dd>9 pt at 100% print scale</dd>
                            <dt>Connection</dt><dd>One closed path; {item.count} back to 1</dd>
                            <dt>Difficulty / age</dt><dd>Not rated</dd>
                        </dl>
                        {(["A4", "Letter"] as const).map((paper) => <div key={paper} className="mt-6 border-t border-slate-200 pt-4">
                            <h3 className="font-bold">{paper === "A4" ? "A4 · 210 × 297 mm" : "US Letter · 8.5 × 11 in"}</h3>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {(["Puzzle", "Solution"] as const).map((kind) => <a key={kind} href={sheetAsset(item, paper, kind)} download className={`rounded-lg px-4 py-3 text-center font-semibold text-white ${kind === "Puzzle" ? "bg-brand-blue" : "bg-brand-purple"}`}>Download {paper === "Letter" ? "Letter" : "A4"} {kind} PDF</a>)}
                            </div>
                        </div>)}
                    </section>
                    <section aria-labelledby="how-to" className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 id="how-to" className="text-xl font-bold">How to print and solve</h2>
                        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed">
                            <li>Choose the Puzzle PDF for your paper. Select the matching paper size and Actual size / 100% in your print dialog.</li>
                            <li>Measure the footer check line: it should be 50 mm. Fit-to-page can change the printed number size.</li>
                            <li>Connect 1 through {item.count} in order, then join {item.count} back to 1. Solid details are already drawn.</li>
                            <li>{item.solveTip}</li>
                        </ol>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">Physical A4 and Letter printing and independent human full-solve are NOT TESTED. Printer margins vary. This is not a verified large-print resource; age suitability and solve time are unmeasured.</p>
                    </section>
                </div>
            </div>
            <section aria-labelledby="about-sheet" className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <h2 id="about-sheet" className="text-2xl font-bold">Inside this {item.title.toLowerCase()} worksheet</h2>
                <p className="mt-4 max-w-4xl leading-relaxed">{item.reveal}</p>
                <p className="mt-3 max-w-4xl leading-relaxed">{item.learningNote}</p>
                <h3 className="mt-6 font-bold">Original source and reuse</h3>
                <p className="mt-3 leading-relaxed">© 2026 ConnectTheDotsPrintable.online. Free to download and print for personal and educational use. Commercial use requires prior written permission. See <Link href="/terms/" className="text-brand-blue underline">Terms of Service</Link>. The same geometry produces both paper formats and the matching answers.</p>
                <div className="mt-3 flex flex-wrap gap-5 text-sm text-brand-blue underline">
                    <a href={`${source}/SOURCE.md`}>Source and limitations</a><a href={`${source}/geometry.json`} download>Download numbered source geometry</a>
                </div>
            </section>
            <section aria-labelledby="other-sheets" className="mt-8">
                <h2 id="other-sheets" className="text-xl font-bold">Other original worksheets</h2>
                <div className="mt-4 flex flex-wrap gap-4 text-brand-blue underline">{originalSheets.filter((other) => other.id !== item.id).map((other) => <Link key={other.id} href={`/printables/${other.id}/`}>{other.title} · {other.count} dots</Link>)}</div>
            </section>
        </div>
    </main>;
}
