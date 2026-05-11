import { Link } from "wouter";
import { Button } from "./ui/button";
import { ArrowRight, Play, Zap, Stars, Wand2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,255,0,0.03)_0%,_transparent_70%)]" />
      
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating tags */}
      <div className="absolute top-32 left-[8%] hidden lg:block animate-fade-in stagger-2 opacity-0">
        <FloatingTag icon={<Zap className="size-3" />} label="AI Powered" />
      </div>
      <div className="absolute top-44 right-[10%] hidden lg:block animate-fade-in stagger-3 opacity-0">
        <FloatingTag icon={<Stars className="size-3" />} label="Smart Design" />
      </div>
      <div className="absolute bottom-48 left-[12%] hidden lg:block animate-fade-in stagger-4 opacity-0">
        <FloatingTag icon={<Wand2 className="size-3" />} label="Auto Trace" />
      </div>
      <div className="absolute bottom-52 right-[8%] hidden lg:block animate-fade-in stagger-5 opacity-0">
        <FloatingTag icon={<Play className="size-3" />} label="Instant Export" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up opacity-0 stagger-1 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/5 px-4 py-1.5 text-xs font-medium text-lime">
            <span className="flex h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
            Now in Beta — Try it free
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-heading animate-fade-in-up opacity-0 stagger-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-white">
          Transform your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-lime">hand drawn</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-lime/10 rounded-sm -skew-x-3" />
          </span>
          <br />
          logo into a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            professional
          </span>
          <br />
          design
        </h1>

        {/* Subtitle */}
        <p className="font-body animate-fade-in-up opacity-0 stagger-3 mt-6 max-w-2xl mx-auto text-base sm:text-lg text-[#a3a3a3] leading-relaxed">
          Upload a sketch, and our AI transforms it into a sleek, modern, vector logo
          ready for any brand — in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up opacity-0 stagger-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/editor">
            <Button className="font-body rounded-full bg-lime text-lime-foreground hover:bg-lime/90 font-semibold text-base px-8 h-12 shadow-[0_0_30px_rgba(200,255,0,0.2)] transition-shadow hover:shadow-[0_0_40px_rgba(200,255,0,0.3)] group">
              Get Started
              <ArrowRight className="size-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/editor">
            <Button
              variant="outline"
              className="font-body rounded-full border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white font-medium text-base px-8 h-12"
            >
              Check previous one
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up opacity-0 stagger-5 mt-16 flex items-center justify-center gap-8 sm:gap-12">
          <StatItem value="10K+" label="Logos Created" />
          <div className="h-8 w-px bg-white/10" />
          <StatItem value="4.9★" label="User Rating" />
          <div className="h-8 w-px bg-white/10" />
          <StatItem value="<5s" label="Generation Time" />
        </div>
      </div>
    </section>
  );
}

function FloatingTag({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-xs font-medium text-white/70 animate-float">
      <span className="text-lime">{icon}</span>
      {label}
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-lg sm:text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-[#737373] mt-0.5">{label}</div>
    </div>
  );
}
