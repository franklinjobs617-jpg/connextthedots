"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FileDown, ExternalLink } from "lucide-react";

const christmasSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Christmas Connect-the-Dots Printables",
    url: "https://connectthedotsprintable.online/christmas-printables/",
    about: "A free downloadable PDF bundle of Christmas connect-the-dots worksheets, easy and hard.",
};

const christmasFaq = [
    {
        question: "What's included in the free Christmas printable bundle?",
        answer: "The free bundle is a single PDF download containing multiple Christmas-themed connect-the-dots puzzles — Santa, Christmas trees, ornaments, and winter scenes — in a mix of easy and hard difficulty levels.",
    },
    {
        question: "What age is this Christmas bundle suitable for?",
        answer: "The bundle includes easy pages suitable for ages 3-6 with fewer, larger dots, and harder pages with more detail for ages 7 and up, including teens and adults who enjoy a denser holiday puzzle.",
    },
    {
        question: "How do I download and print the bundle?",
        answer: "Click the download button to save the PDF, then open it and print using standard A4 or US Letter paper. Select 'Fit to page' in your print dialog for best results.",
    },
    {
        question: "Can I get an individual Christmas design instead of the whole bundle?",
        answer: "Right now Christmas designs are only available as the full bundle PDF, not as individually browsable puzzles. If you want one specific design — for example, from your own holiday photo — use the custom generator to create it yourself.",
    },
    {
        question: "Is this Christmas printable bundle really free?",
        answer: "Yes. The bundle is free to download and print, with no sign-up and no watermark, for personal and classroom use.",
    },
    {
        question: "Can I create a custom Christmas puzzle from my own photo?",
        answer: "Yes — the free generator lets you upload any photo, including your own holiday pictures, and turns it into a numbered dot-to-dot puzzle you can download as PDF.",
    },
];

// Preview images — these illustrate what's inside the bundle.
// They are standalone showcase images, not individually downloadable puzzles.
const previewImages = [
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Christmas-Dot-To-Dot-Bundle-Hero.webp",
        alt: "Preview of the Christmas connect-the-dots bundle cover",
        label: "Bundle preview",
    },
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Hard-Christmas-Ornament-Connect-The-Dots-Adults.webp",
        alt: "Hard Christmas ornament connect-the-dots puzzle for older kids and adults",
        label: "Hard puzzle sample",
    },
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Paper-Type-Comparison-Print-Quality.webp",
        alt: "Print quality comparison for the Christmas worksheet bundle",
        label: "Print quality sample",
    },
];

const LAST_UPDATED = "July 14, 2026";

export default function ChristmasContent({ locale }: { locale: string }) {
    const isEs = locale === "es";

    return (
        <>
            <Script id="christmas-collection-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(christmasSchema) }} />
            <main className="bg-slate-50 py-10">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 space-y-10">

                    {/* Hero */}
                    <section className="rounded-[2rem] bg-white p-6 md:p-10 shadow-xl">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">
                                    {isEs ? "Paquete navideño gratuito" : "Free seasonal bundle"}
                                </p>
                                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-5">
                                    {isEs
                                        ? "Dibujos de Unir Puntos de Navidad para Imprimir"
                                        : "Free Christmas Connect the Dots Printables"}
                                </h1>
                                <p className="text-lg leading-8 text-gray-600 mb-4">
                                    {isEs
                                        ? "Descarga gratis nuestro paquete PDF de unir puntos navideños: Papá Noel, árboles, adornos y escenas de invierno, en versiones fáciles y difíciles, todo en un solo archivo listo para imprimir."
                                        : "Download our free Christmas connect-the-dots PDF bundle — Santa, trees, ornaments, and winter scenes in easy and hard versions, all in one printable file."}
                                </p>
                                <p className="text-xs text-gray-400 mb-6">
                                    {isEs ? "Última actualización: 14 de julio de 2026" : `Last updated ${LAST_UPDATED}`}
                                </p>

                                <a
                                    href="/ChristmasDottoDot.pdf"
                                    download
                                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-blue text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all"
                                >
                                    <FileDown size={18} />
                                    {isEs ? "Descargar Paquete PDF Gratis" : "Download Free PDF Bundle"}
                                </a>

                                <div className="flex flex-wrap gap-3 text-sm mt-6">
                                    {["Santa", "Christmas Tree", "Ornaments", "Holiday Scene", "Classroom Activity"].map((tag) => (
                                        <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                    {isEs ? "Vista previa del paquete" : "What's inside the bundle"}
                                </p>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {previewImages.map((image) => (
                                        <figure key={image.label} className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                                            <Image src={image.src} alt={image.alt} width={320} height={320} className="aspect-square w-full rounded-2xl object-cover" />
                                            <figcaption className="mt-3 text-sm font-medium text-gray-700">{image.label}</figcaption>
                                        </figure>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content sections */}
                    <section className="grid gap-6 lg:grid-cols-3">
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Easy Christmas Dot-to-Dot for Kids</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Easier Christmas pages are best for a short, printable holiday activity for preschool or elementary learners. Santa faces, trees, ornaments, and simple winter shapes are easier to recognize with lower dot counts, which keeps the worksheet fun instead of frustrating.
                            </p>
                        </article>
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Hard Christmas Puzzles for Older Kids and Adults</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Hard Christmas printables work well for older kids and adults who want a denser holiday puzzle with more lines and more detail. Ornament and scene-based layouts justify the extra dots because the final image is more satisfying when it takes longer to finish.
                            </p>
                        </article>
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Popular Holiday Themes</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Santa, Christmas trees, ornaments, and winter scenes are the most requested holiday themes, and they&apos;re what this bundle is built around, along with classroom-friendly activity ideas for holiday parties and quiet time.
                            </p>
                        </article>
                    </section>

                    {/* How to print + activity ideas */}
                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Print the Bundle</h2>
                            <ol className="space-y-4">
                                {[
                                    "Download the free PDF bundle using the button above.",
                                    "Open the file and check the preview before printing so the numbers stay readable.",
                                    "Use standard letter or A4 paper and choose 'fit to page' in the printer dialog.",
                                    "For a thicker activity sheet, switch to cardstock after confirming the layout on normal paper.",
                                ].map((step, index) => (
                                    <li key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue font-bold text-white">{index + 1}</span>
                                        <span className="text-sm leading-7 text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </article>

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">A Screen-Free Holiday Activity</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-4">
                                Christmas connect-the-dots pages work well as short screen-free breaks, quiet classroom center work, or a printable activity during travel and family gatherings. They also fit into classroom rotations, doubling as counting practice first and a coloring activity second.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">Morning work</span>
                                <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">Holiday centers</span>
                                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">Travel activity</span>
                                <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">Color after connecting</span>
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                Source:{" "}
                                <a
                                    href="https://www.healthychildren.org/English/family-life/Media/Pages/helping-kids-thrive-in-a-digital-world-AAP-policy-explained.aspx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-blue hover:underline inline-flex items-center gap-1"
                                >
                                    HealthyChildren.org (AAP) — screen-free family time
                                    <ExternalLink size={11} aria-hidden="true" />
                                </a>
                            </p>
                        </article>
                    </section>

                    {/* FAQ + generator CTA */}
                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">FAQ</h2>
                            <div className="space-y-5">
                                {christmasFaq.map((item) => (
                                    <div key={item.question} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                                        <h3 className="font-semibold text-gray-900">{item.question}</h3>
                                        <p className="mt-2 text-sm leading-7 text-gray-600">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-[2rem] bg-slate-900 px-8 py-10 text-white">
                            <h2 className="text-3xl font-bold mb-4">Need a specific holiday design instead?</h2>
                            <p className="max-w-2xl text-slate-300 leading-8 mb-6">
                                The bundle above covers the most-requested Christmas themes. If you want a puzzle built from your own holiday photo, a class mascot, or a specific drawing, use the free generator instead.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/printable-connect-the-dots/" className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200">
                                    Browse the full printable library
                                </Link>
                                <Link href="/" className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                                    Open the custom generator
                                </Link>
                            </div>
                        </article>
                    </section>

                </div>
            </main>
        </>
    );
}
