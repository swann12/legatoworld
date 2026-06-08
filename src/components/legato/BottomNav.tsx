import { Link, useLocation } from "@tanstack/react-router";
import { Sun, Heart, ListChecks, User } from "lucide-react";
import { useLegato } from "@/lib/legato-state";

export function BottomNav() {
  const { pathname } = useLocation();
  const { t, lang } = useLegato();
  // Deux univers clairement dissociés : Intérieur (présence, journal, jardin, sans-mots)
  // vs Concret (démarches, cérémonie, volontés). Plus « Aujourd'hui » et « Espace ».
  const interiorActive =
    pathname.startsWith("/presence") ||
    pathname.startsWith("/journal") ||
    pathname.startsWith("/garden") ||
    pathname.startsWith("/no-words");
  const concreteActive =
    pathname.startsWith("/practical") ||
    pathname.startsWith("/wishes") ||
    pathname.startsWith("/resources");
  const items = [
    { to: "/home" as const,     label: t("nav.today"),                     Icon: Sun,        forcedActive: pathname === "/home" || pathname === "/" },
    { to: "/presence" as const, label: lang === "fr" ? "Intérieur" : "Inner", Icon: Heart,   forcedActive: interiorActive },
    { to: "/practical" as const, label: lang === "fr" ? "Concret" : "Concrete", Icon: ListChecks, forcedActive: concreteActive },
    { to: "/space" as const,    label: t("nav.space"),                     Icon: User,       forcedActive: pathname.startsWith("/space") },
  ];
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 border-t border-dusk/10 bg-paper"
    >
      <div className="flex items-stretch justify-between px-2 pt-2.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map(({ to, label, Icon, forcedActive }) => {
          const active = forcedActive;
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
