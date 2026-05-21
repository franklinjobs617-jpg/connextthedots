"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, Download, Filter, Printer, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import PrintableCard from "@/components/PrintableCard";
import { conversionExamples } from "@/lib/seo-showcase";
import type { PrintableItem } from "@/lib/printables-data";

type PrintableListClientProps = {
    locale: string;
    data: Record<string, PrintableItem[]>;
    allItems: PrintableItem[];
};

type UserPuzzle = {
    slug: string;
    title: string;
    description: string;
    difficulty: string;
    puzzleImageUrl: string;
    dotCount: number;
};

const ageGroups = [
    {
        title: "Preschool and Early Counting",
        body: "Printable connect the dots pages with 10 to 25 dots work best for preschoolers and early elementary learners. These sheets keep the path simple enough for number practice while still giving the child a recognizable picture to finish and color.",
    },
    {
        title: "Elementary Worksheet Practice",
        body: "Worksheets with 25 to 60 dots are a strong fit for classroom warm-ups, quiet centers, and home practice. They add enough detail to reward careful counting without becoming frustrating for most kids.",
    },
    {
        title: "Older Kids and Adults",
        body: "Hard connect-the-dots printables with 60 or more dots suit older kids, teens, and adults who want a denser printable puzzle. These pages are best for focus practice, calm screen-free time, and more detailed final outlines.",
    },
];

const difficultyCards = [
    { label: "Easy", dots: "1-20", copy: "Large shapes and early counting practice." },
    { label: "Medium", dots: "20-50", copy: "Balanced detail for most printable worksheet use." },
    { label: "Hard", dots: "50-100+", copy: "More lines, tighter spacing, and older learner appeal." },
];

const faqItems = [
    {
        question: "Are these printable as PDF?",
        answer: "Yes. The main printable collection is organized to help people find worksheets that are easy to preview online and simple to print. If you need a ready-made sheet, use the themed pages and detail pages. If you need a custom worksheet, go to the generator and export your own printable file.",
    },
    {
        question: "What age is each dot range best for?",
        answer: "A 10 to 25 dot range usually works best for preschool and early counting practice. A 25 to 60 dot range is a better fit for elementary worksheets because it adds more picture detail without overwhelming the learner. A 60 plus range works best for older kids, teens, and adults who want a harder printable puzzle.",
    },
    {
        question: "Are there hard connect-the-dots for adults?",
        answer: "Yes. This collection includes hard printable pages and links to more advanced worksheets for adults and older kids. These puzzles use denser dot counts, more detailed outlines, and themes that stay interesting even when the activity is used for concentration practice or calm screen-free time.",
    },
    {
        question: "Can I create my own from a photo?",
        answer: "Yes. If you want a worksheet that matches a pet photo, student drawing, logo, or classroom topic, use the custom generator. The generator lets you upload an image, adjust the dot count, preview the path, and download a clean printable puzzle instead of relying only on the ready-made collection.",
    },
];

export default function PrintableListClient({ locale, data, allItems }: PrintableListClientProps) {
    const t = useTranslations("printablePage");
    const [activeFilter, setActiveFilter] = useState("all");
    const [userPuzzles, setUserPuzzles] = useState<UserPuzzle[]>([]);

    const displayedItems = useMemo(() => {
        if (activeFilter === "all") {
            return allItems.slice(0, 12);
        }
        return data[activeFilter] || [];
    }, [activeFilter, data, allItems]);

    const showcasePreview = [
        conversionExamples.worksheet,
        conversionExamples.pet,
        conversionExamples.outline,
    ];

    const allPuzzles = useMemo(() => {
        const formattedUserPuzzles: PrintableItem[] = userPuzzles.map((puzzle) => ({
            id: puzzle.slug,
            title: puzzle.title,
            description: puzzle.description,
            difficulty: puzzle.difficulty,
            tagColor: "bg-brand-blue",
            imageUrl: puzzle.puzzleImageUrl,
            imageSrcset: `${puzzle.puzzleImageUrl} 600w`,
            altText: puzzle.title,
            detailPage: `/printables/${puzzle.slug}/`,
            solutionUrl: puzzle.puzzleImageUrl,
            solutionAltText: `${puzzle.title} solution`,
            category: [],
            dotRange: [1, puzzle.dotCount],
            ageRecommendation: "All Ages",
            popularity: 0,
        }));

        return [...allItems, ...formattedUserPuzzles];
    }, [allItems, userPuzzles]);

    const canonicalBase = `https://connectthedotsprintable.online${locale === "en" ? "" : `/${locale}`}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Printable Connect the Dots",
        url: `${canonicalBase}/printable-connect-the-dots/`,
        about: "Free printable connect the dots worksheets in PDF-friendly formats.",
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: displayedItems.length,
            itemListElement: displayedItems.map((item: PrintableItem, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://connectthedotsprintable.online${item.detailPage}`,
                name: item.title,
            })),
        },
    };

    useEffect(() => {
        fetch("/api/connect-dots/gallery?limit=12")
            .then((res) => res.json())
            .then((result) => setUserPuzzles(Array.isArray(result) ? result : []))
            .catch((err) => console.error(err));
    }, []);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <main className="flex-grow relative w-full mx-auto bg-slate-50">
                <section className="relative bg-slate-900 pt-16 pb-14 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}
                    />

                    <div className="container max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-sm font-medium text-slate-400 mb-6 flex items-center gap-2">
                            <Link href={`/${locale === "en" ? "" : `${locale}/`}`} className="hover:text-white transition-colors">
                                {t("breadcrumbHome")}
                            </Link>
                            <ChevronRight size={12} className="opacity-50" />
                            <span className="text-brand-blue">{t("breadcrumbAll")}</span>
                        </div>

                        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
                            <div className="max-w-3xl">
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                                    Free Connect the Dots Printables for Kids and Adults
                                </h1>
                                <p className="text-lg text-slate-200 leading-8 mb-6">
                                    This printable connect the dots hub helps you browse ready-to-print worksheets by age, difficulty, and theme. Use it when you need a fast PDF-friendly activity, then switch to the generator if you want a custom puzzle from your own photo or outline.
                                </p>

                                <div className="flex flex-wrap gap-3 mb-6">
                                    {["Animals", "1-10", "Christmas", "Adults", "Coloring"].map((chip) => (
                                        <span key={chip} className="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-100">
                                            {chip}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {[
                                        { icon: Sparkles, label: "Preview", copy: "See the finished theme before you print." },
                                        { icon: Download, label: "Download", copy: "Open a clean worksheet or use the custom generator." },
                                        { icon: Printer, label: "Print", copy: "Use standard letter settings for a crisp page." },
                                    ].map(({ icon: Icon, label, copy }) => (
                                        <div key={label} className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                                            <Icon className="mb-3 text-brand-blue" size={18} />
                                            <p className="font-semibold text-white">{label}</p>
                                            <p className="mt-1 text-sm text-slate-300">{copy}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                                <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
                                    <Clock size={16} className="text-brand-blue" />
                                    Updated for current printable categories and custom generator links
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {showcasePreview.map((item) => (
                                        <Link key={item.id} href={item.detailPage} className="group">
                                            <div className="overflow-hidden rounded-2xl bg-slate-100">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.altText}
                                                    width={320}
                                                    height={320}
                                                    className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm font-medium text-slate-200">{item.title}</p>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-3">
                                    {difficultyCards.map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
                                            <p className="text-sm font-semibold text-white">{item.label}</p>
                                            <p className="mt-1 text-lg font-extrabold text-brand-blue">{item.dots}</p>
                                            <p className="mt-1 text-xs text-slate-400">{item.copy}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-14 bg-white border-b border-slate-100">
                    <div className="container max-w-7xl mx-auto px-6 grid gap-6 lg:grid-cols-4">
                        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Printable Connect the Dots by Age</h2>
                            <p className="text-sm leading-7 text-slate-600">
                                Printable pages work best when the dot count matches the learner. Start with lower counts for preschool and early counting, move to mid-range sheets for classroom practice, and use higher counts for older kids and adults who want a more detailed worksheet.
                            </p>
                        </article>
                        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Printable Connect the Dots by Difficulty</h2>
                            <p className="text-sm leading-7 text-slate-600">
                                The easiest worksheets reveal simple objects quickly. Medium printables add more detail for school and home practice. Hard connect-the-dots pages use denser paths and suit older users who want concentration work or a more satisfying finished outline.
                            </p>
                        </article>
                        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Popular Themes</h2>
                            <p className="text-sm leading-7 text-slate-600">
                                Animal, holiday, early counting, coloring, and harder adult pages cover the strongest printable intents on the site. These categories give users a fast way to find a worksheet that matches the lesson, season, or skill level they need today.
                            </p>
                        </article>
                        <article className="rounded-3xl border border-slate-200 bg-indigo-50 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Download PDF or Make Your Own</h2>
                            <p className="text-sm leading-7 text-slate-600">
                                Use the collection when a ready-made worksheet is enough. Use the generator when you need a specific picture, higher control over dot count, or a printable puzzle created from your own photo, drawing, pet image, or classroom outline.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="py-16 md:py-20">
                    <div className="container max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-12">
                            <aside className="lg:w-1/4 flex-shrink-0">
                                <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 sticky top-24">
                                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-brand-blue">
                                            <Filter size={16} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800">{t("filters")}</h2>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t("difficultyLevel")}</h3>
                                        {[
                                            { id: "all", label: t("allLevels"), badge: "Top 12" },
                                            { id: "easy", label: t("easy"), badge: "1-20" },
                                            { id: "medium", label: t("medium"), badge: "20-50" },
                                            { id: "hard", label: t("hard"), badge: "50-100" },
                                            { id: "extreme", label: t("extreme"), badge: "100+" },
                                        ].map((filter) => (
                                            <button
                                                key={filter.id}
                                                className={`w-full rounded-xl border px-4 py-3 text-left font-medium transition-all ${
                                                    activeFilter === filter.id
                                                        ? "border-brand-blue bg-brand-blue text-white"
                                                        : "border-slate-100 bg-white text-slate-600 hover:bg-indigo-50 hover:text-brand-blue"
                                                }`}
                                                onClick={() => setActiveFilter(filter.id)}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>{filter.label}</span>
                                                    <span className={`rounded px-2 py-1 text-[10px] font-bold ${activeFilter === filter.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                                                        {filter.badge}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            <div className="lg:w-3/4">
                                <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-200 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-brand-dark">{t("allPrintables")}</h2>
                                        <p className="text-slate-500 mt-1">{t("showingResults", { count: displayedItems.length, total: allPuzzles.length })}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-10">
                                    {displayedItems.map((item: PrintableItem, index: number) => (
                                        <PrintableCard key={item.id} item={item} priority={index < 3} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-8 bg-slate-50">
                    <div className="container max-w-7xl mx-auto px-6 grid gap-6 md:grid-cols-3">
                        {ageGroups.map((group) => (
                            <article key={group.title} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 mb-3">{group.title}</h2>
                                <p className="text-sm leading-7 text-slate-600">{group.body}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="py-8 bg-slate-50">
                    <div className="container max-w-7xl mx-auto px-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Link href="/connect-the-dots-coloring-pages/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group border border-gray-100">
                                <h3 className="font-semibold text-brand-blue group-hover:underline">Connect the Dots Coloring Pages</h3>
                                <p className="text-sm text-gray-600 mt-1">Two-in-one activity: connect dots then color the revealed picture.</p>
                            </Link>
                            <Link href="/connect-the-dots-1-to-10/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group border border-gray-100">
                                <h3 className="font-semibold text-brand-blue group-hover:underline">Connect the Dots 1 to 10</h3>
                                <p className="text-sm text-gray-600 mt-1">Easy worksheets for toddlers and preschoolers learning to count.</p>
                            </Link>
                            <Link href="/free-animal-dot-to-dot-printables-pdf/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group border border-gray-100">
                                <h3 className="font-semibold text-brand-blue group-hover:underline">Animal Dot-to-Dot Printables</h3>
                                <p className="text-sm text-gray-600 mt-1">Rabbit, dog, cat, turtle, fox, owl, and ocean animal worksheets.</p>
                            </Link>
                            <Link href="/christmas-printables/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group border border-gray-100">
                                <h3 className="font-semibold text-brand-blue group-hover:underline">Christmas Dot-to-Dot Printables</h3>
                                <p className="text-sm text-gray-600 mt-1">Holiday worksheets featuring Santa, trees, ornaments, and winter scenes.</p>
                            </Link>
                            <Link href="/how-to-make/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group border border-gray-100">
                                <h3 className="font-semibold text-brand-blue group-hover:underline">How to Make a Dot-to-Dot</h3>
                                <p className="text-sm text-gray-600 mt-1">Step-by-step tutorial for turning a photo or outline into a printable puzzle.</p>
                            </Link>
                            <Link href="/printables/connectTheDotsGenerator/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group border border-gray-100">
                                <h3 className="font-semibold text-brand-blue group-hover:underline">Custom Generator</h3>
                                <p className="text-sm text-gray-600 mt-1">Upload your own image and build a worksheet when the library is not enough.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-white border-t border-slate-100">
                    <div className="container max-w-7xl mx-auto px-6">
                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="rounded-[2.5rem] bg-indigo-50 p-8 md:p-12 border border-indigo-100">
                                <span className="text-brand-blue font-bold tracking-wider uppercase text-xs mb-3 block">{t("customTools")}</span>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-6">{t("cantFindDesign")}</h2>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">{t("createCustom")}</p>
                                <Link href={`/${locale === "en" ? "" : `${locale}/`}`} className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-all">
                                    <span>{t("tryGenerator")}</span>
                                </Link>
                            </div>

                            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Printable FAQ</h2>
                                <div className="space-y-5">
                                    {faqItems.map((item) => (
                                        <article key={item.question} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                                            <h3 className="font-semibold text-slate-900">{item.question}</h3>
                                            <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
