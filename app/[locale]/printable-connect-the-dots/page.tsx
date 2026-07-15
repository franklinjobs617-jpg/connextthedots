import { Metadata } from "next";
import PrintableClient from "./PrintableClient";
import { printablesData as dataEN, getAllPrintables as getAllEN } from "@/lib/printables-data";
import { printablesData as dataDE, getAllPrintables as getAllDE } from "@/lib/printables-data-de";
import { printablesData as dataES, getAllPrintables as getAllES } from "@/lib/printables-data-es";
import { printablesData as dataPT, getAllPrintables as getAllPT } from "@/lib/printables-data-pt";
import { printablesData as dataFR, getAllPrintables as getAllFR } from "@/lib/printables-data-fr";
import { printablesData as dataIT, getAllPrintables as getAllIT } from "@/lib/printables-data-it";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return [
        { locale: "en" },
        { locale: "de" },
        { locale: "es" },
        { locale: "pt" },
        { locale: "fr" },
        { locale: "it" },
    ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const meta: Record<string, { title: string; description: string }> = {
        en: {
            title: "Free Connect the Dots Printables for Kids & Adults | PDF Worksheets",
            description:
                "Browse 50+ free connect the dots printables by age, difficulty, and theme. Download animal, holiday, easy and hard PDF worksheets — or make your own custom dot-to-dot from any photo.",
        },
        de: {
            title: "Zahlen Verbinden zum Ausdrucken Kostenlos | Punkt-zu-Punkt PDF",
            description:
                "Kostenlose Punkt-zu-Punkt Ausmalbilder zum Ausdrucken für Kinder und Erwachsene. Tiere, Weihnachten, einfach und schwer — als PDF herunterladen oder eigenes Bild hochladen.",
        },
        fr: {
            title: "Points à Relier à Imprimer Gratuits | Fiches PDF Enfants & Adultes",
            description:
                "Collection gratuite de points à relier à imprimer par âge, difficulté et thème. Téléchargez des fiches PDF animaux, Noël, faciles et difficiles — ou créez les vôtres depuis une photo.",
        },
        it: {
            title: "Unisci i Puntini da Stampare Gratis | Schede PDF",
            description:
                "Oltre 50 schede unisci i puntini da stampare gratis per bambini e adulti. PDF facili e difficili, animali e Natale — crea anche il tuo puzzle da una foto.",
        },
        es: {
            title: "Fichas de Unir Puntos para Imprimir Gratis | PDF para Niños y Adultos",
            description:
                "Más de 50 fichas de unir puntos para imprimir gratis por edad, dificultad y tema. Descarga PDF de animales, Navidad, fáciles y difíciles — o crea los tuyos desde una foto.",
        },
        pt: {
            title: "Ligar os Pontos para Imprimir Grátis | Fichas PDF para Crianças e Adultos",
            description:
                "Mais de 50 fichas de ligar os pontos para imprimir grátis por idade, dificuldade e tema. Baixe PDF de animais, Natal, fáceis e difíceis — ou crie o seu a partir de uma foto.",
        },
    };

    const { title, description } = meta[locale] ?? meta.en;
    const path = "/printable-connect-the-dots/";

    return {
        title,
        description,
        alternates: getAlternates(locale, path),
        openGraph: {
            title,
            description,
            url: getUrl(locale, path),
            type: "website",
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;

    const dataMap: Record<string, { data: any; allItems: any[] }> = {
        de: { data: dataDE, allItems: getAllDE() },
        fr: { data: dataFR, allItems: getAllFR() },
        it: { data: dataIT, allItems: getAllIT() },
        es: { data: dataES, allItems: getAllES() },
        pt: { data: dataPT, allItems: getAllPT() },
    };

    const { data, allItems } = dataMap[locale] ?? { data: dataEN, allItems: getAllEN() };

    return <PrintableClient locale={locale} data={data} allItems={allItems} />;
}
