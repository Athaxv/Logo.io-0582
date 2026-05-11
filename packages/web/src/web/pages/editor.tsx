import { useRef, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { EditorHeader } from "../components/editor/editor-header";
import { DrawingCanvas, type DrawingCanvasHandle } from "../components/editor/drawing-canvas";
import { EditorPromptBar } from "../components/editor/editor-prompt-bar";
import type { ToolType, ShapeType } from "../components/editor/editor-toolbar";

interface GenerateResponse {
  logoUrl?: string;
  error?: string;
}

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState<ToolType>("pen");
  const [shapeType, setShapeType] = useState<ShapeType>("rect");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [eraserSize, setEraserSize] = useState(20);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<DrawingCanvasHandle>(null);

  const { mutate: generate, isPending: isGenerating } = useMutation<
    GenerateResponse, Error, { sketchDataUrl: string; prompt: string }
  >({
    mutationFn: async ({ sketchDataUrl, prompt }) => {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sketchDataUrl, prompt }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.error) setError(data.error);
      else if (data.logoUrl) { setLogoUrl(data.logoUrl); setError(null); }
    },
    onError: (err) => setError(err.message ?? "Generation failed. Try again."),
  });

  const handleGenerate = useCallback((prompt: string) => {
    if (!canvasRef.current) return;
    setError(null);
    generate({ sketchDataUrl: canvasRef.current.getDataURL(), prompt });
  }, [generate]);

  const handleEditAgain = useCallback(() => {
    setLogoUrl(null); setError(null);
    canvasRef.current?.clear();
  }, []);

  const handleUndo = useCallback(() => canvasRef.current?.undo(), []);
  const handleRedo = useCallback(() => canvasRef.current?.redo(), []);
  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
    setLogoUrl(null); setError(null);
  }, []);

  return (
    <div
      className="relative bg-[#050505]"
      style={{ height: "100dvh" }}
    >
      {/* ── Canvas fills the full viewport ──────────────────────────────── */}
      <DrawingCanvas
        ref={canvasRef}
        activeTool={activeTool} shapeType={shapeType}
        strokeColor={strokeColor} strokeWidth={strokeWidth} eraserSize={eraserSize}
        logoUrl={logoUrl} onEditAgain={handleEditAgain}
        onHistoryChange={(u, r) => { setCanUndo(u); setCanRedo(r); }}
      />

      {/* ── Back button — top left ───────────────────────────────────────── */}
      <Link to="/">
        <button className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-[#737373] hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-xs font-medium backdrop-blur-sm" style={{ background: "rgba(13,13,13,0.75)" }}>
          <ArrowLeft className="size-3.5" />
          ReBack
        </button>
      </Link>

      {/* ── Floating navbar — absolute over canvas ───────────────────────── */}
      <EditorHeader
        activeTool={activeTool} shapeType={shapeType} strokeColor={strokeColor}
        strokeWidth={strokeWidth} eraserSize={eraserSize}
        onToolChange={setActiveTool} onShapeChange={setShapeType}
        onColorChange={setStrokeColor} onStrokeWidthChange={setStrokeWidth}
        onEraserSizeChange={setEraserSize}
        onUndo={handleUndo} onRedo={handleRedo} onClear={handleClear}
        canUndo={canUndo} canRedo={canRedo}
        isGenerating={isGenerating}
      />

      {/* ── Error banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs shadow-lg backdrop-blur-sm max-w-sm w-full">
          <AlertCircle className="size-3.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button className="text-red-400/50 hover:text-red-400 text-base leading-none" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* ── Prompt bar — floats at bottom ────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 px-4 pointer-events-none z-20">
        <div className="pointer-events-auto w-full max-w-2xl">
          <EditorPromptBar
            onGenerate={handleGenerate} isGenerating={isGenerating}
            hasDrawing={canUndo} logoUrl={logoUrl}
          />
        </div>
      </div>
    </div>
  );
}
