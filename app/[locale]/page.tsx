import type { Metadata } from "next";
import HomeContentComponent from "@/components/HomeContent";
import { getAlternates, getUrl } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: "metadata" });
    const path = "/";
    return {
        title: t("homeTitle"),
        description: t("homeDesc"),
        alternates: getAlternates(locale, path),

        openGraph: {
            title: t("homeTitle"),
            description: t("homeDesc"),
            url: getUrl(locale, path),
        },

        twitter: {
            card: "summary_large_image",
            title: t("homeTitle"),
            description: t("homeDesc"),
        },
    };
}



export default function HomeContent() {
    return <HomeContentComponent />
}