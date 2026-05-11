import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorPromptBarProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  hasDrawing: boolean;
  logoUrl: string | null;
}

const HINTS = [
  "A minimalist bear head for a coffee shop…",
  "Bold letter mark for a tech startup…",
  "Geometric mountain logo for an outdoor brand…",
  "Simple leaf icon for an eco company…",
  "Abstract flame for a fitness brand…",
];

export function EditorPromptBar({ onGenerate, isGenerating, logoUrl }: EditorPromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [hintIdx] = useState(() => Math.floor(Math.random() * HINTS.length));

  useEffect(() => { if (logoUrl) setPrompt(""); }, [logoUrl]);

  const handleSubmit = () => { if (isGenerating) return; onGenerate(prompt.trim()); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
  };

  return (
    <div className="flex flex-col items-center gap-2">

      {/* ── Input row ─────────────────────────────────────────────────── */}
      <div className={cn(
        "w-full flex items-center gap-3 rounded-2xl border px-4 py-0 h-14 backdrop-blur-xl transition-all duration-200",
        isGenerating
          ? "border-lime/30 bg-[#0a0a0a]/95 shadow-[0_0_0_3px_rgba(200,255,0,0.06),0_8px_32px_rgba(0,0,0,0.7)]"
          : "border-white/10 bg-[#0a0a0a]/95 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-white/15 focus-within:border-lime/25 focus-within:shadow-[0_0_0_3px_rgba(200,255,0,0.06),0_8px_32px_rgba(0,0,0,0.7)]"
      )}>

        {/* Icon */}
        <Sparkles className={cn(
          "size-4 shrink-0 transition-colors",
          isGenerating ? "text-lime animate-pulse" : "text-[#525252]"
        )} />

        {/* Single-line input */}
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          placeholder={HINTS[hintIdx]}
          className="flex-1 h-full bg-transparent text-sm text-white placeholder:text-[#3a3a3a] outline-none disabled:opacity-40 min-w-0"
        />

        {/* Generate button — vertically centered via flex, fixed height */}
        <Button
          onClick={handleSubmit}
          disabled={isGenerating}
          className={cn(
            "shrink-0 h-9 px-5 rounded-xl font-semibold text-sm gap-2 transition-all duration-200",
            isGenerating
              ? "bg-lime/15 text-lime cursor-not-allowed"
              : "bg-lime text-lime-foreground hover:bg-lime/90 shadow-[0_0_20px_rgba(200,255,0,0.2)] hover:shadow-[0_0_30px_rgba(200,255,0,0.35)]"
          )}>
          {isGenerating
            ? <><Loader2 className="size-4 animate-spin" />Generating…</>
            : <><Wand2 className="size-4" />Generate</>}
        </Button>
      </div>

      {/* ── Helper text ───────────────────────────────────────────────── */}
      <p className="text-[11px] text-[#3a3a3a] text-center tracking-wide">
        {isGenerating
          ? "AI is turning your sketch into a professional logo…"
          : "Describe style, mood, or industry · Press Enter or click Generate"}
      </p>
    </div>
  );
}
