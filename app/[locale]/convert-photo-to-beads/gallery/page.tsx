"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Grid3X3, Sparkles, ArrowRight } from "lucide-react";
import { GalleryPattern, loadGalleryPatterns } from "../gallery-data";
import BeadPreviewCanvas from "../components/BeadPreviewCanvas";

// Categories
const CATEGORIES = [
    { key: "all", label: "All Patterns" },
    { key: "gaming", label: "Gaming" },
    { key: "animals", label: "Animals" },
    { key: "nature", label: "Nature" },
    { key: "shapes", label: "Shapes" },
    { key: "characters", label: "Characters" },
    { key: "custom", label: "Custom" },
];

// Difficulty styles
const DIFFICULTY_STYLE: Record<string, string> = {
    beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    intermediate: "bg-amber-50 text-amber-700 border-amber-200",
    advanced: "bg-red-50 text-red-700 border-red-200",
};

import { useSearchParams } from "next/navigation";

export default function GalleryPage() {
    const searchParams = useSearchParams();
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");

    const [patterns, setPatterns] = useState<GalleryPattern[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || "all");
    const [searchQuery, setSearchQuery] = useState(urlSearch || "");

    // Load patterns from /public/gallery/ JSON files
    useEffect(() => {
        loadGalleryPatterns().then((data) => {
            setPatterns(data);
            setIsLoading(false);
        });
    }, []);

    // Also update local state if URL changes (e.g. user clicks another link)
    useEffect(() => {
        if (urlCategory) setSelectedCategory(urlCategory);
        if (urlSearch) setSearchQuery(urlSearch);
    }, [urlCategory, urlSearch]);

    // Filtering logic
    const filteredPatterns = patterns.filter((pattern) => {
        const matchesCategory =
            selectedCategory === "all" || pattern.category === selectedCategory;
        const matchesSearch =
            searchQuery === "" ||
            pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pattern.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
            );
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <section className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 py-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-6">
                        <Sparkles size={16} />
                        Free Perler Bead Patterns Gallery
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Browse Free Bead Patterns
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
                        Discover free printable perler bead patterns.
                        Click any pattern to view details, download, or open in the editor.
                    </p>

                    <div className="max-w-lg mx-auto relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Search patterns... (e.g. pikachu, heart, minecraft)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                        />
                    </div>
                </div>
            </section>

            {/* 分类过滤 + 画廊网格 */}
            <div className="container mx-auto px-6 py-12">
                {/* Category Tags */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat.key
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">Loading patterns...</p>
                    </div>
                ) : filteredPatterns.length > 0 ? (
                    <>
                        {/* Result count */}
                        <p className="text-sm text-slate-400 mb-6 font-medium">
                            Showing {filteredPatterns.length} pattern
                            {filteredPatterns.length !== 1 ? "s" : ""}
                        </p>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredPatterns.map((pattern) => (
                                <PatternCard key={pattern.id} pattern={pattern} />
                            ))}
                        </div>
                    </>
                ) : patterns.length === 0 ? (
                    // Empty state
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                        <div className="text-6xl mb-6">🎨</div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">
                            Gallery is empty
                        </h3>
                        <p className="text-slate-400 max-w-md mx-auto mb-8">
                            Create your first pattern in the Editor, then export it
                            as Gallery JSON to display it here!
                        </p>
                        <Link
                            href="/convert-photo-to-beads/editor"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all no-underline"
                        >
                            Open Editor
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    // No results
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">
                            No patterns found
                        </h3>
                        <p className="text-slate-400">
                            Try a different search term or category.
                        </p>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-20 text-center bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">
                        Can&apos;t find what you need?
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                        Use our free pattern maker to create your own custom perler
                        bead patterns from any image!
                    </p>
                    <Link
                        href="/convert-photo-to-beads/editor"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-200 no-underline"
                    >
                        Open Pattern Maker
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// 单张图纸卡片
function PatternCard({ pattern }: { pattern: GalleryPattern }) {
    return (
        <Link
            href={`/convert-photo-to-beads/gallery/${pattern.slug}`}
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all hover:-translate-y-1 no-underline"
        >
            {/* Canvas 预览（不是 PNG，而是 Canvas 实时渲染！） */}
            <div className="relative aspect-square bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
                {/* 珠子数量徽章 */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">
                    <Grid3X3 size={12} className="text-indigo-500" />
                    {pattern.beadCount}
                </div>

                {pattern.grid && (
                    <BeadPreviewCanvas
                        grid={pattern.grid}
                        maxWidth={300}
                        detailed={false}
                        className="group-hover:scale-105 transition-transform duration-300"
                    />
                )}
            </div>

            {/* 信息 */}
            <div className="p-4 border-t border-slate-50">
                <h3 className="font-bold text-slate-900 text-sm mb-1 truncate group-hover:text-indigo-600 transition-colors">
                    {pattern.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3 truncate">
                    {pattern.width}×{pattern.height} • {pattern.author}
                </p>
                <div className="flex items-center justify-between">
                    <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${DIFFICULTY_STYLE[pattern.difficulty] || ""
                            }`}
                    >
                        {pattern.difficulty}
                    </span>
                </div>
            </div>
        </Link>
    );
}
