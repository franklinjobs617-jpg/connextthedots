"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
    Sparkles,
    Download,
    Printer,
    Palette,
    Zap,
    ChevronRight,
    HelpCircle,
    FileText,
    Target,
    Layers,
    ShoppingBag,
    Info,
    CheckCircle2,
    Gamepad2,
    Heart,
    Dog,
    Gamepad
} from "lucide-react";
import Image from "next/image";
import { PALETTE } from "../palette-data";
import { findClosestColor, getDetailedBeadCanvas } from "../utils";
import { CELL_SIZE } from "../constants";

export default function LandingClient() {
    const t = useTranslations("beadsLanding");

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-slate-50/50">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        <div className="lg:w-1/2 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-6 tracking-wide">
                                <Sparkles size={14} />
                                <span>{t("hero.badge")}</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
                                {t("hero.title")}
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                                {t("hero.subtitle")}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                                <Link
                                    href="/convert-photo-to-beads/editor"
                                    className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all hover:scale-105 shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 group no-underline"
                                >
                                    {t("hero.cta")}
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="text-slate-400 text-sm font-medium">
                                    {t("hero.hint")}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-slate-200">
                                <span className="flex items-center gap-2 text-slate-400 text-xs font-bold"><CheckCircle2 size={14} className="text-emerald-500" /> Free Online</span>
                                <span className="flex items-center gap-2 text-slate-400 text-xs font-bold"><CheckCircle2 size={14} className="text-emerald-500" /> 1-Click PDF</span>
                                <span className="flex items-center gap-2 text-slate-400 text-xs font-bold"><CheckCircle2 size={14} className="text-emerald-500" /> No Sign-up</span>
                                <span className="flex items-center gap-2 text-slate-400 text-xs font-bold"><CheckCircle2 size={14} className="text-emerald-500" /> 14x14 Grids</span>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full lg:block">
                            <div className="relative group">
                                {/* Decorative blur backgrounds */}
                                <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
                                <div className="relative w-full aspect-square max-w-[560px] mx-auto rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(79,70,229,0.15)] border-8 border-white bg-white">
                                    <ComparisonSlider />
                                </div>
                                {/* Floating Action Hint */}
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-50 animate-bounce cursor-default select-none hidden md:flex">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                                        <Zap size={18} fill="currentColor" />
                                    </div>
                                    <div className="text-xs">
                                        <div className="font-black text-slate-900 uppercase">Real-time Result</div>
                                        <div className="text-slate-400 font-bold">Drag to compare</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Section - Topic Cluster Authority */}
            <section className="py-24 border-y border-slate-100 bg-slate-50/30">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">{t("intro.title")}</h2>
                        <p className="text-lg text-slate-600 leading-loose">
                            {t("intro.description")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{t("categories.title")}</h2>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto">{t("categories.subtitle")}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 xl:gap-6 max-w-7xl mx-auto">
                        <CategoryItem icon={<Gamepad2 />} label={t("categories.items.gaming")} />
                        <CategoryItem icon={<Layers />} label={t("categories.items.characters")} />
                        <CategoryItem icon={<Zap className="text-yellow-500" />} label={t("categories.items.heroes")} />
                        <CategoryItem icon={<Dog />} label={t("categories.items.animals")} />
                        <CategoryItem icon={<Heart />} label={t("categories.items.seasonal")} />
                        <CategoryItem icon={<Target className="text-indigo-600" />} label={t("categories.items.styles")} highlighted />
                    </div>
                </div>
            </section>

            {/* Detailed Features */}
            <section className="py-24 bg-slate-900 text-white rounded-[3rem] mx-6">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-bold mb-8 leading-tight">{t("features.title")}</h2>
                            <div className="space-y-10">
                                <FeatureInfo
                                    icon={<Target className="text-indigo-400" />}
                                    title={t("features.f1Title")}
                                    desc={t("features.f1Desc")}
                                />
                                <FeatureInfo
                                    icon={<ShoppingBag className="text-amber-400" />}
                                    title={t("features.f2Title")}
                                    desc={t("features.f2Desc")}
                                />
                                <FeatureInfo
                                    icon={<FileText className="text-emerald-400" />}
                                    title={t("features.f3Title")}
                                    desc={t("features.f3Desc")}
                                />
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="bg-slate-800 p-4 rounded-3xl border border-slate-700 shadow-2xl skew-y-1">
                                <div className="bg-white rounded-2xl p-6 text-slate-900">
                                    <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                                        <span className="font-bold">Material Requirements</span>
                                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">22 Colors Detected</span>
                                    </div>
                                    <div className="space-y-3">
                                        <InventoryRow color="#EF4444" name="Flame" code="P12" count="310" bags="1" />
                                        <InventoryRow color="#3B82F6" name="Sky Blue" code="P24" count="120" bags="1" />
                                        <InventoryRow color="#10B981" name="Grass" code="P05" count="450" bags="1" />
                                        <InventoryRow color="#F59E0B" name="Amber" code="P18" count="85" bags="1" />
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                                                <Download size={20} />
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-bold">Export Printable Guide</div>
                                                <div className="text-slate-400 underline">Download HD PDF (2.4MB)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 bg-amber-500 p-4 rounded-2xl shadow-xl animate-bounce">
                                <Zap size={24} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">{t("howTo.title")}</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto relative">
                        <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-slate-100 -z-10" />
                        <Step number="1" title="Upload" desc={t("howTo.step1")} />
                        <Step number="2" title="Resize" desc={t("howTo.step2")} />
                        <Step number="3" title="Palette" desc={t("howTo.step3")} />
                        <Step number="4" title="Export" desc={t("howTo.step4")} />
                    </div>
                </div>
            </section>

            {/* Tips & FAQ */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">
                        <div className="lg:w-1/2">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                    <Info className="text-indigo-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">{t("expertTips.title")}</h2>
                            </div>
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                                <TipItem text={t("expertTips.tip1")} />
                                <TipItem text={t("expertTips.tip2")} />
                                <TipItem text={t("expertTips.tip3")} />
                                <TipItem text={t("expertTips.tip4")} />
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                    <HelpCircle className="text-indigo-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">{t("faq.title")}</h2>
                            </div>
                            <div className="space-y-4">
                                <FAQItem question={t("faq.q1")} answer={t("faq.a1")} />
                                <FAQItem question={t("faq.q2")} answer={t("faq.a2")} />
                                <FAQItem question={t("faq.q3")} answer={t("faq.a3")} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Supported Brands / Palettes */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-400 mb-12 uppercase tracking-[0.2em]">{t("hero.brandCompat") || "Pro Palette Compatibility"}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60">
                        <BrandLogo name="Perler" />
                        <BrandLogo name="Artkal" />
                        <BrandLogo name="Hama" />
                        <BrandLogo name="Nabbi" />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="relative py-32 bg-slate-900 overflow-hidden mx-6 rounded-[3rem] mb-12 group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                        Ready to make <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Your Own Patterns?</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
                        Join 50k+ bead artists using our free perler bead patterns tool today. No registration required.
                    </p>
                    <Link
                        href="/convert-photo-to-beads/editor"
                        className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-bold text-2xl hover:bg-slate-50 transition-all hover:scale-105 shadow-2xl inline-flex items-center gap-4 no-underline"
                    >
                        {t("hero.cta")}
                        <ChevronRight size={24} className="text-indigo-600" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

function BrandLogo({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-default group">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 group-hover:border-indigo-200 transition-colors" />
            <span className="text-3xl font-black text-slate-300 group-hover:text-slate-900 transition-colors">{name}</span>
        </div>
    )
}

function ComparisonSlider() {
    const [sliderPos, setSliderPos] = useState(50);
    const [beadCanvas, setBeadCanvas] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    // 100% 复刻 Editor 的 ImageSizeModal 图片转拼豆逻辑
    useEffect(() => {
        const img = new (window as any).Image();
        img.crossOrigin = "anonymous";
        img.src = "/transformar-foto-em-desenho-anime-online.webp";
        img.onload = () => {
            // === Step 1: 像素采样（和 ImageSizeModal 完全一致）===
            const sampleCanvas = document.createElement("canvas");
            const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
            if (!sampleCtx) return;

            // 保持原图比例，宽度用 58（2块标准板 29×2）
            const gridW = 116;
            const rawH = Math.round((img.height / img.width) * gridW);
            // 向上取整到 29 的倍数（和 Editor 一样）
            const boardSize = 29;
            const gridH = Math.ceil(rawH / boardSize) * boardSize;

            sampleCanvas.width = gridW;
            sampleCanvas.height = gridH;

            // 关键！Editor 用 imageSmoothingEnabled = false 做像素精准采样
            sampleCtx.imageSmoothingEnabled = false;
            sampleCtx.drawImage(img, 0, 0, gridW, rawH);

            const imageData = sampleCtx.getImageData(0, 0, gridW, gridH);
            const data = imageData.data;

            // === Step 2: 颜色匹配（和 ImageSizeModal 的 findClosestColor 完全一致）===
            // 先建造 id→color 的查找表
            const colorMap = new Map(PALETTE.map((p) => [p.id, p.color]));

            // 生成 grid（和 Editor 一模一样的数据结构）
            type GridRow = (string | null)[];
            const grid: GridRow[] = Array(gridH).fill(null).map(() => Array(gridW).fill(null));

            for (let y = 0; y < gridH; y++) {
                for (let x = 0; x < gridW; x++) {
                    const idx = (y * gridW + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const a = data[idx + 3];

                    // 和 Editor 一模一样的 alpha 阈值：200
                    if (a > 200) {
                        const closest = findClosestColor(r, g, b, PALETTE);
                        grid[y][x] = closest.id;
                    }
                }
            }

            // === Step 3: Canvas 渲染（和 Editor 主画布渲染逻辑完全一致）===
            const outputCanvas = document.createElement("canvas");
            const outputCtx = outputCanvas.getContext("2d");
            if (!outputCtx) return;

            // 使用和 Editor 完全一样的 CELL_SIZE = 20
            const cellSize = CELL_SIZE; // 20px
            outputCanvas.width = gridW * cellSize;
            outputCanvas.height = gridH * cellSize;

            // 白色底板
            outputCtx.fillStyle = "#ffffff";
            outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

            // 逐珠绘制（完全复刻 Editor 的 getDetailedBeadCanvas 印章模式）
            grid.forEach((row, y) => {
                row.forEach((cellId, x) => {
                    if (cellId) {
                        const color = colorMap.get(cellId);
                        if (color) {
                            const beadStamp = getDetailedBeadCanvas(color, cellSize);
                            const cx = x * cellSize + cellSize / 2;
                            const cy = y * cellSize + cellSize / 2;
                            outputCtx.drawImage(
                                beadStamp,
                                cx - (cellSize + 6) / 2,
                                cy - (cellSize + 6) / 2
                            );
                        }
                    }
                });
            });

            // 补画网格线（和 Editor 的 showGrid 模式一致）
            outputCtx.strokeStyle = "rgba(0, 0, 0, 0.08)";
            outputCtx.lineWidth = 1;
            outputCtx.beginPath();
            for (let x = 0; x <= outputCanvas.width; x += cellSize) {
                outputCtx.moveTo(x, 0);
                outputCtx.lineTo(x, outputCanvas.height);
            }
            for (let y = 0; y <= outputCanvas.height; y += cellSize) {
                outputCtx.moveTo(0, y);
                outputCtx.lineTo(outputCanvas.width, y);
            }
            outputCtx.stroke();

            setBeadCanvas(outputCanvas.toDataURL());
        };
    }, []);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPos(percent);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        handleMove(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging.current) {
            handleMove(e.clientX);
        }
    };

    useEffect(() => {
        const handleUp = () => { isDragging.current = false; };
        window.addEventListener('pointerup', handleUp);
        return () => window.removeEventListener('pointerup', handleUp);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative cursor-ew-resize select-none overflow-hidden bg-slate-100"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
        >
            {/* Original Image (Left) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-[10px] rounded-lg font-black uppercase tracking-widest border border-white/10">
                    Original Artwork
                </div>
                <div className="relative w-full h-full">
                    <Image
                        src="/transformar-foto-em-desenho-anime-online.webp"
                        alt="Original Anime Art"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Pattern Image (Right) */}
            <div
                className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-white"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
                <div className="absolute top-6 right-6 z-30 px-3 py-1.5 bg-indigo-600 text-white text-[10px] rounded-lg font-black uppercase tracking-widest shadow-xl">
                    Pattern Preview
                </div>

                <div className="relative w-full h-full flex items-center justify-center">
                    {beadCanvas ? (
                        <img
                            src={beadCanvas}
                            alt="Generated Bead Pattern"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-widest">Generating Pattern...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-[0_0_40px_rgba(0,0,0,0.4)] flex items-center justify-center active:scale-x-125 transition-transform"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
                <div className="w-12 h-12 bg-white rounded-2xl shadow-2xl border-[3px] border-indigo-600 flex flex-col items-center justify-center gap-1.5 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
                    <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={14} />
            </div>
            <span className="text-slate-700 font-bold">{text}</span>
        </div>
    )
}

function CategoryItem({ icon, label, highlighted = false }: { icon: React.ReactNode, label: string, highlighted?: boolean }) {
    return (
        <div className={`p-4 xl:p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center gap-4 text-center min-h-[160px] ${highlighted ? 'bg-indigo-50 border-indigo-100 ring-2 ring-indigo-500/10' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm shadow-slate-200/50'}`}>
            <div className={`text-3xl ${highlighted ? 'text-indigo-600' : 'text-slate-400'}`}>
                {icon}
            </div>
            <span className={`text-[13px] xl:text-sm font-bold leading-snug break-words max-w-full italic px-1 ${highlighted ? 'text-indigo-700' : 'text-slate-700'}`}>
                {label}
            </span>
        </div>
    )
}

function FeatureInfo({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-6">
            <div className="shrink-0 w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-xl">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
            </div>
        </div>
    )
}

function InventoryRow({ color, name, code, count, bags }: { color: string, name: string, code: string, count: string, bags: string }) {
    return (
        <div className="flex items-center justify-between text-sm py-2">
            <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border border-slate-100" style={{ backgroundColor: color }} />
                <span className="font-medium text-slate-700">{name}</span>
            </div>
            <div className="flex items-center gap-8 text-slate-500 font-mono text-xs">
                <span>{code}</span>
                <span className="font-bold text-slate-900 w-12 text-right">{count}</span>
                <span className="text-indigo-600 font-bold w-12 text-right">{bags} Bag</span>
            </div>
        </div>
    )
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="text-center relative">
            <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-2xl font-black text-slate-900 mx-auto mb-6 shadow-sm relative z-10">
                {number}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}

function TipItem({ text }: { text: string }) {
    return (
        <div className="flex gap-4">
            <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mt-0.5">
                <CheckCircle2 size={16} />
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">{text}</p>
        </div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <details className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:border-slate-300">
            <summary className="p-6 cursor-pointer flex items-center justify-between list-none">
                <h3 className="text-lg font-bold text-slate-900 pr-4">{question}</h3>
                <ChevronRight size={20} className="text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                {answer}
            </div>
        </details>
    );
}
