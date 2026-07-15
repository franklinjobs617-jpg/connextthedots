"use client";

import Link from "next/link";
import { ChevronRight, Brain, Clock, ShieldCheck, ExternalLink } from "lucide-react";
import PrintableCard from "@/components/PrintableCard";
import { useAuth } from "@/lib/auth-context";
import DotGeneratorClient from "@/components/DotGeneratorClient";
import type { PrintableItem } from "@/lib/printables-data";

type Props = {
    locale: string;
    featuredItems: PrintableItem[];
};

interface DifficultyRow {
    level: string;
    dots: string;
    time: string;
    bestFor: string;
}

interface WhyItem {
    icon: React.ReactNode;
    title: string;
    body: string;
}

interface FaqItem {
    q: string;
    a: string;
}

interface RelatedLink {
    href: string;
    title: string;
    desc: string;
}

interface LocaleCopy {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    h1: string;
    heroBody: string;
    lastUpdatedLabel: string;
    ctaFeatured: string;
    toolBoxTitle: string;
    signInCta: string;
    signingIn: string;
    creditsLeft: (n: number) => string;
    noCreditsLeft: string;
    featuredTitle: string;
    featuredSub: string;
    featuredEmpty: string;
    browseLibrary: string;
    difficultyTitle: string;
    difficultySub: string;
    difficultyHeaders: { level: string; dots: string; time: string; bestFor: string };
    difficultyTable: DifficultyRow[];
    whyTitle: string;
    whyItems: WhyItem[];
    sourceLabel: string;
    sourceText: string;
    faqTitle: string;
    faqItems: FaqItem[];
    relatedTitle: string;
    relatedLinks: RelatedLink[];
    metaDescription: string;
}

const LAST_UPDATED_EN = "July 15, 2026";
const LAST_UPDATED_FR = "15 juillet 2026";

const copy: Record<string, LocaleCopy> = {
    en: {
        breadcrumbHome: "Home",
        breadcrumbCurrent: "Connect the Dots for Adults",
        h1: "Connect the Dots for Adults",
        heroBody:
            "Connect the dots for adults means puzzles with 100 to 300+ numbered dots instead of the 10–25 used in children's sheets — finer detail, longer completion time, and a genuinely challenging result. Download a free PDF below, or upload your own photo and generate a custom extreme puzzle in seconds.",
        lastUpdatedLabel: `Last updated ${LAST_UPDATED_EN}`,
        ctaFeatured: "See Featured Extreme Puzzles ↓",
        toolBoxTitle: "Create your own extreme puzzle",
        signInCta: "Sign in for free credits",
        signingIn: "Signing in…",
        creditsLeft: (n) => `${n} credits left`,
        noCreditsLeft: "No credits left",
        featuredTitle: "Featured Extreme & Hard Puzzles",
        featuredSub: "Hand-picked high-detail puzzles for adults. More are added regularly — for now, here are our top picks by difficulty.",
        featuredEmpty: "New extreme puzzles are on the way — in the meantime, use the generator above to create your own.",
        browseLibrary: "Browse the full printable library →",
        difficultyTitle: "Difficulty at a Glance",
        difficultySub: "Adults typically start at Hard and move to Extreme once they're comfortable with 100+ dot puzzles.",
        difficultyHeaders: { level: "Difficulty", dots: "Dot Count", time: "Est. Time", bestFor: "Best For" },
        difficultyTable: [
            { level: "Easy", dots: "10 – 25", time: "3 – 5 min", bestFor: "Toddlers & preschool (ages 3–6)" },
            { level: "Medium", dots: "25 – 60", time: "5 – 12 min", bestFor: "Kids ages 6–10" },
            { level: "Hard", dots: "60 – 100", time: "12 – 20 min", bestFor: "Teens & casual adult puzzlers" },
            { level: "Extreme", dots: "100 – 300+", time: "20 – 45+ min", bestFor: "Adults who want a longer, detailed challenge" },
        ],
        whyTitle: "Why adults enjoy dot to dot puzzles",
        whyItems: [
            {
                icon: <Brain size={20} className="text-brand-blue" aria-hidden="true" />,
                title: "A focused, screen-free break",
                body: "Working through a numbered sequence occupies the mind in a single, repetitive task — the same mechanism researchers link to reduced anxiety in adult coloring and mandala-focused activities.",
            },
            {
                icon: <Clock size={20} className="text-brand-blue" aria-hidden="true" />,
                title: "Built for longer sessions",
                body: "Extreme puzzles with 150–300+ dots take 20–45 minutes to complete — enough time to fully disengage from a screen without an open-ended time commitment.",
            },
            {
                icon: <ShieldCheck size={20} className="text-brand-blue" aria-hidden="true" />,
                title: "No app, no account required",
                body: "Download a PDF and print it, or build a custom one from your own photo. Nothing to install, nothing to sign up for unless you want to save your credits.",
            },
        ],
        sourceLabel: "Source:",
        sourceText: "Cleveland Clinic — why adult coloring can relax your brain",
        faqTitle: "Frequently asked questions",
        faqItems: [
            {
                q: "What is a connect the dots puzzle for adults?",
                a: "A connect the dots puzzle for adults uses the same numbered-dot format as children's worksheets, but at much higher detail — typically 100 to 300+ dots instead of 10–50. The extra density creates finer, more realistic outlines (portraits, architecture, detailed animals) and takes considerably longer to complete, which is part of the appeal for adult users.",
            },
            {
                q: "Are these connect the dots printables really free?",
                a: "Yes. Every puzzle featured on this page is free to download as a PDF, with no watermark and no account required. The custom generator further down this page also includes free credits — no payment is needed to try it.",
            },
            {
                q: "How many dots do adult puzzles typically have?",
                a: "Hard puzzles on this site range from 60–100 dots, and Extreme puzzles range from 100–300+ dots. For comparison, a typical children's worksheet has 10–25 dots. Higher dot counts mean finer detail and a longer, more absorbing completion time.",
            },
            {
                q: "Can I create a custom extreme dot-to-dot puzzle from my own photo?",
                a: "Yes — use the generator at the top of this page. Upload any photo with clear, well-defined edges (a pet, a building, a portrait) and set a higher dot count for a more detailed, challenging result. The tool works best with images that have a clear subject and good contrast.",
            },
            {
                q: "Are dot to dot puzzles good for stress relief?",
                a: "Focused, repetitive visual tasks like connect-the-dots share the same mechanism researchers associate with anxiety reduction in adult coloring: sustained attention on a single simple action tends to quiet distracting thoughts. Cleveland Clinic has written about why structured creative activities like this can help adults unwind — see the reference link below.",
            },
            {
                q: "What paper size should I print an adult puzzle on?",
                a: "All PDFs on this site are formatted for both A4 and US Letter paper. Select 'Fit to page' in your print dialog. For puzzles with 200+ dots, printing at full page size (rather than a shrunk preview) makes the numbers easier to read.",
            },
        ],
        relatedTitle: "Related collections",
        relatedLinks: [
            { href: "/printable-connect-the-dots/", title: "All Connect the Dots Printables", desc: "Browse the full library by difficulty, theme, and age." },
            { href: "/dot-to-dot-printable/", title: "Dot to Dot Printable Guide", desc: "What dot to dot puzzles are and how to use them." },
            { href: "/how-to-make/", title: "How to Make a Custom Dot to Dot", desc: "Step-by-step guide to the photo generator." },
            { href: "/connect-the-dots-1-to-10/", title: "Connect the Dots 1 to 10", desc: "Simple sheets for beginners, if you're starting a child on easier puzzles." },
        ],
        metaDescription: "Free connect the dots for adults, 100-300+ dots. Download extreme printable PDFs or turn any photo into your own custom puzzle in seconds.",
    },
    fr: {
        breadcrumbHome: "Accueil",
        breadcrumbCurrent: "Points à Relier pour Adultes",
        h1: "Points à Relier pour Adultes",
        heroBody:
            "Les points à relier pour adultes utilisent 100 à 300+ points numérotés, contre 10 à 25 pour les fiches destinées aux enfants — plus de détail, un temps de réalisation plus long, et un résultat vraiment stimulant. Téléchargez un PDF gratuit ci-dessous, ou importez votre propre photo pour générer un puzzle extrême personnalisé en quelques secondes.",
        lastUpdatedLabel: `Dernière mise à jour : ${LAST_UPDATED_FR}`,
        ctaFeatured: "Voir les Puzzles Extrêmes ↓",
        toolBoxTitle: "Créez votre propre puzzle extrême",
        signInCta: "Connectez-vous pour des crédits gratuits",
        signingIn: "Connexion…",
        creditsLeft: (n) => `${n} crédits restants`,
        noCreditsLeft: "Plus de crédits disponibles",
        featuredTitle: "Puzzles Extrêmes et Difficiles",
        featuredSub: "Une sélection de puzzles très détaillés pour adultes. D'autres sont ajoutés régulièrement — voici pour l'instant nos meilleurs choix par difficulté.",
        featuredEmpty: "De nouveaux puzzles extrêmes arrivent bientôt — en attendant, utilisez le générateur ci-dessus pour créer le vôtre.",
        browseLibrary: "Parcourir toutes les fiches à imprimer →",
        difficultyTitle: "Les Niveaux de Difficulté en un Coup d'Œil",
        difficultySub: "Les adultes commencent généralement par le niveau difficile, puis passent au niveau extrême une fois à l'aise avec 100+ points.",
        difficultyHeaders: { level: "Difficulté", dots: "Nombre de Points", time: "Temps Estimé", bestFor: "Idéal Pour" },
        difficultyTable: [
            { level: "Facile", dots: "10 – 25", time: "3 – 5 min", bestFor: "Tout-petits et maternelle (3–6 ans)" },
            { level: "Moyen", dots: "25 – 60", time: "5 – 12 min", bestFor: "Enfants de 6 à 10 ans" },
            { level: "Difficile", dots: "60 – 100", time: "12 – 20 min", bestFor: "Adolescents et adultes occasionnels" },
            { level: "Extrême", dots: "100 – 300+", time: "20 – 45+ min", bestFor: "Adultes cherchant un défi long et détaillé" },
        ],
        whyTitle: "Pourquoi les adultes aiment les points à relier",
        whyItems: [
            {
                icon: <Brain size={20} className="text-brand-blue" aria-hidden="true" />,
                title: "Une pause concentrée, sans écran",
                body: "Suivre une séquence numérotée occupe l'esprit dans une tâche unique et répétitive — le même mécanisme que les chercheurs associent à la réduction de l'anxiété dans le coloriage pour adultes et les activités centrées sur les mandalas.",
            },
            {
                icon: <Clock size={20} className="text-brand-blue" aria-hidden="true" />,
                title: "Conçu pour des sessions plus longues",
                body: "Les puzzles extrêmes de 150 à 300+ points prennent 20 à 45 minutes à réaliser — assez de temps pour se déconnecter complètement d'un écran, sans engagement de durée indéterminée.",
            },
            {
                icon: <ShieldCheck size={20} className="text-brand-blue" aria-hidden="true" />,
                title: "Aucune application, aucun compte requis",
                body: "Téléchargez un PDF et imprimez-le, ou créez-en un personnalisé à partir de votre propre photo. Rien à installer, aucune inscription nécessaire sauf si vous souhaitez conserver vos crédits.",
            },
        ],
        sourceLabel: "Source :",
        sourceText: "Cleveland Clinic — pourquoi le coloriage pour adultes peut apaiser le cerveau (en anglais)",
        faqTitle: "Questions fréquentes",
        faqItems: [
            {
                q: "Qu'est-ce qu'un puzzle de points à relier pour adultes ?",
                a: "Un puzzle de points à relier pour adultes utilise le même format numéroté que les fiches pour enfants, mais avec beaucoup plus de détail — généralement 100 à 300+ points au lieu de 10 à 50. Cette densité supplémentaire crée des contours plus fins et plus réalistes (portraits, architecture, animaux détaillés) et prend beaucoup plus de temps à compléter, ce qui fait partie de l'attrait pour les adultes.",
            },
            {
                q: "Ces fiches de points à relier sont-elles vraiment gratuites ?",
                a: "Oui. Chaque puzzle présenté sur cette page est gratuit à télécharger en PDF, sans filigrane et sans compte requis. Le générateur personnalisé plus bas sur cette page inclut également des crédits gratuits — aucun paiement n'est nécessaire pour l'essayer.",
            },
            {
                q: "Combien de points comptent les puzzles pour adultes ?",
                a: "Les puzzles difficiles sur ce site comptent de 60 à 100 points, et les puzzles extrêmes de 100 à 300+ points. À titre de comparaison, une fiche typique pour enfants compte 10 à 25 points. Plus le nombre de points est élevé, plus le détail est fin et le temps de réalisation long.",
            },
            {
                q: "Puis-je créer un puzzle extrême personnalisé à partir de ma propre photo ?",
                a: "Oui — utilisez le générateur en haut de cette page. Importez une photo avec des contours nets et bien définis (un animal de compagnie, un bâtiment, un portrait) et choisissez un nombre de points plus élevé pour un résultat plus détaillé et plus stimulant. L'outil fonctionne mieux avec des images ayant un sujet clair et un bon contraste.",
            },
            {
                q: "Les puzzles de points à relier aident-ils à réduire le stress ?",
                a: "Les tâches visuelles répétitives et concentrées comme les points à relier partagent le même mécanisme que les chercheurs associent à la réduction de l'anxiété dans le coloriage pour adultes : une attention soutenue sur une action simple tend à apaiser les pensées distrayantes. Cleveland Clinic explique pourquoi ce type d'activité créative structurée peut aider les adultes à se détendre — voir la source ci-dessous.",
            },
            {
                q: "Quel format de papier utiliser pour imprimer un puzzle adulte ?",
                a: "Tous les PDF de ce site sont formatés pour le papier A4 et Letter US. Sélectionnez « Ajuster à la page » dans votre dialogue d'impression. Pour les puzzles de 200+ points, imprimer en taille réelle (plutôt qu'en aperçu réduit) permet de mieux lire les numéros.",
            },
        ],
        relatedTitle: "Collections associées",
        relatedLinks: [
            { href: "/fr/printable-connect-the-dots/", title: "Toutes nos Fiches à Imprimer", desc: "Parcourez la collection complète par difficulté, thème et âge." },
            { href: "/fr/", title: "Créer votre propre dessin", desc: "Importez une photo et générez votre puzzle personnalisé gratuitement." },
        ],
        metaDescription: "Points à relier pour adultes, 100 à 300+ points. Téléchargez des PDF extrêmes gratuits ou créez votre propre puzzle personnalisé en quelques secondes.",
    },
};

function getCopy(locale: string): LocaleCopy {
    return copy[locale] ?? copy.en;
}

function buildJsonLd(locale: string, items: PrintableItem[]) {
    const c = getCopy(locale);
    const base = "https://connectthedotsprintable.online";
    const path = locale === "en" ? "/connect-the-dots-for-adults/" : `/${locale}/connect-the-dots-for-adults/`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${base}${path}`,
                name: c.h1,
                url: `${base}${path}`,
                description: c.metaDescription,
                inLanguage: locale,
                dateModified: "2026-07-15",
            },
            {
                "@type": "SoftwareApplication",
                name: "Connect the Dots Generator",
                applicationCategory: "DesignApplication",
                operatingSystem: "Any (Web-based)",
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
                description:
                    "Upload any photo and generate a custom numbered dot-to-dot puzzle with adjustable difficulty, downloadable as PDF.",
            },
            {
                "@type": "FAQPage",
                mainEntity: c.faqItems.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            },
            items.length > 0 && {
                "@type": "ItemList",
                numberOfItems: items.length,
                itemListElement: items.map((item, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `${base}${item.detailPage}`,
                    name: item.title,
                })),
            },
        ].filter(Boolean),
    };
}

export default function ConnectDotsAdultsClient({ locale, featuredItems }: Props) {
    const c = getCopy(locale);
    const { user, login, isLoggingIn } = useAuth();
    const credits = user ? parseInt(user.credits || "0", 10) : 0;
    const jsonLd = buildJsonLd(locale, featuredItems);
    const homeHref = locale === "en" ? "/" : `/${locale}/`;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="flex-grow w-full bg-slate-50">

                {/* ── Hero with tool in first viewport ── */}
                <section className="relative bg-slate-900 pt-10 pb-14 overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                            <Link href={homeHref} className="hover:text-white transition-colors">{c.breadcrumbHome}</Link>
                            <ChevronRight size={12} className="opacity-50" aria-hidden="true" />
                            <span className="text-brand-blue">{c.breadcrumbCurrent}</span>
                        </nav>

                        <div className="grid lg:grid-cols-2 gap-10 items-start">
                            {/* Left: direct-answer copy */}
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                                    {c.h1}
                                </h1>
                                <p className="text-base sm:text-lg text-slate-300 leading-7 mb-4 max-w-xl">
                                    {c.heroBody}
                                </p>
                                <p className="text-xs text-slate-500 mb-6">{c.lastUpdatedLabel}</p>
                                <div className="flex flex-wrap gap-3 mb-2">
                                    <button
                                        onClick={() => document.getElementById("featured-puzzles")?.scrollIntoView({ behavior: "smooth" })}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-sm"
                                    >
                                        {c.ctaFeatured}
                                    </button>
                                </div>
                            </div>

                            {/* Right: the actual tool, visible without scrolling */}
                            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-bold text-slate-700">{c.toolBoxTitle}</p>
                                    {!user ? (
                                        <button
                                            onClick={() => login()}
                                            disabled={isLoggingIn}
                                            className="text-xs font-semibold text-brand-blue hover:underline"
                                        >
                                            {isLoggingIn ? c.signingIn : c.signInCta}
                                        </button>
                                    ) : (
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${credits > 0 ? "text-slate-600 border-slate-200 bg-slate-50" : "text-red-500 border-red-200 bg-red-50"}`}>
                                            {credits > 0 ? c.creditsLeft(credits) : c.noCreditsLeft}
                                        </span>
                                    )}
                                </div>
                                <DotGeneratorClient locale={locale} user={user} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Featured extreme puzzles ── */}
                <section id="featured-puzzles" className="py-12 bg-white border-b border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                            {c.featuredTitle}
                        </h2>
                        <p className="text-slate-500 text-sm mb-8 max-w-xl">
                            {c.featuredSub}
                        </p>
                        {featuredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                                {featuredItems.map((item) => (
                                    <PrintableCard key={item.id} item={item} priority />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">
                                {c.featuredEmpty}
                            </p>
                        )}
                        <div className="mt-6">
                            <Link
                                href={locale === "en" ? "/printable-connect-the-dots/" : `/${locale}/printable-connect-the-dots/`}
                                className="text-sm font-semibold text-brand-blue hover:underline"
                            >
                                {c.browseLibrary}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Difficulty comparison table ── */}
                <section className="py-12 bg-slate-50 border-b border-slate-100">
                    <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                            {c.difficultyTitle}
                        </h2>
                        <p className="text-slate-500 text-sm mb-6 max-w-xl">
                            {c.difficultySub}
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600">
                                        <th className="px-4 py-3 font-semibold">{c.difficultyHeaders.level}</th>
                                        <th className="px-4 py-3 font-semibold">{c.difficultyHeaders.dots}</th>
                                        <th className="px-4 py-3 font-semibold">{c.difficultyHeaders.time}</th>
                                        <th className="px-4 py-3 font-semibold">{c.difficultyHeaders.bestFor}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {c.difficultyTable.map((row) => (
                                        <tr key={row.level} className="border-t border-slate-100">
                                            <td className={`px-4 py-3 font-bold ${row.level === "Hard" || row.level === "Extreme" || row.level === "Difficile" || row.level === "Extrême" ? "text-brand-blue" : "text-slate-700"}`}>
                                                {row.level}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{row.dots}</td>
                                            <td className="px-4 py-3 text-slate-600">{row.time}</td>
                                            <td className="px-4 py-3 text-slate-600">{row.bestFor}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── Why adults enjoy this ── */}
                <section className="py-12 bg-slate-50 border-b border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
                            {c.whyTitle}
                        </h2>
                        <div className="grid sm:grid-cols-3 gap-6 mb-8">
                            {c.whyItems.map((item) => (
                                <div key={item.title} className="bg-white rounded-2xl border border-slate-100 p-5">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                                        {item.icon}
                                    </div>
                                    <p className="font-semibold text-slate-800 text-sm mb-1">{item.title}</p>
                                    <p className="text-slate-500 text-sm leading-6">{item.body}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                            {c.sourceLabel}{" "}
                            <a
                                href="https://health.clevelandclinic.org/3-reasons-adult-coloring-can-actually-relax-brain"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-blue hover:underline inline-flex items-center gap-1"
                            >
                                {c.sourceText}
                                <ExternalLink size={11} aria-hidden="true" />
                            </a>
                        </p>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="py-12 md:py-16 bg-white border-b border-slate-100">
                    <div className="container max-w-3xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
                            {c.faqTitle}
                        </h2>
                        <div className="space-y-5">
                            {c.faqItems.map((item) => (
                                <article
                                    key={item.q}
                                    className="bg-slate-50 rounded-2xl border border-slate-100 p-6"
                                >
                                    <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                                    <p className="text-sm leading-7 text-slate-600">{item.a}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Related links ── */}
                <section className="py-10 bg-slate-50">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-700 mb-5">{c.relatedTitle}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {c.relatedLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group block bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl p-4 transition-all"
                                >
                                    <p className="font-semibold text-brand-blue group-hover:underline text-sm">
                                        {link.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{link.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}
