import { Metadata } from "next";
import { redirect } from "next/navigation";
import PrintableListClient from "./PrintableClient";
import { printablesData as dataEN, getAllPrintables as getAllEN } from "@/lib/printables-data";
import { printablesData as dataES, getAllPrintables as getAllES } from "@/lib/printables-data-es";
import { printablesData as dataPT, getAllPrintables as getAllPT } from "@/lib/printables-data-pt";
import { printablesData as dataFR, getAllPrintables as getAllFR } from "@/lib/printables-data-fr";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "es" }, { locale: "de" }, { locale: "pt" }, { locale: "fr" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";
    const isPt = locale === "pt";
    const isFr = locale === "fr";

    let title, description;

    if (isFr) {
        title = "Points à Relier à Imprimer Gratuits | Fiches PDF pour Enfants";
        description = "Collection gratuite de fiches point à relier à imprimer. Cahier de points à relier PDF de haute qualité pour enfants et adultes. Téléchargez et imprimez gratuitement !";
    } else if (isPt) {
        title = "Ligar os Pontos para Imprimir Grátis | Desenhos PDF para Crianças";
        description = "Coleção gratuita de desenhos de ligar os pontos para imprimir. Folhas de ligar os pontos em PDF de alta qualidade para crianças e adultos. Baixe e imprima grátis!";
    } else if (isEs) {
        title = "Fichas de Unir Puntos para Imprimir Gratis | Dibujos de Unir Puntos para Niños";
        description = "Descubre nuestra gran colección de fichas de unir puntos para imprimir y dibujos de unir puntos para niños y adultos. Diseños de alta calidad, sin marcas de agua, listos para descargar.";
    } else {
        title = "Free Connect the Dots Worksheets & Dot to Dot Puzzles | Printables for All Ages";
        description = "Discover our vast collection of free printable connect the dots worksheets & dot to dot puzzles for kids and adults. Enjoy high-quality, no-watermark designs, ready to download and print.";
    }

    const path = "/printable-connect-the-dots/";

    return {
        title,
        description,
        alternates: getAlternates(locale, path),

        openGraph: {
            title,
            description,
            url: getUrl(locale, path),
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;

    const isEs = locale === "es";
    const isPt = locale === "pt";
    const isFr = locale === "fr";

    let data, allItems;

    if (isFr) {
        data = dataFR;
        allItems = getAllFR();
    } else if (isPt) {
        data = dataPT;
        allItems = getAllPT();
    } else if (isEs) {
        data = dataES;
        allItems = getAllES();
    } else {
        data = dataEN;
        allItems = getAllEN();
    }

    return (
        <PrintableListClient
            locale={locale}
            data={data}
            allItems={allItems}
        />
    );
}