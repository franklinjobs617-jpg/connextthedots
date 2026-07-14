"use client";

import Link from "next/link";
import { ChevronRight, Brain, Clock, ShieldCheck, ExternalLink } from "lucide-react";
import PrintableCard from "@/components/PrintableCard";
import { useAuth } from "@/lib/auth-context";
import DotGeneratorClient from "@/components/DotGeneratorClient";
import type { PrintableItem } from "@/lib/printables-data";

type Props = {
    locale: string;
    featuredItems: PrintableItem[];
};

const DIFFICULTY_TABLE = [
    { level: "Easy", dots: "10 – 25", time: "3 – 5 min", bestFor: "Toddlers & preschool (ages 3–6)" },
    { level: "Medium", dots: "25 – 60", time: "5 – 12 min", bestFor: "Kids ages 6–10" },
    { level: "Hard", dots: "60 – 100", time: "12 – 20 min", bestFor: "Teens & casual adult puzzlers" },
    { level: "Extreme", dots: "100 – 300+", time: "20 – 45+ min", bestFor: "Adults who want a longer, detailed challenge" },
];

const WHY_ITEMS = [
    {
        icon: <Brain size={20} className="text-brand-blue" aria-hidden="true" />,
        title: "A focused, screen-free break",
        body: "Working through a numbered sequence occupies the mind in a single, repetitive task — the same mechanism researchers link to reduced anxiety in adult coloring and mandala-focused activities.",
    },
    {
        icon: <Clock size={20} className="text-brand-blue" aria-hidden="true" />,
        title: "Built for longer sessions",
        body: "Extreme puzzles with 150–300+ dots take 20–45 minutes to complete — enough time to fully disengage from a screen without an open-ended time commitment.",
    },
    {
        icon: <ShieldCheck size={20} className="text-brand-blue" aria-hidden="true" />,
        title: "No app, no account required",
        body: "Download a PDF and print it, or build a custom one from your own photo. Nothing to install, nothing to sign up for unless you want to save your credits.",
    },
];

const FAQ_ITEMS = [
    {
        q: "What is a connect the dots puzzle for adults?",
        a: "A connect the dots puzzle for adults uses the same numbered-dot format as children's worksheets, but at much higher detail — typically 100 to 300+ dots instead of 10–50. The extra density creates finer, more realistic outlines (portraits, architecture, detailed animals) and takes considerably longer to complete, which is part of the appeal for adult users.",
    },
    {
        q: "Are these connect the dots printables really free?",
        a: "Yes. Every puzzle featured on this page is free to download as a PDF, with no watermark and no account required. The custom generator further down this page also includes free credits — no payment is needed to try it.",
    },
    {
        q: "How many dots do adult puzzles typically have?",
        a: "Hard puzzles on this site range from 60–100 dots, and Extreme puzzles range from 100–300+ dots. For comparison, a typical children's worksheet has 10–25 dots. Higher dot counts mean finer detail and a longer, more absorbing completion time.",
    },
    {
        q: "Can I create a custom extreme dot-to-dot puzzle from my own photo?",
        a: "Yes — use the generator at the top of this page. Upload any photo with clear, well-defined edges (a pet, a building, a portrait) and set a higher dot count for a more detailed, challenging result. The tool works best with images that have a clear subject and good contrast.",
    },
    {
        q: "Are dot to dot puzzles good for stress relief?",
        a: "Focused, repetitive visual tasks like connect-the-dots share the same mechanism researchers associate with anxiety reduction in adult coloring: sustained attention on a single simple action tends to quiet distracting thoughts. Cleveland Clinic has written about why structured creative activities like this can help adults unwind — see the reference link below.",
    },
    {
        q: "What paper size should I print an adult puzzle on?",
        a: "All PDFs on this site are formatted for both A4 and US Letter paper. Select 'Fit to page' in your print dialog. For puzzles with 200+ dots, printing at full page size (rather than a shrunk preview) makes the numbers easier to read.",
    },
];

const RELATED_LINKS = [
    { href: "/printable-connect-the-dots/", title: "All Connect the Dots Printables", desc: "Browse the full library by difficulty, theme, and age." },
    { href: "/dot-to-dot-printable/", title: "Dot to Dot Printable Guide", desc: "What dot to dot puzzles are and how to use them." },
    { href: "/how-to-make/", title: "How to Make a Custom Dot to Dot", desc: "Step-by-step guide to the photo generator." },
    { href: "/connect-the-dots-1-to-10/", title: "Connect the Dots 1 to 10", desc: "Simple sheets for beginners, if you're starting a child on easier puzzles." },
];

const LAST_UPDATED = "July 14, 2026";

function buildJsonLd(items: PrintableItem[]) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://connectthedotsprintable.online/connect-the-dots-for-adults/",
                name: "Connect the Dots for Adults — Free & Custom Extreme Puzzles",
                url: "https://connectthedotsprintable.online/connect-the-dots-for-adults/",
                description:
                    "Free connect the dots for adults, 100-300+ dots. Download extreme printable PDFs or turn any photo into your own custom puzzle in seconds.",
                inLanguage: "en",
                dateModified: "2026-07-14",
            },
            {
                "@type": "SoftwareApplication",
                name: "Connect the Dots Generator",
                applicationCategory: "DesignApplication",
                operatingSystem: "Any (Web-based)",
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
                description:
                    "Upload any photo and generate a custom numbered dot-to-dot puzzle with adjustable difficulty, downloadable as PDF.",
            },
            {
                "@type": "FAQPage",
                mainEntity: FAQ_ITEMS.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            },
            items.length > 0 && {
                "@type": "ItemList",
                numberOfItems: items.length,
                itemListElement: items.map((item, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `https://connectthedotsprintable.online${item.detailPage}`,
                    name: item.title,
                })),
            },
        ].filter(Boolean),
    };
}

export default function ConnectDotsAdultsClient({ locale, featuredItems }: Props) {
    const { user, login, isLoggingIn } = useAuth();
    const credits = user ? parseInt(user.credits || "0", 10) : 0;
    const jsonLd = buildJsonLd(featuredItems);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="flex-grow w-full bg-slate-50">

                {/* ── Hero with tool in first viewport ── */}
                <section className="relative bg-slate-900 pt-10 pb-14 overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight size={12} className="opacity-50" aria-hidden="true" />
                            <span className="text-brand-blue">Connect the Dots for Adults</span>
                        </nav>

                        <div className="grid lg:grid-cols-2 gap-10 items-start">
                            {/* Left: direct-answer copy */}
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                                    Connect the Dots for Adults
                                </h1>
                                <p className="text-base sm:text-lg text-slate-300 leading-7 mb-4 max-w-xl">
                                    Connect the dots for adults means puzzles with 100 to 300+ numbered dots instead of the 10–25 used in children&apos;s sheets — finer detail, longer completion time, and a genuinely challenging result. Download a free PDF below, or upload your own photo and generate a custom extreme puzzle in seconds.
                                </p>
                                <p className="text-xs text-slate-500 mb-6">Last updated {LAST_UPDATED}</p>
                                <div className="flex flex-wrap gap-3 mb-2">
                                    <button
                                        onClick={() => document.getElementById("featured-puzzles")?.scrollIntoView({ behavior: "smooth" })}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-sm"
                                    >
                                        See Featured Extreme Puzzles ↓
                                    </button>
                                </div>
                            </div>

                            {/* Right: the actual tool, visible without scrolling */}
                            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-bold text-slate-700">Create your own extreme puzzle</p>
                                    {!user ? (
                                        <button
                                            onClick={() => login()}
                                            disabled={isLoggingIn}
                                            className="text-xs font-semibold text-brand-blue hover:underline"
                                        >
                                            {isLoggingIn ? "Signing in…" : "Sign in for free credits"}
                                        </button>
                                    ) : (
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${credits > 0 ? "text-slate-600 border-slate-200 bg-slate-50" : "text-red-500 border-red-200 bg-red-50"}`}>
                                            {credits > 0 ? `${credits} credits left` : "No credits left"}
                                        </span>
                                    )}
                                </div>
                                <DotGeneratorClient locale={locale} user={user} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Featured extreme puzzles (2 curated, not a padded grid) ── */}
                <section id="featured-puzzles" className="py-12 bg-white border-b border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                            Featured Extreme &amp; Hard Puzzles
                        </h2>
                        <p className="text-slate-500 text-sm mb-8 max-w-xl">
                            Hand-picked high-detail puzzles for adults. More are added regularly — for now, here are our top picks by difficulty.
                        </p>
                        {featuredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                                {featuredItems.map((item) => (
                                    <PrintableCard key={item.id} item={item} priority />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">
                                New extreme puzzles are on the way — in the meantime, use the generator above to create your own.
                            </p>
                        )}
                        <div className="mt-6">
                            <Link
                                href="/printable-connect-the-dots/"
                                className="text-sm font-semibold text-brand-blue hover:underline"
                            >
                                Browse the full printable library →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Difficulty comparison table ── */}
                <section className="py-12 bg-slate-50 border-b border-slate-100">
                    <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                            Difficulty at a Glance
                        </h2>
                        <p className="text-slate-500 text-sm mb-6 max-w-xl">
                            Adults typically start at Hard and move to Extreme once they&apos;re comfortable with 100+ dot puzzles.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600">
                                        <th className="px-4 py-3 font-semibold">Difficulty</th>
                                        <th className="px-4 py-3 font-semibold">Dot Count</th>
                                        <th className="px-4 py-3 font-semibold">Est. Time</th>
                                        <th className="px-4 py-3 font-semibold">Best For</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DIFFICULTY_TABLE.map((row) => (
                                        <tr key={row.level} className="border-t border-slate-100">
                                            <td className={`px-4 py-3 font-bold ${row.level === "Hard" || row.level === "Extreme" ? "text-brand-blue" : "text-slate-700"}`}>
                                                {row.level}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{row.dots}</td>
                                            <td className="px-4 py-3 text-slate-600">{row.time}</td>
                                            <td className="px-4 py-3 text-slate-600">{row.bestFor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── Why adults enjoy this ── */}
                <section className="py-12 bg-slate-50 border-b border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
                            Why adults enjoy dot to dot puzzles
                        </h2>
                        <div className="grid sm:grid-cols-3 gap-6 mb-8">
                            {WHY_ITEMS.map((item) => (
                                <div key={item.title} className="bg-white rounded-2xl border border-slate-100 p-5">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                                        {item.icon}
                                    </div>
                                    <p className="font-semibold text-slate-800 text-sm mb-1">{item.title}</p>
                                    <p className="text-slate-500 text-sm leading-6">{item.body}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                            Source:{" "}
                            <a
                                href="https://health.clevelandclinic.org/3-reasons-adult-coloring-can-actually-relax-brain"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-blue hover:underline inline-flex items-center gap-1"
                            >
                                Cleveland Clinic — why adult coloring can relax your brain
                                <ExternalLink size={11} aria-hidden="true" />
                            </a>
                        </p>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="py-12 md:py-16 bg-white border-b border-slate-100">
                    <div className="container max-w-3xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
                            Frequently asked questions
                        </h2>
                        <div className="space-y-5">
                            {FAQ_ITEMS.map((item) => (
                                <article
                                    key={item.q}
                                    className="bg-slate-50 rounded-2xl border border-slate-100 p-6"
                                >
                                    <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                                    <p className="text-sm leading-7 text-slate-600">{item.a}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Related links ── */}
                <section className="py-10 bg-slate-50">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-700 mb-5">Related collections</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {RELATED_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group block bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl p-4 transition-all"
                                >
                                    <p className="font-semibold text-brand-blue group-hover:underline text-sm">
                                        {link.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{link.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}
