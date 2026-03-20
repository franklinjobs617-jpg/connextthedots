"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Edit3,
    Grid3X3,
    Palette,
    BarChart2,
    Download,
    Printer,
    ChevronRight,
    Loader2
} from "lucide-react";
import { GalleryPattern, loadGalleryPatterns } from "../../gallery-data";
import { PALETTE } from "../../palette-data";
import BeadPreviewCanvas from "../../components/BeadPreviewCanvas";
import { generateProfessionalPDF } from "../../lib/export-utils";

// Difficulty color mapping
const DIFFICULTY_STYLE: Record<string, string> = {
    beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    intermediate: "bg-amber-50 text-amber-700 border-amber-200",
    advanced: "bg-red-50 text-red-700 border-red-200",
};


const downloadBeads = async (pattern: GalleryPattern, stats: any[]) => {
    try {
        if (!pattern.grid) {
            alert("Pattern data is not fully loaded. Please try again.");
            return;
        }
        await generateProfessionalPDF(pattern.title, pattern.grid, stats, PALETTE);
    } catch (error) {
        console.error("Download error:", error);
        alert("Failed to generate PDF. Please try again.");
    }
};

const printBeads = () => {
    window.print();
};

export default function PatternDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [viewMode, setViewMode] = useState<"finished" | "pattern">("finished");
    const [pattern, setPattern] = useState<GalleryPattern | null>(null);
    const [allPatterns, setAllPatterns] = useState<GalleryPattern[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        loadGalleryPatterns().then((data) => {
            setAllPatterns(data);
            setPattern(data.find((p) => p.slug === slug) ?? null);
            setIsLoading(false);
        });
    }, [slug]);

    // Color statistics
    const colorStats = useMemo(() => {
        if (!pattern || !pattern.grid) return [];
        const colorMap = new Map(PALETTE.map((p) => [p.id, p]));
        const counts: Record<string, number> = {};

        pattern.grid.forEach((row) => {
            row.forEach((cell) => {
                if (cell) counts[cell] = (counts[cell] || 0) + 1;
            });
        });

        return Object.entries(counts)
            .map(([id, count]) => {
                const paletteItem = colorMap.get(id);
                if (!paletteItem) return null;
                return { ...paletteItem, count, bags: Math.ceil(count / 1000) };
            })
            .filter(Boolean)
            .sort((a: any, b: any) => b.count - a.count) as any[];
    }, [pattern]);

    // Related patterns recommendation
    const relatedPatterns = useMemo(() => {
        if (!pattern) return [];
        return allPatterns
            .filter(
                (p) =>
                    p.id !== pattern.id &&
                    (p.category === pattern.category ||
                        p.tags.some((t) => pattern.tags.includes(t)))
            )
            .slice(0, 4);
    }, [pattern, allPatterns]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!pattern) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Pattern Not Found
                    </h1>
                    <Link
                        href="/convert-photo-to-beads/gallery"
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        ← Back to Gallery
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm text-slate-400">
                        <Link
                            href="/convert-photo-to-beads"
                            className="hover:text-indigo-600 no-underline text-slate-400"
                        >
                            Bead Maker
                        </Link>
                        <ChevronRight size={14} />
                        <Link
                            href="/convert-photo-to-beads/gallery"
                            className="hover:text-indigo-600 no-underline text-slate-400"
                        >
                            Gallery
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-slate-700 font-medium">
                            {pattern.title}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Left: Canvas Preview (3/5) */}
                    <div className="lg:col-span-3">
                        {/* View Switcher */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setViewMode("finished")}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "finished"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-slate-600 border border-slate-200"
                                    }`}
                            >
                                🎨 Finished View
                            </button>
                            <button
                                onClick={() => setViewMode("pattern")}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "pattern"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-slate-600 border border-slate-200"
                                    }`}
                            >
                                📐 Pattern View
                            </button>
                        </div>

                        {/* Canvas Rendering Area */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-10 flex items-center justify-center min-h-[400px]">
                            {pattern.grid && (
                                <BeadPreviewCanvas
                                    grid={pattern.grid}
                                    maxWidth={600}
                                    detailed={viewMode === "finished"}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right: Info Panel (2/5) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title Area */}
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                                {pattern.title}
                            </h1>
                            <p className="text-slate-500 leading-relaxed mb-4">
                                {pattern.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <span
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${DIFFICULTY_STYLE[pattern.difficulty]
                                        }`}
                                >
                                    {pattern.difficulty}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    by {pattern.author}
                                </span>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                                <Grid3X3
                                    size={20}
                                    className="text-indigo-500 mx-auto mb-2"
                                />
                                <div className="text-lg font-black text-slate-900">
                                    {pattern.width}×{pattern.height}
                                </div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold">
                                    Grid Size
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                                <BarChart2
                                    size={20}
                                    className="text-emerald-500 mx-auto mb-2"
                                />
                                <div className="text-lg font-black text-slate-900">
                                    {pattern.beadCount}
                                </div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold">
                                    Total Beads
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                                <Palette
                                    size={20}
                                    className="text-amber-500 mx-auto mb-2"
                                />
                                <div className="text-lg font-black text-slate-900">
                                    {colorStats.length}
                                </div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold">
                                    Colors
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link
                                href={`/convert-photo-to-beads/editor?import=${pattern.slug}`}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 no-underline"
                            >
                                <Edit3 size={20} />
                                Open in Editor
                            </Link>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:border-indigo-200 transition-all"
                                    onClick={async () => {
                                        if (pattern && !isDownloading && pattern.grid) {
                                            setIsDownloading(true);
                                            await downloadBeads(pattern, colorStats);
                                            setIsDownloading(false);
                                        }
                                    }}
                                    disabled={isDownloading || !pattern?.grid}
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={16} />
                                            Download
                                        </>
                                    )}
                                </button>
                                <button 
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:border-indigo-200 transition-all"
                                    onClick={printBeads}
                                >
                                    <Printer size={16} />
                                    Print
                                </button>
                            </div>
                        </div>

                        {/* Material List */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                <Palette size={18} className="text-indigo-500" />
                                Material List
                            </h3>
                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
                                {colorStats.map((stat: any) => (
                                    <div
                                        key={stat.id}
                                        className="flex items-center justify-between py-2 border-b border-slate-50 last:border-b-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-5 h-5 rounded-full border border-slate-200 shadow-sm"
                                                style={{ backgroundColor: stat.color }}
                                            />
                                            <span className="text-sm font-medium text-slate-700">
                                                {stat.code}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="font-bold text-slate-900">
                                                {stat.count}
                                            </span>
                                            <span className="text-xs text-indigo-600 font-bold">
                                                {stat.bags} bag{stat.bags > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        {pattern.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {pattern.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Patterns */}
                {relatedPatterns.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">
                            Related Patterns
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {relatedPatterns.map((rp) => (
                                <Link
                                    key={rp.id}
                                    href={`/convert-photo-to-beads/gallery/${rp.slug}`}
                                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all no-underline"
                                >
                                    <div className="aspect-square bg-slate-50 p-4 flex items-center justify-center">
                                        {rp.grid && (
                                            <BeadPreviewCanvas
                                                grid={rp.grid}
                                                maxWidth={200}
                                                detailed={false}
                                                className="group-hover:scale-105 transition-transform"
                                            />
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-slate-50">
                                        <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                            {rp.title}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            {rp.width}×{rp.height} • {rp.beadCount} beads
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
