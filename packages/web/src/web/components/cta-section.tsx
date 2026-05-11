import { Link } from "wouter";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] bg-lime/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Ready to transform
            <br />
            your logo?
          </h2>
          <p className="font-body text-base sm:text-lg text-[#a3a3a3] max-w-xl mx-auto mb-10">
            Join thousands of creators and businesses who have turned their ideas
            into professional logos with Logo.io
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/editor">
              <Button className="font-body rounded-full bg-lime text-lime-foreground hover:bg-lime/90 font-semibold text-base px-8 h-12 shadow-[0_0_30px_rgba(200,255,0,0.2)] group">
                Get Started — It's Free
                <ArrowRight className="size-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="font-body rounded-full border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white font-medium text-base px-8 h-12"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust */}
          <p className="mt-8 text-xs text-[#525252]">
            No credit card required · Free tier available · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
