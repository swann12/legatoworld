import { Link } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

/** Pastille discrète, toujours disponible, pour basculer d'un espace à l'autre
 *  sans encombrer l'interface principale (brief §1, §7). */
export function SpaceSwitcher() {
  const { space, setSpace } = useLegato();
  const target = space === "concrete" ? "psy" : "concrete";
  const labelTo = target === "psy" ? "Accompagnement" : "Aide concrète";
  const destination = target === "psy" ? "/accompany" : "/practical";
  return (
    <Link
      to={destination}
      onClick={() => setSpace(target)}
      aria-label={`Changer d'espace : ${labelTo}`}
      className="rounded-full border border-dusk/15 px-3 py-1.5 text-[9.5px] uppercase tracking-[0.2em] text-dusk/60 hover:bg-dusk/[0.04] hover:text-dusk transition-colors whitespace-nowrap"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      ↔ {labelTo}
    </Link>
  );
}