"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import PrintableCard from "@/components/PrintableCard";
import type { PrintableItem } from "@/lib/printables-data";

type Props = {
    items: PrintableItem[];
};

const FAQ_ITEMS = [
    {
        q: "¿Qué son los dibujos de animales para unir con puntos?",
        a: "Son fichas donde puntos numerados forman el contorno de un animal. Al trazar una línea del punto 1 al 2, del 2 al 3 y así sucesivamente, aparece el dibujo del animal. Son ideales para practicar el conteo y la motricidad fina mientras los niños descubren qué animal se esconde.",
    },
    {
        q: "¿Estas fichas de animales son gratis para imprimir?",
        a: "Sí. Todas las fichas de esta colección son gratuitas, sin marca de agua y sin necesidad de registro. Solo tienes que hacer clic en cualquier diseño, abrir la versión completa y descargar el PDF.",
    },
    {
        q: "¿Para qué edad son adecuadas estas fichas de animales?",
        a: "Las fichas fáciles con 10 a 25 puntos son ideales para niños de 3 a 6 años. Las de dificultad media, con 25 a 70 puntos, funcionan bien para niños de 6 a 10 años que ya dominan el conteo. Para desafíos mayores, revisa nuestra colección de fichas difíciles y extremas.",
    },
    {
        q: "¿Puedo crear mi propia ficha de un animal a partir de una foto?",
        a: "Sí. Usa el generador para subir la foto de tu mascota o animal favorito y conviértela en una ficha de unir puntos personalizada, con la cantidad de puntos que prefieras. No necesitas ninguna habilidad de diseño.",
    },
    {
        q: "¿Cómo imprimo correctamente una ficha de unir puntos?",
        a: "Haz clic en cualquier ficha para abrir la página de detalle y usa la función de impresión de tu navegador (Ctrl+P o Cmd+P). Selecciona 'Ajustar a la página' e imprime en papel tamaño carta o A4 para que los números se vean claros.",
    },
    {
        q: "¿Qué diferencia hay entre unir puntos y un dibujo para colorear?",
        a: "En un dibujo para colorear, el contorno ya está completo y solo falta pintarlo. En una ficha de unir puntos, el niño primero debe trazar el contorno conectando los números en orden, y después puede colorearlo. Combina así el aprendizaje numérico con la creatividad.",
    },
];

const RELATED_LINKS = [
    { href: "/es/printable-connect-the-dots/", title: "Todas las Fichas para Imprimir", desc: "Explora la colección completa por dificultad y tema." },
    { href: "/es/christmas-printables/", title: "Unir Puntos de Navidad", desc: "Papá Noel, árboles y escenas navideñas." },
    { href: "/es/connect-the-dots-1-to-10/", title: "Unir Puntos del 1 al 10", desc: "Fichas sencillas para los más pequeños." },
    { href: "/es/how-to-make/", title: "Cómo Crear tu Propio Diseño", desc: "Guía paso a paso usando el generador." },
];

const LAST_UPDATED = "15 de julio de 2026";

function buildJsonLd(items: PrintableItem[]) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://connectthedotsprintable.online/es/printables/animals/",
                name: "Animales para Unir con Puntos | Fichas Gratis para Imprimir",
                url: "https://connectthedotsprintable.online/es/printables/animals/",
                description:
                    "Dibujos de animales para unir con puntos, listos para imprimir gratis. Descarga fichas en PDF o crea tu propio diseño personalizado a partir de una foto.",
                inLanguage: "es",
                dateModified: "2026-07-15",
            },
            {
                "@type": "FAQPage",
                mainEntity: FAQ_ITEMS.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            },
            {
                "@type": "ItemList",
                numberOfItems: items.length,
                itemListElement: items.slice(0, 20).map((item, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `https://connectthedotsprintable.online${item.detailPage}`,
                    name: item.title,
                })),
            },
        ],
    };
}

export default function AnimalPageClient({ items }: Props) {
    const jsonLd = buildJsonLd(items);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="flex-grow w-full bg-slate-50">

                {/* ── Hero ── */}
                <section className="relative bg-slate-900 pt-14 pb-12 overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                        <nav aria-label="Migas de pan" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                            <Link href="/es/" className="hover:text-white transition-colors">Inicio</Link>
                            <ChevronRight size={12} className="opacity-50" aria-hidden="true" />
                            <span className="text-brand-blue">Animales para Unir con Puntos</span>
                        </nav>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                                Animales para Unir con Puntos
                            </h1>
                            <p className="text-base sm:text-lg text-slate-300 leading-7 mb-3 max-w-2xl">
                                Descarga dibujos de animales para unir con puntos, listos para imprimir gratis en PDF, sin marca de agua. Perros, gatos, dinosaurios y muchos más, con distintos niveles de dificultad.
                            </p>
                            <p className="text-sm text-slate-400 mb-6 max-w-2xl">
                                ¿No encuentras el animal que buscas? Sube una foto y crea tu propia ficha personalizada con el generador gratuito.
                            </p>
                            <p className="text-xs text-slate-500 mb-8">Última actualización: {LAST_UPDATED}</p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" })}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
                                >
                                    Ver Fichas Gratis ↓
                                </button>
                                <Link
                                    href="/es/"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <Sparkles size={16} aria-hidden="true" />
                                    Crear mi Diseño
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Gallery ── */}
                <section id="galeria" className="py-12 md:py-16">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="flex items-end justify-between mb-6 pb-4 border-b border-slate-200">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900">Fichas Gratis de Animales</h2>
                                <p className="text-sm text-slate-500 mt-0.5">{items.length} diseños disponibles</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {items.map((item, idx) => (
                                <PrintableCard key={item.id} item={item} priority={idx < 4} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Why section ── */}
                <section className="py-12 bg-white border-t border-slate-100">
                    <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                            ¿Por qué a los niños les gustan tanto estos ejercicios?
                        </h2>
                        <p className="text-slate-600 leading-7 mb-3">
                            Unir puntos para formar animales combina el aprendizaje numérico con la motricidad fina: al trazar líneas de un punto a otro, los niños ejercitan el control del lápiz y la coordinación entre la vista y la mano, mientras practican el orden de los números.
                        </p>
                        <p className="text-slate-600 leading-7 mb-3">
                            Es una actividad ideal sin pantallas, perfecta para el aula, para casa o para mantener a los niños entretenidos durante un viaje. Una vez completado el dibujo, se puede colorear para sumar una segunda actividad creativa.
                        </p>
                        <p className="text-xs text-slate-400 mt-4">
                            Fuente:{" "}
                            <a
                                href="https://www.merckmanuals.com/es-us/professional/pediatr%C3%ADa/crecimiento-y-desarrollo/desarrollo-infantil"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-blue hover:underline inline-flex items-center gap-1"
                            >
                                Manual Merck — desarrollo de la motricidad fina en la infancia
                                <ExternalLink size={11} aria-hidden="true" />
                            </a>
                        </p>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-100">
                    <div className="container max-w-3xl mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
                            Preguntas Frecuentes
                        </h2>
                        <div className="space-y-5">
                            {FAQ_ITEMS.map((item) => (
                                <article
                                    key={item.q}
                                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
                                >
                                    <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                                    <p className="text-sm leading-7 text-slate-600">{item.a}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Related links ── */}
                <section className="py-10 bg-white border-t border-slate-100">
                    <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                        <h2 className="text-lg font-bold text-slate-700 mb-5">Colecciones Relacionadas</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {RELATED_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group block bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl p-4 transition-all"
                                >
                                    <p className="font-semibold text-brand-blue group-hover:underline text-sm">
                                        {link.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{link.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}
