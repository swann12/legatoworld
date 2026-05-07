import { Link, useLocation } from "@tanstack/react-router";

const items = [
  { to: "/home", label: "Accueil" },
  { to: "/garden", label: "Jardin" },
  { to: "/presence", label: "Présence" },
  { to: "/help", label: "Aide" },
  { to: "/space", label: "Espace" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-[380px] -translate-x-1/2"
    >
      <div className="ceramic organic-radius-3 flex items-center justify-around px-3 py-3 backdrop-blur-xl">
        {items.map((item) => {
          const active =
            item.to === "/home"
              ? pathname === "/home" || pathname === "/"
              : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex min-w-[64px] flex-col items-center gap-1.5 px-2 py-1"
            >
              <span
                className={`size-1.5 rounded-full transition-all ${
                  active ? "bg-dusk scale-100" : "bg-dusk/0 scale-50"
                }`}
              />
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] transition-opacity ${
                  active ? "text-dusk opacity-100" : "text-dusk opacity-40 group-hover:opacity-80"
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