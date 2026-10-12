import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSpaces, type SpaceKind } from "@/lib/spaces-store";
import { setActiveSpaceId } from "@/lib/active-space";
import { Field, Lead, OptionCard, PageTitle, QuestionFooter, QuestionLayout } from "@/components/legato/ds";

export const Route = createFileRoute("/space/new")({
  head: () => ({
    meta: [
      { title: "Créer un espace — Legato" },
      { name: "description", content: "Un espace par personne, avec ses propres démarches, souvenirs et rappels." },
      { property: "og:title", content: "Créer un espace — Legato" },
      { property: "og:description", content: "Créer un nouvel espace dans Legato." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewSpace,
});

const KINDS: { id: SpaceKind; label: string; hint: string }[] = [
  { id: "deuil", label: "Une personne qui est décédée", hint: "Soutien, démarches, mémoire" },
  { id: "animal", label: "Un animal qui est mort", hint: "Soutien et mémoire" },
  { id: "malade", label: "Un proche gravement malade", hint: "L'accompagner et prendre soin de vous" },
  { id: "questions", label: "Moi, pour préparer l'avenir", hint: "Comprendre, écrire mes volontés" },
];

/** 020 · Créer un espace — trois étapes */
function NewSpace() {
  const navigate = useNavigate();
  const { addSpace } = useSpaces();
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState<SpaceKind | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const create = () => {
    if (!kind) return;
    const s = addSpace({
      name: kind === "questions" ? "Questions sur la mort" : name.trim() || "Mon proche",
      kind, relation: kind === "animal" ? "animal" : null,
      deathDate: kind === "deuil" || kind === "animal" ? date || null : null,
    });
    setActiveSpaceId(s.id);
    navigate({ to: "/home" });
  };

  const top = (
    <div className="mb-6 flex h-16 items-center justify-between text-[14px]" style={{ borderBottom: "1px solid var(--sp-line-2)" }}>
      {step === 1
        ? <Link to="/space" className="flex min-h-11 items-center gap-2"><ArrowLeft className="size-4" strokeWidth={1.4} /> Vos espaces</Link>
        : <button type="button" onClick={() => setStep(step - 1)} className="flex min-h-11 items-center gap-2"><ArrowLeft className="size-4" strokeWidth={1.4} /> Retour</button>}
      <Link to="/crisis" className="flex min-h-11 items-center gap-2">Besoin d'aide <ArrowRight className="size-4" strokeWidth={1.4} /></Link>
    </div>
  );

  if (step === 1) {
    return (
      <QuestionLayout step={1} total={3} header={top} footer={<QuestionFooter cta="Continuer" ctaDisabled={!kind} onCta={() => (kind === "questions" ? create() : setStep(2))} />}>
        <PageTitle size={30}>Pour qui créez-vous<br /><em>cet espace ?</em></PageTitle>
        <Lead className="mt-3">Un espace par personne. Chacun a ses propres démarches, souvenirs et rappels.</Lead>
        <div className="mt-6 flex flex-col gap-[10px]">
          {KINDS.map((k) => <OptionCard key={k.id} label={k.label} hint={k.hint} selected={kind === k.id} onClick={() => setKind(k.id)} />)}
        </div>
      </QuestionLayout>
    );
  }
  if (step === 2) {
    return (
      <QuestionLayout step={2} total={3} header={top} footer={<QuestionFooter cta="Continuer" ctaDisabled={!name.trim()} onCta={() => (kind === "malade" ? create() : setStep(3))} />}>
        <PageTitle size={30}>Comment voulez-vous<br /><em>l'appeler ?</em></PageTitle>
        <Lead className="mt-3">Ce nom sert à vous parler de cette personne. Personne d'autre ne le verra.</Lead>
        <Field className="mt-7" label="Son prénom, ou le nom que vous lui donnez" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maman" />
      </QuestionLayout>
    );
  }
  return (
    <QuestionLayout step={3} total={3} header={top} footer={<QuestionFooter cta="Créer l'espace" onCta={create} link="Passer cette étape" onLink={() => { setDate(""); create(); }} />}>
      <PageTitle size={30}>Une date<br /><em>à retenir ?</em></PageTitle>
      <Lead className="mt-3">Legato s'en souviendra avec vous, sans rien vous imposer.</Lead>
      <Field className="mt-7" label="Date du décès · facultatif" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
    </QuestionLayout>
  );
}
