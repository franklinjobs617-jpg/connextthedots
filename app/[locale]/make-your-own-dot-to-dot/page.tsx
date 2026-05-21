import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { conversionExamples } from "@/lib/seo-showcase";
import { getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (locale !== "en") {
        return {
            title: "Make Your Own Dot-to-Dot",
            robots: { index: false, follow: true },
        };
    }

    const path = "/make-your-own-dot-to-dot/";
    return {
        title: "Make Your Own Dot-to-Dot | Create a Custom Printable Worksheet",
        description: "Create your own dot-to-dot worksheet from a photo, drawing, or outline. Choose the difficulty, preview the result, and download a printable puzzle.",
        alternates: {
            canonical: getUrl("en", path),
            languages: {
                en: getUrl("en", path),
                "x-default": getUrl("en", path),
            },
        },
        openGraph: {
            title: "Make Your Own Dot-to-Dot | Create a Custom Printable Worksheet",
            description: "Use the generator to create a custom printable dot-to-dot puzzle from your own image.",
            url: getUrl("en", path),
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;
    if (locale !== "en") {
        notFound();
    }

    const useCases = [
        { title: "Photo", item: conversionExamples.pet, copy: "Use a pet photo, portrait, or object image when you want a personal worksheet." },
        { title: "Drawing", item: conversionExamples.outline, copy: "Upload a drawing or cartoon when you want a cleaner path and less background cleanup." },
        { title: "Worksheet Outline", item: conversionExamples.worksheet, copy: "Start with a simple outline when you need a faster page for younger learners." },
    ];

    return (
        <main className="bg-slate-50 py-10">
            <div className="container mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
                <section className="rounded-[2rem] bg-white p-6 md:p-10 shadow-xl">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">Conversion-focused landing page</p>
                            <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-5">
                                Make Your Own Dot-to-Dot
                            </h1>
                            <p className="text-lg leading-8 text-gray-600">
                                Create your own dot-to-dot worksheet from a photo, drawing, or worksheet outline. This page is built for people who already know they want a custom printable puzzle and need a faster path into the tool than a long tutorial page provides.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {useCases.map(({ title, item, copy }) => (
                                <article key={title} className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                                    <Image src={item.imageUrl} alt={`${title} dot-to-dot preview`} width={240} height={240} className="aspect-square w-full rounded-2xl bg-white object-cover" />
                                    <h2 className="mt-3 text-lg font-semibold text-gray-900">{title}</h2>
                                    <p className="mt-2 text-sm leading-7 text-gray-600">{copy}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Who This Tool Is For</h2>
                        <p className="text-sm leading-7 text-gray-600">
                            This route is for teachers, parents, printable sellers, and hobby users who need a worksheet based on a specific image instead of a general theme. It is also the right page for users who searched with make-your-own or create-your-own intent and want the shortest path to action.
                        </p>
                    </article>
                    <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Make Your Own Dot-to-Dot</h2>
                        <p className="text-sm leading-7 text-gray-600">
                            Upload the image, choose a dot count, review the preview, and export the printable file. The generator works best when you start with a strong outline and adjust difficulty to match the learner rather than trying to keep every detail from the source image.
                        </p>
                    </article>
                    <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Choose Easy, Medium, or Hard</h2>
                        <p className="text-sm leading-7 text-gray-600">
                            Lower dot counts make a faster worksheet for younger users. Mid-range counts balance readability and detail for standard printable use. Higher counts create harder pages for older kids and adults who want a denser puzzle and a longer concentration activity.
                        </p>
                    </article>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                    <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Download as Printable Worksheet</h2>
                        <p className="text-sm leading-7 text-gray-600">
                            The output is meant to become a clean printable page, not just an on-screen preview. Review the dot path before download, check that the numbers are readable, and print on standard letter paper once the layout is balanced. This route is especially useful when you need a custom worksheet for a lesson, a themed activity, or a personal gift.
                        </p>
                    </article>

                    <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use a Custom Generator Instead of Generic Printables</h2>
                        <p className="text-sm leading-7 text-gray-600">
                            Generic printables are useful when a broad theme is enough. A custom generator wins when the exact image matters, such as a pet, a classroom mascot, a student drawing, a logo, or a specific teaching outline. That is the practical difference between this conversion page and the broader printable collection hub.
                        </p>
                    </article>
                </section>

                <section className="rounded-[2rem] bg-slate-900 px-8 py-10 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to create your custom puzzle?</h2>
                    <p className="max-w-3xl text-slate-300 leading-8 mb-6">
                        Use the main generator when you want to turn a specific image into a printable worksheet right now. Use the tutorial page if you need more explanation about cleanup, image preparation, and troubleshooting.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/" className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                            Open the generator
                        </Link>
                        <Link href="/how-to-make/" className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200">
                            Read the tutorial
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
