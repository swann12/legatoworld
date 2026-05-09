import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { Halos } from "@/components/legato/Halos";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { useLegato } from "@/lib/legato-state";
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
  const { mode } = useLegato();
  const [kind, setKind] = useState("");
  const [venue, setVenue] = useState("");
  useEffect(() => { const s = loadPractical(); setKind(s.ceremonyKind); setVenue(s.ceremonyVenue); }, []);
  const update = (k: string, v: string) => { setKind(k); setVenue(v); savePractical({ ceremonyKind: k, ceremonyVenue: v }); };

  return (
    <Shell>
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/practical" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Aides concrètes</Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Cérémonie</span>
          </div>
          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Choisir un déroulé</p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.08] font-light text-dusk text-balance">
              Quelque chose qui <span className="italic">lui ressemble.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
              Choisissez un cadre. Vous pourrez tout affiner ensuite, ou changer d'avis.
            </p>
          </header>

          <div className="px-5 mt-8 space-y-3">
            {KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => update(k.id, venue)}
                className={`w-full text-left p-5 organic-radius-3 ${kind === k.id ? "ceramic" : "paper-card"}`}
              >
                <p className="font-serif italic text-[17px] text-dusk">{k.label}</p>
                <p className="mt-1.5 text-[13px] text-dusk/65">{k.body}</p>
              </button>
            ))}
          </div>

          <div className="px-5 mt-8 paper-card p-5 mx-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Lieu pressenti</p>
            <input
              value={venue}
              onChange={(e) => update(kind, e.target.value)}
              placeholder="Une église, un jardin, la maison, ailleurs…"
              className="mt-3 w-full bg-transparent outline-none border-b border-dusk/15 pb-2 font-serif italic text-[15px] text-dusk placeholder:text-dusk/30"
            />
          </div>

          <div className="px-5 mt-8 grid grid-cols-1 gap-3">
            <Link to="/practical/atmosphere" className="paper-card p-5 flex items-baseline justify-between">
              <span className="font-serif italic text-[15px] text-dusk">Composer l'atmosphère →</span>
            </Link>
            <Link to="/practical/booklet" className="paper-card p-5 flex items-baseline justify-between">
              <span className="font-serif italic text-[15px] text-dusk">Préparer un livret de cérémonie →</span>
            </Link>
          </div>
        </div>
      </div>
      <ConfideDock step="cérémonie" />
    </Shell>
  );
}
