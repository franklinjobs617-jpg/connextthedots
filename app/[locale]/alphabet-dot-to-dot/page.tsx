import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/metadata";
import AlphabetCollection from "./AlphabetCollection";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    if ((await params).locale !== "en") notFound();
    return {
        title: "Alphabet Dot-to-Dot A–Z PDFs | Uppercase & Lowercase Collection",
        description: "Connect 26 English alphabet dots to reveal a fish, rocket or house. Free uppercase A–Z and lowercase a–z puzzle and answer PDFs for A4 and US Letter.",
        alternates: { canonical: `${siteConfig.baseUrl}/alphabet-dot-to-dot/`, languages: {} },
        robots: { index: true, follow: true },
    };
}
export default async function Page({ params }: Props) {
    if ((await params).locale !== "en") notFound();
    return <main className="bg-slate-50 text-slate-900"><div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-brand-blue"><Link href="/printable-connect-the-dots/">All printable collections</Link> / Alphabet</nav>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide">English alphabet · 26 dots per sheet</p>
        <h1 className="mt-3 text-4xl font-extrabold">Alphabet Dot-to-Dot Collection</h1>
        <p className="mt-5 max-w-3xl text-lg">Follow the English alphabet to reveal a fish, rocket or house. Choose uppercase A–Z or lowercase a–z, preview the worksheet, then download its puzzle and matching answer. Six practice versions, each in A4 and US Letter.</p>
        <p className="mt-4 rounded-lg border bg-white p-4"><strong>Start at A (or a).</strong> Connect all 26 dots in English alphabet order through Z (or z), then join Z back to A (or z back to a) to close the picture. Solid details are already drawn.</p>
        <AlphabetCollection />
        <section className="mt-8 rounded-xl border bg-white p-6" aria-labelledby="printing"><h2 id="printing" className="text-2xl font-bold">Print and solve</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5"><li>Select the letter case and paper above. The preview and both download buttons change together.</li><li>Download the Puzzle PDF and select its exact paper size: A4 (210 × 297 mm) or US Letter (8.5 × 11 in).</li><li>Print one page at Actual size / 100%, portrait. The footer check line should measure 50 mm. Fit-to-page changes the label size.</li><li>Start at A or a, follow the alphabet through Z or z, and return to the first dot. Compare your drawing with the separate Answer PDF.</li></ol>
            <p className="mt-4">Labels use 14 pt Times-Roman at 100%, including a serif lowercase l. These sheets practice English alphabet order. Age suitability, learning outcomes and completion time have not been measured. Physical printing and independent complete human solving are NOT TESTED.</p>
        </section>
        <section className="mt-8"><h2 className="text-xl font-bold">Original artwork and use</h2><p className="mt-3">© 2026 ConnectTheDotsPrintable.online. Free to download and print for personal and educational use. Commercial use requires prior written permission. See <Link className="underline" href="/terms/">Terms of Service</Link>. All six versions use original 26-point designs.</p>
            <p className="mt-3 flex gap-5 text-brand-blue underline"><a href="/alphabet-dot-to-dot/v1/SOURCE.md">Source and specifications</a><a href="/alphabet-dot-to-dot/v1/geometry.json" download>Source geometry</a></p>
            <Link href="/printable-connect-the-dots/" className="mt-6 inline-block text-brand-blue underline">Back to all printable collections</Link>
        </section>
    </div></main>;
}
