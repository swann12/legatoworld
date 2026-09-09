import { Link, useLocation } from "@tanstack/react-router";

/**
 * Switch bas discret : Soutien · Démarches.
 * Traitement doux — pas de pastille contrastée, un simple repère sous le mot actif.
 * Le mode « Alléger » vit désormais dans le Profil (Préférences).
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
        className="relative flex flex-1 items-center justify-center rounded-full px-4 py-3 text-[13.5px] tracking-[0.02em] transition-colors"
        style={{
          background: on ? "var(--blush)" : "transparent",
          color: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 55%, transparent)",
          fontWeight: on ? 600 : 450,
        }}
        aria-current={on ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 px-6 pb-[max(env(safe-area-inset-bottom),0.6rem)]"
    >
      <div
        className="flex items-center gap-1 rounded-full p-1"
        style={{
          background: "color-mix(in oklab, var(--paper) 94%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid color-mix(in oklab, var(--terracotta) 22%, transparent)",
          boxShadow: "0 12px 32px color-mix(in oklab, var(--dusk) 10%, transparent)",
        }}
      >
        {item("care", "/care", "Soutien")}
        {item("practical", "/practical", "Démarches")}
      </div>
    </nav>
  );
}

