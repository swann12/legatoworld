import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { Halos } from "@/components/legato/Halos";
import { useLegato } from "@/lib/legato-state";
import { loadPractical, savePractical } from "@/lib/practical-store";

export const Route = createFileRoute("/practical/steps")({
  head: () => ({ meta: [{ title: "Démarches — Legato" }] }),
  component: Steps,
});

const STEPS = [
  { id: "constat", phase: "Heures qui suivent", title: "Faire constater le décès", body: "Un médecin signe le certificat. Si à domicile, appelez le médecin traitant ou le 15." },
  { id: "mairie",  phase: "Premières 24h",      title: "Déclaration en mairie",     body: "Dans les 24 heures (samedi et jours fériés exclus). Apportez le certificat médical et une pièce d'identité." },
  { id: "pf",      phase: "Premières 48h",      title: "Choisir des pompes funèbres", body: "Comparez deux ou trois devis si possible. Vous pouvez aussi vous faire accompagner." },
  { id: "employeur", phase: "Quand vous pouvez", title: "Prévenir l'employeur, l'école", body: "Un mot court suffit. Nous pouvons vous aider à l'écrire." },
  { id: "banque", phase: "Cette semaine",       title: "Banque, mutuelle, caisse de retraite", body: "Un coup de fil ou un courrier simple. Pas tout d'un coup." },
  { id: "courrier", phase: "Le mois suivant",   title: "Faire suivre le courrier", body: "La poste propose une réexpédition simple, à votre rythme." },
  { id: "abonnements", phase: "Le mois suivant", title: "Abonnements, contrats", body: "Téléphone, énergie, presse. Un par jour, pas plus." },
];

function Steps() {
  const { mode } = useLegato();
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => { setDone(loadPractical().steps); }, []);
  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    savePractical({ steps: next });
  };

  return (
    <Shell hideNav>
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/practical" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Aides concrètes</Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Démarches</span>
          </div>
          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Premiers jours</p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.08] font-light text-dusk text-balance">
              Une chose à la fois.<br/><span className="italic">Cochez quand c'est fait.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
              Rien n'est urgent à la seconde près. Si vous bloquez sur une étape, parlez-en à Lovely.
            </p>
          </header>

          <ol className="px-5 mt-8 space-y-3">
            {STEPS.map((s) => {
              const checked = !!done[s.id];
              return (
                <li key={s.id}>
                  <button
                    onClick={() => toggle(s.id)}
                    className={`w-full text-left paper-card p-5 flex gap-4 items-start ${checked ? "opacity-60" : ""}`}
                  >
                    <span className={`mt-1 w-5 h-5 rounded-full border ${checked ? "bg-sage border-sage" : "border-dusk/30"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{s.phase}</p>
                      <h3 className={`mt-1 font-serif text-[17px] italic text-dusk ${checked ? "line-through decoration-dusk/30" : ""}`}>{s.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-dusk/65">{s.body}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      </Shell>
  );
}
