import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react"
import { getAlternates, getUrl } from "@/lib/metadata";
type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    const title = isEs
        ? "Fichas de Unir Puntos para Imprimir Gratis: Descargas HD y Guía de Calidad"
        : "Connect the Dot Printable: High-Quality Resources & Essential Printing Guide";

    const description = isEs
        ? "Consigue dibujos de unir puntos para imprimir en alta calidad. Ofrecemos fichas de unir puntos para niños y adultos listas para descargar gratis en PDF o imagen HD."
        : "Get free watermark-free connect the dots printables for kids & adults. Create custom dot-to-dot activities with our generator, instant download in PDF/HD image.";

    const path = "/printables/general/";
    return {
        title,
        description,
        alternates: getAlternates(locale, path),

        openGraph: {
            title,
            description,
            url: getUrl(locale, path),
            images: [
                {
                    url: `/images/og-image.png`,
                    alt: isEs ? "Vista previa del generador de dibujos" : "Connect the Dots Generator Preview",
                },
            ],
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;
    const isEs = locale === "es";
    if (locale === "de") {
        redirect("/en/printables/general");
    }

    return <>

        <main className="bg-slate-50 py-8 lg:py-12">
            <div className="container mx-auto max-w-7xl px-6 lg:px-8 bg-white shadow-xl rounded-xl p-6 md:p-10 text-gray-800">

                {isEs ? (
                    /* ========================================================
                       西班牙语内容 (es)
                       ======================================================== */
                    <>
                        <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                            Dibujos de Unir Puntos para Imprimir: <span className="text-brand-blue"><strong>Fichas HD de Alta Calidad y Guía de Impresión</strong></span>
                        </h1>

                        <p className="text-lg mb-6 leading-relaxed text-gray-700">
                            <span className="font-semibold text-brand-blue"><strong>¿Listo para desbloquear tu creatividad y concentración?</strong></span> El simple pero poderoso acto de completar un <strong>dibujo de unir puntos para imprimir</strong> es una actividad amada universalmente, sirviendo como una mezcla perfecta de diversión, aprendizaje y relajación. Nuestro objetivo es proporcionarte plantillas de alta resolución listas para usar en segundos. Ya sea que busques un descanso mental o una actividad para el desarrollo motriz, estas fichas ofrecen resultados inmediatos y tangibles.
                        </p>

                        <h2 className="section-title">Análisis Principal: Fichas de Unir Puntos, Especificaciones y Valor</h2>

                        <p className="mb-4 text-gray-700">
                            Un recurso de unir puntos valioso se define por su calidad y adaptabilidad. Nos aseguramos de que nuestras fichas, incluyendo tanto las fáciles como los <strong>dibujos de unir puntos difíciles</strong>, cumplan con estándares profesionales de claridad y eficacia educativa.
                        </p>

                        {/* Download Module (ES) */}
                        <div id="pdf-download-module-general" className="bg-blue-50 rounded-2xl overflow-hidden shadow-md border border-blue-100 mb-8">
                            <div className="md:flex">
                                <div className="md:w-1/3 lg:w-1/4 relative min-h-[200px]">
                                    <Image
                                        src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/4-educational-connect-the-dots-worksheet-featuring-letters-and-numbers.avif"
                                        alt="Vista previa del pack de inicio"
                                        fill
                                        className="object-cover"
                                    />
                                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">Vista Previa Pack Inicial</span>
                                </div>

                                <div className="p-6 flex flex-col justify-center md:w-2/3 lg:w-3/4">
                                    <div className="flex items-center mb-3">
                                        <Download className="h-6 w-6 text-blue-600 mr-2" />
                                        <span className="text-blue-700 font-bold tracking-wide text-sm uppercase">Descarga Gratuita Inmediata</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Descarga tu Pack Inicial de Unir Puntos Gratis</h3>
                                    <p className="text-gray-700 mb-6 text-md">Accede inmediatamente a una mezcla diversa de dibujos fáciles, medios y difíciles. ¡Perfecto para todas las edades y niveles de habilidad!</p>

                                    <div>
                                        <Link href="/ThemedPrintables.pdf" download className="inline-flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-bold rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                            <Download className="h-6 w-6 mr-2" /> DESCARGAR PDF GRATIS AHORA
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-3 ml-2">* Sin registro de correo. Descarga inmediata.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Resumen de Especificaciones: Por qué nuestras plantillas son mejores</h3>
                        <ul className="list-disc list-inside space-y-2 mb-8 ml-4 text-gray-700 text-sm md:text-base">
                            <li><strong>Niveles de dificultad:</strong> Desde <strong>Principiante (1-50 puntos)</strong> para niños hasta <strong>Experto (200+ puntos)</strong> para adultos.</li>
                            <li><strong>Rango Numérico:</strong> Cubrimos un amplio espectro, desde diseños de <strong>1 a 20</strong> hasta patrones intrincados para horas de entretenimiento.</li>
                            <li><strong>Nuestro generador te permite crear dibujos de unir puntos del 1 al 20, del 1 al 100 o cualquier rango personalizado</strong>, ideal para aprender los números.</li>
                            <li><strong>Formato de impresión:</strong> <strong>PDF de Alta Definición (HD)</strong>, garantizando líneas limpias y nítidas que no se pixelan al imprimir.</li>
                        </ul>

                        <p className="mb-4 text-gray-700">Estos rompecabezas no son solo pasatiempos; son herramientas reconocidas para el desarrollo cognitivo. La secuencia de números fomenta principios educativos fundamentales de una manera amena.</p>

                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Secuencia, Enfoque y Razonamiento Espacial</h3>
                        <ul className="list-disc list-inside space-y-2 mb-8 ml-4 text-gray-700">
                            <li><strong>Aprendizaje secuencial:</strong> Refuerza el concepto del orden numérico. Esta habilidad es vital para el éxito en matemáticas y programación.</li>
                            <li><strong>Atención plena:</strong> Para <strong>adultos</strong>, la naturaleza del puzzle basada en reglas proporciona un escape perfecto del ajetreo cognitivo diario.</li>
                            <li><strong>Perfecto para actividades de unir puntos con operaciones matemáticas:</strong> puedes usar nuestras fichas para retos escolares donde cada número sea la respuesta a una suma o resta.</li>
                        </ul>

                        <h2 className="section-title">Guía de Uso e Impresión para Resultados Óptimos</h2>
                        <p className="mb-4 text-gray-700">Para lograr los resultados más nítidos, ya sea imprimiendo en casa o en la escuela, sigue estos pasos prácticos recomendados por expertos en manualidades.</p>

                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Pasos sencillos para una impresión perfecta</h3>
                        <ol className="list-decimal list-inside space-y-2 mb-8 ml-4 text-gray-700">
                            <li><strong>Ajustes de impresora:</strong> Antes de imprimir, verifica que la escala esté en <strong>“Tamaño Real” (100%)</strong> o “Sin Escala” para evitar distorsiones en los puntos.</li>
                            <li><strong>Calidad del papel:</strong> Sugerimos usar papel estándar de buena calidad o <strong>cartulina ligera</strong> si planeas colorear la imagen final con marcadores.</li>
                            <li><strong>Precisión al unir:</strong> Para la mejor calidad de trazo, usa un <strong>lápiz afilado o un marcador de punta fina</strong>.</li>
                        </ol>

                        <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                            <p className="text-xl font-extrabold text-gray-800">¡Deja de descargar fichas genéricas! <br className="sm:hidden" />Empieza a <span className="text-brand-blue"><strong>Generar el Dibujo Perfecto</strong></span>.</p>
                            <Link href="/es/" className="mt-4 text-white text-lg font-bold bg-brand-blue hover:bg-blue-700 py-3 px-8 rounded-full shadow-xl inline-block transition">
                                Generar Dibujo Personalizado
                            </Link>
                        </div>

                        <h2 className="section-title">Preguntas Frecuentes (FAQs)</h2>
                        <div className="space-y-6 text-gray-700">
                            <div>
                                <p className="font-bold">P: ¿Cómo sé si un dibujo de unir puntos es para adultos o niños?</p>
                                <p className="mt-2 pl-4 border-l-2 border-gray-200">R: Las versiones para adultos suelen superar los 150 puntos, usan números más pequeños y cercanos entre sí, y a menudo presentan imágenes abstractas o muy detalladas.</p>
                            </div>
                            <div>
                                <p className="font-bold">P: ¿Por qué el PDF es el mejor formato para estas fichas?</p>
                                <p className="mt-2 pl-4 border-l-2 border-gray-200">R: El formato PDF asegura que el diseño, incluyendo la posición exacta de los puntos y números, se mantenga idéntico sin importar el dispositivo o la impresora que utilices.</p>
                            </div>
                        </div>
                    </>
                ) : (
                    /* ========================================================
                       英语内容 (en)
                       ======================================================== */
                    <>
                        <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                            Connect the Dot Printable: <span className="text-brand-blue"><strong>High-Quality Resources & Essential Printing Guide</strong></span>
                        </h1>

                        <p className="text-lg mb-6">
                            <span className="font-semibold text-brand-blue"><strong>Ready to unlock instant creativity and focus?</strong></span> The simple yet powerful act of completing a <strong>connect the dot printable</strong> is a universally loved activity, serving as a perfect blend of fun, learning, and relaxation.<br className="sm:hidden" /> Our goal is to provide you with crystal-clear, high-resolution templates that are ready to go in seconds. Whether you're seeking a quick mental break or a constructive activity for fine motor skill development, these printables offer immediate, tangible results.
                        </p>

                        <h2 className="section-title">Core Analysis: Connect the Dot Printables Deep Specifications and Value</h2>
                        <p className="mb-4">
                            A truly valuable dot-to-dot resource is defined by quality and adaptability.<br className="sm:hidden" /> We ensure our printables—including both easy and <strong>hard connect the dots printable</strong> varieties—meet professional standards for clarity and educational efficacy.
                        </p>

                        {/* Download Module (EN) */}
                        <div id="pdf-download-module-general" className="bg-blue-50 rounded-2xl overflow-hidden shadow-md border border-blue-100 mb-8">
                            <div className="md:flex">
                                <div className="md:w-1/3 lg:w-1/4 relative min-h-[200px]">
                                    <Image
                                        src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/4-educational-connect-the-dots-worksheet-featuring-letters-and-numbers.avif"
                                        alt="Preview starter pack"
                                        fill
                                        className="object-cover"
                                    />
                                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">Starter Pack Preview</span>
                                </div>

                                <div className="p-6 flex flex-col justify-center md:w-2/3 lg:w-3/4">
                                    <div className="flex items-center mb-3">
                                        <Download className="h-6 w-6 text-blue-600 mr-2" />
                                        <span className="text-blue-700 font-bold tracking-wide text-sm uppercase">Instant Free Download</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Download Your Free Connect the Dots Starter Pack</h3>
                                    <p className="text-gray-700 mb-6 text-md">Access a diverse mix of easy, medium, and hard difficulty dot-to-dot printables immediately. Perfect for all ages and skill levels!</p>

                                    <div>
                                        <Link href="/ThemedPrintables.pdf" download className="inline-flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-bold rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                            <Download className="h-6 w-6 mr-2" /> FREE PDF DOWNLOAD NOW
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-3 ml-2">* No email required. Immediate download.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Specs Overview: Why Our Dot-to-Dot Templates Are Superior</h3>
                        <ul className="list-disc list-inside space-y-2 mb-8 ml-4 text-gray-700">
                            <li><strong>Difficulty Level:</strong> Ranges from <strong>Beginner (1-50 dots)</strong> for children to <strong>Expert (200+ dots)</strong> for focused adults.</li>
                            <li><strong>Dot Range:</strong> Covering a broad spectrum from simple <strong>1 to 20</strong> designs up to intricate, complex patterns for hours of engagement.</li>
                            <li><strong>Suitable For:</strong> All ages, focusing on improving sequential logic, number recognition, and <strong>fine motor skills</strong>.</li>
                            <li><strong>Print Format:</strong> <strong>High-Definition (HD) PDF</strong>, ensuring clean, sharp lines that won't blur when printed, making them perfect for coloring post-completion.</li>
                        </ul>

                        <p className="mb-4">These puzzles are not just for passing time; they are a recognized tool for cognitive development.<br className="sm:hidden" /> The sequence of numbers fosters foundational educational principles in an engaging, non-intimidating format.</p>

                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Sequencing, Focus, and Spatial Reasoning</h3>
                        <ul className="list-disc list-inside space-y-2 mb-8 ml-4 text-gray-700">
                            <li><strong>Enhanced Sequential Learning:</strong> The brand-blue benefit is reinforcing the concept of numerical order. This fundamental skill is vital for success in mathematics and coding later in life.</li>
                            <li><strong>Improved Focus and Concentration:</strong> Completing detailed lines requires sustained attention. This simple, repetitive action calms the nervous system and builds the capacity for deep work.</li>
                            <li><strong>Developing Spatial Reasoning:</strong> As the lines are connected, the user anticipates the shape, improving their ability to visualize objects in 2D space, a key component of visual-spatial intelligence.</li>
                        </ul>

                        <h2 className="section-title">How to Get the Optimal Experience: Printing and Usage Guide</h2>
                        <p className="mb-4">Achieving flawless lines and crisp numbers starts with the correct printing setup. Use this practical advice for superior results.</p>

                        <h3 className="text-xl font-semibold text-gray-600 mb-3">Easy Steps for a Perfect Print</h3>
                        <ol className="list-decimal list-inside space-y-2 mb-8 ml-4 text-gray-700">
                            <li><strong>Scaling Check:</strong> Before printing, always confirm the setting is on <strong>“100% Scale”</strong> to ensure the dots remain in their exact intended positions without proportional error.</li>
                            <li><strong>Preventing Smudging:</strong> Use a standard, uncoated white paper.</li>
                            <li><strong>Tool Consistency:</strong> Use a consistent writing instrument throughout the puzzle.</li>
                        </ol>

                        <h2 className="section-title">Need the Perfect Difficulty/Theme Combination? You Need Customization!</h2>
                        <p className="mb-6">If you need a specific puzzle, static archives will fall short. Our interactive tool allows you to create your exact perfect printable file.</p>

                        <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                            <p className="text-xl font-extrabold text-gray-800">
                                Stop downloading generic files! <br className="sm:hidden" />Start <span className="text-brand-blue"><strong>Generating the Perfect Puzzle</strong></span>.
                            </p>
                            <Link href="/"
                                className="mt-4 text-white text-lg font-bold bg-brand-blue hover:bg-blue-700 py-3 px-8 rounded-full shadow-xl inline-block transition">
                                Click Here to Custom Generate Your Own Dot-to-Dot Puzzle
                            </Link>
                        </div>

                        <h2 className="section-title">Frequently Asked Questions (FAQs)</h2>
                        <div className="space-y-6 text-gray-700">
                            <div>
                                <p className="font-bold">Q: Can I use your generator to turn my own photos into a printable?</p>
                                <p className="mt-2 pl-4 border-l-2 border-gray-200">A: Yes, you can upload any clear photo to convert it into a puzzle.</p>
                            </div>
                            <div>
                                <p className="font-bold">Q: Are all puzzles numbered?</p>
                                <p className="mt-2 pl-4 border-l-2 border-gray-200">A: Most downloads are numbered, but our Custom Generator offers alphabet options too.</p>
                            </div>
                            <div>
                                <p className="font-bold">Q: Can I complete these on a tablet?</p>
                                <p className="mt-2 pl-4 border-l-2 border-gray-200">A: Absolutely. The PDF files work great with stylus apps.</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>

    </>;
}