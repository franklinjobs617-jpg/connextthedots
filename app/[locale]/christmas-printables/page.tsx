import type { Metadata } from "next";
import ChristmasContent from "./ChristmasContent";
import { getAlternates, getUrl } from "@/lib/metadata";
import Script from "next/script";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/christmas-printables/";

    const isEs = locale === "es";
    const title = isEs
        ? "Dibujos de Unir Puntos de Navidad Gratis | Paquete PDF"
        : "Free Christmas Connect the Dots Printables | PDF Bundle";
    const description = isEs
        ? "Descarga gratis un paquete PDF de unir puntos navideños — Papá Noel, árboles, adornos, fácil y difícil. O genera tu propio diseño personalizado."
        : "Download a free Christmas connect the dots PDF bundle — Santa, trees, ornaments, easy and hard. Or generate your own custom holiday puzzle.";

    return {
        title,
        description,
        alternates: getAlternates(locale, path),
        openGraph: {
            url: getUrl(locale, path),
            title,
            description,
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What's included in the free Christmas printable bundle?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The free bundle is a single PDF download containing multiple Christmas-themed connect-the-dots puzzles — Santa, Christmas trees, ornaments, and winter scenes — in a mix of easy and hard difficulty levels."
                }
            },
            {
                "@type": "Question",
                "name": "What age is this Christmas bundle suitable for?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The bundle includes easy pages suitable for ages 3-6 with fewer, larger dots, and harder pages with more detail for ages 7 and up, including teens and adults who enjoy a denser holiday puzzle."
                }
            },
            {
                "@type": "Question",
                "name": "How do I download and print the bundle?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Click the download button to save the PDF, then open it and print using standard A4 or US Letter paper. Select 'Fit to page' in your print dialog for best results."
                }
            },
            {
                "@type": "Question",
                "name": "Can I get an individual Christmas design instead of the whole bundle?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Right now Christmas designs are only available as the full bundle PDF, not as individually browsable puzzles. If you want one specific design — for example, from your own holiday photo — use the custom generator to create it yourself."
                }
            },
            {
                "@type": "Question",
                "name": "Is this Christmas printable bundle really free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. The bundle is free to download and print, with no sign-up and no watermark, for personal and classroom use."
                }
            },
            {
                "@type": "Question",
                "name": "Can I create a custom Christmas puzzle from my own photo?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes — the free generator lets you upload any photo, including your own holiday pictures, and turns it into a numbered dot-to-dot puzzle you can download as PDF."
                }
            }
        ]
    };

    return (
        <>
            <Script
                id="christmas-faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <ChristmasContent locale={locale} />
        </>
    );
}
