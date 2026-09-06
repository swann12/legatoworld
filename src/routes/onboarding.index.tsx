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
import { useServerFn } from "@tanstack/react-start";
import { recordEmotion } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({
    meta: [
      { title: "Commencer — Legato" },
      { name: "description", content: "Un parcours clair et conditionnel pour adapter Legato à votre situation." },
      { property: "og:title", content: "Commencer — Legato" },
      { property: "og:description", content: "Quelques questions pour adapter Legato à votre situation et à vos besoins." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
    hydrated,
  } = useLegato();
  const navigate = useNavigate();
  const record = useServerFn(recordEmotion);
  const [step, setStep] = useState<Step>(1);

  useEffect(() => {
    if (!hydrated) return;
    setName("");
    setSituation(null);
    setLovedOneName("");
    setLovedOther("");
    setLovedOneRelation(null);
    setStage(null);
    setPrimaryNeed(null);
    setCurrentEmotions([]);
    setLegallyInvolved(null);
  }, [hydrated]);

  const needsPerson = Boolean(situation && ["perdu", "peur", "accompagner"].includes(situation));
  const needsLabel = Boolean(situation && !["questionnement", "volontes"].includes(situation));
  const stageOptions = situation && situation in STAGES_BY_SITUATION ? STAGES_BY_SITUATION[situation] : [];
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
    else if (situation === "soutenir") setStep(4);
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

  const backFromEmotion = () => {
    if (needsLegalQuestion) setStep(8);
    else if (situation === "questionnement" || (lovedOneRelation === "animal" && situation !== "perdu")) setStep(5);
    else setStep(6);
  };

  // Parcours réel : on ne compte que les étapes que cette personne va voir.
  const flow: Step[] = (() => {
    const seq: Step[] = [1, 2];
    if (situation === "questionnement" || situation === "volontes") seq.push(5);
    else if (situation === "soutenir") seq.push(4, 5);
    else seq.push(3, 4, 5);
    if (situation === "volontes") return seq;
    if (situation === "questionnement" || (lovedOneRelation === "animal" && situation !== "perdu")) {
      seq.push(7);
      return seq;
    }
    seq.push(6);
    if (needsLegalQuestion) seq.push(8);
    if (needsEmotion || !primaryNeed) seq.push(7);
    return seq;
  })();
  const posOf = (s: Step) => Math.max(1, flow.indexOf(s) + 1);
  const total = flow.length;

  const toggleEmotion = (id: Emotion) => {
    setCurrentEmotions(currentEmotions.includes(id) ? currentEmotions.filter((e) => e !== id) : [...currentEmotions, id]);
  };

  if (step === 1) {
    return (
      <Frame onBack={() => navigate({ to: "/start" })} progress={posOf(1)} total={total}>
        <h1 className="onboarding-title">
          <span className="whitespace-nowrap">Comment souhaites-tu</span><br />que Legato t’appelle&nbsp;?
        </h1>
        <div className="mt-[63px]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre prénom"
            className="onboarding-field h-[45px] w-full rounded-[7px] border border-dusk/15 bg-transparent px-[26px] font-sans text-[12px] text-dusk outline-none transition-colors"
          />
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={!name.trim()} onClick={() => setStep(2)}>Continuer</BlushBtn>
        <SkipLink onClick={() => setStep(2)}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 2) {
    return (
      <Frame onBack={() => setStep(1)} progress={posOf(2)} total={total}>
        <h1 className="onboarding-title">
          Pourquoi venez-vous<br />sur <span className="italic">Legato</span> aujourd'hui&nbsp;?
        </h1>
        <div className="mt-[62px] flex flex-col gap-[7px]">
          {SITUATIONS.map((s) => {
            const active = situation === s.id;
            return (
              <OptionPill
                key={s.id}
                active={active}
                onClick={() => { setSituation(s.id); setStage(null); setPrimaryNeed(null); }}
              >
                {s.label}
              </OptionPill>
            );
          })}
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={!situation} onClick={afterSituation}>Continuer</BlushBtn>
        <SkipLink onClick={afterSituation}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 3) {
    const title = situation === "perdu" ? <>Qui avez-vous<br />perdu&nbsp;?</> : situation === "peur" ? <>De qui avez-vous peur<br />de perdre la présence&nbsp;?</> : <>Qui accompagnez-vous&nbsp;?</>;
    return (
      <Frame onBack={() => setStep(2)} progress={posOf(3)} total={total}>
        <h1 className="onboarding-title">{title}</h1>
        <div className="mt-[30px] flex flex-1 flex-col gap-[6px] overflow-y-auto pb-[10px]">
          {RELATIONS.map((r) => (
            <OptionPill key={r.id} active={lovedOneRelation === r.id} onClick={() => setLovedOneRelation(r.id as Relation)}>
              {r.label}
            </OptionPill>
          ))}
          {lovedOneRelation === "autre" && (
            <input value={lovedOther} onChange={(e) => setLovedOther(e.target.value)} placeholder="Précisez" className="onboarding-field h-[45px] w-full shrink-0 rounded-[7px] border border-dusk/15 bg-transparent px-[26px] font-sans text-[12px] text-dusk outline-none" />
          )}
        </div>

        <div className="mt-auto" />
        <BlushBtn disabled={needsPerson && !lovedOneRelation} onClick={() => setStep(4)}>Continuer</BlushBtn>
        <SkipLink onClick={() => setStep(4)}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 4) {
    return (
      <Frame onBack={() => (needsPerson ? setStep(3) : setStep(2))} progress={posOf(4)} total={total}>
        <h1 className="onboarding-title">
          <span className="whitespace-nowrap">Comment aimeriez-vous</span><br />l'appeler dans <span className="italic">Legato</span>&nbsp;?
        </h1>
        <div className="mt-[61px]">
          <input value={lovedOneName} onChange={(e) => setLovedOneName(e.target.value)} placeholder={placeholderFor(lovedOneRelation)} className="onboarding-field h-[45px] w-full rounded-[7px] border border-dusk/15 bg-transparent px-[26px] font-sans text-[12px] text-dusk outline-none" />
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={false} onClick={() => setStep(5)}>Continuer</BlushBtn>
        <SkipLink onClick={() => setStep(5)}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 5) {
    return (
      <Frame onBack={() => (needsLabel ? setStep(4) : setStep(2))} progress={posOf(5)} total={total}>
        <h1 className="onboarding-title">{stageQuestion(situation)}</h1>
        <div className="mt-[46px] flex flex-col gap-[7px] overflow-y-auto pb-[6px]">
          {stageOptions.map((s) => (
            <OptionPill key={s.id} active={stage === s.id} onClick={() => setStage(s.id as Stage)}>
              {s.label}
            </OptionPill>
          ))}
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={!stage} onClick={afterStage}>Continuer</BlushBtn>
        <SkipLink onClick={afterStage}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 6) {
    return (
      <Frame onBack={() => setStep(5)} progress={posOf(6)} total={total}>
        <h1 className="onboarding-title">De quoi avez-vous besoin<br />en priorité maintenant&nbsp;?</h1>
        <div className="mt-[28px] flex flex-col gap-[9px]">
          {([
            { id: "emotional", label: "Être soutenu·e émotionnellement" },
            { id: "practical", label: "Avancer dans les démarches concrètes" },
            { id: "both", label: "Les deux" },
          ] as { id: PrimaryNeed; label: string }[]).map((o) => (
            <OptionPill key={o.id} active={primaryNeed === o.id} onClick={() => setPrimaryNeed(o.id)}>
              {o.label}
            </OptionPill>
          ))}
        </div>
        <div className="mt-auto" />
        <BlushBtn disabled={!primaryNeed} onClick={afterNeed}>Continuer</BlushBtn>
        <SkipLink onClick={afterNeed}>Passer</SkipLink>
      </Frame>
    );
  }

  if (step === 8) {
    return (
      <Frame onBack={() => setStep(6)} progress={posOf(8)} total={total}>
        <h1 className="onboarding-title">Êtes-vous responsable légalement, ou aidez-vous la famille pour les démarches&nbsp;?</h1>
        <div className="mt-[28px] flex flex-col gap-[9px]">
          <OptionPill active={legallyInvolved === true} onClick={() => setLegallyInvolved(true)}>Oui, je suis impliqué·e</OptionPill>
          <OptionPill active={legallyInvolved === false} onClick={() => setLegallyInvolved(false)}>Non, pas directement</OptionPill>
        </div>
        <div className="mt-auto" />
        <BlushBtn onClick={afterLegal}>Continuer</BlushBtn>
      </Frame>
    );
  }

  return (
    <Frame onBack={backFromEmotion} progress={posOf(7)} total={total}>
      <h1 className="onboarding-title">
        Comment<br />vous sentez-vous<br />aujourd’hui&nbsp;?
      </h1>
      <div className="mt-[47px] grid w-full grid-cols-3 gap-[8px]">
        {EMOTIONS.filter((emotion) => ["colere", "soulagement", "nostalgie", "tristesse", "solitude", "culpabilite", "fatigue", "peur"].includes(emotion.id)).concat([{ id: "besoin_aide", label: "Autre" }]).map((e) => {
          const active = currentEmotions.includes(e.id);
          return (
             <Button
              key={e.id}
              onClick={() => toggleEmotion(e.id)}
               variant="outline"
               className="flex h-[80px] w-full items-center justify-center rounded-[10px] border p-1 font-normal shadow-none transition-colors hover:text-dusk"
              style={{
                background: active ? "var(--terracotta)" : "transparent",
                borderColor: active ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 12%, transparent)",
                color: "var(--dusk)",
              }}
            >
               <span className="text-center text-[12px] leading-[1.18]">{e.label}</span>
             </Button>
          );
        })}
      </div>
      <div className="mt-auto" />
      <BlushBtn onClick={finish}>Continuer</BlushBtn>
      <SkipLink onClick={finish}>Passer</SkipLink>
    </Frame>
  );
}

function Frame({ children, onBack, progress, total, compact = false }: { children: ReactNode; onBack: () => void; progress: number; total: number; compact?: boolean }) {
  return (
    <main className="min-h-dvh" style={{ background: "var(--paper)", color: "var(--dusk)" }}>
      <div className="mobile-frame relative flex min-h-dvh flex-col" style={{ background: "var(--paper)" }}>
        <header className="px-[51px] pt-[46px]">
          <button
            onClick={onBack}
            aria-label="Revenir à l'étape précédente"
            className="mono-label inline-flex min-h-9 items-center gap-1.5"
            style={{ color: "color-mix(in oklab, var(--dusk) 60%, transparent)", fontSize: 9.5, letterSpacing: "0.2em" }}
          >
            <span aria-hidden>←</span> Retour
          </button>
        </header>
        <div className="flex items-center gap-[5px] px-[51px] pt-[22px]">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className="h-[2px] flex-1 rounded-full transition-colors duration-300"
              style={{
                background: i < progress
                  ? "color-mix(in oklab, var(--dusk) 78%, transparent)"
                  : "color-mix(in oklab, var(--dusk) 12%, transparent)",
              }}
            />
          ))}
        </div>
         <div className={`relative z-10 flex flex-1 flex-col px-[51px] pb-[77px] ${compact ? "pt-[55px]" : "pt-[58px]"}`}>{children}</div>
      </div>
    </main>
  );
}

function PrimaryBtn({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-8 block w-full rounded-[4px] px-6 py-5 text-center disabled:opacity-40 transition-transform active:scale-[0.99]"
      style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
    >
      <span className="font-serif text-[20px]">{children}</span>
    </button>
  );
}

function BlushBtn({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <div className="mt-8 flex justify-center">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="h-[44px] w-full rounded-full p-0 text-center font-normal shadow-none disabled:opacity-40 transition-transform active:scale-[0.99]"
        style={{ background: "var(--clay)", color: "var(--dusk)", borderRadius: 999 }}
      >
        <span className="mono-label" style={{ color: "var(--dusk)", letterSpacing: "0.18em", fontSize: 9 }}>{children}</span>
      </Button>
    </div>
  );
}

function SkipLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Button variant="link" onClick={onClick} className="mt-3 h-auto w-full py-1 text-center font-normal text-dusk hover:text-dusk">
      <span className="mono-label underline underline-offset-4" style={{ color: "var(--dusk)", letterSpacing: "0.28em", fontSize: 8.5 }}>{children}</span>
    </Button>
  );
}

function OptionPill({ children, active, onClick }: { children: ReactNode; active: boolean; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="flex min-h-[45px] w-full items-center justify-start gap-3 whitespace-normal rounded-[7px] border px-[16px] py-[10px] text-left font-normal shadow-none transition-colors hover:text-dusk"
      style={{
        background: "var(--paper)",
        borderColor: active ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 14%, transparent)",
        color: "var(--dusk)",
      }}
    >
      <span
        className="inline-block rounded-full shrink-0"
        style={{
          width: 8, height: 8,
          background: active ? "var(--terracotta)" : "transparent",
          border: active ? "none" : "1px solid color-mix(in oklab, var(--dusk) 15%, transparent)",
        }}
      />
      <span className="min-w-0 flex-1 whitespace-normal break-words text-[12px] leading-[1.25]">{children}</span>
    </Button>
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
      {options.map((o, i) => {
        const active = value === o.id;
        const tint = ["var(--sun)", "var(--blush)", "var(--sky)", "color-mix(in oklab, var(--olive) 34%, var(--whisper))", "var(--peach)"][i % 5];
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="rounded-full border px-4 py-2 text-[13px] transition-colors text-dusk"
            style={{ borderColor: active ? "color-mix(in oklab, var(--dusk) 35%, transparent)" : "color-mix(in oklab, var(--dusk) 14%, transparent)", background: active ? tint : "var(--paper)" }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function placeholderFor(relation: Relation | null) {
  const match = RELATIONS.find((r) => r.id === relation);
  return match ? match.label : "Son prénom";
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