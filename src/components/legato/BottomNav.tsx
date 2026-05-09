import { Link, useLocation } from "@tanstack/react-router";
import { Home, Flower2, BookOpen, Heart, Moon } from "lucide-react";
import { useLegato } from "@/lib/legato-state";

export function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useLegato();
  const items = [
    { to: "/home" as const,     label: t("nav.home"),     Icon: Home },
    { to: "/garden" as const,   label: t("nav.garden"),   Icon: Flower2 },
    { to: "/journal" as const,  label: t("nav.journal"),  Icon: BookOpen },
    { to: "/presence" as const, label: t("nav.presence"), Icon: Heart },
    { to: "/space" as const,    label: t("nav.space"),    Icon: Moon },
  ];
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2"
    >
      <div className="ceramic organic-radius-3 flex items-center justify-between px-3 py-2.5 backdrop-blur-xl">
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
              className={`group flex items-center gap-2 rounded-full transition-all ${
                active
                  ? "bg-dusk/8 px-3 py-2"
                  : "px-2 py-2 hover:bg-dusk/4"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={1.6}
                className={active ? "text-dusk" : "text-dusk/55 group-hover:text-dusk/80"}
              />
              {active && (
                <span className="font-serif italic text-[13px] text-dusk whitespace-nowrap">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
