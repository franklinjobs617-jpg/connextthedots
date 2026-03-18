import React from "react";
import { Pencil, Eraser, PaintBucket, Replace, Pipette, Hand, Palette } from "lucide-react";
import { IconButton } from "./Buttons";

interface MobileToolbarProps {
    tool: string;
    setTool: (tool: any) => void;
    showPalette: boolean;
    setShowPalette: (val: boolean) => void;
}

export const MobileToolbar = ({
    tool,
    setTool,
    showPalette,
    setShowPalette
}: MobileToolbarProps) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50 flex items-center justify-around">
            <IconButton icon={Pencil} active={tool === "pen"} onClick={() => setTool("pen")} />
            <IconButton icon={Eraser} active={tool === "eraser"} onClick={() => setTool("eraser")} />
            <IconButton icon={PaintBucket} active={tool === "fill"} onClick={() => setTool("fill")} />
            <IconButton icon={Replace} active={tool === "replace"} onClick={() => setTool("replace")} />
            <IconButton icon={Pipette} active={tool === "eyedropper"} onClick={() => setTool("eyedropper")} />
            <IconButton icon={Hand} active={tool === "pan"} onClick={() => setTool("pan")} />
            <IconButton icon={Palette} active={showPalette} onClick={() => setShowPalette(!showPalette)} />
        </div>
    );
};
