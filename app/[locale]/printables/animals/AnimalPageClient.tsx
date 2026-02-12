"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { MessageSquare, X, FileDown, ExternalLink } from "lucide-react";

export default function HowToMakeClient({ locale }: { locale: string }) {
    const isEs = locale === "es";
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    // 1:1 还原样式
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
                        /* --- 西班牙语版内容 --- */
                        <>

                            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                                Dibujos de Animales para Unir Puntos: <span className="text-primary"><strong>Diversión Educativa y Fichas
                                    Realistas de Vida Silvestre</strong></span>
                            </h1>

                            <p className="text-lg mb-6">
                                <span className="font-semibold text-primary"><strong>¡Sumérgete en el mundo salvaje de la
                                    creatividad!</strong></span> Nuestra colección de <strong>dibujos de animales para unir
                                        puntos</strong> es una de las categorías más populares, ofreciendo rompecabezas encantadores y
                                realistas de criaturas de todo el planeta. Esta actividad combina a la perfección la alegría de
                                descubrir un animal querido con el beneficio educativo de contar y desarrollar la motricidad fina. Es el
                                recurso <strong>gratuito</strong> perfecto para pequeños estudiantes y una tarea relajante y detallada
                                para <strong>adultos</strong>.
                            </p>

                            <div id="pdf-download-module-animal"
                                className="bg-yellow-50 rounded-2xl overflow-hidden shadow-md border border-yellow-100 mb-8">
                                <div className="md:flex">
                                    <div className="md:w-1/3 lg:w-1/4 relative min-h-[200px] md:min-h-full">
                                        <Image src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/800/6-Cute-Bunny-Rabbit-Connect-the-Dots-for-Young-Children-1-20-dots.avif"
                                            alt="Vista previa de fichas de animales para unir puntos." width={500} height={500}
                                            className="w-full h-full object-cover absolute inset-0" loading="lazy" />
                                        <span
                                            className="absolute top-3 left-3 bg-yellow-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">Dentro
                                            del Pack</span>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col justify-center md:w-2/3 lg:w-3/4">
                                        <div className="flex items-center mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-2" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-yellow-700 font-bold tracking-wide text-sm uppercase">Recurso
                                                Gratuito</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">Descarga tu Pack de Animales para Imprimir
                                            Gratis</h3>
                                        <p className="text-gray-700 mb-6 text-md">Obtén acceso instantáneo a nuestra diversa colección de
                                            alta calidad con vida silvestre realista y lindos animales para unir puntos. ¡Ideal para
                                            casa o el aula!</p>
                                        <div>
                                            <a href="/AnimalConnecttheDots.pdf" download
                                                className="inline-flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-bold rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                DESCARGAR PDF AHORA
                                            </a>
                                            <p className="text-xs text-gray-500 mt-3 ml-2">* Descarga digital inmediata, sin necesidad de
                                                correo electrónico.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="section-title">Análisis Principal: Especificaciones y Valor de las Fichas de Animales</h2>
                            <p className="mb-4">Lo que hace que nuestra colección de animales destaque es la calidad de la imagen final.
                                Ofrecemos representaciones altamente realistas, asegurando que el rompecabezas completado sea una
                                hermosa representación del animal, no solo un contorno simple.</p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">Resumen de Especificaciones: Por qué nuestras
                                plantillas son más profesionales</h3>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4">
                                <li><strong>Variedad de Hábitats:</strong> Incluye mascotas, animales de granja, vida marina y bestias
                                    exóticas de safari.</li>
                                <li><strong>Niveles de Dificultad:</strong> Organizados por complejidad, desde plantillas fáciles de
                                    gatos hasta <strong>dibujos de unir puntos difíciles</strong> con escenas de jungla.</li>
                                <li><strong>Valor Educativo:</strong> Integra <strong>ciencia y conteo</strong>, permitiendo aprender
                                    nombres y características mientras se practica la secuencia numérica.</li>
                                <li><strong>Nuestro generador te permite crear dibujos de unir puntos del 1 al 20, del 1 al 100 o
                                    cualquier rango personalizado</strong>, ideal para aprender los números.</li>
                                <li><strong>Formato de Impresión:</strong> PDF de alta resolución (HD), que garantiza que las sutiles
                                    curvas de la forma del animal se rendericen con precisión.</li>
                            </ul>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">Convierte tu foto de animal favorita en un <span
                                    className="text-primary"><strong>Reto de Puzzle Personalizado</strong></span>.</p>
                                <p className="mt-4">
                                    <a href="/es/"
                                        className="text-white text-lg font-bold bg-brand-blue py-3 px-8 rounded-full transition shadow-xl inline-block">Generar
                                        Dibujo Personalizado Ahora</a>
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">Enfoque, Motricidad Fina y Conciencia Ambiental</h3>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4">
                                <li><strong>Desarrollo de Conciencia Biológica:</strong> Los puzzles de animales específicos ofrecen un
                                    enfoque ameno para introducir a niños en la biodiversidad.</li>
                                <li><strong>Refinamiento Motor:</strong> Unir los puntos que forman el pelaje o las escamas de una
                                    imagen de <strong>animal</strong> requiere mayor control, aumentando la destreza.</li>
                                <li><strong>Perfecto para actividades de unir puntos con operaciones matemáticas:</strong> puedes
                                    asignar retos donde cada número sea el resultado de una suma o resta.</li>
                            </ul>

                            <h2 className="section-title">Guía de Uso e Impresión para la Mejor Experiencia</h2>
                            <p className="mb-4">Logra impresiones de calidad de museo. Estos consejos aseguran que los detalles de tu PDF de
                                <strong>animales para unir puntos</strong> se trasladen perfectamente al papel.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">Pasos Sencillos para una Impresión Perfecta</h3>
                            <ol className="list-decimal list-inside space-y-2 mb-8 ml-4 text-gray-700">
                                <li><strong>Ajustar a Escala de Grises:</strong> Para el trabajo de unir puntos, imprime en escala de
                                    grises para ahorrar tinta de color.</li>
                                <li><strong>Papel de Superficie Suave:</strong> Usa papel blanco liso (80-100 gsm) para que lápices y
                                    bolígrafos se deslicen fácilmente.</li>
                                <li><strong>Consejo de Coloreado:</strong> Recomendamos usar lápices de colores para lograr texturas
                                    realistas como pelaje o plumas una vez unidos los puntos.</li>
                            </ol>

                            <h2 className="section-title">Preguntas Frecuentes (FAQs)</h2>
                            <div className="space-y-6 text-gray-700">
                                <div>
                                    <p className="font-bold">P: ¿Son adecuados para enseñar taxonomía o grupos específicos?</p>
                                    <p className="mt-2 pl-4 border-l-2 border-gray-200">R: Sí, nuestra gran colección permite a los
                                        educadores curar sets específicos (como solo animales de granja) para alinearlos con unidades de
                                        aprendizaje estructuradas.</p>
                                </div>
                                <div>
                                    <p className="font-bold">P: ¿Ofrecen animales tanto fáciles como difíciles?</p>
                                    <p className="mt-2 pl-4 border-l-2 border-gray-200">R: Absolutamente. Nuestras versiones fáciles son
                                        para niños pequeños, mientras que las versiones <strong>difíciles</strong> son retos de alto
                                        conteo de puntos perfectos para adolescentes y <strong>adultos</strong>.</p>
                                </div>
                                <div>
                                    <p className="font-bold">P: ¿Pueden los puntos usar letras en lugar de números?</p>
                                    <p className="mt-2 pl-4 border-l-2 border-gray-200">R: Aunque las descargas directas son numéricas,
                                        nuestra herramienta de Generador Personalizado permite convertir imágenes usando letras
                                        secuenciales (A-Z).</p>
                                </div>
                            </div>


                        </>
                    ) : (
                        /* --- 英语版内容 --- */
                        <>
                            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-800 mb-6 text-center">
                                Animal Connect the Dots Printable: <span className="text-primary"><strong>Educational Fun & Lifelike
                                    Wildlife
                                    Templates</strong></span>
                            </h1>

                            <p className="text-lg mb-6">
                                <span className="font-semibold text-primary"><strong>Dive into the wild world of creativity!</strong></span>
                                Our
                                <strong>animal connect the dots printable</strong> collection is one of our most popular categories,
                                offering charming and lifelike puzzles of creatures from around the globe.<br className="sm:hidden" /> This
                                activity seamlessly combines the joy of discovering a beloved animal with the educational benefit of
                                counting and fine motor development. It’s the perfect <strong>free</strong> resource for young learners
                                and
                                a calming, detailed task for <strong>adults</strong>.
                            </p>



                            <div id="pdf-download-module-animal"
                                className="bg-yellow-50 rounded-2xl overflow-hidden shadow-md border border-yellow-100 mb-8">
                                <div className="md:flex">
                                    <div className="md:w-1/3 lg:w-1/4 relative min-h-[200px] md:min-h-full">
                                        <Image src="https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/800/6-Cute-Bunny-Rabbit-Connect-the-Dots-for-Young-Children-1-20-dots.avif"

                                            sizes="(min-width: 768px) 33vw, 100vw"
                                            alt="Preview of the printable animal connect the dots worksheets featuring a cute bunny."
                                            className="w-full h-full object-cover absolute inset-0" loading="lazy" decoding="async"
                                            width="1024" height="1024" />
                                        <span
                                            className="absolute top-3 left-3 bg-yellow-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                                            Inside the Pack
                                        </span>
                                    </div>

                                    <div className="p-6 md:p-8 flex flex-col justify-center md:w-2/3 lg:w-3/4">
                                        <div className="flex items-center mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-2" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-yellow-700 font-bold tracking-wide text-sm uppercase">Free Resource</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            Download Your Free Animal Printable Pack
                                        </h3>
                                        <p className="text-gray-700 mb-6 text-md">
                                            Get instant access to our diverse collection of high-quality, lifelike wildlife and cute
                                            animal
                                            dot-to-dot puzzles. Perfect for home or classroom use!
                                        </p>

                                        <div>
                                            <a href="/AnimalConnecttheDots.pdf" download
                                                className="inline-flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-bold rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                DOWNLOAD PDF NOW
                                            </a>
                                            <p className="text-xs text-gray-500 mt-3 ml-2">
                                                * Instant digital download, no email required.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="section-title">
                                Core Analysis: Animal Printables Deep Specifications and Value
                            </h2>

                            <p className="mb-4">
                                What makes our animal collection stand apart is the quality of the final image.<br className="sm:hidden" /> We
                                offer highly realistic depictions, ensuring that the completed puzzle is a beautiful representation of
                                the
                                animal, not just a simple outline.
                            </p>
                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                Specs Overview: Why Our Wildlife Templates Are More Professional
                            </h3>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4">
                                <li>
                                    <strong>Coverage:</strong> Features animals from all habitats—pets, farm animals, marine life, and
                                    exotic safari beasts.
                                </li>
                                <li>
                                    <strong>Difficulty Levels:</strong> Organized by complexity, from easy `cat` templates to
                                    <strong>hard
                                        connect the dots printable</strong> versions of complex jungle scenes.
                                </li>
                                <li>
                                    <strong>Educational Value:</strong> Integrates <strong>science and counting</strong> by allowing
                                    users
                                    to learn animal names and characteristics while practicing numerical sequencing.
                                </li>
                                <li>
                                    <strong>Print Format:</strong> <strong>High-Resolution (HD) PDF</strong>, guaranteeing that the
                                    subtle
                                    curves of the animal's form are accurately rendered after printing.
                                </li>
                            </ul>
                            <p className="mb-4">
                                Animal-themed puzzles naturally combine curiosity with structured learning.<br className="sm:hidden" /> The
                                visual
                                identification of animals after connecting the dots reinforces recognition and classification skills.
                            </p>
                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">
                                    Turn your favorite animal photo into a <span className="text-primary"><strong>Custom Puzzle
                                        Challenge</strong></span>.
                                </p>
                                <p className="mt-4">
                                    <a href="/"
                                        className="text-white text-lg font-bold bg-brand-blue py-3 px-8 rounded-full transition shadow-xl inline-block">
                                        Click Here to Custom Generate Your Own Dot-to-Dot Puzzle
                                    </a>
                                </p>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                Focus, Fine Motor Skills, and Environmental Awareness
                            </h3>
                            <ul className="list-disc list-inside space-y-2 mb-8 ml-4">
                                <li>
                                    <strong>Developing Biological Awareness:</strong> Puzzles of specific animals offer an engaging,
                                    non-lecture approach to introducing children and students to biodiversity and different species.
                                </li>
                                <li>
                                    <strong>Fine Motor Refinement:</strong> Connecting the dots that form the intricate fur, feathers,
                                    or
                                    scales of an <strong>animal</strong> image requires greater control than simple shapes, boosting
                                    dexterity.
                                </li>
                                <li>
                                    <strong>Visual-Spatial Learning:</strong> Anticipating the outcome—a familiar lion or elephant
                                    shape—before the dots are connected enhances visualization and spatial reasoning in both children
                                    and
                                    <strong>adults</strong>.
                                </li>
                            </ul>


                            <h2 className="section-title">
                                How to Get the Optimal Experience: Printing and Usage Guide
                            </h2>

                            <p className="mb-4">
                                Achieve museum-quality prints of your favorite creatures.<br className="sm:hidden" /> These pro tips ensure
                                the
                                details in your <strong>animal connect the dots printable</strong> PDF translate perfectly to paper,
                                following the standards of The Spruce Crafts.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-600 mb-3">
                                Easy Steps for a Perfect Print
                            </h3>
                            <ol className="list-decimal list-inside space-y-2 mb-8 ml-4">
                                <li>
                                    <strong>Set to Grayscale:</strong> For dot-to-dot work, print in grayscale to save on expensive
                                    color
                                    ink. Ensure the “Actual Size” setting is still selected for dimensional accuracy.
                                </li>
                                <li>
                                    <strong>Smooth Surface Paper:</strong> Use a <strong>smooth, white paper (80-100 gsm)</strong>. This
                                    surface type allows pens and pencils to glide easily, which is crucial when forming the long,
                                    detailed
                                    lines of animal silhouettes.
                                </li>
                                <li>
                                    <strong>Coloring Tip:</strong> Use <strong>colored pencils</strong> for the finished animal. They
                                    allow
                                    for layering and blending, which helps achieve realistic textures like fur or scales once the dots
                                    are
                                    connected.
                                </li>
                            </ol>


                            <h2 className="section-title">
                                Need Your Exact Pet or a Rare Species? You Need Customization!
                            </h2>

                            <p className="mb-6">
                                If you're trying to find a high-dot-count <strong>animal connect the dots printable</strong> of a
                                specific
                                breed of dog or a lesser-known marine species, static archives will fail you.<br className="sm:hidden" /> Our
                                generator is the only tool that can instantly create a puzzle from any animal photo you choose.
                            </p>

                            <div className="p-6 rounded-lg text-center mb-8 bg-white border-2 border-dashed border-gray-300">
                                <p className="text-xl font-extrabold text-gray-800">
                                    Turn your favorite animal photo into a <span className="text-brand-blue"><strong>Custom Puzzle
                                        Challenge</strong></span>.
                                </p>
                                <p className="mt-4">
                                    <a href="/"
                                        className="text-white text-lg font-bold bg-brand-blue py-3 px-8 rounded-full transition shadow-xl inline-block">
                                        Click Here to Custom Generate Your Own Dot-to-Dot Puzzle
                                    </a>
                                </p>
                            </div>


                            <h2 className="section-title">
                                Frequently Asked Questions (FAQs)
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <p className="font-bold text-gray-700">
                                        Q: Are these suitable for teaching taxonomy or specific animal groups (e.g., reptiles only)?
                                    </p>
                                    <p className="mt-2 pl-4 border-l-2 border-gray-200">
                                        A: Yes, our large collection allows educators to easily curate specific sets (like only farm
                                        <strong>animal connect the dots printable</strong> sheets) to align with structured learning
                                        units
                                        on taxonomy or habitats.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-gray-700">
                                        Q: Do you offer both easy and <strong>hard connect the dots printable</strong> animals?
                                    </p>
                                    <p className="mt-2 pl-4 border-l-2 border-gray-200">
                                        A: Absolutely. Our easy versions (e.g., a simple butterfly) are for young children, while our
                                        <strong>hard</strong> versions (e.g., a detailed leopard or tiger) are high-dot-count challenges
                                        perfect for teenagers and <strong>adults</strong>.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-gray-700">
                                        Q: Can the dots on the animal printables use letters instead of numbers?
                                    </p>
                                    <p className="mt-2 pl-4 border-l-2 border-gray-200">
                                        A: While the direct downloads focus on numerical order, our Custom Generator tool allows you to
                                        convert images into puzzles using sequential letters (A-Z) to reinforce alphabet skills.
                                    </p>
                                </div>
                            </div>



                        </>
                    )
                    }

                    {/* 底部共通按钮 */}
                    <div className="p-8 rounded-lg text-center my-8 bg-[#4F46E5] text-white shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4">{isEs ? "¿Listo para empezar?" : "Ready to Start Connecting?"}</h2>
                        <Link href="/printable-connect-the-dots" className="inline-block px-10 py-4 bg-white text-[#4F46E5] font-extrabold rounded-full hover:bg-yellow-400 transition transform hover:scale-105 shadow-lg uppercase">
                            {isEs ? "Descargar Pack Animales (PDF)" : "Download Free Animal Bundle (PDF)"}
                        </Link>
                    </div>
                </div>
            </main>





        </>
    );
}