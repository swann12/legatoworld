import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  EMOTIONS,
  RELATIONS,
  SITUATIONS,
  STAGES_BY_SITUATION,
  useLegato,
  type Emotion,
  type PrimaryNeed,
  type Relation,
  type Situation,
  type Stage,
} from "@/lib/legato-state";
import { IvoryCard } from "@/components/legato/EditorialUI";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useServerFn } from "@tanstack/react-start";
import { recordEmotion } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";
import { useState, type ReactNode } from "react";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({
    meta: [
      { title: "Commencer — Legato" },
      { name: "description", content: "Un parcours clair et conditionnel pour adapter Legato à votre situation." },
    ],
  }),
  component: Onboarding,
});

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

function Onboarding() {
  const {
    name, setName, setCareOnboarded, setPracticalOnboarded,
    situation, setSituation,
    lovedOneName, setLovedOneName, lovedOther, setLovedOther,
    lovedOneRelation, setLovedOneRelation,
    stage, setStage,
    primaryNeed, setPrimaryNeed,
    currentEmotions, setCurrentEmotions,
    legallyInvolved, setLegallyInvolved,
  } = useLegato();
  const navigate = useNavigate();
  const record = useServerFn(recordEmotion);
  const [step, setStep] = useState<Step>(1);

  const needsPerson = Boolean(situation && ["perdu", "peur", "accompagner"].includes(situation));
  const needsLabel = Boolean(situation && !["questionnement", "volontes"].includes(situation));
  const stageOptions = situation ? STAGES_BY_SITUATION[situation] : [];
  const needsEmotion = primaryNeed === "emotional" || primaryNeed === "both";
  const needsLegalQuestion = (lovedOneRelation === "ami" || lovedOneRelation === "collegue" || lovedOneRelation === "autre") && (primaryNeed === "practical" || primaryNeed === "both");

  const finish = async () => {
    setCareOnboarded(true);
    setPracticalOnboarded(true);
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      record({ data: { source: "onboarding", tags: ["accueil", situation ?? "inconnu"], note: `Prénom : ${name}` } }).catch(() => {});
    }
    navigate({ to: "/home" });
  };

  const afterSituation = () => {
    if (!situation) return;
    if (situation === "questionnement" || situation === "volontes") setStep(5);
    else setStep(3);
  };

  const afterStage = () => {
    if (situation === "questionnement") {
      setPrimaryNeed("emotional");
      setStep(7);
      return;
    }
    if (situation === "volontes") {
      setPrimaryNeed("practical");
      finish();
      return;
    }
    if (lovedOneRelation === "animal" && situation !== "perdu") {
      setPrimaryNeed("emotional");
      setStep(7);
      return;
    }
    setStep(6);
  };

  const afterNeed = () => {
    if (needsLegalQuestion) {
      setStep(8);
      return;
    }
    if (needsEmotion) setStep(7);
    else finish();
  };

  const afterLegal = () => {
    if (needsEmotion) setStep(7);
    else finish();
  };

  const toggleEmotion = (id: Emotion) => {
    setCurrentEmotions(currentEmotions.includes(id) ? currentEmotions.filter((e) => e !== id) : [...currentEmotions, id]);
  };

  if (step === 1) {
    return (
      <Frame onBack={() => navigate({ to: "/start" })} progress="1 / 7">
        <p className="mono-label">Pour commencer</p>
        <h1 className="mt-5 ed-page-title">Comment souhaitez-vous que Legato <span className="italic" style={{ color: "var(--terracotta)" }}>vous appelle&nbsp;?</span></h1>
        <IvoryCard className="mt-8 px-5 py-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre prénom" className="w-full bg-transparent font-serif text-[24px] italic text-dusk placeholder:text-dusk/30 outline-none" autoFocus />
        </IvoryCard>
        <PrimaryBtn disabled={!name.trim()} onClick={() => setStep(2)}>Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  if (step === 2) {
    return (
      <Frame onBack={() => setStep(1)} progress="2 / 7">
        <p className="mono-label">Situation</p>
        <h1 className="mt-5 ed-page-title">Pourquoi venez-vous sur <span className="italic" style={{ color: "var(--terracotta)" }}>Legato</span> aujourd'hui&nbsp;?</h1>
        <div className="mt-8 flex flex-col gap-3">
          {SITUATIONS.map((s) => (
            <button key={s.id} onClick={() => { setSituation(s.id); setStage(null); setPrimaryNeed(null); }} className={`text-left rounded-[16px] border px-5 py-4 transition-colors ${situation === s.id ? "border-dusk/40 bg-[color:var(--whisper)]" : "border-dusk/12 bg-paper hover:border-dusk/25"}`}>
              <p className="font-serif text-[18px] leading-[1.2] text-dusk">{s.label}</p>
            </button>
          ))}
        </div>
        <PrimaryBtn disabled={!situation} onClick={afterSituation}>Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  if (step === 3) {
    const title = situation === "perdu" ? "Qui avez-vous perdu&nbsp;?" : situation === "peur" ? "De qui avez-vous peur de perdre la présence&nbsp;?" : "Qui accompagnez-vous&nbsp;?";
    return (
      <Frame onBack={() => setStep(2)} progress="3 / 7">
        <p className="mono-label">Personne concernée</p>
        <h1 className="mt-5 ed-page-title" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="mt-8">
          <ChipGrid options={RELATIONS.map((r) => ({ id: r.id, label: r.label }))} value={lovedOneRelation} onChange={(v) => setLovedOneRelation(v as Relation)} />
        </div>
        {lovedOneRelation === "autre" && (
          <IvoryCard className="mt-5 px-4 py-3">
            <input value={lovedOther} onChange={(e) => setLovedOther(e.target.value)} placeholder="Précisez qui, si vous le souhaitez" className="w-full bg-transparent text-[14px] text-dusk placeholder:text-dusk/35 outline-none" />
          </IvoryCard>
        )}
        <PrimaryBtn disabled={needsPerson && !lovedOneRelation} onClick={() => setStep(4)}>Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  if (step === 4) {
    return (
      <Frame onBack={() => (needsPerson ? setStep(3) : setStep(2))} progress="4 / 7">
        <p className="mono-label">Nom ou lien</p>
        <h1 className="mt-5 ed-page-title">Quel prénom ou quel lien voulez-vous utiliser dans <span className="italic" style={{ color: "var(--terracotta)" }}>Legato&nbsp;?</span></h1>
        <IvoryCard className="mt-8 px-5 py-4">
          <input value={lovedOneName} onChange={(e) => setLovedOneName(e.target.value)} placeholder={placeholderFor(lovedOneRelation)} className="w-full bg-transparent font-serif text-[22px] italic text-dusk placeholder:text-dusk/30 outline-none" />
        </IvoryCard>
        <PrimaryBtn disabled={false} onClick={() => setStep(5)}>Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  if (step === 5) {
    return (
      <Frame onBack={() => (needsLabel ? setStep(4) : setStep(2))} progress="5 / 7">
        <p className="mono-label">Stade du parcours</p>
        <h1 className="mt-5 ed-page-title">{stageQuestion(situation)}</h1>
        <div className="mt-8">
          <ChipGrid options={stageOptions.map((s) => ({ id: s.id, label: s.label }))} value={stage} onChange={(v) => setStage(v as Stage)} />
        </div>
        <PrimaryBtn disabled={!stage} onClick={afterStage}>Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  if (step === 6) {
    return (
      <Frame onBack={() => setStep(5)} progress="6 / 7">
        <p className="mono-label">Besoin principal</p>
        <h1 className="mt-5 ed-page-title">De quoi avez-vous besoin en priorité <span className="italic" style={{ color: "var(--terracotta)" }}>maintenant&nbsp;?</span></h1>
        <div className="mt-8">
          <ChipGrid
            options={[
              { id: "emotional", label: "Être soutenu·e émotionnellement" },
              { id: "practical", label: "Avancer dans les démarches concrètes" },
              { id: "both", label: "Les deux, mais séparément" },
            ]}
            value={primaryNeed}
            onChange={(v) => setPrimaryNeed(v as PrimaryNeed)}
          />
        </div>
        <PrimaryBtn disabled={!primaryNeed} onClick={afterNeed}>Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  if (step === 8) {
    return (
      <Frame onBack={() => setStep(6)} progress="6 bis / 7">
        <p className="mono-label">Responsabilité</p>
        <h1 className="mt-5 ed-page-title">Êtes-vous responsable légalement, ou aidez-vous la famille pour les démarches&nbsp;?</h1>
        <div className="mt-8 flex flex-col gap-3">
          <button onClick={() => setLegallyInvolved(true)} className={`text-left rounded-[16px] border px-5 py-4 ${legallyInvolved ? "border-dusk/40 bg-[color:var(--whisper)]" : "border-dusk/12 bg-paper"}`}><p className="font-serif text-[18px]">Oui, je suis impliqué·e</p></button>
          <button onClick={() => setLegallyInvolved(false)} className={`text-left rounded-[16px] border px-5 py-4 ${!legallyInvolved ? "border-dusk/40 bg-[color:var(--whisper)]" : "border-dusk/12 bg-paper"}`}><p className="font-serif text-[18px]">Non, pas directement</p></button>
        </div>
        <PrimaryBtn onClick={afterLegal}>Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  return (
    <Frame onBack={() => (needsLegalQuestion ? setStep(8) : setStep(6))} progress="7 / 7">
      <p className="mono-label">Check-in émotionnel</p>
      <h1 className="mt-5 ed-page-title">Comment vous sentez-vous <span className="italic" style={{ color: "var(--terracotta)" }}>maintenant&nbsp;?</span></h1>
      <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">Plusieurs choix possibles. Vos émotions adaptent uniquement l'espace Soutien.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {EMOTIONS.map((e) => (
          <button key={e.id} onClick={() => toggleEmotion(e.id)} className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${currentEmotions.includes(e.id) ? "border-dusk/40 bg-[color:var(--whisper)]" : "border-dusk/15 bg-paper text-dusk/70 hover:border-dusk/25"}`}>
            {e.label}
          </button>
        ))}
      </div>
      <PrimaryBtn onClick={finish}>Entrer dans Legato →</PrimaryBtn>
      <button onClick={finish} className="mt-3 block w-full text-center mono-label text-dusk/55">Passer cette étape</button>
    </Frame>
  );
}

function Frame({ children, onBack, progress }: { children: ReactNode; onBack: () => void; progress: string }) {
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-6 pt-10 flex items-center justify-between">
          <button onClick={onBack} className="mono-label hover:text-dusk">← Retour</button>
          <LegatoMark to="/space" size={20} />
          <span className="mono-label text-dusk/45">{progress}</span>
        </header>
        <div className="relative z-10 flex flex-1 flex-col px-6 pt-10 pb-16">{children}</div>
      </div>
    </main>
  );
}

function PrimaryBtn({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-8 block w-full rounded-[999px] px-6 py-5 text-center disabled:opacity-40 transition-transform active:scale-[0.99]"
      style={{ background: "var(--terracotta)", color: "var(--paper)" }}
    >
      <span className="font-serif text-[20px]">{children}</span>
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-8">
      <p className="mono-label text-dusk/65">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ChipGrid<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${active ? "border-dusk/40 bg-[color:var(--whisper)] text-dusk" : "border-dusk/15 bg-paper text-dusk/70 hover:border-dusk/25"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function placeholderFor(relation: Relation | null) {
  switch (relation) {
    case "animal": return "mon chien Oslo";
    case "ami": return "mon amie Léa";
    case "pere": return "mon père";
    case "mere": return "ma mère";
    case "frere_soeur": return "ma sœur";
    default: return "Marie";
  }
}

function stageQuestion(situation: Situation | null) {
  switch (situation) {
    case "peur": return "Où en est la situation ?";
    case "accompagner": return "Quel est votre rôle aujourd'hui ?";
    case "soutenir": return "Quel type d'aide voulez-vous apporter ?";
    case "questionnement": return "Qu'est-ce qui vous amène ici ?";
    case "volontes": return "Que souhaitez-vous préparer en premier ?";
    default: return "Où en êtes-vous aujourd'hui ?";
  }
}