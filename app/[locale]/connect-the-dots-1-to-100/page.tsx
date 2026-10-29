import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hundredDotCollection, hundredDotSheets } from "@/lib/hundred-dot-collection";
import { siteConfig } from "@/lib/metadata";
import HundredDotChoices from "./HundredDotChoices";

type Props = { params: Promise<{ locale: string }> };
const canonical = `${siteConfig.baseUrl}${hundredDotCollection.path}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    if ((await params).locale !== "en") notFound();
    return {
        title: hundredDotCollection.title,
        description: hundredDotCollection.description,
        alternates: { canonical, languages: {} },
        robots: { index: true, follow: true },
        openGraph: { title: hundredDotCollection.title, description: hundredDotCollection.description, url: canonical, type: "website", images: [{ url: `${siteConfig.baseUrl}/printables/elephant-100/v1/elephant-100-A4-Puzzle.png`, alt: "Elephant worksheet with numbers 1–100" }] },
        twitter: { card: "summary_large_image", title: hundredDotCollection.title, description: hundredDotCollection.description, images: [`${siteConfig.baseUrl}/printables/elephant-100/v1/elephant-100-A4-Puzzle.png`] },
    };
}

export default async function HundredDotCollectionPage({ params }: Props) {
    if ((await params).locale !== "en") notFound();
    const schema = {
        "@context": "https://schema.org", "@type": "CollectionPage", name: "100-Dot Printables: Puzzles and Answers", url: canonical, inLanguage: "en", description: hundredDotCollection.description,
        mainEntity: { "@type": "ItemList", numberOfItems: hundredDotSheets.length, itemListElement: hundredDotSheets.map((sheet, index) => ({ "@type": "ListItem", position: index + 1, name: `${sheet.title} — 100 dots`, url: `${siteConfig.baseUrl}/printables/${sheet.id}/` })) },
    };
    return <main className="bg-slate-50 text-slate-900">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
            <nav aria-label="Breadcrumb" className="text-sm text-brand-blue"><Link href="/">Home</Link> / <Link href="/printable-connect-the-dots/">Printables</Link> / 100 dots</nav>
            <p className="mt-7 text-sm font-semibold uppercase tracking-wider text-brand-purple">Three original worksheets · English</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">100-Dot Printables: Connect 1–100</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed">Choose an elephant, hot-air balloon or seahorse. Every puzzle has exactly 100 numbered dots, with each label from 1 to 100 appearing once, and a matching answer. Download free A4 or US Letter PDFs without an account.</p>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">Connect 1 through 100 in order, then join 100 back to 1. Some interior details are already drawn. Each preview comes from its corresponding PDF.</p>
            <HundredDotChoices />
            <section aria-labelledby="print-instructions" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <h2 id="print-instructions" className="text-2xl font-bold">Print your puzzle and keep the answer separate</h2>
                <ol className="mt-5 list-decimal space-y-3 pl-5 leading-relaxed">
                    <li>Select A4 or US Letter, then download the Puzzle PDF for your chosen design. Download its Answer PDF separately when you need it.</li>
                    <li>Choose the same paper size in your printer settings. Print at Actual size / 100%; fit-to-page can change the label size.</li>
                    <li>Check the 50 mm line in the PDF footer with a ruler. The labels are 9 pt at 100% scale. Printer margins vary.</li>
                    <li>Follow the numbers rather than the nearest dot, especially around the seahorse tail. Finish with 100 back to 1, then compare with the answer.</li>
                </ol>
                <p className="mt-5 text-sm text-slate-600">Physical printing and independent complete human solving are NOT TESTED for this collection. Age suitability, difficulty and completion time are not rated.</p>
            </section>
            <section aria-labelledby="browse-more" className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <h2 id="browse-more" className="text-2xl font-bold">Browse by a different task</h2>
                <p className="mt-4 leading-relaxed">This collection contains only exact 1–100 worksheets. For a wider choice of dot counts and subjects, browse the <Link href="/printable-connect-the-dots/" className="text-brand-blue underline">full printable collection</Link>. For the audience-focused selection, visit <Link href="/connect-the-dots-for-adults/" className="text-brand-blue underline">connect the dots for adults</Link>.</p>
                <p className="mt-5 text-sm leading-relaxed text-slate-600">© 2026 ConnectTheDotsPrintable.online. Free to download and print for personal and educational use. Commercial use requires prior written permission. See <Link href="/terms/" className="text-brand-blue underline">Terms of Service</Link>.</p>
            </section>
        </div>
    </main>;
}
