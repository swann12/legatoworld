import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, ScreenHeader, Section, NavLine } from "@/components/legato/Shell";
import { loadPractical, savePractical } from "@/lib/practical-store";

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
  const [kind, setKind] = useState("");
  const [venue, setVenue] = useState("");
  useEffect(() => { const s = loadPractical(); setKind(s.ceremonyKind); setVenue(s.ceremonyVenue); }, []);
  const update = (k: string, v: string) => { setKind(k); setVenue(v); savePractical({ ceremonyKind: k, ceremonyVenue: v }); };

  return (
    <Shell>
      <ScreenHeader
        back={{ to: "/practical", label: "Aide concrète" }}
        eyebrow="Cérémonie"
        title="Choisir un cadre, en douceur."
        subtitle="Vous pourrez tout affiner ensuite, ou changer d'avis."
      />

      <Section className="mt-10 space-y-3">
        {KINDS.map((k) => {
          const selected = kind === k.id;
          return (
            <button
              key={k.id}
              onClick={() => update(k.id, venue)}
              className={`w-full text-left surface p-5 transition-colors ${
                selected
                  ? "border-2 border-[color:var(--bordeaux-soft)] bg-[color:var(--bordeaux-wash)]"
                  : "hover:bg-dusk/[0.02]"
              }`}
            >
              <p className="font-serif text-[17px] font-light text-dusk leading-snug">{k.label}</p>
              <p className="mt-2 text-[13px] leading-[1.55] text-dusk/65">{k.body}</p>
            </button>
          );
        })}
      </Section>

      <Section className="mt-10">
        <div className="surface p-5">
          <p className="eyebrow">Lieu pressenti</p>
          <input
            value={venue}
            onChange={(e) => update(kind, e.target.value)}
            placeholder="Une église, un jardin, la maison, ailleurs…"
            className="mt-3 w-full bg-transparent outline-none border-b border-dusk/15 pb-2 text-[15px] text-dusk placeholder:text-dusk/30 focus:border-dusk/40"
          />
        </div>
      </Section>

      <Section className="mt-10 mb-10 space-y-3">
        <NavLine to="/practical/atmosphere" eyebrow="Atmosphère" title="Composer fleurs et textes" />
        <NavLine to="/practical/booklet"    eyebrow="Livret"     title="Préparer le livret de cérémonie" />
      </Section>
    </Shell>
  );
}
