"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    Shapes,
    Twitter,
    Linkedin,
    Facebook,
    Share2
} from "lucide-react";

export default function Footer() {
    const t = useTranslations("footer");
    const pricing = useTranslations("header");

    return (
        <footer className="bg-brand-dark text-slate-400 py-16 text-sm border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-slate-800 pb-12 mb-8">

                    {/* 第一列: 信息与语言选择 */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-white">
                            <Shapes className="text-brand-blue w-6 h-6" />
                            <span className="font-bold text-lg">Connectthedotsprintable</span>
                        </div>
                        <p className="leading-relaxed">
                            {t("description")}
                        </p>
                        <div className="mt-4">
                            <a href="https://dang.ai/" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png"
                                    alt="Dang.ai"
                                    className="w-[150px] h-[54px]"
                                    width={150}
                                    height={54}
                                />
                            </a>
                        </div>

                        {/* 语言切换器 */}
                        <div className="mt-6 flex items-center gap-3">
                            <span className="text-white font-bold text-xs uppercase tracking-widest">{t("language")}:</span>
                            <Link href="/" className="hover:text-white transition font-bold">English</Link>
                            <span className="text-slate-600">|</span>
                            <Link href="/es" className="hover:text-white transition">Español</Link>
                            <span className="text-slate-600">|</span>
                            <Link href="/de" className="hover:text-white transition">Deutsch</Link>
                        </div>
                    </div>

                    {/* 第二列: Printables 链接 */}
                    <div>
                        <div className="text-white font-bold mb-4 uppercase tracking-wider text-xs">{t("colPrintables")}</div>
                        <ul className="space-y-3">
                            <li><Link href="/" className="hover:text-white transition">{t("home")}</Link></li>
                            <li><Link href="/printable-connect-the-dots" className="hover:text-white transition">{t("allPrintables")}</Link></li>
                            <li><Link href="/how-to-make" className="hover:text-white transition">{t("howToMake")}</Link></li>
                            <li><Link href="/christmas-printables" className="hover:text-white transition">{t("christmas")}</Link></li>
                        </ul>
                    </div>

                    {/* 第三列: 法律条款 */}
                    <div>
                        <div className="text-white font-bold mb-4 uppercase tracking-wider text-xs">{t("colLegal")}</div>
                        <ul className="space-y-3">
                            <li><Link href="/privacy" className="hover:text-white transition">{t("privacy")}</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition">{t("terms")}</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition">{pricing("pricing")}</Link></li>
                            < li > <Link href="/popular-character-dot-to-dot-printable-worksheets" className="hover:text-white transition">{t("popularCharacter")}</Link></li>
                            <li><Link href="/free-animal-dot-to-dot-printables-pdf" className="hover:text-white transition">{t("animalPdf")}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* 社交分享按钮区 */}
                <div className="flex flex-wrap justify-center gap-3 my-4" id="social-share-links">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                        className="flex items-center text-white font-semibold px-4 py-2 rounded-md transition-opacity duration-200 hover:opacity-90 bg-[#1DA1F2]">
                        <Twitter className="w-5 h-5" />
                        <span className="ml-2">Twitter</span>
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
                        className="flex items-center text-white font-semibold px-4 py-2 rounded-md transition-opacity duration-200 hover:opacity-90 bg-[#0A66C2]">
                        <Linkedin className="w-5 h-5" />
                        <span className="ml-2">LinkedIn</span>
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                        className="flex items-center text-white font-semibold px-4 py-2 rounded-md transition-opacity duration-200 hover:opacity-90 bg-[#1877F2]">
                        <Facebook className="w-5 h-5" />
                        <span className="ml-2">Facebook</span>
                    </a>
                    <a href="https://www.reddit.com" target="_blank" rel="noopener noreferrer"
                        className="flex items-center text-white font-semibold px-4 py-2 rounded-md transition-opacity duration-200 hover:opacity-90 bg-[#FF4500]">
                        <Share2 className="w-5 h-5" />
                        <span className="ml-2">Reddit</span>
                    </a>
                </div>

                {/* 版权信息 */}
                <div className="text-center text-xs">
                    <p>&copy; 2026 ConnectTheDotsPrintable.online. {t("rights")}</p>
                    <p className="mt-2 opacity-50">{t("disclaimer")}</p>
                </div>
            </div>
        </footer>
    );
}