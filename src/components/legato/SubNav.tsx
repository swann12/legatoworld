import { Link, useLocation } from "@tanstack/react-router";

export type SubNavItem = {
  to: string;
  label: string;
  exact?: boolean;
};

/**
 * Sous-navigation rendue en haut des index Soutien / Démarches.
 * Composant purement visuel : ne modifie pas l'état global.
 */
export function SubNav({ items, ariaLabel }: { items: SubNavItem[]; ariaLabel: string }) {
  const { pathname } = useLocation();
  return (
    <nav aria-label={ariaLabel} className="px-5 pt-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to as "/care"}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] tracking-[0.02em] transition-colors ${active ? "border-dusk/40 bg-[color:var(--whisper)] text-dusk" : "border-dusk/15 bg-paper text-dusk/60 hover:border-dusk/30"}`}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export const CARE_SUBNAV: SubNavItem[] = [
  { to: "/care", label: "Aujourd'hui", exact: true },
  { to: "/care/emotions", label: "Émotions" },
  { to: "/care/journal", label: "Journal" },
  { to: "/care/garden", label: "Jardin" },
  { to: "/presence", label: "Présence" },
  { to: "/care/rituels", label: "Rituels" },
];

export const PRACTICAL_SUBNAV: SubNavItem[] = [
  { to: "/practical", label: "Aujourd'hui", exact: true },
  { to: "/practical/tasks", label: "Tâches" },
  { to: "/practical/vault", label: "Documents" },
  { to: "/practical/ceremony", label: "Cérémonie" },
  { to: "/practical/pros", label: "Pros" },
];