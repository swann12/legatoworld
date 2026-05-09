import { Link, useLocation } from "@tanstack/react-router";
import { Home, Flower2, BookOpen, Heart } from "lucide-react";
import { useLegato } from "@/lib/legato-state";

export function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useLegato();
  const items = [
    { to: "/home" as const,     label: t("nav.home"),     Icon: Home },
    { to: "/garden" as const,   label: t("nav.garden"),   Icon: Flower2 },
    { to: "/journal" as const,  label: t("nav.journal"),  Icon: BookOpen },
    { to: "/presence" as const, label: t("nav.presence"), Icon: Heart },
  ];
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2"
    >
      <div className="ceramic organic-radius-3 flex items-stretch justify-between gap-1 px-2.5 py-2 backdrop-blur-xl">
        {items.map(({ to, label, Icon }) => {
          const active =
            to === "/home"
              ? pathname === "/home" || pathname === "/"
              : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={`group flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-1.5 transition-all ${
                active ? "bg-dusk/8" : "hover:bg-dusk/4"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={1.6}
                className={active ? "text-dusk" : "text-dusk/60 group-hover:text-dusk/85"}
              />
              <span
                className={`text-[9px] uppercase tracking-[0.18em] whitespace-nowrap leading-none ${
                  active ? "text-dusk" : "text-dusk/55"
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
