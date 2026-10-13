import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLegato } from "@/lib/legato-state";
import { TOTAL_STEPS, getPapers, setPapers, getForWhom, getAnimalBodyState, setAnimalBodyState, getCareState, setCareState, type PapersState, type CareState } from "@/lib/onboarding-flow";
import type { AnimalBodyState } from "@/lib/space-navigation";
import { Lead, OptionCard, PageTitle, QuestionFooter, QuestionLayout } from "@/components/legato/ds";

export const Route = createFileRoute("/onboarding/practical")({
  head: () => ({
    meta: [
      { title: "Où en êtes-vous avec les papiers ? — Legato" },
      { name: "description", content: "Pour ne vous montrer que ce qui reste à faire." },
      { property: "og:title", content: "Où en êtes-vous avec les papiers ? — Legato" },
      { property: "og:description", content: "Pour ne vous montrer que ce qui reste à faire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PracticalStep,
});

const OPTIONS: { id: PapersState; label: string; hint: string }[] = [
  { id: "rien", label: "Rien n'est commencé", hint: "Le décès est très récent" },
  { id: "obseques", label: "Les obsèques sont passées", hint: "Il reste la banque, les organismes" },
  { id: "presque", label: "Presque tout est fait", hint: "Il reste la succession" },
  { id: "delegue", label: "Quelqu'un s'en occupe pour moi", hint: "Les démarches resteront masquées" },
];

/** 008 · 3 · Démarches */
function PracticalStep() {
  const navigate = useNavigate();
  const { hydrated } = useLegato();
  const [choice, setChoice] = useState<PapersState | null>(null);
  const [animal, setAnimal] = useState(false);
  const [body, setBody] = useState<AnimalBodyState | null>(null);
  const [ill, setIll] = useState(false);
  const [care, setCare] = useState<CareState | null>(null);
  useEffect(() => { setAnimal(getForWhom() === "animal"); setIll(getForWhom() === "malade"); setBody(getAnimalBodyState()); setCare(getCareState()); }, []);
  useEffect(() => { if (hydrated) { const v = getPapers(); if (v) setChoice(v); } }, [hydrated]);
  const goOn = () => navigate({ to: "/onboarding/care" });

  if (ill) return <QuestionLayout step={3} total={TOTAL_STEPS} footer={<QuestionFooter cta="Continuer" ctaDisabled={!care} onCta={() => { setCareState(care); goOn(); }} link="Passer cette étape" onLink={() => { setCareState(null); goOn(); }} />}>
    <PageTitle size={30}>Où en est-elle<br /><em>aujourd'hui ?</em></PageTitle>
    <Lead className="mt-3">Pour vous proposer ce qui correspond à ce moment.</Lead>
    <div className="mt-6 flex flex-col gap-[10px]">{([
      { id: "hopital", label: "Elle est soignée, à l'hôpital ou en ville", hint: "Rendez-vous, traitements" }, { id: "maison", label: "Elle est soignée à la maison", hint: "Avec des soignants qui passent" },
      { id: "palliatif", label: "Elle est en soins palliatifs", hint: "Les soins visent son confort" }, { id: "incertain", label: "Je ne sais pas trop", hint: "On fera le point ensemble plus tard" },
    ] as { id: CareState; label: string; hint: string }[]).map(o => <OptionCard key={o.id} label={o.label} hint={o.hint} selected={care === o.id} onClick={() => setCare(o.id)} />)}</div>
  </QuestionLayout>;

  if (animal) return <QuestionLayout step={3} total={TOTAL_STEPS} footer={<QuestionFooter cta="Continuer" ctaDisabled={!body} onCta={() => { setAnimalBodyState(body); goOn(); }} link="Passer cette étape" onLink={() => { setAnimalBodyState(null); goOn(); }} />}>
    <PageTitle size={30}>Où en êtes-vous<br /><em>pour son corps ?</em></PageTitle>
    <Lead className="mt-3">Pour vous montrer seulement ce qui reste à faire.</Lead>
    <div className="mt-6 flex flex-col gap-[10px]">{([
      { id: "choisir", label: "Il est encore chez le vétérinaire", hint: "Rien n'est décidé" }, { id: "organise", label: "C'est en cours", hint: "Crémation ou enterrement organisé" },
      { id: "fait", label: "Tout est fait", hint: "Il reste peut-être quelques papiers" }, { id: "pas_maintenant", label: "Je préfère ne pas y penser", hint: "Les démarches resteront masquées" },
    ] as { id: AnimalBodyState; label: string; hint: string }[]).map(o => <OptionCard key={o.id} label={o.label} hint={o.hint} selected={body === o.id} onClick={() => setBody(o.id)} />)}</div>
  </QuestionLayout>;

  return (
    <QuestionLayout step={3} total={TOTAL_STEPS} footer={
      <QuestionFooter cta="Continuer" ctaDisabled={!choice} onCta={() => { setPapers(choice); goOn(); }} link="Passer cette étape" onLink={() => { setPapers(null); goOn(); }} />
    }>
      <PageTitle size={30}>Où en êtes-vous<br /><em>avec les papiers ?</em></PageTitle>
      <Lead className="mt-3">Pour ne vous montrer que ce qui reste à faire.</Lead>
      <div className="mt-6 flex flex-col gap-[10px]">
        {OPTIONS.map((o) => <OptionCard key={o.id} label={o.label} hint={o.hint} selected={choice === o.id} onClick={() => setChoice(o.id)} />)}
      </div>
    </QuestionLayout>
  );
}
