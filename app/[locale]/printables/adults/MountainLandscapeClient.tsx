"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
    Clock,
    Heart,
    ChevronRight,
    Maximize2,
    MessageSquare,
    X
} from "lucide-react";

export default function MountainLandscapeClient() {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Schema.org JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": "Mountain Landscape | Hard Dot to Dot Printable (100-200 Dots)",
        "description": "Advanced printable mountain landscape dot to dot for adults. Discover a scenic view.",
        "url": "https://connectthedotsprintable.online/printables/adults/",
        "image": "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif",
        "author": {
            "@type": "Organization",
            "name": "ConnectTheDotsPrintable.online"
        },
        "datePublished": "2023-10-26",
        "learningResourceType": "Printable",
        "keywords": "Hard, dot to dot, printable, Nature, Scenery",
        "educationalUse": ["Activity", "Educational"],
        "isAccessibleForFree": "true"
    };

    const openFeedback = () => {
        setIsFeedbackOpen(true);
        // @ts-ignore
        if (window.CUSDIS && window.CUSDIS.initial) window.CUSDIS.initial();
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="flex-grow">
                {/* Breadcrumb & Title Section */}
                <section className="bg-[#4F46E5] text-white py-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-sm font-medium text-indigo-200 mb-4 flex items-center gap-2">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <span className="opacity-50">/</span>
                                <Link href="/printable-connect-the-dots/" className="hover:text-white transition-colors">All Printables</Link>
                                <span className="opacity-50">/</span>
                                <span className="text-white">Mountain Landscape</span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight">Mountain Landscape</h1>
                                    <p className="text-indigo-100 text-lg max-w-2xl">Advanced printable mountain landscape dot to dot for adults. Discover a scenic view.</p>
                                </div>
                                <div className="text-xs text-indigo-200 bg-indigo-900/30 px-3 py-1.5 rounded-full backdrop-blur-sm whitespace-nowrap flex items-center gap-1">
                                    <Clock size={12} /> Last updated: October 10, 2025
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-12 bg-slate-50">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                            <div className="w-full lg:w-3/4">
                                <div className="flex flex-col md:flex-row gap-8 mb-12">
                                    {/* Puzzle Image Area */}
                                    <div className="w-full md:w-2/3 bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative group">
                                        <Image
                                            src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif"
                                            alt="Printable hard connect the dots puzzle: Mountain Landscape (Dots: 100-200)."
                                            width={600}
                                            height={600}
                                            className="w-full h-auto object-contain max-h-[600px] mix-blend-multiply"
                                            priority
                                        />
                                        <button
                                            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-[#4F46E5] hover:bg-indigo-50 transition-colors cursor-pointer"
                                            onClick={() => setIsImageModalOpen(true)}>
                                            <Maximize2 size={20} />
                                        </button>
                                    </div>

                                    {/* Info Sidebar */}
                                    <div className="w-full md:w-1/3 flex flex-col gap-6">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-50 pb-2">Puzzle Details</h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-medium">Difficulty:</span>
                                                    <span className="font-bold text-slate-700">Hard</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-medium">Dots:</span>
                                                    <span className="font-bold text-[#4F46E5]">100-200</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-medium">Category:</span>
                                                    <span className="font-bold text-slate-700">Nature, Scenery</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-medium">Age:</span>
                                                    <span className="font-bold text-slate-700">12+ Years</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-medium">Popularity:</span>
                                                    <div className="flex items-center gap-1 text-slate-700 font-bold">
                                                        <Heart size={16} className="text-red-500 fill-current" />
                                                        <span>60</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                                            <h3 className="text-lg font-bold text-slate-800 mb-4">View Solution</h3>
                                            <div className="space-y-3 mt-auto">
                                                <a href="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif"
                                                    download="adults-puzzle.webp"
                                                    className="flex items-center justify-center w-full bg-[#4F46E5] hover:bg-[#4338ca] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5">
                                                    Download Puzzle (WEBP)
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-4 border-l-4 border-[#4F46E5] pl-4">About this Printable</h2>
                                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                                        <p className="text-slate-600 leading-relaxed text-lg">Advanced printable mountain landscape dot to dot for adults. Discover a scenic view.</p>
                                    </div>
                                </div>

                                {/* Related Section */}
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6">More Printables You Might Like</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {/* Related Card 1 */}
                                        <Link href="/printables/easy-sailboat-connect-the-dots-puzzle-1-20-numbers/" className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                            <div className="relative w-full aspect-[4/3] bg-white p-4 flex items-center justify-center overflow-hidden border-b border-slate-50">
                                                <Image src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/easy-sailboat-connect-the-dots-puzzle-1-20-numbers.webp"
                                                    alt="Sailboat" fill className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                                                <span className="absolute top-3 right-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">Free</span>
                                            </div>
                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">Dots: 1-20</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#4F46E5] transition-colors leading-tight">Sailboat</h3>
                                                <p className="text-slate-500 text-sm line-clamp-2">Easy dot to dot puzzle of a sailboat on the water. Learn numbers 1 to 20.</p>
                                            </div>
                                        </Link>
                                        {/* ... (其它相关卡片结构相同，此处省略重复代码以保持简洁，逻辑一致) */}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Right */}
                            <aside className="w-full lg:w-1/4 space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                                    <span className="text-xs font-bold tracking-wider text-[#4F46E5] uppercase mb-4 block">Our Top Article</span>
                                    <Link href="/printables/connectTheDotsGenerator/" className="block mb-6 group">
                                        <h4 className="font-bold text-slate-800 group-hover:text-[#4F46E5] transition-colors mb-2 text-lg leading-tight">
                                            Unlock Limitless Creativity: Your Ultimate Guide to a Free Connect the Dots Generator
                                        </h4>
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-[#4F46E5] flex items-center gap-1">
                                            Read More <ChevronRight size={12} />
                                        </span>
                                    </Link>
                                    <hr className="border-slate-100 mb-6" />
                                    {/* Article List Item */}
                                    <Link href="/printables/animals/" className="flex gap-4 mb-5 group items-start">
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/400/6-Cute-Bunny-Rabbit-Connect-the-Dots-for-Young-Children-1-20-dots.avif" alt="Animals" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-700 text-sm group-hover:text-[#4F46E5] transition-colors line-clamp-2 mb-1">Animal Connect the Dots Printable</h4>
                                            <span className="text-xs text-slate-400">Educational</span>
                                        </div>
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                {/* Image Modal */}
                {isImageModalOpen && (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] backdrop-blur-sm p-4" onClick={() => setIsImageModalOpen(false)}>
                        <div className="relative bg-white p-2 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden w-full" onClick={e => e.stopPropagation()}>
                            <button className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white rounded-full text-slate-800 font-bold transition-all text-2xl" onClick={() => setIsImageModalOpen(false)}>&times;</button>
                            <div className="relative w-full h-[80vh]">
                                <Image
                                    src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif"
                                    alt="Enlarged" fill className="object-contain rounded-xl" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback Button */}
                <button
                    className="fixed bottom-6 right-6 bg-[#4F46E5] text-white font-semibold flex items-center justify-center rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 z-[90] p-4"
                    onClick={openFeedback}>
                    <MessageSquare size={24} />
                </button>

                {/* Feedback Modal */}
                {isFeedbackOpen && (
                    <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-end md:items-center backdrop-blur-sm" onClick={() => setIsFeedbackOpen(false)}>
                        <div className="bg-white w-full shadow-2xl flex flex-col rounded-t-2xl md:rounded-2xl max-h-[85vh] p-4 md:max-w-xl" onClick={e => e.stopPropagation()}>
                            <header className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800">Community Feedback</h2>
                                <button onClick={() => setIsFeedbackOpen(false)} className="text-slate-400 hover:text-slate-800 text-3xl leading-none">&times;</button>
                            </header>
                            <div className="overflow-y-auto flex-grow">
                                <div id="cusdis_thread"
                                    data-host="https://cusdis.com"
                                    data-app-id="4535a28e-08e9-411e-9c74-0f118e22c1af"
                                    data-page-id="connectthedotsprintable-mountain"
                                    data-page-url="https://connectthedotsprintable.online/printables/adults"
                                    data-page-title="Mountain Landscape"
                                    data-theme="light">
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

        </>
    );
}