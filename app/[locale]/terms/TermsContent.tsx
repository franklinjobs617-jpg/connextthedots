"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";

export default function TermsContent() {
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

    // 延迟加载 AdSense
    useEffect(() => {
        const loadAds = () => {
            if (scriptsLoaded) return;
            setScriptsLoaded(true);

            const adScript = document.createElement('script');
            adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3383070348689557';
            adScript.async = true;
            adScript.crossOrigin = 'anonymous';
            document.head.appendChild(adScript);
        };

        const userEvents = ["mousemove", "scroll", "keydown", "touchstart", "click"];
        const handler = () => {
            loadAds();
            userEvents.forEach(e => window.removeEventListener(e, handler));
        };

        userEvents.forEach(e => window.addEventListener(e, handler, { passive: true }));
        const timer = setTimeout(loadAds, 5000);

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
            {/* Terms of Service Content */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold mb-8">
                        Terms of Service
                    </h1>
                    <p className="text-gray-600 mb-6">Last updated: July 15, 2023</p>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">
                                Acceptance of Terms
                            </h2>
                            <p className="text-gray-600">
                                By accessing or using ConnectTheDotsPrintable.online (the
                                &quot;Website&quot;), you agree to be bound by these Terms of Service
                                (&quot;Terms&quot;). If you do not agree to these Terms, please do not use
                                the Website.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">
                                Use of the Website
                            </h2>
                            <p className="text-gray-600 mb-4">
                                You may use the Website only for lawful purposes and in accordance
                                with these Terms. You agree not to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                                <li>
                                    Use the Website in any way that violates any applicable federal,
                                    state, local, or international law or regulation
                                </li>
                                <li>
                                    Upload or transmit any material that contains viruses or any
                                    other computer code, files, or programs designed to interrupt,
                                    destroy, or limit the functionality of any computer software or
                                    hardware
                                </li>
                                <li>
                                    Attempt to gain unauthorized access to any portion or feature of
                                    the Website
                                </li>
                                <li>
                                    Engage in any conduct that restricts or inhibits anyone&apos;s use or
                                    enjoyment of the Website
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">
                                Intellectual Property
                            </h2>
                            <p className="text-gray-600 mb-4">
                                The Website and its original content, features, and functionality
                                are owned by ConnectTheDotsPrintable.online and are protected by
                                international copyright, trademark, patent, trade secret, and
                                other intellectual property or proprietary rights laws.
                            </p>
                            <p className="text-gray-600 mb-4">
                                You are granted a limited, non-exclusive, non-transferable,
                                revocable license to use the Website and download connect the dots
                                printables for personal and educational purposes only.
                            </p>
                            <p className="text-gray-600">
                                Commercial use of any materials from the Website without our prior
                                written permission is strictly prohibited.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">
                                User-Generated Content
                            </h2>
                            <p className="text-gray-600 mb-4">
                                When you upload or create content using our generator, you retain
                                all rights to your content. However, you grant us a worldwide,
                                royalty-free, non-exclusive license to use, display, and
                                distribute your content solely for the purpose of providing the
                                services of the Website.
                            </p>
                            <p className="text-gray-600">
                                You represent and warrant that you own or have the necessary
                                licenses to use any content you upload to the Website.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">
                                Disclaimer of Warranties
                            </h2>
                            <p className="text-gray-600 mb-4">
                                The Website is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
                                ConnectTheDotsPrintable.online makes no representations or
                                warranties of any kind, express or implied, as to the operation of
                                the Website or the information, content, materials, or products
                                included on the Website.
                            </p>
                            <p className="text-gray-600">
                                To the full extent permissible by applicable law,
                                ConnectTheDotsPrintable.online disclaims all warranties, express
                                or implied, including but not limited to, implied warranties of
                                merchantability and fitness for a particular purpose.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">
                                Limitation of Liability
                            </h2>
                            <p className="text-gray-600">
                                ConnectTheDotsPrintable.online shall not be liable for any damages
                                of any kind arising from the use of this Website, including but
                                not limited to direct, indirect, incidental, punitive, and
                                consequential damages, unless otherwise specified in writing.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">Changes to Terms</h2>
                            <p className="text-gray-600">
                                We reserve the right to modify or replace these Terms at any time.
                                If a revision is material, we will provide at least 30 days&apos;
                                notice prior to any new terms taking effect. What constitutes a
                                material change will be determined at our sole discretion.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">Governing Law</h2>
                            <p className="text-gray-600">
                                These Terms shall be governed by and construed in accordance with
                                the laws of the State of [Your State], without regard to its
                                conflict of law principles.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-dark">Contact Us</h2>
                            <p className="text-gray-600">
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <p className="text-gray-600 font-medium mt-2">
                                support@connectthedotsprintable.online
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}