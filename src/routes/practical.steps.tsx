import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink } from "@/components/legato/ds";
import { getDeathDate } from "@/lib/onboarding-flow";

export const Route = createFileRoute("/practical/steps")({
  head: () => ({
    meta: [
      { title: "Les grandes étapes — Legato" },
      { name: "description", content: "Tout le parcours administratif après un décès, en un coup d'œil." },
      { property: "og:title", content: "Les grandes étapes — Legato" },
      { property: "og:description", content: "Tout le parcours en un coup d'œil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Steps,
});

const STEPS = [
  { title: "Les premiers jours", sub: "Déclarer le décès, organiser les obsèques", until: 7 },
  { title: "Les premières semaines", sub: "Banque, employeur, organismes", until: 45 },
  { title: "Les premiers mois", sub: "Logement, assurances, impôts", until: 150 },
  { title: "La succession", sub: "Avec le notaire, dans les six mois", until: Infinity },
];

function Steps() {
  const [here, setHere] = useState(1);
  useEffect(() => {
    const iso = getDeathDate();
    const t = iso ? new Date(iso) : null;
    if (!t || isNaN(+t)) return;
    const days = (Date.now() - +t) / 86400000;
    setHere(Math.max(0, STEPS.findIndex((s) => days < s.until)));
  }, []);

  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <PageTitle space="practical" className="pt-8">Les grandes <em>étapes.</em></PageTitle>
      <Lead space="practical" className="mt-4">Tout le parcours en un coup d'œil.</Lead>

      <ol className="mt-10">
        {STEPS.map((s, i) => {
          const past = i < here, cur = i === here, last = i === STEPS.length - 1;
          return (
            <li key={s.title} className="relative flex gap-5 pb-10 last:pb-0">
              {!last && <span aria-hidden className="absolute left-[11px] top-6 bottom-0 w-px" style={{ background: "var(--sp-line-2)" }} />}
              <span className="relative z-10 mt-1.5 grid size-6 shrink-0 place-items-center">
                {past && <span className="size-4 rounded-full" style={{ background: "var(--sp-fill)" }} />}
                {cur && <span className="grid size-6 place-items-center rounded-full" style={{ border: "1.3px solid var(--sp-fill)", background: "var(--sp-bg)" }}>
                  <span className="size-3 rounded-full" style={{ background: "var(--sp-fill)" }} /></span>}
                {!past && !cur && <span className="size-3.5 rounded-full" style={{ border: "1.3px solid var(--sp-line-2)", background: "var(--sp-bg)" }} />}
              </span>
              <div style={{ opacity: !past && !cur ? 0.7 : 1 }}>
                <p className="lg-row-title" style={{ color: !past && !cur ? "var(--sp-sub)" : "var(--sp-ink)" }}>{s.title}</p>
                <p className="lg-row-sub mt-1" style={{ color: "var(--sp-sub)" }}>{s.sub}</p>
                {cur && <p className="lg-mono mt-2" style={{ color: "var(--sp-accent)" }}>Vous êtes ici</p>}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 flex flex-col items-start gap-6">
        <PrimaryButton space="practical" to="/practical">Voir les démarches en cours</PrimaryButton>
        <TextLink space="practical" to="/practical/resources">Repères, expliqués simplement</TextLink>
      </div>
    </StandardLayout>
  );
}
