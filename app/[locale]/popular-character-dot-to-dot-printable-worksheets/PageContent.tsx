"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { PrintableItem } from "@/lib/printables-data";

type ThemeSummary = {
    label: string;
    count: number;
    sample: PrintableItem[];
};

type Props = {
    themeSummary: ThemeSummary[];
};

export default function PageContent({ themeSummary }: Props) {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // 社交分享链接动态生成逻辑
    useEffect(() => {
        const shareLinksContainer = document.getElementById('social-share-links');
        if (shareLinksContainer) {
            const pageUrl = encodeURIComponent(window.location.href);
            const links = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=Free Connect the Dots Generator & Printable Worksheets`,
                twitter: `https://twitter.com/intent/tweet?url=${pageUrl}&text=Free Connect the Dots Generator & Printable Worksheets`,
                reddit: `https://www.reddit.com/submit?url=${pageUrl}&title=Free Connect the Dots Generator & Printable Worksheets`,
                linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=Free Connect the Dots Generator & Printable Worksheets`,
            };

            const setHref = (ariaLabel: string, url: string) => {
                const el = shareLinksContainer.querySelector(`a[aria-label="${ariaLabel}"]`) as HTMLAnchorElement;
                if (el) el.href = url;
            };

            setHref("Share on Facebook", links.facebook);
            setHref("Share on Twitter", links.twitter);
            setHref("Share on Reddit", links.reddit);
            setHref("Share on LinkedIn", links.linkedin);
        }
    }, []);

    // 反馈弹窗开关逻辑
    const openModal = () => {
        setIsFeedbackOpen(true);
        document.body.style.overflow = 'hidden';
        // @ts-ignore
        if (window.CUSDIS && window.CUSDIS.initial && !document.querySelector('#cusdis_thread iframe')) {
            requestAnimationFrame(() => {
                // @ts-ignore
                window.CUSDIS.initial();
            });
        }
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        setIsFeedbackOpen(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFeedbackOpen) {
                closeModal();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFeedbackOpen]);

    return (
        <>
            <main>
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 bg-white shadow-xl rounded-xl p-6 md:p-10 text-gray-800">

                    {/* H1 */}
                    <h1 className="text-3xl lg:text-5xl font-extrabold mb-8 text-center text-gray-900 leading-tight">
                        More Than Just Lines: The Ultimate Guide to <span className="text-primary">Connect the Dots for Kids</span>
                    </h1>

                    {/* 引言部分 */}
                    <p className="text-lg leading-relaxed mb-6 text-gray-700">
                        For decades, <strong className="text-primary">connect the dots</strong> puzzles have been a staple in
                        classrooms and homes alike. What might look like a simple game of drawing lines is actually a powerful
                        developmental tool. In this guide, we&apos;ll explore how <strong className="text-primary">dot to dots for
                            kids</strong> bridge the gap between play and essential skill-building, and why they remain one of
                        the most effective ways to combine learning with fun.
                    </p>

                    {/* 插图 1 */}
                    <figure className="my-10 flex flex-col items-center">
                        <img src="/images/kids-learning-dot-to-dot.png"
                            alt="Children engaging with connect the dot worksheets in a classroom"
                            className="rounded-2xl shadow-lg w-full max-w-3xl" />
                        <figcaption className="mt-4 text-sm text-gray-500 italic">Connecting the dots helps children develop
                            patience and concentration.</figcaption>
                    </figure>

                    {/* H2: 益处分析 */}
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">The Surrounding Science: Why Dots Connect to
                        Learning</h2>
                    <p className="mb-6">
                        When a child picks up a pencil to <strong className="text-primary">print dots</strong> and connect them,
                        their brain is working overtime. It&apos;s not just about the final picture; it&apos;s about the journey of the
                        line.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                            <h3 className="text-xl font-bold mb-2">1. Fine Motor Mastery</h3>
                            <p className="text-gray-600 text-sm">Tracing from one point to another strengthens the small muscles in
                                the hand and wrist, preparing children for handwriting and drawing.</p>
                        </div>
                        <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-500">
                            <h3 className="text-xl font-bold mb-2">2. Numerical Literacy</h3>
                            <p className="text-gray-600 text-sm"><strong className="text-primary">Connect the dot worksheets</strong>
                                reinforce counting skills. Children learn the sequence of numbers in a visual, tactile way that
                                sticks.</p>
                        </div>
                    </div>

                    {/* H2: 在线与打印的对比 */}
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">Digital vs. Paper: Which One Should You
                        Choose?</h2>
                    <p className="mb-4 text-gray-700">
                        Parents often ask whether they should use <strong
                            className="text-primary">online dot to dots exercises</strong> or stick to traditional <strong
                                className="text-primary">printable pages</strong>. The truth is, both have unique advantages:
                    </p>

                    <ul className="list-none space-y-4 mb-10">
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✔</span>
                            <span><strong>The Online Advantage:</strong> <strong className="text-primary">Online dot to dots for
                                kids</strong> provide instant feedback and require zero cleanup — great for a quick activity
                                between other tasks.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✔</span>
                            <span><strong>The Printable Advantage:</strong> When you <strong className="text-primary">print connect
                                the dots</strong>, you&apos;re encouraging &quot;pencil-to-paper&quot; time, which is crucial for reducing
                                screen time and improving tactile focus.</span>
                        </li>
                    </ul>

                    {/* H2: 按主题浏览 — 真实数据驱动，不含任何第三方版权角色 */}
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">Explore Dot to Dot Worksheets by Theme</h2>
                    <p className="mb-6">
                        The best way to keep a child engaged is to offer themes they already love. Browse our free collection
                        organized by theme — every puzzle below is a real, downloadable worksheet from our library.
                    </p>

                    <div className="bg-gray-50 p-8 rounded-2xl mb-12">
                        <h4 className="text-lg font-bold mb-6 text-center text-gray-600 uppercase tracking-widest">Browse by Theme</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {themeSummary.map((theme) => (
                                <Link
                                    key={theme.label}
                                    href="/printable-connect-the-dots/"
                                    className="block text-center bg-white rounded-xl p-5 border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <h5 className="font-bold text-indigo-600 mb-1">{theme.label}</h5>
                                    <p className="text-sm text-gray-500">{theme.count} free {theme.count === 1 ? "worksheet" : "worksheets"}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* H2: 关于如何使用的建议 */}
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800">How to Use These Worksheets Effectively
                    </h2>
                    <p className="mb-6">
                        To get the most out of <strong className="text-primary">connect the dot worksheets</strong>, we recommend
                        starting with low-count puzzles (1-20 dots) and gradually increasing the difficulty. Our vehicle and
                        animal themed puzzles include options with higher dot counts for kids who are ready for a bigger
                        challenge.
                    </p>

                    {/* 结尾 CTA */}
                    <div className="p-8 bg-brand-blue rounded-3xl text-center shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4 text-white">Start Connecting the Dots Today</h2>
                        <p className="mb-8 max-w-2xl mx-auto text-white">
                            Whether you&apos;re a teacher looking for classroom materials or a parent seeking a rainy-day activity,
                            our collection of <strong className="text-yellow-400">dot to dots for kids</strong> is here to help your
                            child learn and grow.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/printable-connect-the-dots/"
                                className="block px-8 py-3 bg-white text-brand-blue font-bold rounded-full hover:bg-slate-100 transition">
                                EXPLORE THE FULL LIBRARY
                            </Link>
                            <Link href="/"
                                className="block px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition">
                                TRY ONLINE EXERCISES
                            </Link>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}
