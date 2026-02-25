"use client";

import { useState, useRef, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import {
    Globe,
    Heart,
    Menu,
    X,
    LogOut,
    Loader2,
    Zap,
    Crown
} from "lucide-react";
export default function Header() {
    const LinkArr = [
        {
            labelKey: "home",
            href: "/",
        }, {
            labelKey: "allPrintables",
            href: "/printable-connect-the-dots",
        }, {
            labelKey: "pricing",
            href: "/pricing",
        }, {
            labelKey: "howToMake",
            href: "/how-to-make",
        }
    ]
    const t = useTranslations("header");
    const pathname = usePathname(); // 获取当前纯净路径（不含语言前缀）
    const { user, isLoggedIn, login, logout, isLoggingIn } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const UserProfileUI = () => (
        <div className="relative" ref={profileMenuRef}>
            <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
                <span className="text-xs font-bold text-slate-700 hidden sm:block">
                    {user?.name}
                </span>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white ring-1 ring-slate-100 shadow-sm">
                    {user?.picture ? (
                        <Image src={user?.picture} alt="Avatar" className="w-full h-full object-cover" width={32} height={32} />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs">U</div>
                    )}
                </div>
            </button>

            {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[60] flex flex-col transform origin-top-right transition-all animate-in fade-in scale-95 duration-200">

                    {/* 1. 账户基本信息 */}
                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="font-bold text-slate-800 truncate">
                            {user?.name}
                        </div>
                        <div className=" text-slate-500 truncate mt-0.5">
                            {user?.email}
                        </div>
                    </div>

                    {/* 2. 资产与订阅面板 */}
                    <div className="px-4 py-3 border-b border-slate-50 space-y-3">
                        {/* 会员等级 */}
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 flex items-center gap-1.5 text-md">
                                <Crown size={14} className={user?.plan === 'premium' ? 'text-amber-500' : 'text-slate-400'} />
                                Plan
                            </span>
                            {user?.plan === 'premium' ? (
                                <span className="font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 uppercase tracking-wider">
                                    Premium
                                </span>
                            ) : (
                                <span className="font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider">
                                    Free
                                </span>
                            )}
                        </div>

                        {/* 剩余积分 */}
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 flex items-center gap-1.5 text-md">
                                <Zap size={14} className="text-brand-blue" />
                                Credits
                            </span>
                            <span className="text-sm font-bold text-brand-blue">
                                {user?.credits || "0"}
                            </span>
                        </div>

                        {/* 促单升级按钮 (仅对免费用户显示) */}
                        {user?.plan !== 'premium' && (
                            <div className="pt-2">
                                <Link
                                    href="/pricing"
                                    onClick={() => setShowProfileMenu(false)}
                                    className="flex items-center justify-center w-full py-2 bg-gradient-to-r from-brand-blue to-indigo-600 text-white  font-bold rounded-lg hover:shadow-md hover:scale-[1.02] transition-all"
                                >
                                    Upgrade to Premium
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 3. 退出登录 */}
                    <button
                        onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-4 text-md font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                        <LogOut size={16} />
                        <span>{t("signOut")}</span>
                    </button>
                </div>
            )}
        </div>
    );

    const LanguageDropdown = ({ className = "" }: { className?: string }) => {
        // 1. 增加一个状态控制显示
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = useRef<HTMLDivElement>(null);

        // 2. 点击外部自动关闭（可选但推荐）
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        return (
            <div className={`relative ${className}`} ref={dropdownRef}>
                {/* 改为 button 并绑定 onClick */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{t("langName")}</span>
                </button>

                {/* 根据状态显示，而不是 group-hover */}
                {isOpen && (
                    <div className="absolute right-0 top-full pt-2 w-[140px] z-[70]">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
                            <Link
                                href={pathname}
                                locale="en"
                                onClick={() => setIsOpen(false)} // 点击后关闭
                                className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 no-underline"
                            >
                                English (EN)
                            </Link>
                            <Link
                                href={pathname}
                                locale="es"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 no-underline"
                            >
                                Español (ES)
                            </Link>
                            <Link
                                href={pathname}
                                locale="de"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 no-underline"
                            >
                                Deutsch (DE)
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        );
    };
    return (
        <header className="relative w-full">
            <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center z-50 bg-white/90 backdrop-blur-md sticky top-0 border-b border-gray-100 transition-all duration-300">

                <Link href="/" className="flex items-center gap-2 group no-underline">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-brand-blue bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                        <Image src="/logo.png" width={24} height={24} alt={t("logoAlt")} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-brand-text">
                        {t("logo")}
                    </span>
                </Link>

                <div className="lg:hidden ml-auto mr-4 flex items-center gap-3">
                    <LanguageDropdown />
                </div>

                <button onClick={toggleMenu} className="lg:hidden text-slate-600 hover:text-brand-blue p-1 transition-colors">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">

                    {LinkArr.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="hover:text-brand-blue transition-colors no-underline"
                        >
                            {t(item.labelKey)}
                        </Link>
                    ))}
                    <LanguageDropdown />


                    {isLoggedIn ? (
                        <div className="flex items-center gap-3 ml-2">
                            <UserProfileUI />
                        </div>
                    ) : (
                        <button
                            onClick={login}
                            disabled={isLoggingIn}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2 rounded-full transition-all active:scale-95 ml-2"
                        >
                            {isLoggingIn ? <Loader2 size={16} className="animate-spin" /> : t("login")}
                        </button>
                    )}
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-gray-100 p-4 fixed top-[69px] left-0 w-full z-40 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-4 font-medium text-slate-600">


                        {LinkArr.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="hover:text-brand-blue no-underline"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {/* @ts-ignore */}
                                {t(item.labelKey)}
                            </Link>
                        ))}
                        {isLoggedIn && (
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                <Image src={user?.picture || ''} alt="Avatar" className="w-10 h-10 rounded-full" width={40} height={40} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                                    <span className="text-xs text-slate-500">{user?.email}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-3 pt-2">


                            {isLoggedIn ? (
                                <button
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="flex items-center gap-2 px-4 py-2 text-red-500 font-bold"
                                >
                                    <LogOut size={18} />
                                    <span>{t("signOut")}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => { login(); setIsMobileMenuOpen(false); }}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-center"
                                >
                                    {isLoggingIn ? <Loader2 size={18} className="animate-spin mx-auto" /> : t("login")}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}