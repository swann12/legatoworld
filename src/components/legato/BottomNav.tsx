import { Link, useLocation } from "@tanstack/react-router";
import { Home, Flower2, NotebookPen, Heart, ListChecks, Briefcase, FolderClosed } from "lucide-react";

export function BottomNav() {
  const { pathname } = useLocation();

  // Deux navigations distinctes — l'espace est déterminé par l'URL.
  const inPractical =
    pathname.startsWith("/practical") ||
    pathname.startsWith("/parcours") ||
    pathname.startsWith("/resources") ||
    pathname.startsWith("/wishes") ||
    pathname.startsWith("/dossier");

  const items = inPractical
    ? [
        { to: "/practical" as const, label: "Accueil",  Icon: Home },
        { to: "/parcours" as const,  label: "Parcours", Icon: ListChecks },
        { to: "/resources" as const, label: "Services", Icon: Briefcase },
        { to: "/wishes" as const,    label: "Dossier",  Icon: FolderClosed },
      ]
    : [
        { to: "/home" as const,     label: "Accueil",  Icon: Home },
        { to: "/garden" as const,   label: "Jardin",   Icon: Flower2 },
        { to: "/journal" as const,  label: "Journal",  Icon: NotebookPen },
        { to: "/presence" as const, label: "Présence", Icon: Heart },
      ];
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 border-t border-dusk/10 bg-paper"
    >
      <div className="flex items-stretch justify-between px-2 pt-2.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map(({ to, label, Icon }) => {
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
              aria-label={label}
              className="group flex flex-1 flex-col items-center justify-center gap-1.5 px-2 py-1.5 transition-colors"
            >
              <Icon
                size={18}
                strokeWidth={1.6}
                className={active ? "text-dusk" : "text-dusk/45 group-hover:text-dusk/75"}
              />
              <span
                className={`text-[9px] uppercase tracking-[0.22em] whitespace-nowrap leading-none ${
                  active ? "text-dusk" : "text-dusk/45"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
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
