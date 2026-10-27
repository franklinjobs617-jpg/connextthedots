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
    const isIt = locale === "it";
    const title = isEs
        ? "Dibujos de Unir Puntos de Navidad Gratis | Paquete PDF"
        : isIt
        ? "Unisci i Puntini di Natale Gratis | Pacchetto PDF"
        : "Free Christmas Connect the Dots Printables | PDF Bundle";
    const description = isEs
        ? "Descarga PDF gratis de unir puntos de Navidad: árbol y regalos de 40 puntos y adorno de 150 puntos, con soluciones en A4 y tamaño carta."
        : isIt
        ? "Scarica PDF gratuiti di unisci i puntini di Natale: albero e regali da 40 punti e decorazione da 150 punti, con soluzioni in A4 e formato Letter."
        : locale === "en"
        ? "Download free Christmas dot-to-dot PDFs: a 40-point tree and presents puzzle and a 150-point ornament, with matching answers in A4 and US Letter."
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
