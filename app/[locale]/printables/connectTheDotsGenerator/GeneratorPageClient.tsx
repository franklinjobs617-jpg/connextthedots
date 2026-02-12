"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { MessageSquare, X, Twitter, Linkedin, Facebook, Share2 } from "lucide-react";

export default function GeneratorPageClient({ locale }: { locale: string }) {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const isEs = locale === "es";

    // 社交分享链接逻辑
    useEffect(() => {
        const shareLinksContainer = document.getElementById('social-share-links');
        if (shareLinksContainer) {
            const pageUrl = encodeURIComponent(window.location.href);
            const links = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
                twitter: `https://twitter.com/intent/tweet?url=${pageUrl}`,
                reddit: `https://www.reddit.com/submit?url=${pageUrl}`,
                linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}`,
            };
            const setHref = (ariaLabel: string, url: string) => {
                const el = shareLinksContainer.querySelector(`a[aria-label="${ariaLabel}"]`) as HTMLAnchorElement;
                if (el) el.href = url;
            };
            setHref("Share on Facebook", links.facebook);
            setHref("Share on Twitter", links.twitter);
            setHref("Share on Reddit", links.reddit);
            setHref("Share on LinkedIn", links.linkedin);
        }
    }, []);

    const openModal = () => {
        setIsFeedbackOpen(true);
        document.body.style.overflow = 'hidden';
        // @ts-ignore
        if (window.CUSDIS && window.CUSDIS.initial) {
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

            <main className="bg-slate-50 py-8 lg:py-12">
                <div className="container mx-auto max-w-7xl px-6 lg:px-8 bg-white shadow-xl rounded-xl p-6 md:p-10 text-gray-800">

                    {isEs ? (
                        /* --- 西班牙语版内容 --- */
                        <>
                            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                                Desbloquea la Creatividad sin Límites: Guía Definitiva del <span
                                    className="text-brand-blue"><strong>Generador de Unir Puntos Gratis</strong></span>
                            </h1>

                            <p className="text-lg mb-6 leading-relaxed">
                                <span className="font-semibold text-brand-blue"><strong>Introducción: El poder del generador
                                    online</strong></span><br />
                                ¿Cansado de buscar eternamente la ficha de unir puntos perfecta? Ya seas un educador que necesita
                                materiales temáticos, un padre que busca herramientas de aprendizaje personalizadas o un artista en
                                busca de un método de creación único, un <strong>generador de unir puntos</strong> eficaz es la solución
                                definitiva.
                            </p>
                            <p className="text-lg mb-6 leading-relaxed text-gray-700">
                                Los datos de búsqueda revelan que términos como "<strong>generador de unir puntos</strong>" y
                                "<strong>creador de unir puntos</strong>" son prioridades constantes para los usuarios. Esta guía
                                explica qué pueden hacer estas herramientas, por qué las mejores opciones son <strong>gratuitas</strong>
                                y cómo aprovecharlas para crear contenido impresionante y personalizado al instante.
                            </p>

                            <h2 className="section-title">
                                Sección 1: Por qué un generador digital supera a los métodos tradicionales
                            </h2>

                            <p className="mb-4">
                                El cambio de la creación manual o la compra de libros impresos al uso de un <strong>generador de unir
                                    puntos</strong> online se debe a tres factores clave: velocidad, personalización y coste cero.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                1. <strong>Personalización sin límites</strong>
                            </h3>
                            <p className="mb-4 pl-4 border-l-2 border-gray-200">
                                Una ficha genérica no es suficiente cuando se necesitan imágenes específicas. El atractivo principal de
                                un <strong>creador de unir puntos personalizado</strong> radica en su capacidad para transformar
                                <strong>cualquier imagen</strong> en un rompecabezas.
                            </p>
                            <ul className="list-disc list-inside space-y-2 mb-4 ml-8 text-sm md:text-base text-gray-700">
                                <li>
                                    <strong>Aprendizaje Personalizado:</strong> Convierte imágenes de figuras históricas o monumentos
                                    locales para lecciones educativas a medida.
                                </li>
                                <li>
                                    <strong>Regalos Únicos:</strong> Sorprende a un niño convirtiendo su dibujo favorito o la foto de su
                                    mascota en un dibujo de unir puntos.
                                </li>
                                <li>
                                    <strong>Marketing Creativo:</strong> Usa un <strong>creador de unir puntos</strong> para esconder el
                                    logo de una empresa o el contorno de un producto en una actividad divertida.
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                2. <strong>Acceso instantáneo y gratuito</strong>
                            </h3>
                            <p className="mb-4 pl-4 border-l-2 border-gray-200 text-gray-700">
                                Existe una alta demanda de herramientas que ofrezcan resultados de calidad sin costo alguno. Los mejores
                                generadores online son totalmente <strong>gratuitos</strong>, permitiéndote subir, ajustar y descargar
                                tus <strong>fichas para imprimir</strong> en cuestión de minutos.
                            </p>
                            <p className="mb-6 pl-4 border-l-2 border-gray-200 text-gray-700">
                                <strong>Nuestro generador te permite crear dibujos de unir puntos del 1 al 20, del 1 al 100 o cualquier
                                    rango personalizado</strong>, ideal para aprender los números de forma amena y sin barreras
                                económicas.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                3. <strong>Control de dificultad y salida de calidad</strong>
                            </h3>
                            <p className="mb-6 pl-4 border-l-2 border-gray-200 text-gray-700">
                                Crear manualmente un dibujo de unir puntos complejo es tedioso y propenso a errores. Un
                                <strong>generador de unir puntos profesional</strong> se encarga del trabajo pesado:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-8 text-sm md:text-base text-gray-700">
                                <li>
                                    <strong>Complejidad ajustable:</strong> Produce desde un puzzle <strong>fácil</strong> (pocos
                                    puntos, grandes) hasta uno de <strong>nivel experto</strong> (cientos de puntos densos) para
                                    adultos.
                                </li>
                                <li>
                                    <strong>Imprimibles de alta resolución:</strong> El generador exporta archivos limpios y
                                    secuenciados (como PDF o PNG), listos para la mejor calidad de impresión.
                                </li>
                            </ul>
                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">
                                    <span className="text-brand-blue"><strong>¿Listo para crear tu propio dibujo de unir
                                        puntos?</strong></span>
                                </p>
                                <p className="mt-4">
                                    <a href="/es/"
                                        className="text-white text-lg font-bold bg-brand-blue hover:bg-blue-700 py-3 px-8 rounded-full transition shadow-xl inline-block">
                                        Ir al Generador Dibujo Ahora
                                    </a>
                                </p>
                            </div>

                            <h2 className="section-title">
                                Sección 2: Maximizando el aprendizaje y la diversión
                            </h2>

                            <p className="mb-4 text-gray-700 text-lg">
                                La naturaleza versátil de los puzzles de puntos permite su uso en diversos entornos para promover el
                                desarrollo de habilidades.
                                Además, es <strong>perfecto para actividades de unir puntos con operaciones matemáticas</strong>,
                                integrando el cálculo mental en el juego.
                            </p>

                            <div className="overflow-x-auto mb-8">
                                <table className="w-full text-left border-collapse border border-gray-100">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-200">
                                            <th className="p-3 font-semibold text-gray-700 text-sm md:text-base">Habilidad Desarrollada</th>
                                            <th className="p-3 font-semibold text-gray-700 text-sm md:text-base">Cómo Ayuda Unir Puntos</th>
                                            <th className="p-3 font-semibold text-gray-700 text-sm md:text-base">Usuarios Objetivo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3"><strong>Motricidad Fina</strong></td>
                                            <td className="p-3">Requiere control preciso del lápiz y exactitud al trazar líneas.</td>
                                            <td className="p-3">Preescolar, estudiantes de primaria temprana.</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3"><strong>Secuencia Numérica</strong></td>
                                            <td className="p-3">Obliga al usuario a encontrar y unir números en orden (1, 2, 3...).</td>
                                            <td className="p-3">Maestros de matemáticas, padres enseñando a contar.</td>
                                        </tr>
                                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3"><strong>Paciencia y Enfoque</strong></td>
                                            <td className="p-3">Demanda atención sostenida para completar la secuencia y revelar la imagen.
                                            </td>
                                            <td className="p-3">Niños con poca atención, adultos buscando relajación.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="section-title">
                                Sección 3: Guía paso a paso para usar tu <strong className="text-brand-blue">Creador de Unir Puntos</strong>
                            </h2>

                            <p className="mb-4 text-gray-700">
                                ¿Listo para tu primer diseño? Usar nuestra herramienta gratuita es muy sencillo:
                            </p>

                            <ol className="list-decimal list-inside space-y-2 mb-8 ml-4 text-gray-700">
                                <li>
                                    <strong>Selecciona tu imagen:</strong> Sube la foto o ilustración que desees convertir. Cuanto más
                                    claro sea el contorno, ¡mejor será el resultado!
                                </li>
                                <li>
                                    <strong>Define la complejidad:</strong> Usa los controles integrados para especificar el número
                                    deseado de puntos. Más puntos significan mayor detalle y dificultad.
                                </li>
                                <li>
                                    <strong>Generar Dibujo y Revisar:</strong> Haz clic en el botón "<strong>Generar Dibujo</strong>".
                                    El sistema procesa la imagen y muestra una vista previa al instante.
                                </li>
                                <li>
                                    <strong>Descargar Ficha:</strong> Una vez satisfecho, descarga el archivo PDF o PNG en alta
                                    resolución. ¡Está listo para imprimir y usar!
                                </li>
                            </ol>

                            <h2 className="section-title">
                                Conclusión: Deja de buscar y empieza a generar
                            </h2>

                            <p className="mb-6 text-gray-700 leading-relaxed">
                                No te conformes con fichas genéricas y limitadas. Adopta el poder de un <strong>generador de unir
                                    puntos</strong> online gratuito para adaptar tus materiales educativos, crear regalos únicos y
                                fomentar la creatividad en todas las edades.
                            </p>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">
                                    <span className="text-brand-blue"><strong>¿Listo para transformar cualquier imagen en un puzzle? ¡Usa
                                        nuestro Generador de Unir Puntos hoy mismo!</strong></span>
                                </p>
                                <p className="mt-4">
                                    <Link href="/"
                                        className="text-white text-lg font-bold bg-brand-blue hover:bg-blue-700 py-3 px-8 rounded-full transition shadow-xl inline-block">
                                        Ir al Generador Dibujo
                                    </Link>
                                </p>
                            </div>

                        </>
                    ) : (
                        /* --- 英语版内容 --- */
                        <>
                            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                                Unlock Limitless Creativity: Your Ultimate Guide to a <span className="text-brand-blue"><strong>Free Connect
                                    the Dots Generator</strong></span>
                            </h1>

                            <p className="text-lg mb-6">
                                <span className="font-semibold text-brand-blue">
                                    <strong>
                                        Introduction: The Power of the Online Generator</strong>
                                </span>
                                <br />
                            </p>
                            <p>
                                Tired of endlessly searching for the perfect dot-to-dot worksheet?<br className="sm:hidden" /> Whether you're
                                an educator needing themed materials, a parent seeking custom learning tools, or an artist looking for a unique creation method, an effective <strong>connect the dots generator</strong> is the solution.
                            </p>

                            <p className="text-lg mb-6">
                                Analyzing search data reveals that terms like "<strong>dot to dot generator</strong>" and
                                "<strong>connect the dots maker</strong>" are consistently top-of-mind for users like you.
                                <br
                                    className="sm:hidden" /> This guide will explain what these tools can do, highlight why the best options
                                are <strong>free</strong>, and show you how to leverage them to create stunning, personalized content
                                instantly.
                            </p>

                            <h2 className="section-title">
                                Section 1: Why a Digital Generator Outperforms Traditional Methods
                            </h2>

                            <p className="mb-4">
                                The shift from manual creation or purchasing pre-made books to using an online <strong>connect the dots
                                    generator</strong> is driven by three key factors: speed, customization, and cost.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                1. <strong>Limitless Customization</strong>
                            </h3>
                            <p className="mb-4 pl-4 border-l-2 border-gray-200">
                                A generic worksheet won't cut it when specific images are needed.<br className="sm:hidden" /> The core appeal
                                of a <strong>custom connect the dots maker</strong> lies in its ability to transform <strong>any
                                    image</strong> into a puzzle.
                            </p>
                            <ul className="list-disc list-inside space-y-2 mb-4 ml-8 text-sm">
                                <li>
                                    <strong>Personalized Learning:</strong> Convert images of historical figures or local landmarks for
                                    tailored educational lessons.
                                </li>
                                <li>
                                    <strong>Unique Gifts:</strong> Surprise a child by turning their favorite drawing or a pet's photo
                                    into a dot-to-dot puzzle.
                                </li>
                                <li>
                                    <strong>Brand Engagement:</strong> Use a <strong>connect the dots creator</strong> to hide a company
                                    logo or product outline for a fun marketing activity.
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                2. <strong>Instant & Free Access</strong>
                            </h3>
                            <p className="mb-4 pl-4 border-l-2 border-gray-200">
                                Your search data shows high demand for "<strong>connect the dots generator free</strong>" and
                                "<strong>dot to dot generator free</strong>."<br className="sm:hidden" /> This confirms that users prioritize
                                tools offering quality results without a price tag.
                            </p>
                            <p className="mb-6 pl-4 border-l-2 border-gray-200">
                                The best online generators operate entirely <strong>free</strong>, allowing you to upload, adjust, and
                                download your <strong>printable worksheets</strong> in minutes.<br className="sm:hidden" /> This instant
                                gratification is why these tools are becoming a go-to resource for millions worldwide.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                3. <strong>Difficulty Control & Quality Output</strong>
                            </h3>
                            <p className="mb-6 pl-4 border-l-2 border-gray-200">
                                Manually creating a complex dot-to-dot is tedious and prone to errors.<br className="sm:hidden" /> A
                                professional <strong>dot to dot generator</strong> handles the heavy lifting:
                            </p>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-8 text-sm">
                                <li>
                                    <strong>Adjustable Complexity:</strong> Easily toggle settings to produce an <strong>easy</strong>
                                    puzzle (fewer, larger dots) or an <strong>expert-level</strong> puzzle (hundreds of dense dots)
                                    suitable for adults.
                                </li>
                                <li>
                                    <strong>High-Resolution Printables:</strong> The generator outputs clean, sequenced, high-resolution
                                    files (like PDF or PNG), ready for the best possible print quality.
                                </li>
                            </ul>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">
                                    <span className="text-brand-blue"><strong>Ready to create your custom dot-to-dot puzzle?</strong></span>
                                </p>
                                <p className="mt-4">
                                    <a href="/"
                                        className="text-white text-lg font-bold bg-brand-blue hover:bg-blue-700 py-3 px-8 rounded-full transition shadow-xl inline-block">
                                        Go to Generator Now
                                    </a>
                                </p>
                            </div>

                            <h2 className="section-title">
                                Section 2: Maximizing Learning and Fun with Your Generator
                            </h2>

                            <p className="mb-4">
                                The versatile nature of dot-to-dot puzzles means they can be used across various settings to promote
                                skill development.
                            </p>

                            <div className="overflow-x-auto mb-8">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-200">
                                            <th className="p-3 font-semibold text-gray-700 text-sm md:text-base">Skill Developed</th>
                                            <th className="p-3 font-semibold text-gray-700 text-sm md:text-base">How Dot-to-Dots Help</th>
                                            <th className="p-3 font-semibold text-gray-700 text-sm md:text-base">Target Users</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3"><strong>Fine Motor Skills</strong></td>
                                            <td className="p-3">Requires precise pencil control and line drawing accuracy.</td>
                                            <td className="p-3">Preschoolers, early elementary students.</td>
                                        </tr>
                                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3"><strong>Number Sequencing</strong></td>
                                            <td className="p-3">Forces the user to find and connect numbers in order (1, 2, 3...).</td>
                                            <td className="p-3">Math educators, parents teaching counting.</td>
                                        </tr>
                                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3"><strong>Patience & Focus</strong></td>
                                            <td className="p-3">Demands sustained attention to complete the entire sequence and reveal the
                                                final image.</td>
                                            <td className="p-3">Children with short attention spans, adults seeking mindfulness.</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="p-3"><strong>Visual Recognition</strong></td>
                                            <td className="p-3">The payoff is the rewarding reveal of the hidden image.</td>
                                            <td className="p-3">Art teachers, creative hobbyists.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="section-title">
                                Section 3: A Step-by-Step Guide to Using Your <strong className="text-brand-blue">Connect the Dots
                                    Maker</strong>
                            </h2>

                            <p className="mb-4">
                                Ready to create your own custom puzzle? Using our free tool is straightforward:
                            </p>

                            <ol className="list-decimal list-inside space-y-2 mb-8 ml-4">
                                <li>
                                    <strong>Select Your Image:</strong> Upload the photo or illustration you wish to convert.<br
                                        className="sm:hidden" /> The clearer the outline, the better the result!
                                </li>
                                <li>
                                    <strong>Define Complexity:</strong> Use the built-in controls to specify the desired number of
                                    dots.<br className="sm:hidden" /> Higher numbers lead to a more detailed and challenging puzzle.
                                </li>
                                <li>
                                    <strong>Generate and Review:</strong> Click the "Generate" button.<br className="sm:hidden" /> The
                                    <strong>connect the dots generator</strong> processes the image and instantly displays the puzzle
                                    preview.
                                </li>
                                <li>
                                    <strong>Download Your Printable:</strong> Once satisfied, download the high-quality
                                    <strong>printable worksheet</strong> file (PDF or PNG).<br className="sm:hidden" /> It’s ready for
                                    printing and immediate use!
                                </li>
                            </ol>

                            <h2 className="section-title">
                                Conclusion: Stop Searching, Start Generating
                            </h2>

                            <p className="mb-4">
                                The high search volume for terms like "<strong>connect the dots generator</strong>," "<strong>dot to dot
                                    maker online free</strong>," and "<strong>connect the dots creator</strong>" clearly indicates a
                                huge demand for custom, accessible puzzle tools.
                            </p>
                            <p className="mb-6">
                                Don't settle for limited, generic worksheets.<br className="sm:hidden" /> Embrace the power of a
                                <strong>FREE</strong> online <strong>Dot to Dot Generator</strong> to tailor your educational materials,
                                create unique gifts, and spark creativity for all ages.
                            </p>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">
                                    <span className="text-brand-blue"><strong>Ready to transform any image into an engaging puzzle? Use our
                                        FREE Connect the Dots Generator Tool Today!</strong></span>
                                </p>
                                <p className="mt-4">
                                    <Link href="/"
                                        className="text-white text-lg font-bold bg-brand-blue hover:bg-blue-700 py-3 px-8 rounded-full transition shadow-xl inline-block">
                                        Go to Generator
                                    </Link>
                                </p>
                            </div>



                        </>
                    )
                    }
                </div>

            </main>





        </>
    );
}