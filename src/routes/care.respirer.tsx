import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/care/respirer")({
  head: () => ({
    meta: [
      { title: "Respirer — Legato" },
      { name: "description", content: "Trois rythmes de souffle guidés : apaiser, ralentir, préparer la nuit." },
      { property: "og:title", content: "Respirer — Legato" },
      { property: "og:description", content: "Un cercle lent, une consigne à la fois. Aucun objectif à atteindre." },
    ],
  }),
  component: CareRespirer,
});

type Rhythm = {
  id: "calme" | "long" | "nuit";
  label: string;
  formula: string;
  why: string;
  in: number;
  hold: number;
  out: number;
};

const RHYTHMS: Rhythm[] = [
  { id: "calme", label: "Apaiser", formula: "4 · 0 · 6", why: "Expirer plus longtemps ralentit le cœur.", in: 4, hold: 0, out: 6 },
  { id: "long", label: "Ralentir", formula: "4 · 4 · 6", why: "Un palier entre deux souffles, pour poser la tête.", in: 4, hold: 4, out: 6 },
  { id: "nuit", label: "Préparer la nuit", formula: "4 · 7 · 8", why: "Le rythme le plus lent, allongé·e, lumière basse.", in: 4, hold: 7, out: 8 },
];

function CareRespirer() {
  const [rhythm, setRhythm] = useState<Rhythm>(RHYTHMS[0]);
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [seconds, setSeconds] = useState(RHYTHMS[0].in);
  const [cycles, setCycles] = useState(0);
  const started = useRef(false);

  const phases = useMemo(
    () =>
      [
        { id: "in", label: "Inspirez", seconds: rhythm.in, scale: 1 },
        { id: "hold", label: "Gardez", seconds: rhythm.hold, scale: 1 },
        { id: "out", label: "Expirez", seconds: rhythm.out, scale: 0.6 },
      ].filter((p) => p.seconds > 0),
    [rhythm],
  );

  useEffect(() => {
    setPhaseIndex(0);
    setSeconds(phases[0].seconds);
  }, [rhythm]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;
        const next = (phaseIndex + 1) % phases.length;
        setPhaseIndex(next);
        if (next === 0) setCycles((c) => c + 1);
        return phases[next].seconds;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, phaseIndex, phases]);

  const phase = phases[phaseIndex] ?? phases[0];
  const total = phases.reduce((s, p) => s + p.seconds, 0);

  const start = () => {
    started.current = true;
    setRunning(true);
  };

  return (
    <Shell livingBg={false}>
      <main className="wash-butter min-h-dvh text-dusk pb-36">
        <PageHeader back="/care" title="RESPIRER" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Revenir au <span className="italic" style={{ color: "var(--terracotta)" }}>souffle</span>.
          </h1>
          <p className="mt-4 max-w-[30ch] text-[13px] leading-[1.6] text-dusk/60">
            Suivez le cercle. Rien à réussir, vous pouvez arrêter à tout moment.
          </p>
        </section>

        {/* Le cercle */}
        <section className="px-6 pt-8">
          <div
            className="relative mx-auto flex aspect-square w-full max-w-[290px] items-center justify-center rounded-full"
            style={{ background: "color-mix(in oklab, var(--clay) 55%, var(--paper))" }}
          >
            <div className="absolute inset-4 rounded-full" style={{ border: "1px dashed color-mix(in oklab, var(--dusk) 16%, transparent)" }} />
            <div
              className="absolute size-[196px] rounded-full ease-in-out"
              style={{
                background: "color-mix(in oklab, var(--terracotta) 26%, var(--paper))",
                transform: `scale(${running ? phase.scale : 0.82})`,
                transitionProperty: "transform",
                transitionDuration: `${phase.seconds || 1}s`,
              }}
            />
            <div className="relative text-center">
              {running ? (
                <>
                  <p className="font-serif text-[26px] leading-none">{phase.label}</p>
                  <p className="mt-3 font-serif text-[44px] leading-none tabular-nums">{seconds}</p>
                </>
              ) : (
                <p className="font-serif text-[22px] leading-[1.2] max-w-[12ch]">
                  {started.current ? "En pause" : "Quand vous voulez"}
                </p>
              )}
            </div>
          </div>

          {/* Commande unique, explicite */}
          <div className="mx-auto mt-7 flex max-w-[290px] items-center gap-3">
            <button
              type="button"
              onClick={() => (running ? setRunning(false) : start())}
              className="flex-1 rounded-full py-3.5 text-[13.5px] tracking-[0.06em] transition-opacity active:opacity-80"
              style={{ background: "var(--terracotta)", color: "var(--paper)" }}
            >
              {running ? "Mettre en pause" : started.current ? "Reprendre" : "Commencer"}
            </button>
            {started.current && (
              <button
                type="button"
                onClick={() => {
                  setRunning(false);
                  started.current = false;
                  setCycles(0);
                  setPhaseIndex(0);
                  setSeconds(phases[0].seconds);
                }}
                className="rounded-full px-5 py-3.5 text-[13px] text-dusk/60"
                style={{ border: "1px dashed color-mix(in oklab, var(--dusk) 22%, transparent)" }}
              >
                Terminer
              </button>
            )}
          </div>

          <p className="mt-4 text-center text-[11.5px] tracking-[0.1em] tabular-nums text-dusk/45">
            {cycles > 0 ? `${cycles} RESPIRATION${cycles > 1 ? "S" : ""} · ${cycles * total} S` : `CYCLE DE ${total} SECONDES`}
          </p>
        </section>

        {/* Choix du rythme */}
        <section className="px-5 pt-10">
          <SectionHead label="Rythme" meta={rhythm.formula} />
          <ul className="tint-butter mt-3 rounded-[18px] px-5">
            {RHYTHMS.map((r) => {
              const on = r.id === rhythm.id;
              return (
                <li
                  key={r.id}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setRhythm(r);
                      setCycles(0);
                    }}
                    className="flex w-full items-start gap-4 py-4 text-left"
                    aria-pressed={on}
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] size-[7px] shrink-0 rounded-full"
                      style={{ background: on ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 18%, transparent)" }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[17.5px] leading-[1.2]">{r.label}</span>
                      <span className="mt-1 block text-[12.5px] surf-sub">{r.why}</span>
                    </span>
                    <span className="shrink-0 pt-[3px] text-[11.5px] tabular-nums tracking-[0.1em] text-dusk/45">{r.formula}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Après */}
        <section className="px-5 pt-10">
          <SectionHead label="Après" />
          <ul className="tint-butter mt-3 rounded-[18px] px-5">
            {[
              { to: "/care/journal", title: "Déposer quelques mots", note: "Sans relire, sans juger" },
              { to: "/help/corps", title: "Prendre soin du corps", note: "Repos, marche, relâchement" },
              { to: "/presence", title: "Se confier à Présence", note: "Quelqu'un qui écoute" },
            ].map((l) => (
              <li
                key={l.to}
                className="border-b border-dashed last:border-0"
                style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
              >
                <Link to={l.to as "/care"} className="flex items-start gap-4 py-4">
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
      </main>
    </Shell>
  );
}
