import { Link, useLocation } from "@tanstack/react-router";

/**
 * Switch bas : Soutien · Démarches.
 * Traitement japonisant — bande papier, filet fin, repère discret sous le mot actif.
 */
export function SpaceSwitch() {
  const { pathname } = useLocation();
  const active: "care" | "practical" = pathname.startsWith("/practical") ? "practical" : "care";

  const item = (id: "care" | "practical", to: "/care" | "/practical", label: string) => {
    const on = active === id;
    return (
      <Link
        key={id}
        to={to}
        className="relative flex flex-1 flex-col items-center justify-center px-4 py-3 text-[13px] tracking-[0.06em] transition-colors"
        style={{
          color: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 45%, transparent)",
          fontWeight: on ? 600 : 450,
        }}
        aria-current={on ? "page" : undefined}
      >
        {label}
        <span
          aria-hidden
          className="mt-1.5 block h-px w-6 transition-opacity"
          style={{
            background: "var(--terracotta)",
            opacity: on ? 1 : 0,
          }}
        />
      </Link>
    );
  };

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 px-5 pb-[max(env(safe-area-inset-bottom),0.5rem)]"
    >
      <div
        className="flex items-center rounded-[20px]"
        style={{
          background: "color-mix(in oklab, var(--paper) 92%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid color-mix(in oklab, var(--dusk) 12%, transparent)",
          boxShadow: "0 10px 30px color-mix(in oklab, var(--dusk) 8%, transparent)",
        }}
      >
        {item("care", "/care", "Soutien")}
        <span aria-hidden className="h-6 w-px" style={{ background: "color-mix(in oklab, var(--dusk) 12%, transparent)" }} />
        {item("practical", "/practical", "Démarches")}
      </div>
    </nav>
  );
}
