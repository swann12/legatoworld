import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/help/corps")({
  head: () => ({
    meta: [
      { title: "Le corps — Legato" },
      { name: "description", content: "Trois questions simples sur l'énergie, le sommeil et l'alimentation, puis une à trois pistes adaptées." },
      { property: "og:title", content: "Le corps — Legato" },
      { property: "og:description", content: "Trois questions simples, puis une à trois pistes adaptées." },
    ],
  }),
  component: Corps,
});

type StateId = string;
type Step = { key: "energy" | "sleep" | "food"; label: string; question: string; options: { id: StateId; label: string }[] };

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
];

type Piste = { title: string; body: string; to: "/help/corps/nuits" | "/help/corps/manger" | "/help/corps/eau" | "/help/corps/habiller" | "/care/respirer" | "/crisis"; bg: string };

const PISTES: Record<string, Piste> = {
  nuits: { title: "Préparer la nuit", body: "Quelques minutes pour aider la nuit d'après.", to: "/help/corps/nuits", bg: "var(--sky)" },
  manger: { title: "Manger sans y penser", body: "Une petite chose facile à avaler.", to: "/help/corps/manger", bg: "var(--sun)" },
  eau: { title: "Boire un verre d'eau", body: "Un verre, puis on verra.", to: "/help/corps/eau", bg: "var(--whisper)" },
  habiller: { title: "S'habiller, doucement", body: "Un geste simple pour entrer dans la journée.", to: "/help/corps/habiller", bg: "var(--blush)" },
  souffle: { title: "Ralentir le souffle", body: "Trois minutes pour calmer l'agitation.", to: "/care/respirer", bg: "var(--sage)" },
  humain: { title: "Parler à quelqu'un", body: "Quand le corps lâche, une présence humaine aide.", to: "/crisis", bg: "var(--peach)" },
};

function pistesFor(a: Record<string, string>): Piste[] {
  const out: Piste[] = [];
  if (a.sleep === "peu" || a.sleep === "coupe" || a.sleep === "endormir") out.push(PISTES.nuits);
  if (a.food === "rien" || a.food === "oubli") out.push(PISTES.manger);
  if (a.energy === "agitee") out.push(PISTES.souffle);
  if (a.energy === "vide") out.push(PISTES.eau);
  if (a.energy === "lente" && out.length < 2) out.push(PISTES.habiller);
  if (a.energy === "vide" && a.food === "rien" && a.sleep === "peu") out.push(PISTES.humain);
  if (!out.length) out.push(PISTES.eau);
  return out.slice(0, 3);
}

function Corps() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = index >= STEPS.length;

  const choose = (key: string, id: string) => {
    setAnswers((a) => ({ ...a, [key]: id }));
    setIndex((i) => i + 1);
  };

  const step = STEPS[Math.min(index, STEPS.length - 1)];
  const pistes = done ? pistesFor(answers) : [];

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="LE CORPS" back="/help" />

        {!done ? (
          <>
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

            {index > 0 && (
              <div className="px-6 pt-6">
                <button type="button" onClick={() => setIndex((i) => i - 1)} className="mono-label text-dusk/50">
                  ← Question précédente
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <section className="px-6 pt-8 pb-2">
              <p className="mono-label">Pour vous, maintenant</p>
              <h1 className="mt-4 ed-page-title text-[28px]">
                {pistes.length === 1 ? "Une piste" : `${pistes.length} pistes`}, <span className="italic">rien de plus.</span>
              </h1>
            </section>

            <section className="px-5 pt-6 flex flex-col gap-3">
              {pistes.map((p) => (
                <Link key={p.title} to={p.to} className="block rounded-[18px] px-5 py-5" style={{ background: p.bg }}>
                  <p className="font-serif text-[19px] leading-[1.15]">{p.title}</p>
                  <p className="mt-1.5 text-[12.5px] text-dusk/65">{p.body}</p>
                </Link>
              ))}
            </section>

            <div className="px-6 pt-8">
              <button
                type="button"
                onClick={() => { setAnswers({}); setIndex(0); }}
                className="text-[12px] text-dusk/50 underline underline-offset-4 hover:text-dusk"
              >
                Refaire le point
              </button>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
