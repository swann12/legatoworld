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
      className="relative flex flex-1 flex-col items-center gap-2 py-3 text-[12.5px] tracking-[0.06em] transition-colors duration-300"
      style={{
        color: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 42%, transparent)",
      }}
      aria-current={on ? "page" : undefined}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className="block h-px w-8 transition-opacity duration-300"
        style={{ background: "var(--terracotta)", opacity: on ? 1 : 0 }}
      />
    </Link>
  );

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2"
    >
      <div
        className="flex items-stretch px-8 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1"
        style={{
          background: "color-mix(in oklab, var(--paper) 94%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid color-mix(in oklab, var(--dusk) 9%, transparent)",
        }}
      >
        {item(!practical, "/care", "Soutien")}
        <span aria-hidden className="my-3 w-px" style={{ background: "color-mix(in oklab, var(--dusk) 10%, transparent)" }} />
        {item(practical, "/practical", "Démarches")}
      </div>
    </nav>
  );
}

