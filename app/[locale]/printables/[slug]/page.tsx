import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPrintables as getAllEN, printablesData as dataEN } from "@/lib/printables-data";
import { getAllPrintables as getAllES, printablesData as dataES } from "@/lib/printables-data-es";
import PrintableDetailClient from "./PrintableDetailClient";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

// 获取对应语言的数据集
function getLocaleData(locale: string) {
    return locale === "es" ? { data: dataES, all: getAllES() } : { data: dataEN, all: getAllEN() };
}

// 1. 批量生成静态路径 (SSG)
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

// 2. 动态生成元数据 (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const { all } = getLocaleData(locale);
    const item = all.find((i) => i.id === slug);

    if (!item) return {};

    const path = `/printables/${slug}/`;

    return {
        title: `${item.title} | ${item.difficulty} Dot to Dot Printable (${Array.isArray(item.dotRange) ? item.dotRange.join('-') : item.dotRange} Dots)`,
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

// 3. 服务端渲染入口
export default async function Page({ params }: Props) {
    const { locale, slug } = await params;
    const { data, all } = getLocaleData(locale);

    let item = all.find((i) => i.id === slug);
    
    // 如果在静态数据中找不到，尝试从数据库获取动态数据
    if (!item) {
        try {
            const res = await fetch(`/api/connect-dots/${slug}`, { cache: "no-store" });
            if (res.ok) {
                const puzzle = await res.json();
                item = {
                    id: puzzle.slug,
                    title: puzzle.title,
                    description: puzzle.description,
                    imageUrl: puzzle.puzzleImageUrl,
                    imageSrcset: `${puzzle.puzzleImageUrl} 600w`,
                    solutionUrl: puzzle.puzzleImageUrl, // 假设 solutionUrl 与 puzzleImageUrl 相同
                    solutionAltText: `${puzzle.title} solution`,
                    dotRange: [1, puzzle.dotCount],
                    difficulty: puzzle.difficulty,
                    category: [], // 动态数据可能没有分类
                    ageRecommendation: "All Ages", // 动态数据可能没有年龄推荐
                    popularity: 0, // 动态数据可能没有 popularity
                    altText: puzzle.title,
                    detailPage: `/printables/${puzzle.slug}`,
                    tagColor: "bg-brand-blue"
                };
            }
        } catch (error) {
            console.error("Error fetching dynamic puzzle:", error);
        }
    }

    if (!item) notFound();

    // 查找同难度的所有卡片
    const difficultyKey = Object.keys(data).find(key =>
        data[key].some(i => i.id === slug)
    ) || "easy";

    const relatedItems = data[difficultyKey].filter(i => i.id !== slug);
    console.log(relatedItems);
    return (
        <PrintableDetailClient
            item={item}
            relatedItems={relatedItems}
            locale={locale}
            slug={slug}
        />
    );
}