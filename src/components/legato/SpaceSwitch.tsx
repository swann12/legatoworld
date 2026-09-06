import { Link, useLocation } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

/**
 * Switch bas persistant : Soutien · Démarches, plus une entrée secondaire
 * « Alléger ». Remplace la barre de navigation à cinq entrées.
 */
export function SpaceSwitch() {
  const { pathname } = useLocation();
  const { lightMode, setLightMode } = useLegato();
  const active: "care" | "practical" = pathname.startsWith("/practical") ? "practical" : "care";

  const item = (id: "care" | "practical", to: "/care" | "/practical", label: string) => {
    const on = active === id;
    return (
      <Link
        key={id}
        to={to}
        className="flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-[12.5px] tracking-[0.02em] transition-colors"
        style={{
          background: on ? "var(--dusk)" : "transparent",
          color: on ? "var(--paper)" : "color-mix(in oklab, var(--dusk) 62%, transparent)",
          fontWeight: on ? 600 : 500,
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
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <div
        className="flex items-center gap-1 rounded-full border border-dusk/10 bg-paper/94 p-1 backdrop-blur-md"
        style={{ boxShadow: "0 14px 44px color-mix(in oklab, var(--dusk) 14%, transparent)" }}
      >
        {item("care", "/care", "Soutien")}
        {item("practical", "/practical", "Démarches")}
        <button
          type="button"
          onClick={() => setLightMode(!lightMode)}
          aria-pressed={lightMode}
          className="shrink-0 rounded-full px-3.5 py-2.5 text-[11px] tracking-[0.06em] transition-colors"
          style={{
            background: lightMode ? "var(--sun)" : "transparent",
            color: lightMode ? "var(--dusk)" : "color-mix(in oklab, var(--dusk) 45%, transparent)",
          }}
        >
          Alléger
        </button>
      </div>
    </nav>
  );
}
