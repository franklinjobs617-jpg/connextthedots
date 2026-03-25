"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { MessageSquare, X, Filter, Clock, Heart, ChevronRight } from "lucide-react";
import { useTranslations } from 'next-intl';
import PrintableCard from "@/components/PrintableCard";
import UserPuzzleCard from "./components/UserPuzzleCard"; // 之前创建的卡片组件

export default function PrintableListClient({ locale, data, allItems }: any) {
    const t = useTranslations('printablePage');
    const [activeFilter, setActiveFilter] = useState("all");
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [userPuzzles, setUserPuzzles] = useState([]);

    // 1:1 还原 list-page-logic.js 的渲染逻辑
    const displayedItems = useMemo(() => {
        if (activeFilter === "all") {
            // 这里的随机打乱在服务端和客户端不一致会报错，故固定取前12个，或在 useEffect 里 shuffle
            return allItems.slice(0, 12);
        }
        return data[activeFilter] || [];
    }, [activeFilter, data, allItems]);

    // 合并静态和动态数据
    const allPuzzles = useMemo(() => {
        // 将动态数据转换为与静态数据相同的格式
        const formattedUserPuzzles = userPuzzles.map((puzzle: any) => ({
            id: puzzle.slug,
            title: puzzle.title,
            description: puzzle.description,
            imageUrl: puzzle.puzzleImageUrl,
            imageSrcset: `${puzzle.puzzleImageUrl} 600w`,
            solutionUrl: puzzle.puzzleImageUrl, // 假设 solutionUrl 与 puzzleImageUrl 相同
            solutionAltText: `${puzzle.title} solution`,
            dotRange: [1, puzzle.dotCount],
            difficulty: puzzle.difficulty,
            category: [], // 动态数据可能没有分类
            ageRecommendation: "All Ages", // 动态数据可能没有年龄推荐
            popularity: 0, // 动态数据可能没有 popularity
            altText: puzzle.title,
            detailPage: `/printables/${puzzle.slug}`,
            tagColor: "bg-brand-blue"
        }));
        
        // 合并静态和动态数据
        return [...allItems, ...formattedUserPuzzles];
    }, [allItems, userPuzzles]);

    // 动态 JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": t('pageTitle'),
        "url": `https://connectthedotsprintable.online/${locale === 'en' ? '' : locale + '/'}printable-connect-the-dots/`,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": displayedItems.length,
            "itemListElement": displayedItems.map((item: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://connectthedotsprintable.online${item.detailPage}`,
                "name": item.title
            }))
        }
    };




    // 筛选器点击处理
    const handleFilter = (filter: string) => {
        setActiveFilter(filter.replace('difficulty-', ''));
    };

    useEffect(() => {
        fetch('/api/connect-dots/gallery?limit=12')
            .then(res => res.json())
            .then(data => setUserPuzzles(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <style jsx global>{`
        .filter-btn.active { background-color: #4f46e5; color: white; }
        .filter-btn.active .indicator-dot { background-color: white; }
      `}</style>

            <main className="flex-grow relative w-full mx-auto bg-slate-50">
                {/* 1. Page Header */}
                <section className="relative bg-slate-900 pt-16 pb-12 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                    </div>

                    <div className="container max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
                        <div className="max-w-4xl mx-auto md:mx-0">
                            <div className="text-sm font-medium text-slate-400 mb-6 flex items-center justify-center md:justify-start gap-2">
                                <Link href={`/${locale === 'en' ? '' : locale + '/'}`} className="hover:text-white transition-colors">
                                    {t('breadcrumbHome')}
                                </Link>
                                <ChevronRight size={12} className="opacity-50" />
                                <span className="text-brand-blue">
                                    {t('breadcrumbAll')}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-400">
                                    {t('pageTitle')}
                                </span>
                            </h1>

                            <p className="text-md text-left text-slate-300 leading-relaxed mb-6">
                                {t('pageDescription')}
                            </p>

                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400 bg-slate-800/50 inline-flex px-4 py-2 rounded-full border border-slate-700">
                                <Clock size={16} className="text-brand-blue" />
                                {t('lastUpdated')}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Main Content Area */}
                <section className="py-16 md:py-24">
                    <div className="container max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-12">

                            {/* Sidebar: Filters */}
                            <aside className="lg:w-1/4 flex-shrink-0">
                                <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 sticky top-24">
                                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-brand-blue">
                                            <Filter size={16} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800">
                                            {t('filters')}
                                        </h2>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                                            {t('difficultyLevel')}
                                        </h3>

                                        {[
                                            { id: 'all', label: t('allLevels'), dot: true },
                                            { id: 'easy', label: t('easy'), badge: '1-20', color: 'bg-green-100 text-green-700' },
                                            { id: 'medium', label: t('medium'), badge: '20-50', color: 'bg-yellow-100 text-yellow-700' },
                                            { id: 'hard', label: t('hard'), badge: '50-100', color: 'bg-purple-100 text-purple-700' },
                                            { id: 'extreme', label: t('extreme'), badge: '100+', color: 'bg-red-100 text-red-700' },
                                        ].map((f) => (
                                            <button
                                                key={f.id}
                                                className={`filter-btn group w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 flex justify-between items-center ${activeFilter === f.id ? 'active' : 'bg-white border border-slate-100 hover:bg-indigo-50 hover:text-brand-blue text-slate-600'}`}
                                                onClick={() => setActiveFilter(f.id)}
                                            >
                                                <span>{f.label}</span>
                                                {f.dot ? (
                                                    <span className="indicator-dot w-2 h-2 rounded-full bg-brand-blue"></span>
                                                ) : (
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeFilter === f.id ? 'bg-white/20 text-white' : f.color}`}>{f.badge}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            {/* Content Grid */}
                            <div className="lg:w-3/4">
                                <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-200 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-brand-dark">
                                            {t('allPrintables')}
                                        </h2>
                                        <p className="text-slate-500 mt-1">
                                            {t('showingResults', { count: displayedItems.length, total: allItems.length })}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-8">
                                    {displayedItems.map((item: any, index: number) => (
                                        <PrintableCard key={item.id} item={item} priority={index < 3} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Community Gallery Section - 已合并到主网格中，不再单独显示 */}

                {/* 3. Bottom CTA */}
                <section className="py-16 bg-white border-t border-slate-100">
                    <div className="container max-w-7xl mx-auto px-6">
                        <div className="bg-indigo-50 rounded-[2.5rem] p-8 md:p-16 border border-indigo-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                                <div className="md:w-1/2">
                                    <span className="text-brand-blue font-bold tracking-wider uppercase text-xs mb-3 block">
                                        {t('customTools')}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-6">
                                        {t('cantFindDesign')}
                                    </h2>
                                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                        {t('createCustom')}
                                    </p>
                                    <Link href={`/${locale === 'en' ? '' : locale + '/'}`} className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-all">
                                        <span>{t('tryGenerator')}</span>
                                    </Link>
                                </div>
                                <div className="md:w-1/2">
                                    <div className="relative group">
                                        <Image
                                            src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/800/8-Process-of-Making-Custom-Connect-the-Dots-Printables-Using-a-Generator-Tool.avif"
                                            alt="Preview" width={800} height={600} className="rounded-2xl shadow-floating border border-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Feedback Button */}
            <button
                className="fixed bottom-6 right-6 bg-brand-blue text-white p-4 rounded-full shadow-lg z-[90] hover:scale-105 transition-all"
                onClick={() => setIsFeedbackOpen(true)}
            >
                <MessageSquare size={24} />
            </button>

            {/* Feedback Modal */}
            {isFeedbackOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4" onClick={() => setIsFeedbackOpen(false)}>
                    <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-gray-400" onClick={() => setIsFeedbackOpen(false)}><X size={24} /></button>
                        <h2 className="text-xl font-bold mb-4">
                            {t('communityFeedback')}
                        </h2>
                        <div id="cusdis_thread" data-host="https://cusdis.com" data-app-id="4535a28e-08e9-411e-9c74-0f118e22c1af" data-page-id={`list-page-${locale}`} data-theme="light"></div>
                    </div>
                </div>
            )}
        </>
    );
}