import { Link, useLocation } from "@tanstack/react-router";

/** Navigation basse : deux espaces, deux aplats de la palette. */
export function SpaceSwitch() {
  const { pathname } = useLocation();
  const practical = pathname.startsWith("/practical");

  const item = (on: boolean, to: "/care" | "/practical", label: string) => (
    <Link
      to={to}
      aria-current={on ? "page" : undefined}
      className="relative z-10 flex-1 py-3 text-center text-[11.5px] uppercase tracking-[0.16em] transition-opacity duration-300"
      style={{
        fontFamily: "var(--font-mono)",
        background: "var(--blush)",
        color: "var(--bordeaux)",
        opacity: on ? 1 : 0.55,
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav
      aria-label="Navigation principale"
      className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 px-6 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <div
        className="pointer-events-auto relative flex items-stretch overflow-hidden rounded-full"
        style={{
          border: "1px solid color-mix(in oklab, var(--bordeaux) 22%, transparent)",
          boxShadow: "0 12px 30px -18px color-mix(in oklab, var(--bordeaux) 60%, transparent)",
        }}
      >
        {item(!practical, "/care", "Soutien")}
        {item(practical, "/practical", "Démarches")}
        <span
          aria-hidden
          className="absolute bottom-1.5 h-px w-10 transition-[left] duration-500"
          style={{
            background: "var(--bordeaux)",
            left: practical ? "calc(75% - 1.25rem)" : "calc(25% - 1.25rem)",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
    </nav>
  );
}

