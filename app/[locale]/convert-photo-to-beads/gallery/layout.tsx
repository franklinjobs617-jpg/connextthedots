import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });

    return {
        title: t("beadsGalleryTitle"),
        description: t("beadsGalleryDesc"),
        openGraph: {
            title: t("beadsGalleryTitle"),
            description: t("beadsGalleryDesc"),
            type: "website",
        },
    };
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
