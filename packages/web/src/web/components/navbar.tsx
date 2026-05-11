import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-lime-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="font-heading text-xl text-white">
              Logo<span className="text-lime">.io</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                  link.href === "/"
                    ? "text-white bg-white/5"
                    : "text-[#a3a3a3] hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              className="text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors"
            >
              Log in
            </a>
            <Link to="/editor">
              <Button className="font-body rounded-full bg-lime text-lime-foreground hover:bg-lime/90 font-semibold text-sm px-5 h-9 shadow-[0_0_20px_rgba(200,255,0,0.15)]">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-2.5 text-sm font-medium text-[#a3a3a3] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              <a
                href="#contact"
                className="px-4 py-2.5 text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors"
              >
                Log in
              </a>
              <Link to="/editor">
                <Button className="rounded-full bg-lime text-lime-foreground hover:bg-lime/90 font-semibold text-sm w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
