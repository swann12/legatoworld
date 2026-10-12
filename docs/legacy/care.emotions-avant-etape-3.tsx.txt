import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";
import { EMOTIONS, useLegato, type Emotion } from "@/lib/legato-state";
import { EMOTION_CONTENT, intensityWords, CRISIS_THRESHOLD, type EmotionPath } from "@/lib/emotion-content";
import { loadIntensity, saveIntensity } from "@/lib/emotion-intensity";
import {
  MECHANISM, DURATIONS, DURATION_NOTE, MOMENTS, MOMENT_NOTE, MOMENT_PATH,
  BODY_SIGNALS, BODY_PATH, PATH_DETAIL,
  type Duration, type Moment, type BodySignal,
} from "@/lib/emotion-depth";
import { loadCheckin, saveCheckin } from "@/lib/checkin-store";

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

/* Mêmes tuiles que l'onboarding : grille de trois, aplat terracotta quand c'est choisi. */
function Tile({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="flex min-h-[68px] w-full items-center justify-center rounded-[10px] border p-2 text-center text-[12.5px] leading-[1.2] transition-colors"
      style={{
        background: on ? "var(--terracotta)" : "transparent",
        borderColor: on ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 12%, transparent)",
        color: on ? "var(--paper)" : "var(--dusk)",
      }}
    >
      {label}
    </button>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="rounded-full border px-4 py-2 text-[12.5px] transition-colors"
      style={{
        background: on ? "var(--bordeaux)" : "transparent",
        borderColor: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 14%, transparent)",
        color: on ? "var(--paper)" : "color-mix(in oklab, var(--dusk) 75%, transparent)",
      }}
    >
      {label}
    </button>
  );
}

type Proposal = { label: string; detail: string; to: string; minutes?: number; source: string };

function CareEmotions() {
  const { currentEmotions, setCurrentEmotions } = useLegato();
  const [intensity, setIntensity] = useState(5);
  const [duration, setDuration] = useState<Duration | null>(null);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [body, setBody] = useState<BodySignal[]>([]);
  const [own, setOwn] = useState("");

  useEffect(() => {
    const v = loadIntensity();
    if (v) setIntensity(v);
    const c = loadCheckin();
    setDuration(c.duration);
    setMoment(c.moment);
    setBody(c.body);
    try {
      const raw = window.localStorage.getItem("lg.otherEmotion");
      if (raw) setOwn(JSON.parse(raw));
    } catch { /* stockage indisponible */ }
  }, []);

  const persist = (next: Partial<{ duration: Duration | null; moment: Moment | null; body: BodySignal[] }>) => {
    const merged = { duration, moment, body, ...next };
    setDuration(merged.duration);
    setMoment(merged.moment);
    setBody(merged.body);
    saveCheckin(merged);
  };

  const toggle = (id: Emotion) =>
    setCurrentEmotions(
      currentEmotions.includes(id) ? currentEmotions.filter((e) => e !== id) : [...currentEmotions, id],
    );

  const setLevel = (v: number) => { setIntensity(v); saveIntensity(v); };

  const saveOwn = (v: string) => {
    setOwn(v);
    try {
      if (v.trim()) window.localStorage.setItem("lg.otherEmotion", JSON.stringify(v.trim()));
      else window.localStorage.removeItem("lg.otherEmotion");
    } catch { /* stockage indisponible */ }
  };

  const lead = useMemo<Emotion | null>(() => {
    for (const p of PRIORITY) if (currentEmotions.includes(p)) return p;
    return currentEmotions[0] ?? null;
  }, [currentEmotions]);

  /* Les propositions viennent de trois sources : l'émotion, le corps, le moment.
     Elles sont dédoublonnées et limitées à cinq pour ne jamais saturer. */
  const proposals = useMemo<Proposal[]>(() => {
    const seen = new Set<string>();
    const out: Proposal[] = [];
    const push = (p: { label: string; detail?: string; to: string; minutes?: number }, source: string) => {
      if (seen.has(p.to)) return;
      seen.add(p.to);
      out.push({
        label: p.label,
        detail: p.detail ?? PATH_DETAIL[p.to] ?? "",
        to: p.to,
        minutes: p.minutes,
        source,
      });
    };

    for (const s of body) push(BODY_PATH[s], "Pour le corps");
    if (moment) push(MOMENT_PATH[moment], MOMENTS.find((m) => m.id === moment)!.label);
    if (lead) {
      const emotionPaths: EmotionPath[] = [
        ...EMOTION_CONTENT[lead].paths,
        ...currentEmotions.filter((e) => e !== lead).flatMap((e) => EMOTION_CONTENT[e].paths),
      ];
      for (const p of emotionPaths) push({ label: p.label, detail: PATH_DETAIL[p.to] ?? p.hint, to: p.to, minutes: p.minutes }, "Pour ce que vous ressentez");
    }
    return out.slice(0, 5);
  }, [lead, currentEmotions, body, moment]);

  const heavy = intensity >= CRISIS_THRESHOLD || currentEmotions.includes("besoin_aide");
  const precision = [currentEmotions.length > 0, true, duration !== null, moment !== null, body.length > 0].filter(Boolean).length;

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <PageHeader back="/care" title="CHECK-IN" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Comment vous sentez-vous{" "}
            <span className="italic" style={{ color: "var(--terracotta)" }}>aujourd'hui</span>&nbsp;?
          </h1>
          <p className="mt-4 max-w-[32ch] text-[13px] leading-[1.6] text-dusk/60">
            Plus vous précisez, plus ce que Legato propose ensuite vous ressemble. Rien n'est obligatoire.
          </p>
        </section>

        {/* 01 — Nommer */}
        <section className="px-5 pt-9">
          <SectionHead
            label="01 · Ce que vous ressentez"
            meta={currentEmotions.length ? `${currentEmotions.length} choisi${currentEmotions.length > 1 ? "s" : ""}` : "plusieurs possibles"}
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {EMOTIONS.map((e) => (
              <Tile key={e.id} label={e.label} on={currentEmotions.includes(e.id)} onClick={() => toggle(e.id)} />
            ))}
          </div>
          <input
            value={own}
            onChange={(ev) => saveOwn(ev.target.value)}
            placeholder="Ou nommez-le avec vos mots"
            className="mt-2.5 h-[46px] w-full rounded-[10px] border bg-transparent px-4 text-[13px] outline-none"
            style={{ borderColor: "color-mix(in oklab, var(--dusk) 12%, transparent)" }}
          />
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
                        opacity: on ? 0.4 + (n / 10) * 0.6 : 1,
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

        {/* 03 — Depuis quand */}
        {currentEmotions.length > 0 && (
          <section className="px-5 pt-10">
            <SectionHead label="03 · Depuis quand" />
            <div className="mt-4 flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <Chip key={d.id} label={d.label} on={duration === d.id} onClick={() => persist({ duration: duration === d.id ? null : d.id })} />
              ))}
            </div>
            {duration && (
              <p className="mt-4 px-1 text-[13px] leading-[1.6] text-dusk/65">{DURATION_NOTE[duration]}</p>
            )}
          </section>
        )}

        {/* 04 — Quand c'est le plus fort */}
        {currentEmotions.length > 0 && (
          <section className="px-5 pt-10">
            <SectionHead label="04 · Quand c'est le plus fort" />
            <div className="mt-4 flex flex-wrap gap-2">
              {MOMENTS.map((m) => (
                <Chip key={m.id} label={m.label} on={moment === m.id} onClick={() => persist({ moment: moment === m.id ? null : m.id })} />
              ))}
            </div>
            {moment && (
              <p className="mt-4 px-1 text-[13px] leading-[1.6] text-dusk/65">{MOMENT_NOTE[moment]}</p>
            )}
          </section>
        )}

        {/* 05 — Le corps */}
        {currentEmotions.length > 0 && (
          <section className="px-5 pt-10">
            <SectionHead label="05 · Ce que ça fait au corps" meta={body.length ? `${body.length}` : "facultatif"} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {BODY_SIGNALS.map((s) => (
                <Tile
                  key={s.id}
                  label={s.label}
                  on={body.includes(s.id)}
                  onClick={() => persist({ body: body.includes(s.id) ? body.filter((b) => b !== s.id) : [...body, s.id] })}
                />
              ))}
            </div>
          </section>
        )}

        {/* Ce qui se passe */}
        {lead && (
          <section className="px-5 pt-12">
            <SectionHead label="Ce qui se passe" meta={EMOTIONS.find((e) => e.id === lead)?.label} />
            <div className="tint-sand mt-4 rounded-[18px] px-6 py-6">
              <p className="font-serif text-[19px] leading-[1.35]">{EMOTION_CONTENT[lead].note}</p>
              <p className="mt-4 text-[13.5px] leading-[1.65] text-dusk/75">{MECHANISM[lead]}</p>
            </div>
          </section>
        )}

        {/* Ce qui peut aider */}
        {lead && (
          <section className="px-5 pt-10">
            <SectionHead
              label="Ce qui peut aider maintenant"
              meta={precision >= 4 ? "adapté à vos réponses" : "précisez pour affiner"}
            />
            <ul className="mt-4">
              {proposals.map((p, i) => (
                <li
                  key={p.to}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}
                >
                  <Link to={p.to as "/care"} className="block py-5 transition-opacity active:opacity-70">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="mono-label">{p.source}</p>
                      <span className="text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-2 font-serif text-[19px] leading-[1.2]">{p.label}</p>
                    <p className="mt-1.5 max-w-[38ch] text-[13px] leading-[1.6] text-dusk/65">{p.detail}</p>
                    {p.minutes && (
                      <p className="mt-2 text-[11.5px] tracking-[0.1em] text-dusk/40">{p.minutes} MIN</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {heavy && (
              <Link
                to="/crisis"
                className="mt-6 block rounded-[18px] px-5 py-4"
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
        <section className="px-5 pt-12">
          <Link to="/care" className="craft flex items-center justify-between px-5 py-4">
            <span className="font-serif text-[17px]">C'est noté, revenir au Soutien</span>
            <span aria-hidden className="text-dusk/35">→</span>
          </Link>
          <p className="mt-4 px-1 text-center text-[12px] italic text-dusk/45">
            Rien n'est comparé, rien n'est partagé. C'est pour vous.
          </p>
        </section>
      </div>
    </Shell>
  );
}
