import { Metadata } from "next";
import { redirect } from "next/navigation";
import PrintableListClient from "./PrintableClient";
import { printablesData as dataEN, getAllPrintables as getAllEN } from "@/lib/printables-data";
import { printablesData as dataES, getAllPrintables as getAllES } from "@/lib/printables-data-es";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "es" }, { locale: "de" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    const title = isEs
        ? "Fichas de Unir Puntos para Imprimir Gratis | Dibujos de Unir Puntos para Niños"
        : "Free Connect the Dots Worksheets & Dot to Dot Puzzles | Printables for All Ages";

    const description = isEs
        ? "Descubre nuestra gran colección de fichas de unir puntos para imprimir y dibujos de unir puntos para niños y adultos. Diseños de alta calidad, sin marcas de agua, listos para descargar."
        : "Discover our vast collection of free printable connect the dots worksheets & dot to dot puzzles for kids and adults. Enjoy high-quality, no-watermark designs, ready to download and print.";

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
    const data = isEs ? dataES : dataEN;
    const allItems = isEs ? getAllES() : getAllEN();

    return (
        <PrintableListClient
            locale={locale}
            data={data}
            allItems={allItems}
        />
    );
}