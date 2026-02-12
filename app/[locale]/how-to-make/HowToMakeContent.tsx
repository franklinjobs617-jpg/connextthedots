
import Image from "next/image";
import Link from "next/link";

export default function HowToMakeClient({ locale }: { locale: string }) {
    const isEs = locale === "es";



    return (
        <>
            <main className="bg-white py-1">
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
                    {isEs ? (
                        /* ========================================================
                           西班牙语内容 (es)
                           ======================================================== */
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 pb-2 border-b-4 border-brand-blue leading-tight">
                                Cómo Crear tus Propios Dibujos de Unir Puntos para Imprimir Online: La Guía Definitiva
                            </h1>

                            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                                ¡Desbloquea el aprendizaje personalizado y la diversión! Sigue nuestra guía experta para
                                crear un dibujo de unir puntos desde cualquier imagen en minutos.
                            </p>

                            <Link href="/es/" className="block w-full md:w-fit mx-auto px-8 py-3 my-8 bg-brand-blue text-white font-bold uppercase text-center rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all">
                                CREA TU DIBUJO DE UNIR PUNTOS AHORA - ES GRATIS
                            </Link>

                            <p className="text-base text-gray-700 mb-4 leading-7">
                                Crear contenido educativo personalizado o actividades familiares únicas ya no requiere software avanzado.
                                Nuestro <strong>generador de unir puntos gratis online</strong> transforma cualquier imagen —desde un dibujo
                                de tu hijo hasta un mandala detallado— en un puzzle para imprimir al instante.
                            </p>
                            <p className="text-base text-gray-700 mb-4 leading-7">
                                Esta guía completa, escrita por nuestros expertos en diseño, te llevará por todo el proceso, asegurando que
                                tu <strong>dibujo de unir puntos personalizado</strong> sea de alta calidad y esté listo para la impresora.
                            </p>

                            <h2 id="step-by-step" className="text-2xl font-semibold text-gray-800 mt-12 mb-6 pl-4 border-l-4 border-brand-blue">
                                El Proceso de 5 Pasos para Hacer tu Actividad de Unir Puntos
                            </h2>

                            <p className="text-base text-gray-700 mb-6 leading-7">
                                El proceso completo toma menos de un minuto. Siguiendo estos pasos, puedes crear una <strong>ficha de unir
                                    puntos</strong> con aspecto profesional directamente desde tu navegador.
                            </p>

                            <ol className="list-none p-0 counter-reset-step">
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Selección de Imagen: Empieza con Alto Contraste</h3>
                                    <p className="text-base text-gray-600 mb-4">
                                        El éxito de tu rompecabezas personalizado depende de la calidad de la imagen original. Elige archivos
                                        con bordes claros y nítidos. Por ejemplo, un dibujo lineal en blanco y negro siempre dará mejores
                                        resultados que una foto borrosa.
                                    </p>
                                    <p className="text-base text-gray-600 mb-4">
                                        Nuestro <strong>generador de dibujos de unir puntos</strong> funciona mejor cuando puede definir
                                        fácilmente el contorno principal del objeto.
                                    </p>
                                    <div className="my-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-100 min-h-[150px] flex items-center justify-center">
                                        <Image src="/images/dot-to-dot-generator-high-contrast.webp" width={500} height={350}
                                            alt="Ejemplo de un dibujo lineal de alto contraste apto para el generador de unir puntos."
                                            className="w-full h-auto object-contain"
                                            loading="lazy" />
                                    </div>
                                </li>
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Accede al Generador Online Gratuito</h3>
                                    <p className="text-base text-gray-600 mb-4">
                                        Navega directamente a nuestro <Link href="/es/" className="text-brand-blue hover:underline">Generador de Unir Puntos</Link> en la página principal. La
                                        herramienta es accesible de inmediato; no hay necesidad de registrarse ni instalar software.
                                    </p>
                                    <p className="text-base text-gray-600 mb-0">Localiza el botón &quot;Subir Foto&quot; para cargar tu archivo de imagen (se recomienda PNG o JPG).</p>
                                </li>
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Define el Modo de Trazado y la Dificultad</h3>
                                    <p className="text-base text-gray-600 mb-4">
                                        Una vez subida, debes indicar al <strong>creador de unir puntos</strong> cómo interpretar tu imagen.
                                        Ajusta las opciones de &quot;Ayuda de Fondo&quot; y &quot;Cantidad de Puntos&quot;:
                                    </p>
                                    <ul className="pl-0 mt-4 mb-4 space-y-2 list-none">
                                        <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                            <strong>Ayuda de Fondo:</strong> Recomendamos empezar con &quot;Trazado Suave&quot; si es tu primera vez.
                                            Para un reto mayor, selecciona &quot;Sin Ayuda (Solo Puntos)&quot;.
                                        </li>
                                        <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                            <strong>Cantidad de Puntos:</strong> Esto controla la dificultad. <strong>Nuestro generador te
                                                permite crear dibujos de unir puntos del 1 al 20, del 1 al 100 o cualquier rango
                                                personalizado</strong>, ideal para aprender los números.
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Revisa y Perfecciona el Patrón de Puntos</h3>
                                    <p className="text-base text-gray-600 mb-0">
                                        <strong>Es fundamental revisar la vista previa.</strong> ¿Están los puntos colocados a lo largo de
                                        las características clave de tu imagen? Si el patrón es muy pobre o está muy amontonado, ajusta la
                                        cantidad de puntos o usa el borrador inteligente para retocar el diseño.
                                    </p>
                                </li>
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Descarga tu Ficha para Imprimir</h3>
                                    <p className="text-base text-gray-600 mb-4">
                                        Una vez satisfecho, haz clic en el botón <strong>&quot;Descargar PDF&quot;</strong> para obtener la mejor
                                        calidad de impresión, o en &quot;Descargar Imagen&quot; para uso digital.
                                    </p>
                                    <p className="text-base text-gray-600 mb-0">
                                        Tu archivo personalizado se genera al instante, listo para imprimirse en papel estándar. Recuerda que
                                        todos nuestros archivos son gratuitos y <strong>no contienen marcas de agua</strong>.
                                    </p>
                                </li>
                            </ol>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6 pl-4 border-l-4 border-brand-blue">Buenas Prácticas para Máxima Calidad</h2>
                            <p className="text-base text-gray-700 mb-4 leading-7">El secreto de un <strong>ejercicio de unir puntos</strong> perfecto es optimizar la imagen de origen. Nuestros expertos recomiendan:</p>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Mejores Formatos y Resolución</h3>
                            <p className="text-base text-gray-700 mb-4 leading-7">Aunque se acepta JPG, los <strong>archivos PNG</strong> son superiores porque manejan mejor los fondos transparentes, reduciendo el ruido cuando el algoritmo busca los bordes.</p>
                            <p className="text-base text-gray-700 mb-4 leading-7">Asegúrate de que la resolución sea adecuada, pero evita archivos excesivamente grandes (más de 5MB) que puedan ralentizar el proceso de <strong>Generar Dibujo</strong>.</p>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Consejos para Convertir Fotos a Unir Puntos</h3>
                            <p className="text-base text-gray-700 mb-4 leading-7">Convertir una fotografía es el reto definitivo para cualquier generador. Si usas una foto:</p>
                            <ul className="pl-0 mt-4 mb-4 space-y-2 list-none">
                                <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                    <strong>Aísla el Sujeto:</strong> Recorta la imagen cerca de la persona u objeto principal.
                                </li>
                                <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                    <strong>Conversión a Blanco y Negro:</strong> Convierte la foto a escala de grises primero para forzar el alto contraste.
                                </li>
                                <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                    <strong>Usa Filtros:</strong> Aplica un filtro de &apos;umbral&apos; o &apos;posterizar&apos; en cualquier editor básico para crear líneas duras.
                                </li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6 pl-4 border-l-4 border-brand-blue">Aplicaciones Creativas y Educativas</h2>
                            <p className="text-base text-gray-700 mb-4 leading-7">Más allá del entretenimiento, los <strong>dibujos de unir puntos para niños</strong> ofrecen un valor inmenso:</p>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Herramientas para Maestros y Educadores</h3>
                            <p className="text-base text-gray-700 mb-4 leading-7">Los profesores pueden crear fichas de repaso basadas en sus lecciones. ¡Imagina un puzzle de un mapa o de un personaje histórico!</p>
                            <p className="text-base text-gray-700 mb-4 leading-7"><strong>Perfecto para actividades de unir puntos con operaciones matemáticas</strong>, donde los alumnos deben resolver cálculos para saber cuál es el siguiente punto.</p>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Regalos Únicos y Detalles para Fiestas</h3>
                            <p className="text-base text-gray-700 mb-4 leading-7">Crea un puzzle de una mascota para un regalo personalizado. El dibujo terminado y coloreado se convierte en una pieza de arte hecha con el corazón.</p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6 pl-4 border-l-4 border-brand-blue">Preguntas Comunes</h2>
                            <dl className="mt-8 border-t border-gray-200 pt-6">
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <dt className="font-bold text-lg text-brand-blue mb-2 cursor-pointer">¿Cuál es el mejor tipo de imagen para usar?</dt>
                                    <dd className="pl-5 border-l-4 border-gray-300 text-gray-600 mt-2 text-base leading-relaxed">
                                        Las imágenes con alto contraste y contornos claros (como siluetas) funcionan mejor. Evita fotos con fondos muy detallados.
                                    </dd>
                                </div>
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <dt className="font-bold text-lg text-brand-blue mb-2 cursor-pointer">¿Puedo usar mis propias fotos para hacer un unir puntos?</dt>
                                    <dd className="pl-5 border-l-4 border-gray-300 text-gray-600 mt-2 text-base leading-relaxed">
                                        Sí, absolutamente. Nuestro generador está diseñado para manejar fotos personales y dibujos a mano. Recomendamos recortar la imagen antes de subirla.
                                    </dd>
                                </div>
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <dt className="font-bold text-lg text-brand-blue mb-2 cursor-pointer">¿Por qué el generador de unir puntos es gratis?</dt>
                                    <dd className="pl-5 border-l-4 border-gray-300 text-gray-600 mt-2 text-base leading-relaxed">
                                        Nuestro compromiso es proporcionar recursos educativos de alta calidad. Creemos en el aprendizaje accesible para todos, sin costes ocultos ni suscripciones.
                                    </dd>
                                </div>
                            </dl>

                            <p className="text-lg italic text-center text-gray-600 mt-10 mb-6">¿Listo para poner estos pasos en acción? ¡Deja de leer y empieza a crear!</p>

                            <Link href="/es/" className="block w-full md:w-fit mx-auto px-8 py-3 my-8 bg-brand-blue text-white font-bold uppercase text-center rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all">
                                IR AL GENERADOR DE UNIR PUNTOS GRATIS
                            </Link>
                        </>
                    ) : (
                        /* ========================================================
                           英语内容 (en)
                           ======================================================== */
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 pb-2 border-b-4 border-brand-blue leading-tight">
                                How to Make Your Own Custom Connect the Dots Worksheets Online: The Ultimate Guide
                            </h1>

                            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                                Unlock personalized learning and fun! Follow our expert guide to creating a dot-to-dot from
                                any image in minutes.
                            </p>

                            <Link href="/" className="block w-full md:w-fit mx-auto px-8 py-3 my-8 bg-brand-blue text-white font-bold uppercase text-center rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all">
                                CREATE YOUR CUSTOM DOT TO DOT NOW - IT&apos;S FREE
                            </Link>

                            <p className="text-base text-gray-700 mb-4 leading-7">
                                Creating personalized educational content or unique family activities no longer requires advanced software.
                                Our <strong>free online dot to dot maker</strong> transforms any image—from your child&apos;s drawing to a
                                detailed mandala—into a printable puzzle instantly.
                            </p>
                            <p className="text-base text-gray-700 mb-4 leading-7">
                                This comprehensive guide, written by our in-house design experts, will walk you through the entire process,
                                ensuring your resulting <strong>custom connect the dots printable</strong> is high-quality and ready to
                                print.
                            </p>

                            <h2 id="step-by-step" className="text-2xl font-semibold text-gray-800 mt-12 mb-6 pl-4 border-l-4 border-brand-blue">
                                The 5-Step Process to Make Your Custom Dot to Dot
                            </h2>

                            <p className="text-base text-gray-700 mb-6 leading-7">
                                The entire process takes less than a minute. By following these steps, you can create a perfect,
                                professional-looking <strong>dot to dot worksheet</strong> right from your browser.
                            </p>

                            <ol className="list-none p-0 counter-reset-step">
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Image Selection: Start with High Contrast</h3>
                                    <p className="text-base text-gray-600 mb-4">
                                        The success of your custom puzzle hinges on the quality of the input image. Choose files with clear,
                                        sharp edges. For example, a black-and-white outline drawing will always yield better results than a
                                        blurry photo of a busy street.
                                    </p>
                                    <p className="text-base text-gray-600 mb-4">
                                        Our <strong>generator</strong> works best when it can easily define the primary boundary of the
                                        object you want to feature.
                                    </p>
                                    <div className="my-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-100 min-h-[150px] flex items-center justify-center">
                                        <Image src="/images/dot-to-dot-generator-high-contrast.webp" width={500} height={350}
                                            alt="Example of a high-contrast line art drawing suitable for the dot to dot generator."
                                            className="w-full h-auto object-contain"
                                            loading="lazy" />
                                    </div>
                                </li>
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Access the Free Online Generator</h3>
                                    <p className="text-base text-gray-600 mb-4">
                                        Navigate directly to our <Link href="/" className="text-brand-blue hover:underline">Connect the Dots Generator</Link> on the main page. The tool is
                                        immediately accessible; there&apos;s no need to register or install any software.
                                    </p>
                                    <p className="text-base text-gray-600 mb-0">Locate the &apos;Choose File&apos; button to upload your image file (PNG or JPG recommended).</p>
                                </li>
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Define the Tracing Mode and Difficulty</h3>
                                    <p className="text-base text-gray-600 mb-4">
                                        Once uploaded, you must instruct the <strong>dot to dot creator</strong> how to interpret your image.
                                        Look for the &apos;Hint Type&apos; and &apos;Number of Points&apos; options:
                                    </p>
                                    <ul className="pl-0 mt-4 mb-4 space-y-2 list-none">
                                        <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                            <strong>Hint Type:</strong> We recommend starting with &apos;Trace (Outline)&apos; if it&apos;s your first
                                            time, as it provides a faint outline for reference. For a challenge, select &apos;No (Dots Only)&apos;.
                                        </li>
                                        <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                            <strong>Number of Points:</strong> This controls the difficulty. For a puzzle featuring simple
                                            shapes (like a heart or star), 20-40 points are ideal. For detailed figures or custom portraits,
                                            you may need 100+ points to capture the essence.
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Review and Refine the Dot Pattern</h3>
                                    <p className="text-base text-gray-600 mb-0">
                                        <strong>Crucially, review this preview.</strong> Are the dots placed along the key features of your
                                        image? If the pattern is a little sparse or too cluttered, go back and adjust the &apos;Number of Points&apos;
                                        or use the &apos;Adjust Threshold&apos; slider to fine-tune the detection sensitivity.
                                    </p>
                                </li>
                                <li className="relative mb-8 p-6 pl-[75px] border border-gray-200 rounded-xl bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-lg before:content-[counter(step)] before:counter-increment-step before:absolute before:left-5 before:top-5 before:flex before:items-center before:justify-center before:w-10 before:h-10 before:bg-brand-blue before:text-white before:rounded-full before:text-xl before:font-bold before:shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mt-0 mb-3">Download Your Printable Worksheet</h3>
                                    <p className="text-base text-gray-600 mb-4">
                                        Once satisfied with the preview, click the &apos;Download PDF&apos; button for the highest quality print
                                        results, or &apos;Download PNG&apos; for digital use.
                                    </p>
                                    <p className="text-base text-gray-600 mb-0">
                                        Your custom-made file is instantly generated, ready to be printed on standard letter paper (8.5&quot; x
                                        11&quot;).
                                        Remember, all our generated files are completely free and <strong>do not contain
                                            watermarks</strong>.
                                    </p>
                                </li>
                            </ol>

                            <h2 id="image-best-practices" className="text-2xl font-semibold text-gray-800 mt-12 mb-6 pl-4 border-l-4 border-brand-blue">Image Best Practices for Maximum Quality</h2>
                            <p className="text-base text-gray-700 mb-4 leading-7">The secret to a perfect <strong>custom connect the dots</strong> puzzle is optimizing the source image
                                beforehand. Our experts compiled these tips:</p>

                            <h3 id="best-format" className="text-xl font-semibold text-gray-800 mt-6 mb-2">Best File Formats and Resolution</h3>
                            <p className="text-base text-gray-700 mb-4 leading-7">While JPG is accepted, <strong>PNG files</strong> are superior because they handle transparent backgrounds
                                better, reducing noise when the algorithm searches for edges.</p>
                            <p className="text-base text-gray-700 mb-4 leading-7">Ensure your image resolution is adequate, but avoid excessively large files (over 5MB), which can slow down
                                the generation process.</p>

                            <h3 id="photo-tips" className="text-xl font-semibold text-gray-800 mt-6 mb-2">Tips for Converting Photos to Dot to Dot</h3>
                            <p className="text-base text-gray-700 mb-4 leading-7">Converting a photograph is the ultimate test for any <strong>dot to dot maker</strong>. If using a photo:</p>
                            <ul className="pl-0 mt-4 mb-4 space-y-2 list-none">
                                <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                    <strong>Isolate the Subject:</strong> Crop the image tightly around the person or object.
                                </li>
                                <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                    <strong>Black &amp; White Conversion:</strong> Convert the photo to black and white or grayscale first. This
                                    forces high contrast.
                                </li>
                                <li className="relative pl-6 before:content-['●'] before:text-brand-blue before:font-bold before:absolute before:left-0 before:top-0">
                                    <strong>Use Filters:</strong> Apply a &apos;threshold&apos; or &apos;posterize&apos; filter in a basic photo editor to
                                    reduce the color palette and create hard lines.
                                </li>
                            </ul>

                            <h2 id="educational-applications" className="text-2xl font-semibold text-gray-800 mt-12 mb-6 pl-4 border-l-4 border-brand-blue">Creative and Educational Applications</h2>
                            <p className="text-base text-gray-700 mb-4 leading-7">Beyond simple entertainment, a <strong>personalized connect the dots printable</strong> offers immense value:
                            </p>

                            <h3 id="teachers-tools" className="text-xl font-semibold text-gray-800 mt-6 mb-2">Tools for Teachers and Educators</h3>
                            <p className="text-base text-gray-700 mb-4 leading-7">Teachers can create review sheets based on lesson plans. Imagine a puzzle of a state map or a historical
                                figure!</p>
                            <p className="text-base text-gray-700 mb-4 leading-7">By adding complexity, the activity reinforces recognition skills while maintaining student engagement.</p>

                            <h3 id="personalized-gifts" className="text-xl font-semibold text-gray-800 mt-6 mb-2">Unique Gifts and Party Favors</h3>
                            <p className="text-base text-gray-700 mb-4 leading-7">Create a puzzle of a bride and groom for a wedding shower, or a pet for a personalized gift.</p>
                            <p className="text-base text-gray-700 mb-4 leading-7">The finished and colored puzzle becomes a heartfelt, custom-made piece of art.</p>

                            <h2 id="faq-detail" className="text-2xl font-semibold text-gray-800 mt-12 mb-6 pl-4 border-l-4 border-brand-blue">Common Questions</h2>
                            <dl className="mt-8 border-t border-gray-200 pt-6">
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <dt className="font-bold text-lg text-brand-blue mb-2 cursor-pointer">What is the best type of image to use for the custom dot to dot maker?</dt>
                                    <dd className="pl-5 border-l-4 border-gray-300 text-gray-600 mt-2 text-base leading-relaxed">
                                        Images with high contrast and clear, simple outlines (like line art, simple logos, or silhouettes)
                                        work best. Avoid photos with complex backgrounds or blurry edges.
                                    </dd>
                                </div>
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <dt className="font-bold text-lg text-brand-blue mb-2 cursor-pointer">Can I use my own photos or drawings to make a dot to dot?</dt>
                                    <dd className="pl-5 border-l-4 border-gray-300 text-gray-600 mt-2 text-base leading-relaxed">
                                        Yes, absolutely. Our generator is specifically designed to handle personal photos and custom
                                        drawings. We recommend ensuring the main subject is well-defined and cropped tightly.
                                    </dd>
                                </div>
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <dt className="font-bold text-lg text-brand-blue mb-2 cursor-pointer">How is the custom dot to dot generator free?</dt>
                                    <dd className="pl-5 border-l-4 border-gray-300 text-gray-600 mt-2 text-base leading-relaxed">
                                        Our commitment is to provide high-quality educational resources. The generator is completely free
                                        because we believe in accessible learning and creative tools for everyone, without any hidden costs
                                        or watermarks.
                                    </dd>
                                </div>
                            </dl>

                            <p className="text-lg italic text-center text-gray-600 mt-10 mb-6">Ready to put these steps into action? Stop reading and start creating!</p>

                            <Link href="/" className="block w-full md:w-fit mx-auto px-8 py-3 my-8 bg-brand-blue text-white font-bold uppercase text-center rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all">
                                GO TO THE FREE DOT TO DOT GENERATOR
                            </Link>
                        </>
                    )}
                </div>
            </main>

        </>
    );
}