import type { Metadata } from "next";
import ChristmasContent from "./ChristmasContent";
import { getAlternates, getUrl } from "@/lib/metadata";

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
    return <ChristmasContent locale={locale} />;
}
