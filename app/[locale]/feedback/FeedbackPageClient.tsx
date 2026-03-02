"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { MessageSquare, X, Twitter, Linkedin, Facebook, Share2 } from "lucide-react";

export default function FeedbackPageClient({ locale }: { locale: string }) {
    const isEs = locale === "es";
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // 社交分享链接逻辑
    useEffect(() => {
        const shareLinksContainer = document.getElementById('social-share-links');
        if (shareLinksContainer) {
            const pageUrl = encodeURIComponent(window.location.href);
            const links = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
                twitter: `https://twitter.com/intent/tweet?url=${pageUrl}`,
                reddit: `https://www.reddit.com/submit?url=${pageUrl}`,
                linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}`,
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

    // 弹窗逻辑
    const openModal = () => {
        setIsFeedbackOpen(true);
        document.body.style.overflow = 'hidden';

        // 打开弹窗时，手动触发弹窗内 ID 的渲染
        setTimeout(() => {
            // @ts-ignore
            if (window.renderCusdis) {
                const modalTarget = document.getElementById('cusdis_thread_modal');
                if (modalTarget) {
                    // @ts-ignore
                    window.renderCusdis(modalTarget);
                }
            }
        }, 100);
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        setIsFeedbackOpen(false);
    };

    return (
        <>
            <main className="flex-grow">
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                                {isEs ? "Comparte tu Opinión" : "Share Your Feedback"}
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                {isEs
                                    ? "¿Tienes una sugerencia, una pregunta o quieres reportar un error? Nos encantaría escucharte."
                                    : "Have a suggestion, a question, or a bug to report? We'd love to hear from you."
                                }
                            </p>
                        </div>

                        {/* 页面主体反馈框 */}
                        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xl">
                            <div
                                id="cusdis_thread"
                                data-host="https://cusdis.com"
                                data-app-id="4535a28e-08e9-411e-9c74-0f118e22c1af"
                                data-page-id={`feedback-page-main-${locale}`}
                                data-page-url={`https://connectthedotsprintable.online${isEs ? '/es' : ''}/feedback/`}
                                data-page-title={isEs ? "Feedback Main (ES)" : "Feedback Main (EN)"}
                                data-theme="light">
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 悬浮按钮 */}
            <button
                className="fixed bottom-6 right-6 bg-[#4f46e5] text-white font-semibold flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-[90] p-4 group"
                onClick={openModal}
            >
                <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="hidden md:inline ml-2">{isEs ? "Feedback" : "Feedback"}</span>
            </button>

            {/* 弹窗 */}
            {isFeedbackOpen && (
                <div className="fixed inset-0 bg-black/70 z-[100] flex justify-center items-center p-4 backdrop-blur-sm" onClick={closeModal}>
                    <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                        <header className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">{isEs ? "Feedback de la Comunidad" : "Community Feedback"}</h2>
                            <button className="text-gray-400 hover:text-gray-800 transition-colors" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </header>

                        <div className="overflow-y-auto flex-grow">
                            {/* 弹窗内的反馈框容器，使用不同的 ID */}
                            <div
                                id="cusdis_thread_modal"
                                data-host="https://cusdis.com"
                                data-app-id="4535a28e-08e9-411e-9c74-0f118e22c1af"
                                data-page-id={`feedback-modal-${locale}`}
                                data-page-title={isEs ? "Feedback Modal (ES)" : "Feedback Modal (EN)"}
                                data-theme="light"
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-brand-dark text-slate-400 py-16 text-sm border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-slate-800 pb-12 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-white font-bold text-lg uppercase">
                                Connectthedotsprintable
                            </div>
                            <p className="leading-relaxed">
                                {isEs ? "Tu fuente de dibujos de unir puntos de alta calidad." : "Your source for high-quality, free connect the dots printables."}
                            </p>
                            <div className="mt-4">
                                <a href="https://dang.ai/" target="_blank" rel="noopener noreferrer">
                                    <Image src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png" alt="Dang.ai" width={150} height={54} />
                                </a>
                            </div>
                            <div className="mt-6 flex items-center gap-3">
                                <span className="text-white font-bold text-xs uppercase tracking-widest">{isEs ? "Idioma:" : "Language:"}</span>
                                <Link href="/feedback/" className={!isEs ? "text-brand-blue font-bold" : "hover:text-white transition"}>English</Link>
                                <span className="text-slate-600">|</span>
                                <Link href="/es/feedback/" className={isEs ? "text-brand-blue font-bold" : "hover:text-white transition"}>Español</Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">{isEs ? "Fichas" : "Printables"}</h3>
                            <ul className="space-y-3">
                                <li><Link href={isEs ? "/es/" : "/"} className="hover:text-white transition">{isEs ? "Inicio" : "Home"}</Link></li>
                                <li><Link href="/printable-connect-the-dots/" className="hover:text-white transition">{isEs ? "Todas las Fichas" : "All Printables"}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Legal</h3>
                            <ul className="space-y-3">
                                <li><Link href="/privacy/" className="hover:text-white transition">{isEs ? "Privacidad" : "Privacy Policy"}</Link></li>
                                <li><Link href="/terms/" className="hover:text-white transition">{isEs ? "Términos" : "Terms of Service"}</Link></li>
                                <li><Link href="/feedback/" className="text-brand-blue font-bold">{isEs ? "Feedback" : "Feedback"}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 my-4" id="social-share-links">
                        <a href="#" className="flex items-center text-white font-semibold px-4 py-2 rounded-md bg-[#1DA1F2]" aria-label="Share on Twitter"><Twitter className="w-5 h-5 mr-2" /> Twitter</a>
                        <a href="#" className="flex items-center text-white font-semibold px-4 py-2 rounded-md bg-[#0A66C2]" aria-label="Share on LinkedIn"><Linkedin className="w-5 h-5 mr-2" /> LinkedIn</a>
                        <a href="#" className="flex items-center text-white font-semibold px-4 py-2 rounded-md bg-[#1877F2]" aria-label="Share on Facebook"><Facebook className="w-5 h-5 mr-2" /> Facebook</a>
                        <a href="#" className="flex items-center text-white font-semibold px-4 py-2 rounded-md bg-[#FF4500]" aria-label="Share on Reddit"><Share2 className="w-5 h-5 mr-2" /> Reddit</a>
                    </div>
                    <div className="text-center text-xs opacity-50">
                        <p>&copy; 2026 ConnectTheDotsPrintable.online. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ====================================================================
                INLINE CUSDIS SCRIPT (REPLACES cusdis.es.js)
                ==================================================================== */}
            <Script id="cusdis-core-logic" strategy="afterInteractive">
                {`
                (function() {
                    window.CUSDIS = {};

                    // 1. Iframe Content Generator
                    const makeIframeContent = (target) => {
                        const host = target.dataset.host || "https://cusdis.com";
                        const iframeJsPath = target.dataset.iframe || \`\${host}/js/iframe.umd.js\`;
                        
                        // Custom CSS inside Iframe
                        const customCss = \`
                            :root { color-scheme: light; }
                            body { background-color: transparent !important; color: #374151 !important; font-family: system-ui, sans-serif; padding: 0.5rem; }
                            textarea, input {
                                background-color: #fff !important; border: 1px solid #e5e7eb !important;
                                color: #374151 !important; border-radius: 0.5rem !important; padding: 0.75rem !important;
                                width: 100% !important; box-sizing: border-box; font-size: 0.9rem;
                            }
                            textarea:focus, input:focus {
                                border-color: #4F46E5 !important; ring: 2px solid #4F46E5 !important; outline: none;
                            }
                            button[type="submit"] {
                                background-color: #4F46E5 !important; color: white !important; font-weight: 600;
                                border-radius: 0.5rem; padding: 0.5rem 1.5rem; border: none; cursor: pointer;
                                margin-top: 1rem;
                            }
                            /* Reply Styles */
                            #comments .my-4 { border-top: 1px solid #f3f4f6; padding-top: 1rem; margin-top: 1rem; }
                        \`;

                        return \`<!DOCTYPE html>
                        <html>
                        <head>
                            <base target="_parent" />
                            <script>
                                window.CUSDIS_LOCALE = \${JSON.stringify(window.CUSDIS_LOCALE)}
                                window.__DATA__ = \${JSON.stringify(target.dataset)}
                            <\\/script>
                            <style>\${customCss}</style>
                        </head>
                        <body>
                            <div id="root"></div>
                            <script src="\${iframeJsPath}" type="module"><\\/script>
                            <script>
                                // Auto resize logic
                                const sendHeight = () => {
                                    const height = document.body.scrollHeight;
                                    window.parent.postMessage(JSON.stringify({ from: 'cusdis', event: 'resize', data: height }), '*');
                                };
                                window.addEventListener('load', sendHeight);
                                const observer = new MutationObserver(sendHeight);
                                observer.observe(document.body, { childList: true, subtree: true });
                            <\\/script>
                        </body>
                        </html>\`;
                    };

                    // 2. Iframe Creation
                    function createIframe(target) {
                        const iframe = document.createElement("iframe");
                        iframe.style.width = "100%";
                        iframe.style.border = "0";
                        iframe.style.overflow = "hidden";
                        iframe.style.minHeight = "400px"; // Default height
                        
                        // Listen for resize events from inside iframe
                        window.addEventListener("message", (e) => {
                            try {
                                const msg = JSON.parse(e.data);
                                if (msg.from === "cusdis" && msg.event === "resize") {
                                    iframe.style.height = msg.data + "px";
                                }
                            } catch (err) {}
                        });

                        iframe.srcdoc = makeIframeContent(target);
                        return iframe;
                    }

                    // 3. Render Function (Exposed)
                    window.renderCusdis = function(target) {
                        if (target) {
                            target.innerHTML = "";
                            const iframe = createIframe(target);
                            target.appendChild(iframe);
                        }
                    };

                    // 4. Initial Load
                    window.CUSDIS.initial = function() {
                        const target = document.querySelector("#cusdis_thread");
                        if (target) {
                            window.renderCusdis(target);
                        }
                    };
                    
                    // Run initial on script load
                    if (document.readyState === "complete") {
                        window.CUSDIS.initial();
                    } else {
                        window.addEventListener("load", window.CUSDIS.initial);
                    }

                })();
                `}
            </Script>
        </>
    );
}