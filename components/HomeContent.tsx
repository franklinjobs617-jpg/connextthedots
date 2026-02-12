"use client";
import { useState } from 'react';
import type { Metadata } from "next";

import { useTranslations } from "next-intl";
import React from "react";
import DotGeneratorClient from "@/components/DotGeneratorClient";
import Image from 'next/image';
import { getAlternates, getUrl } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
type Props = {
    params: { locale: string };
};


export default function HomeContent() {
    // Translations based on your provided JSON structure
    const tHero = useTranslations("hero");
    const tHowToGuide = useTranslations("howToGuide");
    const tCategories = useTranslations("categories");
    const tEditorPicks = useTranslations("editorPicks");
    const tFeatures = useTranslations("features");
    const tDemo = useTranslations("demo");
    const tPrintingGuide = useTranslations("printingGuide");
    const tFaq = useTranslations("faq");
    const tContact = useTranslations("contact");

    // NOTE: These namespaces were not in your provided JSON, 
    // but are required for the "Custom Generator" section and "Editor" view found in the HTML.
    // Please add these keys to your en.json/es.json/de.json files.
    const tCustomGen = useTranslations("customGenerator");
    const tEditor = useTranslations("editor");
    type PresetType = 'easy' | 'medium' | 'hard';

    const [activePreset, setActivePreset] = useState<PresetType>('easy');

    const presetMapping: Record<PresetType, string> = {
        easy: "presetDesc.easy",
        medium: "presetDesc.medium",
        hard: "presetDesc.hard"
    };
    const handlePresetChange = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLElement).closest('[data-preset]');
        if (target) {
            const preset = target.getAttribute('data-preset') as PresetType;
            setActivePreset(preset);
        }
    };

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // FAQ 数据列表（对应你 JSON 里的 q1, a1...）
    const faqItems = [
        { q: "q1", a: "a1" },
        { q: "q2", a: "a2" },
        { q: "q3", a: "a3" },
        { q: "q4", a: "a4" },
        { q: "q5", a: "a5" },
    ];


    const handleSliderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sliderValue = e.target.value;
        const beforeLayer = document.getElementById("hero-before-layer");
        const handle = document.getElementById("hero-handle");
        if (beforeLayer) {
            beforeLayer.style.clipPath = `inset(0 ${100 - parseInt(sliderValue)}% 0 0)`;
        }
        if (handle) {
            handle.style.left = `${sliderValue}%`;
        }
    };

    return (
        <main className="flex-grow relative w-full mx-auto">
            {/* ========================================= */}
            {/* VIEW 1: LANDING PAGE */}
            {/* ========================================= */}
            <div id="landing-view" className="transition-opacity duration-300">

                {/* 1. Hero Section */}
                <section className="hero-bg w-full relative">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 lg:pb-16">
                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

                            <div className="lg:w-1/2 text-center lg:text-left z-10 flex flex-col items-center lg:items-start">
                                <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-wider text-brand-blue bg-indigo-50 rounded-full border border-indigo-100">
                                    {tHero("badge")}
                                </div>
                                <h1 className="font-extrabold leading-[1.1] mb-4 text-4xl md:text-5xl text-transparent bg-clip-text bg-linear-to-r from-brand-blue to-brand-purple">
                                    {tHero("titleMain")}   {tHero("titleHighlight")}
                                </h1>

                                <h2 className="text-sm text-slate-500 mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                    {tHero("subtitle")}
                                </h2>

                                <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-20">
                                    <div className="p-2 bg-slate-50 border-b border-slate-100">
                                        <div className="relative flex w-full bg-slate-200/60 p-1 rounded-xl">
                                            <div
                                                id="tab-bg"
                                                className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                            ></div>

                                            <button
                                                id="tab-upload"
                                                className="relative z-10 w-1/2 py-2.5 text-sm font-bold text-slate-800 transition-colors flex justify-center items-center gap-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    viewBox="0 0 576 512"
                                                >
                                                    <path d="M144 480c-79.5 0-144-64.5-144-144 0-63.4 41-117.2 97.9-136.5-1.3-7.7-1.9-15.5-1.9-23.5 0-79.5 64.5-144 144-144 55.4 0 103.5 31.3 127.6 77.1 14.2-8.3 30.8-13.1 48.4-13.1 53 0 96 43 96 96 0 15.7-3.8 30.6-10.5 43.7 44 20.3 74.5 64.7 74.5 116.3 0 70.7-57.3 128-128 128l-304 0zM305 191c-9.4-9.4-24.6-9.4-33.9 0l-72 72c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l31-31 0 102.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-102.1 31 31c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-72-72z" />
                                                </svg>
                                                {tHero("tabUpload")}
                                            </button>

                                            <button
                                                id="tab-ai"
                                                className="relative z-10 w-1/2 py-2.5 text-sm font-bold text-slate-500 transition-colors flex justify-center items-center gap-2"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    viewBox="0 0 576 512"
                                                >
                                                    <path d="M263.4-27L278.2 9.8 315 24.6c3 1.2 5 4.2 5 7.4s-2 6.2-5 7.4L278.2 54.2 263.4 91c-1.2 3-4.2 5-7.4 5s-6.2-2-7.4-5L233.8 54.2 197 39.4c-3-1.2-5-4.2-5-7.4s2-6.2 5-7.4L233.8 9.8 248.6-27c1.2-3 4.2-5 7.4-5s6.2 2 7.4 5zM110.7 41.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7L59.8 164.2 9.7 142.7C3.8 140.2 0 134.4 0 128s3.8-12.2 9.7-14.7L59.8 91.8 81.3 41.7C83.8 35.8 89.6 32 96 32s12.2 3.8 14.7 9.7zM464 304c6.4 0 12.2 3.8 14.7 9.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7l-21.5-50.1-50.1-21.5c-5.9-2.5-9.7-8.3-9.7-14.7s3.8-12.2 9.7-14.7l50.1-21.5 21.5-50.1c2.5-5.9 8.3-9.7 14.7-9.7zM460 0c11 0 21.6 4.4 29.5 12.2l42.3 42.3C539.6 62.4 544 73 544 84s-4.4 21.6-12.2 29.5l-88.2 88.2-101.3-101.3 88.2-88.2C438.4 4.4 449 0 460 0zM44.2 398.5L308.4 134.3 409.7 235.6 145.5 499.8C137.6 507.6 127 512 116 512s-21.6-4.4-29.5-12.2L44.2 457.5C36.4 449.6 32 439 32 428s4.4-21.6 12.2-29.5z" />
                                                </svg>
                                                {tHero("tabAi")}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 min-h-[160px] flex flex-col justify-center">
                                        {/* MODE A: UPLOAD DROP ZONE */}
                                        <div id="panel-upload" className="tab-panel active w-full h-full">
                                            <button
                                                id="hero-upload-btn"
                                                className="relative group w-full h-32 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl hover:bg-indigo-50 hover:border-indigo-400 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-blue shadow-sm group-hover:scale-110 transition-transform">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        fill="currentColor"
                                                        viewBox="0 0 576 512"
                                                    >
                                                        <path d="M144 480c-79.5 0-144-64.5-144-144 0-63.4 41-117.2 97.9-136.5-1.3-7.7-1.9-15.5-1.9-23.5 0-79.5 64.5-144 144-144 55.4 0 103.5 31.3 127.6 77.1 14.2-8.3 30.8-13.1 48.4-13.1 53 0 96 43 96 96 0 15.7-3.8 30.6-10.5 43.7 44 20.3 74.5 64.7 74.5 116.3 0 70.7-57.3 128-128 128l-304 0zM305 191c-9.4-9.4-24.6-9.4-33.9 0l-72 72c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l31-31 0 102.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-102.1 31 31c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-72-72z" />
                                                    </svg>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-brand-blue font-bold text-lg">
                                                        {tHero("uploadCta")}
                                                    </span>
                                                    <span className="text-slate-400 text-sm">
                                                        {tHero("uploadHint")}
                                                    </span>
                                                    <br />
                                                </div>
                                                <input
                                                    type="file"
                                                    id="hero-file-input"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    aria-label="Upload Image File"
                                                />
                                            </button>

                                            <div className="mt-6 text-center lg:text-left w-full">
                                                <p className="text-sm font-bold text-slate-400 mb-3">
                                                    {tHero("noImageLabel")}
                                                </p>
                                                <div
                                                    className="flex justify-center lg:justify-start gap-4"
                                                    id="examples-content"
                                                >
                                                    <button
                                                        className="preset-btn w-auto h-auto md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-white shadow-md hover:border-brand-blue transition-all transform hover:scale-110"
                                                        data-src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/cartoon-animal-dog-dot-to-dot-generator-hd.webp"
                                                        aria-label="Use Corgi Example"
                                                    >
                                                        <Image width="200" height="200"
                                                            src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/cartoon-animal-dog-dot-to-dot-generator.webp"
                                                            className="w-full h-full object-cover"
                                                            alt="Cute cartoon corgi puppy puzzle created with our free dot to dot generator"
                                                        />
                                                    </button>
                                                    <button
                                                        className="preset-btn w-auto h-auto md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-white shadow-md hover:border-brand-blue transition-all transform hover:scale-110"
                                                        data-src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/cupcake-illustration-connect-the-dots-maker-hd.webp"
                                                        aria-label="Use Cupcake Example"
                                                    >
                                                        <Image width="200" height="200"
                                                            src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/cupcake-illustration-connect-the-dots-maker.webp"
                                                            alt="Simple cupcake connect the dots maker for easy kids worksheets"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                    <button
                                                        className="preset-btn w-auto h-auto md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-white shadow-md hover:border-brand-blue transition-all transform hover:scale-110"
                                                        data-src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/realistic-animal-custom-dot-to-dot-generator-printable-hd.webp"
                                                        aria-label="Use Shiba Inu Example"
                                                    >
                                                        <Image width="200" height="200"
                                                            src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/realistic-animal-custom-dot-to-dot-generator-printable.webp"
                                                            alt="Realistic Shiba Inu dog animal worksheet generated by the Printable connect the dots maker online"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>

                                                    <button
                                                        className="preset-btn w-auto h-auto md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-white shadow-md hover:border-brand-blue transition-all transform hover:scale-110"
                                                        data-src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/statue-of-liberty-dot-to-dot-generator-hd.webp"
                                                        aria-label="Statue of Liberty (Educational Mode)"
                                                    >
                                                        <Image width="200" height="200"
                                                            src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/statue-of-liberty-dot-to-dot-generator.webp"
                                                            alt="Statue of Liberty photo for dot to dot maker"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MODE B: AI INPUT */}
                                        <div id="panel-ai" className="tab-panel inactive w-full">
                                            <div className="flex flex-col gap-3">
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <svg
                                                            className="h-5 w-5 text-slate-400"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="hero-ai-input"
                                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                                        placeholder={tHero("aiPlaceholder")}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="text-sm text-slate-500 font-medium pl-1">
                                                        <span
                                                            id="hero-ai-credits"
                                                            className="font-bold text-brand-blue"
                                                        >
                                                            1
                                                        </span>{" "}
                                                        {tHero("aiCredits")}
                                                    </div>

                                                    <button
                                                        id="hero-ai-go-btn"
                                                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                                    >
                                                        <span>{tHero("aiButton")}</span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            viewBox="0 0 512 512"
                                                        >
                                                            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 w-full flex justify-center perspective-1000">
                                <div className="relative w-full max-w-lg aspect-square rounded-[2.5rem] shadow-floating bg-white p-3 transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-slate-100">
                                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-100 group">
                                        <Image
                                            src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/result-cupcake-illustration-connect-the-dots-maker.webp"
                                            className="absolute inset-0 w-full h-full object-cover"
                                            width="500"
                                            height="500"
                                            alt="Result from Connect the Dots Generator"
                                        />
                                        <div
                                            id="hero-before-layer"
                                            className="absolute inset-0 w-full h-full overflow-hidden border-r-4 border-white"
                                            style={{ clipPath: "inset(0 50% 0 0)" }}
                                        >
                                            <Image
                                                src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/cupcake-illustration-connect-the-dots-maker-hd.webp"
                                                className="absolute inset-0 w-full h-full object-cover"
                                                width="500"
                                                height="500"
                                                alt="Original Photo for Dot to Dot Generator"
                                            />
                                        </div>
                                        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold pointer-events-none">
                                            {tHero("sliderOriginal")}
                                        </div>
                                        <div className="absolute bottom-6 right-6 bg-brand-blue/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none">
                                            {tHero("sliderPuzzle")}
                                        </div>
                                        <div
                                            id="hero-handle"
                                            className="absolute inset-y-0 left-1/2 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                                        >
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-blue shadow-lg">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 576 512"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                >
                                                    <path d="M470.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l41.4 41.4-357.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-41.4-41.4 357.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            defaultValue="50"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                                            aria-label="Compare original image with dot-to-dot result"
                                        // onInput={handleSliderInput}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. How-To Guide Section */}
                <section
                    id="how-to-guide"
                    className="py-24 bg-white relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full hero-bg opacity-20 pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-12 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                                {tHowToGuide("title")}
                            </h2>
                            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                                {tHowToGuide("subtitle")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                            <div className="group flex flex-col items-center text-center">
                                <div className="relative w-full mb-8 rounded-3xl overflow-hidden border-[6px] border-slate-50 shadow-xl group-hover:shadow-2xl group-hover:border-indigo-50 transition-all duration-500 hover:-translate-y-2">
                                    <Image width="350" height="500"
                                        src="/images/upload-photo-to-connect-the-dots-generator.webp"
                                        alt="Uploading a photo to the free online connect the dots generator"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                                        <span className="text-brand-blue font-black text-xl">
                                            1
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-blue transition-colors">
                                    {tHowToGuide("step1Title")}
                                </h3>
                                <p className="text-slate-500 leading-relaxed px-4">
                                    {tHowToGuide("step1Desc")}
                                </p>
                            </div>
                            <div className="group flex flex-col items-center text-center">
                                <div className="relative w-full mb-8 rounded-3xl overflow-hidden border-[6px] border-slate-50 shadow-xl group-hover:shadow-2xl group-hover:border-indigo-50 transition-all duration-500 hover:-translate-y-2">
                                    <Image width="350" height="500"
                                        src="/images/adjust-difficulty-settings-for-dot-to-dot-maker.webp"
                                        alt="Adjusting difficulty levels"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                                        <span className="text-brand-blue font-black text-xl">
                                            2
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-blue transition-colors">
                                    {tHowToGuide("step2Title")}
                                </h3>
                                <p className="text-slate-500 leading-relaxed px-4">
                                    {tHowToGuide("step2Desc")}
                                </p>
                            </div>
                            <div className="group flex flex-col items-center text-center">
                                <div className="relative w-full mb-8 rounded-3xl overflow-hidden border-[6px] border-slate-50 shadow-xl group-hover:shadow-2xl group-hover:border-indigo-50 transition-all duration-500 hover:-translate-y-2">
                                    <Image width="350" height="500"
                                        src="/images/download-printable-connect-the-dots-pdf-worksheet.webp"
                                        alt="Downloading PDF"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
                                        <span className="text-brand-blue font-black text-xl">
                                            3
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-blue transition-colors">
                                    {tHowToGuide("step3Title")}
                                </h3>
                                <p className="text-slate-500 leading-relaxed px-4">
                                    {tHowToGuide("step3Desc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Categories */}
                <section id="categories" className="py-24 bg-brand-light">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-2">
                                    {tCategories("title")}
                                </h2>
                                <p className="text-slate-500">{tCategories("subtitle")}</p>
                            </div>
                            <a
                                href="/printable-connect-the-dots"
                                className="group flex items-center font-bold text-brand-blue hover:text-indigo-700 transition"
                            >
                                {tCategories("viewAll")}{" "}
                                <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <a
                                href="./printables/core"
                                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all"
                            >
                                <Image
                                    src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/2-Colorful-Connect-the-Dots-for-Kids-Simple-Animal-and-Cartoon-Characters-1-20-dots.avif"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    width="400"
                                    height="400"
                                    alt="Kids"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                                    <h3 className="text-white font-bold text-xl mb-1">
                                        {tCategories("card1Title")}
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        {tCategories("card1Desc")}
                                    </p>
                                </div>
                            </a>
                            <a
                                href="./printables/adults"
                                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all"
                            >
                                <Image
                                    src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/3-Intricate-Connect-the-Dots-Mandala-for-Adults-Over-100-dots.avif"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    width="400"
                                    height="400"
                                    alt="Adults"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                                    <h3 className="text-white font-bold text-xl mb-1">
                                        {tCategories("card2Title")}
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        {tCategories("card2Desc")}
                                    </p>
                                </div>
                            </a>
                            <a
                                href="./printables/general"
                                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all"
                            >
                                <Image width="200" height="200"
                                    src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/4-educational-connect-the-dots-worksheet-featuring-letters-and-numbers.avif"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Educational"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                                    <h3 className="text-white font-bold text-xl mb-1">
                                        {tCategories("card3Title")}
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        {tCategories("card3Desc")}
                                    </p>
                                </div>
                            </a>
                            <a
                                href="./printables/christmas"
                                className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all"
                            >
                                <Image width="200" height="200"
                                    src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/5-Holiday-Themed-Connect-the-Dots-Christmas-Tree-and-Festive-Elements.avif"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Holiday"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                                    <h3 className="text-white font-bold text-xl mb-1">
                                        {tCategories("card4Title")}
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        {tCategories("card4Desc")}
                                    </p>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Featured Printables */}
                <section className="py-24 bg-white" id="printable-guide">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-brand-blue font-bold tracking-wider text-xs mb-2 block">
                                {tEditorPicks("badge")}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                {tEditorPicks("title")}
                            </h2>
                            <p className="text-slate-500 mt-4">{tEditorPicks("subtitle")}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Card 1: Animals */}
                            <div
                                className="group bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-floating transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden cursor-pointer"
                                onClick={() =>
                                    (window.location.href = "./printables/animals")
                                }
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <Image width="200" height="200"
                                        src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/6-Cute-Bunny-Rabbit-Connect-the-Dots-for-Young-Children-1-20-dots.avif"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt="Bunny Connect the Dots"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        {tEditorPicks("statusFree")}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex gap-2 mb-3">
                                        <span className="px-2 py-1 bg-green-50 text-green-800 text-[10px] font-bold rounded-md">
                                            {tEditorPicks("card1Tag1")}
                                        </span>
                                        <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-md">
                                            {tEditorPicks("card1Tag2")}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors">
                                        {tEditorPicks("card1Title")}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-6 flex-grow">
                                        {tEditorPicks("card1Desc")}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                            >
                                                <path d="M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                            </svg>
                                            2.5{tEditorPicks("downloads")}
                                        </span>
                                        <span className="text-sm font-bold text-brand-blue flex items-center gap-1">
                                            {tEditorPicks("getPrintable")}{" "}
                                            <svg
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Christmas */}
                            <div
                                className="group bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-floating transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden cursor-pointer"
                                onClick={() =>
                                    (window.location.href = "./printables/christmas")
                                }
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <Image width="200" height="200"
                                        src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/7-Festive-Christmas-Tree-Connect-the-Dots-Design-1-50-dots.avif"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt="Christmas Tree"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        {tEditorPicks("statusFree")}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex gap-2 mb-3">
                                        <span className="px-2 py-1 bg-yellow-50 text-yellow-800 text-[10px] font-bold rounded-md">
                                            {tEditorPicks("card2Tag1")}
                                        </span>
                                        <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-md">
                                            {tEditorPicks("card2Tag2")}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors">
                                        {tEditorPicks("card2Title")}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-6 flex-grow">
                                        {tEditorPicks("card2Desc")}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                            >
                                                <path d="M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                            </svg>
                                            1.8{tEditorPicks("downloads")}
                                        </span>
                                        <span className="text-sm font-bold text-brand-blue flex items-center gap-1">
                                            {tEditorPicks("getPrintable")}{" "}
                                            <svg
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Mandala */}
                            <div
                                className="group bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-floating transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden cursor-pointer"
                                onClick={() =>
                                    (window.location.href = "./printables/hard")
                                }
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <Image width="200" height="200"
                                        src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/8-Advanced-Mandala-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt="Mandala"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        {tEditorPicks("statusFree")}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex gap-2 mb-3">
                                        <span className="px-2 py-1 bg-purple-50 text-purple-800 text-[10px] font-bold rounded-md">
                                            {tEditorPicks("card3Tag1")}
                                        </span>
                                        <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-md">
                                            {tEditorPicks("card3Tag2")}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors">
                                        {tEditorPicks("card3Title")}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-6 flex-grow">
                                        {tEditorPicks("card3Desc")}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                            >
                                                <path d="M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                            </svg>
                                            3.2{tEditorPicks("downloads")}
                                        </span>
                                        <span className="text-sm font-bold text-brand-blue flex items-center gap-1">
                                            {tEditorPicks("getPrintable")}{" "}
                                            <svg
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* 2. Features Section (Using the JSON keys) */}
                <section id="features" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
                            {tFeatures("title")}
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto mb-16">
                            {tFeatures("subtitle")}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-3xl bg-brand-light hover:bg-white hover:shadow-floating transition-all duration-300 border border-transparent hover:border-slate-100 group">
                                <div className="w-16 h-16 bg-blue-100 text-brand-blue rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        className="text-primary"
                                    >
                                        <path d="M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">
                                    {tFeatures("f1Title")}
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {tFeatures("f1Body")}
                                </p>
                            </div>
                            {/* Feature 2 */}
                            <div className="p-8 rounded-3xl bg-brand-light hover:bg-white hover:shadow-floating transition-all duration-300 border border-transparent hover:border-slate-100 group">
                                <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        className="text-secondary"
                                    >
                                        <path d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">
                                    {tFeatures("f2Title")}
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {tFeatures("f2Body")}
                                </p>
                            </div>
                            {/* Feature 3 */}
                            <div className="p-8 rounded-3xl bg-brand-light hover:bg-white hover:shadow-floating transition-all duration-300 border border-transparent hover:border-slate-100 group">
                                <div className="w-16 h-16 bg-orange-100 text-brand-accent rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        className="text-accent"
                                    >
                                        <path d="M480.5 10.3L259.1 158c-29.1 19.4-47.6 50.9-50.6 85.3 62.3 12.8 111.4 61.9 124.3 124.3 34.5-3 65.9-21.5 85.3-50.6L565.7 95.5c6.7-10.1 10.3-21.9 10.3-34.1 0-33.9-27.5-61.4-61.4-61.4-12.1 0-24 3.6-34.1 10.3zM288 400c0-61.9-50.1-112-112-112S64 338.1 64 400c0 3.9 .2 7.8 .6 11.6 1.8 17.5-10.2 36.4-27.8 36.4L32 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0c61.9 0 112-50.1 112-112z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">
                                    {tFeatures("f3Title")}
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {tFeatures("f3Body")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* See It in Action (Video Demo) */}
                <section className="py-24 bg-slate-50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="max-w-3xl mx-auto mb-12">
                            <span className="text-brand-blue font-bold tracking-wider text-xs mb-2 block">
                                {tDemo("badge")}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                                {tDemo("title")}
                            </h2>
                            <p className="text-slate-500 text-lg">{tDemo("subtitle")}</p>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex justify-center mb-10">
                            <div
                                id="demo-tabs"
                                className="inline-flex bg-white p-1.5 rounded-full border border-slate-200 shadow-sm"
                            >
                                <button
                                    data-tab="pc"
                                    className="tab-button-tailwind px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-200 bg-brand-blue text-white shadow-md min-w-fit flex items-center gap-2"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <path d="M64 32C28.7 32 0 60.7 0 96L0 352c0 35.3 28.7 64 64 64l144 0-16 48-72 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l272 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-72 0-16-48 144 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 32zM96 96l320 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32L96 320c-17.7 0-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32z" />
                                    </svg>{" "}
                                    {tDemo("tabDesktop")}
                                </button>
                                <button
                                    data-tab="mobile"
                                    className="tab-button-tailwind px-8 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:text-slate-700 transition-all duration-200 min-w-fit flex items-center gap-2"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                    >
                                        <path d="M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM128 440c0 13.3 10.7 24 24 24l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0c-13.3 0-24 10.7-24 24zM304 64l-224 0 0 304 224 0 0-304z" />
                                    </svg>{" "}
                                    {tDemo("tabMobile")}
                                </button>
                            </div>
                        </div>

                        {/* Video Container */}
                        <div className="relative max-w-5xl mx-auto">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-[2.5rem] blur-xl opacity-70 -z-10"></div>

                            {/* PC Content */}
                            <div
                                id="pc-content"
                                className="tab-content-tailwind relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-video group"
                            >
                                <video
                                    id="demo-video-pc"
                                    className="w-full h-full object-cover"
                                    poster="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/how-to-create-custom-printable-dot-to-dot-desktop-demo.webp"
                                    controls
                                    preload="none"
                                    title="Desktop Demo"
                                >
                                    <source
                                        src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/how-to-create-custom-printable-dot-to-dot-desktop-demo.mp4"
                                        type="video/mp4"
                                    />
                                </video>

                                <div
                                    id="video-overlay"
                                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 bg-black/20 cursor-pointer z-10"
                                >
                                    <div className="w-20 h-20 bg-white/90 backdrop-blur rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(255,255,255,0.3)] text-brand-blue text-3xl transform transition-transform duration-300 hover:scale-110">
                                        <svg
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 448 512"
                                        >
                                            <path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Content */}
                            <div
                                id="mobile-content"
                                className="tab-content-tailwind hidden flex flex-col items-center justify-center pt-2"
                            >
                                <div className="relative mx-auto w-[300px] border-[8px] border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden bg-slate-800 ring-1 ring-slate-900/50">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-xl z-30 flex justify-center items-center">
                                        <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
                                    </div>

                                    <video
                                        id="demo-video-mobile"
                                        className="w-full h-full object-cover aspect-[9/19] bg-slate-900"
                                        poster="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/how-to-create-custom-printable-dot-to-dot-mobile-demo.webp"
                                        controls
                                        playsInline
                                        preload="none"
                                        title="Mobile Demo"
                                    >
                                        <source
                                            src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/image/how-to-create-custom-printable-dot-to-dot-mobile-demo.mp4"
                                            type="video/mp4"
                                        />
                                    </video>

                                    <div
                                        id="mobile-video-overlay"
                                        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/30 cursor-pointer z-20 backdrop-blur-[2px]"
                                    >
                                        <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(255,255,255,0.4)] text-brand-blue text-2xl transform transition-transform duration-300 hover:scale-110 active:scale-95">
                                            <svg
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-400 mt-8 font-medium">
                                    {tDemo("mobileHint")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Printing Guide Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-10 text-center">
                            {tPrintingGuide("title")}
                        </h2>

                        <div className="max-w-3xl mx-auto bg-light p-8 rounded-xl shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 640 640"
                                            className="text-primary mr-1"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                        >
                                            <path d="M128 128C128 92.7 156.7 64 192 64L405.5 64C422.5 64 438.8 70.7 450.8 82.7L493.3 125.2C505.3 137.2 512 153.5 512 170.5L512 208L128 208L128 128zM64 320C64 284.7 92.7 256 128 256L512 256C547.3 256 576 284.7 576 320L576 416C576 433.7 561.7 448 544 448L512 448L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 448L96 448C78.3 448 64 433.7 64 416L64 320zM192 480L192 512L448 512L448 416L192 416L192 480zM520 336C520 322.7 509.3 312 496 312C482.7 312 472 322.7 472 336C472 349.3 482.7 360 496 360C509.3 360 520 349.3 520 336z" />
                                        </svg>
                                        {tPrintingGuide("settingsTitle")}
                                    </h3>
                                    <ul className="space-y-3 text-neutral/80">
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("setting1")}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("setting2")}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("setting3")}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("setting4")}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("setting5")}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 640 640"
                                            fill="currentColor"
                                            width="24"
                                            height="24"
                                            className="mr-1 inline-block text-primary"
                                        >
                                            <path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"></path>
                                        </svg>
                                        {tPrintingGuide("tipsTitle")}
                                    </h3>
                                    <ul className="space-y-3 text-neutral/80">
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("tip1")}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("tip2")}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("tip3")}</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                                className="text-green-500 mr-2"
                                                width="30"
                                                height="30"
                                                fill="currentColor"
                                            >
                                                <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                            </svg>
                                            <span>{tPrintingGuide("tip4")}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="faq" className="py-24 bg-brand-light">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark text-center mb-12">
                            {tFaq("title")}
                        </h2>

                        <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
                            {faqItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                    itemProp="mainEntity"
                                    itemScope
                                    itemType="https://schema.org/Question"
                                >
                                    <button
                                        // 4. 绑定点击事件
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-8 py-6 text-left font-bold flex justify-between items-center text-brand-dark hover:bg-gray-50 transition focus:outline-none"
                                    >
                                        <span itemProp="name">{tFaq(item.q)}</span>
                                        <svg
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            // 5. 根据状态旋转图标
                                            className={`text-brand-blue transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""
                                                }`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 448 512"
                                        >
                                            <path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                        </svg>
                                    </button>

                                    <div
                                        // 6. 根据状态显示/隐藏内容
                                        className={`faq-content px-8 text-slate-600 leading-relaxed border-t border-gray-50 transition-all duration-300 ${activeIndex === index
                                            ? "max-h-[500px] py-8 opacity-100"
                                            : "max-h-0 py-0 opacity-0 overflow-hidden"
                                            }`}
                                        itemProp="acceptedAnswer"
                                        itemScope
                                        itemType="https://schema.org/Answer"
                                    >
                                        <p itemProp="text">{tFaq(item.a)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* 6. Newsletter / Contact Section */}
                <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "30px 30px",
                        }}
                    ></div>

                    <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-3xl font-bold mb-4">{tContact("title")}</h2>
                        <p className="text-slate-400 mb-8 text-lg">
                            {tContact("subtitle")}
                        </p>

                        <div className="flex justify-center">
                            <a
                                href="mailto:support@connectthedotsprintable.online"
                                className="inline-flex items-center gap-2 px-10 py-4 bg-brand-blue text-white font-bold rounded-full hover:bg-indigo-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    width="20"
                                    height="20"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                    />
                                </svg>
                                {tContact("button")}
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            {/* ========================================= */}
            {/* VIEW 2: EDITOR */}
            {/* ========================================= */}
            {/* This section contains the interactive editor. The HTML structure is preserved. */}
            {/* Note: In a real Next.js application, this logic (toggle views, canvas manipulation) 
          is often handled by DotGeneratorClient or React state. Since you requested to keep the structure,
          we render it here as hidden, presumably to be activated by your client-side scripts. */}
            <div
                id="editor-view"
                className="hidden w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 fade-in"
            >
                {/* Editor Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <div className="flex items-center">
                        <button
                            id="back-to-home"
                            className="text-slate-500 hover:text-brand-blue font-bold flex items-center gap-2 transition group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <svg
                                    width="14"
                                    height="14"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
                                </svg>
                            </div>
                            <span className="text-sm">{tEditor("uploadNew")}</span>
                        </button>
                    </div>

                    <div className="flex justify-end items-center gap-3">
                        <button
                            id="mobile-download-png-btn"
                            className="px-4 py-4 bg-white border border-brand-blue text-brand-blue hover:bg-indigo-50 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2 text-sm"
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                width={24}
                                height={24}
                            >
                                <path
                                    d="M928 469.333333v256c0 103.168-56.832 160-160 160H256c-103.168 0-160-56.832-160-160V298.666667c0-103.168 56.832-160 160-160h341.333333a32 32 0 0 1 0 64H256c-67.285333 0-96 28.714667-96 96v394.666666l108.373333-108.373333c16.64-16.64 43.946667-16.64 60.586667 0l40.106667 40.106667c8.106667 8.106667 21.76 8.106667 29.866666 0l210.773334-210.773334c16.64-16.64 43.946667-16.64 60.586666 0l193.706667 193.706667V469.333333a32 32 0 0 1 64 0zM341.034667 330.666667c-29.397333 0-53.034667 23.893333-53.034667 53.333333s24.064 53.333333 53.418667 53.333333a53.333333 53.333333 0 0 0 0-106.666666h-0.384z m468.352-9.386667a32.213333 32.213333 0 0 0 34.858666 6.912 31.744 31.744 0 0 0 10.368-6.912l64-64a32 32 0 0 0-45.269333-45.269333l-9.386667 9.386666V128a32 32 0 0 0-64 0v93.397333l-9.386666-9.386666a32 32 0 0 0-45.269334 45.269333l64.085334 64z"
                                    fill="#4F46E5"
                                />
                            </svg>
                            <span className="inline">{tEditor("downloadImage")}</span>
                        </button>

                        <div className="relative group">
                            <span className="absolute -top-2 -right-1 z-10 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-tighter shadow-sm border border-white">
                                {tEditor("recommended")}
                            </span>
                            <button
                                id="mobile-download-pdf-btn"
                                className="px-5 py-4 bg-brand-blue text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine"></div>
                                <svg
                                    viewBox="0 0 1024 1024"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    fill="currentColor"
                                >
                                    <path
                                        d="M207.36 891.733333V153.6h504.490667l114.176 133.205333v310.570667h51.2V282.026667a38.4 38.4 0 0 0-9.258667-24.96l-121.045333-141.269334a38.4 38.4 0 0 0-29.184-13.44H194.56a38.4 38.4 0 0 0-38.4 38.4v763.733334a38.4 38.4 0 0 0 38.4 38.4H640v-51.2H207.36z"
                                        fill="#fff"
                                    ></path>
                                    <path
                                        d="M301.653333 448.384V537.6H256v-256h73.685333c53.290667 0 79.914667 27.008 79.914667 80.981333 0 26.24-8.064 47.274667-24.192 63.146667-16.042667 15.786667-36.138667 23.296-60.288 22.613333h-23.466667z m0-124.458667V406.613333h19.754667c26.794667 0 40.234667-13.952 40.234667-41.813333 0-27.221333-13.269333-40.832-39.808-40.832h-20.224zM430.08 281.6v256h70.229333c32.085333 0 58.24-11.946667 78.506667-35.84 20.309333-24.021333 30.464-55.808 30.464-95.36 0-83.2-36.266667-124.8-108.714667-124.8H430.08z m43.52 211.413333V326.229333h23.552c19.669333 0 35.669333 7.168 47.957333 21.504 12.288 14.208 18.474667 34.048 18.474667 59.477334 0 26.325333-5.888 47.232-17.664 62.634666-11.776 15.445333-27.989333 23.168-48.64 23.168H473.6zM773.248 325.504h-89.856v64.682667h82.730667v43.861333h-82.773334V533.333333H629.76V281.6h143.488V325.546667zM794.666667 629.333333a24.021333 24.021333 0 0 0-23.978667 24.021334v208.725333l-79.061333-79.061333a23.978667 23.978667 0 1 0-33.92 33.962666l119.978666 119.936a23.893333 23.893333 0 0 0 26.154667 5.248 24.021333 24.021333 0 0 0 7.808-5.205333l120.021333-120.021333a23.978667 23.978667 0 0 0-33.962666-33.92l-79.018667 79.061333v-208.725333a24.021333 24.021333 0 0 0-24.021333-24.021334z"
                                        fill="#fff"
                                    ></path>
                                </svg>
                                <span>{tEditor("downloadPdf")}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Editor Main Layout */}
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:h-[calc(100vh-140px)]">
                    {/* 1. Canvas Container */}
                    <div className="relative w-full lg:w-2/3 h-full flex-grow bg-white rounded-[1.5rem] shadow-sm border border-gray-200 flex flex-col overflow-hidden group select-none p-4 lg:p-6">
                        <div className="absolute inset-0 hero-bg opacity-30 pointer-events-none z-0"></div>

                        <div className="relative flex-grow w-full min-h-[348px] flex items-center justify-center">
                            <div
                                id="canvas-loader"
                                className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center hidden"
                            >
                                <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-brand-blue font-bold text-sm animate-pulse">
                                    {tEditor("generating")}
                                </p>
                            </div>

                            <canvas
                                id="draw-canvas"
                                className="absolute inset-0 m-auto !w-auto !h-auto !max-w-full !max-h-full object-contain z-10 shadow-lg rounded-lg bg-white"
                            ></canvas>
                        </div>

                        <div className="flex justify-center flex-shrink-0 z-20">
                            <div className="bg-slate-800 text-white px-4 py-2 rounded-full flex gap-3 shadow-xl transition-transform hover:scale-105">
                                <button
                                    id="tool-add"
                                    className="w-9 h-9 rounded-full bg-slate-600 hover:bg-brand-blue flex items-center justify-center transition text-white"
                                    title="Add Dot"
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        fill="currentColor"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z" />
                                    </svg>
                                </button>
                                <button
                                    id="tool-move"
                                    className="w-9 h-9 rounded-full hover:bg-brand-blue flex items-center justify-center transition text-white"
                                    title="Move Dot"
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        fill="currentColor"
                                        viewBox="0 0 512 512"
                                    >
                                        <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 272c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4S-3.6 325.7 12.4 341L124.8 448c43.1 41.1 100.4 64 160 64l19.2 0c97.2 0 176-78.8 176-176l0-208c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 176c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208z" />
                                    </svg>
                                </button>
                                <button
                                    id="tool-del"
                                    className="w-9 h-9 rounded-full hover:bg-red-500 flex items-center justify-center transition text-white"
                                    title="Delete Dot"
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        fill="currentColor"
                                        viewBox="0 0 576 512"
                                    >
                                        <path d="M178.5 416l123 0 65.3-65.3-173.5-173.5-126.7 126.7 112 112zM224 480l-45.5 0c-17 0-33.3-6.7-45.3-18.7L17 345C6.1 334.1 0 319.4 0 304s6.1-30.1 17-41L263 17C273.9 6.1 288.6 0 304 0s30.1 6.1 41 17L527 199c10.9 10.9 17 25.6 17 41s-6.1 30.1-17 41l-135 135 120 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0z" />
                                    </svg>
                                </button>
                                <div className="w-px h-5 bg-slate-600 my-auto"></div>
                                <button
                                    id="undo-btn"
                                    className="w-9 h-9 rounded-full hover:bg-slate-600 flex items-center justify-center transition text-white"
                                    title="Undo"
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        fill="currentColor"
                                        viewBox="0 0 512 512"
                                    >
                                        <path d="M24 192l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-46.7-46.7c75.3-58.6 184.3-53.3 253.5 15.9 75 75 75 196.5 0 271.5s-196.5 75-271.5 0c-10.2-10.2-19-21.3-26.4-33-9.5-14.9-29.3-19.3-44.2-9.8s-19.3 29.3-9.8 44.2C49.7 408.7 61.4 423.5 75 437 175 537 337 537 437 437S537 175 437 75C342.8-19.3 193.3-24.7 92.7 58.8L41 7C34.1 .2 23.8-1.9 14.8 1.8S0 14.3 0 24L0 168c0 13.3 10.7 24 24 24z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. Settings Sidebar */}
                    <div className="w-full lg:w-1/3 flex flex-col h-full bg-white lg:bg-transparent z-30">
                        <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 pb-4 space-y-4">
                            {/* A. Mode Selection */}
                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                                        {tEditor("difficulty")}
                                    </h3>
                                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                                        {tEditor("recommended")}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2" onClick={handlePresetChange}>
                                    <button
                                        className="preset-btn-js active relative flex flex-col items-center justify-center py-3 px-1 rounded-xl border-2 border-brand-blue bg-indigo-50/50 transition-all cursor-pointer hover:bg-indigo-50"
                                        data-preset="easy"

                                    >
                                        <span className="text-2xl mb-1">👶</span>
                                        <span className="text-xs font-bold text-brand-blue">
                                            {tEditor("easy")}
                                        </span>
                                    </button>
                                    <button
                                        className="preset-btn-js relative flex flex-col items-center justify-center py-3 px-1 rounded-xl border-2 border-transparent bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                                        data-preset="medium"
                                    >
                                        <span className="text-2xl mb-1">👦</span>
                                        <span className="text-xs font-bold text-slate-600">
                                            {tEditor("medium")}
                                        </span>
                                    </button>
                                    <button
                                        className="preset-btn-js relative flex flex-col items-center justify-center py-3 px-1 rounded-xl border-2 border-transparent bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                                        data-preset="hard"
                                    >
                                        <span className="text-2xl mb-1">🧠</span>
                                        <span className="text-xs font-bold text-slate-600">
                                            {tEditor("hard")}
                                        </span>
                                    </button>
                                </div>
                                <p
                                    id="preset-desc"
                                    className="text-xs text-slate-400 mt-3 text-center"
                                >
                                    {tEditor(presetMapping[activePreset])}
                                </p>
                            </div>

                            {/* B. Background Hint */}
                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                                <h3 className="font-bold text-slate-800 text-sm tracking-wide mb-4">
                                    {tEditor("bgHintTitle")}
                                </h3>
                                <div className="space-y-2" id="hint-type-radios">
                                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
                                        <input
                                            type="radio"
                                            name="hint-type"
                                            value="internal"
                                            className="accent-brand-blue w-4 h-4"
                                            defaultChecked
                                        />
                                        <span className="text-sm text-slate-700 font-medium">
                                            {tEditor("smartHint")}
                                        </span>
                                    </label>

                                    {/* Internal Eraser Settings */}
                                    <div
                                        id="thickness-container"
                                        className="mt-4 pt-4 border-t border-gray-100 bg-slate-50 rounded-lg p-3"
                                    >
                                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                                            <span className="font-bold">{tEditor("eraserSize")}</span>
                                            <span
                                                id="thicknessValue"
                                                className="font-bold text-brand-blue"
                                            >
                                                11
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            id="thicknessSlider"
                                            min="1"
                                            max="80"
                                            defaultValue="11"
                                            className="w-full"
                                        />
                                    </div>
                                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
                                        <input
                                            type="radio"
                                            name="hint-type"
                                            value="trace"
                                            className="accent-brand-blue w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-700 font-medium">
                                            {tEditor("lightTrace")}
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition">
                                        <input
                                            type="radio"
                                            name="hint-type"
                                            value="no"
                                            className="accent-brand-blue w-4 h-4"
                                        />
                                        <span className="text-sm text-slate-700 font-medium">
                                            {tEditor("noHint")}
                                        </span>
                                    </label>
                                    <div className="pt-2 mt-2 border-t border-slate-100">
                                        <button
                                            id="clear-btn"
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                                        >
                                            <svg
                                                width="12"
                                                height="12"
                                                fill="currentColor"
                                                viewBox="0 0 512 512"
                                                className="group-hover:rotate-[-45deg] transition-transform"
                                            >
                                                <path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 85.5-23.6-29C400.6 102.9 369.3 87.7 335.7 78.3C268.4 59.5 196.9 70.3 138.5 107.5L152.1 129C202.9 96.6 265 87.2 323.5 103.5c29.1 8.1 56.4 21.4 79.5 39.4l27.1 21.2-86.6 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l120 0zM57.5 288l-8.5 0c-13.3 0-24 10.7-24 24l0 128c0 13.3 10.7 24 24 24s24-10.7 24-24l0-85.5 23.6 29c23.8 29.3 55.1 44.5 88.8 53.9c67.3 18.8 138.8 8 197.1-29.2l-13.6-21.5C309.1 415.4 247 424.8 188.5 408.5c-29.1-8.1-56.4-21.4-79.5-39.4L81.9 347.9l86.6 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-120 0z" />
                                            </svg>
                                            {tEditor("resetCanvas")}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* C. Advanced Settings */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    id="toggle-advanced-btn"
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <span className="text-sm tracking-wide flex items-center gap-2">
                                        <svg
                                            width="14"
                                            height="14"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                            />
                                        </svg>
                                        {tEditor("customSettings")}
                                    </span>
                                </button>

                                <div
                                    id="advanced-content"
                                    className=" px-5 pb-5 space-y-5 border-t border-gray-50 bg-slate-50/50"
                                >
                                    {/* Dot Count */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-slate-600">
                                                {tEditor("dotCount")}
                                            </span>
                                            <span
                                                className="bg-white text-brand-blue text-xs font-bold px-2 py-1 rounded border border-gray-200"
                                                id="dot-count-display"
                                            >
                                                25 {tEditor("dotsUnit")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                id="points-minus-btn"
                                                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-gray-200 text-slate-600 font-bold"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="range"
                                                id="dot-count-slider"
                                                min="10"
                                                max="500"
                                                defaultValue="25"
                                                className="flex-grow"
                                            />
                                            <button
                                                id="points-plus-btn"
                                                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-gray-200 text-slate-600 font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Appearance */}
                                    <div className="space-y-5">
                                        <div>
                                            <div className="flex justify-between text-xs text-slate-500 mb-2">
                                                <span>{tEditor("fontSize")}</span>
                                                <span id="font-size-value">20</span>
                                            </div>
                                            <input
                                                type="range"
                                                id="font-size-slider"
                                                min="10"
                                                max="60"
                                                defaultValue="20"
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-slate-500 mb-2">
                                                <span>{tEditor("dotRadius")}</span>
                                                <span id="dot-size-value">6</span>
                                            </div>
                                            <input
                                                type="range"
                                                id="dot-size-slider"
                                                min="2"
                                                max="20"
                                                defaultValue="6"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-xs font-bold text-slate-600">
                                                {tEditor("dotColor")}
                                            </span>
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-110 transition">
                                                <input
                                                    type="color"
                                                    id="dot-color-picker"
                                                    defaultValue="#000000"
                                                    className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Generator Modal */}
            <div
                id="ai-modal"
                className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4"
            ></div>

            {/* Image Type Selection Modal */}
            <div
                id="image-type-modal"
                className="fixed inset-0 z-[70] hidden bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-scale-in">
                    <div className="w-14 h-14 bg-indigo-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            width="16"
                            height="16"
                            fill="currentColor"
                        >
                            <path d="M263.4-27L278.2 9.8 315 24.6c3 1.2 5 4.2 5 7.4s-2 6.2-5 7.4L278.2 54.2 263.4 91c-1.2 3-4.2 5-7.4 5s-6.2-2-7.4-5L233.8 54.2 197 39.4c-3-1.2-5-4.2-5-7.4s2-6.2 5-7.4L233.8 9.8 248.6-27c1.2-3 4.2-5 7.4-5s6.2 2 7.4 5zM110.7 41.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7L59.8 164.2 9.7 142.7C3.8 140.2 0 134.4 0 128s3.8-12.2 9.7-14.7L59.8 91.8 81.3 41.7C83.8 35.8 89.6 32 96 32s12.2 3.8 14.7 9.7zM464 304c6.4 0 12.2 3.8 14.7 9.7l21.5 50.1 50.1 21.5c5.9 2.5 9.7 8.3 9.7 14.7s-3.8 12.2-9.7 14.7l-50.1 21.5-21.5 50.1c-2.5 5.9-8.3 9.7-14.7 9.7s-12.2-3.8-14.7-9.7l-21.5-50.1-50.1-21.5c-5.9-2.5-9.7-8.3-9.7-14.7s3.8-12.2 9.7-14.7l50.1-21.5 21.5-50.1c2.5-5.9 8.3-9.7 14.7-9.7zM460 0c11 0 21.6 4.4 29.5 12.2l42.3 42.3C539.6 62.4 544 73 544 84s-4.4 21.6-12.2 29.5l-88.2 88.2-101.3-101.3 88.2-88.2C438.4 4.4 449 0 460 0zM44.2 398.5L308.4 134.3 409.7 235.6 145.5 499.8C137.6 507.6 127 512 116 512s-21.6-4.4-29.5-12.2L44.2 457.5C36.4 449.6 32 439 32 428s4.4-21.6 12.2-29.5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">
                        {tCustomGen("enhanceTitle")}
                    </h3>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                        {tCustomGen("enhanceDesc")}
                    </p>
                    <div className="space-y-3" id="modal-actions">
                        <button
                            id="btn-select-photo"
                            className="w-full py-3.5 bg-brand-blue text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                        >
                            {tCustomGen("btnRemoveBg")}
                        </button>
                        <button
                            id="btn-select-drawing"
                            className="w-full py-3.5 bg-white text-slate-700 font-bold border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition"
                        >
                            {tCustomGen("btnKeepOriginal")}
                        </button>
                    </div>
                    <div id="rmbg-loader" className="hidden py-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="text-brand-blue text-3xl mb-3"
                        >
                            <path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8-79.3 23.6-137.1 97.1-137.1 184.1 0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256 512 397.4 397.4 512 256 512S0 397.4 0 256c0-116 77.1-213.9 182.9-245.4 16.9-5 34.8 4.6 39.8 21.5z" />
                        </svg>
                        <p className="text-sm font-bold text-slate-600">
                            {tCustomGen("removingBg")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Logic Component for Client Side Interactivity */}
            <DotGeneratorClient />
        </main>
    );
}