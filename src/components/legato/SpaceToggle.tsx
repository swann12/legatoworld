import { useNavigate, useLocation } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

/**
 * Bascule visuelle entre les deux espaces : Soutien (/care) et Démarches (/practical).
 * Ne s'affiche que pour les utilisateurs ayant choisi les deux besoins.
 */
export function SpaceToggle() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { primaryNeed, hydrated } = useLegato();
  if (!hydrated || primaryNeed !== "both") return null;

  const active: "care" | "practical" = pathname.startsWith("/practical") ? "practical" : "care";

  return (
    <div className="px-6 pt-5">
      <div className="grid grid-cols-2 gap-1 rounded-full border border-dusk/12 bg-[color:var(--whisper)] p-1">
        {([
          { id: "care", label: "Soutien", to: "/care" },
          { id: "practical", label: "Démarches", to: "/practical" },
        ] as const).map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => navigate({ to: t.to })}
              className={`rounded-full px-4 py-2.5 text-[12.5px] font-medium tracking-[0.02em] transition-colors ${isActive ? "bg-dusk text-paper" : "text-dusk/65 hover:text-dusk"}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}