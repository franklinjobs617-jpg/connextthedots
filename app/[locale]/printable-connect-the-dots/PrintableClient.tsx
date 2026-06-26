"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, Filter, Sparkles, Star } from "lucide-react";
import PrintableCard from "@/components/PrintableCard";
import { useAuth } from "@/lib/auth-context";
import DotGeneratorClient from "@/components/DotGeneratorClient";
import type { PrintableItem } from "@/lib/printables-data";

type Props = {
    locale: string;
    data: Record<string, PrintableItem[]>;
    allItems: PrintableItem[];
};

// ─── i18n copy ────────────────────────────────────────────────────────────────
const copy: Record<string, Record<string, string>> = {
    en: {
        breadcrumbHome: "Home",
        breadcrumbCurrent: "Free Printables",
        h1: "Free Connect the Dots Printables",
        subtitle:
            "Browse 50+ free dot-to-dot worksheets by difficulty, theme, and age. Download any sheet as PDF — or use the generator below to turn any photo into your own custom puzzle.",
        ctaBrowse: "Browse Printables ↓",
        ctaMake: "Make Your Own →",
        filterTitle: "Filter by Difficulty",
        filterAll: "All",
        filterEasy: "Easy",
        filterMedium: "Medium",
        filterHard: "Hard",
        filterExtreme: "Extreme",
        gridTitle: "Free Printable Worksheets",
        gridSub: (n: number, t: number) => `Showing ${n} of ${t} printables`,
        generatorHeading: "Don't see what you're looking for?",
        generatorSub:
            "Turn any photo into a custom connect the dots puzzle in seconds. Adjust dot count, preview, and download as PDF.",
        faqHeading: "Frequently Asked Questions",
        faqItems: [
            {
                q: "What is a connect the dots printable?",
                a: "A connect the dots printable is a worksheet where numbered dots are arranged to form a hidden picture. When you draw lines from dot 1 to 2 to 3 and so on, the image is revealed. These printable sheets are used for counting practice, fine motor skill development, and screen-free entertainment for kids and adults.",
            },
            {
                q: "Are these connect the dots worksheets free to download?",
                a: "Yes — every worksheet in this collection is free to download and print with no watermarks. Simply click any puzzle, open the full-size version, and print using standard letter or A4 settings.",
            },
            {
                q: "What age are these dot to dot printables suitable for?",
                a: "Worksheets are labelled by age range. Easy sheets with 10–25 dots suit ages 3–6. Medium sheets with 25–60 dots work well for ages 6–10. Hard and Extreme sheets with 60–200+ dots are designed for ages 10 and up, including adults who enjoy detailed puzzles.",
            },
            {
                q: "Can I make my own connect the dots from a photo?",
                a: "Yes. The custom generator below lets you upload any image — a pet photo, drawing, or outline — and converts it into a numbered dot-to-dot puzzle you can adjust and download as PDF. No design skills needed.",
            },
            {
                q: "How do I print a connect the dots worksheet?",
                a: "Click any puzzle card to open the detail page, then use your browser's print function (Ctrl+P or Cmd+P). Select 'Fit to page' and print on standard letter or A4 paper. The puzzles are designed to print cleanly without any cropping.",
            },
        ],
        relatedTitle: "Related Collections",
        related: [
            { href: "/free-animal-dot-to-dot-printables-pdf/", title: "Animal Dot-to-Dot Printables", desc: "Dogs, cats, rabbits, owls, turtles, and more." },
            { href: "/christmas-printables/", title: "Christmas Connect the Dots", desc: "Santa, trees, ornaments, and holiday scenes." },
            { href: "/connect-the-dots-1-to-10/", title: "Connect the Dots 1 to 10", desc: "Beginner sheets for toddlers and preschoolers." },
            { href: "/connect-the-dots-coloring-pages/", title: "Coloring Pages", desc: "Connect dots then color the revealed picture." },
            { href: "/how-to-make/", title: "How to Make a Dot-to-Dot", desc: "Step-by-step tutorial using your own images." },
            { href: "/popular-character-dot-to-dot-printable-worksheets/", title: "Character Worksheets", desc: "Themed puzzles from popular characters." },
        ],
        diffLabels: { Easy: "Easy", Medium: "Medium", Hard: "Hard", Extreme: "Extreme" },
        dotsBadge: "dots",
        ageBadge: "Age",
    },
    de: {
        breadcrumbHome: "Startseite",
        breadcrumbCurrent: "Kostenlose Druckvorlagen",
        h1: "Zahlen Verbinden zum Ausdrucken – Kostenlose Arbeitsblätter",
        subtitle:
            "Über 50 kostenlose Punkt-zu-Punkt Arbeitsblätter nach Schwierigkeitsgrad, Thema und Alter. Als PDF herunterladen — oder eigenes Foto hochladen und Rätsel selbst erstellen.",
        ctaBrowse: "Alle Vorlagen ↓",
        ctaMake: "Eigene erstellen →",
        filterTitle: "Nach Schwierigkeit filtern",
        filterAll: "Alle",
        filterEasy: "Einfach",
        filterMedium: "Mittel",
        filterHard: "Schwer",
        filterExtreme: "Extrem",
        gridTitle: "Kostenlose Druckvorlagen",
        gridSub: (n: number, t: number) => `${n} von ${t} Vorlagen werden angezeigt`,
        generatorHeading: "Nichts Passendes gefunden?",
        generatorSub:
            "Wandle jedes Foto in ein eigenes Zahlen-verbinden-Rätsel um. Punktanzahl anpassen, Vorschau ansehen und als PDF herunterladen.",
        faqHeading: "Häufig gestellte Fragen",
        faqItems: [
            {
                q: "Was ist ein Zahlen-verbinden-Arbeitsblatt?",
                a: "Ein Zahlen-verbinden-Arbeitsblatt ist eine Vorlage, auf der nummerierte Punkte ein verstecktes Bild ergeben. Wenn du die Punkte von 1 nach 2 nach 3 usw. verbindest, wird das Bild sichtbar. Diese Druckvorlagen werden zum Zählen üben, zur Förderung der Feinmotorik und als bildschirmfreie Beschäftigung für Kinder und Erwachsene verwendet.",
            },
            {
                q: "Sind diese Arbeitsblätter wirklich kostenlos?",
                a: "Ja — jede Vorlage in dieser Sammlung kann kostenlos und ohne Wasserzeichen heruntergeladen und ausgedruckt werden. Klicke auf ein Rätsel, öffne die Vollversion und drucke sie mit Standard-Letter- oder A4-Einstellungen aus.",
            },
            {
                q: "Für welches Alter sind diese Vorlagen geeignet?",
                a: "Die Arbeitsblätter sind mit Altersangaben gekennzeichnet. Einfache Blätter mit 10–25 Punkten eignen sich für 3–6 Jahre. Mittlere Blätter mit 25–60 Punkten sind für 6–10 Jahre geeignet. Schwere und extreme Blätter mit 60–200+ Punkten sind für Kinder ab 10 Jahren und Erwachsene konzipiert.",
            },
            {
                q: "Kann ich ein eigenes Zahlen-verbinden aus einem Foto erstellen?",
                a: "Ja. Mit dem Generator unten kannst du ein beliebiges Bild hochladen — ein Haustier-Foto, eine Zeichnung oder eine Umrisszeichnung — und es in ein nummeriertes Punkt-zu-Punkt-Rätsel umwandeln, das du anpassen und als PDF herunterladen kannst.",
            },
            {
                q: "Wie drucke ich eine Vorlage aus?",
                a: "Klicke auf eine Vorlagenkarte, um die Detailseite zu öffnen, und nutze dann die Druckfunktion deines Browsers (Strg+P oder Cmd+P). Wähle 'An Seite anpassen' und drucke auf Standard-Letter- oder A4-Papier.",
            },
        ],
        relatedTitle: "Weitere Sammlungen",
        related: [
            { href: "/de/free-animal-dot-to-dot-printables-pdf/", title: "Tiere Punkt-zu-Punkt", desc: "Hunde, Katzen, Hasen, Eulen und mehr." },
            { href: "/de/christmas-printables/", title: "Weihnachten Zahlen verbinden", desc: "Weihnachtsmann, Bäume und Winterszenen." },
            { href: "/de/connect-the-dots-1-to-10/", title: "Zahlen verbinden 1 bis 10", desc: "Einfache Blätter für Kleinkinder und Vorschüler." },
            { href: "/de/connect-the-dots-coloring-pages/", title: "Ausmalbilder", desc: "Punkte verbinden und dann das Bild ausmalen." },
            { href: "/de/how-to-make/", title: "Wie erstelle ich ein Rätsel?", desc: "Schritt-für-Schritt-Anleitung mit eigenen Bildern." },
            { href: "/de/popular-character-dot-to-dot-printable-worksheets/", title: "Charakter-Arbeitsblätter", desc: "Rätsel mit beliebten Figuren." },
        ],
        diffLabels: { Easy: "Einfach", Medium: "Mittel", Hard: "Schwer", Extreme: "Extrem" },
        dotsBadge: "Punkte",
        ageBadge: "Alter",
    },
    fr: {
        breadcrumbHome: "Accueil",
        breadcrumbCurrent: "Fiches gratuites",
        h1: "Points à Relier à Imprimer – Fiches Gratuites PDF",
        subtitle:
            "Plus de 50 fiches de points à relier gratuites par difficulté, thème et âge. Téléchargez en PDF — ou créez votre propre puzzle depuis une photo.",
        ctaBrowse: "Voir les fiches ↓",
        ctaMake: "Créer le mien →",
        filterTitle: "Filtrer par difficulté",
        filterAll: "Tous",
        filterEasy: "Facile",
        filterMedium: "Moyen",
        filterHard: "Difficile",
        filterExtreme: "Extrême",
        gridTitle: "Fiches à imprimer gratuites",
        gridSub: (n: number, t: number) => `Affichage de ${n} sur ${t} fiches`,
        generatorHeading: "Vous ne trouvez pas ce que vous cherchez ?",
        generatorSub:
            "Transformez n'importe quelle photo en puzzle de points à relier personnalisé. Ajustez le nombre de points, prévisualisez et téléchargez en PDF.",
        faqHeading: "Questions fréquentes",
        faqItems: [
            {
                q: "Qu'est-ce qu'une fiche de points à relier ?",
                a: "Une fiche de points à relier est une feuille d'activité où des points numérotés forment une image cachée. En reliant les points de 1 à 2, 2 à 3, etc., l'image se révèle. Ces fiches sont utilisées pour pratiquer le comptage, développer la motricité fine et offrir une activité sans écran aux enfants et aux adultes.",
            },
            {
                q: "Ces fiches sont-elles vraiment gratuites ?",
                a: "Oui — chaque fiche de cette collection est gratuite à télécharger et à imprimer, sans filigrane. Cliquez sur un puzzle, ouvrez la version pleine taille et imprimez avec les paramètres standard Letter ou A4.",
            },
            {
                q: "Pour quel âge ces fiches sont-elles adaptées ?",
                a: "Les fiches sont étiquetées par tranche d'âge. Les fiches faciles avec 10 à 25 points conviennent aux 3–6 ans. Les fiches moyennes avec 25–60 points sont adaptées aux 6–10 ans. Les fiches difficiles et extrêmes avec 60–200+ points sont conçues pour les enfants de 10 ans et plus, et les adultes.",
            },
            {
                q: "Puis-je créer ma propre fiche depuis une photo ?",
                a: "Oui. Le générateur ci-dessous vous permet de télécharger n'importe quelle image et de la convertir en puzzle de points numérotés que vous pouvez ajuster et télécharger en PDF.",
            },
            {
                q: "Comment imprimer une fiche ?",
                a: "Cliquez sur une carte de puzzle pour ouvrir la page de détail, puis utilisez la fonction d'impression de votre navigateur (Ctrl+P ou Cmd+P). Sélectionnez 'Ajuster à la page' et imprimez sur papier Letter standard ou A4.",
            },
        ],
        relatedTitle: "Collections associées",
        related: [
            { href: "/fr/free-animal-dot-to-dot-printables-pdf/", title: "Points à relier animaux", desc: "Chiens, chats, lapins, hiboux et plus." },
            { href: "/fr/christmas-printables/", title: "Points à relier Noël", desc: "Père Noël, sapins et scènes hivernales." },
            { href: "/fr/connect-the-dots-1-to-10/", title: "Points à relier 1 à 10", desc: "Fiches pour les tout-petits et la maternelle." },
            { href: "/fr/connect-the-dots-coloring-pages/", title: "Pages à colorier", desc: "Reliez les points puis coloriez l'image." },
            { href: "/fr/how-to-make/", title: "Comment créer un puzzle ?", desc: "Tutoriel pas à pas avec vos propres images." },
            { href: "/fr/popular-character-dot-to-dot-printable-worksheets/", title: "Fiches personnages", desc: "Puzzles sur des personnages populaires." },
        ],
        diffLabels: { Easy: "Facile", Medium: "Moyen", Hard: "Difficile", Extreme: "Extrême" },
        dotsBadge: "points",
        ageBadge: "Âge",
    },
    it: {
        breadcrumbHome: "Home",
        breadcrumbCurrent: "Schede gratuite",
        h1: "Unisci i Punti da Stampare – Schede PDF Gratuite",
        subtitle:
            "Oltre 50 schede unisci i punti gratuite per difficoltà, tema ed età. Scarica in PDF — o crea il tuo puzzle da una foto.",
        ctaBrowse: "Vedi le schede ↓",
        ctaMake: "Crea il tuo →",
        filterTitle: "Filtra per difficoltà",
        filterAll: "Tutti",
        filterEasy: "Facile",
        filterMedium: "Medio",
        filterHard: "Difficile",
        filterExtreme: "Estremo",
        gridTitle: "Schede da stampare gratuite",
        gridSub: (n: number, t: number) => `Mostrando ${n} di ${t} schede`,
        generatorHeading: "Non trovi quello che cerchi?",
        generatorSub:
            "Trasforma qualsiasi foto in un puzzle unisci i punti personalizzato. Regola il numero di punti, visualizza l'anteprima e scarica in PDF.",
        faqHeading: "Domande frequenti",
        faqItems: [
            {
                q: "Cos'è una scheda unisci i punti?",
                a: "Una scheda unisci i punti è un foglio di attività in cui punti numerati formano un'immagine nascosta. Collegando i punti da 1 a 2, da 2 a 3 e così via, l'immagine si rivela. Queste schede vengono usate per praticare il conteggio, sviluppare la motricità fine e offrire un'attività senza schermo per bambini e adulti.",
            },
            {
                q: "Queste schede sono davvero gratuite?",
                a: "Sì — ogni scheda in questa raccolta è gratuita da scaricare e stampare, senza filigrana. Clicca su un puzzle, apri la versione a grandezza naturale e stampa con le impostazioni standard Letter o A4.",
            },
            {
                q: "Per quale età sono adatte queste schede?",
                a: "Le schede sono contrassegnate per fascia d'età. Le schede facili con 10–25 punti sono adatte ai 3–6 anni. Le schede medie con 25–60 punti vanno bene per i 6–10 anni. Le schede difficili ed estreme con 60–200+ punti sono progettate per i bambini dai 10 anni in su e gli adulti.",
            },
            {
                q: "Posso creare la mia scheda da una foto?",
                a: "Sì. Il generatore qui sotto ti permette di caricare qualsiasi immagine e convertirla in un puzzle di punti numerati che puoi regolare e scaricare in PDF.",
            },
            {
                q: "Come si stampa una scheda?",
                a: "Clicca su una scheda per aprire la pagina di dettaglio, poi usa la funzione di stampa del tuo browser (Ctrl+P o Cmd+P). Seleziona 'Adatta alla pagina' e stampa su carta Letter standard o A4.",
            },
        ],
        relatedTitle: "Raccolte correlate",
        related: [
            { href: "/it/free-animal-dot-to-dot-printables-pdf/", title: "Unisci i punti animali", desc: "Cani, gatti, conigli, gufi e altro." },
            { href: "/it/christmas-printables/", title: "Unisci i punti Natale", desc: "Babbo Natale, alberi e scene invernali." },
            { href: "/it/connect-the-dots-1-to-10/", title: "Unisci i punti da 1 a 10", desc: "Schede per bambini piccoli e prescolare." },
            { href: "/it/connect-the-dots-coloring-pages/", title: "Pagine da colorare", desc: "Collega i punti e poi colora l'immagine." },
            { href: "/it/how-to-make/", title: "Come creare un puzzle?", desc: "Tutorial passo passo con le tue immagini." },
            { href: "/it/popular-character-dot-to-dot-printable-worksheets/", title: "Schede personaggi", desc: "Puzzle con personaggi popolari." },
        ],
        diffLabels: { Easy: "Facile", Medium: "Medio", Hard: "Difficile", Extreme: "Estremo" },
        dotsBadge: "punti",
        ageBadge: "Età",
    },
};

// Fallback to EN for any locale not explicitly defined
function getCopy(locale: string) {
    return copy[locale] ?? copy.en;
}

// ─── Schema ────────────────────────────────────────────────────────────────────
function buildJsonLd(locale: string, items: PrintableItem[]) {
    const base = `https://connectthedotsprintable.online${locale === "en" ? "" : `/${locale}`}`;
    const c = getCopy(locale);
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${base}/printable-connect-the-dots/`,
                name: c.h1,
                url: `${base}/printable-connect-the-dots/`,
                description: c.subtitle,
                inLanguage: locale,
                mainEntity: {
                    "@type": "ItemList",
                    numberOfItems: items.length,
                    itemListElement: items.slice(0, 20).map((item, i) => ({
                        "@type": "ListItem",
                        position: i + 1,
                        url: `https://connectthedotsprintable.online${item.detailPage}`,
                        name: item.title,
                    })),
                },
            },
            {
                "@type": "FAQPage",
                mainEntity: c.faqItems.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            },
        ],
    };
}

// ─── Difficulty filter config ──────────────────────────────────────────────────
const FILTERS = [
    { id: "all", dotBadge: "50+" },
    { id: "easy", dotBadge: "1–20" },
    { id: "medium", dotBadge: "20–60" },
    { id: "hard", dotBadge: "60–100" },
    { id: "extreme", dotBadge: "100+" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function PrintableClient({ locale, data, allItems }: Props) {
    const c = getCopy(locale);
    const { user, login, isLoggingIn } = useAuth();
    const credits = user ? parseInt(user.credits || "0", 10) : 0;

    const [activeFilter, setActiveFilter] = useState<string>("all");

    const displayedItems = useMemo(() => {
        if (activeFilter === "all") return allItems;
        return data[activeFilter] ?? [];
    }, [activeFilter, data, allItems]);

    const homeHref = locale === "en" ? "/" : `/${locale}/`;
    const jsonLd = buildJsonLd(locale, allItems);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="flex-grow w-full bg-slate-50">

                {/* ── Hero ── */}
                <section className="relative bg-slate-900 pt-14 pb-12 overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                        {/* Breadcrumb */}
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                            <Link href={homeHref} className="hover:text-white transition-colors">
                                {c.breadcrumbHome}
                            </Link>
                            <ChevronRight size={12} className="opacity-50" aria-hidden="true" />
                            <span className="text-brand-blue">{c.breadcrumbCurrent}</span>
                        </nav>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                                {c.h1}
                            </h1>
                            <p className="text-base sm:text-lg text-slate-300 leading-7 mb-8 max-w-2xl">
                                {c.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="#printable-grid"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
                                >
                                    <Download size={16} aria-hidden="true" />
                                    {c.ctaBrowse}
                                </a>
                                <a
                                    href="#generator"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <Sparkles size={16} aria-hidden="true" />
                                    {c.ctaMake}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Filter + Grid ── */}
                <section id="printable-grid" className="py-12 md:py-16">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col lg:flex-row gap-10">

                            {/* Sidebar filter */}
                            <aside className="lg:w-52 flex-shrink-0">
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 lg:sticky lg:top-24">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                                        <Filter size={15} className="text-brand-blue" aria-hidden="true" />
                                        <h2 className="text-sm font-bold text-slate-700">{c.filterTitle}</h2>
                                    </div>
                                    <div className="space-y-2">
                                        {FILTERS.map((f) => {
                                            const label =
                                                f.id === "all" ? c.filterAll :
                                                f.id === "easy" ? c.filterEasy :
                                                f.id === "medium" ? c.filterMedium :
                                                f.id === "hard" ? c.filterHard :
                                                c.filterExtreme;
                                            const active = activeFilter === f.id;
                                            return (
                                                <button
                                                    key={f.id}
                                                    onClick={() => setActiveFilter(f.id)}
                                                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all flex items-center justify-between ${
                                                        active
                                                            ? "border-brand-blue bg-brand-blue text-white"
                                                            : "border-slate-100 bg-white text-slate-600 hover:bg-indigo-50 hover:text-brand-blue"
                                                    }`}
                                                >
                                                    <span>{label}</span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                                                        {f.dotBadge}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </aside>

                            {/* Grid */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-end justify-between mb-6 pb-4 border-b border-slate-200">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900">{c.gridTitle}</h2>
                                        <p className="text-sm text-slate-500 mt-0.5">
                                            {c.gridSub(displayedItems.length, allItems.length)}
                                        </p>
                                    </div>
                                    <Star size={16} className="text-amber-400 flex-shrink-0" aria-hidden="true" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                                    {displayedItems.map((item, idx) => (
                                        <PrintableCard key={item.id} item={item} priority={idx < 3} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Generator CTA ── */}
                <section id="generator" className="py-12 md:py-16 bg-white border-t border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                                {c.generatorHeading}
                            </h2>
                            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
                                {c.generatorSub}
                            </p>
                        </div>

                        {/* Credits / login status */}
                        <div className="flex justify-center mb-6">
                            {!user ? (
                                <button
                                    onClick={() => login()}
                                    disabled={isLoggingIn}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-brand-blue border border-brand-blue rounded-full hover:bg-indigo-50 transition-colors"
                                >
                                    {isLoggingIn ? "Signing in…" : "Sign in with Google to get free credits"}
                                </button>
                            ) : (
                                <span className={`text-sm font-medium px-4 py-1.5 rounded-full border ${credits > 0 ? "text-slate-600 border-slate-200 bg-slate-50" : "text-red-500 border-red-200 bg-red-50"}`}>
                                    {credits > 0
                                        ? `${credits} AI credits remaining`
                                        : "No credits left — upgrade to continue"}
                                </span>
                            )}
                        </div>

                        <DotGeneratorClient locale={locale} user={user} />
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-100">
                    <div className="container max-w-3xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
                            {c.faqHeading}
                        </h2>
                        <div className="space-y-5">
                            {c.faqItems.map((item) => (
                                <article
                                    key={item.q}
                                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
                                >
                                    <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                                    <p className="text-sm leading-7 text-slate-600">{item.a}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Related links ── */}
                <section className="py-10 bg-white border-t border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-700 mb-5">{c.relatedTitle}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {c.related.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group block bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl p-4 transition-all"
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
