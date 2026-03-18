import React, { useState } from "react";
import { X, Download, Tag, Wand2 } from "lucide-react";

interface GalleryExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (meta: GalleryMeta) => void;
    width: number;
    height: number;
    beadCount: number;
}

export interface GalleryMeta {
    title: string;
    description: string;
    slug: string;
    category: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    tags: string[];
    author: string;
}

const CATEGORIES = [
    { value: "gaming", label: "🎮 Gaming" },
    { value: "animals", label: "🐾 Animals" },
    { value: "nature", label: "🌸 Nature" },
    { value: "characters", label: "👤 Characters" },
    { value: "shapes", label: "💎 Shapes" },
    { value: "food", label: "🍕 Food" },
    { value: "holiday", label: "🎄 Holiday" },
    { value: "custom", label: "✨ Custom" },
];

const DIFFICULTIES = [
    { value: "beginner", label: "Beginner", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { value: "intermediate", label: "Intermediate", color: "bg-amber-50 text-amber-600 border-amber-200" },
    { value: "advanced", label: "Advanced", color: "bg-red-50 text-red-600 border-red-200" },
];

// 标题 → slug 自动转换
function toSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export const GalleryExportModal = ({
    isOpen,
    onClose,
    onConfirm,
    width,
    height,
    beadCount,
}: GalleryExportModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("custom");
    const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [author, setAuthor] = useState("ConnextTheDots");

    const slug = toSlug(title || "untitled") + `-${width}x${height}`;

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (t: string) => {
        setTags(tags.filter((tag) => tag !== t));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleExport = () => {
        onConfirm({
            title: title || "Untitled Pattern",
            description,
            slug,
            category,
            difficulty,
            tags,
            author: author || "ConnextTheDots",
        });
        // 重置表单
        setTitle("");
        setDescription("");
        setCategory("custom");
        setDifficulty("beginner");
        setTags([]);
        setTagInput("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* 头部 */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-xl">
                            <Download size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">导出到画廊</h2>
                            <p className="text-xs text-gray-400">
                                {width}×{height} • {beadCount} 颗珠子
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 表单 */}
                <div className="p-5 space-y-5">
                    {/* 标题 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            图纸标题 *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Pikachu, Super Mushroom, Cherry Blossom..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-400 mt-1.5">
                            Slug: <span className="font-mono text-purple-500">{slug}</span>
                        </p>
                    </div>

                    {/* 简介 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            简介
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Simple description of the pattern..."
                            rows={2}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        />
                    </div>

                    {/* 分类 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            分类
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setCategory(cat.value)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-center ${category === cat.value
                                            ? "bg-purple-100 text-purple-700 ring-2 ring-purple-500/30"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 难度 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            难度
                        </label>
                        <div className="flex gap-2">
                            {DIFFICULTIES.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setDifficulty(d.value as any)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${difficulty === d.value
                                            ? `${d.color} ring-2 ring-offset-1 ring-current`
                                            : "bg-gray-50 text-gray-500 border-gray-200"
                                        }`}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 标签 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            标签
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="输入标签后回车..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all"
                            >
                                <Tag size={14} />
                            </button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium"
                                    >
                                        #{tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 作者 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            作者
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* 底部按钮 */}
                <div className="p-5 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={!title.trim()}
                        className="flex-1 px-4 py-3 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Wand2 size={16} />
                        导出 JSON
                    </button>
                </div>
            </div>
        </div>
    );
};
