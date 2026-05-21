import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { conversionExamples } from "@/lib/seo-showcase";
import { getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What photos work best in a dot-to-dot generator?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Photos with a single subject, clean edges, and quiet backgrounds work best because the generator can follow the main outline without creating extra dots from background noise.",
            },
        },
        {
            "@type": "Question",
            name: "Can I print the generated puzzle?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. After adjusting the preview you can export a printable worksheet and print it on standard paper. Match the dot count to the learner so the final sheet stays readable.",
            },
        },
    ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (locale !== "en") {
        return {
            title: "Dot-to-Dot Generator from Photo",
            robots: { index: false, follow: true },
        };
    }

    const path = "/dot-to-dot-generator-from-photo/";
    return {
        title: "Dot-to-Dot Generator from Photo | Turn an Image into a Printable Puzzle",
        description: "Turn a photo into a printable dot-to-dot worksheet. Learn which images work best, how to set the dot count, and how to clean up the preview before you print.",
        alternates: {
            canonical: getUrl(locale, path),
            languages: {
                en: getUrl("en", path),
                "x-default": getUrl("en", path),
            },
        },
        openGraph: {
            title: "Dot-to-Dot Generator from Photo | Turn an Image into a Printable Puzzle",
            description: "Use a photo, drawing, or outline to create a printable dot-to-dot worksheet and export a clean puzzle.",
            url: getUrl(locale, path),
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;
    if (locale !== "en") {
        notFound();
    }

    const sections = [
        {
            title: "How to Turn a Photo into a Dot-to-Dot",
            body: "A photo-to-dot-to-dot workflow works best when the subject is obvious and the outline can survive simplification. Upload the image, choose a dot count that matches the learner, and review the preview before exporting the printable file. The goal is not to keep every photo detail. The goal is to preserve a clean path that still reveals the subject clearly when the dots are connected.",
        },
        {
            title: "Best Photos to Use",
            body: "Single-subject pet photos, portraits with strong side profiles, simple logos, and cartoon-style images usually work best because their edges are readable. Photos with heavy shadows, textured backgrounds, or multiple overlapping subjects often produce messy dots and weaker printable results unless you crop and simplify them first.",
        },
        {
            title: "Settings That Change the Result",
            body: "Dot count changes both difficulty and shape fidelity. Lower counts produce faster worksheets for younger users, while higher counts keep more detail for older learners and adults. Hint style matters too: an outline-assisted preview is easier for beginners, while dots-only pages create a cleaner challenge for advanced users.",
        },
    ];

    const examples = [
        { title: "Pet", item: conversionExamples.pet },
        { title: "Cartoon", item: conversionExamples.outline },
        { title: "Worksheet", item: conversionExamples.worksheet },
    ];

    return (
        <>
            <Script id="photo-generator-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <main className="bg-slate-50 py-10">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
                    <section className="rounded-[2rem] bg-white p-6 md:p-10 shadow-xl">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">Photo conversion landing page</p>
                                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-5">
                                    Dot-to-Dot Generator from Photo
                                </h1>
                                <p className="text-lg leading-8 text-gray-600">
                                    This tool turns a photo, drawing, or outline into a printable dot-to-dot worksheet. Upload the image, choose a dot count that fits the learner, and clean up the preview so the final puzzle reveals the subject clearly without carrying over the noise from the original photo.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                                <div className="grid grid-cols-3 gap-3">
                                    <Image src={conversionExamples.pet.referenceImageUrl} alt="Original pet photo reference for dot-to-dot conversion" width={240} height={240} className="aspect-square rounded-2xl bg-white object-contain" />
                                    <Image src={conversionExamples.pet.imageUrl} alt="Generated pet dot-to-dot worksheet preview" width={240} height={240} className="aspect-square rounded-2xl bg-white object-cover" />
                                    <Image src={conversionExamples.pet.solutionUrl} alt="Solved pet dot-to-dot outline" width={240} height={240} className="aspect-square rounded-2xl bg-white object-cover" />
                                </div>
                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    Original image, printable dot pattern, and solved outline are shown together so the result is immediately understandable to users and crawlable as a self-contained answer block.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-3">
                        {sections.map((section) => (
                            <article key={section.title} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
                                <p className="text-sm leading-7 text-gray-600">{section.body}</p>
                            </article>
                        ))}
                    </section>

                    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Examples: Pet, Portrait, Cartoon, Logo</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            {examples.map(({ title, item }) => (
                                <article key={title} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                                    <Image src={item.referenceImageUrl} alt={`${title} source image for dot-to-dot conversion`} width={300} height={300} className="aspect-square w-full rounded-2xl bg-white object-contain" />
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <Image src={item.imageUrl} alt={`${title} printable dot-to-dot preview`} width={150} height={150} className="aspect-square rounded-2xl bg-white object-cover" />
                                        <Image src={item.solutionUrl} alt={`${title} solved outline`} width={150} height={150} className="aspect-square rounded-2xl bg-white object-cover" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title} example</h3>
                                    <p className="mt-2 text-sm leading-7 text-gray-600">
                                        {title === "Pet"
                                            ? "Pet photos work when the subject fills the frame and the silhouette is easy to trace."
                                            : title === "Cartoon"
                                              ? "Cartoon or outline images produce the cleanest dot paths because the edges are already simplified."
                                              : "Worksheet-style shapes are useful for younger learners who need a fast printable activity."}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Problems and Fixes</h2>
                            <div className="space-y-5 text-sm leading-7 text-gray-600">
                                <p><strong className="text-gray-900">Too many stray dots:</strong> crop the subject tighter and remove background noise.</p>
                                <p><strong className="text-gray-900">Subject loses its shape:</strong> raise the dot count until the key curves stay readable.</p>
                                <p><strong className="text-gray-900">Numbers feel too crowded:</strong> reduce the dot count or export a larger printable layout.</p>
                                <p><strong className="text-gray-900">Preview still looks flat:</strong> switch to a higher-contrast source image or a cleaner outline version.</p>
                            </div>
                        </article>

                        <article className="rounded-[2rem] bg-slate-900 px-8 py-10 text-white">
                            <h2 className="text-3xl font-bold mb-4">Ready to convert your own image?</h2>
                            <p className="max-w-2xl text-slate-300 leading-8 mb-6">
                                Use the main generator when you already know the subject you want. That route is best for turning a new photo, logo, or drawing into a printable puzzle instead of browsing the existing worksheet library.
                            </p>
                            <Link href="/" className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                                Open the generator
                            </Link>
                        </article>
                    </section>
                </div>
            </main>
        </>
    );
}
