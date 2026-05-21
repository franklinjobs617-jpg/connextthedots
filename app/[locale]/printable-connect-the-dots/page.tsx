import { Metadata } from "next";
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

    let title: string;
    let description: string;

    if (isFr) {
        title = "Points 脿 Relier 脿 Imprimer Gratuits | Fiches PDF pour Enfants";
        description = "Collection gratuite de fiches point 脿 relier 脿 imprimer. Cahier de points 脿 relier PDF de haute qualit茅 pour enfants et adultes. T茅l茅chargez et imprimez gratuitement !";
    } else if (isPt) {
        title = "Ligar os Pontos para Imprimir Gr谩tis | Desenhos PDF para Crian莽as";
        description = "Cole莽茫o gratuita de desenhos de ligar os pontos para imprimir. Folhas de ligar os pontos em PDF de alta qualidade para crian莽as e adultos. Baixe e imprima gr谩tis!";
    } else if (isEs) {
        title = "Fichas de Unir Puntos para Imprimir Gratis | Dibujos de Unir Puntos para Ni帽os";
        description = "Descubre nuestra gran colecci贸n de fichas de unir puntos para imprimir y dibujos de unir puntos para ni帽os y adultos. Dise帽os de alta calidad, sin marcas de agua, listos para descargar.";
    } else {
        title = "Free Connect the Dots Printables for Kids and Adults | PDF Worksheets";
        description = "Browse free connect the dots printables by age, difficulty, and theme. Download animal, holiday, easy, and hard PDF worksheets or make your own custom dot-to-dot online.";
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

    let data;
    let allItems;

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

    return <PrintableListClient locale={locale} data={data} allItems={allItems} />;
}
