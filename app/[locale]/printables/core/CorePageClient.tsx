"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { MessageSquare, X, Download } from "lucide-react";

export default function CorePageClient({ locale }: { locale: string }) {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const isEs = locale === "es";

    // 反馈弹窗逻辑
    const openModal = () => {
        setIsFeedbackOpen(true);
        document.body.style.overflow = 'hidden';
        // @ts-ignore
        if (window.CUSDIS && window.CUSDIS.initial && !document.querySelector('#cusdis_thread iframe')) {
            requestAnimationFrame(() => {
                // @ts-ignore
                window.CUSDIS.initial();
            });
        }
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        setIsFeedbackOpen(false);
    };

    return (
        <>
            <style jsx global>{`
        .section-title {
            font-size: 24px;
            font-weight: 700;
            line-height: 32px;
            color: #1b1b1b;
            margin: 12px 0;
        }
        @media (max-width: 768px) {
            .section-title { font-size: 20px; }
        }
      `}</style>

            <main className="bg-slate-50 py-8 lg:py-12">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 bg-white shadow-xl rounded-xl p-6 md:p-10 text-gray-800">

                    {isEs ? (
                        /* ========================================================
                           西班牙语内容 (es)
                           ======================================================== */
                        <>
                            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                                Dibujos de Unir Puntos para Imprimir: <span className="text-[#4F46E5]"><strong>Tu Fuente Definitiva para Cada Nivel y Tema</strong></span>
                            </h1>

                            <p className="text-lg mb-6 leading-relaxed">
                                ¿Buscas la colección definitiva de puzzles de unir puntos? Has llegado al lugar indicado. Ofrecemos
                                plantillas de <strong>unir puntos para imprimir</strong> de todo tipo: desde práctica de números básica
                                para niños de preescolar hasta retos complejos para <strong>adultos</strong>. Esta actividad es ideal
                                para mejorar el enfoque y disfrutar de un tiempo de ocio sin pantallas.
                            </p>

                            <h2 className="section-title">Análisis Principal: Profundidad y Calidad de nuestras Fichas</h2>
                            <p className="mb-4">La diferencia entre un puzzle genérico y uno de alta calidad es el nivel de detalle. Nos
                                aseguramos de que cada <strong>ficha de unir puntos</strong> esté categorizada correctamente.</p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">Por qué nuestras plantillas son superiores</h3>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4 text-gray-700">
                                <li><strong>Cobertura Universal:</strong> Desde animales hasta diseños de Navidad.</li>
                                <li><strong>Rango de Puntos:</strong> El rango más completo de la web, con <strong>dibujos de unir
                                    puntos del 1 al 20</strong> hasta niveles experto de más de 500 puntos.</li>
                                <li><strong>Valor:</strong> Todas las descargas son <strong>gratuitas</strong>, en alta resolución y
                                    formato PDF listo para imprimir.</li>
                                <li><strong>Enfoque Pedagógico:</strong> Nuestras fichas son <strong>perfectas para actividades de unir
                                    puntos con operaciones matemáticas</strong>.</li>
                            </ul>

                            {/* Download Module (ES) */}
                            <div id="pdf-download-module-core" className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-lg mb-8 shadow-md">
                                <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
                                    <div className="flex items-center lg:items-start mb-4 lg:mb-0">
                                        <Download className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0" />
                                        <div>
                                            <p className="text-xl font-bold">Descarga el Mega-Bundle de Unir Puntos</p>
                                            <p className="text-sm">Accede a una selección curada de todos los niveles, totalmente gratis.</p>
                                        </div>
                                    </div>
                                    <a href="/KidsConnecttheDots.pdf" download
                                        className="px-6 py-3 bg-[#4F46E5] hover:bg-blue-700 text-white font-bold rounded-full transition shadow-lg">
                                        DESCARGAR PDF GRATIS
                                    </a>
                                </div>
                            </div>

                            <h2 className="section-title">La Aplicación Científica de los Puzzles de Unir Puntos</h2>
                            <p className="mb-4">El esfuerzo sostenido que requiere un <strong>dibujo de unir puntos</strong> es un método
                                establecido en psicología del desarrollo para entrenar las vías de enfoque del cerebro.</p>

                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4 text-gray-700">
                                <li><strong>Integración Visomotora:</strong> El acto físico de trazar la línea coordina la percepción
                                    visual con el control motor.</li>
                                <li><strong>Procesamiento Secuencial:</strong> Seguir una secuencia numérica es la base para entender la
                                    lógica y las matemáticas.</li>
                                <li><strong>Atención Plena para Adultos:</strong> La naturaleza basada en reglas ofrece un escape
                                    perfecto del ajetreo cognitivo diario.</li>
                            </ul>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">¡Deja de descargar archivos genéricos! <br className="sm:hidden" />Empieza a
                                    <strong> Generar el Dibujo Perfecto</strong>.
                                </p>
                                <Link href="/es/"
                                    className="mt-4 text-white text-lg font-bold bg-[#4F46E5] hover:bg-blue-700 py-3 px-8 rounded-full shadow-xl inline-block transition">
                                    Generar Dibujo Personalizado
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* ========================================================
                           英语内容 (en)
                           ======================================================== */
                        <>
                            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                                Connect the Dots Printable: <span className="text-[#4F46E5]"><strong>The Ultimate Source for Every Difficulty Level & Theme</strong></span>
                            </h1>

                            <p className="text-lg mb-6 leading-relaxed">
                                <span className="font-semibold text-[#4F46E5]"><strong>Looking for the definitive collection of dot-to-dot puzzles?</strong></span> You've found the premier destination for every type of <strong>connect the dots printable</strong> imaginable.<br className="sm:hidden" /> From foundational number practice for preschoolers to complex, high-dot-count challenges for <strong>adults</strong>, we offer pristine, instantly downloadable templates.
                            </p>

                            <h2 className="section-title">Core Analysis: Connect the Dots Printables Depth and Quality</h2>
                            <p className="mb-4">The difference between a generic puzzle and a high-quality printable is the level of detail and thematic organization. We ensure our resources are categorized accurately.</p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">Specs Overview: Why Our Dot-to-Dot Templates Are Superior</h3>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4 text-gray-700">
                                <li><strong>Universal Coverage:</strong> From animal connect the dots to seasonal designs like Christmas.</li>
                                <li><strong>Dot Range:</strong> The most comprehensive range, spanning simple 1 to 20 counts up to Expert 500+ dots.</li>
                                <li><strong>Value Proposition:</strong> All downloads are <strong>free</strong>, high-resolution PDF format without watermarks.</li>
                                <li><strong>Skill Focus:</strong> Supports sequential logic and fine motor precision.</li>
                            </ul>

                            {/* Download Module (EN) */}
                            <div id="pdf-download-module-core" className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-lg mb-8 shadow-md">
                                <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left space-y-4 lg:space-y-0">
                                    <div className="flex items-center lg:items-start">
                                        <Download className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0" />
                                        <div className="flex flex-col items-start text-left space-y-1 pl-1">
                                            <p className="text-xl font-bold">Download the Mega-Bundle of Dot-to-Dot Printables</p>
                                            <p className="text-sm">Access a curated selection of all difficulty levels, absolutely free.</p>
                                        </div>
                                    </div>
                                    <a href="/KidsConnecttheDots.pdf" download
                                        className="px-6 py-3 bg-[#4F46E5] hover:bg-blue-700 text-white font-bold rounded-full transition duration-300 shadow-lg">
                                        FREE PDF DOWNLOAD
                                    </a>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">The Scientific Application of Dot-to-Dot Puzzles</h3>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4 text-gray-700">
                                <li><strong>Visual-Motor Integration:</strong> Coordinates visual perception and motor control.</li>
                                <li><strong>Sequential Processing:</strong> Foundation for understanding logic and mathematics.</li>
                                <li><strong>Accessible Mindfulness:</strong> Offers a quick escape from cognitive clutter for adults.</li>
                            </ul>

                            <h2 className="section-title">How to Get the Optimal Experience: Printing and Usage Guide</h2>
                            <p className="mb-4">Achieving flawless lines and crisp numbers starts with the correct printing setup. Use this practical advice for superior results.</p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">Easy Steps for a Perfect Print</h3>
                            <ol className="list-decimal list-inside space-y-2 mb-8 ml-4 text-gray-700">
                                <li><strong>Scaling Check:</strong> Confirm “100% Scale” to ensure accuracy.</li>
                                <li><strong>Preventing Smudging:</strong> Use standard, uncoated white paper.</li>
                                <li><strong>Tool Consistency:</strong> Use a consistent writing instrument throughout the puzzle.</li>
                            </ol>

                            <h2 className="section-title">Need the Perfect Difficulty/Theme Combination? You Need Customization!</h2>
                            <p className="mb-6">If you need a specific puzzle, static archives will fall short. Our interactive tool allows you to create your exact perfect printable file.</p>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">
                                    Stop downloading generic files! <br className="sm:hidden" />Start <span className="text-[#4F46E5]"><strong>Generating the Perfect Puzzle</strong></span>.
                                </p>
                                <Link href="/"
                                    className="mt-4 text-white text-lg font-bold bg-[#4F46E5] hover:bg-blue-700 py-3 px-8 rounded-full shadow-xl inline-block transition">
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


        </>
    );
}