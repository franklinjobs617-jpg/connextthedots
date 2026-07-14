"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Download, Pencil, Sparkles, Zap } from "lucide-react";
import PrintableCard from "@/components/PrintableCard";
import { useAuth } from "@/lib/auth-context";
import DotGeneratorClient from "@/components/DotGeneratorClient";
import type { PrintableItem } from "@/lib/printables-data";

type Props = {
    locale: string;
    allItems: PrintableItem[];
};

// ─── Static content ────────────────────────────────────────────────────────────

const WHY_ITEMS = [
    {
        icon: <BookOpen size={22} className="text-brand-blue" aria-hidden="true" />,
        title: "Builds focus & patience",
        body: "Following a numbered sequence from start to finish requires sustained attention — a skill that transfers directly to reading and writing tasks.",
    },
    {
        icon: <Pencil size={22} className="text-brand-blue" aria-hidden="true" />,
        title: "Develops fine motor skills",
        body: "Accurately connecting small dots strengthens the pencil grip and hand-eye coordination children need for handwriting.",
    },
    {
        icon: <Zap size={22} className="text-brand-blue" aria-hidden="true" />,
        title: "Reinforces number sequencing",
        body: "Counting from 1 to 10, 50, or 200+ is meaningful when each number reveals part of a picture — far more engaging than drills alone.",
    },
    {
        icon: <Sparkles size={22} className="text-brand-blue" aria-hidden="true" />,
        title: "Works for all ages",
        body: "Easy 10-dot sheets keep toddlers engaged. Extreme 200-dot puzzles challenge adults and older kids who enjoy detailed, meditative activities.",
    },
];

const DIFFICULTY_GUIDE = [
    { level: "Easy", dots: "10 – 25 dots", age: "Ages 3 – 6", color: "bg-green-100 text-green-800 border-green-200", desc: "Simple shapes: suns, stars, basic animals. Ideal for preschool and early counting practice." },
    { level: "Medium", dots: "25 – 60 dots", age: "Ages 6 – 10", color: "bg-yellow-100 text-yellow-800 border-yellow-200", desc: "More detailed outlines: vehicles, characters, nature scenes. Holds attention for 10–15 minutes." },
    { level: "Hard", dots: "60 – 100 dots", age: "Ages 10 – 14", color: "bg-orange-100 text-orange-800 border-orange-200", desc: "Complex images with fine detail. A satisfying challenge for older kids and teenagers." },
    { level: "Extreme", dots: "100 – 200+ dots", age: "Adults", color: "bg-red-100 text-red-800 border-red-200", desc: "Intricate designs that reward patience. Perfect for adults who enjoy focused, screen-free activity." },
];

const HOW_TO_STEPS = [
    { n: "1", title: "Download the PDF", body: "Pick any puzzle from the collection below and click Download. The file opens print-ready at A4 or US Letter size." },
    { n: "2", title: "Print it out", body: "Use any home or office printer. Black-and-white works perfectly — no colour ink needed. Print on standard 80gsm paper." },
    { n: "3", title: "Connect the dots", body: "Start at dot 1 and draw a line to dot 2, then 3, and so on. When you reach the last number, the hidden picture is revealed." },
    { n: "4", title: "Colour it in (optional)", body: "Once the outline is complete, grab some coloured pencils or crayons and bring the picture to life." },
];

const FAQ_ITEMS = [
    {
        q: "What is a dot to dot printable?",
        a: "A dot to dot printable (also called connect the dots) is a worksheet where numbered dots are arranged on a page. Drawing lines between the dots in order — from 1 to 2 to 3 — gradually reveals a hidden picture. Printable versions can be downloaded as PDF files and printed at home.",
    },
    {
        q: "Are these dot to dot printables free?",
        a: "Yes. Every puzzle in this collection is completely free to download and print, with no watermarks and no sign-up required. Simply click the puzzle you want and download the PDF.",
    },
    {
        q: "What is the difference between dot to dot and connect the dots?",
        a: "They are the same activity described with different words. 'Dot to dot' is more commonly used in British English (UK, Australia, New Zealand), while 'connect the dots' is the standard American English term. Both refer to numbered dot puzzles that reveal a picture when completed.",
    },
    {
        q: "What paper size should I use?",
        a: "All PDFs are designed to print on both A4 (210 × 297 mm) and US Letter (8.5 × 11 in). Select 'Fit to page' in your print dialog to ensure the puzzle fills the sheet correctly without cropping.",
    },
    {
        q: "Can I make a custom dot to dot from my own photo?",
        a: "Yes — use the generator further down this page. Upload any image (a pet, portrait, or simple drawing), choose how many dots you want, and the tool converts it into a numbered dot-to-dot puzzle you can download as PDF. No design experience needed.",
    },
    {
        q: "Are dot to dot puzzles good for adults?",
        a: "Absolutely. Hard and Extreme puzzles with 100–200+ dots provide a focused, meditative activity for adults. Many people find them a useful screen-free wind-down activity. The custom generator also lets adults create puzzles from their own meaningful photos.",
    },
];

const RELATED_LINKS = [
    { href: "/printable-connect-the-dots/", title: "Connect the Dots Printables", desc: "Browse the full collection filtered by theme and age." },
    { href: "/free-animal-dot-to-dot-printables-pdf/", title: "Animal Dot to Dot PDFs", desc: "Dogs, cats, rabbits, owls, turtles and more." },
    { href: "/christmas-printables/", title: "Christmas Dot to Dot", desc: "Santa, trees, ornaments and holiday scenes." },
    { href: "/connect-the-dots-1-to-10/", title: "Dot to Dot 1 to 10", desc: "Beginner sheets for toddlers and preschoolers." },
    { href: "/how-to-make/", title: "How to Make a Dot to Dot", desc: "Step-by-step guide using your own images." },
    { href: "/dot-to-dot-generator-from-photo/", title: "Dot to Dot Generator from Photo", desc: "Convert any photo into a numbered puzzle." },
];

// ─── Schema ────────────────────────────────────────────────────────────────────
function buildJsonLd(items: PrintableItem[]) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://connectthedotsprintable.online/dot-to-dot-printable/",
                name: "Free Dot to Dot Printables — PDF Puzzles for Kids & Adults",
                url: "https://connectthedotsprintable.online/dot-to-dot-printable/",
                description:
                    "Download free dot to dot printables as PDF. Easy to extreme difficulty puzzles for all ages — animals, nature, fantasy and more.",
                inLanguage: "en",
                mainEntity: {
                    "@type": "ItemList",
                    numberOfItems: items.length,
                    itemListElement: items.slice(0, 20).map((item, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        url: `https://connectthedotsprintable.online${item.detailPage}`,
                        name: item.title,
                    })),
                },
            },
            {
                "@type": "FAQPage",
                mainEntity: FAQ_ITEMS.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            },
            {
                "@type": "HowTo",
                name: "How to do a dot to dot printable",
                step: HOW_TO_STEPS.map((s) => ({
                    "@type": "HowToStep",
                    name: s.title,
                    text: s.body,
                })),
            },
        ],
    };
}

// ─── Filter config ─────────────────────────────────────────────────────────────
const FILTERS = [
    { id: "all", label: "All Levels" },
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
    { id: "extreme", label: "Extreme" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function DotToDotPrintableClient({ locale, allItems }: Props) {
    const { user, login, isLoggingIn } = useAuth();
    const credits = user ? parseInt(user.credits || "0", 10) : 0;
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const displayedItems = useMemo(() => {
        if (activeFilter === "all") return allItems;
        return allItems.filter(
            (item) => item.difficulty.toLowerCase() === activeFilter
        );
    }, [activeFilter, allItems]);

    const jsonLd = buildJsonLd(allItems);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="flex-grow w-full bg-slate-50">

                {/* ── Hero ── */}
                <section className="relative bg-slate-900 pt-14 pb-12 overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                        {/* Breadcrumb */}
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight size={12} className="opacity-50" aria-hidden="true" />
                            <span className="text-brand-blue">Dot to Dot Printable</span>
                        </nav>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                                Free Dot to Dot Printables
                            </h1>
                            <p className="text-base sm:text-lg text-slate-300 leading-7 mb-3 max-w-2xl">
                                Download printable dot to dot puzzles as PDF — no watermarks, no sign-up.
                                Easy 10-dot sheets for toddlers through extreme 200-dot challenges for adults.
                            </p>
                            <p className="text-sm text-slate-400 mb-8 max-w-2xl">
                                Want something unique? The custom generator below turns any photo into a numbered dot-to-dot puzzle in seconds.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => document.getElementById("puzzle-gallery")?.scrollIntoView({ behavior: "smooth" })}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
                                >
                                    <Download size={16} aria-hidden="true" />
                                    Browse Free PDFs ↓
                                </button>
                                <button
                                    onClick={() => document.getElementById("custom-generator")?.scrollIntoView({ behavior: "smooth" })}
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <Sparkles size={16} aria-hidden="true" />
                                    Make Your Own ↓
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── What is dot to dot ── */}
                <section className="py-12 bg-white border-b border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="grid md:grid-cols-2 gap-10 items-start">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                                    What is a dot to dot printable?
                                </h2>
                                <p className="text-slate-600 leading-7 mb-4">
                                    A <strong>dot to dot printable</strong> is a worksheet where numbered dots are laid out on a page. You draw a line from dot 1 to dot 2, then to dot 3, continuing in order until the final dot — and a hidden picture is gradually revealed.
                                </p>
                                <p className="text-slate-600 leading-7 mb-4">
                                    The activity goes by several names: <em>dot to dot</em>, <em>connect the dots</em>, <em>join the dots</em>, or <em>point to point</em>. All refer to the same numbered puzzle format. The term &ldquo;dot to dot&rdquo; is most common in British English (UK, Australia), while &ldquo;connect the dots&rdquo; is standard in American English.
                                </p>
                                <p className="text-slate-600 leading-7">
                                    Dot to dot puzzles are used in schools, at home, and as a calming adult activity. Every PDF in this collection prints cleanly on A4 or US Letter paper with no watermarks.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                                    Why dot to dot activities work
                                </h2>
                                <div className="space-y-4">
                                    {WHY_ITEMS.map((item) => (
                                        <div key={item.title} className="flex gap-3 items-start">
                                            <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                                                <p className="text-slate-500 text-sm leading-6">{item.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Difficulty guide ── */}
                <section className="py-12 bg-slate-50 border-b border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2 text-center">
                            Choosing the right difficulty level
                        </h2>
                        <p className="text-slate-500 text-center mb-8 text-sm max-w-xl mx-auto">
                            Every puzzle in this collection is tagged with a difficulty level and age recommendation.
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {DIFFICULTY_GUIDE.map((d) => (
                                <div
                                    key={d.level}
                                    className={`rounded-2xl border p-5 ${d.color}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-base">{d.level}</span>
                                        <span className="text-xs font-semibold opacity-75">{d.age}</span>
                                    </div>
                                    <p className="text-xs font-bold mb-2 opacity-80">{d.dots}</p>
                                    <p className="text-xs leading-5 opacity-90">{d.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── How to do a dot to dot ── */}
                <section className="py-12 bg-white border-b border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
                            How to do a dot to dot puzzle
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {HOW_TO_STEPS.map((step) => (
                                <div key={step.n} className="relative">
                                    <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-extrabold text-lg flex items-center justify-center mb-3">
                                        {step.n}
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1">{step.title}</h3>
                                    <p className="text-slate-500 text-sm leading-6">{step.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Puzzle gallery ── */}
                <section id="puzzle-gallery" className="py-12 md:py-16 bg-slate-50">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">
                                    Free Dot to Dot PDFs
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {displayedItems.length} puzzles · click any card to download
                                </p>
                            </div>
                            {/* Difficulty filter tabs */}
                            <div className="flex flex-wrap gap-2">
                                {FILTERS.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveFilter(f.id)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                                            activeFilter === f.id
                                                ? "bg-brand-blue border-brand-blue text-white"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-brand-blue hover:border-indigo-200"
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {displayedItems.map((item, idx) => (
                                <PrintableCard key={item.id} item={item} priority={idx < 4} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Custom generator ── */}
                <section id="custom-generator" className="py-12 md:py-16 bg-white border-t border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                                Make your own dot to dot from any photo
                            </h2>
                            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
                                Upload any image — a pet, portrait, or simple drawing — and our tool converts it into a numbered dot-to-dot puzzle. Adjust the dot count and download as PDF, free.
                            </p>
                        </div>

                        <div className="flex justify-center mb-6">
                            {!user ? (
                                <button
                                    onClick={() => login()}
                                    disabled={isLoggingIn}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-brand-blue border border-brand-blue rounded-full hover:bg-indigo-50 transition-colors"
                                >
                                    {isLoggingIn ? "Signing in…" : "Sign in with Google to get free credits"}
                                </button>
                            ) : (
                                <span className={`text-sm font-medium px-4 py-1.5 rounded-full border ${credits > 0 ? "text-slate-600 border-slate-200 bg-slate-50" : "text-red-500 border-red-200 bg-red-50"}`}>
                                    {credits > 0
                                        ? `${credits} AI credits remaining`
                                        : "No credits left — upgrade to continue"}
                                </span>
                            )}
                        </div>

                        <DotGeneratorClient locale={locale} user={user} />
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-100">
                    <div className="container max-w-3xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
                            Frequently asked questions
                        </h2>
                        <div className="space-y-5">
                            {FAQ_ITEMS.map((item) => (
                                <article
                                    key={item.q}
                                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
                                >
                                    <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                                    <p className="text-sm leading-7 text-slate-600">{item.a}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Related links ── */}
                <section className="py-10 bg-white border-t border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-700 mb-5">Related collections</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {RELATED_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group block bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl p-4 transition-all"
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
