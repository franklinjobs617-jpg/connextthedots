import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mountain120 as item } from "@/lib/mountain-120";
import { siteConfig } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
const canonical = `${siteConfig.baseUrl}${item.detailPage}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    if ((await params).locale !== "en") notFound();
    return {
        title: "Mountain Landscape 120-Point Dot to Dot | Puzzle & Solution PDF",
        description: item.description,
        alternates: { canonical },
        robots: { index: true, follow: true },
        openGraph: {
            title: item.title, description: item.description, url: canonical, type: "article",
            images: [{ url: `${siteConfig.baseUrl}${item.imageUrl}`, width: 1191, height: 1684, alt: item.altText }],
        },
        twitter: { card: "summary_large_image", title: item.title, description: item.description, images: [`${siteConfig.baseUrl}${item.imageUrl}`] },
    };
}

export default async function Page({ params }: Props) {
    if ((await params).locale !== "en") notFound();
    return <main className="bg-slate-50 text-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-blue">
                <Link href="/">Home</Link> / <Link href="/printable-connect-the-dots/">All Printables</Link> / Mountain Landscape 120
            </nav>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{item.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed">{item.description}</p>
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
                <section aria-labelledby="puzzle-preview" className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                    <h2 id="puzzle-preview" className="mb-4 text-xl font-bold">Puzzle preview</h2>
                    <a href={item.imageUrl} target="_blank" rel="noreferrer" aria-label="Open full-size puzzle preview">
                        <Image src={item.imageUrl} alt={item.altText} width={1191} height={1684} unoptimized priority className="h-auto w-full" />
                    </a>
                    <p className="mt-3 text-sm text-slate-600">Tap the preview to inspect the full page.</p>
                </section>
                <div className="space-y-6">
                    <section aria-labelledby="downloads" className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 id="downloads" className="text-2xl font-bold">Print the puzzle</h2>
                        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                            <dt>Numbered dots</dt><dd className="font-bold">120 (1–120)</dd>
                            <dt>Paper size</dt><dd>A4 · 210 × 297 mm</dd>
                            <dt>Number size</dt><dd>9.2 pt</dd>
                            <dt>Suggested audience</dt><dd>Adults</dd>
                            <dt>Difficulty</dt><dd>Not yet rated</dd>
                        </dl>
                        <a href={item.puzzlePdf} download className="mt-6 block rounded-lg bg-brand-blue px-5 py-3 text-center font-bold text-white hover:opacity-90">Download Puzzle PDF</a>
                        <a href={item.solutionPdf} download className="mt-3 block rounded-lg bg-brand-purple px-5 py-3 text-center font-bold text-white hover:opacity-90">Download Solution PDF</a>
                        <p className="mt-4 text-sm text-slate-600">Free downloads, no account needed. Each PDF is one A4 page with the same website credit.</p>
                    </section>
                    <section aria-labelledby="instructions" className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 id="instructions" className="text-xl font-bold">How to use this worksheet</h2>
                        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed">
                            <li>Print the Puzzle PDF on A4 at Actual size / 100%. Check the 50 mm footer line with a ruler.</li>
                            <li>Connect 1 to 120 in order, then join 120 back to 1 to complete the outline.</li>
                            <li>Compare your drawing with the matching Solution PDF, which follows the same complete point sequence.</li>
                        </ol>
                        <p className="mt-4 text-sm text-slate-600">Physical print testing and independent playtesting are pending. Completion time and difficulty have not been measured.</p>
                    </section>
                    <details className="rounded-2xl border border-slate-200 bg-white p-6">
                        <summary className="cursor-pointer text-lg font-bold">Show solution preview</summary>
                        <Image src={item.solutionUrl} alt={item.solutionAltText} width={1191} height={1684} unoptimized className="mt-4 h-auto w-full" />
                    </details>
                </div>
            </div>
            <section aria-labelledby="more-printables" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 id="more-printables" className="text-xl font-bold">Explore more dot-to-dot activities</h2>
                <p className="mt-3 leading-relaxed">This original mountain-and-fir outline is a separate 120-point worksheet. Browse the collection for other themes or explore activities for adults.</p>
                <div className="mt-4 flex flex-wrap gap-5 font-semibold text-brand-blue">
                    <Link href="/printable-connect-the-dots/" className="underline">Browse all printables</Link>
                    <Link href="/connect-the-dots-for-adults/" className="underline">Connect the dots for adults</Link>
                </div>
            </section>
        </div>
    </main>;
}
