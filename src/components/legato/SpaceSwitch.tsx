import { Link, useLocation } from "@tanstack/react-router";

/**
 * Switch bas : Soutien · Démarches.
 * Traitement doux — bande papier sans contour dur, repère terracotta
 * qui glisse sous le mot actif. Aucun aplat plein, aucune ombre marquée.
 */
export function SpaceSwitch() {
  const { pathname } = useLocation();
  const practical = pathname.startsWith("/practical");

  const item = (on: boolean, to: "/care" | "/practical", label: string) => (
    <Link
      to={to}
      className="relative flex flex-1 items-center justify-center px-4 py-3.5 text-[13px] tracking-[0.05em] transition-colors duration-300"
      style={{
        color: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 38%, transparent)",
        fontWeight: on ? 600 : 450,
      }}
      aria-current={on ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 px-6 pb-[max(env(safe-area-inset-bottom),0.6rem)]"
    >
      <div
        className="relative flex items-center rounded-full px-1"
        style={{
          background: "color-mix(in oklab, var(--whisper) 90%, transparent)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow:
            "0 0 0 1px color-mix(in oklab, var(--dusk) 6%, transparent), 0 8px 26px color-mix(in oklab, var(--dusk) 7%, transparent)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[8px] left-0 flex w-1/2 justify-center transition-transform duration-300 ease-out"
          style={{ transform: practical ? "translateX(100%)" : "translateX(0)" }}
        >
          <span className="block h-[2px] w-9 rounded-full" style={{ background: "var(--terracotta)", opacity: 0.85 }} />
        </span>

        {item(!practical, "/care", "Soutien")}
        {item(practical, "/practical", "Démarches")}
      </div>
    </nav>
  );
}
