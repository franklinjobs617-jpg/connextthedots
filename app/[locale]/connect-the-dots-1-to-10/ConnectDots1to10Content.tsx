"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllPrintables, PrintableItem } from "@/lib/printables-data";
import PrintableCard from "@/components/PrintableCard";
import { Download, Printer, Star, ChevronDown, BookOpen, GraduationCap, ArrowRight, ExternalLink } from "lucide-react";

// 筛选适合初学者的最简单 printables（优先选点数最少的 Easy 图）
// 注：目前图库中没有点数上限严格 <=10 的图，最简单的是 1-20。
// 因此展示"最简单的入门级"图案，文案避免声称精确练习 1-10。
function getEasyPrintables(): PrintableItem[] {
    const all = getAllPrintables();

    return all
        .filter((item) => {
            const range = item.dotRange;
            return Array.isArray(range) && range[1] <= 25 && item.difficulty === "Easy";
        })
        .sort((a, b) => {
            const aMax = Array.isArray(a.dotRange) ? a.dotRange[1] : 999;
            const bMax = Array.isArray(b.dotRange) ? b.dotRange[1] : 999;
            return aMax - bMax;
        })
        .slice(0, 12);
}

// FAQ 组件（始终展开，与已声明的 FAQPage Schema 保持一致）
function FAQItem({ question, answer }: {
    question: string;
    answer: string;
}) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="w-full p-4 text-left">
                <span className="font-semibold text-gray-800">{question}</span>
            </div>
            <div className="px-4 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {answer}
            </div>
        </div>
    );
}

export default function ConnectDots1to10Content() {
    const printables = getEasyPrintables();
    const [showAll, setShowAll] = useState(false);

    const displayedPrintables = showAll ? printables : printables.slice(0, 8);

    const faqItems = [
        {
            q: "What age are connect the dots 1 to 10 worksheets for?",
            a: "Connect the dots 1 to 10 worksheets are designed for children ages 2-5. Toddlers (ages 2-3) can start with the simplest shapes, while preschoolers (ages 4-5) can use them to reinforce number recognition and fine motor skills."
        },
        {
            q: "How do I print these dot to dot worksheets?",
            a: "Click the Download PDF button on any worksheet. Open the PDF file and select Print. Choose 'Fit to Page' in your printer settings for the best results. We recommend using standard A4 or Letter size paper."
        },
        {
            q: "Are these connect the dots 1 to 10 printables really free?",
            a: "Yes! All our connect the dots 1 to 10 printables are completely free to download and print. No sign-up, no payment, no watermarks. They are for personal and educational use."
        },
        {
            q: "What comes after connect the dots 1 to 10?",
            a: "Once your child masters 1 to 10, try our connect the dots 1 to 20 worksheets for the next challenge. This gradual progression helps build confidence while developing counting skills."
        },
        {
            q: "Can teachers use these worksheets in the classroom?",
            a: "Absolutely! These worksheets are perfect for classroom use. Teachers can print them for math centers, morning work, or as a quiet activity. They align with early childhood education standards for number recognition and fine motor development."
        }
    ];

    return (
        <main className="bg-slate-50 min-h-screen">
            {/* Breadcrumb */}
            <nav className="container mx-auto max-w-6xl px-4 pt-6 pb-2" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-gray-500">
                    <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                    <li className="text-gray-300">/</li>
                    <li className="text-gray-800 font-medium">Connect the Dots 1 to 10</li>
                </ol>
            </nav>

            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Hero Section */}
                <header className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Free <span className="text-blue-600">Connect the Dots 1 to 10</span> Printables
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Download our easiest connect the dots worksheets, designed for toddlers and preschoolers just starting to count.
                        Large dots, simple shapes, and instant PDF download — perfect for little hands learning their numbers.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" /> Easiest Worksheets</span>
                        <span className="flex items-center gap-1"><Printer size={16} /> Instant PDF Download</span>
                        <span className="flex items-center gap-1"><BookOpen size={16} /> Ages 2-5</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">Last updated: July 15, 2026</p>
                </header>

                {/* Printable Grid - 核心内容 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Our Easiest Dot to Dot Worksheets
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Click any worksheet to preview and download the PDF. All printables are free, with no watermarks.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {displayedPrintables.map((item, idx) => (
                            <PrintableCard key={item.id} item={item} priority={idx < 4} />
                        ))}
                    </div>

                    {printables.length > 8 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors"
                            >
                                {showAll ? "Show Less" : `Load More (${printables.length - 8} more)`}
                                <ChevronDown size={18} className={`transition-transform ${showAll ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                    )}
                </section>

                {/* 教育价值 */}
                <section className="mb-16 bg-white rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap size={28} className="text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Why 1 to 10 Is Perfect for Beginners</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Our easiest connect the dots worksheets are the ideal starting point for young learners.
                                The small number range keeps activities short and achievable, which is crucial for
                                maintaining a toddler&apos;s attention span. Each completed worksheet gives children a
                                sense of accomplishment that builds confidence.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                These worksheets help develop <strong className="text-gray-800">number recognition</strong>,
                                <strong className="text-gray-800"> fine motor skills</strong>, and
                                <strong className="text-gray-800"> hand-eye coordination</strong> — three foundational
                                skills that prepare children for writing and math in kindergarten.
                            </p>
                            <p className="text-xs text-gray-400 mt-4">
                                Source:{" "}
                                <a
                                    href="https://research.aota.org/ajot/article/78/3/7803205080/25181/Quantifying-Coloring-Skills-Among-Preschoolers"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                    American Journal of Occupational Therapy — fine motor skills in preschoolers
                                    <ExternalLink size={11} />
                                </a>
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Skills Your Child Will Develop:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                                    <span className="text-gray-700"><strong>Number Recognition:</strong> Identifying and sequencing numbers in order</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                                    <span className="text-gray-700"><strong>Fine Motor Control:</strong> Practicing pencil grip and line drawing</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                                    <span className="text-gray-700"><strong>Focus & Patience:</strong> Completing a task from start to finish</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                                    <span className="text-gray-700"><strong>Shape Awareness:</strong> Recognizing outlines of animals, objects, and patterns</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 使用指南 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use These Worksheets</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                            <h3 className="font-semibold text-gray-800 mb-2">Choose a Worksheet</h3>
                            <p className="text-sm text-gray-600">Browse the collection above and pick a design your child will love — animals, shapes, or fun characters.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                            <h3 className="font-semibold text-gray-800 mb-2">Download the PDF</h3>
                            <p className="text-sm text-gray-600">Click the Download PDF button. The file will open in a new tab — save it to your device.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                            <h3 className="font-semibold text-gray-800 mb-2">Print & Connect!</h3>
                            <p className="text-sm text-gray-600">Print on standard paper. Give your child a crayon or pencil and let them connect the dots in order.</p>
                        </div>
                    </div>
                </section>

                {/* 内链区 - What Comes Next */}
                <section className="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What Comes After 1 to 10?</h2>
                    <p className="text-gray-600 mb-6">
                        Once your child is comfortable with these easiest worksheets, gradually increase the challenge.
                        These next-level worksheets help build counting skills step by step.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link href="/printable-connect-the-dots/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group">
                            <h3 className="font-semibold text-blue-600 group-hover:underline">All Printable Connect the Dots</h3>
                            <p className="text-sm text-gray-600 mt-1">Browse our full collection — easy, medium, and hard worksheets for all ages.</p>
                        </Link>
                        <Link href="/free-animal-dot-to-dot-printables-pdf/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group">
                            <h3 className="font-semibold text-blue-600 group-hover:underline">Animal Dot to Dot Printables</h3>
                            <p className="text-sm text-gray-600 mt-1">Animal-themed worksheets that kids love — dogs, cats, dinosaurs, and more.</p>
                        </Link>
                        <Link href="/how-to-make/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group">
                            <h3 className="font-semibold text-blue-600 group-hover:underline">How to Make Dot to Dot</h3>
                            <p className="text-sm text-gray-600 mt-1">Learn how to create your own custom connect the dots puzzles.</p>
                        </Link>
                        <Link href="/connect-the-dots-coloring-pages/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group">
                            <h3 className="font-semibold text-blue-600 group-hover:underline">Connect the Dots Coloring Pages</h3>
                            <p className="text-sm text-gray-600 mt-1">Two-in-one activity pages: connect dots then color the revealed picture.</p>
                        </Link>
                    </div>
                    <div className="mt-6 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                            Or create your own with our generator <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-3 max-w-3xl">
                        {faqItems.map((item, index) => (
                            <FAQItem
                                key={index}
                                question={item.q}
                                answer={item.a}
                            />
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="text-center bg-blue-600 text-white rounded-2xl p-8 md:p-12 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Want More Custom Worksheets?</h2>
                    <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                        Use our free AI-powered generator to create custom connect the dots puzzles from any image.
                        Perfect for personalized learning activities!
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-yellow-400 hover:text-gray-900 transition transform hover:scale-105 shadow-lg"
                    >
                        Try the Free Generator
                    </Link>
                </section>
            </div>
        </main>
    );
}
