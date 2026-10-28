import Image from "next/image";
import Link from "next/link";

const copy = {
  "en": {
    "h1": "Free Christmas Connect the Dots Printables",
    "intro": "Original Christmas dot-to-dot puzzles with matching answers. Choose a design and the PDF that matches your paper.",
    "download": "Download",
    "puzzle": "Puzzle",
    "answer": "Solution",
    "count": "Numbered dots",
    "paper": "Paper",
    "print": "Print at Actual size / 100%. Check the 50 mm line with a ruler. Connect the numbers in order, then join the last number back to 1.",
    "note": "The ornament’s central decoration is already drawn; connect only its numbered outline. Each answer uses the same point and number positions as its puzzle. PDFs are in English and include a website credit.",
    "qa": "What is included?",
    "qb": "How difficult are these puzzles?",
    "ab": "The tree and presents puzzle has 40 numbered dots at 11 pt. The ornament has 150 numbered dots at 9.2 pt and is intended for adults who prefer a denser outline. Difficulty and completion time have not been independently rated.",
    "qc": "Are these free downloads?",
    "ac": "Yes. Download without an account for personal and classroom use. Each file includes a website credit.",
    "title": "Free Christmas Connect-the-Dots Printables",
    "label": "Christmas printable PDFs",
    "library": "Browse all printables",
    "adults": "Dot-to-dot printables for adults",
    "legacy": "Download tree A4 pack — puzzle + answer",
    "openPreview": "Open full-size puzzle preview"
  },
  "es": {
    "h1": "Dibujos de Unir Puntos de Navidad para Imprimir",
    "intro": "Puzzles navideños originales con sus soluciones correspondientes. Elige un diseño y el PDF del tamaño de tu papel.",
    "download": "Descargar",
    "puzzle": "Puzzle",
    "answer": "Solución",
    "count": "Puntos numerados",
    "paper": "Papel",
    "print": "Imprime a tamaño real / 100 %. Comprueba la línea de 50 mm con una regla. Une los números en orden y el último con el 1.",
    "note": "La decoración central del adorno ya está dibujada; une solo su contorno numerado. Cada solución usa las mismas posiciones de puntos y números que su puzzle. Los PDF están en inglés e incluyen el crédito del sitio.",
    "qa": "¿Qué se incluye?",
    "qb": "¿Qué dificultad tienen estos puzzles?",
    "ab": "El árbol y los regalos tienen 40 puntos numerados a 11 pt. El adorno tiene 150 puntos a 9,2 pt y está pensado para adultos que prefieren un contorno más denso. La dificultad y el tiempo no se han evaluado de forma independiente.",
    "qc": "¿Las descargas son gratuitas?",
    "ac": "Sí. Puedes descargar sin cuenta para uso personal y escolar. Cada archivo incluye el crédito del sitio.",
    "title": "Dibujos de Unir Puntos de Navidad Gratis para Imprimir",
    "label": "PDF navideños para imprimir",
    "library": "Ver todos los imprimibles",
    "adults": "Puzzles para adultos",
    "legacy": "Descargar paquete A4 del árbol — puzzle y solución",
    "openPreview": "Abrir la vista previa del puzzle a tamaño completo"
  },
  "it": {
    "h1": "Unisci i Puntini di Natale da Stampare Gratis",
    "intro": "Puzzle natalizi originali con le rispettive soluzioni. Scegli un disegno e il PDF adatto alla tua carta.",
    "download": "Scarica",
    "puzzle": "Puzzle",
    "answer": "Soluzione",
    "count": "Puntini numerati",
    "paper": "Carta",
    "print": "Stampa a dimensioni reali / 100%. Controlla la linea di 50 mm con un righello. Unisci i numeri in ordine e poi l’ultimo al numero 1.",
    "note": "La decorazione centrale è già disegnata; unisci solo il suo contorno numerato. Ogni soluzione usa le stesse posizioni di puntini e numeri del puzzle. I PDF sono in inglese e includono il credito del sito.",
    "qa": "Cosa è incluso?",
    "qb": "Quanto sono difficili questi puzzle?",
    "ab": "L’albero e i regali hanno 40 puntini numerati a 11 pt. La decorazione ha 150 puntini a 9,2 pt ed è pensata per adulti che preferiscono un contorno più denso. Difficoltà e durata non sono state valutate indipendentemente.",
    "qc": "I download sono gratuiti?",
    "ac": "Sì. Scarica senza account per uso personale e scolastico. Ogni file include il credito del sito.",
    "title": "Unisci i Puntini di Natale da Stampare Gratis",
    "label": "PDF natalizi da stampare",
    "library": "Tutti i disegni da stampare",
    "adults": "Puzzle per adulti",
    "legacy": "Scarica il pacchetto A4 dell’albero — puzzle e soluzione",
    "openPreview": "Apri l’anteprima del puzzle a dimensioni complete"
  }
};
const items = [
  {
    "slug": "christmas-tree-40",
    "count": 40,
    "font": "11 pt",
    "name": {
      "en": "Christmas Tree & Presents",
      "es": "Árbol de Navidad y regalos",
      "it": "Albero di Natale e regali"
    }
  },
  {
    "slug": "christmas-ornament-150",
    "count": 150,
    "font": "9.2 pt",
    "name": {
      "en": "Fluted Christmas Ornament",
      "es": "Adorno navideño estriado",
      "it": "Decorazione natalizia scanalata"
    }
  }
];

type FaqItem = { q: string; a: string };
const approvedFaqs = {
  "en": [
    {
      "q": "What is included in this Christmas PDF collection?",
      "a": "This page offers separate PDF downloads for two original designs: a 40-point Christmas tree and presents puzzle and a 150-point ornament. Each has matching Puzzle and Solution PDFs in native A4 and US Letter sizes."
    },
    {
      "q": "How do I download the puzzle and answer?",
      "a": "Choose a labeled Puzzle or Solution link for A4 or US Letter, then open the PDF and inspect the print preview. The legacy /ChristmasDottoDot.pdf contains only the two-page A4 P1 tree puzzle (40 points) and its matching answer."
    },
    {
      "q": "Are the downloads free, and do they include a website credit?",
      "a": "The static PDFs are free to download without an account for personal and classroom use. They include a website credit in the footer."
    },
    {
      "q": "What ages and difficulty levels are these puzzles suitable for?",
      "a": "Digital checks confirm 40 and 150 numbered dots. Age suitability, difficulty and completion time have not been independently rated. Physical printing and independent full playtesting have not been performed."
    }
  ],
  "es": [
    {
      "q": "¿Qué incluye esta colección de PDF navideños?",
      "a": "Esta página ofrece descargas PDF independientes de dos diseños originales: un árbol de Navidad y regalos de 40 puntos y un adorno de 150 puntos. Cada diseño tiene PDF de actividad y solución correspondientes en tamaños nativos A4 y carta (US Letter)."
    },
    {
      "q": "¿Cómo descargo el puzzle y su solución?",
      "a": "Elige un enlace de Puzzle o Solución para A4 o US Letter, abre el PDF y revisa la vista previa de impresión. El archivo anterior /ChristmasDottoDot.pdf contiene solo dos páginas A4 del P1: el árbol de 40 puntos y su solución correspondiente."
    },
    {
      "q": "¿Las descargas son gratuitas e incluyen el crédito del sitio?",
      "a": "Los PDF estáticos se descargan gratis y sin cuenta para uso personal y escolar. Incluyen el crédito del sitio en el pie de página."
    },
    {
      "q": "¿Para qué edades y niveles de dificultad son estos puzzles?",
      "a": "Las comprobaciones digitales confirman 40 y 150 puntos numerados. No se han evaluado de forma independiente la edad recomendada, la dificultad ni el tiempo de realización. No se han realizado pruebas de impresión física ni una resolución completa por una persona independiente."
    }
  ],
  "it": [
    {
      "q": "Cosa include questa raccolta di PDF natalizi?",
      "a": "Questa pagina offre PDF separati per due disegni originali: un albero di Natale con regali da 40 punti e una decorazione da 150 punti. Ogni disegno ha PDF puzzle e soluzione corrispondenti nei formati nativi A4 e US Letter."
    },
    {
      "q": "Come scarico il puzzle e la soluzione?",
      "a": "Scegli un collegamento Puzzle o Soluzione per A4 o US Letter, apri il PDF e controlla l’anteprima di stampa. Il file precedente /ChristmasDottoDot.pdf contiene soltanto due pagine A4 del P1: l’albero da 40 punti e la soluzione corrispondente."
    },
    {
      "q": "I download sono gratuiti e includono il credito del sito?",
      "a": "I PDF statici si scaricano gratuitamente senza account per uso personale e scolastico. Includono il credito del sito nel piè di pagina."
    },
    {
      "q": "A quali età e livelli di difficoltà sono adatti questi puzzle?",
      "a": "I controlli digitali confermano 40 e 150 punti numerati. Età consigliata, difficoltà e tempo di completamento non sono stati valutati indipendentemente. Non sono state effettuate prove di stampa fisica né una risoluzione completa da parte di una persona indipendente."
    }
  ]
};

// B approval applies only to the three named locales. Preserve A's existing
// English-copy fallback FAQ for all other locale routes.
export function getChristmasFaqs(locale: string): FaqItem[] {
    if (locale === "en" || locale === "es" || locale === "it") return approvedFaqs[locale];
    const c = copy.en;
    const included = items.map(i => `${i.name.en} (${i.count})`).join("; ");
    return [{ q: c.qa, a: `${included}. A4 / US Letter. ${c.note}` }, { q: c.qb, a: c.ab }, { q: c.qc, a: c.ac }];
}

export default function ChristmasPrintableDownloads({ locale }: { locale: string }) {
    const lang = locale === "es" || locale === "it" ? locale : "en";
    const c = copy[lang];
    const prefix = locale === "en" ? "" : `/${locale}`;
    const faqs = getChristmasFaqs(locale);
    return <main className="bg-slate-50 py-10 text-slate-800">
        <div className="mx-auto max-w-6xl space-y-8 px-5">
            <section className="rounded-3xl bg-white p-7 shadow-sm">
                <p className="mb-3 text-sm font-bold text-brand-blue">{c.label}</p>
                <h1 className="text-3xl font-extrabold md:text-5xl">{c.h1}</h1>
                <p className="mt-5 text-lg leading-8">{c.intro}</p>
                <nav aria-label={c.label} className="mt-5 flex flex-wrap gap-4">
                    {items.map(item => <a className="font-semibold text-brand-blue underline" key={item.slug} href={`#${item.slug}`}>{item.name[lang]} · {item.count}</a>)}
                </nav>
                <a href="/ChristmasDottoDot.pdf" download className="mt-5 inline-block text-sm font-semibold text-brand-blue underline">{c.legacy}</a>
            </section>
            {items.map(item => {
                const base = `/printables/${item.slug}/v1/${item.slug}`;
                return <article id={item.slug} key={item.slug} className="grid scroll-mt-5 gap-7 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold">{item.name[lang]}</h2>
                        <a href={`${base}-A4-Puzzle.png`} target="_blank" rel="noreferrer" aria-label={`${c.openPreview}: ${item.name[lang]}`}>
                            <Image src={`${base}-A4-Puzzle.png`} alt={`${item.name[lang]} — ${item.count} numbered dots`} width={893} height={1263} unoptimized className="mt-4 h-auto w-full border border-slate-200" />
                        </a>
                    </div>
                    <div className="space-y-5">
                        <p className="font-semibold">{c.count}: 1–{item.count} · {item.font}</p>
                        <p className="leading-7">{c.print}</p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {["A4", "Letter"].map(paper => <div key={paper} className="rounded-xl border border-slate-200 p-4">
                                <h3 className="font-bold">{paper === "Letter" ? "US Letter · 8.5 × 11 in" : "A4 · 210 × 297 mm"}</h3>
                                <a className="mt-4 block rounded-lg bg-brand-blue p-3 text-center font-semibold text-white" download href={`${base}-${paper}-Puzzle.pdf`}>{c.download} {c.puzzle} PDF</a>
                                <a className="mt-3 block rounded-lg border border-brand-blue p-3 text-center font-semibold text-brand-blue" download href={`${base}-${paper}-Solution.pdf`}>{c.download} {c.answer} PDF</a>
                            </div>)}
                        </div>
                        <details className="rounded-xl border border-slate-200 p-4">
                            <summary className="cursor-pointer font-semibold">{c.answer}</summary>
                            <Image src={`${base}-A4-Solution.png`} alt={`${item.name[lang]} — matching solution`} width={893} height={1263} unoptimized className="mt-4 h-auto w-full" />
                        </details>
                    </div>
                </article>;
            })}
            <section className="rounded-3xl bg-white p-7">
                <p className="leading-7">{c.note}</p>
                <div className="mt-6 space-y-5">{faqs.map(f => <div key={f.q}><h2 className="text-lg font-bold">{f.q}</h2><p className="mt-2 leading-7">{f.a}</p></div>)}</div>
                <nav className="mt-7 flex flex-wrap gap-5 font-semibold text-brand-blue">
                    <Link className="underline" href={`${prefix}/printable-connect-the-dots/`}>{c.library}</Link>
                    <Link className="underline" href={`${prefix}/connect-the-dots-for-adults/`}>{c.adults}</Link>
                </nav>
            </section>
        </div>
    </main>;
}
