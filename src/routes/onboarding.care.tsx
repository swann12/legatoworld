import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLegato } from "@/lib/legato-state";
import { TOTAL_STEPS, getNeeds, setNeeds, type Need } from "@/lib/onboarding-flow";
import { Lead, OptionCard, PageTitle, QuestionFooter, QuestionLayout } from "@/components/legato/ds";

export const Route = createFileRoute("/onboarding/care")({
  head: () => ({
    meta: [
      { title: "De quoi avez-vous besoin ? — Legato" },
      { name: "description", content: "Choisissez ce dont vous avez besoin en ce moment ; le reste restera accessible." },
      { property: "og:title", content: "De quoi avez-vous besoin ? — Legato" },
      { property: "og:description", content: "Plusieurs choix possibles. Le reste restera accessible." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CareStep,
});

const OPTIONS: { id: Need; label: string; hint: string }[] = [
  { id: "tenir", label: "Tenir le coup au jour le jour", hint: "Une proposition courte chaque matin" },
  { id: "demarches", label: "Faire les démarches", hint: "La liste des papiers, dans l'ordre" },
  { id: "parler", label: "Parler à quelqu'un", hint: "Présence, bénévoles, psychologues" },
  { id: "memoire", label: "Garder sa mémoire", hint: "Photos, voix, lettres" },
];

/** 009 · 4 · Vos besoins — choix multiple, même apparence que le choix unique */
function CareStep() {
  const navigate = useNavigate();
  const { hydrated } = useLegato();
  const [needs, setLocal] = useState<Need[]>([]);
  useEffect(() => { if (hydrated) { const v = getNeeds(); if (v.length) setLocal(v); } }, [hydrated]);
  const toggle = (id: Need) => setLocal((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id]));
  const goOn = () => navigate({ to: "/onboarding", search: { etape: "pret" } });

  return (
    <QuestionLayout step={4} total={TOTAL_STEPS} footer={
      <QuestionFooter cta="Continuer" ctaDisabled={needs.length === 0} onCta={() => { setNeeds(needs); goOn(); }} link="Passer cette étape" onLink={() => { setNeeds([]); goOn(); }} />
    }>
      <PageTitle size={30}>De quoi avez-vous<br /><em>besoin en ce moment ?</em></PageTitle>
      <Lead className="mt-3">Plusieurs choix possibles. Le reste restera accessible.</Lead>
      <div className="mt-6 flex flex-col gap-[10px]">
        {OPTIONS.map((o) => <OptionCard key={o.id} label={o.label} hint={o.hint} selected={needs.includes(o.id)} onClick={() => toggle(o.id)} />)}
      </div>
    </QuestionLayout>
  );
}
