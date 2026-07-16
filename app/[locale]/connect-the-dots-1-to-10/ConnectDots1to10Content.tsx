"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllPrintables, PrintableItem } from "@/lib/printables-data";
import PrintableCard from "@/components/PrintableCard";
import { Printer, Star, ChevronDown, BookOpen, GraduationCap, ArrowRight, ExternalLink } from "lucide-react";

type Props = {
    locale: string;
};

// 筛选适合初学者的最简单 printables（优先选点数最少的 Easy 图）
// 注：图库中没有点数上限严格 <=10 的图，最简单的是 1-20。
function getEasyPrintables(): PrintableItem[] {
    const all = getAllPrintables();
    return all
        .filter((item) => {
            const range = item.dotRange;
            return Array.isArray(range) && range[1] <= 25 && item.difficulty === "Easy";
        })
        .sort((a, b) => {
            const aMax = Array.isArray(a.dotRange) ? a.dotRange[1] : 999;
            const bMax = Array.isArray(b.dotRange) ? b.dotRange[1] : 999;
            return aMax - bMax;
        })
        .slice(0, 12);
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="w-full p-4 text-left">
                <span className="font-semibold text-gray-800">{question}</span>
            </div>
            <div className="px-4 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {answer}
            </div>
        </div>
    );
}

interface FaqItem { q: string; a: string; }
interface RelatedLink { href: string; title: string; desc: string; }

interface LocaleCopy {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    h1Prefix: string;
    h1Highlight: string;
    h1Suffix: string;
    heroBody: string;
    badgeEasiest: string;
    badgeInstant: string;
    badgeAge: string;
    lastUpdated: string;
    gridTitle: string;
    gridSub: string;
    loadMore: (n: number) => string;
    showLess: string;
    whyTitle: string;
    whyPara1: string;
    whyPara2: string;
    sourceLabel: string;
    sourceText: string;
    skillsTitle: string;
    skills: string[];
    howToTitle: string;
    howToSteps: { title: string; body: string }[];
    nextTitle: string;
    nextBody: string;
    nextLinks: RelatedLink[];
    generatorLink: string;
    faqTitle: string;
    faqItems: FaqItem[];
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    metaDescription: string;
}

const copy: Record<string, LocaleCopy> = {
    en: {
        breadcrumbHome: "Home",
        breadcrumbCurrent: "Connect the Dots 1 to 10",
        h1Prefix: "Free",
        h1Highlight: "Connect the Dots 1 to 10",
        h1Suffix: "Printables",
        heroBody: "Download our easiest connect the dots worksheets, designed for toddlers and preschoolers just starting to count. Large dots, simple shapes, and instant PDF download — perfect for little hands learning their numbers.",
        badgeEasiest: "Easiest Worksheets",
        badgeInstant: "Instant PDF Download",
        badgeAge: "Ages 2-5",
        lastUpdated: "Last updated: July 15, 2026",
        gridTitle: "Our Easiest Dot to Dot Worksheets",
        gridSub: "Click any worksheet to preview and download the PDF. All printables are free, with no watermarks.",
        loadMore: (n) => `Load More (${n} more)`,
        showLess: "Show Less",
        whyTitle: "Why 1 to 10 Is Perfect for Beginners",
        whyPara1: "Our easiest connect the dots worksheets are the ideal starting point for young learners. The small number range keeps activities short and achievable, which is crucial for maintaining a toddler's attention span. Each completed worksheet gives children a sense of accomplishment that builds confidence.",
        whyPara2: "These worksheets help develop number recognition, fine motor skills, and hand-eye coordination — three foundational skills that prepare children for writing and math in kindergarten.",
        sourceLabel: "Source:",
        sourceText: "American Journal of Occupational Therapy — fine motor skills in preschoolers",
        skillsTitle: "Skills Your Child Will Develop:",
        skills: [
            "Number Recognition: Identifying and sequencing numbers in order",
            "Fine Motor Control: Practicing pencil grip and line drawing",
            "Focus & Patience: Completing a task from start to finish",
            "Shape Awareness: Recognizing outlines of animals, objects, and patterns",
        ],
        howToTitle: "How to Use These Worksheets",
        howToSteps: [
            { title: "Choose a Worksheet", body: "Browse the collection above and pick a design your child will love — animals, shapes, or fun characters." },
            { title: "Download the PDF", body: "Click the Download PDF button. The file will open in a new tab — save it to your device." },
            { title: "Print & Connect!", body: "Print on standard paper. Give your child a crayon or pencil and let them connect the dots in order." },
        ],
        nextTitle: "What Comes After 1 to 10?",
        nextBody: "Once your child is comfortable with these easiest worksheets, gradually increase the challenge. These next-level worksheets help build counting skills step by step.",
        nextLinks: [
            { href: "/printable-connect-the-dots/", title: "All Printable Connect the Dots", desc: "Browse our full collection — easy, medium, and hard worksheets for all ages." },
            { href: "/free-animal-dot-to-dot-printables-pdf/", title: "Animal Dot to Dot Printables", desc: "Animal-themed worksheets that kids love — dogs, cats, dinosaurs, and more." },
            { href: "/how-to-make/", title: "How to Make Dot to Dot", desc: "Learn how to create your own custom connect the dots puzzles." },
            { href: "/connect-the-dots-coloring-pages/", title: "Connect the Dots Coloring Pages", desc: "Two-in-one activity pages: connect dots then color the revealed picture." },
        ],
        generatorLink: "Or create your own with our generator",
        faqTitle: "Frequently Asked Questions",
        faqItems: [
            { q: "What age are connect the dots 1 to 10 worksheets for?", a: "Connect the dots 1 to 10 worksheets are designed for children ages 2-5. Toddlers (ages 2-3) can start with the simplest shapes, while preschoolers (ages 4-5) can use them to reinforce number recognition and fine motor skills." },
            { q: "How do I print these dot to dot worksheets?", a: "Click the Download PDF button on any worksheet. Open the PDF file and select Print. Choose 'Fit to Page' in your printer settings for the best results. We recommend using standard A4 or Letter size paper." },
            { q: "Are these connect the dots 1 to 10 printables really free?", a: "Yes! All our connect the dots 1 to 10 printables are completely free to download and print. No sign-up, no payment, no watermarks. They are for personal and educational use." },
            { q: "What comes after connect the dots 1 to 10?", a: "Once your child is comfortable with these easiest worksheets, try our medium-difficulty printables for the next challenge. This gradual progression helps build confidence while developing counting skills." },
            { q: "Can teachers use these worksheets in the classroom?", a: "Absolutely! These worksheets are perfect for classroom use. Teachers can print them for math centers, morning work, or as a quiet activity. They align with early childhood education standards for number recognition and fine motor development." },
        ],
        ctaTitle: "Want More Custom Worksheets?",
        ctaBody: "Use our free AI-powered generator to create custom connect the dots puzzles from any image. Perfect for personalized learning activities!",
        ctaButton: "Try the Free Generator",
        metaDescription: "Download 20+ free connect the dots 1 to 10 printables for toddlers and preschoolers. Easy PDF worksheets with large dots and simple shapes.",
    },
    fr: {
        breadcrumbHome: "Accueil",
        breadcrumbCurrent: "Points à Relier Maternelle",
        h1Prefix: "Fiches Gratuites",
        h1Highlight: "Points à Relier",
        h1Suffix: "pour la Maternelle",
        heroBody: "Téléchargez nos fiches de points à relier les plus simples, conçues pour la maternelle et les tout-petits qui commencent à compter. Gros points, formes simples et téléchargement PDF instantané — parfait pour les petites mains qui apprennent leurs chiffres.",
        badgeEasiest: "Fiches les Plus Faciles",
        badgeInstant: "Téléchargement PDF Instantané",
        badgeAge: "3 à 6 ans",
        lastUpdated: "Dernière mise à jour : 15 juillet 2026",
        gridTitle: "Nos Fiches de Points à Relier les Plus Faciles",
        gridSub: "Cliquez sur une fiche pour la prévisualiser et télécharger le PDF. Toutes les fiches sont gratuites, sans filigrane.",
        loadMore: (n) => `Voir plus (${n} de plus)`,
        showLess: "Voir moins",
        whyTitle: "Pourquoi ces Fiches Conviennent à la Maternelle",
        whyPara1: "Nos fiches de points à relier les plus simples sont le point de départ idéal pour les jeunes enfants de maternelle. Le petit nombre de points garde les activités courtes et réalisables, ce qui est essentiel pour maintenir l'attention d'un tout-petit. Chaque fiche terminée donne à l'enfant un sentiment d'accomplissement qui renforce sa confiance.",
        whyPara2: "Ces fiches aident à développer la reconnaissance des nombres, la motricité fine et la coordination œil-main — trois compétences essentielles qui préparent les enfants à l'écriture et aux mathématiques en maternelle et au CP.",
        sourceLabel: "Source :",
        sourceText: "American Journal of Occupational Therapy — motricité fine chez les enfants de maternelle (en anglais)",
        skillsTitle: "Compétences Développées par votre Enfant :",
        skills: [
            "Reconnaissance des Nombres : identifier et suivre les chiffres dans l'ordre",
            "Motricité Fine : s'entraîner à tenir un crayon et à tracer des lignes",
            "Concentration et Patience : mener une tâche du début à la fin",
            "Reconnaissance des Formes : identifier les contours d'animaux, d'objets et de motifs",
        ],
        howToTitle: "Comment Utiliser ces Fiches",
        howToSteps: [
            { title: "Choisir une Fiche", body: "Parcourez la collection ci-dessus et choisissez un motif que votre enfant adorera — animaux, formes ou personnages amusants." },
            { title: "Télécharger le PDF", body: "Cliquez sur le bouton de téléchargement. Le fichier s'ouvrira dans un nouvel onglet — enregistrez-le sur votre appareil." },
            { title: "Imprimer et Relier !", body: "Imprimez sur papier standard. Donnez à votre enfant un crayon de couleur et laissez-le relier les points dans l'ordre." },
        ],
        nextTitle: "Après les Points à Relier pour la Maternelle ?",
        nextBody: "Une fois que votre enfant maîtrise ces fiches les plus simples, augmentez progressivement la difficulté. Ces fiches de niveau supérieur aident à renforcer les compétences de comptage étape par étape.",
        nextLinks: [
            { href: "/fr/printable-connect-the-dots/", title: "Toutes nos Fiches à Imprimer", desc: "Parcourez notre collection complète — fiches faciles, moyennes et difficiles pour tous les âges." },
            { href: "/fr/connect-the-dots-for-adults/", title: "Points à Relier pour Adultes", desc: "Puzzles extrêmes de 100 à 300+ points pour un défi plus détaillé." },
        ],
        generatorLink: "Ou créez la vôtre avec notre générateur",
        faqTitle: "Questions Fréquentes",
        faqItems: [
            { q: "Pour quel âge sont ces fiches de points à relier maternelle ?", a: "Ces fiches sont conçues pour les enfants de 3 à 6 ans, soit l'âge de la maternelle en France. Les plus jeunes (petite section) peuvent commencer par les formes les plus simples, tandis que les enfants de grande section peuvent les utiliser pour renforcer la reconnaissance des nombres et la motricité fine." },
            { q: "Comment imprimer ces fiches de points à relier ?", a: "Cliquez sur le bouton de téléchargement PDF de n'importe quelle fiche. Ouvrez le fichier PDF et sélectionnez Imprimer. Choisissez 'Ajuster à la page' dans les paramètres de votre imprimante pour un meilleur résultat. Nous recommandons du papier A4 ou Letter standard." },
            { q: "Ces fiches de points à relier maternelle sont-elles vraiment gratuites ?", a: "Oui ! Toutes nos fiches de points à relier pour la maternelle sont entièrement gratuites à télécharger et à imprimer. Aucune inscription, aucun paiement, aucun filigrane. Elles sont destinées à un usage personnel et éducatif." },
            { q: "Que faire après ces fiches de maternelle ?", a: "Une fois que votre enfant est à l'aise avec ces fiches les plus simples, essayez nos fiches de difficulté moyenne pour le défi suivant. Cette progression graduelle aide à construire la confiance tout en développant les compétences de comptage." },
            { q: "Les enseignants peuvent-ils utiliser ces fiches en classe ?", a: "Absolument ! Ces fiches sont parfaites pour un usage en classe de maternelle. Les enseignants peuvent les imprimer pour des ateliers de mathématiques, le travail du matin ou comme activité calme. Elles s'alignent avec les objectifs pédagogiques de la maternelle pour la reconnaissance des nombres et le développement moteur fin." },
        ],
        ctaTitle: "Envie de Fiches Personnalisées ?",
        ctaBody: "Utilisez notre générateur gratuit pour créer des puzzles de points à relier personnalisés à partir de n'importe quelle image. Parfait pour des activités d'apprentissage sur mesure !",
        ctaButton: "Essayer le Générateur Gratuit",
        metaDescription: "Fiches de points à relier gratuites pour la maternelle, conçues pour les tout-petits qui commencent à compter. PDF à imprimer, gros points, formes simples.",
    },
};

function getCopy(locale: string): LocaleCopy {
    return copy[locale] ?? copy.en;
}

function buildJsonLd(locale: string, c: LocaleCopy) {
    const base = "https://connectthedotsprintable.online";
    const path = locale === "en" ? "/connect-the-dots-1-to-10/" : `/${locale}/connect-the-dots-1-to-10/`;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${base}${path}`,
                name: `${c.h1Prefix} ${c.h1Highlight} ${c.h1Suffix}`,
                url: `${base}${path}`,
                description: c.metaDescription,
                inLanguage: locale,
                dateModified: "2026-07-15",
            },
            {
                "@type": "FAQPage",
                mainEntity: c.faqItems.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: c.breadcrumbHome, item: `${base}${locale === "en" ? "/" : `/${locale}/`}` },
                    { "@type": "ListItem", position: 2, name: c.breadcrumbCurrent, item: `${base}${path}` },
                ],
            },
        ],
    };
}

export default function ConnectDots1to10Content({ locale }: Props) {
    const c = getCopy(locale);
    const printables = getEasyPrintables();
    const [showAll, setShowAll] = useState(false);
    const displayedPrintables = showAll ? printables : printables.slice(0, 8);
    const homeHref = locale === "en" ? "/" : `/${locale}/`;
    const jsonLd = buildJsonLd(locale, c);

    return (
        <main className="bg-slate-50 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb */}
            <nav className="container mx-auto max-w-6xl px-4 pt-6 pb-2" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-gray-500">
                    <li><Link href={homeHref} className="hover:text-blue-600 transition-colors">{c.breadcrumbHome}</Link></li>
                    <li className="text-gray-300">/</li>
                    <li className="text-gray-800 font-medium">{c.breadcrumbCurrent}</li>
                </ol>
            </nav>

            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Hero Section */}
                <header className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        {c.h1Prefix} <span className="text-blue-600">{c.h1Highlight}</span> {c.h1Suffix}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {c.heroBody}
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" /> {c.badgeEasiest}</span>
                        <span className="flex items-center gap-1"><Printer size={16} /> {c.badgeInstant}</span>
                        <span className="flex items-center gap-1"><BookOpen size={16} /> {c.badgeAge}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">{c.lastUpdated}</p>
                </header>

                {/* Printable Grid */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{c.gridTitle}</h2>
                    <p className="text-gray-600 mb-6">{c.gridSub}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {displayedPrintables.map((item, idx) => (
                            <PrintableCard key={item.id} item={item} priority={idx < 4} />
                        ))}
                    </div>

                    {printables.length > 8 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors"
                            >
                                {showAll ? c.showLess : c.loadMore(printables.length - 8)}
                                <ChevronDown size={18} className={`transition-transform ${showAll ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                    )}
                </section>

                {/* 教育价值 */}
                <section className="mb-16 bg-white rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap size={28} className="text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">{c.whyTitle}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-600 leading-relaxed mb-4">{c.whyPara1}</p>
                            <p className="text-gray-600 leading-relaxed">{c.whyPara2}</p>
                            <p className="text-xs text-gray-400 mt-4">
                                {c.sourceLabel}{" "}
                                <a
                                    href="https://research.aota.org/ajot/article/78/3/7803205080/25181/Quantifying-Coloring-Skills-Among-Preschoolers"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                    {c.sourceText}
                                    <ExternalLink size={11} />
                                </a>
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-800 mb-3">{c.skillsTitle}</h3>
                            <ul className="space-y-3">
                                {c.skills.map((skill, i) => {
                                    const [label, ...rest] = skill.split(":");
                                    return (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                                            <span className="text-gray-700"><strong>{label}:</strong>{rest.join(":")}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 使用指南 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{c.howToTitle}</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {c.howToSteps.map((step, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{i + 1}</div>
                                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 内链区 */}
                <section className="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{c.nextTitle}</h2>
                    <p className="text-gray-600 mb-6">{c.nextBody}</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {c.nextLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow group">
                                <h3 className="font-semibold text-blue-600 group-hover:underline">{link.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{link.desc}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <Link href={homeHref} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                            {c.generatorLink} <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{c.faqTitle}</h2>
                    <div className="space-y-3 max-w-3xl">
                        {c.faqItems.map((item, index) => (
                            <FAQItem key={index} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="text-center bg-blue-600 text-white rounded-2xl p-8 md:p-12 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{c.ctaTitle}</h2>
                    <p className="text-blue-100 mb-6 max-w-xl mx-auto">{c.ctaBody}</p>
                    <Link
                        href={homeHref}
                        className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-yellow-400 hover:text-gray-900 transition transform hover:scale-105 shadow-lg"
                    >
                        {c.ctaButton}
                    </Link>
                </section>
            </div>
        </main>
    );
}
