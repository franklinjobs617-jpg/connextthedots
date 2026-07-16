"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FileDown, ExternalLink } from "lucide-react";

type Props = { locale: string };

interface FaqItem { q: string; a: string; }
interface ContentCard { title: string; body: string; }

interface LocaleCopy {
    eyebrow: string;
    h1: string;
    heroBody: string;
    lastUpdated: string;
    downloadBtn: string;
    tags: string[];
    previewLabel: string;
    contentCards: ContentCard[];
    howToTitle: string;
    howToSteps: string[];
    screenFreeTitle: string;
    screenFreeBody: string;
    screenFreeTags: string[];
    sourceLabel: string;
    sourceText: string;
    faqTitle: string;
    faqItems: FaqItem[];
    ctaTitle: string;
    ctaBody: string;
    browseLibraryBtn: string;
    openGeneratorBtn: string;
    schemaName: string;
    schemaAbout: string;
    metaDescription: string;
}

const copy: Record<string, LocaleCopy> = {
    en: {
        eyebrow: "Free seasonal bundle",
        h1: "Free Christmas Connect the Dots Printables",
        heroBody: "Download our free Christmas connect-the-dots PDF bundle — Santa, trees, ornaments, and winter scenes in easy and hard versions, all in one printable file.",
        lastUpdated: "Last updated July 14, 2026",
        downloadBtn: "Download Free PDF Bundle",
        tags: ["Santa", "Christmas Tree", "Ornaments", "Holiday Scene", "Classroom Activity"],
        previewLabel: "What's inside the bundle",
        contentCards: [
            { title: "Easy Christmas Dot-to-Dot for Kids", body: "Easier Christmas pages are best for a short, printable holiday activity for preschool or elementary learners. Santa faces, trees, ornaments, and simple winter shapes are easier to recognize with lower dot counts, which keeps the worksheet fun instead of frustrating." },
            { title: "Hard Christmas Puzzles for Older Kids and Adults", body: "Hard Christmas printables work well for older kids and adults who want a denser holiday puzzle with more lines and more detail. Ornament and scene-based layouts justify the extra dots because the final image is more satisfying when it takes longer to finish." },
            { title: "Popular Holiday Themes", body: "Santa, Christmas trees, ornaments, and winter scenes are the most requested holiday themes, and they're what this bundle is built around, along with classroom-friendly activity ideas for holiday parties and quiet time." },
        ],
        howToTitle: "How to Print the Bundle",
        howToSteps: [
            "Download the free PDF bundle using the button above.",
            "Open the file and check the preview before printing so the numbers stay readable.",
            "Use standard letter or A4 paper and choose 'fit to page' in the printer dialog.",
            "For a thicker activity sheet, switch to cardstock after confirming the layout on normal paper.",
        ],
        screenFreeTitle: "A Screen-Free Holiday Activity",
        screenFreeBody: "Christmas connect-the-dots pages work well as short screen-free breaks, quiet classroom center work, or a printable activity during travel and family gatherings. They also fit into classroom rotations, doubling as counting practice first and a coloring activity second.",
        screenFreeTags: ["Morning work", "Holiday centers", "Travel activity", "Color after connecting"],
        sourceLabel: "Source:",
        sourceText: "HealthyChildren.org (AAP) — screen-free family time",
        faqTitle: "FAQ",
        faqItems: [
            { q: "What's included in the free Christmas printable bundle?", a: "The free bundle is a single PDF download containing multiple Christmas-themed connect-the-dots puzzles — Santa, Christmas trees, ornaments, and winter scenes — in a mix of easy and hard difficulty levels." },
            { q: "What age is this Christmas bundle suitable for?", a: "The bundle includes easy pages suitable for ages 3-6 with fewer, larger dots, and harder pages with more detail for ages 7 and up, including teens and adults who enjoy a denser holiday puzzle." },
            { q: "How do I download and print the bundle?", a: "Click the download button to save the PDF, then open it and print using standard A4 or US Letter paper. Select 'Fit to page' in your print dialog for best results." },
            { q: "Can I get an individual Christmas design instead of the whole bundle?", a: "Right now Christmas designs are only available as the full bundle PDF, not as individually browsable puzzles. If you want one specific design — for example, from your own holiday photo — use the custom generator to create it yourself." },
            { q: "Is this Christmas printable bundle really free?", a: "Yes. The bundle is free to download and print, with no sign-up and no watermark, for personal and classroom use." },
            { q: "Can I create a custom Christmas puzzle from my own photo?", a: "Yes — the free generator lets you upload any photo, including your own holiday pictures, and turns it into a numbered dot-to-dot puzzle you can download as PDF." },
        ],
        ctaTitle: "Need a specific holiday design instead?",
        ctaBody: "The bundle above covers the most-requested Christmas themes. If you want a puzzle built from your own holiday photo, a class mascot, or a specific drawing, use the free generator instead.",
        browseLibraryBtn: "Browse the full printable library",
        openGeneratorBtn: "Open the custom generator",
        schemaName: "Free Christmas Connect-the-Dots Printables",
        schemaAbout: "A free downloadable PDF bundle of Christmas connect-the-dots worksheets, easy and hard.",
        metaDescription: "Download a free Christmas connect the dots PDF bundle — Santa, trees, ornaments, easy and hard. Or generate your own custom holiday puzzle.",
    },
    es: {
        eyebrow: "Paquete navideño gratuito",
        h1: "Dibujos de Unir Puntos de Navidad para Imprimir",
        heroBody: "Descarga gratis nuestro paquete PDF de unir puntos navideños: Papá Noel, árboles, adornos y escenas de invierno, en versiones fáciles y difíciles, todo en un solo archivo listo para imprimir.",
        lastUpdated: "Última actualización: 14 de julio de 2026",
        downloadBtn: "Descargar Paquete PDF Gratis",
        tags: ["Papá Noel", "Árbol de Navidad", "Adornos", "Escena Navideña", "Actividad Escolar"],
        previewLabel: "Vista previa del paquete",
        contentCards: [
            { title: "Unir Puntos de Navidad Fácil para Niños", body: "Las fichas navideñas fáciles son ideales para una actividad corta e imprimible, perfecta para preescolar o primaria. Caras de Papá Noel, árboles, adornos y formas sencillas de invierno son más fáciles de reconocer con menos puntos, lo que mantiene la ficha divertida en lugar de frustrante." },
            { title: "Puzzles Navideños Difíciles para Niños Mayores y Adultos", body: "Las fichas navideñas difíciles funcionan bien para niños mayores y adultos que buscan un puzzle más denso, con más líneas y más detalle. Los diseños de adornos y escenas justifican los puntos extra porque la imagen final es más satisfactoria cuando se tarda más en completar." },
            { title: "Temas Navideños Más Populares", body: "Papá Noel, árboles de Navidad, adornos y escenas de invierno son los temas navideños más solicitados, y son la base de este paquete, junto con ideas de actividades para fiestas escolares y tiempo tranquilo." },
        ],
        howToTitle: "Cómo Imprimir el Paquete",
        howToSteps: [
            "Descarga el paquete PDF gratuito con el botón de arriba.",
            "Abre el archivo y revisa la vista previa antes de imprimir para que los números se lean bien.",
            "Usa papel tamaño carta o A4 estándar y elige 'ajustar a la página' en el diálogo de impresión.",
            "Para una ficha más resistente, usa cartulina después de confirmar el diseño en papel normal.",
        ],
        screenFreeTitle: "Una Actividad Navideña Sin Pantallas",
        screenFreeBody: "Las fichas navideñas de unir puntos funcionan bien como pausas cortas sin pantallas, actividad tranquila en el aula, o actividad para imprimir durante viajes y reuniones familiares. También encajan en la rotación escolar, sirviendo primero como práctica de conteo y después como actividad de colorear.",
        screenFreeTags: ["Trabajo matutino", "Centros navideños", "Actividad de viaje", "Colorear después de unir"],
        sourceLabel: "Fuente:",
        sourceText: "HealthyChildren.org (AAP) — tiempo familiar sin pantallas (en inglés)",
        faqTitle: "Preguntas Frecuentes",
        faqItems: [
            { q: "¿Qué incluye el paquete navideño gratuito para imprimir?", a: "El paquete gratuito es un único archivo PDF que contiene varios puzzles de unir puntos con temática navideña — Papá Noel, árboles de Navidad, adornos y escenas de invierno — con una mezcla de niveles de dificultad fácil y difícil." },
            { q: "¿Para qué edad es adecuado este paquete navideño?", a: "El paquete incluye fichas fáciles adecuadas para 3-6 años con menos puntos y más grandes, y fichas difíciles con más detalle para mayores de 7 años, incluyendo adolescentes y adultos que disfrutan de un puzzle navideño más denso." },
            { q: "¿Cómo descargo e imprimo el paquete?", a: "Haz clic en el botón de descarga para guardar el PDF, luego ábrelo e imprímelo en papel A4 o carta estándar. Selecciona 'Ajustar a la página' en el diálogo de impresión para mejores resultados." },
            { q: "¿Puedo obtener un diseño navideño individual en vez del paquete completo?", a: "Por ahora los diseños navideños solo están disponibles como el paquete PDF completo, no como puzzles individuales navegables. Si quieres un diseño específico —por ejemplo, a partir de tu propia foto navideña— usa el generador personalizado para crearlo tú mismo." },
            { q: "¿Este paquete navideño para imprimir es realmente gratis?", a: "Sí. El paquete es gratuito para descargar e imprimir, sin registro y sin marca de agua, para uso personal y escolar." },
            { q: "¿Puedo crear un puzzle navideño personalizado a partir de mi propia foto?", a: "Sí — el generador gratuito te permite subir cualquier foto, incluyendo tus propias fotos navideñas, y la convierte en un puzzle de puntos numerados que puedes descargar en PDF." },
        ],
        ctaTitle: "¿Necesitas un diseño navideño específico?",
        ctaBody: "El paquete de arriba cubre los temas navideños más solicitados. Si quieres un puzzle creado a partir de tu propia foto navideña, la mascota de tu clase, o un dibujo específico, usa el generador gratuito.",
        browseLibraryBtn: "Explorar toda la biblioteca de fichas",
        openGeneratorBtn: "Abrir el generador personalizado",
        schemaName: "Dibujos de Unir Puntos de Navidad Gratis para Imprimir",
        schemaAbout: "Un paquete PDF gratuito y descargable de fichas de unir puntos navideñas, fáciles y difíciles.",
        metaDescription: "Descarga gratis un paquete PDF de unir puntos navideños — Papá Noel, árboles, adornos, fácil y difícil. O genera tu propio diseño personalizado.",
    },
    it: {
        eyebrow: "Pacchetto natalizio gratuito",
        h1: "Unisci i Puntini di Natale da Stampare Gratis",
        heroBody: "Scarica il nostro pacchetto PDF gratuito di unisci i puntini di Natale — Babbo Natale, alberi, decorazioni e scene invernali, in versioni facili e difficili, tutto in un unico file da stampare.",
        lastUpdated: "Ultimo aggiornamento: 14 luglio 2026",
        downloadBtn: "Scarica il Pacchetto PDF Gratis",
        tags: ["Babbo Natale", "Albero di Natale", "Decorazioni", "Scena Natalizia", "Attività Scolastica"],
        previewLabel: "Cosa contiene il pacchetto",
        contentCards: [
            { title: "Unisci i Puntini di Natale Facile per Bambini", body: "Le schede natalizie facili sono ideali per una breve attività da stampare, perfetta per la scuola materna o elementare. Volti di Babbo Natale, alberi, decorazioni e forme invernali semplici sono più facili da riconoscere con meno puntini, il che rende la scheda divertente invece che frustrante." },
            { title: "Puzzle Natalizi Difficili per Bambini Più Grandi e Adulti", body: "Le schede natalizie difficili funzionano bene per bambini più grandi e adulti che cercano un puzzle più denso, con più linee e più dettaglio. I disegni di decorazioni e scene giustificano i puntini extra perché l'immagine finale è più soddisfacente quando richiede più tempo per essere completata." },
            { title: "I Temi Natalizi Più Popolari", body: "Babbo Natale, alberi di Natale, decorazioni e scene invernali sono i temi natalizi più richiesti, e sono la base di questo pacchetto, insieme a idee di attività adatte alla classe per feste natalizie e momenti tranquilli." },
        ],
        howToTitle: "Come Stampare il Pacchetto",
        howToSteps: [
            "Scarica il pacchetto PDF gratuito con il pulsante qui sopra.",
            "Apri il file e controlla l'anteprima prima di stampare, così i numeri restano leggibili.",
            "Usa carta A4 o Letter standard e scegli 'adatta alla pagina' nella finestra di stampa.",
            "Per una scheda più resistente, usa il cartoncino dopo aver confermato il layout su carta normale.",
        ],
        screenFreeTitle: "Un'Attività Natalizia Senza Schermi",
        screenFreeBody: "Le schede natalizie unisci i puntini funzionano bene come brevi pause senza schermi, attività tranquilla in classe, o attività da stampare durante i viaggi e le riunioni di famiglia. Si adattano anche alla rotazione scolastica, fungendo prima da esercizio di conteggio e poi da attività di colorazione.",
        screenFreeTags: ["Lavoro mattutino", "Centri natalizi", "Attività da viaggio", "Colora dopo aver unito"],
        sourceLabel: "Fonte:",
        sourceText: "HealthyChildren.org (AAP) — tempo in famiglia senza schermi (in inglese)",
        faqTitle: "Domande Frequenti",
        faqItems: [
            { q: "Cosa include il pacchetto natalizio gratuito da stampare?", a: "Il pacchetto gratuito è un singolo file PDF scaricabile che contiene diversi puzzle unisci i puntini a tema natalizio — Babbo Natale, alberi di Natale, decorazioni e scene invernali — con un mix di livelli di difficoltà facile e difficile." },
            { q: "Per quale età è adatto questo pacchetto natalizio?", a: "Il pacchetto include schede facili adatte a 3-6 anni con meno puntini e più grandi, e schede difficili con più dettaglio per gli over 7, inclusi adolescenti e adulti che amano un puzzle natalizio più denso." },
            { q: "Come scarico e stampo il pacchetto?", a: "Clicca sul pulsante di download per salvare il PDF, poi aprilo e stampalo su carta A4 o Letter standard. Seleziona 'Adatta alla pagina' nella finestra di stampa per il miglior risultato." },
            { q: "Posso avere un singolo design natalizio invece del pacchetto completo?", a: "Al momento i design natalizi sono disponibili solo come pacchetto PDF completo, non come puzzle singoli sfogliabili. Se vuoi un design specifico — per esempio dalla tua foto natalizia — usa il generatore personalizzato per crearlo tu stesso." },
            { q: "Questo pacchetto natalizio da stampare è davvero gratuito?", a: "Sì. Il pacchetto è gratuito da scaricare e stampare, senza registrazione e senza filigrana, per uso personale e scolastico." },
            { q: "Posso creare un puzzle natalizio personalizzato dalla mia foto?", a: "Sì — il generatore gratuito ti permette di caricare qualsiasi foto, incluse le tue foto natalizie, e la trasforma in un puzzle di puntini numerati che puoi scaricare in PDF." },
        ],
        ctaTitle: "Hai bisogno di un design natalizio specifico?",
        ctaBody: "Il pacchetto qui sopra copre i temi natalizi più richiesti. Se vuoi un puzzle creato dalla tua foto natalizia, dalla mascotte della classe, o da un disegno specifico, usa il generatore gratuito.",
        browseLibraryBtn: "Sfoglia tutta la libreria da stampare",
        openGeneratorBtn: "Apri il generatore personalizzato",
        schemaName: "Unisci i Puntini di Natale da Stampare Gratis",
        schemaAbout: "Un pacchetto PDF gratuito e scaricabile di schede unisci i puntini natalizie, facili e difficili.",
        metaDescription: "Scarica gratis un pacchetto PDF di unisci i puntini di Natale — Babbo Natale, alberi, decorazioni, facile e difficile. O crea il tuo puzzle personalizzato.",
    },
};

// Preview images — these illustrate what's inside the bundle.
// They are standalone showcase images, not individually downloadable puzzles.
const previewImages = [
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Christmas-Dot-To-Dot-Bundle-Hero.webp",
        alt: "Preview of the Christmas connect-the-dots bundle cover",
        label: { en: "Bundle preview", es: "Vista previa del paquete", it: "Anteprima del pacchetto" },
    },
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Hard-Christmas-Ornament-Connect-The-Dots-Adults.webp",
        alt: "Hard Christmas ornament connect-the-dots puzzle for older kids and adults",
        label: { en: "Hard puzzle sample", es: "Ejemplo puzzle difícil", it: "Esempio puzzle difficile" },
    },
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Paper-Type-Comparison-Print-Quality.webp",
        alt: "Print quality comparison for the Christmas worksheet bundle",
        label: { en: "Print quality sample", es: "Ejemplo calidad de impresión", it: "Esempio qualità di stampa" },
    },
];

function getCopy(locale: string): LocaleCopy {
    return copy[locale] ?? copy.en;
}

function buildSchemas(locale: string, c: LocaleCopy) {
    const base = "https://connectthedotsprintable.online";
    const path = locale === "en" ? "/christmas-printables/" : `/${locale}/christmas-printables/`;

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: c.schemaName,
        url: `${base}${path}`,
        about: c.schemaAbout,
        inLanguage: locale,
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: c.faqItems.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };

    return { collectionSchema, faqSchema };
}

export default function ChristmasContent({ locale }: Props) {
    const c = getCopy(locale);
    const homeHref = locale === "en" ? "/" : `/${locale}/`;
    const libraryHref = locale === "en" ? "/printable-connect-the-dots/" : `/${locale}/printable-connect-the-dots/`;
    const { collectionSchema, faqSchema } = buildSchemas(locale, c);

    return (
        <>
            <Script id="christmas-collection-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
            <Script id="christmas-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <main className="bg-slate-50 py-10">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 space-y-10">

                    {/* Hero */}
                    <section className="rounded-[2rem] bg-white p-6 md:p-10 shadow-xl">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">
                                    {c.eyebrow}
                                </p>
                                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-5">
                                    {c.h1}
                                </h1>
                                <p className="text-lg leading-8 text-gray-600 mb-4">
                                    {c.heroBody}
                                </p>
                                <p className="text-xs text-gray-400 mb-6">
                                    {c.lastUpdated}
                                </p>

                                <a
                                    href="/ChristmasDottoDot.pdf"
                                    download
                                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-blue text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all"
                                >
                                    <FileDown size={18} />
                                    {c.downloadBtn}
                                </a>

                                <div className="flex flex-wrap gap-3 text-sm mt-6">
                                    {c.tags.map((tag) => (
                                        <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                    {c.previewLabel}
                                </p>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {previewImages.map((image) => (
                                        <figure key={image.alt} className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                                            <Image src={image.src} alt={image.alt} width={320} height={320} className="aspect-square w-full rounded-2xl object-cover" />
                                            <figcaption className="mt-3 text-sm font-medium text-gray-700">
                                                {image.label[locale as keyof typeof image.label] ?? image.label.en}
                                            </figcaption>
                                        </figure>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content sections */}
                    <section className="grid gap-6 lg:grid-cols-3">
                        {c.contentCards.map((card) => (
                            <article key={card.title} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h2>
                                <p className="text-sm leading-7 text-gray-600">{card.body}</p>
                            </article>
                        ))}
                    </section>

                    {/* How to print + activity ideas */}
                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{c.howToTitle}</h2>
                            <ol className="space-y-4">
                                {c.howToSteps.map((step, index) => (
                                    <li key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue font-bold text-white">{index + 1}</span>
                                        <span className="text-sm leading-7 text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </article>

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{c.screenFreeTitle}</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-4">
                                {c.screenFreeBody}
                            </p>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {c.screenFreeTags.map((tag, i) => {
                                    const colors = ["bg-red-50 text-red-700", "bg-green-50 text-green-700", "bg-blue-50 text-blue-700", "bg-yellow-50 text-yellow-700"];
                                    return (
                                        <span key={tag} className={`rounded-full px-4 py-2 text-sm font-medium ${colors[i % colors.length]}`}>
                                            {tag}
                                        </span>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                {c.sourceLabel}{" "}
                                <a
                                    href="https://www.healthychildren.org/English/family-life/Media/Pages/helping-kids-thrive-in-a-digital-world-AAP-policy-explained.aspx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-blue hover:underline inline-flex items-center gap-1"
                                >
                                    {c.sourceText}
                                    <ExternalLink size={11} aria-hidden="true" />
                                </a>
                            </p>
                        </article>
                    </section>

                    {/* FAQ + generator CTA */}
                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{c.faqTitle}</h2>
                            <div className="space-y-5">
                                {c.faqItems.map((item) => (
                                    <div key={item.q} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                                        <h3 className="font-semibold text-gray-900">{item.q}</h3>
                                        <p className="mt-2 text-sm leading-7 text-gray-600">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-[2rem] bg-slate-900 px-8 py-10 text-white">
                            <h2 className="text-3xl font-bold mb-4">{c.ctaTitle}</h2>
                            <p className="max-w-2xl text-slate-300 leading-8 mb-6">
                                {c.ctaBody}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href={libraryHref} className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200">
                                    {c.browseLibraryBtn}
                                </Link>
                                <Link href={homeHref} className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                                    {c.openGeneratorBtn}
                                </Link>
                            </div>
                        </article>
                    </section>

                </div>
            </main>
        </>
    );
}
