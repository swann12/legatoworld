import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useLegato, SITUATIONS, RELATIONS, STAGES_BY_SITUATION, EMOTIONS,
  type Relation, type Stage, type Situation, type Emotion, type PrimaryNeed,
} from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useServerFn } from "@tanstack/react-start";
import { recordEmotion } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";
import { IvoryCard } from "@/components/legato/EditorialUI";
import { useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({
    meta: [
      { title: "Commencer doucement — Legato" },
      { name: "description", content: "Quelques questions tranquilles pour accorder votre espace." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const {
    name, setName, setCareOnboarded, setPracticalOnboarded,
    situation, setSituation,
    lovedOneName, setLovedOneName,
    lovedOneRelation, setLovedOneRelation,
    stage, setStage,
    primaryNeed, setPrimaryNeed,
    currentEmotions, setCurrentEmotions,
    legallyInvolved, setLegallyInvolved,
  } = useLegato();
  const navigate = useNavigate();
  const record = useServerFn(recordEmotion);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  const needsPerson = situation && ["perdu", "peur", "accompagner"].includes(situation);
  const needsLabel = situation && !["questionnement", "volontes"].includes(situation);
  const stageOptions = situation ? STAGES_BY_SITUATION[situation] : [];
  const needChoiceForced = situation === "questionnement" || situation === "volontes" || (lovedOneRelation === "animal" && !["vet", "cremation_animal", "inhumation_animal"].includes(stage ?? ""));
  const needsEmotion = primaryNeed === "emotional" || primaryNeed === "both";
  const needsLegalQuestion = (lovedOneRelation === "ami" || lovedOneRelation === "collegue" || lovedOneRelation === "autre") && (primaryNeed === "practical" || primaryNeed === "both");

  const finish = async () => {
    setCareOnboarded(true);
    setPracticalOnboarded(true);
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      record({ data: { source: "onboarding", tags: ["accueil", situation ?? "inconnu"], note: `Prénom : ${name}` } }).catch(() => {});
    }
    navigate({ to: "/space" });
  };

  if (step === 1) {
    const canContinue = name.trim().length > 0;
    return (
      <Frame onBack={() => navigate({ to: "/start" })} progress="1 / 4">
        <p className="mono-label">Pour commencer</p>
        <h1 className="mt-5 ed-page-title">
          Comment souhaitez-vous que nous <span className="italic" style={{ color: "var(--terracotta)" }}>vous appelions ?</span>
        </h1>
        <IvoryCard className="mt-8 px-5 py-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre prénom"
            className="w-full bg-transparent font-serif text-[24px] italic text-dusk placeholder:text-dusk/30 outline-none"
            autoFocus
          />
        </IvoryCard>
        <PrimaryBtn disabled={!canContinue} onClick={() => setStep(2)}>Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  if (step === 2) {
    return (
      <Frame onBack={() => setStep(1)} progress="2 / 4">
        <p className="mono-label">Pour vous accueillir justement</p>
        <h1 className="mt-5 ed-page-title">
          Pourquoi venez-vous sur <span className="italic" style={{ color: "var(--terracotta)" }}>Legato</span>&nbsp;?
        </h1>
        <div className="mt-8 flex flex-col gap-3">
          {SITUATIONS.map((s) => {
            const active = situation === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { setSituation(s.id); setPrimaryNeed(s.primaryNeed); }}
                className={`text-left rounded-[16px] border px-5 py-4 transition-colors ${active ? "border-dusk/40 bg-[color:var(--whisper)]" : "border-dusk/12 bg-paper hover:border-dusk/25"}`}
              >
                <p className="font-serif text-[18px] leading-[1.2] text-dusk">{s.label}</p>
              </button>
            );
          })}
        </div>
        <PrimaryBtn
          disabled={!situation}
          onClick={() => {
            if (!situation) return;
            if (step3HasQuestions) setStep(3);
            else if (needsEmotion) setStep(4);
            else finish();
          }}
        >Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  if (step === 3) {
    const canContinue =
      (!needsRelation || lovedOneRelation) &&
      (!needsTimeframe || timeframe) &&
      (!needsStage || stage) &&
      (!needsNeedChoice || primaryNeed);
    return (
      <Frame onBack={() => setStep(2)} progress="3 / 4">
        <p className="mono-label">Encore quelques mots</p>
        <h1 className="mt-5 ed-page-title">
          Pour mieux <span className="italic" style={{ color: "var(--terracotta)" }}>vous accompagner</span>
        </h1>

        {needsRelation && (
          <Field label="De qui parlons-nous ?">
            <ChipGrid
              options={RELATIONS.map((r) => ({ id: r.id, label: r.label }))}
              value={lovedOneRelation}
              onChange={(v) => setLovedOneRelation(v as Relation)}
            />
            <input
              value={lovedOneName}
              onChange={(e) => setLovedOneName(e.target.value)}
              placeholder="Son prénom ou comment vous l'appelez (optionnel)"
              className="mt-4 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] text-dusk placeholder:text-dusk/35 outline-none focus:border-dusk/35"
            />
          </Field>
        )}

        {situation === "soutenir" && (
          <Field label="Le prénom de la personne endeuillée (optionnel)">
            <input
              value={lovedOneName}
              onChange={(e) => setLovedOneName(e.target.value)}
              placeholder="Son prénom"
              className="w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] text-dusk placeholder:text-dusk/35 outline-none focus:border-dusk/35"
            />
          </Field>
        )}

        {needsTimeframe && (
          <Field label="Quand cela s'est-il passé ?">
            <ChipGrid
              options={TIMEFRAMES.map((t) => ({ id: t.id, label: t.label }))}
              value={timeframe}
              onChange={(v) => setTimeframe(v as Timeframe)}
            />
          </Field>
        )}

        {needsStage && (
          <Field label="Où en êtes-vous ?">
            <ChipGrid
              options={STAGES.map((s) => ({ id: s.id, label: s.label }))}
              value={stage}
              onChange={(v) => setStage(v as Stage)}
            />
          </Field>
        )}

        {needsNeedChoice && (
          <Field label="De quoi avez-vous le plus besoin ?">
            <ChipGrid
              options={[
                { id: "emotional", label: "Du soutien émotionnel" },
                { id: "practical", label: "De l'aide pour les démarches" },
                { id: "both",      label: "Les deux" },
              ]}
              value={primaryNeed}
              onChange={(v) => setPrimaryNeed(v as PrimaryNeed)}
            />
          </Field>
        )}

        <PrimaryBtn
          disabled={!canContinue}
          onClick={() => { if (needsEmotion) setStep(4); else finish(); }}
        >Continuer →</PrimaryBtn>
      </Frame>
    );
  }

  const toggleEmotion = (id: Emotion) => {
    setCurrentEmotions(
      currentEmotions.includes(id)
        ? currentEmotions.filter((e) => e !== id)
        : [...currentEmotions, id],
    );
  };
  return (
    <Frame onBack={() => setStep(step3HasQuestions ? 3 : 2)} progress="4 / 4">
      <p className="mono-label">Avant d'entrer</p>
      <h1 className="mt-5 ed-page-title">
        Comment vous sentez-vous <span className="italic" style={{ color: "var(--terracotta)" }}>maintenant&nbsp;?</span>
      </h1>
      <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
        Plusieurs choix possibles. Vous pourrez revenir ici à tout moment.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {EMOTIONS.map((e) => {
          const active = currentEmotions.includes(e.id);
          return (
            <button
              key={e.id}
              onClick={() => toggleEmotion(e.id)}
              className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${active ? "border-dusk/40 bg-[color:var(--whisper)]" : "border-dusk/15 bg-paper text-dusk/70 hover:border-dusk/25"}`}
            >
              {e.label}
            </button>
          );
        })}
      </div>
      <PrimaryBtn onClick={finish}>Entrer dans Legato →</PrimaryBtn>
      <button onClick={finish} className="mt-3 block w-full text-center mono-label text-dusk/55">
        Passer cette étape
      </button>
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