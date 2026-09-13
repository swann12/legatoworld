import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

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
  in: number;
  hold: number;
  out: number;
  /** Fond de page — un aplat franc, tiré de la palette. */
  bg: string;
  /** Cercle de souffle. */
  disc: string;
};

const RHYTHMS: Rhythm[] = [
  {
    id: "calme", label: "Apaiser", formula: "4 · 0 · 6", in: 4, hold: 0, out: 6,
    bg: "color-mix(in oklab, var(--terracotta) 24%, var(--whisper))",
    disc: "color-mix(in oklab, var(--terracotta) 62%, var(--paper))",
  },
  {
    id: "long", label: "Ralentir", formula: "4 · 4 · 6", in: 4, hold: 4, out: 6,
    bg: "color-mix(in oklab, var(--clay) 70%, var(--paper))",
    disc: "color-mix(in oklab, var(--bordeaux) 32%, var(--paper))",
  },
  {
    id: "nuit", label: "La nuit", formula: "4 · 7 · 8", in: 4, hold: 7, out: 8,
    bg: "color-mix(in oklab, var(--sky) 46%, var(--whisper))",
    disc: "color-mix(in oklab, var(--sumi) 66%, var(--sky))",
  },
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
        { id: "out", label: "Expirez", seconds: rhythm.out, scale: 0.58 },
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
  const night = rhythm.id === "nuit";
  const onDisc = night ? "var(--paper)" : "var(--paper)";

  const breathing = running;

  return (
    <Shell livingBg={false} hideNav={breathing}>
      <main
        className="min-h-dvh text-dusk pb-36"
        style={{ background: rhythm.bg, transition: "background 900ms ease" }}
      >
        <div style={{ opacity: breathing ? 0 : 1, transition: "opacity 500ms ease", pointerEvents: breathing ? "none" : undefined }}>
          <PageHeader back="/care" title="RESPIRER" />
        </div>

        {/* 1 · Choisir un rythme — s'efface pendant l'expérience */}
        <section
          className="px-5 pt-2"
          style={{ opacity: breathing ? 0 : 1, transition: "opacity 500ms ease", pointerEvents: breathing ? "none" : undefined }}
        >
          <div className="flex items-stretch justify-center gap-8">
            {RHYTHMS.map((r) => {
              const on = r.id === rhythm.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setRhythm(r); setCycles(0); setRunning(false); }}
                  aria-pressed={on}
                  className="pb-2 text-[10.5px] uppercase tracking-[0.18em] transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 45%, transparent)",
                    borderBottom: on
                      ? "1px solid var(--bordeaux)"
                      : "1px solid transparent",
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2 · Matière vivante : halos lents, lueur pulsée, un seul objet au centre */}
        <section className={breathing ? "px-6 pt-16" : "px-6 pt-9"} style={{ transition: "padding 700ms ease" }}>
          <div className="relative mx-auto flex aspect-square w-full max-w-[300px] items-center justify-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden
                className="absolute rounded-full"
                style={{
                  inset: -18 - i * 24,
                  background: `radial-gradient(circle, color-mix(in oklab, ${rhythm.disc} ${18 - i * 5}%, transparent) 0%, transparent 70%)`,
                  animation: `legato-halo ${9 + i * 3}s ease-in-out ${i * 1.2}s infinite`,
                  opacity: breathing ? 1 : 0.5,
                  transition: "opacity 800ms ease",
                }}
              />
            ))}
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "1px dashed color-mix(in oklab, var(--dusk) 18%, transparent)" }}
            />
            <div
              className="absolute size-[236px] rounded-full ease-in-out"
              style={{
                background: rhythm.disc,
                boxShadow: `0 0 70px 12px color-mix(in oklab, ${rhythm.disc} ${breathing ? 45 : 20}%, transparent)`,
                transform: `scale(${running ? phase.scale : 0.7})`,
                transitionProperty: "transform, box-shadow",
                transitionDuration: `${phase.seconds || 1}s, 1200ms`,
              }}
            />
            <div className="relative text-center" style={{ color: onDisc }}>
              {running ? (
                <>
                  <p className="text-[10.5px] tracking-[0.22em]">{phase.label.toUpperCase()}</p>
                  <p className="mt-2 font-serif text-[52px] leading-none tabular-nums">{seconds}</p>
                </>
              ) : (
                <p className="font-serif text-[20px] leading-[1.2] max-w-[10ch]">
                  {started.current ? "En pause" : "Quand vous voulez"}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 3 · Une seule commande */}
        <section className="px-6 pt-8">
          <button
            type="button"
            onClick={() => (running ? setRunning(false) : (started.current = true, setRunning(true)))}
            className="mx-auto block w-full max-w-[280px] rounded-full py-4 text-[13.5px] tracking-[0.06em] transition-all active:opacity-80"
            style={{
              background: breathing ? "transparent" : "var(--bordeaux)",
              color: breathing ? "color-mix(in oklab, var(--dusk) 55%, transparent)" : "var(--paper)",
              border: breathing ? "1px dashed color-mix(in oklab, var(--dusk) 25%, transparent)" : "1px solid transparent",
            }}
          >
            {running ? "Mettre en pause" : started.current ? "Reprendre" : "Commencer"}
          </button>

          {!breathing && (
            <p className="mt-4 text-center text-[11px] tracking-[0.14em] tabular-nums text-dusk/50">
              {rhythm.formula.replace(/ /g, "")} · {cycles > 0 ? `${cycles} RESPIRATION${cycles > 1 ? "S" : ""}` : `CYCLE DE ${total} S`}
            </p>
          )}

          {started.current && !breathing && (
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                started.current = false;
                setCycles(0);
                setPhaseIndex(0);
                setSeconds(phases[0].seconds);
              }}
              className="mx-auto mt-4 block text-[12px] text-dusk/50"
            >
              Terminer
            </button>
          )}
        </section>

        {/* 4 · Après — jamais pendant l'expérience */}
        {!breathing && (
          <section className="px-5 pt-12">
            <p className="mono-label px-1">Après</p>
            <ul className="craft mt-3 px-5">
              {[
                { to: "/care/journal", title: "Déposer quelques mots" },
                { to: "/help/corps", title: "Prendre soin du corps" },
                { to: "/presence", title: "Se confier" },
              ].map((l) => (
                <li
                  key={l.to}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}
                >
                  <Link to={l.to as "/care"} className="flex items-center justify-between gap-4 py-4">
                    <span className="font-serif text-[17.5px] leading-[1.2]">{l.title}</span>
                    <span aria-hidden className="text-dusk/30">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </Shell>
  );
}
