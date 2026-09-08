import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { SelfFigure } from "@/components/legato/SelfFigure";
import {
  activitiesFor, loadSelfCare, saveSelfCare, vitality, vitalityWords,
  type BodyAnswers,
} from "@/lib/self-care";

export const Route = createFileRoute("/help/corps")({
  head: () => ({
    meta: [
      { title: "Le corps — Legato" },
      { name: "description", content: "Quelques questions simples, puis de vraies pratiques de soin : respiration, repos, relâchement." },
      { property: "og:title", content: "Le corps — Legato" },
      { property: "og:description", content: "Prendre soin de soi, concrètement, sans injonction." },
    ],
  }),
  component: Corps,
});

type Step = { key: keyof BodyAnswers; label: string; question: string; options: { id: string; label: string }[] };

const STEPS: Step[] = [
  {
    key: "energy",
    label: "Énergie",
    question: "Comment est votre énergie aujourd'hui ?",
    options: [
      { id: "vide", label: "À plat, rien dans les jambes" },
      { id: "lente", label: "Au ralenti, mais debout" },
      { id: "agitee", label: "Agitée, je n'arrive pas à me poser" },
      { id: "ok", label: "Ça va, à peu près" },
    ],
  },
  {
    key: "sleep",
    label: "Sommeil",
    question: "Et vos nuits ?",
    options: [
      { id: "peu", label: "Je dors très peu" },
      { id: "coupe", label: "Je me réveille souvent" },
      { id: "endormir", label: "J'ai du mal à m'endormir" },
      { id: "ok", label: "Je dors à peu près" },
    ],
  },
  {
    key: "food",
    label: "Alimentation",
    question: "Et manger, en ce moment ?",
    options: [
      { id: "rien", label: "Je n'y arrive pas" },
      { id: "oubli", label: "J'oublie les repas" },
      { id: "trop", label: "Je mange n'importe quand" },
      { id: "ok", label: "Je mange à peu près" },
    ],
  },
  {
    key: "tension",
    label: "Tension",
    question: "Où en est votre tête, là, maintenant ?",
    options: [
      { id: "tendu", label: "Tendue, serrée" },
      { id: "ailleurs", label: "Ailleurs, dispersée" },
      { id: "lourd", label: "Lourde, embrumée" },
      { id: "calme", label: "À peu près calme" },
    ],
  },
];

function Corps() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<BodyAnswers>({});
  const [asking, setAsking] = useState(false);
  const [v, setV] = useState(0.3);
  const [answeredAt, setAnsweredAt] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSelfCare();
    setAnswers(s.answers);
    setAnsweredAt(s.answeredAt);
    setV(vitality(s));
  }, []);

  const choose = (key: keyof BodyAnswers, id: string) => {
    const next = { ...answers, [key]: id };
    setAnswers(next);
    if (index + 1 >= STEPS.length) {
      const at = new Date().toISOString();
      saveSelfCare({ answers: next, answeredAt: at });
      setAnsweredAt(at);
      setAsking(false);
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  const pistes = activitiesFor(answers);
  const step = STEPS[Math.min(index, STEPS.length - 1)];

  if (asking) {
    return (
      <Shell livingBg={false}>
        <div className="min-h-dvh bg-paper text-dusk pb-32">
          <PageHeader title="LE CORPS" back="/help" />
          <div className="px-6 pt-2 flex gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s.key}
                className="h-[1.5px] flex-1 rounded-full"
                style={{ background: i <= index ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 14%, transparent)" }}
              />
            ))}
          </div>

          <section className="px-6 pt-8 pb-2">
            <p className="mono-label">{step.label}</p>
            <h1 className="mt-4 ed-page-title text-[28px]">{step.question}</h1>
          </section>

          <section className="px-5 pt-6 flex flex-col gap-2.5">
            {step.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(step.key, o.id)}
                className="text-left rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4 font-serif text-[17px] leading-[1.2] transition-transform active:scale-[0.99]"
              >
                {o.label}
              </button>
            ))}
          </section>

          <div className="px-6 pt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (index > 0 ? setIndex(index - 1) : setAsking(false))}
              className="mono-label text-dusk/50"
            >
              ← {index > 0 ? "Question précédente" : "Revenir"}
            </button>
            <button type="button" onClick={() => setAsking(false)} className="mono-label text-dusk/40">
              Passer
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="LE CORPS" back="/help" />

        <section className="px-6 pt-2 flex flex-col items-center text-center">
          <SelfFigure vitality={v} />
          <p className="mt-2 font-serif text-[19px] leading-[1.35] max-w-[26ch]">{vitalityWords(v)}</p>
          <p className="mt-3 text-[12.5px] leading-[1.6] text-dusk/55 max-w-[30ch]">
            Cette figure vous représente ici. Elle s'ouvre quand vous prenez un moment pour vous,
            elle se repose quand vous ne faites rien. Jamais de reproche.
          </p>
        </section>

        <section className="px-5 pt-8">
          <button
            type="button"
            onClick={() => { setAsking(true); setIndex(0); }}
            className="w-full rounded-[18px] px-5 py-5 text-left"
            style={{ background: "var(--blush)" }}
          >
            <p className="mono-label text-dusk/60">{answeredAt ? "Refaire le point" : "Commencer"}</p>
            <p className="mt-1.5 font-serif text-[19px] leading-[1.15]">
              Comment va votre corps aujourd'hui&nbsp;?
            </p>
          </button>
        </section>

        <section className="px-5 pt-9">
          <div className="flex items-center justify-between gap-3 px-1">
            <p className="mono-label">{answeredAt ? "D'après ce que vous avez dit" : "Pour commencer doucement"}</p>
            <div className="h-px flex-1 bg-dusk/12" />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {pistes.map((p) => (
              <Link
                key={p.id}
                to="/help/corps/soin/$id"
                params={{ id: p.id }}
                className="block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-serif text-[18px] leading-[1.15]">{p.title}</p>
                  <span className="mono-label text-dusk/45 shrink-0">{p.minutes} min</span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-[1.5] text-dusk/60">{p.intro}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-5 pt-9 space-y-3">
          <Link to="/help/corps/nuits" className="block rounded-[18px] border border-dusk/10 bg-paper px-5 py-4">
            <p className="font-serif text-[17px]">Les nuits difficiles →</p>
          </Link>
          <Link to="/help/corps/manger" className="block rounded-[18px] border border-dusk/10 bg-paper px-5 py-4">
            <p className="font-serif text-[17px]">Manger quand on n'y arrive pas →</p>
          </Link>
          <Link to="/agenda" className="block rounded-[18px] border border-dusk/10 bg-paper px-5 py-4">
            <p className="font-serif text-[17px]">Ajuster mes journées →</p>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
