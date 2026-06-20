import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { loadPractical, savePractical } from "@/lib/practical-store";
import { PageHeader, IvoryCard, SectionLabel } from "@/components/legato/EditorialUI";

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
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => { setDone(loadPractical().steps); }, []);
  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    savePractical({ steps: next });
  };

  return (
    <Shell hideNav>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="DÉMARCHES" back="/practical" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Premiers jours</p>
          <h1 className="mt-3 ed-page-title">
            Une chose à la fois.<br/><span className="italic">Cochez quand c'est fait.</span>
          </h1>
          <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
            Rien n'est urgent à la seconde près. Si vous bloquez sur une étape, parlez-en à Lovely.
          </p>
        </section>

        <SectionLabel>Checklist</SectionLabel>

        <ol className="px-5 space-y-3">
          {STEPS.map((s) => {
            const checked = !!done[s.id];
            return (
              <li key={s.id}>
                <IvoryCard className={`p-5 flex gap-4 items-start transition-opacity ${checked ? "opacity-60" : ""}`}>
                  <button
                    onClick={() => toggle(s.id)}
                    className={`mt-1 w-5 h-5 rounded-full border shrink-0 ${checked ? "bg-sage border-sage" : "border-dusk/30"}`}
                    aria-label={checked ? "Décocher" : "Cocher"}
                  />
                  <div className="flex-1 min-w-0 text-left" onClick={() => toggle(s.id)}>
                    <p className="mono-label">{s.phase}</p>
                    <h3 className={`mt-1 font-serif text-[17px] text-dusk ${checked ? "line-through decoration-dusk/30" : ""}`}>{s.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-dusk/65">{s.body}</p>
                  </div>
                </IvoryCard>
              </li>
            );
          })}
        </ol>
      </div>
      <ConfideDock step="démarches" />
    </Shell>
  );
}
