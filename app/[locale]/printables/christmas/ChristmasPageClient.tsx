"use client";

import Image from "next/image";
import Link from "next/link";
import { FileDown } from "lucide-react";

export default function HowToMakeClient({ locale }: { locale: string }) {

    const isEs = locale === "es";

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
                                Dibujos de Unir Puntos de Navidad para Imprimir: <span className="text-[#4F46E5]"><strong>Fichas Festivas y Guía de Actividades</strong></span>
                            </h1>

                            <p className="text-lg mb-6 leading-relaxed">
                                <span className="font-semibold text-[#4F46E5]"><strong>¡Lleva la magia de la Navidad a casa con una actividad creativa!</strong></span> Las vacaciones son el momento perfecto para disfrutar en familia. Si buscas una actividad tranquila para los niños o un ejercicio de concentración desafiante para ti, nuestra colección de <strong>dibujos de unir puntos de Navidad para imprimir</strong> tiene todo lo que necesitas.
                            </p>

                            <div id="pdf-download-module-christmas" className="bg-red-50 rounded-2xl overflow-hidden shadow-md border border-red-100 mb-8">
                                <div className="md:flex">
                                    <div className="md:w-1/3 lg:w-1/4 relative min-h-[200px]">
                                        <Image src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/800/4-Christmas-Tree-Connect-the-Dots-Design-1-50-dots.avif" alt="Pack Navideño" fill className="object-cover" />
                                        <span className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">Pack Navideño</span>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col justify-center md:w-2/3 lg:w-3/4">
                                        <div className="flex items-center mb-3">
                                            <FileDown className="text-red-600 mr-2" size={24} />
                                            <span className="text-red-700 font-bold tracking-wide text-sm uppercase">Descarga Gratis Inmediata</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">Descarga tu Pack Festivo de Navidad</h3>
                                        <p className="text-gray-700 mb-6">Obtén acceso instantáneo a nuestra colección de dibujos de unir puntos de Navidad. ¡Diversión garantizada!</p>
                                        <a href="/ChristmasDottoDot.pdf" download className="inline-flex items-center justify-center w-fit px-6 py-3 bg-[#4F46E5] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
                                            DESCARGAR PDF GRATIS AHORA
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <h2 className="section-title">Análisis Principal: Fichas de Navidad y su Valor</h2>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4">
                                <li><strong>Variedad de temas:</strong> Elfos, muñecos de nieve y unir puntos del 1 al 100.</li>
                                <li><strong>Dificultad adaptable:</strong> Rango personalizado del 1 al 20 o 1 al 100.</li>
                                <li><strong>Matemáticas divertidas:</strong> Perfectas para unir puntos con operaciones matemáticas.</li>
                            </ul>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">Convierte tu foto navideña en un <span className="text-[#4F46E5]"><strong>Dibujo Personalizado</strong></span>.</p>
                                <Link href="/es/" className="mt-4 text-white text-lg font-bold bg-[#4F46E5] hover:bg-red-800 py-3 px-8 rounded-full transition shadow-xl inline-block">Generar Dibujo Personalizado Aquí</Link>
                            </div>
                        </>
                    ) : (
                        /* ========================================================
                           英语内容 (en)
                           ======================================================== */
                        <>
                            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                                Connect the Dots Printable Christmas: <span className="text-[#4F46E5]"><strong>Festive Themes & Holiday Focus Activity Guide</strong></span>
                            </h1>

                            <p className="text-lg mb-6 leading-relaxed">
                                <span className="font-semibold text-[#4F46E5]"><strong>Bring the magic of the season into your home with a creative activity!</strong></span> The search for the perfect quiet-time holiday activity ends here. Our <strong>connect the dots printable christmas</strong> collection features everything from Santa to complex holiday mandalas.
                            </p>

                            <div id="pdf-download-module-christmas" className="bg-red-50 rounded-2xl overflow-hidden shadow-md border border-red-100 mb-8">
                                <div className="md:flex">
                                    <div className="md:w-1/3 lg:w-1/4 relative min-h-[200px]">
                                        <Image src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/800/4-Christmas-Tree-Connect-the-Dots-Design-1-50-dots.avif" alt="Christmas Pack" fill className="object-cover" />
                                        <span className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">Christmas Pack Preview</span>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col justify-center md:w-2/3 lg:w-3/4">
                                        <div className="flex items-center mb-3">
                                            <FileDown className="text-red-600 mr-2" size={24} />
                                            <span className="text-red-700 font-bold tracking-wide text-sm uppercase">Instant Free Download</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">Download Your Free Festive Christmas Pack</h3>
                                        <p className="text-gray-700 mb-6">Get instant access to our diverse collection of Christmas-themed dot-to-dot printables.</p>
                                        <a href="/ChristmasDottoDot.pdf" download className="inline-flex items-center justify-center w-fit px-6 py-3 bg-[#4F46E5] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
                                            FREE PDF DOWNLOAD NOW
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <h2 className="section-title">Core Analysis: Christmas Printables Value</h2>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4">
                                <li><strong>Theme Variety:</strong> Ornaments, elves, snowmen and nativity scenes.</li>
                                <li><strong>Difficulty Mix:</strong> Balanced easy (1-50) and hard (100+) versions.</li>
                                <li><strong>Seasonal Focus:</strong> Perfect for classroom holiday parties.</li>
                            </ul>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">Turn your favorite holiday photo into a <span className="text-[#4F46E5]"><strong>Custom Christmas Puzzle</strong></span>.</p>
                                <Link href="/" className="mt-4 text-white text-lg font-bold bg-[#4F46E5] hover:bg-red-800 py-3 px-8 rounded-full transition shadow-xl inline-block">Click Here to Custom Generate</Link>
                            </div>
                        </>
                    )}

                    {/* 底部共通跳转按钮 */}
                    <div className="p-8 rounded-lg text-center my-8 bg-[#4F46E5] text-white shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4">{isEs ? "¿Listo para empezar?" : "Ready to Get Started?"}</h2>
                        <Link href="/printable-connect-the-dots/" className="inline-block px-10 py-4 bg-white text-[#4F46E5] font-extrabold rounded-full hover:bg-yellow-400 transition transform hover:scale-105 shadow-lg uppercase">
                            {isEs ? "Descargar Pack Navidad" : "Download Christmas Bundle"}
                        </Link>
                    </div>
                </div>
            </main>


        </>
    );
}