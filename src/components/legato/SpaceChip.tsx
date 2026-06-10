import { Link } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

/**
 * Chip header discret indiquant l'espace actif et permettant d'ouvrir
 * la page de choix. Toujours visible mais jamais envahissant (brief §4).
 */
export function SpaceChip() {
  const { space } = useLegato();
  const label =
    space === "concrete" ? "Organiser" :
    space === "psy"      ? "Accompagner" :
    "Choisir";
  return (
    <Link
      to="/space-choice"
      aria-label={`Espace actif : ${label}. Changer d'espace.`}
      className="inline-flex items-center gap-1.5 rounded-full border border-dusk/20 px-3 py-1.5 text-[9.5px] uppercase tracking-[0.2em] text-dusk/75 hover:bg-dusk/[0.04] hover:text-dusk transition-colors whitespace-nowrap"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className="text-dusk/45">Espace ·</span>
      <span>{label}</span>
      <span aria-hidden className="text-dusk/40">▾</span>
    </Link>
  );
}