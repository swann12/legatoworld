import { Link, useLocation } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

export function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useLegato();
  const items = [
    { to: "/home" as const,     label: t("nav.home") },
    { to: "/garden" as const,   label: t("nav.garden") },
    { to: "/journal" as const,  label: t("nav.journal") },
    { to: "/presence" as const, label: t("nav.presence") },
    { to: "/space" as const,    label: t("nav.space") },
  ];
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[420px] -translate-x-1/2"
    >
      <div className="ceramic organic-radius-3 grid grid-cols-5 gap-1 px-2 py-3 backdrop-blur-xl">
        {items.map((item) => {
          const active =
            item.to === "/home"
              ? pathname === "/home" || pathname === "/"
              : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex flex-col items-center gap-1.5 py-1"
            >
              <span
                className={`size-1.5 rounded-full transition-all ${
                  active ? "bg-dusk scale-100" : "bg-dusk/0 scale-50"
                }`}
              />
              <span
                className={`text-[9px] font-medium uppercase tracking-[0.18em] transition-opacity whitespace-nowrap ${
                  active ? "text-dusk opacity-100" : "text-dusk opacity-45 group-hover:opacity-80"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
