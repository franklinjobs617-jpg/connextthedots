import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPrintables as getAllEN, printablesData as dataEN } from "@/lib/printables-data";
import { getAllPrintables as getAllES, printablesData as dataES } from "@/lib/printables-data-es";
import PrintableDetailClient from "./PrintableDetailClient";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

function getLocaleData(locale: string) {
    return locale === "es" ? { data: dataES, all: getAllES() } : { data: dataEN, all: getAllEN() };
}

type DynamicPuzzle = {
    slug: string;
    title: string;
    description: string;
    difficulty: string;
    puzzleImageUrl: string;
    dotCount: number;
};

function buildDynamicItem(puzzle: DynamicPuzzle) {
    return {
        id: puzzle.slug,
        title: puzzle.title,
        description: puzzle.description,
        difficulty: puzzle.difficulty,
        tagColor: "bg-brand-blue",
        imageUrl: puzzle.puzzleImageUrl,
        imageSrcset: `${puzzle.puzzleImageUrl} 600w`,
        altText: puzzle.title,
        detailPage: `/printables/${puzzle.slug}/`,
        solutionUrl: puzzle.puzzleImageUrl,
        solutionAltText: `${puzzle.title} solution`,
        category: [],
        dotRange: [1, puzzle.dotCount],
        ageRecommendation: "All Ages",
        popularity: 0,
    };
}

export async function generateStaticParams() {
    const locales = ["en", "es"];
    const paths: { locale: string; slug: string }[] = [];

    locales.forEach((locale) => {
        const { all } = getLocaleData(locale);
        all.forEach((item) => {
            paths.push({ locale, slug: item.id });
        });
    });
    return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const { all } = getLocaleData(locale);
    let item = all.find((i) => i.id === slug);

    if (!item) {
        try {
            const res = await fetch(`/api/connect-dots/${slug}`, { cache: "no-store" });
            if (res.ok) {
                item = buildDynamicItem(await res.json());
            }
        } catch (error) {
            console.error("Error fetching dynamic puzzle for metadata:", error);
        }
    }

    if (!item) return {};

    const path = `/printables/${slug}/`;

    return {
        title: `${item.title} | ${item.difficulty} Dot to Dot Printable (${Array.isArray(item.dotRange) ? item.dotRange.join("-") : item.dotRange} Dots)`,
        description: item.description,
        alternates: getAlternates(locale, path),
        openGraph: {
            title: item.title,
            description: item.description,
            url: getUrl(locale, path),
            type: "article",
            images: [{ url: item.imageUrl, width: 600, height: 600, alt: item.altText }],
        },
        twitter: {
            card: "summary_large_image",
            title: item.title,
            description: item.description,
            images: [item.imageUrl],
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale, slug } = await params;
    const { data, all } = getLocaleData(locale);

    let item = all.find((i) => i.id === slug);

    if (!item) {
        try {
            const res = await fetch(`/api/connect-dots/${slug}`, { cache: "no-store" });
            if (res.ok) {
                item = buildDynamicItem(await res.json());
            }
        } catch (error) {
            console.error("Error fetching dynamic puzzle:", error);
        }
    }

    if (!item) notFound();

    const difficultyKey =
        Object.keys(data).find((key) => data[key].some((entry) => entry.id === slug)) || "easy";

    const relatedItems = data[difficultyKey].filter((entry) => entry.id !== slug);

    return <PrintableDetailClient item={item} relatedItems={relatedItems} locale={locale} slug={slug} />;
}
