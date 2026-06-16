import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LegatoMark } from "@/components/legato/LegatoMark";

/**
 * En-tête commun à toutes les pages internes.
 * - Logo Legato à gauche
 * - Chip "Espace · …" à droite, ouvre une feuille minimale à 2 choix
 *   pour basculer entre l'espace émotionnel et l'espace concret.
 */
export function SpaceHeader({
  space,
}: {
  space: "care" | "organize";
}) {
  const [open, setOpen] = useState(false);
  const label = space === "care" ? "Soi" : "Démarches";

  return (
    <header className="relative pt-9 px-7 flex items-center justify-between">
      <LegatoMark to="/space" size={22} />
      <button
        onClick={() => setOpen(true)}
        className="editorial-chip flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-dusk/72 hover:bg-dusk/5"
        style={{ fontFamily: "var(--font-mono)" }}
        aria-label="Changer d'espace"
      >
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ background: space === "care" ? "var(--terracotta)" : "var(--bordeaux)" }}
        />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-dusk/30"
          />
          <div className="relative w-full max-w-[420px] bg-paper rounded-t-[22px] p-6 pb-9 border-t border-dusk/12">
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Changer d'espace
            </p>
            <h3 className="mt-2 font-serif text-[24px] leading-tight font-normal text-dusk">
              Choisir un <span className="italic" style={{ color: "var(--terracotta)" }}>rythme</span>.
            </h3>
            <div className="mt-5 space-y-2.5">
              <Link
                to="/home"
                onClick={() => setOpen(false)}
                className="block rounded-[16px] px-5 py-4"
                style={{ background: "var(--terracotta)", color: "var(--paper)" }}
              >
                <p className="font-serif text-[18px]">Prendre soin de soi</p>
                <p className="text-[12.5px] opacity-80 mt-0.5">Parler, écrire, jardin, respirer.</p>
              </Link>
              <Link
                to="/practical"
                onClick={() => setOpen(false)}
                className="block rounded-[16px] px-5 py-4"
                style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
              >
                <p className="font-serif text-[18px]">Organiser & avancer</p>
                <p className="text-[12.5px] opacity-80 mt-0.5">Démarches, cérémonie, dossier.</p>
              </Link>
            </div>
            <p className="mt-5 text-center text-[11.5px] text-dusk/55">
              Votre progression est mémorisée dans les deux espaces.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}