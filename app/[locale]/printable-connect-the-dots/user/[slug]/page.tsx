import Image from "next/image";
import { Download } from "lucide-react";

export default async function UserPuzzlePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/connect-dots/${slug}`,
        { cache: "no-store" }
    );

    if (!res.ok) return <div>Puzzle not found</div>;

    const puzzle = await res.json();

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">{puzzle.title}</h1>
                    <p className="text-slate-600 mb-6">{puzzle.description}</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className="font-bold mb-2">Original Image</h3>
                            <Image
                                src={puzzle.originalImageUrl}
                                alt="Original"
                                width={400}
                                height={400}
                                className="rounded-lg border"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Puzzle</h3>
                            <Image
                                src={puzzle.puzzleImageUrl}
                                alt="Puzzle"
                                width={400}
                                height={400}
                                className="rounded-lg border"
                            />
                        </div>
                    </div>

                    <a
                        href={puzzle.puzzleImageUrl}
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                    >
                        <Download size={20} />
                        Download Puzzle
                    </a>
                </div>
            </div>
        </div>
    );
}

