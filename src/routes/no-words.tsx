import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { similarAmbiances } from "@/lib/ambiance.functions";

export const Route = createFileRoute("/no-words")({
  head: () => ({ meta: [{ title: "Sans mots — Legato" }] }),
  component: NoWords,
});

type Motion = "drift" | "ripple" | "pulse" | "rain" | "veil";

type Texture = {
  id: string;
  title: string;
  whisper: string;
  asmr: string;
  motion: Motion;
  palette: [string, string, string];
  generated?: boolean;
};

const BASE: Texture[] = [
  {
    id: "warmth",
    title: "Chaleur lente",
    whisper: "Comme une main posée sur l'épaule.",
    asmr: "Souffle long, près d'un foyer",
    motion: "pulse",
    palette: ["var(--peach)", "var(--rose)", "var(--lavender)"],
  },
  {
    id: "ocean",
    title: "Marée intérieure",
    whisper: "Aller, revenir, à votre rythme.",
    asmr: "Vagues posées sur le sable",
    motion: "ripple",
    palette: ["var(--mist)", "var(--lavender)", "var(--paper)"],
  },
  {
    id: "forest",
    title: "Forêt qui respire",
    whisper: "Le vert se balance, sans bruit.",
    asmr: "Vent doux dans les feuilles",
    motion: "drift",
    palette: ["var(--sage)", "var(--mist)", "var(--dusk)"],
  },
  {
    id: "rain",
    title: "Pluie au carreau",
    whisper: "Tout s'apaise, à l'abri.",
    asmr: "Pluie continue derrière la vitre",
    motion: "rain",
    palette: ["var(--mist)", "var(--dusk)", "var(--mist)"],
  },
  {
    id: "moon",
    title: "Veillée",
    whisper: "Une lumière reste allumée pour vous.",
    asmr: "Silence sous les étoiles",
    motion: "veil",
    palette: ["var(--lavender)", "var(--dusk)", "var(--paper)"],
  },
  {
    id: "candle",
    title: "Bougie qui veille",
    whisper: "Une petite flamme suffit, ce soir.",
    asmr: "Cire qui crépite à voix basse",
    motion: "pulse",
    palette: ["var(--peach)", "var(--rose)", "var(--paper)"],
  },
  {
    id: "tea",
    title: "Thé qui infuse",
    whisper: "L'eau prend la couleur du temps.",
    asmr: "Eau versée dans une tasse",
    motion: "drift",
    palette: ["var(--peach)", "var(--mist)", "var(--sage)"],
  },
  {
    id: "wool",
    title: "Laine épaisse",
    whisper: "Posez tout, juste un instant.",
    asmr: "Aiguilles qui tricotent doucement",
    motion: "veil",
    palette: ["var(--rose)", "var(--peach)", "var(--lavender)"],
  },
  {
    id: "snow",
    title: "Neige qui tombe",
    whisper: "Le monde se feutre autour de vous.",
    asmr: "Pas légers sur la neige fraîche",
    motion: "rain",
    palette: ["var(--paper)", "var(--mist)", "var(--lavender)"],
  },
  {
    id: "wind",
    title: "Voile au vent",
    whisper: "Quelque chose respire, dehors.",
    asmr: "Tissu qui bouge à la fenêtre",
    motion: "drift",
    palette: ["var(--mist)", "var(--paper)", "var(--lavender)"],
  },
];

function bgFromPalette(p: [string, string, string], motion: Motion) {
  if (motion === "pulse")
    return `radial-gradient(circle at 30% 30%, ${p[0]}, ${p[1]} 55%, ${p[2]} 100%)`;
  if (motion === "ripple")
    return `linear-gradient(180deg, ${p[2]}, color-mix(in oklab, ${p[1]} 70%, ${p[0]}))`;
  if (motion === "drift")
    return `radial-gradient(ellipse at 60% 40%, ${p[0]}, color-mix(in oklab, ${p[1]} 60%, ${p[2]} 30%))`;
  if (motion === "rain")
    return `linear-gradient(180deg, color-mix(in oklab, ${p[1]} 70%, ${p[2]}), ${p[0]})`;
  return `radial-gradient(circle at 60% 30%, color-mix(in oklab, ${p[0]} 70%, white), color-mix(in oklab, ${p[1]} 30%, ${p[2]}))`;
}

function NoWords() {
  const { t } = useLegato();
  const [deck, setDeck] = useState<Texture[]>(BASE);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const startX = useRef<number | null>(null);

  const tex = deck[index];
  const next = () => setIndex((i) => (i + 1) % deck.length);
  const prev = () => setIndex((i) => (i - 1 + deck.length) % deck.length);

  const fetchSimilar = useServerFn(similarAmbiances);

  // ----- Ambient audio (procedural, Web Audio) -----
  const audioRef = useRef<AmbientAudio | null>(null);
  useEffect(() => {
    return () => {
      audioRef.current?.stop();
      audioRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (!playing) {
      audioRef.current?.stop();
      audioRef.current = null;
      return;
    }
    audioRef.current?.stop();
    audioRef.current = createAmbientAudio(tex.motion);
    audioRef.current?.start();
  }, [playing, tex.motion, tex.id]);

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    startX.current = null;
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") setPlaying((p) => !p);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [deck.length]);

  const onLoveAndExtend = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setAiError(null);
    try {
      const res = await fetchSimilar({
        data: {
          title: tex.title,
          whisper: tex.whisper,
          asmr: tex.asmr,
          motion: tex.motion,
        },
      });
      if (res.error || !res.variations?.length) {
        setAiError(res.error ?? "Aucune variation pour l'instant.");
      } else {
        const newOnes: Texture[] = res.variations.map((v, i) => ({
          id: `ai-${Date.now()}-${i}`,
          title: v.title,
          whisper: v.whisper,
          asmr: v.asmr,
          motion: (["drift", "ripple", "pulse", "rain", "veil"].includes(v.motion)
            ? v.motion
            : tex.motion) as Motion,
          palette: (v.palette.length === 3 ? v.palette : tex.palette) as [string, string, string],
          generated: true,
        }));
        setDeck((d) => {
          const copy = [...d];
          copy.splice(index + 1, 0, ...newOnes);
          return copy;
        });
      }
    } catch {
      setAiError("Le service n'a pas répondu.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Shell hideNav>
      <div
        className="relative min-h-dvh flex flex-col select-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* Immersive background — sits inside the page, above Shell's bg-paper */}
        <div
          className="absolute inset-0 transition-[background] duration-[1400ms] ease-out"
          style={{ background: bgFromPalette(tex.palette, tex.motion) }}
        />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <MotionLayer kind={tex.motion} accent={tex.palette[0]} />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 110%, rgba(40,30,40,0.18), transparent 55%)",
          }}
        />
        <div className="relative z-10 flex flex-col flex-1 min-h-dvh">
        {/* Top bar */}
        <div className="px-6 pt-8 flex items-center justify-between">
          <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/60">
            ← {t("nav.home")}
          </Link>
          <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
            {index + 1} / {deck.length}
          </span>
        </div>

        <div className="px-7 pt-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/55">
            {t("nowords.title")}
          </p>
          <h1
            className="mt-2 font-serif text-[1.55rem] leading-[1.18] font-light text-dusk max-w-[22ch]"
            style={{ textWrap: "balance" }}
          >
            Laissez-vous porter, sans rien chercher.
          </h1>
        </div>

        {/* Breathing guide overlay */}
        {breathing && <BreathingGuide onClose={() => setBreathing(false)} />}

        {/* Floating info — translucent, no opaque white panel */}
        <div className="flex-1" />

        <div className="px-7 pb-2">
          <div className="max-w-[34ch]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/55">
              {playing ? "Ambiance en cours" : "En silence"}
              {tex.generated && <span className="ml-2 text-dusk/40">· proposée pour vous</span>}
            </p>
            <h2
              className="mt-2 font-serif italic text-[26px] leading-[1.15] text-dusk"
              style={{ textWrap: "balance", textShadow: "0 1px 18px rgba(255,255,255,0.45)" }}
            >
              {tex.title}
            </h2>
            <p
              className="mt-2 text-[14px] leading-relaxed text-dusk/80"
              style={{ textWrap: "pretty" }}
            >
              {tex.whisper}
            </p>
            <p className="mt-3 text-[12px] text-dusk/60 italic" style={{ textWrap: "pretty" }}>
              Son · {tex.asmr.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <button
            onClick={prev}
            className="size-11 rounded-full flex items-center justify-center text-dusk/75 text-lg backdrop-blur-md"
            style={{ background: "color-mix(in oklab, var(--paper) 32%, transparent)" }}
            aria-label="Ambiance précédente"
          >
            ←
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex-1 px-5 py-3.5 text-center backdrop-blur-md rounded-full"
            style={{
              background: "color-mix(in oklab, var(--paper) 38%, transparent)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <p className="font-serif italic text-dusk text-[15px]">
              {playing ? "Mettre en pause" : "Écouter ce son"}
            </p>
          </button>
          <button
            onClick={next}
            className="size-11 rounded-full flex items-center justify-center text-dusk/75 text-lg backdrop-blur-md"
            style={{ background: "color-mix(in oklab, var(--paper) 32%, transparent)" }}
            aria-label="Ambiance suivante"
          >
            →
          </button>
        </div>

        {/* Secondary actions */}
        <div className="px-6 pb-4 flex items-center gap-3">
          <button
            onClick={() => setBreathing(true)}
            className="flex-1 py-3 rounded-full text-[12.5px] text-dusk/85 backdrop-blur-md"
            style={{ background: "color-mix(in oklab, var(--paper) 28%, transparent)" }}
          >
            Respirer avec moi
          </button>
          <button
            onClick={onLoveAndExtend}
            disabled={loadingMore}
            className="flex-1 py-3 rounded-full text-[12.5px] text-dusk/85 backdrop-blur-md disabled:opacity-60"
            style={{ background: "color-mix(in oklab, var(--paper) 28%, transparent)" }}
          >
            {loadingMore ? "Une voix douce arrive…" : "♡ J'aime — prolonger"}
          </button>
        </div>
        {aiError && (
          <p className="px-7 pb-3 text-[11px] text-dusk/60 italic">{aiError}</p>
        )}

        {/* Dots */}
        <div className="pb-7 pt-1 flex justify-center gap-1.5">
          {deck.map((tx, i) => (
            <span
              key={tx.id}
              className={`h-[3px] rounded-full transition-all ${
                i === index ? "w-6 bg-dusk/70" : "w-2 bg-dusk/25"
              }`}
            />
          ))}
        </div>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- Breathing guide ---------- */
function BreathingGuide({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  useEffect(() => {
    let cancelled = false;
    const cycle = async () => {
      while (!cancelled) {
        setPhase("in");
        await wait(4000);
        if (cancelled) return;
        setPhase("hold");
        await wait(2000);
        if (cancelled) return;
        setPhase("out");
        await wait(6000);
      }
    };
    cycle();
    return () => {
      cancelled = true;
    };
  }, []);

  const label =
    phase === "in" ? "Inspirez" : phase === "hold" ? "Suspendez" : "Expirez";
  const scale = phase === "in" ? 1 : phase === "hold" ? 1 : 0.55;
  const duration = phase === "in" ? 4000 : phase === "hold" ? 2000 : 6000;

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-sm"
         style={{ background: "color-mix(in oklab, var(--paper) 25%, transparent)" }}>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[11px] uppercase tracking-[0.22em] text-dusk/65"
      >
        Fermer
      </button>
      <div className="relative size-[260px] flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, color-mix(in oklab, var(--peach) 70%, white), transparent 70%)",
            transform: `scale(${scale})`,
            transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.4, 1)`,
            filter: "blur(2px)",
          }}
        />
        <div
          className="absolute inset-6 rounded-full border border-white/60"
          style={{
            transform: `scale(${scale})`,
            transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.4, 1)`,
          }}
        />
        <p className="relative font-serif italic text-dusk text-[22px]">{label}</p>
      </div>
      <p className="mt-10 text-[12px] text-dusk/65 max-w-[26ch] text-center"
         style={{ textWrap: "balance" }}>
        Quatre temps pour entrer, deux pour rester, six pour relâcher.
      </p>
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/* ---------- Background motion (full screen) ---------- */
function MotionLayer({ kind, accent }: { kind: Motion; accent: string }) {
  if (kind === "pulse") {
    return (
      <>
        <div
          className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full breath halo-lg"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)`, animationDuration: "7s" }}
        />
        <div
          className="absolute left-1/2 top-1/2 size-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full breath"
          style={{ background: `radial-gradient(circle, white, transparent 70%)`, animationDuration: "5s", opacity: 0.45 }}
        />
      </>
    );
  }
  if (kind === "ripple") {
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25"
            style={{
              width: `${28 + i * 22}vmin`,
              aspectRatio: "1",
              animation: `legato-breath 7s ease-in-out ${i * 1.2}s infinite`,
            }}
          />
        ))}
      </>
    );
  }
  if (kind === "drift") {
    return (
      <>
        <div className="absolute -top-[15vmin] -left-[15vmin] size-[70vmin] rounded-full halo-lg drift opacity-70"
             style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
        <div className="absolute -bottom-[15vmin] -right-[10vmin] size-[80vmin] rounded-full halo-lg drift opacity-55"
             style={{ background: `radial-gradient(circle, white, transparent 70%)`, animationDuration: "18s" }} />
      </>
    );
  }
  if (kind === "rain") {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 38 }).map((_, i) => {
          const x = (i * 5.7) % 100;
          const delay = (i % 12) * 0.25;
          return (
            <line
              key={i}
              x1={x}
              y1={-5}
              x2={x - 3}
              y2={20}
              stroke="white"
              strokeWidth="0.4"
              opacity="0.45"
              style={{ animation: `legato-rain 1.6s linear ${delay}s infinite` }}
            />
          );
        })}
      </svg>
    );
  }
  return (
    <>
      <div className="absolute inset-0 mix-blend-soft-light opacity-60"
           style={{ background: `radial-gradient(circle at 30% 80%, ${accent}, transparent 60%)` }} />
      <div className="absolute -top-[10vmin] left-1/2 -translate-x-1/2 size-[60vmin] rounded-full halo-lg"
           style={{ background: `radial-gradient(circle, white, transparent 70%)`, opacity: 0.45 }} />
    </>
  );
}