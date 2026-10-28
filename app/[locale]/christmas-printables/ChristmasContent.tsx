"use client";

import Script from "next/script";
import ChristmasPrintableDownloads, { getChristmasFaqs } from "./ChristmasPrintableDownloads";

const schemaNames = {
  "en": "Free Christmas Connect-the-Dots Printables",
  "es": "Dibujos de Unir Puntos de Navidad Gratis para Imprimir",
  "it": "Unisci i Puntini di Natale da Stampare Gratis"
};
const approvedAbout = {
  "en": "Two free Christmas dot-to-dot worksheets: a 40-point tree and presents and a 150-point ornament, each with separate A4 and US Letter Puzzle and Solution PDFs.",
  "es": "Dos fichas gratuitas de unir puntos navideños: árbol y regalos de 40 puntos y adorno de 150 puntos, cada una con PDF de actividad y solución en A4 y tamaño carta.",
  "it": "Due schede gratuite di unisci i puntini natalizi: albero e regali da 40 punti e decorazione da 150 punti, ciascuna con PDF puzzle e soluzione in A4 e formato Letter."
};

// Existing non-approved locale behavior is frozen. These old English fallback
// schema facts are intentionally unchanged; this approval does not cover them.
const legacyFallbackSchema = {
  "schemaName": "Free Christmas Connect-the-Dots Printables",
  "schemaAbout": "A free downloadable PDF bundle of Christmas connect-the-dots worksheets, easy and hard.",
  "faqItems": [
    {
      "q": "What's included in the free Christmas printable bundle?",
      "a": "The free bundle is a single PDF download containing multiple Christmas-themed connect-the-dots puzzles — Santa, Christmas trees, ornaments, and winter scenes — in a mix of easy and hard difficulty levels."
    },
    {
      "q": "What age is this Christmas bundle suitable for?",
      "a": "The bundle includes easy pages suitable for ages 3-6 with fewer, larger dots, and harder pages with more detail for ages 7 and up, including teens and adults who enjoy a denser holiday puzzle."
    },
    {
      "q": "How do I download and print the bundle?",
      "a": "Click the download button to save the PDF, then open it and print using standard A4 or US Letter paper. Select 'Fit to page' in your print dialog for best results."
    },
    {
      "q": "Can I get an individual Christmas design instead of the whole bundle?",
      "a": "Right now Christmas designs are only available as the full bundle PDF, not as individually browsable puzzles. If you want one specific design — for example, from your own holiday photo — use the custom generator to create it yourself."
    },
    {
      "q": "Is this Christmas printable bundle really free?",
      "a": "Yes. The bundle is free to download and print, with no sign-up and no watermark, for personal and classroom use."
    },
    {
      "q": "Can I create a custom Christmas puzzle from my own photo?",
      "a": "Yes — the free generator lets you upload any photo, including your own holiday pictures, and turns it into a numbered dot-to-dot puzzle you can download as PDF."
    }
  ]
};

export default function ChristmasContent({ locale }: { locale: string }) {
    const approvedLocale = locale === "en" || locale === "es" || locale === "it" ? locale : null;
    const path = locale === "en" ? "/christmas-printables/" : `/${locale}/christmas-printables/`;
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: approvedLocale ? schemaNames[approvedLocale] : legacyFallbackSchema.schemaName,
        url: `https://connectthedotsprintable.online${path}`,
        about: approvedLocale ? approvedAbout[approvedLocale] : legacyFallbackSchema.schemaAbout,
        inLanguage: locale,
    };
    const faqItems = approvedLocale ? getChristmasFaqs(locale) : legacyFallbackSchema.faqItems;
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map(f => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };
    return <>
        {approvedLocale ? <>
            <script id="christmas-collection-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
            <script id="christmas-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </> : <>
            <Script id="christmas-collection-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
            <Script id="christmas-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </>}
        <ChristmasPrintableDownloads locale={locale} />
    </>;
}
