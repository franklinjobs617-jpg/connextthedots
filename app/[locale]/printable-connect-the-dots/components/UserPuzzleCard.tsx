import Image from "next/image";
import Link from "next/link";

export default function UserPuzzleCard({ puzzle }: any) {
    return (
        <Link
            href={`/printable-connect-the-dots/user/${puzzle.slug}`}
            className="group bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-xl transition-all"
        >
            <div className="relative aspect-square bg-slate-50">
                <Image
                    src={puzzle.puzzleImageUrl}
                    alt={puzzle.title}
                    fill
                    className="object-contain p-4"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-full text-xs font-bold">
                    {puzzle.dotCount} dots
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-sm mb-1 truncate">{puzzle.title}</h3>
                <p className="text-xs text-slate-400">{puzzle.difficulty}</p>
                <div className="flex items-center gap-2 mt-2">
                    <Image
                        src={puzzle.user.picture}
                        alt={puzzle.user.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                    />
                    <span className="text-xs text-slate-500">{puzzle.user.name}</span>
                </div>
            </div>
        </Link>
    );
}
