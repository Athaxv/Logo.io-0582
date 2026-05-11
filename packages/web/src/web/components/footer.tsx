import { Sparkles } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Integrations"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "Help Center", "Community", "API"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/5 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-lime-foreground">
                <Sparkles className="size-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Logo<span className="text-lime">.io</span>
              </span>
            </div>
            <p className="text-sm text-[#525252] leading-relaxed max-w-xs">
              Transform hand-drawn sketches into professional logo designs with AI.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#525252] hover:text-[#a3a3a3] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#525252]">
            © 2026 Logo.io. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#525252] hover:text-[#a3a3a3] transition-colors">
              Twitter
            </a>
            <a href="#" className="text-xs text-[#525252] hover:text-[#a3a3a3] transition-colors">
              GitHub
            </a>
            <a href="#" className="text-xs text-[#525252] hover:text-[#a3a3a3] transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
