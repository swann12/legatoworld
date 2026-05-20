import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { similarAmbiances } from "@/lib/ambiance.functions";

export const Route = createFileRoute("/no-words")({
  head: () => ({ meta: [{ title: "Sans mots — Legato" }] }),
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => {
    const t = search.tab;
    if (t === "souffles" || t === "respirer" || t === "lire" || t === "regarder") {
      return { tab: t };
    }
    return {};
  },
  component: NoWords,
});

type Motion = "drift" | "ripple" | "pulse" | "rain" | "veil";
type Tab = "souffles" | "respirer" | "lire" | "regarder";
type BookTag = "deuil récent" | "long terme" | "anticipation" | "pour les enfants" | "philosophique" | "poétique" | "corps";

type Texture = {
  id: string;
  title: string;
  whisper: string;
  asmr: string;
  motion: Motion;
  bg: string; // page-level gradient (CSS)
  tag: BookTag; // sensitivity → for cross-AI with Lire
  generated?: boolean;
};

const BASE: Texture[] = [
  {
    id: "warmth",
    title: "Chaleur lente",
    whisper: "Comme une main posée sur l'épaule.",
    asmr: "Souffle long, près d'un foyer",
    motion: "pulse",
    bg: "linear-gradient(160deg, #F8E4DD 0%, #F0CFC8 60%, #E5B8B5 100%)",
    tag: "deuil récent",
  },
  {
    id: "rain-fine",
    title: "Pluie fine",
    whisper: "Tout s'apaise, à l'abri.",
    asmr: "Pluie légère sur une vitre",
    motion: "rain",
    bg: "linear-gradient(180deg, #DDE3EA 0%, #C3CCD6 100%)",
    tag: "poétique",
  },
  {
    id: "leaves",
    title: "Feuilles d'automne",
    whisper: "Le temps se balance, sans bruit.",
    asmr: "Vent doux dans les feuilles",
    motion: "drift",
    bg: "linear-gradient(170deg, #F5E9D6 0%, #E8D4B5 100%)",
    tag: "long terme",
  },
  {
    id: "snow-morning",
    title: "Matin de neige",
    whisper: "Le monde se feutre autour de vous.",
    asmr: "Silence presque total, craquement léger",
    motion: "veil",
    bg: "linear-gradient(180deg, #F0F4F8 0%, #DDE5EE 100%)",
    tag: "poétique",
  },
  {
    id: "seaside",
    title: "Bord de mer",
    whisper: "Aller, revenir, à votre rythme.",
    asmr: "Vagues douces et régulières",
    motion: "ripple",
    bg: "linear-gradient(180deg, #DCE6E0 0%, #B6CCC2 100%)",
    tag: "philosophique",
  },
  {
    id: "forest-rain",
    title: "Forêt après la pluie",
    whisper: "Tout s'égoutte, doucement.",
    asmr: "Gouttes sur les feuilles, oiseaux lointains",
    motion: "ripple",
    bg: "linear-gradient(170deg, #E4ECDF 0%, #C7D5BF 100%)",
    tag: "poétique",
  },
  {
    id: "afternoon-light",
    title: "Lumière de fin d'après-midi",
    whisper: "Une chaleur qui s'attarde.",
    asmr: "Silence, léger bourdonnement d'été",
    motion: "drift",
    bg: "linear-gradient(170deg, #FBF1DC 0%, #F0DDB0 100%)",
    tag: "philosophique",
  },
  {
    id: "quiet-night",
    title: "Nuit tranquille",
    whisper: "Une lumière reste allumée pour vous.",
    asmr: "Grillons lointains, vent doux",
    motion: "veil",
    bg: "linear-gradient(180deg, #1F2638 0%, #2A3550 100%)",
    tag: "philosophique",
  },
  {
    id: "fireplace",
    title: "Feu de cheminée",
    whisper: "Une petite flamme suffit, ce soir.",
    asmr: "Crépitement doux d'un feu de bois",
    motion: "pulse",
    bg: "linear-gradient(160deg, #F4DCD0 0%, #E0B5A2 100%)",
    tag: "deuil récent",
  },
  {
    id: "wave",
    title: "Vague de fond",
    whisper: "Quelque chose vous porte, en dessous.",
    asmr: "Basses fréquences très douces",
    motion: "ripple",
    bg: "linear-gradient(180deg, #E0DAEC 0%, #C4B8DC 100%)",
    tag: "philosophique",
  },
];

const FAV_KEY = "legato.nowords.favorites";
const READ_KEY = "legato.nowords.read";

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}
function saveFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

function NoWords() {
  const search = Route.useSearch();
  const [tab, setTab] = useState<Tab>(search.tab ?? "souffles");
  useEffect(() => {
    if (search.tab) setTab(search.tab);
  }, [search.tab]);

  return (
    <Shell hideNav livingBg={false}>
      <div className="relative min-h-dvh flex flex-col select-none overflow-hidden">
        {/* Top tabs */}
        <div className="relative z-20 px-4 pt-7 pb-3 flex items-center justify-between gap-2">
          <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/55">
            ← Foyer
          </Link>
          <nav className="glass-tabs flex items-center gap-1 px-1 py-1">
            {(["souffles","respirer","lire","regarder"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-2.5 py-1.5 rounded-full text-[9.5px] uppercase tracking-[0.16em] transition-colors ${
                  tab === t ? "glass-tab-active" : "text-dusk/65"
                }`}
              >
                {t === "souffles" ? "Souffles" : t === "respirer" ? "Respirer" : t === "lire" ? "Lire" : "Regarder"}
              </button>
            ))}
          </nav>
          <span className="w-6" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {tab === "souffles" && <SoufflesView />}
          {tab === "respirer" && <RespirerView />}
          {tab === "lire" && <LireView />}
          {tab === "regarder" && <RegarderView />}
        </div>
      </div>
    </Shell>
  );
}

/* ============================================================
   ESPACE 1 — SOUFFLES
   ============================================================ */
function SoufflesView() {
  const [deck, setDeck] = useState<Texture[]>(BASE);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [bloom, setBloom] = useState(false);
  const [extendedMsg, setExtendedMsg] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showSimilarCTA, setShowSimilarCTA] = useState(false);
  const startX = useRef<number | null>(null);

  const tex = deck[index];
  const next = () => setIndex((i) => (i + 1) % deck.length);
  const prev = () => setIndex((i) => (i - 1 + deck.length) % deck.length);

  const fetchSimilar = useServerFn(similarAmbiances);

  // Audio
  const audioRef = useRef<AmbientAudio | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => () => {
    audioRef.current?.stop();
    try { ctxRef.current?.close(); } catch {}
  }, []);
  useEffect(() => {
    if (!playing || !ctxRef.current) return;
    audioRef.current?.stop();
    audioRef.current = createAmbientAudio(ctxRef.current, tex.motion);
    audioRef.current?.start();
  }, [tex.motion, tex.id, playing]);

  // Show similar CTA after 3 favorites
  useEffect(() => {
    if (favorites.length === 3) setShowSimilarCTA(true);
  }, [favorites.length]);

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.stop();
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    if (!ctxRef.current) {
      const Ctx = (window.AudioContext as typeof AudioContext | undefined) ||
        ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
      if (!Ctx) return;
      ctxRef.current = new Ctx();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    audioRef.current = createAmbientAudio(ctxRef.current, tex.motion);
    audioRef.current?.start();
    setPlaying(true);
  };

  const isFav = favorites.includes(tex.id);
  const onKeep = () => {
    if (isFav) return;
    const nextFavs = [...favorites, tex.id];
    setFavorites(nextFavs);
    saveFavorites(nextFavs);
    setBloom(true);
    setTimeout(() => setBloom(false), 1800);
  };

  const onStayMore = () => {
    setExtendedMsg(true);
    setTimeout(() => setExtendedMsg(false), 2400);
  };

  const onPointerDown = (e: React.PointerEvent) => { startX.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (dx < -40) next(); else if (dx > 40) prev();
    startX.current = null;
  };

  const onDiscoverSimilar = async () => {
    if (loadingMore) return;
    setLoadingMore(true); setAiError(null);
    try {
      const res = await fetchSimilar({ data: {
        title: tex.title, whisper: tex.whisper, asmr: tex.asmr, motion: tex.motion,
      }});
      if (res.error || !res.variations?.length) {
        setAiError(res.error ?? "Aucune variation pour l'instant.");
      } else {
        const newOnes: Texture[] = res.variations.map((v, i) => ({
          id: `ai-${Date.now()}-${i}`,
          title: v.title, whisper: v.whisper, asmr: v.asmr,
          motion: (["drift","ripple","pulse","rain","veil"].includes(v.motion) ? v.motion : tex.motion) as Motion,
          bg: tex.bg,
          tag: tex.tag,
          generated: true,
        }));
        setDeck((d) => {
          const copy = [...d];
          copy.splice(index + 1, 0, ...newOnes);
          return copy;
        });
        setShowSimilarCTA(false);
      }
    } catch {
      setAiError("Le service n'a pas répondu.");
    } finally {
      setLoadingMore(false);
    }
  };

  const dark = tex.id === "quiet-night";

  return (
    <div
      className="relative flex-1 flex flex-col overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Background gradient — fades 2s between sequences */}
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-[2000ms] ease-out"
        style={{ background: tex.bg }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <MotionLayer kind={tex.motion} />
      </div>

      <div className={`flex-1 flex flex-col ${dark ? "text-paper" : "text-dusk"}`}>
        {/* Title block — centered */}
        <div className="px-7 pt-4 text-center">
          <p className={`text-[10px] uppercase tracking-[0.22em] ${dark ? "text-paper/55" : "text-dusk/55"}`}>
            {playing ? "Ambiance en cours" : "En silence"}
            {tex.generated && <span className={`ml-2 ${dark ? "text-paper/40" : "text-dusk/40"}`}>· proposée pour vous</span>}
          </p>
          <h2
            className="mt-3 font-serif italic text-[26px] leading-[1.15]"
            style={{ textWrap: "balance", textShadow: dark ? "0 1px 18px rgba(0,0,0,0.4)" : "0 1px 18px rgba(255,255,255,0.45)" }}
          >
            {tex.title}
          </h2>
          <p className={`mt-3 text-[14px] leading-relaxed font-light ${dark ? "text-paper/75" : "text-dusk/70"}`}
             style={{ color: dark ? undefined : "#6B6560" }}>
            {tex.whisper}
          </p>
          <p className={`mt-3 text-[11px] italic ${dark ? "text-paper/55" : "text-dusk/55"}`}>
            Son · {tex.asmr.toLowerCase()}
          </p>
        </div>

        <div className="flex-1" />

        {/* Floral bloom overlay when keeping a sequence */}
        {bloom && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
            <BloomFlower />
          </div>
        )}

        {/* Suggestion after 3 favorites */}
        {showSimilarCTA && (
          <div className="px-7 pb-2">
            <div className={`rounded-2xl px-4 py-3.5 backdrop-blur-md text-center`}
                 style={{ background: dark ? "rgba(255,255,255,0.08)" : "color-mix(in oklab, var(--paper) 55%, transparent)" }}>
              <p className={`text-[12.5px] leading-relaxed italic ${dark ? "text-paper/85" : "text-dusk/80"}`} style={{ textWrap: "pretty" }}>
                Vous semblez aimer les ambiances {favoriteFamily(deck, favorites)}. On en a préparé d'autres dans cet esprit.
              </p>
              <button
                onClick={onDiscoverSimilar}
                disabled={loadingMore}
                className={`mt-2 text-[12px] uppercase tracking-[0.2em] ${dark ? "text-paper" : "text-dusk"} disabled:opacity-60`}
              >
                {loadingMore ? "Une voix douce arrive…" : "Découvrir →"}
              </button>
            </div>
          </div>
        )}

        {/* Play controls */}
        <div className="px-6 pt-3 pb-3 flex items-center gap-3">
          <button
            onClick={prev}
            className={`size-11 rounded-full flex items-center justify-center text-lg backdrop-blur-md ${dark ? "text-paper/85" : "text-dusk/75"}`}
            style={{ background: dark ? "rgba(255,255,255,0.1)" : "color-mix(in oklab, var(--paper) 32%, transparent)" }}
            aria-label="Séquence précédente"
          >←</button>
          <button
            onClick={togglePlay}
            className="flex-1 px-5 py-3.5 text-center backdrop-blur-md rounded-full"
            style={{
              background: dark ? "rgba(255,255,255,0.12)" : "color-mix(in oklab, var(--paper) 38%, transparent)",
              boxShadow: dark ? "inset 0 1px 0 rgba(255,255,255,0.15)" : "inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <p className={`font-serif italic text-[15px] ${dark ? "text-paper" : "text-dusk"}`}>
              {playing ? "Mettre en pause" : "Écouter ce son"}
            </p>
          </button>
          <button
            onClick={next}
            className={`size-11 rounded-full flex items-center justify-center text-lg backdrop-blur-md ${dark ? "text-paper/85" : "text-dusk/75"}`}
            style={{ background: dark ? "rgba(255,255,255,0.1)" : "color-mix(in oklab, var(--paper) 32%, transparent)" }}
            aria-label="Séquence suivante"
          >→</button>
        </div>

        {/* Secondary actions: Garder / Rester encore */}
        <div className="px-6 pb-3 flex items-center gap-3">
          <button
            onClick={onKeep}
            disabled={isFav}
            className={`flex-1 py-3 rounded-full text-[12.5px] backdrop-blur-md flex items-center justify-center gap-2 ${dark ? "text-paper/85" : "text-dusk/85"} ${isFav ? "opacity-70" : ""}`}
            style={{ background: dark ? "rgba(255,255,255,0.1)" : "color-mix(in oklab, var(--paper) 28%, transparent)" }}
          >
            <span aria-hidden>{isFav ? "♥" : "♡"}</span>
            <span>{isFav ? "Gardée" : "Garder cette séquence"}</span>
          </button>
          <button
            onClick={onStayMore}
            className={`flex-1 py-3 rounded-full text-[12.5px] backdrop-blur-md ${dark ? "text-paper/85" : "text-dusk/85"}`}
            style={{ background: dark ? "rgba(255,255,255,0.1)" : "color-mix(in oklab, var(--paper) 28%, transparent)" }}
          >
            Rester encore
          </button>
        </div>

        {extendedMsg && (
          <p className={`px-7 pb-2 text-[11.5px] italic text-center ${dark ? "text-paper/70" : "text-dusk/65"}`}>
            On reste avec vous, encore un moment.
          </p>
        )}
        {aiError && (
          <p className={`px-7 pb-3 text-[11px] italic text-center ${dark ? "text-paper/65" : "text-dusk/60"}`}>{aiError}</p>
        )}

        {/* Dots */}
        <div className="pb-7 pt-1 flex justify-center gap-1.5">
          {deck.map((tx, i) => (
            <span
              key={tx.id}
              className={`h-[3px] rounded-full transition-all ${
                i === index
                  ? (dark ? "w-6 bg-paper/80" : "w-6 bg-dusk/70")
                  : (dark ? "w-2 bg-paper/30" : "w-2 bg-dusk/25")
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function favoriteFamily(deck: Texture[], favIds: string[]): string {
  const tags = favIds.map((id) => deck.find((d) => d.id === id)?.tag).filter(Boolean) as BookTag[];
  if (!tags.length) return "douces";
  const counts = tags.reduce<Record<string, number>>((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  if (top === "deuil récent") return "chaudes et enveloppantes";
  if (top === "philosophique") return "vastes et calmes";
  if (top === "poétique") return "feutrées et délicates";
  if (top === "long terme") return "lentes et changeantes";
  return "douces";
}

function BloomFlower() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="animate-bloom" style={{ filter: "drop-shadow(0 4px 16px rgba(255,180,180,0.4))" }}>
      <style>{`
        @keyframes legato-bloom {
          0%   { transform: scale(0.2); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-bloom { animation: legato-bloom 1.8s ease-out forwards; transform-origin: center; }
      `}</style>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse key={deg} cx="60" cy="38" rx="10" ry="20" fill="rgba(255,180,180,0.85)"
                 transform={`rotate(${deg} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="7" fill="rgba(255,225,180,0.95)" />
    </svg>
  );
}

/* ============================================================
   ESPACE 2 — RESPIRER
   ============================================================ */
type Rhythm = { id: "doux"|"profond"|"simple"; label: string; in: number; hold: number; out: number };
const RHYTHMS: Rhythm[] = [
  { id: "doux",    label: "Doux",    in: 4, hold: 4, out: 6 },
  { id: "profond", label: "Profond", in: 4, hold: 7, out: 8 },
  { id: "simple",  label: "Simple",  in: 3, hold: 3, out: 3 },
];

function RespirerView() {
  const [rhythm, setRhythm] = useState<Rhythm>(RHYTHMS[0]);
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(rhythm.in);

  type PhaseInfo = { id: "in"|"hold"|"out"; label: string; seconds: number };
  const phases: PhaseInfo[] = useMemo(() => ([
    { id: "in",   label: "Inspirez...",      seconds: rhythm.in },
    { id: "hold", label: "Tenez doucement.", seconds: rhythm.hold },
    { id: "out",  label: "Laissez aller...", seconds: rhythm.out },
  ]), [rhythm]);

  useEffect(() => {
    setCount(phases[step].seconds);
    const tick = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          const ns = (step + 1) % phases.length;
          setStep(ns);
          return phases[ns].seconds;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [step, phases]);

  // Reset when rhythm changes
  useEffect(() => { setStep(0); setCount(phases[0].seconds); }, [rhythm.id]);

  const phase = phases[step];
  const SCALE = phase.id === "in" ? { from: 0.57, to: 1 } : phase.id === "out" ? { from: 1, to: 0.57 } : { from: 1, to: 1 };
  const duration = phase.seconds * 1000;

  // Letter-by-letter for in/out
  const letters = phase.label.split("");

  return (
    <div className="relative flex-1 flex flex-col items-center" style={{ background: "#1A1F2E" }}>
      {/* Rhythm pills */}
      <div className="pt-2 pb-6 flex items-center gap-2">
        {RHYTHMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRhythm(r)}
            className={`px-3.5 py-1.5 rounded-full text-[10.5px] uppercase tracking-[0.18em] transition-colors ${
              r.id === rhythm.id ? "bg-paper text-dusk" : "text-paper/55 border border-paper/15"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Close X — top-right of inner area */}
      <button
        onClick={() => setClosing(true)}
        className="absolute top-2 right-6 size-9 rounded-full flex items-center justify-center text-paper/65 text-xl"
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* Breathing circle */}
      <div className="relative size-[280px] flex items-center justify-center mt-6">
        <div className="absolute inset-0 rounded-full"
             style={{ border: "1px dashed rgba(200,216,232,0.18)", margin: "60px" }} />
        <div
          key={`${rhythm.id}-${step}`}
          className="absolute rounded-full will-change-transform"
          style={{
            width: 280, height: 280,
            background: "rgba(200,216,232,0.4)",
            transform: `scale(${SCALE.from})`,
            animation: `legato-resp ${duration}ms cubic-bezier(0.45,0,0.55,1) forwards`,
            ['--from' as string]: String(SCALE.from),
            ['--to' as string]: String(SCALE.to),
          } as React.CSSProperties}
        />
        <div className="relative text-center">
          <p className="font-serif italic text-paper/90 text-[20px] leading-none flex justify-center">
            {phase.id === "hold"
              ? <span>{phase.label}</span>
              : letters.map((ch, i) => (
                  <span key={i} className="opacity-0 letter-in" style={{
                    animationDelay: `${(i * (duration * 0.6)) / Math.max(letters.length, 1) / 1000}s`
                  }}>{ch === " " ? "\u00A0" : ch}</span>
                ))}
          </p>
          <p className="mt-4 text-[10.5px] tracking-[0.3em] tabular-nums" style={{ color: "#8090A8" }}>
            {Array.from({ length: phase.seconds }).map((_, i) => (
              <span key={i} className={i < (phase.seconds - count + 1) ? "text-paper/85" : "text-paper/25"}>
                {i + 1}{i < phase.seconds - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>

      <p className="mt-12 text-[12px] font-light text-center" style={{ color: "#8090A8" }}>
        Inspirez {rhythm.in} · Tenez {rhythm.hold} · Expirez {rhythm.out}
      </p>

      {closing && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(26,31,46,0.92)" }}
             onAnimationEnd={() => {}}>
          <p className="font-serif italic text-paper/90 text-[22px] animate-fade-in">Bien. Prenez votre temps.</p>
        </div>
      )}
      {closing && <CloseAfter onDone={() => { setClosing(false); }} />}

      <style>{`
        @keyframes legato-resp {
          from { transform: scale(var(--from)); }
          to   { transform: scale(var(--to)); }
        }
        @keyframes letter-in {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .letter-in { animation: letter-in 0.35s ease-out forwards; }
      `}</style>
    </div>
  );
}

function CloseAfter({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);
  return null;
}

/* ============================================================
   ESPACE 3 — LIRE
   ============================================================ */
type Book = {
  title: string;
  author: string;
  tags: BookTag[];
  why: string;
  url: string;
};

const BOOKS: Book[] = [
  { title: "Vivre le deuil au jour le jour", author: "Christophe Fauré", tags: ["deuil récent"],
    why: "La référence française. Pas un manuel — une présence.",
    url: "https://www.google.com/search?q=Vivre+le+deuil+au+jour+le+jour+Christophe+Faur%C3%A9" },
  { title: "La Mort est une question de vie", author: "Boris Cyrulnik", tags: ["philosophique"],
    why: "Comment la perte peut, lentement, devenir une force.",
    url: "https://www.google.com/search?q=La+Mort+est+une+question+de+vie+Boris+Cyrulnik" },
  { title: "Une année magique", author: "Joan Didion", tags: ["deuil récent","poétique"],
    why: "Le plus honnête des livres sur la perte d'un conjoint.",
    url: "https://www.google.com/search?q=L%27ann%C3%A9e+de+la+pens%C3%A9e+magique+Joan+Didion" },
  { title: "Les Traversées du deuil", author: "Martine Spiesser", tags: ["deuil récent"],
    why: "Écrit par une thérapeute française spécialisée.",
    url: "https://www.google.com/search?q=Les+Travers%C3%A9es+du+deuil+Martine+Spiesser" },
  { title: "Le Deuil, c'est la vie", author: "David Kessler", tags: ["long terme"],
    why: "Par l'élève de Kübler-Ross. Sur la recherche de sens.",
    url: "https://www.google.com/search?q=Le+Deuil+c%27est+la+vie+David+Kessler" },
  { title: "Tout ce que je sais de toi", author: "Eric Chacour", tags: ["poétique","anticipation"],
    why: "Un roman sur l'absence et ce qu'on garde.",
    url: "https://www.google.com/search?q=Tout+ce+que+je+sais+de+toi+Eric+Chacour" },
  { title: "La Consolation", author: "Sébastien Japrisot", tags: ["poétique"],
    why: "Pour les jours où on veut juste être porté par les mots.",
    url: "https://www.google.com/search?q=La+Consolation+Japrisot" },
  { title: "Quand le corps dit non", author: "Gabor Maté", tags: ["long terme","corps"],
    why: "Le deuil qui reste dans le corps, et comment l'écouter.",
    url: "https://www.google.com/search?q=Quand+le+corps+dit+non+Gabor+Mat%C3%A9" },
  { title: "Le Chagrin", author: "Lionel Duroy", tags: ["deuil récent","poétique"],
    why: "Un récit intime. Pour ne pas se sentir seul dans la douleur.",
    url: "https://www.google.com/search?q=Le+Chagrin+Lionel+Duroy" },
  { title: "Consolations", author: "Michael Ignatieff", tags: ["philosophique"],
    why: "Pour approcher la mort sans qu'elle pèse trop.",
    url: "https://www.google.com/search?q=Consolations+Michael+Ignatieff" },
];

function LireView() {
  const favorites = loadFavorites();
  // Compute tag affinity from favorited sequences
  const affinity = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    favorites.forEach((id) => {
      const t = BASE.find((b) => b.id === id)?.tag;
      if (t) counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [favorites.join(",")]);

  const sorted = useMemo(() => {
    return [...BOOKS].sort((a, b) => {
      const sa = a.tags.reduce((acc, t) => acc + (affinity[t] || 0), 0);
      const sb = b.tags.reduce((acc, t) => acc + (affinity[t] || 0), 0);
      return sb - sa;
    });
  }, [affinity]);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#F5EFE6" }}>
      <div className="px-7 pt-4 pb-6">
        <h2 className="font-serif text-[24px] leading-[1.2] text-dusk" style={{ textWrap: "balance" }}>
          Des mots qui accompagnent.
        </h2>
        <p className="mt-2 text-[13px] font-light" style={{ color: "#6B6560", textWrap: "pretty" }}>
          Pas pour tout expliquer. Pour être moins seul·e.
        </p>
      </div>
      <ul className="px-5 pb-12 space-y-3">
        {sorted.map((b) => (
          <li key={b.title} className="rounded-2xl bg-paper/85 backdrop-blur px-5 py-4 border border-dusk/8">
            <h3 className="font-serif text-[18px] text-dusk leading-snug">{b.title}</h3>
            <p className="text-[13px] font-light mt-0.5" style={{ color: "#6B6560" }}>{b.author}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-dusk/85 italic" style={{ textWrap: "pretty" }}>
              {b.why}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {b.tags.map((t) => (
                <span key={t} className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                      style={{ background: "#EDE3D2", color: "#7A6F5E" }}>
                  {t}
                </span>
              ))}
            </div>
            <a href={b.url} target="_blank" rel="noreferrer"
               className="inline-block mt-3 text-[12px] uppercase tracking-[0.2em] text-dusk/75">
              Trouver ce livre →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   AUDIO ENGINE & MOTION (preserved from previous version)
   ============================================================ */
/* ============================================================
   ESPACE 4 — REGARDER
   ============================================================ */
type Work = {
  title: string;
  author: string;
  format: string;        // "court-métrage 28min", "musique 10min", "peinture"…
  context: string;       // phrase de contexte
  tags: string[];
  url: string;
  bg: string;            // CSS gradient
  textOnDark?: boolean;
};

const WORKS: Work[] = [
  { title: "La Jetée", author: "Chris Marker", format: "Court-métrage · 28 min",
    context: "Un homme remonte le temps pour retrouver une image.",
    tags: ["mémoire", "passage"], textOnDark: true,
    bg: "linear-gradient(160deg, #2C2830 0%, #48384C 100%)",
    url: "https://www.google.com/search?q=La+Jet%C3%A9e+Chris+Marker" },
  { title: "Paperman", author: "Disney · John Kahrs", format: "Court-métrage · 6 min",
    context: "Une rencontre, un vent, des avions de papier.",
    tags: ["présence", "légèreté"],
    bg: "linear-gradient(160deg, #D8DDE8 0%, #E8E0D8 100%)",
    url: "https://www.google.com/search?q=Paperman+Disney+short" },
  { title: "Spiegel im Spiegel", author: "Arvo Pärt", format: "Musique · 10 min",
    context: "Le silence entre les notes, plus grand que les notes.",
    tags: ["silence", "souffle"],
    bg: "linear-gradient(160deg, #F0EEF4 0%, #E8EAF0 100%)",
    url: "https://www.google.com/search?q=Spiegel+im+Spiegel+Arvo+P%C3%A4rt" },
  { title: "The Blue Room", author: "Yves Klein", format: "Peinture",
    context: "Le bleu comme un endroit où poser le regard.",
    tags: ["silence", "couleur"],
    bg: "linear-gradient(160deg, #A8B8D8 0%, #C0C8E0 100%)",
    url: "https://www.google.com/search?q=Yves+Klein+IKB" },
  { title: "Scène des plumes", author: "Forrest Gump · Zemeckis", format: "Extrait · 3 min",
    context: "Une plume qui descend, sans rien expliquer.",
    tags: ["légèreté", "passage"],
    bg: "linear-gradient(160deg, #E8F0E8 0%, #F0F4EC 100%)",
    url: "https://www.google.com/search?q=Forrest+Gump+feather+scene" },
  { title: "Nocturne en si bémol mineur", author: "Frédéric Chopin", format: "Musique · 6 min",
    context: "Une nuit qui veille sur vous.",
    tags: ["nuit", "présence"], textOnDark: true,
    bg: "linear-gradient(160deg, #2A2835 0%, #3C3848 100%)",
    url: "https://www.google.com/search?q=Chopin+Nocturne+B+flat+minor+op+9+no+1" },
  { title: "The Tree of Life", author: "Terrence Malick", format: "Extrait nature · 5 min",
    context: "La lumière qui traverse les arbres, comme une réponse.",
    tags: ["passage", "lumière"],
    bg: "linear-gradient(160deg, #D8E8D0 0%, #E8F0E0 100%)",
    url: "https://www.google.com/search?q=Tree+of+Life+Malick+creation+sequence" },
  { title: "Maman (Spider)", author: "Louise Bourgeois", format: "Installation",
    context: "Une protection immense, et fragile.",
    tags: ["mémoire", "protection"],
    bg: "linear-gradient(160deg, #C8C0B8 0%, #D8D0C8 100%)",
    url: "https://www.google.com/search?q=Louise+Bourgeois+Maman+spider" },
  { title: "In the Mood for Love", author: "Wong Kar-Wai", format: "Extrait · 4 min",
    context: "Ce qui se dit dans les silences entre deux personnes.",
    tags: ["absence", "présence"], textOnDark: true,
    bg: "linear-gradient(160deg, #4A2830 0%, #6A3840 100%)",
    url: "https://www.google.com/search?q=In+the+Mood+for+Love+Wong+Kar-Wai" },
  { title: "Grief is the Thing with Feathers", author: "Max Porter", format: "Extrait littéraire",
    context: "Un corbeau s'invite chez ceux qui pleurent.",
    tags: ["présence", "nuit"], textOnDark: true,
    bg: "linear-gradient(160deg, #2C3040 0%, #404858 100%)",
    url: "https://www.google.com/search?q=Grief+is+the+Thing+with+Feathers+Max+Porter" },
];

function RegarderView() {
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#FAF7F4" }}>
      <div className="px-7 pt-4 pb-6">
        <h2 className="font-serif text-[24px] leading-[1.2] text-dusk" style={{ textWrap: "balance" }}>
          Ce que les autres ont fait de leur chagrin.
        </h2>
        <p className="mt-2 text-[13px] font-light" style={{ color: "#6B6560", textWrap: "pretty" }}>
          Des œuvres qui accompagnent. Pour ne pas être seul·e.
        </p>
      </div>
      <ul className="px-5 pb-12 space-y-3">
        {WORKS.map((w) => {
          const dark = w.textOnDark;
          const title = dark ? "text-paper" : "text-dusk";
          const sub = dark ? "text-paper/70" : "";
          return (
            <li key={w.title}
                className="rounded-2xl px-5 py-5 border overflow-hidden"
                style={{
                  background: w.bg,
                  borderColor: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.05)",
                }}>
              <p className={`text-[10px] uppercase tracking-[0.22em] ${dark ? "text-paper/60" : "text-dusk/50"}`}>
                {w.format}
              </p>
              <h3 className={`mt-1.5 font-serif text-[19px] leading-snug ${title}`} style={{ textWrap: "balance" }}>
                {w.title}
              </h3>
              <p className={`text-[12.5px] font-light mt-0.5 ${sub}`} style={dark ? undefined : { color: "#6B6560" }}>
                {w.author}
              </p>
              <p className={`mt-3 text-[13.5px] leading-relaxed italic ${dark ? "text-paper/85" : "text-dusk/85"}`}
                 style={{ textWrap: "pretty" }}>
                {w.context}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {w.tags.map((t) => (
                  <span key={t}
                        className="text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                        style={{
                          background: dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.55)",
                          color: dark ? "rgba(255,255,255,0.85)" : "#7A6F5E",
                        }}>
                    {t}
                  </span>
                ))}
              </div>
              <a href={w.url} target="_blank" rel="noreferrer"
                 className={`inline-block mt-4 text-[12px] uppercase tracking-[0.2em] ${dark ? "text-paper/90" : "text-dusk/80"}`}>
                Voir cette œuvre →
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type AmbientAudio = { start: () => void; stop: () => void };

function createAmbientAudio(ctx: AudioContext, motion: Motion): AmbientAudio | null {
  if (typeof window === "undefined") return null;
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  const bufferSize = 3 * ctx.sampleRate;
  const brown = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const white = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  {
    const b = brown.getChannelData(0);
    const w = white.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const r = Math.random() * 2 - 1;
      last = (last + 0.02 * r) / 1.02;
      b[i] = last * 3.5;
      w[i] = r;
    }
  }
  const stops: Array<() => void> = [];
  const targetGain = 0.14;
  const playNoise = (buf: AudioBuffer, type: BiquadFilterType, freq: number, q: number, gain: number) => {
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(master);
    src.start();
    stops.push(() => { try { src.stop(); } catch {} });
    return { f, g };
  };
  if (motion === "pulse") {
    playNoise(brown, "lowpass", 240, 0.3, 0.45);
    const sub = ctx.createOscillator(); sub.type = "sine"; sub.frequency.value = 58;
    const subG = ctx.createGain(); subG.gain.value = 0.025;
    sub.connect(subG); subG.connect(master); sub.start();
    stops.push(() => { try { sub.stop(); } catch {} });
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.08; lfoG.gain.value = 0.03;
    lfo.connect(lfoG); lfoG.connect(master.gain); lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    let cancelledP = false;
    const crackle = () => {
      if (cancelledP) return;
      const o = ctx.createOscillator(); o.type = "triangle";
      o.frequency.value = 1100 + Math.random() * 900;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1600; f.Q.value = 1.2;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.014, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.12);
      setTimeout(crackle, 1200 + Math.random() * 4200);
    };
    crackle();
    stops.push(() => { cancelledP = true; });
  } else if (motion === "ripple") {
    const { f, g } = playNoise(brown, "bandpass", 420, 0.4, 0.55);
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.09; lfoG.gain.value = 220;
    lfo.connect(lfoG); lfoG.connect(f.frequency); lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    const vol = ctx.createOscillator(); const volG = ctx.createGain();
    vol.frequency.value = 0.07; volG.gain.value = 0.18;
    vol.connect(volG); volG.connect(g.gain); vol.start();
    stops.push(() => { try { vol.stop(); } catch {} });
  } else if (motion === "drift") {
    const { f } = playNoise(brown, "bandpass", 720, 0.6, 0.4);
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.1; lfoG.gain.value = 320;
    lfo.connect(lfoG); lfoG.connect(f.frequency); lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
    playNoise(white, "bandpass", 2400, 0.6, 0.05);
  } else if (motion === "rain") {
    playNoise(white, "bandpass", 1600, 0.4, 0.2);
    playNoise(brown, "lowpass", 520, 0.3, 0.26);
    let cancelled = false;
    const drop = () => {
      if (cancelled) return;
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.value = 420 + Math.random() * 380;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.022, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.5);
      setTimeout(drop, 220 + Math.random() * 520);
    };
    drop();
    stops.push(() => { cancelled = true; });
  } else {
    playNoise(brown, "lowpass", 200, 0.25, 0.28);
    const { f } = playNoise(white, "bandpass", 3200, 0.7, 0.025);
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.05; lfoG.gain.value = 600;
    lfo.connect(lfoG); lfoG.connect(f.frequency); lfo.start();
    stops.push(() => { try { lfo.stop(); } catch {} });
  }
  let started = false;
  return {
    start() {
      if (started) return; started = true;
      try { ctx.resume(); } catch {}
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(targetGain, now + 2.4);
    },
    stop() {
      try {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.linearRampToValueAtTime(0, now + 1.2);
        setTimeout(() => { stops.forEach((fn) => fn()); }, 1300);
      } catch {}
    },
  };
}

function MotionLayer({ kind }: { kind: Motion }) {
  const keyframes = (
    <style>{`
      @keyframes nw-breathe {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50%      { transform: scale(1.08); opacity: 0.55; }
      }
      @keyframes nw-rise {
        0%   { transform: translate3d(0, 18vmin, 0) scale(0.8); opacity: 0; }
        15%  { opacity: 0.5; } 85% { opacity: 0.5; }
        100% { transform: translate3d(2vmin, -22vmin, 0) scale(1.1); opacity: 0; }
      }
      @keyframes nw-ring {
        0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
        20%  { opacity: 0.45; }
        100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
      }
      @keyframes nw-fall {
        0%   { transform: translate3d(var(--dx,0), -12vh, 0); opacity: 0; }
        12%  { opacity: 0.55; } 88% { opacity: 0.55; }
        100% { transform: translate3d(calc(var(--dx,0) + 1vw), 110vh, 0); opacity: 0; }
      }
      @keyframes nw-snow {
        0%   { transform: translate3d(0, -10vh, 0); opacity: 0; }
        15%  { opacity: 0.55; } 85% { opacity: 0.55; }
        100% { transform: translate3d(8vmin, 110vh, 0); opacity: 0; }
      }
      @keyframes nw-leaf {
        0%   { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
        10%  { opacity: 0.65; } 90% { opacity: 0.55; }
        100% { transform: translate3d(12vmin, 110vh, 0) rotate(540deg); opacity: 0; }
      }
      @keyframes nw-float {
        0% { transform: translate3d(0,0,0); }
        50% { transform: translate3d(6vmin, -4vmin, 0); }
        100% { transform: translate3d(0,0,0); }
      }
    `}</style>
  );

  if (kind === "pulse") {
    return (
      <>
        {keyframes}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
             style={{ width: "70vmin", height: "70vmin",
               background: "radial-gradient(circle, rgba(220,140,90,0.55), transparent 70%)",
               animation: "nw-breathe 8s ease-in-out infinite", filter: "blur(8px)" }} />
        {Array.from({ length: 10 }).map((_, i) => {
          const left = 18 + (i * 71) % 64;
          const delay = (i * 1.7) % 14;
          const size = 4 + (i % 4) * 2;
          return (
            <span key={i} className="absolute rounded-full"
                  style={{ left: `${left}%`, bottom: `${10 + (i % 5) * 6}%`,
                    width: `${size}px`, height: `${size}px`,
                    background: "radial-gradient(circle, rgba(255,205,170,0.85), transparent 70%)",
                    animation: `nw-rise ${14 + (i % 5) * 3}s ease-in ${delay}s infinite`,
                    filter: "blur(0.5px)" }} />
          );
        })}
      </>
    );
  }
  if (kind === "ripple") {
    return (
      <>
        {keyframes}
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="absolute left-1/2 top-[55%] rounded-full border"
               style={{ width: "20vmin", height: "20vmin",
                 borderColor: "rgba(70,90,120,0.18)",
                 animation: `nw-ring 14s ease-out ${i * 2.8}s infinite` }} />
        ))}
      </>
    );
  }
  if (kind === "drift") {
    // Falling leaves OR soft particles
    return (
      <>
        {keyframes}
        {Array.from({ length: 12 }).map((_, i) => {
          const left = (i * 41) % 100;
          const dur = 14 + (i % 5) * 3;
          const delay = (i * 1.3) % dur;
          const size = 8 + (i % 4) * 3;
          return (
            <span key={i} className="absolute"
                  style={{ left: `${left}%`, top: 0,
                    width: `${size}px`, height: `${size * 1.6}px`,
                    background: "radial-gradient(ellipse at 50% 40%, rgba(200,150,90,0.7), rgba(180,110,60,0.2) 80%)",
                    borderRadius: "60% 40% 60% 40%",
                    animation: `nw-leaf ${dur}s linear ${delay}s infinite`,
                    filter: "blur(0.4px)" }} />
          );
        })}
      </>
    );
  }
  if (kind === "rain") {
    return (
      <>
        {keyframes}
        {Array.from({ length: 22 }).map((_, i) => {
          const left = (i * 41) % 100;
          const dx = ((i * 17) % 12) - 6;
          const dur = 4.5 + (i % 6) * 0.6;
          const delay = (i * 0.37) % dur;
          return (
            <span key={i} className="absolute"
                  style={{ left: `${left}%`, top: 0,
                    width: "1px", height: "10vh",
                    background: "linear-gradient(180deg, transparent, rgba(120,140,170,0.55))",
                    ['--dx' as string]: `${dx}vw`,
                    animation: `nw-fall ${dur}s linear ${delay}s infinite`,
                    filter: "blur(0.4px)" } as React.CSSProperties} />
          );
        })}
      </>
    );
  }
  // veil — snow / stars
  return (
    <>
      {keyframes}
      {Array.from({ length: 26 }).map((_, i) => {
        const left = (i * 53) % 100;
        const size = 2 + (i % 4);
        const dur = 18 + (i % 7) * 3;
        const delay = (i * 0.9) % dur;
        return (
          <span key={i} className="absolute rounded-full"
                style={{ left: `${left}%`, top: 0,
                  width: `${size}px`, height: `${size}px`,
                  background: "rgba(245,240,255,0.85)",
                  animation: `nw-snow ${dur}s linear ${delay}s infinite`,
                  filter: "blur(0.6px)" }} />
        );
      })}
    </>
  );
}
