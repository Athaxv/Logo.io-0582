import { Link } from "wouter";
import { Sparkles, ArrowLeft } from "lucide-react";
import { EditorToolbar, type EditorToolbarProps } from "./editor-toolbar";

interface EditorHeaderProps extends EditorToolbarProps {
  isGenerating: boolean;
}

export function EditorHeader({
  isGenerating,
  activeTool, shapeType, strokeColor, strokeWidth, eraserSize,
  onToolChange, onShapeChange, onColorChange, onStrokeWidthChange, onEraserSizeChange,
  onUndo, onRedo, onClear, canUndo, canRedo,
}: EditorHeaderProps) {
  return (
    /* floating pill — sits over the canvas, centered at top */
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-3 py-2 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.6)]" style={{ background: "rgba(13,13,13,0.88)" }}>

      {/* Brand */}
      <Link to="/">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime text-lime-foreground shadow-[0_0_12px_rgba(200,255,0,0.3)] group-hover:shadow-[0_0_20px_rgba(200,255,0,0.5)] transition-shadow">
            <Sparkles className="size-3.5" />
          </div>
          <span className="font-heading text-base text-white">
            Logo<span className="text-lime">.io</span>
          </span>
        </div>
      </Link>

      {/* Divider */}
      <div className="h-5 w-px bg-white/10" />

      {/* Toolbar inline */}
      <EditorToolbar
        activeTool={activeTool} shapeType={shapeType} strokeColor={strokeColor}
        strokeWidth={strokeWidth} eraserSize={eraserSize}
        onToolChange={onToolChange} onShapeChange={onShapeChange}
        onColorChange={onColorChange} onStrokeWidthChange={onStrokeWidthChange}
        onEraserSizeChange={onEraserSizeChange}
        onUndo={onUndo} onRedo={onRedo} onClear={onClear}
        canUndo={canUndo} canRedo={canRedo}
      />

      {/* Generating indicator */}
      {isGenerating && (
        <>
          <div className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-xs text-lime animate-pulse pr-1">
            <div className="size-1.5 rounded-full bg-lime animate-ping" />
            Generating…
          </div>
        </>
      )}
    </div>
  );
}
