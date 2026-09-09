import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { SelfFigure } from "@/components/legato/SelfFigure";
import {
  activitiesFor, loadSelfCare, saveSelfCare, vitality, vitalityWords,
  type BodyAnswers,
} from "@/lib/self-care";

export const Route = createFileRoute("/help/corps/")({
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
          <PageHeader title="LE CORPS" back="/care" />

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
        <PageHeader title="LE CORPS" back="/care" />

        <section className="px-5 pt-2">
          <div
            className="rounded-[24px] px-6 pt-6 pb-7 flex flex-col items-center text-center"
            style={{ background: "color-mix(in oklab, var(--blush) 45%, var(--paper))" }}
          >
            <SelfFigure vitality={v} />
            <p className="mt-1 font-serif text-[20px] leading-[1.3] max-w-[24ch]">{vitalityWords(v)}</p>
          </div>
        </section>

        <section className="px-5 pt-4">
          <button
            type="button"
            onClick={() => { setAsking(true); setIndex(0); }}
            className="w-full rounded-[20px] px-5 py-5 text-left"
            style={{ background: "var(--terracotta)", color: "var(--paper)" }}
          >
            <p className="mono-label" style={{ color: "color-mix(in oklab, var(--paper) 75%, transparent)" }}>
              {answeredAt ? "Refaire le point" : "Commencer"}
            </p>
            <p className="mt-1.5 font-serif text-[20px] leading-[1.15]">
              Comment va votre corps aujourd'hui&nbsp;?
            </p>
          </button>
        </section>

        <section className="px-5 pt-9">
          <div className="flex items-center justify-between gap-3 px-1">
            <p className="mono-label">{answeredAt ? "Pour vous" : "Pour commencer"}</p>
            <div className="h-px flex-1 bg-dusk/12" />
          </div>
          <ul className="surf-cream mt-3 rounded-[18px] px-5">
            {pistes.map((p) => (
              <li
                key={p.id}
                className="border-b border-dashed last:border-0"
                style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
              >
                <Link
                  to="/help/corps/soin/$id"
                  params={{ id: p.id }}
                  className="flex items-baseline justify-between gap-4 py-4 transition-opacity active:opacity-70"
                >
                  <p className="font-serif text-[18px] leading-[1.15]">{p.title}</p>
                  <span className="mono-label shrink-0 text-dusk/45">{p.minutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="px-5 pt-9 space-y-3">
          <Link to="/help/corps/nuits" className="craft block px-5 py-4">
            <p className="font-serif text-[17px]">Les nuits difficiles →</p>
          </Link>
          <Link to="/help/corps/manger" className="craft block px-5 py-4">
            <p className="font-serif text-[17px]">Manger quand on n'y arrive pas →</p>
          </Link>
          <Link to="/agenda" className="craft block px-5 py-4">
            <p className="font-serif text-[17px]">Ajuster mes journées →</p>
          </Link>
        </section>

      </div>
    </Shell>
  );
}
