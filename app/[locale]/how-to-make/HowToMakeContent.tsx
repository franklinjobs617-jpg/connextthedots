import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { conversionExamples } from "@/lib/seo-showcase";

const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Make Your Own Dot-to-Dot Worksheet from a Photo",
    description: "A step-by-step guide for turning a photo, drawing, or outline into a printable dot-to-dot worksheet.",
    step: [
        { "@type": "HowToStep", name: "Choose a clean source image", text: "Start with a subject that has a strong outline and minimal background clutter." },
        { "@type": "HowToStep", name: "Upload the image", text: "Open the generator, upload your image, and choose the base preview." },
        { "@type": "HowToStep", name: "Adjust dot count and hint style", text: "Match the dot count to the learner and decide whether to keep outline hints or dots only." },
        { "@type": "HowToStep", name: "Review the preview", text: "Check whether the dots stay on the subject outline and reduce clutter before exporting." },
        { "@type": "HowToStep", name: "Download the printable worksheet", text: "Export a printable file once the preview is clear and balanced." },
    ],
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Why does my photo create messy dots?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Messy dot placement usually comes from low contrast, a background with too many edges, or a subject that is too small inside the frame. Crop the image tighter, raise the contrast, and remove background noise before you upload it again.",
            },
        },
        {
            "@type": "Question",
            name: "How many dots should I choose for kids vs adults?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Use roughly 15 to 30 dots for early learners, 30 to 60 dots for most classroom worksheets, and 60 or more when you want a harder printable challenge. The right dot count depends on both the learner and the amount of detail in the image.",
            },
        },
        {
            "@type": "Question",
            name: "What image format works best?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "PNG is usually the easiest format for clean dot placement because it preserves sharp edges and transparent backgrounds well. JPG still works, but the generator performs best when the subject outline stays crisp and the background stays quiet.",
            },
        },
        {
            "@type": "Question",
            name: "Can I print the final puzzle as PDF?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Once the preview looks balanced, export the puzzle and print it on standard letter paper. Check the print preview before sending it to the printer so the outline stays centered and the number labels stay readable.",
            },
        },
    ],
};

const DOT_COUNT_TABLE = [
    { goal: "Early counting practice", age: "Ages 3–5", dots: "15 – 30", note: "Simple shapes, fast completion" },
    { goal: "Most classroom worksheets", age: "Ages 6–10", dots: "30 – 60", note: "Balanced detail and difficulty" },
    { goal: "Harder printable puzzle", age: "Ages 10+ / adults", dots: "60+", note: "More detail, longer completion time" },
];

const issues = [
    {
        title: "Why does my photo create messy dots?",
        body: "Messy dot placement usually comes from low contrast, a background with too many edges, or a subject that is too small inside the frame. Crop the image tighter, raise the contrast, and remove background noise before you upload it again.",
    },
    {
        title: "How many dots should I choose for kids vs adults?",
        body: "Use roughly 15 to 30 dots for early learners, 30 to 60 dots for most classroom worksheets, and 60 or more when you want a harder printable challenge. The right dot count depends on both the learner and the amount of detail in the image.",
    },
    {
        title: "What image format works best?",
        body: "PNG is usually the easiest format for clean dot placement because it preserves sharp edges and transparent backgrounds well. JPG still works, but the generator performs best when the subject outline stays crisp and the background stays quiet.",
    },
    {
        title: "Can I print the final puzzle as PDF?",
        body: "Yes. Once the preview looks balanced, export the puzzle and print it on standard letter paper. Check the print preview before sending it to the printer so the outline stays centered and the number labels stay readable.",
    },
];

export default function HowToMakeClient({ locale }: { locale: string }) {
    const isEs = locale === "es";

    if (isEs) {
        return (
            <main className="bg-white py-1">
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 pb-2 border-b-4 border-brand-blue leading-tight">
                        Cómo Crear tus Propios Dibujos de Unir Puntos para Imprimir Online
                    </h1>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        Esta guía explica el proceso paso a paso para convertir una foto, dibujo o silueta en una ficha de unir puntos lista para imprimir.
                    </p>
                    <Link href="/es/" className="block w-full md:w-fit mx-auto px-8 py-3 my-8 bg-brand-blue text-white font-bold uppercase text-center rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all">
                        CREA TU DIBUJO DE UNIR PUNTOS AHORA
                    </Link>
                    <p className="text-base text-gray-700 leading-8">
                        Usa una imagen con buen contraste, ajusta la cantidad de puntos, revisa la vista previa y descarga el resultado cuando el contorno esté limpio. Si el fondo es confuso o la foto tiene demasiado ruido, recorta primero el sujeto principal para obtener una ficha más clara.
                    </p>
                </div>
            </main>
        );
    }

    const exampleCards = [
        {
            title: "Pet Photo Example",
            copy: "Use a pet image when the outline around the ears, back, and tail is clear enough to hold the dot path.",
            item: conversionExamples.pet,
        },
        {
            title: "Cartoon Outline Example",
            copy: "Simple line art gives the generator the cleanest path and usually needs fewer manual adjustments.",
            item: conversionExamples.outline,
        },
        {
            title: "Worksheet Example",
            copy: "Beginner-friendly worksheet shapes work well for printable classroom and home practice.",
            item: conversionExamples.worksheet,
        },
    ];

    return (
        <>
            <Script id="howto-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <Script id="howto-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <main className="bg-white py-1">
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                    <div className="max-w-4xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">Step-by-step tutorial</p>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                            How to Make Your Own Dot-to-Dot Worksheet from a Photo
                        </h1>
                        <p className="text-lg text-gray-600 leading-8 mb-6">
                            You can turn a photo, drawing, or outline into a printable dot-to-dot worksheet by starting with a clear subject, matching the dot count to the learner, and cleaning up the preview before export. The strongest results come from high-contrast images with simple edges and very little background clutter.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="rounded-full bg-slate-100 px-4 py-2">Last updated: July 15, 2026</span>
                            <Link href="/" className="rounded-full bg-brand-blue px-5 py-2 font-semibold text-white transition hover:bg-indigo-700">
                                Open the generator
                            </Link>
                        </div>
                    </div>

                    <section className="mt-12 grid gap-8 lg:grid-cols-3">
                        {exampleCards.map(({ title, copy, item }) => (
                            <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <div className="overflow-hidden rounded-2xl bg-white">
                                    <Image src={item.referenceImageUrl} alt={`${title} reference image`} width={420} height={420} className="aspect-square w-full object-contain" />
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <Image src={item.imageUrl} alt={`${title} dot-to-dot preview`} width={200} height={200} className="aspect-square rounded-2xl bg-white object-cover" />
                                    <Image src={item.solutionUrl} alt={`${title} solved outline`} width={200} height={200} className="aspect-square rounded-2xl bg-white object-cover" />
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-gray-900">{title}</h2>
                                <p className="mt-2 text-sm leading-7 text-gray-600">{copy}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-10">
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Make a Dot-to-Dot from Any Image</h2>
                                <p className="text-base text-gray-700 leading-8">
                                    The fastest workflow is simple: pick a clean source image, upload it to the generator, choose a dot count that fits the learner, and check the preview before you print. Most of the result quality comes from the source image rather than from endless tweaking after upload. If the subject outline is clear, the printable puzzle usually comes together quickly.
                                </p>
                                <ol className="mt-6 space-y-4">
                                    {[
                                        "Choose a photo, drawing, or silhouette with one obvious subject.",
                                        "Upload it to the generator and keep the subject centered.",
                                        "Set the dot count based on the age or difficulty you want.",
                                        "Review the preview and reduce clutter before export.",
                                        "Download and print the worksheet when the path is readable.",
                                    ].map((step, index) => (
                                        <li key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue font-bold text-white">{index + 1}</span>
                                            <span className="text-sm leading-7 text-gray-700">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Best Image Types to Use</h2>
                                <p className="text-base text-gray-700 leading-8">
                                    High-contrast line art, logos, pets photographed against plain backgrounds, and simple classroom illustrations tend to produce the cleanest dot paths. Busy group photos, textured landscapes, and low-light mobile pictures usually create too many edges and produce confusing dots. If you need to use a photo, crop it tightly and simplify it first.
                                </p>
                                <p className="text-xs text-gray-400 mt-3">
                                    Source:{" "}
                                    <a
                                        href="https://www.adobe.com/creativecloud/photography/technique/high-contrast.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-blue hover:underline"
                                    >
                                        Adobe — techniques for high-contrast photography
                                    </a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How Many Dots to Choose</h2>
                                <p className="text-base text-gray-700 leading-8 mb-5">
                                    Dot count controls both difficulty and how much of the image survives the conversion. If the picture has many curves or small details, increase the dot count gradually until the shape reads clearly.
                                </p>
                                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="bg-slate-100 text-slate-600">
                                                <th className="px-4 py-3 font-semibold">Goal</th>
                                                <th className="px-4 py-3 font-semibold">Age</th>
                                                <th className="px-4 py-3 font-semibold">Dot Count</th>
                                                <th className="px-4 py-3 font-semibold">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {DOT_COUNT_TABLE.map((row) => (
                                                <tr key={row.goal} className="border-t border-slate-100">
                                                    <td className="px-4 py-3 font-medium text-gray-800">{row.goal}</td>
                                                    <td className="px-4 py-3 text-gray-600">{row.age}</td>
                                                    <td className="px-4 py-3 font-bold text-brand-blue">{row.dots}</td>
                                                    <td className="px-4 py-3 text-gray-500">{row.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Turn a Photo into a Printable Puzzle</h2>
                                <p className="text-base text-gray-700 leading-8">
                                    Start by cropping the subject away from distracting background elements. Then convert the image to grayscale or boost contrast if the outline is weak. Photos with clear silhouettes usually convert best because the dot path can follow the outside edges cleanly. When the preview looks balanced, export the printable file and check that the number labels stay readable before printing.
                                </p>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Problems &amp; FAQ</h2>
                                <div className="space-y-5">
                                    {issues.map((issue) => (
                                        <article key={issue.title} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                                            <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                                            <p className="mt-2 text-sm leading-7 text-gray-600">{issue.body}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Examples: Pet Photo, Cartoon Outline, Worksheet</h2>
                                <p className="text-sm leading-7 text-gray-700">
                                    Pet images are best when the subject fills the frame and the background stays quiet. Cartoon outlines work well because the edges are already simplified. Worksheet-style images with one bold shape are the easiest option when you need a fast printable page for younger learners.
                                </p>
                            </section>
                        </div>
                    </section>

                    <section className="mt-14 rounded-[2rem] border border-slate-200 bg-slate-900 px-8 py-10 text-white">
                        <h2 className="text-3xl font-bold mb-4">Ready to build your own printable worksheet?</h2>
                        <p className="max-w-3xl text-slate-300 leading-8">
                            Use the generator when you need a dot-to-dot that matches a specific photo, classroom topic, student drawing, or pet image. The tool is better than a generic worksheet library when the shape matters and you want control over the dot count.
                        </p>
                        <Link href="/" className="mt-6 inline-flex rounded-full bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-indigo-700">
                            Open the free generator
                        </Link>
                    </section>
                </div>
            </main>
        </>
    );
}
