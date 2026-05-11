export function Clients() {
  return (
    <section className="relative py-16 border-t border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-[#525252] mb-10">
          Trusted by teams at
        </p>

        {/* Logo marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10" />

          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-16 mx-8">
                {clientLogos.map((logo, i) => (
                  <div
                    key={`${setIndex}-${i}`}
                    className="flex items-center gap-2 text-[#525252] hover:text-[#737373] transition-colors shrink-0"
                  >
                    <logo.icon />
                    <span className="text-sm font-semibold tracking-wide">{logo.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const clientLogos = [
  {
    name: "Stripe",
    icon: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-7.076-2.19l-.893 5.575C4.746 22.835 7.842 24 12.024 24c2.6 0 4.727-.649 6.225-1.886 1.636-1.345 2.468-3.306 2.468-5.665 0-4.112-2.508-5.825-6.741-7.299z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L24 22H0L12 1z" />
      </svg>
    ),
  },
  {
    name: "Linear",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.028 15.481a11.978 11.978 0 006.491 6.491L21.085 9.406a.5.5 0 00-.354-.854H13.5a.5.5 0 00-.354.146L2.028 19.816V15.48zm-.012-2.325V8.5a.5.5 0 01.854-.354L13.988 19.264a.5.5 0 01-.354.854h-4.66L2.016 13.156zM8.5 2.016a11.978 11.978 0 00-4.66 2.028l14.116 14.116a11.978 11.978 0 002.028-4.66L8.5 2.016zM12 0C5.373 0 0 5.373 0 12c0 .338.014.673.042 1.004L13.004.042A12.024 12.024 0 0012 0z" />
      </svg>
    ),
  },
  {
    name: "Figma",
    icon: () => (
      <svg width="14" height="20" viewBox="0 0 15 22" fill="currentColor">
        <path d="M4.167 22c2.298 0 4.166-1.868 4.166-4.167v-4.166H4.167a4.167 4.167 0 100 8.333zM0 9.667a4.167 4.167 0 014.167-4.167h4.166v8.333H4.167A4.167 4.167 0 010 9.667zM0 1.333A4.167 4.167 0 014.167-2.833h4.166V5.5H4.167A4.167 4.167 0 010 1.333zM8.333-2.833h4.167a4.167 4.167 0 010 8.333H8.333V-2.833zM16.667 9.667a4.167 4.167 0 01-4.167 4.166A4.167 4.167 0 018.333 9.667 4.167 4.167 0 0112.5 5.5a4.167 4.167 0 014.167 4.167z" transform="translate(0 2.833)" />
      </svg>
    ),
  },
  {
    name: "Notion",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L2.68 2.491c-.466.047-.56.28-.374.466l2.153 1.251zm.793 2.892v13.91c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.166V6.054c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.747.327-.747.886zm14.337.42c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.747 0-.933-.234-1.494-.933l-4.577-7.186v6.953l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V8.858L7.508 8.72c-.093-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933l3.222-.186zM1.633 1.155L15.5.208c1.68-.14 2.1.093 2.8.606l3.876 2.706c.467.326.607.747.607 1.166v16.158c0 1.027-.373 1.634-1.68 1.727l-15.458.933c-.98.047-1.448-.093-1.968-.746L.88 19.397c-.56-.7-.793-1.26-.793-1.913V2.88c0-.84.373-1.54 1.54-1.727z" />
      </svg>
    ),
  },
  {
    name: "Supabase",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.723 23.896c-.456.575-1.398.204-1.398-.551V14.4H22.07c1.078 0 1.664 1.26.963 2.07l-9.31 7.426zM10.277.104c.456-.575 1.398-.204 1.398.551V9.6H1.93c-1.078 0-1.664-1.26-.963-2.07L10.277.104z" />
      </svg>
    ),
  },
  {
    name: "Raycast",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 18v-3l-3.36-3.36L0 14.28 6 20.28l2.64-2.64L6 15V18zm12-12h-3l-2.64 2.64L15 6h3L18 6zm-6.36 3.36L6 3.72 3.36 6.36l5.64 5.64 2.64-2.64zM18 6l2.64 2.64-5.64 5.64-2.64-2.64L18 6zM6 18l5.64-5.64 2.64 2.64L8.64 20.64 6 18z" />
      </svg>
    ),
  },
  {
    name: "Framer",
    icon: () => (
      <svg width="16" height="18" viewBox="0 0 16 24" fill="currentColor">
        <path d="M0 16h8v8L0 16zM0 8h8l8 8H0V8zM0 0h16v8H8L0 0z" />
      </svg>
    ),
  },
];
