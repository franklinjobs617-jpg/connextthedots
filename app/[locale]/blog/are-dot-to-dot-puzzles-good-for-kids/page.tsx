import type { Metadata } from "next";
import BlogContent from "./BlogContent";
import { getAlternates, getUrl } from "@/lib/metadata";
import Script from "next/script";

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/blog/are-dot-to-dot-puzzles-good-for-kids/";

    return {
        title: "Are Dot to Dot Puzzles Good for Kids? 7 Proven Benefits (2026)",
        description: "Discover 7 science-backed benefits of dot to dot puzzles for children. Learn how connect the dots activities improve motor skills, math ability, and focus in kids ages 2-10.",
        keywords: "are dot to dot puzzles good for kids, connect the dots benefits, dot to dot educational, connect the dots for kids learning, dot to dot motor skills",
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: "Are Dot to Dot Puzzles Good for Kids? 7 Proven Benefits",
            description: "Discover 7 science-backed benefits of dot to dot puzzles for children. Learn how connect the dots activities improve motor skills, math ability, and focus.",
            type: "article",
            publishedTime: "2026-05-01T00:00:00Z",
            authors: ["ConnectTheDotsPrintable"],
        },
        twitter: {
            card: "summary_large_image",
            title: "Are Dot to Dot Puzzles Good for Kids? 7 Proven Benefits",
            description: "Discover 7 science-backed benefits of dot to dot puzzles for children.",
        },
    };
}

export default async function BlogPost({ params }: Props) {
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Are Dot to Dot Puzzles Good for Kids? 7 Proven Benefits",
        "description": "Discover 7 science-backed benefits of dot to dot puzzles for children ages 2-10.",
        "author": {
            "@type": "Organization",
            "name": "ConnectTheDotsPrintable",
            "url": "https://connectthedotsprintable.online"
        },
        "publisher": {
            "@type": "Organization",
            "name": "ConnectTheDotsPrintable",
            "url": "https://connectthedotsprintable.online"
        },
        "datePublished": "2026-05-01",
        "dateModified": "2026-05-01",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://connectthedotsprintable.online/blog/are-dot-to-dot-puzzles-good-for-kids/"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "At what age should kids start doing dot to dot puzzles?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Children can start simple dot to dot puzzles (1-10 dots) as early as age 2-3. By age 4-5, they can handle 1-20 dots, and by age 6-8, they can work on more complex puzzles with 50+ dots. The key is matching the difficulty to the child's number recognition ability."
                }
            },
            {
                "@type": "Question",
                "name": "How long should a child spend on dot to dot puzzles?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For toddlers (2-3 years), 5-10 minutes is ideal. Preschoolers (4-5 years) can work for 10-15 minutes. School-age children (6-10 years) can spend 15-20 minutes. Watch for signs of frustration or fatigue and stop before the activity becomes stressful."
                }
            },
            {
                "@type": "Question",
                "name": "Are dot to dot puzzles better than coloring pages?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Both activities have unique benefits. Dot to dot puzzles specifically develop number sequencing, counting skills, and hand-eye coordination. Coloring pages focus more on creativity and color recognition. Ideally, children should do both activities as they complement each other well."
                }
            },
            {
                "@type": "Question",
                "name": "Can dot to dot puzzles help with ADHD?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dot to dot puzzles can be beneficial for children with ADHD. The structured, sequential nature of the activity helps practice sustained attention and focus. The clear goal (revealing a hidden picture) provides motivation, and the finite length makes it manageable. However, start with shorter puzzles (10-20 dots) to build confidence."
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
                "name": "Blog",
                "item": "https://connectthedotsprintable.online/blog/"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Are Dot to Dot Puzzles Good for Kids?",
                "item": "https://connectthedotsprintable.online/blog/are-dot-to-dot-puzzles-good-for-kids/"
            }
        ]
    };

    return (
        <>
            <Script
                id="schema-article"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <Script
                id="schema-faq-blog"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Script
                id="schema-breadcrumb-blog"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <BlogContent />
        </>
    );
}
