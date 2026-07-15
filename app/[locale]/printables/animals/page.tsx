import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AnimalPageClient from "./AnimalPageClient";
import { getAlternates, getUrl } from "@/lib/metadata";
import { getAllPrintables } from "@/lib/printables-data";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/printables/animals/";

    const title = "Animales para Unir con Puntos | Fichas Gratis para Imprimir";
    const description =
        "Dibujos de animales para unir con puntos, listos para imprimir gratis. Descarga fichas en PDF o crea tu propio diseño personalizado a partir de una foto.";

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

    // 防御性兜底：next.config.ts 已经对非 es 前缀做了 301 跳转，
    // 这里再加一层保护，避免任何遗漏的语言前缀直接访问到未本地化的内容
    if (locale !== "es") {
        redirect("/free-animal-dot-to-dot-printables-pdf/");
    }

    const allItems = getAllPrintables();
    const animalItems = allItems.filter((item) => item.category.includes("Animals"));

    return <AnimalPageClient items={animalItems} />;
}
