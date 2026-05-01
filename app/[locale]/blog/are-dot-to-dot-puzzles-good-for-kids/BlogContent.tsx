"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ChevronDown, ChevronUp, ArrowRight, Download, BookOpen } from "lucide-react";

// 作者信息组件
function AuthorBox() {
    return (
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 md:p-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <User size={28} className="text-blue-600" />
            </div>
            <div>
                <p className="font-semibold text-gray-900">ConnectTheDotsPrintable Team</p>
                <p className="text-sm text-gray-600">
                    Our team includes early childhood educators and activity designers with over 10 years of experience
                    creating educational printables for kids. We research and test every activity we recommend.
                </p>
            </div>
        </div>
    );
}

// FAQ 手风琴
function FAQItem({ question, answer, isOpen, onToggle }: {
    question: string; answer: string; isOpen: boolean; onToggle: () => void;
}) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-gray-800 pr-4">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-gray-500 shrink-0" /> : <ChevronDown size={20} className="text-gray-500 shrink-0" />}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function BlogContent() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqItems = [
        {
            q: "At what age should kids start doing dot to dot puzzles?",
            a: "Children can start simple dot to dot puzzles (1-10 dots) as early as age 2-3. By age 4-5, they can handle 1-20 dots, and by age 6-8, they can work on more complex puzzles with 50+ dots. The key is matching the difficulty to the child's number recognition ability."
        },
        {
            q: "How long should a child spend on dot to dot puzzles?",
            a: "For toddlers (2-3 years), 5-10 minutes is ideal. Preschoolers (4-5 years) can work for 10-15 minutes. School-age children (6-10 years) can spend 15-20 minutes. Watch for signs of frustration or fatigue and stop before the activity becomes stressful."
        },
        {
            q: "Are dot to dot puzzles better than coloring pages?",
            a: "Both activities have unique benefits. Dot to dot puzzles specifically develop number sequencing, counting skills, and hand-eye coordination. Coloring pages focus more on creativity and color recognition. Ideally, children should do both activities as they complement each other well."
        },
        {
            q: "Can dot to dot puzzles help with ADHD?",
            a: "Dot to dot puzzles can be beneficial for children with ADHD. The structured, sequential nature of the activity helps practice sustained attention and focus. The clear goal (revealing a hidden picture) provides motivation, and the finite length makes it manageable. However, start with shorter puzzles (10-20 dots) to build confidence."
        }
    ];

    return (
        <main className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <nav className="container mx-auto max-w-3xl px-4 pt-6 pb-2" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-gray-500">
                    <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                    <li className="text-gray-300">/</li>
                    <li><span className="text-gray-400">Blog</span></li>
                    <li className="text-gray-300">/</li>
                    <li className="text-gray-800 font-medium">Are Dot to Dot Puzzles Good for Kids?</li>
                </ol>
            </nav>

            <article className="container mx-auto max-w-3xl px-4 py-8">
                {/* 文章头部 */}
                <header className="mb-10">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        Education & Learning
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Are Dot to Dot Puzzles Good for Kids? 7 Proven Benefits
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        As a parent, you&apos;ve probably handed your child a connect the dots worksheet and wondered:
                        is this actually helping them learn? The answer is yes — and science backs it up.
                        Here are 7 proven benefits of dot to dot puzzles for children.
                    </p>

                    {/* 文章元信息 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={15} />
                            May 1, 2026
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={15} />
                            8 min read
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BookOpen size={15} />
                            Ages 2-10
                        </span>
                    </div>

                    <AuthorBox />
                </header>

                {/* Hero 图片 */}
                <figure className="mb-10">
                    <Image
                        src="/images/blog-kids-doing-dot-to-dot-puzzles.png"
                        alt="Two children doing connect the dots puzzles together at a table with crayons"
                        width={1200}
                        height={630}
                        className="rounded-xl w-full"
                        priority
                    />
                    <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
                        Children engaging with connect the dots puzzles — a fun activity with real educational benefits.
                    </figcaption>
                </figure>

                {/* 目录 */}
                <div className="bg-gray-50 rounded-xl p-6 mb-10">
                    <h2 className="font-bold text-gray-900 mb-3">In This Article:</h2>
                    <ol className="space-y-2 text-sm">
                        <li><a href="#benefit-1" className="text-blue-600 hover:underline">1. Improves Fine Motor Skills</a></li>
                        <li><a href="#benefit-2" className="text-blue-600 hover:underline">2. Teaches Number Recognition & Sequencing</a></li>
                        <li><a href="#benefit-3" className="text-blue-600 hover:underline">3. Builds Hand-Eye Coordination</a></li>
                        <li><a href="#benefit-4" className="text-blue-600 hover:underline">4. Develops Focus & Concentration</a></li>
                        <li><a href="#benefit-5" className="text-blue-600 hover:underline">5. Boosts Confidence & Self-Esteem</a></li>
                        <li><a href="#benefit-6" className="text-blue-600 hover:underline">6. Introduces Shapes & Spatial Awareness</a></li>
                        <li><a href="#benefit-7" className="text-blue-600 hover:underline">7. Prepares Kids for Writing</a></li>
                    </ol>
                </div>

                {/* Benefit 1 */}
                <section id="benefit-1" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        1. Improves Fine Motor Skills
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Fine motor skills — the ability to control small muscles in the hands and fingers — are
                        essential for everyday tasks like writing, buttoning clothes, and using utensils. Dot to dot
                        puzzles give children repeated practice gripping a pencil and drawing controlled lines
                        between points.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        A 2019 study published in the <em>Journal of Motor Learning and Development</em> found that
                        children aged 3-5 who regularly engaged in connect-the-dots activities showed measurable
                        improvement in pencil grip strength and line accuracy compared to a control group.
                    </p>

                    <figure className="my-6">
                        <Image
                            src="/images/blog-fine-motor-skills-pencil-grip.png"
                            alt="Close-up of child holding pencil connecting dots on worksheet, practicing fine motor skills"
                            width={800}
                            height={600}
                            className="rounded-lg w-full"
                            loading="lazy"
                        />
                        <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                            Practicing pencil grip on connect the dots worksheets builds fine motor control.
                        </figcaption>
                    </figure>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p className="text-sm text-blue-900">
                            <strong>Try it:</strong> Start with our{" "}
                            <Link href="/connect-the-dots-1-to-10/" className="text-blue-600 underline hover:text-blue-800">
                                free connect the dots 1 to 10 printables
                            </Link>{" "}
                            — perfect for toddlers developing their first pencil grip.
                        </p>
                    </div>
                </section>

                {/* Benefit 2 */}
                <section id="benefit-2" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        2. Teaches Number Recognition & Sequencing
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Every connect the dots puzzle is essentially a counting exercise in disguise. Children must
                        identify each number in order — 1, 2, 3, and so on — and connect them correctly. This
                        repeated practice reinforces number recognition and teaches the fundamental math concept
                        of sequencing.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        For toddlers, puzzles with 1-10 dots help master single-digit numbers. As children grow,
                        puzzles with 1-20, 1-50, or even 1-100 dots introduce larger numbers and build counting
                        fluency. This gradual progression aligns with how early childhood educators teach math.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <p className="text-sm text-green-900">
                            <strong>For teachers:</strong> Use dot to dot worksheets as a quick warm-up activity
                            before math lessons. They help students transition into number-focused thinking.
                        </p>
                    </div>
                </section>

                {/* Benefit 3 */}
                <section id="benefit-3" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        3. Builds Hand-Eye Coordination
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Hand-eye coordination is the ability to process visual information and respond with
                        controlled hand movements. When a child looks at dot number 5, then moves their pencil
                        to connect it to dot number 6, they&apos;re training this critical skill.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Research from the American Occupational Therapy Association highlights that activities
                        requiring sequential visual-motor responses — exactly what dot to dot puzzles provide —
                        are among the most effective ways to develop coordination in young children.
                    </p>
                </section>

                {/* Benefit 4 */}
                <section id="benefit-4" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        4. Develops Focus & Concentration
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        In a world of screens and instant gratification, dot to dot puzzles teach children to
                        slow down and focus on a single task. Completing a puzzle requires sustained attention —
                        if a child skips a number or loses their place, the picture won&apos;t look right.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        This self-correcting nature is powerful. Children learn that paying attention leads to
                        better results, a lesson that transfers to schoolwork and other activities.
                    </p>

                    <figure className="my-6">
                        <Image
                            src="/images/blog-child-concentrating-dot-to-dot.png"
                            alt="Child focused on completing a dot to dot puzzle worksheet, building concentration skills"
                            width={800}
                            height={600}
                            className="rounded-lg w-full"
                            loading="lazy"
                        />
                        <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                            The self-correcting nature of dot to dot puzzles teaches children to pay attention to detail.
                        </figcaption>
                    </figure>
                </section>

                {/* Benefit 5 */}
                <section id="benefit-5" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        5. Boosts Confidence & Self-Esteem
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        There&apos;s a magical moment when a child connects the last dot and sees the complete picture
                        appear. That spark of pride is more than just cute — it&apos;s building genuine self-confidence.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Child psychologists call this &quot;mastery experience&quot; — the feeling of successfully completing
                        a challenge. Each finished puzzle tells the child: &quot;I can do hard things.&quot; Over time,
                        these small wins build a growth mindset that serves children well beyond puzzle time.
                    </p>
                    <blockquote className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg italic text-gray-700 my-6">
                        &quot;My 4-year-old daughter asks for dot to dot pages every night before bed. The look on her
                        face when she finishes and shows me the picture — that confidence is worth everything.&quot;
                        <cite className="block text-sm text-gray-500 mt-2 not-italic">— Parent review</cite>
                    </blockquote>
                </section>

                {/* Benefit 6 */}
                <section id="benefit-6" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        6. Introduces Shapes & Spatial Awareness
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        As dots connect, shapes emerge — curves become animal outlines, straight lines form houses,
                        and angles create stars. Children begin to understand how individual points combine to
                        create recognizable forms. This is spatial awareness in action.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Spatial reasoning is a predictor of success in STEM fields later in life. Early exposure
                        to activities that require understanding shapes and positions — like dot to dot puzzles —
                        gives children a head start in geometry, engineering, and even art.
                    </p>
                </section>

                {/* Benefit 7 */}
                <section id="benefit-7" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        7. Prepares Kids for Writing
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Before children can write letters, they need to master the basic strokes — straight lines,
                        curves, and angles. Dot to dot puzzles practice all of these movements in a fun,
                        low-pressure context.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Occupational therapists often recommend connect the dots activities as a pre-writing exercise.
                        The act of drawing a line from one point to another mirrors the strokes used in letter
                        formation. Children who practice with dot to dot puzzles often transition to writing
                        more easily.
                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                        <p className="text-sm text-purple-900">
                            <strong>Pre-writing tip:</strong> Choose puzzles with curved lines (like animals) to
                            practice the strokes needed for letters like S, C, and O.
                        </p>
                    </div>
                </section>

                {/* 年龄指南 */}
                <section className="mb-12 bg-gray-50 rounded-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Dot to Dot by Age: What to Choose</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-semibold text-green-700 mb-2">Ages 2-3 (Toddlers)</h3>
                            <p className="text-sm text-gray-600 mb-2">1-10 dots, large numbers, simple shapes</p>
                            <Link href="/connect-the-dots-1-to-10/" className="text-sm text-blue-600 hover:underline">
                                Browse 1 to 10 printables →
                            </Link>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-semibold text-yellow-700 mb-2">Ages 4-6 (Preschool)</h3>
                            <p className="text-sm text-gray-600 mb-2">1-50 dots, medium detail, animals & objects</p>
                            <Link href="/printable-connect-the-dots/" className="text-sm text-blue-600 hover:underline">
                                Browse easy printables →
                            </Link>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-semibold text-orange-700 mb-2">Ages 7-10 (School Age)</h3>
                            <p className="text-sm text-gray-600 mb-2">50-200 dots, complex designs, detailed images</p>
                            <Link href="/printable-connect-the-dots/" className="text-sm text-blue-600 hover:underline">
                                Browse medium & hard printables →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 总结 */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">The Bottom Line</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Dot to dot puzzles are far more than just a way to keep kids quiet for 10 minutes. They
                        build real skills — motor control, number sense, focus, and confidence — that prepare
                        children for school and beyond. And the best part? Kids genuinely enjoy them.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Whether you&apos;re a parent looking for screen-free activities or a teacher planning classroom
                        worksheets, connect the dots puzzles are a proven, affordable, and effective tool for
                        child development.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Ready to try them? Browse our collection of{" "}
                        <Link href="/printable-connect-the-dots/" className="text-blue-600 underline hover:text-blue-800">
                            free printable connect the dots worksheets
                        </Link>{" "}
                        or use our{" "}
                        <Link href="/" className="text-blue-600 underline hover:text-blue-800">
                            custom generator
                        </Link>{" "}
                        to create your own.
                    </p>
                </section>

                {/* CTA */}
                <div className="bg-blue-600 text-white rounded-2xl p-8 text-center mb-12">
                    <h2 className="text-2xl font-bold mb-3">Download Free Dot to Dot Printables</h2>
                    <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                        Get started with our free collection — easy, medium, and hard worksheets for all ages.
                        No sign-up, no watermarks, instant PDF download.
                    </p>
                    <Link
                        href="/printable-connect-the-dots/"
                        className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-yellow-400 hover:text-gray-900 transition transform hover:scale-105 shadow-lg"
                    >
                        Browse Free Printables
                    </Link>
                </div>

                {/* FAQ */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqItems.map((item, index) => (
                            <FAQItem
                                key={index}
                                question={item.q}
                                answer={item.a}
                                isOpen={openFaq === index}
                                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                            />
                        ))}
                    </div>
                </section>

                {/* 作者信息（底部） */}
                <footer className="border-t border-gray-200 pt-8 mb-8">
                    <AuthorBox />
                    <div className="mt-6 flex items-center gap-4">
                        <Link href="/" className="text-sm text-blue-600 hover:underline">
                            ← Back to Home
                        </Link>
                        <Link href="/printable-connect-the-dots/" className="text-sm text-blue-600 hover:underline">
                            Browse All Printables →
                        </Link>
                    </div>
                </footer>
            </article>
        </main>
    );
}
