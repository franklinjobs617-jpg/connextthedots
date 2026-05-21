import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, ChevronRight, Download, ImageIcon, LayoutTemplate, Printer, Sparkles, Upload } from "lucide-react";
import { notFound } from "next/navigation";
import { conversionExamples } from "@/lib/seo-showcase";
import { getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Make Your Own Dot-to-Dot",
    url: "https://connectthedotsprintable.online/make-your-own-dot-to-dot/",
    description: "Create your own dot-to-dot worksheet from a photo, drawing, or outline.",
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

    const processSteps = [
        {
            icon: Upload,
            title: "Upload your image",
            copy: "Start with a photo, drawing, or outline that matches the exact worksheet you want to make.",
        },
        {
            icon: Sparkles,
            title: "Choose difficulty",
            copy: "Pick a dot count and preview style that fits the learner and the amount of shape detail you want to keep.",
        },
        {
            icon: Download,
            title: "Preview the result",
            copy: "Check the dot path before you export so the final printable page still reads clearly.",
        },
        {
            icon: Printer,
            title: "Download and print",
            copy: "Export the custom puzzle once the spacing and labels look balanced on the page.",
        },
    ];

    const benefitBlocks = [
        {
            title: "Who This Tool Is For",
            body: "This tool is useful for teachers, parents, printable sellers, and hobby users who need a worksheet based on a specific image instead of a general theme. It works best when the exact subject matters more than browsing a library of ready-made sheets.",
        },
        {
            title: "How to Make Your Own Dot-to-Dot",
            body: "Upload the image, choose a dot count, review the preview, and export the printable file. The generator works best when you start with a strong outline and adjust difficulty to match the learner rather than trying to preserve every tiny source detail.",
        },
        {
            title: "Choose Easy, Medium, or Hard",
            body: "Lower dot counts make a faster worksheet for younger users. Mid-range counts balance readability and detail for standard printable use. Higher counts create harder pages for older kids and adults who want a denser puzzle and a longer concentration activity.",
        },
    ];

    const featureChecklist = [
        "Use your own image instead of relying only on a ready-made worksheet library",
        "Control dot density for preschool, classroom, or adult difficulty levels",
        "Preview the result before downloading the final printable file",
        "Build a custom worksheet for gifts, lessons, products, or personal use",
    ];

    const faqItems = [
        {
            question: "What can I turn into a custom dot-to-dot worksheet?",
            answer: "You can start from pet photos, simple portraits, logo shapes, cartoon art, children's drawings, and clean worksheet outlines. The generator works best when the source image already has a strong subject boundary. If the shape is obvious before upload, the final printable puzzle is much more likely to feel polished instead of improvised.",
        },
        {
            question: "How is this different from using a generic printable page?",
            answer: "A generic printable page is useful when a broad theme is enough. A custom generator is better when the exact image matters, such as a class mascot, a student's drawing, a pet, a logo, or a personalized gift idea. That is the real difference between this page and the broader printable collection hub.",
        },
        {
            question: "What do I get after I finish the custom puzzle?",
            answer: "The goal is a printable worksheet that still looks intentional on paper. After reviewing the preview, you export a file that can be used for classroom practice, quiet activities, printables, or custom product work. The result should feel like a finished worksheet, not just a rough on-screen draft.",
        },
        {
            question: "Who usually uses a make-your-own dot-to-dot tool?",
            answer: "The most common users are teachers, parents, printable product builders, and hobby users who want a worksheet based on an exact image. These users are not just looking for any activity page. They want control over the subject, the difficulty, and the final printable result, which is why a generic gallery alone is not enough for them.",
        },
    ];

    const audienceCards = [
        {
            title: "Teachers and homeschoolers",
            body: "Use a class mascot, topic icon, student drawing, or lesson visual to make a worksheet that feels tied to the lesson instead of pulled from a random printable archive.",
        },
        {
            title: "Parents and gift makers",
            body: "Build a more personal activity from a pet photo, favorite object, family drawing, or birthday theme so the final page feels special enough to keep.",
        },
        {
            title: "Printable sellers and creators",
            body: "Use controlled source art and predictable dot density when building themed worksheets that need to feel commercial, reusable, and product-ready.",
        },
        {
            title: "Casual hobby users",
            body: "Make a custom puzzle simply because you want a recognizable subject and a more satisfying finished page than a generic printable can offer.",
        },
    ];

    const outputBlocks = [
        {
            title: "A page built around your exact subject",
            body: "The main advantage is control. Instead of adapting to a pre-made theme, you decide what the worksheet reveals.",
        },
        {
            title: "A printable result that still reads clearly",
            body: "The output should feel like a finished activity page, with enough spacing and shape definition to work on paper.",
        },
        {
            title: "A workflow you can repeat",
            body: "Once you understand the source image and dot-count choices, you can create multiple consistent worksheets for different topics or audiences.",
        },
    ];

    const checklistItems = [
        "Choose a source image with one clear subject and a strong outline.",
        "Decide whether the worksheet is for kids, classroom use, adults, or product work.",
        "Match the dot count to the learner and the amount of shape detail you want to preserve.",
        "Check the preview before download so the final sheet feels intentional on paper.",
        "Print one test page first if the worksheet will be reused or sold.",
    ];

    const createdMostOften = [
        "pet-themed worksheets",
        "classroom topic sheets",
        "birthday and party activities",
        "brand or logo-inspired outlines",
        "simple practice worksheets for counting and focus",
    ];

    return (
        <>
            <Script id="make-your-own-webpage-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
            <main className="bg-slate-50 py-10">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
                    <section className="rounded-[2rem] bg-white p-6 md:p-10 shadow-xl">
                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <span className="text-slate-900">Make Your Own Dot-to-Dot</span>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">Custom printable worksheet tool</p>
                                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-5">
                                    Make Your Own Dot-to-Dot
                                </h1>
                                <p className="text-lg leading-8 text-gray-600 mb-4">
                                    Create your own dot-to-dot worksheet from a photo, drawing, or worksheet outline when a generic activity page is not specific enough. You can control the subject, the difficulty, and the printable result so the final page fits a lesson, a gift, a worksheet pack, or a personal project.
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
                        {benefitBlocks.map((block) => (
                            <article key={block.title} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{block.title}</h2>
                                <p className="text-sm leading-7 text-gray-600">{block.body}</p>
                            </article>
                        ))}
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <LayoutTemplate className="text-brand-blue" size={22} />
                                <h2 className="text-3xl font-bold text-gray-900">What You Can Turn into a Dot-to-Dot</h2>
                            </div>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                You can turn pet photos, cartoon art, worksheet outlines, logo-like shapes, personalized gift ideas, and classroom visuals into custom printable puzzles as long as the source image has a readable subject boundary.
                            </p>
                            <ul className="space-y-3">
                                {featureChecklist.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm text-gray-700">
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-4">
                                <ImageIcon className="text-brand-blue" size={22} />
                                <h2 className="text-3xl font-bold text-gray-900">Download as Printable Worksheet</h2>
                            </div>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                The output should feel finished enough to print, share, or use in a worksheet pack. Review the dot path before download, make sure the number spacing still feels readable, and print on standard paper once the page looks balanced. This route is especially useful when you need a custom worksheet for a lesson, a product, or a personal project.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { label: "Teacher use", copy: "Classroom warm-ups, number practice, themed lesson sheets." },
                                    { label: "Product use", copy: "Custom printable pages, packs, or themed activity collections." },
                                    { label: "Personal use", copy: "Pets, gifts, personalized party activities, and home learning." },
                                ].map((item) => (
                                    <article key={item.label} className="rounded-2xl bg-slate-50 p-4">
                                        <h3 className="font-semibold text-slate-900">{item.label}</h3>
                                        <p className="mt-2 text-sm leading-7 text-slate-600">{item.copy}</p>
                                    </article>
                                ))}
                            </div>
                        </article>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Users Create Most Often</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                Most custom dot-to-dot worksheets are built around familiar shapes and personal themes because those subjects still read clearly after the image is simplified into a printable puzzle.
                            </p>
                            <ul className="space-y-3">
                                {createdMostOften.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm text-gray-700">
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Before You Click Generate</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                Most weak results happen when the source image, the target audience, and the intended worksheet style are not decided before generation. A quick preparation check usually improves the final printable page more than repeated trial and error.
                            </p>
                            <ul className="space-y-3">
                                {checklistItems.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm text-gray-700">
                                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-4">
                        {audienceCards.map((card) => (
                            <article key={card.title} className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h2>
                                <p className="text-sm leading-7 text-gray-600">{card.body}</p>
                            </article>
                        ))}
                    </section>

                    <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Get When the Puzzle Is Finished</h2>
                        <p className="text-base leading-8 text-gray-700 mb-6">
                            The final result is a custom worksheet that should still feel clean, deliberate, and usable when printed, shared, or turned into a repeatable activity. The value comes from controlling the subject and difficulty while keeping the finished page readable on paper.
                        </p>
                        <div className="grid gap-4 md:grid-cols-3">
                            {outputBlocks.map((block) => (
                                <article key={block.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="text-lg font-semibold text-gray-900">{block.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-gray-600">{block.body}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use a Custom Generator Instead of Generic Printables</h2>
                        <p className="text-base leading-8 text-gray-700 mb-6">
                            Generic printable pages are useful when any broad theme is good enough. A custom generator is better when the exact image matters, such as a pet, a classroom mascot, a student drawing, a logo, or a specific teaching outline. That difference matters commercially too: users who search for make-your-own intent usually want control, not just another gallery.
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="text-xl font-semibold text-gray-900">Generic printable page</h3>
                                <p className="mt-2 text-sm leading-7 text-gray-600">
                                    Good when you only need a broad animal, holiday, or counting worksheet and can pick from existing options.
                                </p>
                            </article>
                            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="text-xl font-semibold text-gray-900">Custom generator workflow</h3>
                                <p className="mt-2 text-sm leading-7 text-gray-600">
                                    Better when the exact subject matters and the finished page needs to feel intentional, personal, or product-ready.
                                </p>
                            </article>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
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

                        <article className="rounded-[2rem] bg-slate-900 px-8 py-10 text-white">
                            <h2 className="text-3xl font-bold mb-4">Ready to create your custom puzzle?</h2>
                            <p className="max-w-3xl text-slate-300 leading-8 mb-6">
                                Use the main generator when you want the fastest route to building a custom worksheet. Use the tutorial page if you need deeper help with image cleanup, photo preparation, and troubleshooting.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/" className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                                    Open the generator
                                </Link>
                                <Link href="/how-to-make/" className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200">
                                    Read the tutorial
                                </Link>
                                <Link href="/dot-to-dot-generator-from-photo/" className="rounded-full border border-slate-600 px-5 py-3 font-semibold text-white transition hover:border-slate-400">
                                    Use a photo instead
                                </Link>
                            </div>
                        </article>
                    </section>
                </div>
            </main>
        </>
    );
}
