import { useRef, useEffect, useState } from "react";
import {
  Pen, Eraser, Undo2, Redo2, Trash2,
  Square, Circle, Minus, Triangle, Shapes, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToolType = "pen" | "eraser" | "shapes";
export type ShapeType = "rect" | "circle" | "oval" | "line" | "triangle";

export interface EditorToolbarProps {
  activeTool: ToolType;
  shapeType: ShapeType;
  strokeColor: string;
  strokeWidth: number;
  eraserSize: number;
  onToolChange: (t: ToolType) => void;
  onShapeChange: (s: ShapeType) => void;
  onColorChange: (c: string) => void;
  onStrokeWidthChange: (w: number) => void;
  onEraserSizeChange: (s: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

type PanelKey = "pen" | "shapes" | "eraser" | "color" | null;

const COLORS = [
  "#ffffff", "#C8FF00", "#60a5fa", "#f472b6",
  "#fb923c", "#a78bfa", "#34d399", "#f87171",
  "#fbbf24", "#38bdf8", "#818cf8", "#e879f9",
  "#000000", "#374151", "#6b7280", "#d1d5db",
];

const SHAPES: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
  { id: "rect",     label: "Rectangle", icon: <Square   className="size-3.5" /> },
  { id: "circle",   label: "Circle",    icon: <Circle   className="size-3.5" /> },
  { id: "oval",     label: "Oval",      icon: <Circle   className="size-3.5 scale-x-150" /> },
  { id: "triangle", label: "Triangle",  icon: <Triangle className="size-3.5" /> },
  { id: "line",     label: "Line",      icon: <Minus    className="size-3.5" /> },
];

export function EditorToolbar({
  activeTool, shapeType, strokeColor, strokeWidth, eraserSize,
  onToolChange, onShapeChange, onColorChange, onStrokeWidthChange, onEraserSizeChange,
  onUndo, onRedo, onClear, canUndo, canRedo,
}: EditorToolbarProps) {
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenPanel(null);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function toggle(key: PanelKey) {
    setOpenPanel(prev => prev === key ? null : key);
  }

  function handleToolClick(tool: ToolType) {
    if (tool === activeTool) {
      toggle(tool as PanelKey);
    } else {
      onToolChange(tool);
      setOpenPanel(tool as PanelKey);
    }
  }

  return (
    <div ref={ref} className="relative flex items-center gap-1.5">

      {/* ── Drawing tools ── */}
      <ToolGroup>
        <TBtn label="Pen" active={activeTool === "pen"} onClick={() => handleToolClick("pen")}>
          <Pen className="size-3.5" />
        </TBtn>

        <TBtn
          label="Shapes" active={activeTool === "shapes"}
          onClick={() => handleToolClick("shapes")}
          suffix={<ChevronDown className="size-2.5 opacity-40" />}
        >
          <Shapes className="size-3.5" />
        </TBtn>

        <TBtn label="Eraser" active={activeTool === "eraser"} onClick={() => handleToolClick("eraser")}>
          <Eraser className="size-3.5" />
        </TBtn>

        <div className="w-px h-4 bg-white/10 mx-0.5" />

        <TBtn label="Color" active={openPanel === "color"} onClick={() => toggle("color")}>
          <div className="size-3.5 rounded-full ring-1 ring-white/30" style={{ background: strokeColor }} />
        </TBtn>
      </ToolGroup>

      {/* ── History ── */}
      <ToolGroup>
        <TBtn label="Undo" disabled={!canUndo} onClick={onUndo}>
          <Undo2 className="size-3.5" />
        </TBtn>
        <TBtn label="Redo" disabled={!canRedo} onClick={onRedo}>
          <Redo2 className="size-3.5" />
        </TBtn>
      </ToolGroup>

      {/* ── Clear ── */}
      <ToolGroup>
        <TBtn label="Clear" onClick={onClear} danger>
          <Trash2 className="size-3.5" />
        </TBtn>
      </ToolGroup>

      {/* ── Panels ── */}

      {openPanel === "pen" && (
        <DropPanel title="Stroke width" side="left">
          <div className="flex items-center gap-3 mb-3">
            <input type="range" min={1} max={20} value={strokeWidth}
              onChange={e => onStrokeWidthChange(Number(e.target.value))}
              className="flex-1 accent-lime" />
            <span className="text-xs text-[#737373] w-8 text-right">{strokeWidth}px</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 3, 6, 10, 16].map(w => (
              <button key={w} onClick={() => onStrokeWidthChange(w)}
                className={cn(
                  "flex-1 flex items-center justify-center h-7 rounded-lg border transition-colors",
                  strokeWidth === w ? "border-lime/60 bg-lime/10" : "border-white/10 hover:border-white/25"
                )}>
                <div className="rounded-full bg-white" style={{ width: Math.min(w * 1.4, 14), height: Math.min(w * 1.4, 14) }} />
              </button>
            ))}
          </div>
        </DropPanel>
      )}

      {openPanel === "shapes" && (
        <DropPanel title="Shape" side="left">
          <div className="flex flex-col gap-1.5">
            {SHAPES.map(s => (
              <button key={s.id} onClick={() => { onShapeChange(s.id); onToolChange("shapes"); setOpenPanel(null); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-colors",
                  shapeType === s.id && activeTool === "shapes"
                    ? "border-lime/40 bg-lime/10 text-lime"
                    : "border-white/10 text-[#a3a3a3] hover:border-white/20 hover:text-white"
                )}>
                {s.icon}
                <span className="font-[Inter,sans-serif]">{s.label}</span>
              </button>
            ))}
          </div>
        </DropPanel>
      )}

      {openPanel === "eraser" && (
        <DropPanel title="Eraser size" side="center">
          <div className="flex items-center gap-3">
            <input type="range" min={5} max={60} value={eraserSize}
              onChange={e => onEraserSizeChange(Number(e.target.value))}
              className="flex-1 accent-lime" />
            <span className="text-xs text-[#737373] w-8 text-right">{eraserSize}px</span>
          </div>
        </DropPanel>
      )}

      {openPanel === "color" && (
        <DropPanel title="Color" side="right">
          <div className="grid grid-cols-4 gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => onColorChange(c)}
                className={cn("size-7 rounded-lg border-2 transition-transform hover:scale-110",
                  strokeColor === c ? "border-lime scale-110" : "border-white/10")}
                style={{ background: c }} />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 pt-3 border-t border-white/10">
            <span className="text-[10px] text-[#525252]">Custom</span>
            <input type="color" value={strokeColor} onChange={e => onColorChange(e.target.value)}
              className="h-6 w-8 rounded cursor-pointer bg-transparent border border-white/10" />
            <span className="text-[10px] text-[#525252] font-mono">{strokeColor}</span>
          </div>
        </DropPanel>
      )}
    </div>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function ToolGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.04] px-1 py-1">
      {children}
    </div>
  );
}

function TBtn({
  children, label, active = false, disabled = false, onClick, danger = false, suffix,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  danger?: boolean;
  suffix?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "flex items-center justify-center gap-0.5 w-8 h-8 rounded-lg transition-all duration-150 text-[#737373]",
        active && "bg-lime/15 text-lime",
        !active && !danger && "hover:bg-white/10 hover:text-white",
        danger && "hover:bg-red-500/10 hover:text-red-400",
        disabled && "opacity-25 cursor-not-allowed pointer-events-none"
      )}
    >
      {children}
      {suffix}
    </button>
  );
}

function DropPanel({
  title, children, side,
}: {
  title: string;
  children: React.ReactNode;
  side: "left" | "center" | "right";
}) {
  const alignment =
    side === "left" ? "left-0" :
    side === "right" ? "right-0" :
    "left-1/2 -translate-x-1/2";

  return (
    <div
      className={cn(
        "absolute top-full mt-3 w-52 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/60 p-4 z-50",
        alignment
      )}
      style={{ background: "rgba(17,17,17,0.97)" }}
    >
      <p className="text-[10px] font-semibold text-[#525252] uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  );
}
