"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import {
    MessageSquare,
    X,
    Dog,
    Bird,
    Fish,
    MousePointer2,
    CheckCircle2,
    GraduationCap,
    Printer,
    Twitter,
    Linkedin,
    Facebook,
    Share2
} from "lucide-react";

export default function AnimalContent() {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);

    // 社交分享链接逻辑
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

    // 延迟加载脚本 (GTM, AdSense)
    useEffect(() => {
        const loadThirdPartyScripts = () => {
            if (scriptsLoaded) return;
            setScriptsLoaded(true);

            // GTM
            const gtagScript = document.createElement('script');
            gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-CM76E2ZP8E';
            gtagScript.async = true;
            gtagScript.onload = () => {
                // @ts-ignore
                window.dataLayer = window.dataLayer || [];
                // @ts-ignore
                function gtag() { window.dataLayer.push(arguments); }
                // @ts-ignore
                gtag('js', new Date());
                // @ts-ignore
                gtag('config', 'G-CM76E2ZP8E');
            };
            document.head.appendChild(gtagScript);

            // AdSense
            const adScript = document.createElement('script');
            adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3383070348689557';
            adScript.async = true;
            adScript.crossOrigin = 'anonymous';
            document.head.appendChild(adScript);
        };

        const userEvents = ["mousemove", "scroll", "keydown", "touchstart", "click"];
        const handler = () => {
            loadThirdPartyScripts();
            userEvents.forEach(e => window.removeEventListener(e, handler));
        };

        userEvents.forEach(e => window.addEventListener(e, handler, { passive: true }));
        const timer = setTimeout(loadThirdPartyScripts, 5000);

        return () => {
            clearTimeout(timer);
            userEvents.forEach(e => window.removeEventListener(e, handler));
        };
    }, [scriptsLoaded]);

    // 反馈弹窗逻辑
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

    return (
        <>
            <main className="bg-slate-50 py-10">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 bg-white shadow-xl rounded-xl p-6 md:p-10 text-gray-800">

                    <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                        Free <span className="text-brand-blue">Animal Dot to Dot Printables</span> & Connect the Dots PDF Worksheets
                    </h1>

                    <p className="text-lg mb-6 text-gray-700">
                        Looking for a fun, educational way to keep your little ones engaged? Our massive collection of <strong
                            className="text-brand-blue">animal dot to dot printables</strong> is the perfect solution. Whether they
                        love cuddly pets or wild predators, our <strong className="text-brand-blue">free printable connect the dots
                            animal worksheets</strong> help children develop fine motor skills and number recognition while
                        having a blast.
                    </p>

                    <figure className="my-8 flex flex-col items-center">
                        <img src="/images/animal-dot-to-dot-hero.png"
                            alt="A collection of various animal dot to dot worksheets"
                            className="rounded-lg shadow-md w-full max-w-2xl" />
                        <figcaption className="mt-2 text-center text-sm text-gray-600 italic">
                            From domestic pets to wild creatures, explore our <strong className="text-brand-blue">PDF dot to dot animal
                                worksheets</strong>.
                        </figcaption>
                    </figure>

                    <h2 className="text-2xl font-bold border-b-2 border-brand-blue inline-block mb-4">Explore Our Animal Kingdom: Subject-Specific Puzzles</h2>
                    <p className="mb-6">
                        Unlike generic sites, we offer specific animal themes to match your child&apos;s interests. Click the links
                        below to download individual <strong className="text-brand-blue">connect the dots for kids</strong>:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="p-4 border border-gray-100 rounded-lg hover:bg-indigo-50 transition group">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Dog className="w-5 h-5 text-brand-blue" />
                                <Link href="/printable-connect-the-dots/" className="text-brand-blue hover:underline">Husky – Dot-to-Dot Activity</Link>
                            </h3>
                            <p className="text-sm text-gray-600">Connect 1-50 to reveal this loyal canine friend.</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-lg hover:bg-indigo-50 transition group">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Bird className="w-5 h-5 text-brand-blue" />
                                <Link href="/printable-connect-the-dots/" className="text-brand-blue hover:underline">Bat – Free Printable Worksheet</Link>
                            </h3>
                            <p className="text-sm text-gray-600">A perfect spooky-themed activity for Halloween or nature study.</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-lg hover:bg-indigo-50 transition group">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Fish className="w-5 h-5 text-brand-blue" />
                                <Link href="/printable-connect-the-dots/" className="text-brand-blue hover:underline">Megalodon – Prehistoric Animal</Link>
                            </h3>
                            <p className="text-sm text-gray-600">A challenging puzzle for fans of ancient sea creatures.</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-lg hover:bg-indigo-50 transition group">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Bird className="w-5 h-5 text-brand-blue" />
                                <Link href="/printable-connect-the-dots/" className="text-brand-blue hover:underline">Ostrich – Printable Dot-to-Dot</Link>
                            </h3>
                            <p className="text-sm text-gray-600">Learn about the world&apos;s largest bird while counting dots.</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <GraduationCap className="text-brand-blue" /> The Educational Benefits
                    </h2>
                    <div className="bg-green-50 p-6 rounded-lg mb-8 border-l-4 border-green-500">
                        <p className="mb-4">
                            Our <strong className="text-brand-blue">educational dot to dot resources</strong> are more than just games.
                            They are foundational tools for:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> <p><strong className="text-gray-800">Hand-Eye Coordination:</strong> Precise line drawing improves grip and control.</p></li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> <p><strong className="text-gray-800">Number Sequencing:</strong> Reinforces counting from 1 to 100 and beyond.</p></li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> <p><strong className="text-gray-800">Concentration:</strong> Completing a <strong className="text-brand-blue">hard animal dot to dot</strong> requires focus and patience.</p></li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">Choose Your Challenge: Easy to Hard</h2>
                    <p className="mb-4 text-gray-700">
                        We provide <strong className="text-brand-blue">connect the dots for adults</strong> as well as toddlers. Our
                        puzzles are categorized by dot count:
                    </p>
                    <figure className="my-8 flex flex-col items-center">
                        <img src="/images/difficulty-levels-comparison.png"
                            alt="Comparison of simple and complex animal dot to dot"
                            className="rounded-lg shadow-md w-full max-w-3xl" />
                        <figcaption className="mt-2 text-center text-sm text-gray-600 italic">
                            From simple outlines to intricate <strong className="text-brand-blue">hard animal connect the dots for adults</strong>.
                        </figcaption>
                    </figure>

                    <div className="p-6 rounded-lg my-8 bg-yellow-50 border-l-4 border-yellow-400">
                        <h3 className="text-xl font-semibold text-yellow-800 mb-2">A Teacher&apos;s Perspective</h3>
                        <p className="italic text-gray-700">
                            &quot;I use the Megalodon and Snake worksheets in my 2nd-grade science class. It’s the only time the
                            classroom goes completely silent! The kids are so eager to see what animal is hidden behind the
                            numbers.&quot; — <strong>Mrs. Sarah K., Elementary Educator</strong>
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-red-700 flex items-center gap-2">
                        <Printer /> How to Print Your PDF Activity Sheets
                    </h2>
                    <ul className="space-y-4 mb-8">
                        <li className="bg-gray-50 p-4 rounded border flex gap-3 items-center">
                            <span className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold shrink-0">1</span>
                            <span>Select your favorite animal from our category list.</span>
                        </li>
                        <li className="bg-gray-50 p-4 rounded border flex gap-3 items-center">
                            <span className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold shrink-0">2</span>
                            <span>Click the &quot;Download PDF&quot; button to open the high-resolution file.</span>
                        </li>
                        <li className="bg-gray-50 p-4 rounded border flex gap-3 items-center">
                            <span className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold shrink-0">3</span>
                            <span>In your printer settings, choose <span className="font-mono bg-gray-200 px-1">"Fit to Page"</span>.</span>
                        </li>
                    </ul>

                    {/* Internal Links */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 my-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Explore More Printables</h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <Link href="/connect-the-dots-coloring-pages/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group">
                                <h3 className="font-semibold text-brand-blue group-hover:underline">Connect the Dots Coloring Pages</h3>
                                <p className="text-sm text-gray-600 mt-1">Two-in-one activity: connect dots then color the revealed picture.</p>
                            </Link>
                            <Link href="/connect-the-dots-1-to-10/" className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group">
                                <h3 className="font-semibold text-brand-blue group-hover:underline">Connect the Dots 1 to 10</h3>
                                <p className="text-sm text-gray-600 mt-1">Easy worksheets for toddlers and preschoolers learning to count.</p>
                            </Link>
                        </div>
                    </div>

                    <div className="p-8 rounded-lg text-center my-8 bg-blue-600 text-white shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Connecting?</h2>
                        <p className="mb-6 text-blue-100">
                            Download our &quot;Ultimate 50-Animal Bundle&quot; PDF for free and start your journey through the animal kingdom today!
                        </p>
                        <Link href="/printable-connect-the-dots/"
                            className="inline-block px-10 py-4 bg-white text-blue-600 font-extrabold rounded-full hover:bg-yellow-400 transition transform hover:scale-105 shadow-lg">
                            DOWNLOAD FREE ANIMAL BUNDLE (PDF)
                        </Link>
                    </div>
                </div>
            </main>



        </>
    );
}

// 辅助组件 (内部使用)
function Shapes({ className, size = 24 }: { className?: string; size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M4.5 16.5c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-11c-1.1 0-2 .9-2 2v9Z" /><path d="M10 10l4 4" /><path d="M14 10l-4 4" />
        </svg>
    );
}