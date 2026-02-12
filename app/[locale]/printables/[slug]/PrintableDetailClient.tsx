
import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, ChevronRight, X } from "lucide-react";
import { PrintableItem } from "@/lib/printables-data";

interface ClientProps {
    item: PrintableItem;
    relatedItems: PrintableItem[];
    locale: string;
    slug: string;
}

export default function PrintableDetailClient({ item, relatedItems, locale, slug }: ClientProps) {
    // 结构化数据
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": item.title,
        "description": item.description,
        "url": `https://connectthedotsprintable.online${locale === 'en' ? '' : '/' + locale}/printables/${slug}`,
        "image": item.imageUrl,
        "author": { "@type": "Organization", "name": "ConnectTheDotsPrintable.online" },
        "datePublished": "2023-10-26",
        "learningResourceType": "Printable",
        "isAccessibleForFree": "true"
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <main className="min-h-screen bg-white">
                {/* 1. Header Banner */}
                <section className="bg-gradient-to-r from-brand-blue to-brand-blue/80 text-white py-12">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="text-sm mb-4 flex items-center gap-2 opacity-90">
                            <Link href={locale === 'es' ? '/es/' : '/'} className="hover:underline">
                                {locale === 'es' ? 'Inicio' : 'Home'}
                            </Link> &gt;
                            <Link href={locale === 'es' ? '/es/printable-connect-the-dots' : '/printable-connect-the-dots'} className="hover:underline">
                                {locale === 'es' ? 'Fichas de unir puntos' : 'All Printables'}
                            </Link> &gt;
                            <span>{item.title}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{item.title}</h1>
                        <p className="text-lg text-white/90 max-w-3xl">{item.description}</p>
                        <div className="mt-4 text-sm text-white/80 flex items-center gap-2">
                            <Clock size={16} />
                            <span>{locale === 'es' ? 'Actualizado: 10 de octubre de 2025' : 'Last updated: October 10, 2025'}</span>
                        </div>
                    </div>
                </section>

                {/* 2. Main Body Section */}
                <section className="py-10 lg:py-16 bg-slate-50">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                            {/* Left Content Area */}
                            <div className="w-full lg:w-3/4">
                                <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                                    <div className="flex flex-col md:flex-row gap-8 mb-10">

                                        {/* Main Puzzle Image */}
                                        <div className="w-full md:w-2/3 relative overflow-hidden rounded-xl border border-slate-100 group">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.altText}
                                                width={600}
                                                height={600}
                                                className="w-full h-auto bg-white"
                                                priority
                                            />
                                            <span className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg ${item.tagColor}`}>
                                                {item.difficulty}
                                            </span>


                                        </div>

                                        {/* Puzzle Info Sidebar */}
                                        <div className="md:w-1/3 flex flex-col gap-5">
                                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                                                    {locale === 'es' ? 'Detalles de la Ficha' : 'Puzzle Details'}
                                                </h3>
                                                <ul className="space-y-3 text-sm">
                                                    <li className="">
                                                        <span className="font-semibold text-slate-800">{locale === 'es' ? 'Dificultad:' : 'Difficulty:'}</span>
                                                        <span className="ml-2">
                                                            {item.difficulty}
                                                        </span>
                                                    </li>
                                                    <li className="">
                                                        <span className="font-semibold text-slate-800">{locale === 'es' ? 'Puntos:' : 'Dots:'}</span>
                                                        <span className="font-bold text-brand-blue ml-2">
                                                            {Array.isArray(item.dotRange) ? item.dotRange.join('-') : item.dotRange}
                                                        </span>
                                                    </li>
                                                    <li className="">
                                                        <span className="font-semibold text-slate-800">{locale === 'es' ? 'Categoría:' : 'Category:'}</span>
                                                        <span className="font-bold text-slate-700 ml-2">
                                                            {item.category.join(', ')}
                                                        </span>
                                                    </li>
                                                    <li className="">
                                                        <span className="font-semibold text-slate-800">{locale === 'es' ? 'Edad:' : 'Age:'}</span>
                                                        <span className="font-bold text-slate-700 ml-2">
                                                            {item.ageRecommendation}
                                                        </span>
                                                    </li>
                                                    <div className="flex items-center">
                                                        <span className="font-semibold text-slate-800">{locale === 'es' ? 'Popularidad:' : 'Popularity:'}</span>
                                                        <span className="font-bold flex items-center gap-1 ml-2">
                                                            <Heart size={14} className="text-red-500 fill-current" /> {item.popularity}
                                                        </span>
                                                    </div>
                                                </ul>
                                            </div>

                                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col">
                                                <h3 className="text-lg font-bold text-slate-800 mb-4">{locale === 'es' ? 'Solución' : 'View Solution'}</h3>
                                                <div
                                                    className="relative w-full aspect-square overflow-hidden rounded-lg mb-4 cursor-pointer border border-white shadow-sm group"
                                                >
                                                    <Image src={item.solutionUrl} alt="Solution" fill className="object-contain bg-white transition-transform group-hover:scale-110" />
                                                </div>
                                                <a href={item.imageUrl} download className="block text-center w-full bg-brand-blue hover:bg-[#4338ca] text-white py-3 rounded-lg font-bold transition-all mb-3 shadow-md">
                                                    {locale === 'es' ? 'Descargar Dibujo' : 'Download Puzzle'}
                                                </a>
                                                <a href={item.solutionUrl} download className="block text-center w-full bg-brand-purple hover:bg-[#6366f1] text-white py-3 rounded-lg font-bold transition-all shadow-md">
                                                    {locale === 'es' ? 'Descargar Solución' : 'Download Solution'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-8">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-l-4 border-brand-blue pl-4">
                                            {locale === 'es' ? 'Sobre esta ficha' : 'About this Printable'}
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
                                    </div>
                                </div>

                                {/* Related Printables Grid: 同难度的卡片 */}
                                <div className="mt-12">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                                        {locale === 'es' ? 'Más fichas que te pueden gustar' : 'More Printables from this Level'}
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-4">
                                        {relatedItems.map((rel) => (
                                            <Link key={rel.id} href={rel.detailPage} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
                                                <div className="relative aspect-square bg-white p-2">
                                                    <Image src={rel.imageUrl} alt={rel.title} fill className="object-contain transition-transform group-hover:scale-105" />
                                                    <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${rel.tagColor}`}>{rel.difficulty}</span>
                                                </div>
                                                <div className="p-4 flex-grow">
                                                    <h3 className="font-bold text-slate-800 group-hover:text-brand-blue transition-colors line-clamp-1">{rel.title}</h3>
                                                    <p className="text-slate-500 text-xs mt-1">Dots: {Array.isArray(rel.dotRange) ? rel.dotRange.join('-') : rel.dotRange}</p>
                                                    <p className="text-neutral/70 mb-2 line-clamp-3">
                                                        {rel.description}
                                                    </p>
                                                    <div className="flex flex-col justify-between md:flex-row gap-2 md:text-sm text-neutral/60">
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4 inline-block align-text-bottom mr-1" fill="none"
                                                                viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                            {rel.ageRecommendation}
                                                        </span>
                                                        <span className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 inline-block align-text-bottom text-red-500 mr-1"
                                                            fill="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z">
                                                            </path>
                                                        </svg> {rel.popularity}

                                                            {
                                                                locale === 'es' ? ' Popularidad' : ' Popularity'
                                                            }</span>
                                                    </div>
                                                </div>

                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar: 文章区域 */}
                            <aside className="w-full lg:w-1/4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                                    <h3 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-50 pb-2">
                                        {locale === 'es' ? 'Artículos Destacados' : 'Our Top Articles'}
                                    </h3>

                                    <Link href={locale === 'es' ? "/es/printables/connectTheDotsGenerator" : "/printables/connectTheDotsGenerator"} className="block mb-8 group">
                                        <h4 className="font-bold text-slate-800 group-hover:text-brand-blue transition-colors mb-2 leading-tight">
                                            {locale === 'es' ? 'Guía del Generador de Unir Puntos' : 'Unlock Limitless Creativity: Your Ultimate Guide to a Free Connect the Dots Generator'}
                                        </h4>
                                        <p className="text-slate-500 text-xs leading-relaxed">
                                            {locale === 'es' ? 'Descubre cómo crear tus propios dibujos al instante.' : 'Discover how a digital generator can outperform traditional methods and create stunning puzzles instantly.'}
                                        </p>
                                        <span className="text-[10px] font-bold text-brand-blue uppercase mt-2 flex items-center gap-1">
                                            {locale === 'es' ? 'Leer Más' : 'Read Article'} <ChevronRight size={10} />
                                        </span>
                                    </Link>

                                    {[
                                        { url: "/printables/adults", img: "3-Intricate-Connect-the-Dots-Mandala-for-Adults-Over-100-dots.avif", title: locale === 'es' ? "Retos para Adultos" : "High-Difficulty Challenges for Adults", tag: "Popular" },
                                        { url: "/printables/animals", img: "6-Cute-Bunny-Rabbit-Connect-the-Dots-for-Young-Children-1-20-dots.avif", title: locale === 'es' ? "Animales e Infantil" : "Animal Connect the Dots Printable", tag: "Educational" },
                                        { url: "/christmas-printables", img: "4-Christmas-Tree-Connect-the-Dots-Design-1-50-dots.avif", title: locale === 'es' ? "Especial de Navidad" : "Festive Christmas Activity Guide", tag: "Seasonal" }
                                    ].map((art, idx) => (
                                        <Link key={idx} href={locale === 'es' ? `/es${art.url}` : art.url} className="flex gap-4 mb-6 group items-start">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                                                <Image src={`https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/400/${art.img}`} alt="Article" fill className="object-cover transition-transform group-hover:scale-110" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-700 text-xs group-hover:text-brand-blue transition-colors line-clamp-2">{art.title}</h4>
                                                <span className="text-[10px] text-slate-400">{art.tag}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}