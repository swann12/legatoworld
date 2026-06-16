import { Link, useLocation } from "@tanstack/react-router";

/**
 * Refonte Co-Star : une seule navigation, 5 entrées max.
 * Accueil · Ressentir · Démarches · Cercle · Ressources
 */
type Item = {
  to: "/home" | "/journal" | "/practical" | "/community" | "/resources";
  label: string;
  search?: { space: "care" | "practical" };
  match: (p: string) => boolean;
};

const ITEMS: Item[] = [
  { to: "/home",      label: "Accueil",    match: (p) => p === "/home" || p === "/" },
  { to: "/journal",   label: "Ressentir",  match: (p) => p.startsWith("/journal") || p.startsWith("/garden") || p.startsWith("/presence") || p.startsWith("/no-words") || p.startsWith("/memories") || p.startsWith("/help") },
  { to: "/practical", label: "Démarches",  match: (p) => p.startsWith("/practical") || p.startsWith("/parcours") || p.startsWith("/wishes") || p.startsWith("/appointments") || p.startsWith("/dates") },
  { to: "/community", label: "Cercle",     match: (p) => p.startsWith("/community") },
  { to: "/resources", label: "Ressources", search: { space: "care" }, match: (p) => p.startsWith("/resources") || p.startsWith("/library") || p.startsWith("/inspiration") },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 border-t border-dusk/10 bg-paper/95 backdrop-blur-md"
    >
      <div className="flex items-stretch justify-between px-2 pt-3 pb-[max(env(safe-area-inset-bottom),0.55rem)]">
        {ITEMS.map(({ to, label, match, search }) => {
          const active = match(pathname);
          return (
            <Link
              key={to}
              to={to}
              search={search as { space: "care" } | undefined}
              aria-label={label}
              className="group relative flex flex-1 flex-col items-center justify-center gap-1.5 px-1 py-1.5"
            >
              <span
                aria-hidden
                className="h-[3px] w-6 rounded-full transition-colors"
                style={{ background: active ? "var(--terracotta)" : "transparent" }}
              />
              <span
                className={`text-[11px] font-medium tracking-[0.02em] transition-colors ${
                  active ? "text-dusk" : "text-dusk/50 group-hover:text-dusk/80"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
