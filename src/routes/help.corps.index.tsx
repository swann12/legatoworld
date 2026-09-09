import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";
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

const ANSWER_WORDS: Record<string, string> = {
  vide: "À plat", lente: "Au ralenti", agitee: "Agitée", ok: "Ça va",
  peu: "Courtes", coupe: "Coupées", endormir: "Longues à venir",
  rien: "Difficile", oubli: "Oubliée", trop: "Décousue",
  tendu: "Tendue", ailleurs: "Dispersée", lourd: "Lourde", calme: "Calme",
};

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
        <div className="wash-butter min-h-dvh text-dusk pb-32">
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
            <p className="mono-label">
              {String(index + 1).padStart(2, "0")} · {step.label}
            </p>
            <h1 className="mt-4 ed-page-title text-[27px]">{step.question}</h1>
          </section>

          <section className="px-5 pt-7">
            <ul className="craft px-5">
              {step.options.map((o) => (
                <li
                  key={o.id}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                >
                  <button
                    type="button"
                    onClick={() => choose(step.key, o.id)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left font-serif text-[17px] leading-[1.2] transition-opacity active:opacity-70"
                  >
                    {o.label}
                    <span aria-hidden className="shrink-0 text-dusk/25">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <div className="px-6 pt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (index > 0 ? setIndex(index - 1) : setAsking(false))}
              className="mono-label text-dusk/50"
            >
              ← {index > 0 ? "Précédent" : "Revenir"}
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
      <div className="wash-butter min-h-dvh text-dusk pb-36">
        <PageHeader title="LE CORPS" back="/care" />

        {/* La figure — une seule surface forte, encre profonde */}
        <section className="px-5 pt-2">
          <div
            className="rounded-[24px] px-6 pt-7 pb-8 flex flex-col items-center text-center"
            style={{ background: "var(--sumi)", color: "var(--paper)" }}
          >
            <SelfFigure vitality={v} />
            <p className="mt-2 font-serif text-[21px] leading-[1.3] max-w-[22ch]">{vitalityWords(v)}</p>
            <div className="mt-5 h-px w-16" style={{ background: "color-mix(in oklab, var(--paper) 30%, transparent)" }} />
            <p className="mt-4 text-[11.5px] tracking-[0.12em]" style={{ color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>
              {answeredAt ? "DERNIER POINT ENREGISTRÉ" : "AUCUN POINT ENCORE"}
            </p>
          </div>
        </section>

        {/* Le point du jour */}
        <section className="px-5 pt-5">
          <button
            type="button"
            onClick={() => { setAsking(true); setIndex(0); }}
            className="w-full rounded-[18px] px-5 py-4 text-left transition-opacity active:opacity-80"
            style={{ background: "var(--terracotta)", color: "var(--paper)" }}
          >
            <p className="mono-label" style={{ color: "color-mix(in oklab, var(--paper) 75%, transparent)" }}>
              {answeredAt ? "Refaire le point · 4 questions" : "Commencer · 4 questions"}
            </p>
            <p className="mt-1.5 font-serif text-[20px] leading-[1.15]">Comment va votre corps aujourd'hui&nbsp;?</p>
          </button>
        </section>

        {/* Lecture des réponses — quatre repères, une même grille */}
        {answeredAt && (
          <section className="px-5 pt-9">
            <SectionHead label="Aujourd'hui" />
            <div className="craft mt-3 grid grid-cols-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.key}
                  className="px-5 py-4"
                  style={{
                    borderRight: i % 2 === 0 ? "1px dashed color-mix(in oklab, var(--dusk) 20%, transparent)" : undefined,
                    borderBottom: i < 2 ? "1px dashed color-mix(in oklab, var(--dusk) 20%, transparent)" : undefined,
                  }}
                >
                  <p className="mono-label">{s.label}</p>
                  <p className="mt-1.5 font-serif text-[16px] leading-[1.2]">
                    {answers[s.key] ? ANSWER_WORDS[answers[s.key]!] ?? "—" : "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pistes de soin */}
        <section className="px-5 pt-9">
          <SectionHead label={answeredAt ? "Pour vous, maintenant" : "Pour commencer"} meta={`${pistes.length} pistes`} />
          <ul className="craft mt-3 px-5">
            {pistes.map((p, i) => (
              <li
                key={p.id}
                className="border-b border-dashed last:border-0"
                style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
              >
                <Link
                  to="/help/corps/soin/$id"
                  params={{ id: p.id }}
                  className="flex items-start gap-4 py-4 transition-opacity active:opacity-70"
                >
                  <span className="mt-[5px] shrink-0 text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[17.5px] leading-[1.2]">{p.title}</span>
                    <span className="mt-1 block text-[12.5px] surf-sub">{p.intro}</span>
                  </span>
                  <span className="shrink-0 pt-[3px] text-[11px] tabular-nums text-dusk/45">{p.minutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Aller plus loin */}
        <section className="px-5 pt-9">
          <SectionHead label="Aller plus loin" />
          <ul className="craft mt-3 px-5">
            {[
              { to: "/help/corps/nuits", title: "Les nuits difficiles", note: "Quand le sommeil ne vient pas" },
              { to: "/help/corps/manger", title: "Manger quand on n'y arrive pas", note: "Le plus simple d'abord" },
              { to: "/agenda", title: "Ajuster mes journées", note: "Alléger ce qui peut l'être" },
            ].map((l) => (
              <li
                key={l.to}
                className="border-b border-dashed last:border-0"
                style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
              >
                <Link to={l.to as "/agenda"} className="flex items-start gap-4 py-4">
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[17.5px] leading-[1.2]">{l.title}</span>
                    <span className="mt-1 block text-[12.5px] surf-sub">{l.note}</span>
                  </span>
                  <span aria-hidden className="pt-[3px] text-dusk/30">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
