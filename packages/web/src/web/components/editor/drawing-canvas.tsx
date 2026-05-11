import {
  useRef, useEffect, useImperativeHandle, forwardRef, useCallback, useState,
} from "react";
import type { ToolType, ShapeType } from "./editor-toolbar";
// ShapeType = "rect" | "circle" | "oval" | "line" | "triangle"
import { cn } from "@/lib/utils";

export interface DrawingCanvasHandle {
  getDataURL: () => string;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

interface DrawingCanvasProps {
  activeTool: ToolType;
  shapeType: ShapeType;
  strokeColor: string;
  strokeWidth: number;
  eraserSize: number;
  logoUrl: string | null;
  onEditAgain: () => void;
  onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
}

const MAX_HISTORY = 30;
const BG_COLOR = "#050505";

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  ({ activeTool, shapeType, strokeColor, strokeWidth, eraserSize, logoUrl, onEditAgain, onHistoryChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    const shapeStart = useRef<{ x: number; y: number } | null>(null);
    const snapshotRef = useRef<ImageData | null>(null);
    const historyRef = useRef<ImageData[]>([]);
    const historyIndexRef = useRef(-1);
    const [hasStrokes, setHasStrokes] = useState(false);

    // ── canvas: transparent so CSS dot grid shows through ─────────────────
    const initCanvas = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const observer = new ResizeObserver(() => {
        const { width, height } = container.getBoundingClientRect();
        const ctx = canvas.getContext("2d")!;
        const saved = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = width;
        canvas.height = height;
        initCanvas(ctx, width, height);
        if (saved.width > 0 && saved.height > 0) ctx.putImageData(saved, 0, 0);
      });
      observer.observe(container);
      return () => observer.disconnect();
    }, [initCanvas]);

    // ── history ────────────────────────────────────────────────────────────
    const saveSnapshot = useCallback(() => {
      const canvas = canvasRef.current; if (!canvas) return;
      const data = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(data);
      if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
      else historyIndexRef.current++;
      onHistoryChange(historyIndexRef.current > 0, historyIndexRef.current < historyRef.current.length - 1);
    }, [onHistoryChange]);

    const undo = useCallback(() => {
      if (historyIndexRef.current <= 0) return;
      historyIndexRef.current--;
      const canvas = canvasRef.current; if (!canvas) return;
      canvas.getContext("2d")!.putImageData(historyRef.current[historyIndexRef.current]!, 0, 0);
      if (historyIndexRef.current === 0) setHasStrokes(false);
      onHistoryChange(historyIndexRef.current > 0, historyIndexRef.current < historyRef.current.length - 1);
    }, [onHistoryChange]);

    const redo = useCallback(() => {
      if (historyIndexRef.current >= historyRef.current.length - 1) return;
      historyIndexRef.current++;
      const canvas = canvasRef.current; if (!canvas) return;
      canvas.getContext("2d")!.putImageData(historyRef.current[historyIndexRef.current]!, 0, 0);
      setHasStrokes(true);
      onHistoryChange(historyIndexRef.current > 0, historyIndexRef.current < historyRef.current.length - 1);
    }, [onHistoryChange]);

    const clear = useCallback(() => {
      const canvas = canvasRef.current; if (!canvas) return;
      canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
      setHasStrokes(false);
      saveSnapshot();
    }, [saveSnapshot]);

    useImperativeHandle(ref, () => ({
      getDataURL: () => {
        const src = canvasRef.current!;
        const off = document.createElement("canvas");
        off.width = src.width; off.height = src.height;
        const ctx = off.getContext("2d")!;
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, off.width, off.height);
        ctx.drawImage(src, 0, 0);
        return off.toDataURL("image/png");
      },
      clear, undo, redo,
      canUndo: () => historyIndexRef.current > 0,
      canRedo: () => historyIndexRef.current < historyRef.current.length - 1,
    }));

    // ── pointer helpers ────────────────────────────────────────────────────
    const getPos = (e: React.PointerEvent) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const drawShape = useCallback(
      (ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }, live = false) => {
        if (live && snapshotRef.current) ctx.putImageData(snapshotRef.current, 0, 0);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        if (shapeType === "rect") {
          ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
        } else if (shapeType === "circle") {
          // perfect circle using min dimension
          const dx = end.x - start.x, dy = end.y - start.y;
          const r = Math.sqrt(dx * dx + dy * dy) / 2;
          ctx.arc(start.x + dx / 2, start.y + dy / 2, r, 0, Math.PI * 2);
          ctx.stroke();
        } else if (shapeType === "oval") {
          // ellipse stretching to bounding box
          const rx = Math.abs(end.x - start.x) / 2;
          const ry = Math.abs(end.y - start.y) / 2;
          ctx.ellipse(start.x + (end.x - start.x) / 2, start.y + (end.y - start.y) / 2, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (shapeType === "triangle") {
          // equilateral-ish triangle: top-center, bottom-left, bottom-right
          const cx = (start.x + end.x) / 2;
          ctx.moveTo(cx, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.lineTo(start.x, end.y);
          ctx.closePath();
          ctx.stroke();
        } else {
          // line
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      },
      [shapeType, strokeColor, strokeWidth]
    );

    const onPointerDown = useCallback((e: React.PointerEvent) => {
      if (logoUrl) return;
      canvasRef.current!.setPointerCapture(e.pointerId);
      isDrawing.current = true;
      const pos = getPos(e);
      lastPoint.current = pos;
      const ctx = canvasRef.current!.getContext("2d")!;

      if (activeTool === "shapes") {
        shapeStart.current = pos;
        snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      } else if (activeTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = eraserSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, eraserSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      } else {
        // pen — draw a dot on tap
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, strokeWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        setHasStrokes(true);
      }
    }, [activeTool, strokeColor, strokeWidth, eraserSize, logoUrl]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
      if (!isDrawing.current || logoUrl) return;
      const ctx = canvasRef.current!.getContext("2d")!;
      const pos = getPos(e);

      if (activeTool === "shapes" && shapeStart.current) {
        drawShape(ctx, shapeStart.current, pos, true);
      } else {
        const last = lastPoint.current ?? pos;
        if (activeTool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = eraserSize;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
          ctx.globalCompositeOperation = "source-over";
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
          setHasStrokes(true);
        }
      }
      lastPoint.current = pos;
    }, [activeTool, strokeColor, strokeWidth, eraserSize, drawShape, logoUrl]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      if (activeTool === "shapes" && shapeStart.current) {
        const ctx = canvasRef.current!.getContext("2d")!;
        drawShape(ctx, shapeStart.current, getPos(e), true);
        shapeStart.current = null;
        snapshotRef.current = null;
        setHasStrokes(true);
      }
      saveSnapshot();
      lastPoint.current = null;
    }, [activeTool, drawShape, saveSnapshot]);

    return (
      <div ref={containerRef} className="relative w-full h-full bg-[#050505]">

        {/* ── Permanent dotted grid — always visible, never toggled ──── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Lime radial glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(200,255,0,0.03)_0%,_transparent_65%)]" />

        {/* ── Drawing canvas (transparent) ─────────────────────────── */}
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 w-full h-full",
            logoUrl ? "opacity-0 pointer-events-none" : "opacity-100",
            activeTool === "eraser" ? "cursor-cell" : "cursor-crosshair"
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />

        {/* ── Generated logo — inline, no dialog ───────────────────── */}
        {logoUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-sm animate-fade-in">
            {/* Generated image */}
            <img
              src={logoUrl}
              alt="Generated Logo"
              className="max-w-[52%] max-h-[52%] object-contain rounded-2xl shadow-2xl shadow-lime/10 ring-1 ring-white/5"
              style={{ imageRendering: "crisp-edges" }}
            />

            {/* Action bar below image */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={onEditAgain}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-xs font-medium transition-all backdrop-blur-sm"
              >
                {/* pencil icon */}
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Again
              </button>

              <a href={logoUrl} download="logo.png" target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-lime text-lime-foreground hover:bg-lime/90 text-xs font-semibold transition-all shadow-[0_0_24px_rgba(200,255,0,0.25)] hover:shadow-[0_0_32px_rgba(200,255,0,0.4)]">
                  {/* download icon */}
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download PNG
                </button>
              </a>
            </div>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────── */}
        {!logoUrl && !hasStrokes && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="text-center -mt-16 opacity-[0.18]">
              <div className="text-5xl mb-4">✏️</div>
              <p className="text-sm font-medium text-white">Sketch your logo idea</p>
              <p className="text-xs text-[#525252] mt-1">Draw above · Describe below · Hit Generate</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";
