import { useRef, useEffect, useState } from "react";
import {
  Pen,
  Eraser,
  Palette,
  Undo2,
  Redo2,
  Trash2,
  Square,
  Circle,
  Minus,
  Shapes,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToolType = "pen" | "eraser" | "shapes";
export type ShapeType = "rect" | "circle" | "line";

interface ToolSidebarProps {
  activeTool: ToolType;
  shapeType: ShapeType;
  strokeColor: string;
  strokeWidth: number;
  eraserSize: number;
  onToolChange: (tool: ToolType) => void;
  onShapeChange: (shape: ShapeType) => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (w: number) => void;
  onEraserSizeChange: (s: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

type PanelType = "pen" | "shapes" | "eraser" | "color" | null;

const COLORS = [
  "#ffffff", "#C8FF00", "#60a5fa", "#f472b6",
  "#fb923c", "#a78bfa", "#34d399", "#f87171",
  "#fbbf24", "#38bdf8", "#818cf8", "#e879f9",
  "#000000", "#374151", "#6b7280", "#d1d5db",
];

export function ToolSidebar({
  activeTool,
  shapeType,
  strokeColor,
  strokeWidth,
  eraserSize,
  onToolChange,
  onShapeChange,
  onColorChange,
  onStrokeWidthChange,
  onEraserSizeChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}: ToolSidebarProps) {
  const [openPanel, setOpenPanel] = useState<PanelType>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function togglePanel(panel: PanelType) {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }

  const shapeLabels: Record<ShapeType, string> = {
    rect: "Rectangle",
    circle: "Circle",
    line: "Line",
  };

  return (
    <div
      ref={sidebarRef}
      className="relative flex flex-col items-center gap-1 w-14 border-r border-white/5 bg-[#0a0a0a] py-4 z-20"
    >
      {/* Pen Tool */}
      <ToolButton
        icon={<Pen className="size-4" />}
        active={activeTool === "pen"}
        tooltip="Pen"
        onClick={() => {
          onToolChange("pen");
          togglePanel("pen");
        }}
      />

      {/* Shapes Tool */}
      <ToolButton
        icon={<Shapes className="size-4" />}
        active={activeTool === "shapes"}
        tooltip="Shapes"
        onClick={() => {
          onToolChange("shapes");
          togglePanel("shapes");
        }}
      />

      {/* Eraser Tool */}
      <ToolButton
        icon={<Eraser className="size-4" />}
        active={activeTool === "eraser"}
        tooltip="Eraser"
        onClick={() => {
          onToolChange("eraser");
          togglePanel("eraser");
        }}
      />

      {/* Color */}
      <ToolButton
        icon={
          <div
            className="size-4 rounded-full border-2 border-white/30"
            style={{ background: strokeColor }}
          />
        }
        active={false}
        tooltip="Color"
        onClick={() => togglePanel("color")}
      />

      <div className="h-px w-8 bg-white/10 my-1" />

      {/* Undo */}
      <ToolButton
        icon={<Undo2 className="size-4" />}
        active={false}
        disabled={!canUndo}
        tooltip="Undo"
        onClick={onUndo}
      />

      {/* Redo */}
      <ToolButton
        icon={<Redo2 className="size-4" />}
        active={false}
        disabled={!canRedo}
        tooltip="Redo"
        onClick={onRedo}
      />

      <div className="h-px w-8 bg-white/10 my-1" />

      {/* Clear */}
      <ToolButton
        icon={<Trash2 className="size-4" />}
        active={false}
        tooltip="Clear"
        onClick={onClear}
        danger
      />

      {/* Floating Panels */}
      {openPanel === "pen" && (
        <FloatingPanel title="Pen">
          <label className="text-xs text-[#737373] mb-2 block">
            Stroke Width: <span className="text-white">{strokeWidth}px</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={strokeWidth}
            onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
            className="w-full accent-lime"
          />
          <div className="flex gap-2 mt-3">
            {[1, 3, 6, 10, 16].map((w) => (
              <button
                key={w}
                onClick={() => onStrokeWidthChange(w)}
                className={cn(
                  "flex-1 flex items-center justify-center h-8 rounded border transition-colors",
                  strokeWidth === w
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-white/10 text-[#737373] hover:border-white/30"
                )}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: Math.min(w * 1.5, 16), height: Math.min(w * 1.5, 16) }}
                />
              </button>
            ))}
          </div>
        </FloatingPanel>
      )}

      {openPanel === "shapes" && (
        <FloatingPanel title="Shapes">
          <div className="flex flex-col gap-2">
            {(["rect", "circle", "line"] as ShapeType[]).map((s) => (
              <button
                key={s}
                onClick={() => { onShapeChange(s); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-colors",
                  shapeType === s
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-white/10 text-[#a3a3a3] hover:border-white/20 hover:text-white"
                )}
              >
                {s === "rect" && <Square className="size-4" />}
                {s === "circle" && <Circle className="size-4" />}
                {s === "line" && <Minus className="size-4" />}
                {shapeLabels[s]}
              </button>
            ))}
          </div>
        </FloatingPanel>
      )}

      {openPanel === "eraser" && (
        <FloatingPanel title="Eraser">
          <label className="text-xs text-[#737373] mb-2 block">
            Size: <span className="text-white">{eraserSize}px</span>
          </label>
          <input
            type="range"
            min={5}
            max={60}
            value={eraserSize}
            onChange={(e) => onEraserSizeChange(Number(e.target.value))}
            className="w-full accent-lime"
          />
        </FloatingPanel>
      )}

      {openPanel === "color" && (
        <FloatingPanel title="Color">
          <div className="grid grid-cols-4 gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={cn(
                  "size-8 rounded-lg border-2 transition-transform hover:scale-110",
                  strokeColor === color ? "border-lime scale-110" : "border-transparent"
                )}
                style={{ background: color }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="text-xs text-[#737373]">Custom:</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-7 w-12 rounded cursor-pointer bg-transparent border border-white/10"
            />
            <span className="text-xs text-[#737373] font-mono">{strokeColor}</span>
          </div>
        </FloatingPanel>
      )}
    </div>
  );
}

function ToolButton({
  icon,
  active,
  disabled,
  tooltip,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  active: boolean;
  disabled?: boolean;
  tooltip: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        "group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150",
        active
          ? "bg-lime/15 text-lime"
          : danger
          ? "text-[#737373] hover:text-red-400 hover:bg-red-400/10"
          : "text-[#737373] hover:text-white hover:bg-white/5",
        disabled && "opacity-30 cursor-not-allowed pointer-events-none"
      )}
    >
      {icon}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-lime rounded-r-full" />
      )}
    </button>
  );
}

function FloatingPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute left-full ml-2 top-0 w-52 rounded-xl border border-white/10 bg-[#141414] shadow-2xl p-4 z-30">
      <div className="flex items-center gap-2 mb-3">
        <ChevronRight className="size-3 text-lime" />
        <span className="text-xs font-semibold text-white uppercase tracking-widest">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
