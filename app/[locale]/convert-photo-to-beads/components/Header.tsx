import React from "react";
import {
  Plus, Upload, Pencil, Eraser, PaintBucket, Replace, Pipette, Hand, Undo, Redo,
  Grid3X3, Hash, BarChart2, Download, Image as ImageIcon, Sparkles, FileText, Globe, X, ChevronDown
} from "lucide-react";
import { ToolButton, IconButton } from "./Buttons";

interface HeaderProps {
  setIsNewModalOpen: (val: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tool: string;
  setTool: (tool: any) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  historyIndex: number;
  historyLength: number;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  showNumbers: boolean;
  setShowNumbers: (val: boolean) => void;
  showStats: boolean;
  setShowStats: (val: boolean) => void;
  clearGrid: () => void;
  isExportMenuOpen: boolean;
  setIsExportMenuOpen: (val: boolean) => void;
  handleExport: (type: any) => void;
}

export const Header = ({
  setIsNewModalOpen,
  fileInputRef,
  handleImageUpload,
  tool,
  setTool,
  handleUndo,
  handleRedo,
  historyIndex,
  historyLength,
  showGrid,
  setShowGrid,
  showNumbers,
  setShowNumbers,
  showStats,
  setShowStats,
  clearGrid,
  isExportMenuOpen,
  setIsExportMenuOpen,
  handleExport
}: HeaderProps) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExportMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExportMenuOpen, setIsExportMenuOpen]);

  // Vercel Button Classes
  const secondaryBtn = "flex items-center gap-2 px-3 py-1.5 bg-white text-zinc-600 border border-zinc-200 rounded-md text-xs font-semibold hover:bg-zinc-50 active:scale-[0.98] transition-all";
  const primaryBtn = "flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-md text-xs font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-sm";
  const destructiveBtn = "flex items-center gap-2 px-3 py-1.5 bg-white text-red-500 border border-red-100 rounded-md text-xs font-semibold hover:bg-red-50 active:scale-[0.98] transition-all";

  return (
    <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-4 shrink-0 relative z-50">
      <div className="flex items-center gap-2">
        <button onClick={() => setIsNewModalOpen(true)} className={secondaryBtn}>
          <Plus size={14} />
          <span className="hidden sm:inline">New</span>
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        <button onClick={() => fileInputRef.current?.click()} className={secondaryBtn}>
          <Upload size={14} />
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-1 bg-zinc-50 p-1 rounded-md border border-zinc-100">
        <ToolButton icon={Pencil} label="Pen" active={tool === "pen"} onClick={() => setTool("pen")} />
        <ToolButton icon={Eraser} label="Eraser" active={tool === "eraser"} onClick={() => setTool("eraser")} />
        <ToolButton icon={PaintBucket} label="Fill" active={tool === "fill"} onClick={() => setTool("fill")} />
        <ToolButton icon={Replace} label="Replace" active={tool === "replace"} onClick={() => setTool("replace")} />
        <ToolButton icon={Pipette} label="Eyedropper" active={tool === "eyedropper"} onClick={() => setTool("eyedropper")} />
        <ToolButton icon={Hand} label="Pan" active={tool === "pan"} onClick={() => setTool("pan")} />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          <IconButton icon={Undo} onClick={handleUndo} disabled={historyIndex === 0} />
          <IconButton icon={Redo} onClick={handleRedo} disabled={historyIndex === historyLength - 1} />
        </div>
        <div className="h-4 w-px bg-zinc-200 hidden md:block"></div>
        <div className="flex items-center gap-0.5 hidden md:flex">
          <IconButton icon={Grid3X3} active={showGrid} onClick={() => setShowGrid(!showGrid)} />
          <IconButton icon={Hash} active={showNumbers} onClick={() => setShowNumbers(!showNumbers)} />
          <IconButton icon={BarChart2} active={showStats} onClick={() => setShowStats(!showStats)} />
        </div>
        <div className="h-4 w-px bg-zinc-200 hidden md:block"></div>

        <div className="flex items-center gap-2 relative" ref={menuRef}>
          <button onClick={clearGrid} className={`${destructiveBtn} hidden md:flex`}>
            Clear
          </button>

          <button onClick={() => handleExport("gallery")} className={primaryBtn}>
            <Globe size={14} />
            Publish Pattern
          </button>

          <button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} className={secondaryBtn}>
            <Download size={14} className="text-zinc-400" />
            Export
          </button>

          {isExportMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <button onClick={() => handleExport("pattern")} className="w-full px-3 py-2 flex items-center gap-3 hover:bg-zinc-50 transition-colors text-left group">
                <div className="w-8 h-8 flex items-center justify-center bg-zinc-50 text-zinc-400 rounded-sm group-hover:text-zinc-900 transition-colors">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-zinc-900">Pattern Image</div>
                  <div className="text-[10px] text-zinc-400 -mt-0.5">Grid & color codes</div>
                </div>
              </button>

              <button onClick={() => handleExport("finished")} className="w-full px-3 py-2 flex items-center gap-3 hover:bg-zinc-50 transition-colors text-left group">
                <div className="w-8 h-8 flex items-center justify-center bg-zinc-50 text-zinc-400 rounded-sm group-hover:text-zinc-900 transition-colors">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-zinc-900">Finished Effect</div>
                  <div className="text-[10px] text-zinc-400 -mt-0.5">Ironed result sim</div>
                </div>
              </button>

              <button onClick={() => handleExport("material")} className="w-full px-3 py-2 flex items-center gap-3 hover:bg-zinc-50 transition-colors text-left group">
                <div className="w-8 h-8 flex items-center justify-center bg-zinc-50 text-zinc-400 rounded-sm group-hover:text-zinc-900 transition-colors">
                  <BarChart2 size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-zinc-900">Material List</div>
                  <div className="text-[10px] text-zinc-400 -mt-0.5">Stats & symbols</div>
                </div>
              </button>

              <div className="h-px bg-zinc-100 my-1 mx-2" />

              <button onClick={() => handleExport("pdf")} className="w-full px-3 py-2 flex items-center gap-3 hover:bg-zinc-50 transition-colors text-left group">
                <div className="w-8 h-8 flex items-center justify-center bg-zinc-50 text-zinc-400 rounded-sm group-hover:text-zinc-900 transition-colors">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-zinc-900">Export PDF</div>
                  <div className="text-[10px] text-zinc-400 -mt-0.5">Printable booklet</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
