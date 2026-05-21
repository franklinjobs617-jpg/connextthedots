import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const christmasSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Christmas Connect-the-Dots Printables",
    url: "https://connectthedotsprintable.online/christmas-printables/",
    about: "Easy and hard Christmas connect-the-dots PDF worksheets.",
};

const christmasFaq = [
    {
        question: "What Christmas themes are included in these printables?",
        answer: "This Christmas printable page is built for the themes searchers most often expect: Santa, Christmas trees, ornaments, winter scenes, and holiday classroom activities. The goal is to make the first screen immediately signal that the page is about printable holiday worksheets rather than about the general generator product.",
    },
    {
        question: "Are there easy and hard Christmas dot-to-dot worksheets here?",
        answer: "Yes. The page is structured to separate easy kids worksheets from denser Christmas connect-the-dots pages for older kids and adults. Easy puzzles use clearer shapes and faster completion times, while harder versions use more dots and more detailed holiday outlines to support longer, calmer activity sessions.",
    },
];

const galleryImages = [
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Christmas-Dot-To-Dot-Bundle-Hero.webp",
        alt: "Easy Christmas connect-the-dots printable collage",
        label: "Easy kids worksheet",
    },
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Paper-Type-Comparison-Print-Quality.webp",
        alt: "Printable Christmas worksheet and print quality comparison",
        label: "Printable PDF proof",
    },
    {
        src: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/Hard-Christmas-Ornament-Connect-The-Dots-Adults.webp",
        alt: "Hard Christmas ornament connect-the-dots printable for adults",
        label: "Hard adult puzzle",
    },
];

export default function ChristmasContent() {
    return (
        <>
            <Script id="christmas-collection-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(christmasSchema) }} />
            <main className="bg-slate-50 py-10">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
                    <section className="rounded-[2rem] bg-white p-6 md:p-10 shadow-xl">
                        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">Seasonal printable hub</p>
                                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-5">
                                    Free Christmas Connect-the-Dots Printables
                                </h1>
                                <p className="text-lg leading-8 text-gray-600 mb-6">
                                    This page is for people who want a printable Christmas dot-to-dot worksheet right away. It covers easy kids pages, harder holiday puzzles for older learners, and practical print guidance so the worksheet looks clean on paper instead of reading like a generic generator pitch.
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    {["Santa", "Christmas Tree", "Ornaments", "Holiday Scene", "Classroom Activity"].map((tag) => (
                                        <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                {galleryImages.map((image) => (
                                    <figure key={image.label} className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                                        <Image src={image.src} alt={image.alt} width={320} height={320} className="aspect-square w-full rounded-2xl object-cover" />
                                        <figcaption className="mt-3 text-sm font-medium text-gray-700">{image.label}</figcaption>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-3">
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Easy Christmas Dot-to-Dot Printables for Kids</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Easier Christmas pages are best when you need a short, printable holiday activity for preschool or elementary learners. Santa faces, trees, ornaments, and simple winter shapes are easier to recognize with lower dot counts, which keeps the worksheet fun instead of turning it into a frustration exercise.
                            </p>
                        </article>
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Hard Christmas Connect-the-Dots for Older Kids and Adults</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Hard Christmas printables work well for older kids and adults who want a denser holiday puzzle with more lines and more detail. Ornament, wreath, and scene-based layouts justify the extra dots because the final image becomes more satisfying when it takes longer to finish and holds attention longer.
                            </p>
                        </article>
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Popular Holiday Themes</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Searchers usually want seasonal themes that are obvious from the snippet and first screen, so the page now foregrounds Santa, Christmas trees, ornaments, winter scenes, and classroom-friendly holiday activity ideas. That keeps the page aligned to printable intent instead of splitting attention with unrelated product copy.
                            </p>
                        </article>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Print Christmas PDF Worksheets</h2>
                            <ol className="space-y-4">
                                {[
                                    "Open the worksheet or printable detail page that matches the age group and difficulty you need.",
                                    "Check the preview before printing so the image stays centered and the number labels remain readable.",
                                    "Use standard letter paper and choose fit-to-page or fit-to-printable-area in the printer dialog.",
                                    "If you want a thicker holiday activity sheet, switch to cardstock after confirming the page layout on normal paper.",
                                ].map((step, index) => (
                                    <li key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue font-bold text-white">{index + 1}</span>
                                        <span className="text-sm leading-7 text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </article>

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Holiday Classroom and Home Activity Ideas</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-4">
                                Christmas connect-the-dots pages work best as short screen-free breaks, quiet center work, or printable activities during travel and family gatherings. They also fit well into classroom rotations because the worksheet can double as counting practice first and coloring activity second.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">Morning work</span>
                                <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">Holiday centers</span>
                                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">Travel activity</span>
                                <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">Color after connecting</span>
                            </div>
                        </article>
                    </section>

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
                            <h2 className="text-3xl font-bold mb-4">Need a custom holiday worksheet instead?</h2>
                            <p className="max-w-2xl text-slate-300 leading-8 mb-6">
                                Use the generator if you want a Christmas worksheet built from a custom outline, logo, class mascot, or seasonal drawing. The printable page is for ready-made holiday sheets. The generator is for specific holiday images that are not already in the library.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/printable-connect-the-dots/" className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200">
                                    Browse Christmas-style printables
                                </Link>
                                <Link href="/printables/connectTheDotsGenerator/" className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
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
