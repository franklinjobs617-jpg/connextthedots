// components/PrintableCard.tsx 
import Link from 'next/link';
import { IMAGE_DEFAULT_WIDTH, IMAGE_DEFAULT_HEIGHT, PrintableItem } from '@/lib/printables-data';

interface PrintableCardProps {
    item: PrintableItem;
    priority?: boolean; // 用于控制 lazy loading
}

export default function PrintableCard({ item, priority = false }: PrintableCardProps) {
    // 处理 dotRange 显示逻辑
    const displayDotRange = Array.isArray(item.dotRange)
        ? (item.dotRange[0] === item.dotRange[1] ? item.dotRange[0] : `${item.dotRange[0]}-${item.dotRange[1]}`)
        : item.dotRange;

    // 处理 category 显示逻辑
    const categories = Array.isArray(item.category) ? item.category : [item.category];

    return (
        <Link
            href={item.detailPage}
            className="relative block bg-white rounded-xl overflow-hidden shadow-md group transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
            <div className="relative w-full overflow-hidden aspect-square bg-slate-100">
                <img
                    src={item.imageUrl}
                    srcSet={item.imageSrcset || `${item.imageUrl} ${IMAGE_DEFAULT_WIDTH}w`}
                    sizes="(min-width: 1024px) 33.3vw, (min-width: 640px) 50vw, 50vw"
                    alt={item.altText}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    width={IMAGE_DEFAULT_WIDTH}
                    height={IMAGE_DEFAULT_HEIGHT}
                />

                <span className="absolute top-3 right-3 bg-brand-blue text-white text-sm font-semibold px-3 py-1 rounded-full z-10 shadow-sm">
                    Free
                </span>
                <span className={`absolute top-3 left-3 ${item.tagColor} text-white text-sm font-semibold px-3 py-1 rounded-full z-10 shadow-sm`}>
                    {item.difficulty}
                </span>
            </div>

            <div className="p-4 md:p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1">
                    {item.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-md border border-slate-200">
                        Dots: {displayDotRange}
                    </span>
                    {categories.map((cat, idx) => (
                        <span key={idx} className="bg-indigo-50 text-brand-blue text-xs font-bold px-2 py-1 rounded-md">
                            {cat}
                        </span>
                    ))}
                </div>

                <p className="text-slate-500 mb-4 line-clamp-2 text-sm">
                    {item.description}
                </p>

                <div className="flex flex-col md:flex-row gap-3 md:text-sm text-slate-400 font-medium pt-3 border-t border-slate-50">
                    <span className="flex items-center gap-1">
                        {/* Age Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.ageRecommendation}
                    </span>
                    <span className="flex items-center gap-1">
                        {/* Popularity Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {item.popularity} Popularity
                    </span>
                </div>
            </div>
        </Link>
    );
}