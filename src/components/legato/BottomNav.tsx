import { Link, useLocation } from "@tanstack/react-router";

export function BottomNav() {
  const { pathname } = useLocation();

  // Deux navigations distinctes — l'espace est déterminé par l'URL.
  const inPractical =
    pathname.startsWith("/practical") ||
    pathname.startsWith("/parcours") ||
    pathname.startsWith("/resources") ||
    pathname.startsWith("/wishes") ||
    pathname.startsWith("/dossier");

  type Item = {
    to: "/practical" | "/parcours" | "/resources" | "/wishes" | "/home" | "/garden" | "/journal" | "/presence";
    label: string;
    search?: { space: "care" | "practical" };
  };
  const items: Item[] = inPractical
    ? [
        { to: "/practical", label: "Accueil" },
        { to: "/parcours",  label: "Parcours" },
        { to: "/resources", label: "Services", search: { space: "practical" } },
        { to: "/wishes",    label: "Volontés" },
      ]
    : [
        { to: "/home",     label: "Accueil" },
        { to: "/garden",   label: "Jardin" },
        { to: "/journal",  label: "Journal" },
        { to: "/presence", label: "Présence" },
      ];
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 border-t border-dusk/10 bg-paper/96 backdrop-blur-sm"
    >
      <div className="flex items-stretch justify-between px-3 pt-3.5 pb-[max(env(safe-area-inset-bottom),0.65rem)]">
        {items.map(({ to, label }) => {
          const active =
            to === "/home"
              ? pathname === "/home" || pathname === "/"
              : to === "/practical"
              ? pathname === "/practical"
              : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              search={items.find((i) => i.to === to)?.search as { space: "practical" } | undefined}
              aria-label={label}
              className="group relative flex flex-1 items-center justify-center px-1 py-2 transition-colors"
            >
              <span
                className={`text-[9px] uppercase leading-none tracking-[0.22em] text-center transition-colors ${
                  active ? "text-dusk" : "text-dusk/50 group-hover:text-dusk/80"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {label}
              </span>
              {active && (
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-1/2 h-px w-6 -translate-x-1/2 bg-dusk/70"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
