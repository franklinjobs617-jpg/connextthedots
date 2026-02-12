import { Metadata } from "next";
import AnimalPageClient from "./AnimalPageClient";
import { getAlternates, getUrl } from "@/lib/metadata";
type Props = {
    params: { locale: string };
};

// 2. 动态元数据逻辑
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    // 核心逻辑：只有 es 使用西语，de 和 en 统一使用英文 Metadata
    const isEs = locale === "es";

    const title = isEs
        ? "Dibujos de Animales para Unir Puntos: Diversión Educativa y Fichas Realistas"
        : "Animal Connect the Dots Printable: Educational Fun & Lifelike Wildlife Templates";

    const description = isEs
        ? "¡Descarga gratis nuestra colección de dibujos de animales para unir puntos! Ofrecemos fichas educativas con vida silvestre real, ideales para niños y adultos. ¡Descarga e imprime ahora!"
        : "Get free watermark-free connect the dots printables for kids & adults. Create custom dot-to-dot activities with our generator, instant download in PDF/HD image.";


    const path = "printables/animals/";

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
    return <AnimalPageClient locale={locale} />;
}