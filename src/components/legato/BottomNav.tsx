import { Link, useLocation } from "@tanstack/react-router";
import { Sun, Flower2, BookOpen, Heart } from "lucide-react";
import { useLegato } from "@/lib/legato-state";

export function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useLegato();
  // Editorial pass: 4 onglets seulement. « Avancer » vit comme carte sur Home.
  const items = [
    { to: "/home" as const,     label: t("nav.today"),    Icon: Sun },
    { to: "/garden" as const,   label: t("nav.garden"),   Icon: Flower2 },
    { to: "/journal" as const,  label: t("nav.journal"),  Icon: BookOpen },
    { to: "/presence" as const, label: t("nav.presence"), Icon: Heart },
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
