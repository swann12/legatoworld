import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead, ListBlock, RowInner } from "@/components/legato/EditorialUI";
import { EMOTIONS, useLegato, type Emotion } from "@/lib/legato-state";
import { EMOTION_CONTENT, intensityWords, CRISIS_THRESHOLD, type EmotionPath } from "@/lib/emotion-content";
import { loadIntensity, saveIntensity } from "@/lib/emotion-intensity";

export const Route = createFileRoute("/care/emotions")({
  head: () => ({
    meta: [
      { title: "Check-in — Legato" },
      { name: "description", content: "Nommer ce qui est là, en jauger la force, et trouver ce qui peut aider maintenant." },
      { property: "og:title", content: "Check-in — Legato" },
      { property: "og:description", content: "Nommer ce qui est là, et trouver ce qui peut aider maintenant." },
    ],
  }),
  component: CareEmotions,
});

/* Ordre de priorité pour choisir l'émotion qui guide les propositions. */
const PRIORITY: Emotion[] = [
  "besoin_aide", "peur", "anxiete", "culpabilite", "sideration", "colere",
  "solitude", "tristesse", "fatigue", "vide", "confusion", "nostalgie",
  "soulagement", "besoin_calme",
];

function CareEmotions() {
  const { currentEmotions, setCurrentEmotions } = useLegato();
  const [intensity, setIntensity] = useState(5);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const v = loadIntensity();
    if (v) setIntensity(v);
  }, []);

  const toggle = (id: Emotion) => {
    setCurrentEmotions(
      currentEmotions.includes(id) ? currentEmotions.filter((e) => e !== id) : [...currentEmotions, id],
    );
    setTouched(true);
  };

  const setLevel = (v: number) => {
    setIntensity(v);
    saveIntensity(v);
    setTouched(true);
  };

  const lead = useMemo<Emotion | null>(() => {
    for (const p of PRIORITY) if (currentEmotions.includes(p)) return p;
    return currentEmotions[0] ?? null;
  }, [currentEmotions]);

  const paths = useMemo<EmotionPath[]>(() => {
    if (!lead) return [];
    const seen = new Set<string>();
    const out: EmotionPath[] = [];
    for (const e of [lead, ...currentEmotions.filter((x) => x !== lead)]) {
      for (const p of EMOTION_CONTENT[e].paths) {
        if (seen.has(p.to)) continue;
        seen.add(p.to);
        out.push(p);
      }
    }
    return out.slice(0, 4);
  }, [lead, currentEmotions]);

  const heavy = intensity >= CRISIS_THRESHOLD || currentEmotions.includes("besoin_aide");

  return (
    <Shell livingBg={false}>
      <div className="wash-blush min-h-dvh text-dusk pb-36">
        <PageHeader back="/care" title="CHECK-IN" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Ce qui est là,{" "}
            <span className="italic" style={{ color: "var(--terracotta)" }}>maintenant</span>.
          </h1>
          <p className="mt-4 max-w-[30ch] text-[13px] leading-[1.6] text-dusk/60">
            Nommez, puis dites à quel point. Legato ajuste ce qu'il vous propose.
          </p>
        </section>

        {/* 01 — Nommer */}
        <section className="px-5 pt-9">
          <SectionHead label="01 · Ce que vous ressentez" meta={currentEmotions.length ? `${currentEmotions.length} choisi${currentEmotions.length > 1 ? "s" : ""}` : "plusieurs possibles"} />
          <div className="mt-4 flex flex-wrap gap-2">
            {EMOTIONS.map((e) => {
              const on = currentEmotions.includes(e.id);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggle(e.id)}
                  aria-pressed={on}
                  className="rounded-full px-4 py-2 text-[13.5px] transition-colors"
                  style={{
                    background: on ? "var(--bordeaux)" : "var(--whisper)",
                    color: on ? "var(--paper)" : "color-mix(in oklab, var(--dusk) 78%, transparent)",
                    boxShadow: on ? "none" : "0 0 0 1px color-mix(in oklab, var(--dusk) 12%, transparent)",
                  }}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 02 — Jauger */}
        {currentEmotions.length > 0 && (
          <section className="px-5 pt-10">
            <SectionHead label="02 · À quel point" meta={`${intensity} / 10`} />

            <div className="craft mt-4 px-5 pt-6 pb-5">
              <div className="flex items-baseline justify-between">
                <p className="font-serif text-[46px] leading-none tabular-nums">{intensity}</p>
                <p className="font-serif text-[17px] italic text-dusk/70">{intensityWords(intensity)}</p>
              </div>

              {/* Règle graduée — chaque graduation est cliquable */}
              <div className="mt-6 flex items-end gap-[3px]">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                  const on = n <= intensity;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setLevel(n)}
                      aria-label={`Intensité ${n} sur 10`}
                      className="flex-1 rounded-t-[2px] transition-all"
                      style={{
                        height: 16 + n * 3,
                        background: on ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 12%, transparent)",
                        opacity: on ? 0.35 + (n / 10) * 0.65 : 1,
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-[10.5px] tracking-[0.12em] text-dusk/40">
                <span>À PEINE</span>
                <span>ÇA DÉBORDE</span>
              </div>
            </div>
          </section>
        )}

        {/* 03 — Ce qui peut aider */}
        {lead && (
          <section className="px-5 pt-10">
            <SectionHead label="03 · Ce qui peut aider" />

            <p className="mt-4 px-1 font-serif text-[19px] leading-[1.35]">{EMOTION_CONTENT[lead].note}</p>

            <ListBlock className="mt-5">
              {paths.map((p, i) => (
                <li
                  key={p.to}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                >
                  <Link to={p.to as "/care"} className="flex items-start gap-4 py-4 transition-opacity active:opacity-70">
                    <RowInner index={i + 1} title={p.label} note={p.hint} meta={p.minutes ? `${p.minutes} min` : undefined} />
                  </Link>
                </li>
              ))}
            </ListBlock>

            {heavy && (
              <Link
                to="/crisis"
                className="mt-4 block rounded-[18px] px-5 py-4"
                style={{ background: "var(--terracotta)", color: "var(--paper)" }}
              >
                <p className="mono-label" style={{ color: "color-mix(in oklab, var(--paper) 75%, transparent)" }}>
                  Si c'est trop
                </p>
                <p className="mt-1 font-serif text-[19px] leading-[1.15]">Parler à quelqu'un, tout de suite →</p>
              </Link>
            )}
          </section>
        )}

        {/* Sortie */}
        <section className="px-5 pt-10">
          <Link
            to="/care"
            className="craft flex items-center justify-between px-5 py-4"
          >
            <span className="font-serif text-[17px]">{touched ? "C'est noté, revenir au Soutien" : "Revenir au Soutien"}</span>
            <span aria-hidden className="text-dusk/35">→</span>
          </Link>
          <p className="mt-4 px-1 text-center text-[12px] italic text-dusk/45">
            Rien n'est comparé, rien n'est noté ailleurs. C'est pour vous.
          </p>
        </section>
      </div>
    </Shell>
  );
}
