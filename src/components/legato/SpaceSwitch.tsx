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
        className="relative flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-2 text-[12.5px] tracking-[0.03em] transition-colors"
        style={{
          color: on
            ? "var(--dusk)"
            : "color-mix(in oklab, var(--dusk) 42%, transparent)",
          fontWeight: on ? 500 : 400,
        }}
        aria-current={on ? "page" : undefined}
      >
        {label}
        <span
          aria-hidden
          className="h-[1.5px] w-6 rounded-full transition-colors"
          style={{
            background: on
              ? "color-mix(in oklab, var(--terracotta) 70%, transparent)"
              : "transparent",
          }}
        />
      </Link>
    );
  };

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 px-6 pb-[max(env(safe-area-inset-bottom),0.6rem)]"
    >
      <div
        className="flex items-center rounded-full px-2 py-1"
        style={{
          background: "color-mix(in oklab, var(--paper) 88%, transparent)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid color-mix(in oklab, var(--dusk) 7%, transparent)",
          boxShadow: "0 10px 30px color-mix(in oklab, var(--dusk) 7%, transparent)",
        }}
      >
        {item("care", "/care", "Soutien")}
        <span
          aria-hidden
          className="h-4 w-px shrink-0"
          style={{ background: "color-mix(in oklab, var(--dusk) 9%, transparent)" }}
        />
        {item("practical", "/practical", "Démarches")}
      </div>
    </nav>
  );
}
