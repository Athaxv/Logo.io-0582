import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptBarProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  hasDrawing: boolean;
  logoUrl: string | null;
}

const PLACEHOLDER_HINTS = [
  "A minimalist bear head for a coffee shop...",
  "Bold letter mark for a tech startup...",
  "Geometric mountain logo for an outdoor brand...",
  "Simple leaf icon for an eco company...",
  "Abstract flame for a fitness brand...",
];

export function PromptBar({ onGenerate, isGenerating, hasDrawing, logoUrl }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [placeholderIdx] = useState(() => Math.floor(Math.random() * PLACEHOLDER_HINTS.length));
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-reset prompt after generation
  useEffect(() => {
    if (logoUrl) setPrompt("");
  }, [logoUrl]);

  const handleSubmit = () => {
    if (isGenerating) return;
    onGenerate(prompt.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-white/5 bg-[#0a0a0a] px-4 py-3">
      <div className="flex items-end gap-3 max-w-full">
        {/* Input area */}
        <div className="flex-1 relative">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-colors",
              isGenerating
                ? "border-lime/30 bg-lime/5"
                : "border-white/10 bg-white/[0.03] focus-within:border-white/20"
            )}
          >
            <Sparkles className={cn("size-4 shrink-0", isGenerating ? "text-lime animate-pulse" : "text-[#525252]")} />
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder={PLACEHOLDER_HINTS[placeholderIdx]}
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#525252] outline-none resize-none leading-5 max-h-24 overflow-y-auto disabled:opacity-50"
              style={{ minHeight: "20px" }}
            />
          </div>
        </div>

        {/* Generate button */}
        <Button
          onClick={handleSubmit}
          disabled={isGenerating}
          className={cn(
            "rounded-xl h-10 px-5 font-semibold text-sm shrink-0 transition-all duration-200 gap-2",
            isGenerating
              ? "bg-lime/20 text-lime cursor-not-allowed"
              : "bg-lime text-lime-foreground hover:bg-lime/90 shadow-[0_0_20px_rgba(200,255,0,0.15)] hover:shadow-[0_0_30px_rgba(200,255,0,0.25)]"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="size-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      {/* Hint */}
      <p className="text-[10px] text-[#3a3a3a] mt-2 ml-1">
        {isGenerating
          ? "AI is converting your sketch into a professional logo..."
          : "Describe style, industry, or mood · Press Enter or click Generate"}
      </p>
    </div>
  );
}
