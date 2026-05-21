import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { animalShowcase } from "@/lib/seo-showcase";

const topAnimals = animalShowcase.slice(0, 4);
const mediumAnimals = animalShowcase.slice(4, 9);
const fullList = animalShowcase;

const animalSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Animal Dot-to-Dot Printables",
    url: "https://connectthedotsprintable.online/free-animal-dot-to-dot-printables-pdf/",
    about: "Printable animal dot-to-dot worksheets for kids and adults.",
    mainEntity: {
        "@type": "ItemList",
        itemListElement: fullList.slice(0, 10).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://connectthedotsprintable.online${item.detailPage}`,
            name: item.title,
        })),
    },
};

const animalFaq = [
    {
        question: "What animals are included in these printable worksheets?",
        answer: "This page highlights animal dot-to-dot printables built around rabbits, dogs, cats, turtles, foxes, owls, bears, dolphins, whales, giraffes, koalas, frogs, snails, and squirrels. The mix is broad enough to cover early classroom themes, pets, forest animals, and ocean units without forcing users into a single narrow animal category.",
    },
    {
        question: "Are these animal connect-the-dots pages good for kids and adults?",
        answer: "Yes. The easier worksheets fit preschool and elementary use because the outlines are simpler and the dot counts stay manageable. The denser animal pages suit older kids and adults who want a longer printable challenge, more visual detail, or a calmer concentration activity. The best match depends on the dot count, not only on the animal itself.",
    },
];

export default function AnimalContent() {
    return (
        <>
            <Script id="animal-collection-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(animalSchema) }} />
            <main className="bg-slate-50 py-10">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
                    <section className="rounded-[2rem] bg-white p-6 md:p-10 shadow-xl">
                        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">Animal worksheet hub</p>
                                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-5">
                                    Free Animal Dot-to-Dot Printables and PDF Worksheets
                                </h1>
                                <p className="text-lg leading-8 text-gray-600 mb-6">
                                    These animal dot-to-dot printables give you ready-made worksheets for rabbits, dogs, cats, turtles, foxes, owls, bears, dolphins, whales, giraffes, koalas, frogs, snails, and squirrels. Use the easier pages for early counting practice, then move into denser animal worksheets when you need more detail or a harder printable challenge.
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    {["Rabbit", "Dog", "Cat", "Turtle", "Fox", "Owl", "Dolphin", "Whale"].map((tag) => (
                                        <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {topAnimals.map((item) => (
                                    <Link key={item.id} href={item.detailPage} className="group rounded-3xl border border-slate-100 bg-slate-50 p-3">
                                        <Image src={item.imageUrl} alt={item.altText} width={280} height={280} className="aspect-square w-full rounded-2xl object-cover" />
                                        <p className="mt-3 font-semibold text-gray-900 group-hover:text-brand-blue">{item.title}</p>
                                        <p className="text-sm text-slate-500">{Array.isArray(item.dotRange) ? `${item.dotRange[0]}-${item.dotRange[1]} dots` : item.dotRange}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-3">
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Easy Animal Dot-to-Dot Printables</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Easier animal worksheets work best when you need fast wins for preschool, kindergarten, and early elementary counting practice. Rabbits, puppies, cats, turtles, penguins, frogs, and snails are strong beginner options because the shapes stay recognizable even with fewer dots and less visual complexity.
                            </p>
                        </article>
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Animal Dot-to-Dot Printables for Kids</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Animal worksheets are useful for number recognition, hand control, and subject-based classroom themes because the picture itself helps hold attention. A child who already likes a dog, rabbit, owl, or dolphin is far more likely to finish the printable page and get the learning benefit that comes with completing the sequence.
                            </p>
                        </article>
                        <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Hard Animal Dot-to-Dot Printables for Older Kids and Adults</h2>
                            <p className="text-sm leading-7 text-gray-600">
                                Older kids and adults usually need denser dot counts and more detailed outlines to keep the activity engaging. Foxes, owls, giraffes, dolphins, whales, and squirrels work well here because the extra curves and shape detail justify a more advanced printable puzzle instead of ending too quickly.
                            </p>
                        </article>
                    </section>

                    <section className="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-slate-100">
                        <div className="flex items-end justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Popular Animal Themes</h2>
                                <p className="mt-2 text-sm text-gray-600">Real animal assets already live on the site, so this page now shows actual worksheet themes instead of generic placeholders.</p>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {mediumAnimals.map((item) => (
                                <Link key={item.id} href={item.detailPage} className="group rounded-3xl border border-slate-100 bg-slate-50 p-3">
                                    <Image src={item.imageUrl} alt={item.altText} width={220} height={220} className="aspect-square w-full rounded-2xl object-cover" />
                                    <p className="mt-3 font-semibold text-gray-900 group-hover:text-brand-blue">{item.title}</p>
                                    <p className="text-xs text-slate-500">{item.category.join(" · ")}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Animal Worksheets You Can Print Today</h2>
                            <p className="text-sm leading-7 text-gray-600 mb-5">
                                If you need a ready-made PDF-style worksheet today, start with the animal detail pages because they already show the puzzle preview and solved outline. If you need a specific pet, mascot, or classroom topic that is not in the library yet, switch to the custom generator and build your own animal puzzle from a new image.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/printable-connect-the-dots/" className="rounded-full bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                                    Browse animal printables
                                </Link>
                                <Link href="/printables/connectTheDotsGenerator/" className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-brand-blue hover:text-brand-blue">
                                    Make your own animal puzzle
                                </Link>
                            </div>
                        </article>

                        <article className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Animal FAQ</h2>
                            <div className="space-y-5">
                                {animalFaq.map((item) => (
                                    <div key={item.question} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                                        <h3 className="font-semibold text-gray-900">{item.question}</h3>
                                        <p className="mt-2 text-sm leading-7 text-gray-600">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>
                </div>
            </main>
        </>
    );
}
