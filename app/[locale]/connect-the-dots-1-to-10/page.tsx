import type { Metadata } from "next";
import ConnectDots1to10Content from "./ConnectDots1to10Content";
import { getAlternates, getUrl } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import Script from "next/script";

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/connect-the-dots-1-to-10/";

    return {
        title: "Free Connect the Dots 1 to 10 Printables | Easy Worksheets for Toddlers",
        description: "Download 20+ free connect the dots 1 to 10 printables for toddlers and preschoolers. Easy PDF worksheets with large dots and simple shapes. Instant download, no sign-up.",
        keywords: "connect the dots 1 to 10, dot to dot 1-10, easy connect the dots for toddlers, free printable dot to dot worksheets, connect the dots for preschoolers",
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: "Free Connect the Dots 1 to 10 Printables | Easy Worksheets for Toddlers",
            description: "Download 20+ free connect the dots 1 to 10 printables for toddlers and preschoolers. Easy PDF worksheets with large dots and simple shapes.",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Free Connect the Dots 1 to 10 Printables | Easy Worksheets for Toddlers",
            description: "Download 20+ free connect the dots 1 to 10 printables for toddlers and preschoolers. Easy PDF worksheets with large dots and simple shapes.",
        },
    };
}

export default async function ConnectDots1to10Page({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "faq" });

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What age are connect the dots 1 to 10 worksheets for?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Connect the dots 1 to 10 worksheets are designed for children ages 2-5. Toddlers (ages 2-3) can start with the simplest shapes, while preschoolers (ages 4-5) can use them to reinforce number recognition and fine motor skills."
                }
            },
            {
                "@type": "Question",
                "name": "How do I print these dot to dot worksheets?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Click the Download PDF button on any worksheet. Open the PDF file and select Print. Choose 'Fit to Page' in your printer settings for the best results. We recommend using standard A4 or Letter size paper."
                }
            },
            {
                "@type": "Question",
                "name": "Are these connect the dots 1 to 10 printables really free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! All our connect the dots 1 to 10 printables are completely free to download and print. No sign-up, no payment, no watermarks. They are for personal and educational use."
                }
            },
            {
                "@type": "Question",
                "name": "What comes after connect the dots 1 to 10?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Once your child masters 1 to 10, try our connect the dots 1 to 20 worksheets for the next challenge. This gradual progression helps build confidence while developing counting skills."
                }
            },
            {
                "@type": "Question",
                "name": "Can teachers use these worksheets in the classroom?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! These worksheets are perfect for classroom use. Teachers can print them for math centers, morning work, or as a quiet activity. They align with early childhood education standards for number recognition and fine motor development."
                }
            }
        ]
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://connectthedotsprintable.online/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Connect the Dots 1 to 10",
                "item": "https://connectthedotsprintable.online/connect-the-dots-1-to-10/"
            }
        ]
    };

    return (
        <>
            <Script
                id="schema-faq-1to10"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Script
                id="schema-breadcrumb-1to10"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ConnectDots1to10Content />
        </>
    );
}
