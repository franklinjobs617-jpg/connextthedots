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

export default function ChristmasPrintableDownloads({ locale }: { locale: string }) {
    const lang = locale === "es" || locale === "it" ? locale : "en";
    const c = copy[lang];
    const prefix = locale === "en" ? "" : `/${locale}`;
    const included = items.map(i => `${i.name[lang]} (${i.count})`).join("; ");
    const faqs = [{ q: c.qa, a: `${included}. A4 / US Letter. ${c.note}` }, { q: c.qb, a: c.ab }, { q: c.qc, a: c.ac }];
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
