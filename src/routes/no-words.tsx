import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/no-words")({
  head: () => ({ meta: [{ title: "Sans mots — Legato" }] }),
  component: NoWords,
});

type Texture = {
  id: string;
  title: { fr: string; en: string };
  whisper: { fr: string; en: string };
  bg: string;          // CSS background
  accent: string;
  motion: "drift" | "ripple" | "pulse" | "rain" | "veil";
  asmr: { fr: string; en: string };
};

const TEXTURES: Texture[] = [
  {
    id: "warmth",
    title: { fr: "Chaleur lente", en: "Slow warmth" },
    whisper: { fr: "Comme une main posée sur l'épaule.", en: "Like a hand resting on your shoulder." },
    bg: "radial-gradient(circle at 30% 30%, var(--peach), var(--rose) 60%, var(--lavender) 100%)",
    accent: "var(--peach)",
    motion: "pulse",
    asmr: { fr: "Souffle long, près d'un feu", en: "Long breath, by a fire" },
  },
  {
    id: "ocean",
    title: { fr: "Marée intérieure", en: "Inner tide" },
    whisper: { fr: "Aller, revenir, à votre rythme.", en: "Going, returning, at your own pace." },
    bg: "linear-gradient(180deg, var(--mist), color-mix(in oklab, var(--lavender) 60%, var(--paper)))",
    accent: "var(--mist)",
    motion: "ripple",
    asmr: { fr: "Vagues posées sur le sable", en: "Waves resting on sand" },
  },
  {
    id: "forest",
    title: { fr: "Forêt qui respire", en: "Breathing forest" },
    whisper: { fr: "Le vert se balance, sans bruit.", en: "Green sways, without sound." },
    bg: "radial-gradient(ellipse at 60% 40%, var(--sage), color-mix(in oklab, var(--sage) 60%, var(--dusk) 20%))",
    accent: "var(--sage)",
    motion: "drift",
    asmr: { fr: "Vent doux dans les feuilles", en: "Soft wind in the leaves" },
  },
  {
    id: "rain",
    title: { fr: "Pluie au carreau", en: "Rain on glass" },
    whisper: { fr: "Tout s'apaise, à l'abri.", en: "Everything settles, sheltered." },
    bg: "linear-gradient(180deg, color-mix(in oklab, var(--mist) 70%, var(--dusk) 10%), var(--mist))",
    accent: "var(--mist)",
    motion: "rain",
    asmr: { fr: "Pluie continue, derrière la vitre", en: "Steady rain, behind the window" },
  },
  {
    id: "moon",
    title: { fr: "Veillée", en: "Vigil" },
    whisper: { fr: "Une lumière reste allumée pour vous.", en: "A light is still on, for you." },
    bg: "radial-gradient(circle at 60% 30%, color-mix(in oklab, var(--lavender) 70%, white), color-mix(in oklab, var(--dusk) 30%, var(--lavender)))",
    accent: "var(--lavender)",
    motion: "veil",
    asmr: { fr: "Silence sous les étoiles", en: "Silence under the stars" },
  },
];

function NoWords() {
  const { t, lang } = useLegato();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const startX = useRef<number | null>(null);

  const tex = TEXTURES[index];
  const next = () => setIndex((i) => (i + 1) % TEXTURES.length);
  const prev = () => setIndex((i) => (i - 1 + TEXTURES.length) % TEXTURES.length);

  const onPointerDown = (e: React.PointerEvent) => { startX.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    startX.current = null;
  };

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <Shell hideNav>
      <div className="relative min-h-dvh flex flex-col bg-paper">
        {/* Top bar */}
        <div className="px-6 pt-8 flex items-center justify-between z-20 relative">
          <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/55">
            ← {t("nav.home")}
          </Link>
          <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
            {index + 1} / {TEXTURES.length}
          </span>
        </div>

        <div className="px-7 pt-7">
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
            {t("nowords.title")}
          </p>
          <h1
            className="mt-2 font-serif text-[1.7rem] leading-[1.18] font-light text-dusk max-w-[24ch]"
            style={{ textWrap: "balance" }}
          >
            {t("nowords.subtitle")}
          </h1>
        </div>

        {/* Texture card */}
        <div
          className="flex-1 flex items-center justify-center px-5 mt-8 select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "3 / 4",
              borderRadius: 36,
              background: tex.bg,
              boxShadow:
                "inset 0 4px 10px rgba(255,255,255,0.4), 0 30px 60px -25px rgba(60,40,40,0.35)",
            }}
          >
            <Motion kind={tex.motion} accent={tex.accent} />
            {/* center title plate — translucent over the texture */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div
                className="px-6 py-5 backdrop-blur-md"
                style={{
                  borderRadius: 22,
                  background: "color-mix(in oklab, var(--paper) 55%, transparent)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/55">
                  {playing
                    ? lang === "fr" ? "Ambiance en cours" : "Ambience playing"
                    : lang === "fr" ? "En silence" : "In silence"}
                </p>
                <h3
                  className="mt-2 font-serif text-[22px] italic text-dusk leading-snug"
                  style={{ textWrap: "balance" }}
                >
                  {tex.title[lang]}
                </h3>
                <p
                  className="mt-1.5 text-[13.5px] text-dusk/75 leading-relaxed"
                  style={{ textWrap: "pretty" }}
                >
                  {tex.whisper[lang]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 pb-10 mt-6 flex items-center gap-3">
          <button
            onClick={prev}
            className="paper-card size-12 rounded-full flex items-center justify-center text-dusk/70 text-lg"
            aria-label="Précédent"
          >
            ←
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="ceramic organic-radius-3 flex-1 px-5 py-4 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              {t("nowords.sound")} · ASMR
            </p>
            <p className="mt-1 font-serif italic text-dusk">
              {playing ? (lang === "fr" ? "Mettre en pause" : "Pause") : tex.asmr[lang]}
            </p>
          </button>
          <button
            onClick={next}
            className="paper-card size-12 rounded-full flex items-center justify-center text-dusk/70 text-lg"
            aria-label="Suivant"
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div className="pb-6 flex justify-center gap-1.5">
          {TEXTURES.map((tx, i) => (
            <span
              key={tx.id}
              className={`h-[3px] rounded-full transition-all ${
                i === index ? "w-6 bg-dusk/70" : "w-2 bg-dusk/20"
              }`}
            />
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* Animated layers — subtle, never gadget */
function Motion({ kind, accent }: { kind: Texture["motion"]; accent: string }) {
  if (kind === "pulse") {
    return (
      <>
        <div
          className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full breath halo-lg"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)`, animationDuration: "7s" }}
        />
        <div
          className="absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full breath"
          style={{ background: `radial-gradient(circle, white, transparent 70%)`, animationDuration: "5s", opacity: 0.5 }}
        />
      </>
    );
  }
  if (kind === "ripple") {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
            style={{
              width: `${30 + i * 30}%`,
              aspectRatio: "1",
              animation: `legato-breath 6s ease-in-out ${i * 1.2}s infinite`,
            }}
          />
        ))}
      </>
    );
  }
  if (kind === "drift") {
    return (
      <>
        <div className="absolute -top-10 -left-10 size-72 rounded-full halo-lg drift opacity-70" style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
        <div className="absolute -bottom-12 -right-10 size-80 rounded-full halo-lg drift opacity-60" style={{ background: `radial-gradient(circle, white, transparent 70%)`, animationDuration: "18s" }} />
      </>
    );
  }
  if (kind === "rain") {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 30 }).map((_, i) => {
          const x = (i * 7.3) % 100;
          const delay = (i % 10) * 0.3;
          return (
            <line
              key={i} x1={x} y1={-5} x2={x - 3} y2={20} stroke="white" strokeWidth="0.4" opacity="0.5"
              style={{ animation: `legato-rain 1.6s linear ${delay}s infinite` }}
            />
          );
        })}
      </svg>
    );
  }
  // veil
  return (
    <>
      <div className="absolute inset-0 mix-blend-soft-light opacity-60" style={{ background: `radial-gradient(circle at 30% 80%, ${accent}, transparent 60%)` }} />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 size-64 rounded-full halo-lg" style={{ background: `radial-gradient(circle, white, transparent 70%)`, opacity: 0.5 }} />
    </>
  );
}
