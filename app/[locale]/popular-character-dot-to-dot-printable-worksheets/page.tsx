import type { Metadata } from "next";
import PageContent from "./PageContent";
import { getAlternates, getUrl } from "@/lib/metadata";
import { getAllPrintables } from "@/lib/printables-data";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "popular-character-dot-to-dot-printable-worksheets";

    const title = "Themed Dot to Dot Worksheets for Kids | Free Printable PDFs";
    const description =
        "Free connect the dots worksheets for kids by theme: animals, vehicles, fantasy, and more. Download PDFs or generate a custom puzzle from any photo.";

    return {
        title,
        description,
        authors: [{ name: "Connect the Dots Printable" }],
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title,
            description,
        },
    };
}

// 主题分组：全部基于 printables-data.ts 中真实存在的分类，不含任何第三方版权角色
const THEME_GROUPS = [
    { key: "Animals", label: "Animals", categories: ["Animals"] },
    { key: "Fantasy", label: "Fantasy", categories: ["Fantasy"] },
    { key: "Vehicles", label: "Vehicles & Space", categories: ["Vehicles", "Space", "Robots"] },
    { key: "Nature", label: "Nature & Scenery", categories: ["Nature", "Scenery", "Buildings"] },
] as const;

export default async function PopularCharacterPage() {
    const allItems = getAllPrintables();

    const themeSummary = THEME_GROUPS.map((group) => {
        const items = allItems.filter((item) =>
            item.category.some((c) => (group.categories as readonly string[]).includes(c))
        );
        return {
            label: group.label,
            count: items.length,
            sample: items.slice(0, 3),
        };
    });

    return <PageContent themeSummary={themeSummary} />;
}
