import type { Metadata } from "next";
import ColoringPagesContent from "./ColoringPagesContent";
import { getAlternates, getUrl } from "@/lib/metadata";
import Script from "next/script";

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/connect-the-dots-coloring-pages/";

    return {
        title: "Free Connect the Dots Coloring Pages | Printable PDF Sheets for Kids",
        description: "Download 20+ free connect the dots coloring pages for kids. Fun printable PDF worksheets that combine dot-to-dot puzzles with coloring activities. No sign-up, instant download.",
        keywords: "connect the dots coloring pages, dot to dot coloring pages, connect the dots colouring pages, free printable coloring pages, dot to dot worksheets coloring, connect the dots printable coloring sheets",
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: "Free Connect the Dots Coloring Pages | Printable PDF Sheets for Kids",
            description: "Download 20+ free connect the dots coloring pages for kids. Fun printable PDF worksheets that combine dot-to-dot puzzles with coloring activities.",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Free Connect the Dots Coloring Pages | Printable PDF Sheets for Kids",
            description: "Download 20+ free connect the dots coloring pages for kids. Fun printable PDF worksheets that combine dot-to-dot puzzles with coloring activities.",
        },
    };
}

export default async function ConnectDotsColoringPagesPage({ params }: Props) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What are connect the dots coloring pages?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Connect the dots coloring pages are printable worksheets that combine two activities in one: first, children connect numbered dots to reveal a hidden picture, then they color it in. This dual activity keeps kids engaged longer and develops both number recognition and creative expression skills."
                }
            },
            {
                "@type": "Question",
                "name": "What age are dot to dot coloring pages suitable for?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Connect the dots coloring pages are suitable for children ages 3-10. Younger children (3-5) can start with simple 1-20 dot pages, while older kids (6-10) enjoy more complex designs with 50-100+ dots. The coloring step adds an extra creative layer that appeals to a wide age range."
                }
            },
            {
                "@type": "Question",
                "name": "How do I download and print these coloring pages?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Click the Download PDF button on any coloring page. Open the PDF file and select Print. Choose 'Fit to Page' for best results. We recommend standard A4 or Letter size paper. For coloring, regular copy paper works fine, or use cardstock for markers and paint."
                }
            },
            {
                "@type": "Question",
                "name": "What is the difference between coloring pages and connect the dots pages?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Traditional coloring pages show a pre-drawn outline for children to color. Connect the dots pages require children to draw the outline by connecting numbered dots first. Our connect the dots coloring pages combine both: connect the dots to reveal the image, then color it in for a complete two-step activity."
                }
            },
            {
                "@type": "Question",
                "name": "Are these connect the dots coloring pages really free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! All our connect the dots coloring pages are completely free to download and print. No sign-up, no payment, no watermarks. They are for personal and educational use only."
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
                "name": "Connect the Dots Coloring Pages",
                "item": "https://connectthedotsprintable.online/connect-the-dots-coloring-pages/"
            }
        ]
    };

    return (
        <>
            <Script
                id="schema-faq-coloring"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Script
                id="schema-breadcrumb-coloring"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ColoringPagesContent />
        </>
    );
}
