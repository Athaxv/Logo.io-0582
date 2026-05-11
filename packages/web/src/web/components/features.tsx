import { Upload, Wand2, Download, Palette, Layers, Zap } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Sketch",
    description: "Snap a photo or scan your hand-drawn logo concept.",
  },
  {
    icon: Wand2,
    title: "AI Transforms",
    description: "Our AI traces, refines, and modernizes your design instantly.",
  },
  {
    icon: Palette,
    title: "Pick Your Style",
    description: "Choose from modern, minimal, vintage, or bold aesthetics.",
  },
  {
    icon: Layers,
    title: "Multiple Variants",
    description: "Get 5+ refined variations to pick the perfect one.",
  },
  {
    icon: Zap,
    title: "Instant Vector",
    description: "Clean SVG output, infinitely scalable for any use case.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download SVG, PNG, PDF — ready for print and digital.",
  },
];

export function Features() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/5 px-4 py-1.5 text-xs font-medium text-lime mb-6">
            How it works
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white">
            From sketch to logo
            <br />
            <span className="text-[#737373]">in three simple steps</span>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-lime/20 hover:bg-lime/[0.02]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/10 text-lime mb-5 transition-colors group-hover:bg-lime/20">
                <feature.icon className="size-5" />
              </div>
              <h3 className="font-heading text-xl text-white mb-2">{feature.title}</h3>
              <p className="font-body text-sm leading-relaxed text-[#737373]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
