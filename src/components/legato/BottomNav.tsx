import { Link, useLocation } from "@tanstack/react-router";
import { Sun, Flower2, BookOpen, Heart, ListChecks, Briefcase, FolderClosed } from "lucide-react";
import { useLegato } from "@/lib/legato-state";

export function BottomNav() {
  const { pathname } = useLocation();
  const { space } = useLegato();
  // Navigation contextuelle stricte (brief §7) :
  // - Espace psychologique : Aujourd'hui · Jardin · Journal · Ressources · Présence
  // - Espace concret       : Aujourd'hui · Mon plan · Professionnels · Documents · Proches
  // Si l'utilisateur n'a pas encore choisi d'espace, on présente la nav psy par défaut.
  const items = space === "concrete"
    ? [
        { to: "/home"      as const, label: "Aujourd'hui",     Icon: Sun,           forcedActive: pathname === "/home" || pathname === "/" },
        { to: "/plan"      as const, label: "Accueil",         Icon: Sun,           forcedActive: pathname === "/plan" || pathname === "/practical" || pathname === "/" },
        { to: "/journey"   as const, label: "Parcours",        Icon: ListChecks,    forcedActive: pathname.startsWith("/journey") },
        { to: "/resources" as const, label: "Services",        Icon: Briefcase,     forcedActive: pathname.startsWith("/resources") || pathname.startsWith("/practical") },
        { to: "/documents" as const, label: "Dossier",         Icon: FolderClosed,  forcedActive: pathname.startsWith("/documents") },
      ]
    : [
        { to: "/home"      as const, label: "Aujourd'hui",     Icon: Sun,         forcedActive: pathname === "/home" || pathname === "/" },
        { to: "/garden"    as const, label: "Jardin",          Icon: Flower2,     forcedActive: pathname.startsWith("/garden") },
        { to: "/memories"  as const, label: "Souvenirs",       Icon: BookOpen,    forcedActive: pathname.startsWith("/memories") || pathname.startsWith("/journal") },
        { to: "/presence"  as const, label: "Présence",        Icon: Heart,       forcedActive: pathname.startsWith("/presence") || pathname.startsWith("/accompany") || pathname.startsWith("/no-words") },
      ];
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 border-t border-dusk/10 bg-paper"
    >
      <div className="flex items-stretch justify-between px-7 pt-3 pb-[max(env(safe-area-inset-bottom),0.7rem)]">
        {items.map(({ to, label, Icon, forcedActive }) => {
          const active = forcedActive;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className="group flex flex-1 flex-col items-center justify-center gap-1.5 px-1 py-1.5 transition-colors"
            >
              <Icon
                size={15}
                strokeWidth={1.15}
                className={active ? "text-dusk" : "text-dusk/38 group-hover:text-dusk/70"}
              />
              <span
                className={`text-[8px] uppercase tracking-[0.16em] whitespace-nowrap leading-none ${
                  active ? "text-dusk" : "text-dusk/42"
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
