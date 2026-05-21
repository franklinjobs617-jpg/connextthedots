import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, ChevronRight, ImageIcon, Printer, SlidersHorizontal, Sparkles, Upload } from "lucide-react";
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

    const processSteps = [
        {
            icon: Upload,
            title: "Upload a clear subject",
            copy: "Start with a pet, portrait, logo, or drawing that has one obvious subject and minimal background clutter.",
        },
        {
            icon: SlidersHorizontal,
            title: "Adjust the dot count",
            copy: "Set a lighter dot count for younger users or a denser count when you need a more detailed printable result.",
        },
        {
            icon: Sparkles,
            title: "Review the preview",
            copy: "Check whether the dots follow the outline naturally before you export the final puzzle.",
        },
        {
            icon: Printer,
            title: "Download and print",
            copy: "Export the worksheet once it reads clearly and print it on standard paper for class, home, or gift use.",
        },
    ];

    const examples = [
        { title: "Pet", item: conversionExamples.pet },
        { title: "Cartoon", item: conversionExamples.outline },
        { title: "Worksheet", item: conversionExamples.worksheet },
    ];

    const bestPhotoTypes = [
        "Pet photos with a strong side profile",
        "Single-person portraits with clear contrast",
        "Clean logos or silhouettes",
        "Children's drawings with simple outlines",
    ];

    const avoidPhotoTypes = [
        "Busy group photos with overlapping people",
        "Landscape shots with heavy texture",
        "Low-light phone images with weak edges",
        "Photos where the subject is too small in frame",
    ];

    const faqItems = [
        {
            question: "What photos work best in a dot-to-dot generator?",
            answer: "The strongest results come from images with one clear subject, strong edges, and very little background distraction. Pet profiles, logo-like shapes, simple portraits, and line drawings are ideal because the generator can trace the main contour cleanly instead of trying to interpret dozens of unrelated edges.",
        },
        {
            question: "What makes a printable result look professional instead of messy?",
            answer: "A professional-looking printable result usually comes from three things working together: a clean source image, a dot count that matches the complexity of the subject, and a final preview where the number labels still have space to breathe. If the picture is too detailed for the selected dot count, the result looks thin or confusing on paper.",
        },
        {
            question: "Can I print the generated puzzle?",
            answer: "Yes. Once the preview is balanced, you can export the worksheet and print it on standard paper. It helps to check print preview before sending the file to the printer so the outline stays centered, the number sequence remains readable, and the page still works as a clean classroom or home activity.",
        },
        {
            question: "What do I actually get after converting a photo?",
            answer: "You get a printable dot-to-dot worksheet based on your source image, not just a rough preview. The point of the workflow is to produce a page that still reads clearly when printed, with a usable dot sequence, enough spacing for the labels, and a final shape that feels intentional rather than randomly traced.",
        },
    ];

    const recommendationRows = [
        {
            audience: "Preschool / early counting",
            dots: "15-30 dots",
            images: "simple animals, icons, bold worksheet shapes",
            result: "fast printable activity with very clear outlines",
        },
        {
            audience: "Elementary worksheet use",
            dots: "30-60 dots",
            images: "pets, classroom drawings, simple portraits",
            result: "balanced page with more detail and readable numbering",
        },
        {
            audience: "Older kids / adults",
            dots: "60-120+ dots",
            images: "clean profile photos, logos, denser illustrations",
            result: "more detailed printable puzzle with longer focus time",
        },
    ];

    const useCaseCards = [
        {
            title: "Teachers and homeschool use",
            body: "Turn lesson visuals, mascots, themed icons, or student artwork into worksheets that feel tied to the topic instead of pulled from a random printable pack.",
        },
        {
            title: "Parents and gift makers",
            body: "Use pet photos, favorite objects, or family drawings to create personal dot-to-dot pages that feel more special than a generic activity sheet.",
        },
        {
            title: "Printable and digital product work",
            body: "Use cleaner source art and controlled dot counts when building themed printable pages that need to feel deliberate, reusable, and product-ready.",
        },
    ];

    const prepChecklist = [
        "Crop the image so one subject fills most of the frame.",
        "Avoid cluttered backgrounds unless you plan to simplify the image first.",
        "Use contrast or grayscale if the edges are too soft.",
        "Choose a dot count that matches both the learner and the shape complexity.",
        "Review the preview before downloading so the final print does not feel improvised.",
    ];

    return (
        <>
            <Script id="photo-generator-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <main className="bg-slate-50 py-10">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
                    <section className="rounded-[2rem] bg-white p-6 md:p-10 shadow-xl">
                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <span className="text-slate-900">Dot-to-Dot Generator from Photo</span>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">Photo conversion landing page</p>
                                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-5">
                                    Dot-to-Dot Generator from Photo
                                </h1>
                                <p className="text-lg leading-8 text-gray-600 mb-4">
                                    Turn a photo into a printable dot-to-dot worksheet by starting with a clear subject, choosing a dot count that matches the learner, and exporting a puzzle that still reveals the image cleanly once the dots are connected.
                                </p>
                                <p className="text-sm text-slate-500 mb-6">
                                    Last updated: May 21, 2026
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {processSteps.map(({ icon: Icon, title, copy }) => (
                                        <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <Icon size={18} className="text-brand-blue mb-3" />
                                            <h2 className="font-semibold text-slate-900">{title}</h2>
                                            <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                                <div className="grid grid-cols-3 gap-3">
                                    <Image src={conversionExamples.pet.referenceImageUrl} alt="Original pet photo reference for dot-to-dot conversion" width={240} height={240} className="aspect-square rounded-2xl bg-white object-contain" />
                                    <Image src={conversionExamples.pet.imageUrl} alt="Generated pet dot-to-dot worksheet preview" width={240} height={240} className="aspect-square rounded-2xl bg-white object-cover" />
                                    <Image src={conversionExamples.pet.solutionUrl} alt="Solved pet dot-to-dot outline" width={240} height={240} className="aspect-square rounded-2xl bg-white object-cover" />
                                </div>
                                <p className="mt-4 text-sm leading-7 text-gray-600">
                                    Original image, printable dot pattern, and solved outline are shown together so a user can immediately understand what the tool produces and how close the final puzzle stays to the source image.
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

                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Photo Types to Use</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                A good source image already behaves like a strong printable outline before it enters the tool. That is why side-profile pets, simple portraits, logos, and clean drawings perform better than crowded real-world photos.
                            </p>
                            <ul className="space-y-3">
                                {bestPhotoTypes.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm text-gray-700">
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Photo Types to Avoid</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                Some images fight the generator because they contain too many visual edges or too little subject clarity. Those files can still work, but they often need manual cleanup before the output feels worth printing.
                            </p>
                            <ul className="space-y-3">
                                {avoidPhotoTypes.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm text-gray-700">
                                        <ImageIcon size={18} className="mt-0.5 shrink-0 text-amber-600" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>

                    <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Get After Uploading a Photo</h2>
                        <p className="text-base leading-8 text-gray-700 mb-6">
                            A strong photo-to-dot-to-dot page needs to explain the output, not just the feature. The goal is a printable worksheet that still holds its shape after the image is simplified into dots. That means the result should have a readable sequence, enough white space around the labels, and a final outline that still feels connected to the original subject when someone completes the page.
                        </p>
                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                {
                                    title: "A cleaner printable page",
                                    body: "The generator reduces visual noise so the worksheet is usable on paper, not only on screen.",
                                },
                                {
                                    title: "A difficulty level you can control",
                                    body: "You can keep the result simple for kids or denser for older learners and adults.",
                                },
                                {
                                    title: "A result tied to your own image",
                                    body: "The finished page feels personal or topic-specific instead of generic.",
                                },
                            ].map((item) => (
                                <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-gray-600">{item.body}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended Dot Counts by Use Case</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                Choose the dot count based on who will use the worksheet and how much shape detail you need to preserve. Matching the dot range to the audience makes the printed result easier to read and more useful.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-sm text-slate-500">
                                            <th className="pb-3 pr-4 font-semibold">Audience</th>
                                            <th className="pb-3 pr-4 font-semibold">Recommended dots</th>
                                            <th className="pb-3 pr-4 font-semibold">Best source images</th>
                                            <th className="pb-3 font-semibold">Typical result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recommendationRows.map((row) => (
                                            <tr key={row.audience} className="border-b border-slate-100 align-top">
                                                <td className="py-4 pr-4 text-sm font-medium text-slate-900">{row.audience}</td>
                                                <td className="py-4 pr-4 text-sm text-slate-700">{row.dots}</td>
                                                <td className="py-4 pr-4 text-sm text-slate-700">{row.images}</td>
                                                <td className="py-4 text-sm text-slate-700">{row.result}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </article>

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Photo Prep Checklist</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                Most quality problems come from weak source preparation, not from the idea of using a photo. A quick cleanup pass before upload usually improves the final worksheet more than endless preview tweaking.
                            </p>
                            <ul className="space-y-3">
                                {prepChecklist.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm text-gray-700">
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>

                    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-slate-100">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Examples: Pet, Portrait, Cartoon, Logo</h2>
                                <p className="mt-2 text-sm text-gray-600">These examples show how different source images convert into printable dot paths and solved outlines, so you can judge which image types are easiest to turn into a clean worksheet.</p>
                            </div>
                        </div>
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

                    <section className="grid gap-6 lg:grid-cols-3">
                        {useCaseCards.map((card) => (
                            <article key={card.title} className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h2>
                                <p className="text-sm leading-7 text-gray-600">{card.body}</p>
                            </article>
                        ))}
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

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">FAQ</h2>
                            <div className="space-y-5">
                                {faqItems.map((item) => (
                                    <article key={item.question} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                                        <h3 className="font-semibold text-gray-900">{item.question}</h3>
                                        <p className="mt-2 text-sm leading-7 text-gray-600">{item.answer}</p>
                                    </article>
                                ))}
                            </div>
                        </article>
                    </section>

                    <section className="rounded-[2rem] border border-slate-200 bg-slate-900 px-8 py-10 text-white">
                        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Ready to build a printable puzzle from your own image?</h2>
                                <p className="max-w-3xl text-slate-300 leading-8">
                                    Use the generator when the exact source image matters and a generic worksheet library is not enough. If you want the deeper tutorial version, read the how-to guide. If you want the faster product route, open the generator now.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 lg:justify-end">
                                <Link href="/" className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                                    Open the generator
                                </Link>
                                <Link href="/how-to-make/" className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200">
                                    Read the full tutorial
                                </Link>
                                <Link href="/make-your-own-dot-to-dot/" className="rounded-full border border-slate-600 px-5 py-3 font-semibold text-white transition hover:border-slate-400">
                                    Make your own dot-to-dot
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
