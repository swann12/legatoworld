import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { loadPractical, savePractical } from "@/lib/practical-store";
import { useLegato } from "@/lib/legato-state";
import { PageHeader, IvoryCard } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/practical/ceremony")({
  head: () => ({ meta: [{ title: "Cérémonie — Legato" }] }),
  component: Ceremony,
});

const KINDS = [
  { id: "inhumation", label: "Inhumation", body: "Mise en terre. Permet un lieu de recueillement durable." },
  { id: "cremation",  label: "Crémation",  body: "Urne, dispersion, jardin du souvenir. Plus souple." },
  { id: "civile",     label: "Cérémonie civile", body: "Sans rite religieux. Mots, musiques, gestes choisis." },
  { id: "religieuse", label: "Cérémonie religieuse", body: "Selon la tradition de la personne." },
  { id: "intime",     label: "Hommage intime", body: "Quelques proches, dehors ou chez soi." },
];

function Ceremony() {
  const { situation, stage, lovedOneRelation, hydrated } = useLegato();
  const [kind, setKind] = useState("");
  const [venue, setVenue] = useState("");
  useEffect(() => { const s = loadPractical(); setKind(s.ceremonyKind); setVenue(s.ceremonyVenue); }, []);
  const update = (k: string, v: string) => { setKind(k); setVenue(v); savePractical({ ceremonyKind: k, ceremonyVenue: v }); };
  const hidden = hydrated && lovedOneRelation === "animal";
  const passed = hydrated && situation !== "volontes" && (stage === "obseques_passees" || stage === "demarches" || stage === "apres");
  if (hidden || passed) return <Shell livingBg={false}><div className="min-h-dvh bg-paper text-dusk p-6"><PageHeader title="CÉRÉMONIE" back="/practical" /><h1 className="mt-10 ed-page-title">Cette étape n'est pas prioritaire dans votre parcours.</h1><Link to="/care/memory" className="mt-6 inline-block mono-label">Créer un hommage symbolique →</Link></div></Shell>;

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-12">
        <PageHeader title="CÉRÉMONIE" back="/practical" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Préparer la cérémonie</p>
          <h1 className="mt-4 ed-page-title">
            Quelque chose qui <span className="italic" style={{ color: "var(--terracotta)" }}>lui ressemble.</span>
          </h1>
          <p className="mt-5 body-meta max-w-[36ch]">
            Choisissez un cadre, puis affinez chaque élément. Vous pouvez aussi laisser Legato proposer une première version.
          </p>
        </section>

        <section className="px-5 space-y-2.5">
          {KINDS.map((k) => {
            const active = kind === k.id;
            return (
              <button
                key={k.id}
                onClick={() => update(k.id, venue)}
                className={`w-full text-left rounded-[14px] border p-5 transition-colors ${
                  active
                    ? "border-dusk/30 bg-clay"
                    : "border-dusk/12 bg-paper hover:bg-clay/40"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <p className="font-serif text-[18px] text-dusk">{k.label}</p>
                  {active && <span className="mono-label">Choisi</span>}
                </div>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-dusk/65">{k.body}</p>
              </button>
            );
          })}
        </section>

        <section className="px-5 mt-6">
          <IvoryCard className="p-5">
            <p className="mono-label">Lieu pressenti</p>
            <input
              value={venue}
              onChange={(e) => update(kind, e.target.value)}
              placeholder="Une église, un jardin, la maison, ailleurs…"
              className="mt-3 w-full bg-transparent outline-none border-b border-dusk/15 pb-2 font-serif text-[16px] text-dusk placeholder:text-dusk/30"
            />
          </IvoryCard>
        </section>

        <section className="px-5 mt-6 space-y-2.5">
          <Link to="/practical/atmosphere" className="block rounded-[14px] border border-dusk/10 bg-paper p-5 flex items-baseline justify-between hover:bg-dusk/[0.02] transition-colors">
            <span className="font-serif text-[16px] text-dusk">Composer l'atmosphère</span>
            <span className="text-dusk/45">→</span>
          </Link>
          <Link to="/practical/booklet" className="block rounded-[14px] border border-dusk/10 bg-paper p-5 flex items-baseline justify-between hover:bg-dusk/[0.02] transition-colors">
            <span className="font-serif text-[16px] text-dusk">Préparer un livret de cérémonie</span>
            <span className="text-dusk/45">→</span>
          </Link>
        </section>

        <section className="px-5 mt-10">
          <button
            className="w-full rounded-[14px] py-4"
            style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
          >
            <span className="font-serif text-[18px]">Me proposer une première version</span>
          </button>
          <p className="mt-3 text-center text-[12px] text-dusk/55">
            Vous pourrez tout modifier ensuite.
          </p>
        </section>
      </div>
      <ConfideDock step="cérémonie" />
    </Shell>
  );
}
