"use client"
import Image from "next/image";
import Link from "next/link";

export default function HardPageClient({ locale }: { locale: string }) {
    const isEs = locale === 'es';

    return (
        <>
            <style jsx global>{`
        .section-title {
            font-size: 24px;
            font-weight: 700;
            line-height: 32px;
            color: #1b1b1b;
            margin: 12px 0;
            border-left: 5px solid #3b82f6;
            padding-left: 1rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        @media (max-width: 768px) {
            .section-title { font-size: 20px; }
        }
        .cta-box { background-color: #eff6ff; border: 2px dashed #3b82f6; }
      `}</style>

            <main className="bg-slate-50 py-8 lg:py-12">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 bg-white shadow-xl rounded-xl p-6 md:p-10 text-gray-800">

                    {isEs ? (
                        /* ========================================================
                           西班牙语内容 (es)
                           ======================================================== */
                        <>
                            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                                Dibujos de Unir Puntos Difíciles: <span className="text-[#4F46E5]"><strong>Reto Extremo y Guía de Entrenamiento de Concentración</strong></span>
                            </h1>

                            <p className="text-lg mb-6 leading-relaxed text-gray-700">
                                <span className="font-semibold text-[#4F46E5]"><strong>Introducción: El poder del reto mental</strong></span><br />
                                ¿Cansado de los puzzles simples? Si eres un adulto buscando relajación o un estudiante que necesita un desafío, un <strong>ejercicio de unir puntos difícil</strong> es la herramienta perfecta. Estos dibujos no solo revelan una imagen, sino que entrenan la paciencia y la atención al detalle.
                            </p>

                            <h2 className="section-title">¿Por qué las fichas digitales superan a los libros tradicionales?</h2>
                            <p className="mb-4 text-gray-700">El cambio hacia el uso de un <strong>generador de unir puntos</strong> online se debe a tres factores: velocidad, personalización y coste cero.</p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">1. Personalización sin límites</h3>
                            <p className="mb-4 pl-4 border-l-2 border-gray-200 text-gray-700">Una ficha genérica no sirve cuando necesitas imágenes específicas. <strong>Nuestro generador te permite crear dibujos de unir puntos del 1 al 100 o cualquier rango personalizado</strong>.</p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">2. Acceso instantáneo y gratuito</h3>
                            <p className="mb-4 text-gray-700">Nuestras <strong>fichas de unir puntos</strong> están disponibles en PDF de alta resolución sin marcas de agua, listas para la mejor calidad de impresión.</p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">3. Perfecto para Matemáticas</h3>
                            <p className="mb-6 text-gray-700">Esta herramienta es <strong>perfecto para actividades de unir puntos con operaciones matemáticas</strong>, donde el usuario debe resolver un problema para hallar el siguiente número en la secuencia.</p>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">¿Listo para crear tu propio puzzle extremo?</p>
                                <Link href="/es/"
                                    className="mt-4 text-white text-lg font-bold bg-[#4F46E5] hover:bg-blue-700 py-3 px-8 rounded-full shadow-xl inline-block transition">
                                    Generar Dibujo Difícil
                                </Link>
                            </div>

                            <h2 className="section-title">Guía Paso a Paso para usar el Creador de Unir Puntos</h2>
                            <ol className="list-decimal list-inside space-y-4 mb-8 ml-4 text-gray-700">
                                <li><strong>Selecciona tu imagen:</strong> Sube una foto con contornos claros.</li>
                                <li><strong>Define la complejidad:</strong> Elige un número alto de puntos (100-500) para un reto de <strong>adultos</strong>.</li>
                                <li><strong>Generar Dibujo:</strong> Haz clic en el botón y revisa la vista previa.</li>
                                <li><strong>Descargar Ficha:</strong> Obtén tu archivo PDF listo para imprimir.</li>
                            </ol>
                        </>
                    ) : (
                        /* ========================================================
                           英语内容 (en)
                           ======================================================== */
                        <>
                            {/* HERO / TITLE SECTION */}
                            <section className="bg-gradient-to-r from-[#4F46E5] to-[#4F46E5]/80 text-white py-12 rounded-xl mb-8">
                                <div className="container mx-auto px-4">
                                    <div className="max-w-4xl mx-auto">
                                        <div className="text-sm mb-4">
                                            <Link href="/" className="hover:underline">Home</Link> &gt;
                                            <Link href="/printable-connect-the-dots/" className="hover:underline">All Printables</Link> &gt;
                                            <span>Extreme Mandala</span>
                                        </div>
                                        <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4">Extreme Mandala</h1>
                                        <p className="text-lg text-white/90">Extreme difficulty complex mandala design for adults. A truly intricate challenge.</p>
                                        <div className="mt-4 text-sm text-white/80 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em" className="inline-block mr-1">
                                                <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.3-208-208S141.3 48 256 48s208 93.3 208 208S370.7 464 256 464zM342.6 302.6l-89.4-89.4V112c0-13.3-10.7-24-24-24s-24 10.7-24 24v112c0 6.6 2.7 13 7 17.7l96 96c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9z" />
                                            </svg>
                                            Last updated: December 30, 2025
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* CONTENT SECTION */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Main Content Area */}
                                <div className="lg:w-3/4">
                                    <div className="bg-slate-50 p-2 lg:p-6 rounded-xl shadow-sm mb-8 border border-slate-100">
                                        <div className="flex flex-col md:flex-row gap-x-6 mb-8">
                                            {/* Puzzle Image */}
                                            <div className="w-full md:w-2/3 relative overflow-hidden rounded-lg shadow-md bg-white">
                                                <Image
                                                    src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif"
                                                    alt="Printable extreme connect the dots puzzle: Extreme Mandala (Dots: 200-300)."
                                                    width={600}
                                                    height={600}
                                                    className="w-full h-auto"
                                                    priority
                                                />
                                                <span className="absolute top-3 left-3 text-white text-sm font-semibold px-3 py-1 rounded-full z-10 bg-red-700">Extreme</span>
                                            </div>

                                            {/* Solution Image / Details Sidebar */}
                                            <div className="md:w-1/3 flex flex-col gap-4">
                                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                                    <h3 className="text-xl font-bold mb-3">Puzzle Details</h3>
                                                    <div className="space-y-2 text-neutral/80 text-sm">
                                                        <p><strong className="font-semibold">Difficulty:</strong> <span>Extreme</span></p>
                                                        <p><strong className="font-semibold">Dots:</strong> <span>200-300</span></p>
                                                        <p><strong className="font-semibold">Category:</strong> <span>Abstract, Art</span></p>
                                                        <p><strong className="font-semibold">Age:</strong> <span>Adults</span></p>
                                                        <p><strong className="font-semibold">Popularity:</strong> <span>50</span></p>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 rounded-lg shadow-sm flex-grow flex flex-col">
                                                    <h3 className="text-xl font-bold mb-3">View Solution</h3>
                                                    <a href="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif" download className="mt-auto block text-center w-full bg-[#4F46E5] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-2">
                                                        Download Puzzle (HD)
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-bold mb-4">About this Printable</h2>
                                        <p className="text-neutral/70">Extreme difficulty complex mandala design for adults. A truly intricate challenge.</p>
                                    </div>

                                    {/* Related Printables */}
                                    <div className="mt-8">
                                        <h2 className="text-2xl font-bold mb-4">More Printables You Might Like</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                                            {/* Card 1 */}
                                            <Link href="/printables/easy-flower-pot-connect-the-dots-puzzle-1-18-numbers/" className="relative block bg-white rounded-xl overflow-hidden shadow-md group transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100">
                                                <div className="relative w-full aspect-square">
                                                    <Image src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/easy-flower-pot-connect-the-dots-puzzle-1-18-numbers.webp" alt="Flower in a Pot" fill className="object-cover transition-transform group-hover:scale-105" />
                                                    <span className="absolute top-3 right-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">Free</span>
                                                    <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">Easy</span>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#4F46E5] mb-1 line-clamp-1">Flower in a Pot</h3>
                                                    <div className="flex gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">Dots: 1-18</span></div>
                                                </div>
                                            </Link>
                                            {/* Add more related cards as needed */}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar (Only in EN) */}
                                <aside className="lg:w-1/4 space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-xl shadow-sm sticky top-24 border border-slate-100">
                                        <h3 className="text-xl font-bold mb-6">Our Top Article</h3>
                                        <Link href="/printables/connectTheDotsGenerator/" className="block mb-6 group">
                                            <h4 className="font-bold text-gray-900 group-hover:text-[#4F46E5] transition-colors mb-2 text-sm">Unlock Limitless Creativity</h4>
                                            <p className="text-slate-500 text-xs">Discover how a digital generator can outperform traditional methods.</p>
                                        </Link>
                                        <Link href="/printables/animals/" className="flex gap-4 mb-5 group items-center">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                                <Image src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/400/6-Cute-Bunny-Rabbit-Connect-the-Dots-for-Young-Children-1-20-dots.avif" alt="Animals" fill className="object-cover" />
                                            </div>
                                            <h4 className="font-bold text-slate-700 text-xs group-hover:text-[#4F46E5] line-clamp-2">Animal Connect the Dots</h4>
                                        </Link>
                                    </div>
                                </aside>
                            </div>
                        </>
                    )}
                </div>
            </main>


        </>
    );
}