import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/profile/proches")({
  head: () => ({ meta: [{ title: "Les êtres aimés — Legato" }] }),
  component: Proches,
});

const RELATION_LABEL: Record<string, string> = {
  pere: "Père", mere: "Mère", conjoint: "Conjoint·e", enfant: "Enfant",
  frere_soeur: "Frère ou sœur", grand_parent: "Grand-parent",
  ami: "Ami·e", collegue: "Collègue", animal: "Animal", autre: "Autre",
};

function Proches() {
  const { lovedOneRelation, hydrated } = useLegato();
  const lovedName = useLovedName();
  const relationLabel = lovedOneRelation ? RELATION_LABEL[lovedOneRelation] : null;

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <Link to="/profile" aria-label="Retour" className="text-dusk/55 text-lg">←</Link>
          <LegatoMark to="/space" size={22} />
          <span className="w-5" />
        </header>

        <section className="px-6 pt-8">
          <p className="mono-label">Êtres aimés</p>
          <h1 className="mt-5 font-serif font-normal text-[32px] leading-[1.06]">
            Tous celles et ceux <br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>qui comptent</span>.
          </h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Une fiche par personne. Le jardin, les dates sensibles, ce qui a été déposé.
          </p>
        </section>

        <section className="px-5 pt-8">
          <div className="grid grid-cols-1 gap-3">
            {hydrated && lovedName && (
              <article className="rounded-[22px] px-5 py-5" style={{ background: "var(--blush)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mono-label text-dusk/60">{relationLabel ?? "Proche"}</p>
                    <p className="mt-2 font-serif text-[26px] italic leading-[1.05]">{lovedName}</p>
                  </div>
                  <span className="rounded-full bg-paper/70 px-3 py-1 text-[10.5px] mono-label text-dusk/70">Actif</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link to="/care/garden" className="rounded-[14px] bg-paper/70 px-4 py-3">
                    <p className="mono-label text-dusk/55">Jardin</p>
                    <p className="mt-1 text-[13px]">Photos, voix, lettres</p>
                  </Link>
                  <Link to="/care/dates" className="rounded-[14px] bg-paper/70 px-4 py-3">
                    <p className="mono-label text-dusk/55">Dates</p>
                    <p className="mt-1 text-[13px]">Anniversaire, départ</p>
                  </Link>
                </div>
              </article>
            )}

            {/* Placeholder for future archived loved ones */}
            <div className="rounded-[18px] border border-dashed border-dusk/20 bg-[color:var(--whisper)] px-5 py-6 text-center">
              <p className="mono-label text-dusk/55">Bientôt</p>
              <p className="mt-2 text-[13px] text-dusk/65 max-w-[28ch] mx-auto">
                Vous pourrez ajouter d'autres proches, archiver, et retrouver chaque parcelle ici.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}