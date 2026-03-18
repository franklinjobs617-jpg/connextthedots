import React, { useState, useEffect, useRef } from "react";
import { X, Globe, Check, Loader2, AlertCircle, Layers, ChevronDown, Image as ImageIcon } from "lucide-react";
import { GridData } from "../types";
import { PALETTE } from "../palette-data";

interface GalleryExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: (meta: GalleryMeta) => void;
    onPublish: (meta: GalleryMeta) => Promise<boolean>;
    width: number;
    height: number;
    grid: GridData;
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
    { value: "gaming", label: "Gaming" },
    { value: "animals", label: "Animals" },
    { value: "nature", label: "Nature" },
    { value: "characters", label: "Characters" },
    { value: "shapes", label: "Shapes" },
    { value: "food", label: "Food" },
    { value: "holiday", label: "Holiday" },
    { value: "custom", label: "Custom" },
];

function toSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export const GalleryExportModal = ({
    isOpen,
    onClose,
    onPublish,
    width,
    height,
    grid,
    beadCount,
}: GalleryExportModalProps) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("custom");
    const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [author, setAuthor] = useState("ConnextTheDots");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const slug = toSlug(title || "untitled") + `-${width}x${height}`;

    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const pSize = 4;
        canvas.width = width * pSize;
        canvas.height = height * pSize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const color = PALETTE.find(p => p.id === cell)?.color || "#000";
                    ctx.fillStyle = color;
                    ctx.fillRect(x * pSize, y * pSize, pSize, pSize);
                }
            });
        });
    }, [isOpen, grid, width, height]);

    if (!isOpen) return null;

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTagInput("");
        }
    };

    const handlePublishAction = async () => {
        if (!title.trim()) return;
        setStatus("loading");
        const success = await onPublish({
            title, description: "", slug, category, difficulty, tags, author
        });
        if (success) {
            setStatus("success");
            setTimeout(() => {
                onClose();
                setStatus("idle");
            }, 1000);
        } else {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        // Vercel 更倾向于深色透明遮罩，使主体弹窗更聚焦
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            {/* 弹窗容器：更细腻的阴影，圆角加大至 rounded-xl */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-zinc-200/80 animate-in zoom-in-95 duration-200">

                {/* Header: Notion/Vercel 风格，极简，去掉了底边框 */}
                <div className="px-6 py-5 flex items-center justify-between bg-white">
                    <h2 className="text-[16px] font-semibold text-zinc-900 flex items-center gap-2 tracking-tight">
                        <Globe size={16} className="text-zinc-400" /> Publish Pattern
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 p-1.5 rounded-md transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 space-y-6">

                    {/* 卡片式预览区 (Vercel Style Card) */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-50 border border-zinc-200/60">
                        <div className="w-16 h-16 bg-white border border-zinc-200 rounded-md shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                            <canvas ref={canvasRef} className="max-w-full max-h-full image-pixelated p-1" />
                        </div>
                        <div className="flex flex-col justify-center space-y-1.5">
                            <div className="text-[13px] font-medium text-zinc-900 tracking-tight flex items-center gap-1.5">
                                <ImageIcon size={14} className="text-zinc-400" />
                                {width} × {height} Resolution
                            </div>
                            <div className="text-[13px] text-zinc-500 flex items-center gap-1.5">
                                <Layers size={14} className="text-zinc-400" />
                                {beadCount} Total Components
                            </div>
                        </div>
                    </div>

                    {/* 表单区域：紧凑、精致的排版 */}
                    <div className="space-y-5">
                        {/* 标题 */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-zinc-700">Project Name</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Mario Mushroom"
                                // Vercel 标志性的 Focus 状态：柔和的阴影环
                                className="w-full h-9 px-3 bg-white border border-zinc-200 rounded-md text-[13px] text-zinc-900 shadow-sm focus:outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
                            />
                            {title && (
                                <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1 mt-1">
                                    <span className="text-zinc-300">/</span> {slug}
                                </p>
                            )}
                        </div>

                        {/* 下拉框 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-zinc-700">Category</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-9 px-3 bg-white border border-zinc-200 rounded-md text-[13px] text-zinc-900 shadow-sm focus:outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 appearance-none cursor-pointer transition-all"
                                    >
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-zinc-700">Difficulty</label>
                                <div className="relative">
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value as any)}
                                        className="w-full h-9 px-3 bg-white border border-zinc-200 rounded-md text-[13px] text-zinc-900 shadow-sm focus:outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                                </div>
                            </div>
                        </div>

                        {/* 作者 */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-zinc-700">Author</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full h-9 px-3 bg-white border border-zinc-200 rounded-md text-[13px] text-zinc-900 shadow-sm focus:outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                            />
                        </div>

                        {/* 标签 (Notion Style Tags) */}
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-zinc-700">Tags</label>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                                placeholder="Type a tag and press Enter"
                                className="w-full h-9 px-3 bg-white border border-zinc-200 rounded-md text-[13px] text-zinc-900 shadow-sm focus:outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all placeholder:text-zinc-400"
                            />
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded-md text-[12px] font-medium flex items-center gap-1.5 group hover:bg-zinc-200 transition-colors cursor-default"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => setTags(tags.filter(t => t !== tag))}
                                                className="text-zinc-400 hover:text-zinc-900"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer: Vercel 标准的操作栏结构 */}
                <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handlePublishAction}
                        disabled={!title.trim() || status !== "idle"}
                        className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all shadow-sm flex items-center gap-2
                            ${status === "success" ? "bg-black text-white" :
                                status === "error" ? "bg-red-600 text-white" :
                                    "bg-zinc-900 text-white hover:bg-zinc-800"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {status === "loading" && <Loader2 className="animate-spin" size={14} />}
                        {status === "success" && <Check size={14} />}
                        {status === "error" && <AlertCircle size={14} />}

                        {status === "loading" ? "Publishing..." :
                            status === "success" ? "Published" :
                                status === "error" ? "Failed" :
                                    "Publish"}
                    </button>
                </div>
            </div>
        </div>
    );
};