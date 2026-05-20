import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { noOrphan } from "@/lib/text";
import imgWarmth from "@/assets/souffle-warmth.jpg";
import imgMorningSky from "@/assets/souffle-morning-sky.jpg";
import imgOrSoirEau from "@/assets/souffle-or-soir-eau.jpg";
import imgFeuillesVert from "@/assets/souffle-feuilles-vert.jpg";
import imgAurore from "@/assets/souffle-aurore.jpg";
import imgBougainvillier from "@/assets/souffle-bougainvillier.jpg";
import imgRivage from "@/assets/souffle-rivage.jpg";
import imgRessac from "@/assets/souffle-ressac.jpg";
import imgBrumeRose from "@/assets/souffle-brume-rose.jpg";
import imgOrDuSoir from "@/assets/souffle-or-du-soir.jpg";

const SCENE_IMAGES: Record<SceneId, string> = {
  "warmth": imgWarmth,
  "morning-sky": imgMorningSky,
  "rivage": imgRivage,
  "ressac": imgRessac,
  "rose-mist": imgBrumeRose,
  "evening-gold": imgOrDuSoir,
  "or-soir-eau": imgOrSoirEau,
  "feuilles-vert": imgFeuillesVert,
  "perle": imgOrSoirEau,
  "aurore": imgAurore,
  "bougainvillier": imgBougainvillier,
  "lumiere": imgAurore,
  "lune": imgRessac,
};

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

type Tab = "souffles" | "respirer" | "lire" | "regarder";
type BookTag = "deuil récent" | "long terme" | "anticipation" | "pour les enfants" | "philosophique" | "poétique" | "corps";

type SceneId =
  | "warmth" | "morning-sky" | "rivage" | "ressac" | "rose-mist" | "evening-gold"
  | "or-soir-eau" | "feuilles-vert"
  | "perle" | "aurore" | "bougainvillier" | "lumiere" | "lune";

type Sequence = {
  id: SceneId;
  title: string;
  tag: BookTag;
  volume: number;
  fadeIn: number;
};

const BASE: Sequence[] = [
  {
    id: "warmth",
    title: "Chaleur lente",
    tag: "deuil récent",
    volume: 0.35,
    fadeIn: 4000,
  },
  {
    id: "lune",
    title: "Paysage lunaire",
    tag: "philosophique",
    volume: 0.32,
    fadeIn: 4500,
  },
  {
    id: "aurore",
    title: "Aurore",
    tag: "philosophique",
    volume: 0.28,
    fadeIn: 4000,
  },
  {
    id: "morning-sky",
    title: "Ciel du matin",
    tag: "philosophique",
    volume: 0.28,
    fadeIn: 4000,
  },
  {
    id: "feuilles-vert",
    title: "Frissons verts",
    tag: "long terme",
    volume: 0.28,
    fadeIn: 3500,
  },
  {
    id: "bougainvillier",
    title: "Bougainvillier",
    tag: "poétique",
    volume: 0.27,
    fadeIn: 4000,
  },
  {
    id: "rivage",
    title: "Rivage",
    tag: "long terme",
    volume: 0.30,
    fadeIn: 3500,
  },
  {
    id: "ressac",
    title: "Ressac",
    tag: "long terme",
    volume: 0.32,
    fadeIn: 4000,
  },
  {
    id: "perle",
    title: "Nacre",
    tag: "poétique",
    volume: 0.30,
    fadeIn: 4500,
  },
  {
    id: "rose-mist",
    title: "Brume rose",
    tag: "poétique",
    volume: 0.32,
    fadeIn: 4000,
  },
  {
    id: "lumiere",
    title: "Lumière tenue",
    tag: "philosophique",
    volume: 0.30,
    fadeIn: 5000,
  },
  {
    id: "or-soir-eau",
    title: "Or sur l'eau",
    tag: "philosophique",
    volume: 0.30,
    fadeIn: 4500,
  },
  {
    id: "evening-gold",
    title: "Or du soir",
    tag: "philosophique",
    volume: 0.30,
    fadeIn: 4000,
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
  const tab: Tab = search.tab ?? "souffles";
  const title =
    tab === "souffles" ? "Souffles" :
    tab === "respirer" ? "Respirer" :
    tab === "lire" ? "Lire" : "Regarder";

  const isSouffles = tab === "souffles";
  const isFullScreen = isSouffles || tab === "respirer" || tab === "lire" || tab === "regarder";

  return (
    <Shell livingBg={false} hideNav={isFullScreen}>
      <div className="relative min-h-dvh flex flex-col select-none overflow-hidden">
        {/* Header — minimal sur pages plein écran, simple ailleurs (sans lien Foyer) */}
        {isFullScreen ? (
          <Link
            to="/home"
            aria-label="Retour"
            className="absolute top-5 left-5 z-30 size-9 rounded-full backdrop-blur-md flex items-center justify-center text-dusk/70 hover:text-dusk"
            style={{ background: "color-mix(in oklab, white 40%, transparent)" }}
          >
            ←
          </Link>
        ) : (
          <div className="relative z-20 px-5 pt-7 pb-3 flex items-center justify-between gap-2">
            <Link to="/home" aria-label="Retour" className="text-dusk/55 hover:text-dusk text-lg">←</Link>
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/55">{title}</p>
            <span className="w-6" />
          </div>
        )}

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
function BloomFlower() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="animate-bloom"
      style={{ filter: "drop-shadow(0 4px 16px rgba(255,180,180,0.35))" }}
    >
      <style>{`
        @keyframes legato-bloom {
          0%   { transform: scale(0.2); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-bloom { animation: legato-bloom 1.8s ease-out forwards; transform-origin: center; }
      `}</style>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="60"
          cy="38"
          rx="9"
          ry="20"
          fill="rgba(255,200,200,0.78)"
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="6" fill="rgba(255,225,180,0.92)" />
    </svg>
  );
}

/* ─── Audio : Howler — nappe naturelle continue ─────────────── */
type NatureSound = {
  play: () => void;
  pause: () => void;
  resume: () => void;
  fadeTo: (next: NatureSound, duration?: number) => void;
  onTouch: (pressure: number) => void;
  onTouchEnd: () => void;
  destroy: () => void;
  readonly cfg: { volume: number; fadeIn: number };
};

/* Procedural ambient generator — Web Audio API, no external assets.
   Each scene has a distinct character based on filtered noise + slow LFOs. */
type SceneAudio = {
  type: "lowpass" | "bandpass" | "highpass";
  baseFreq: number; // Hz, filter center
  q: number;
  lfoRate: number; // Hz, very slow modulation
  lfoDepth: number; // Hz, depth around base
  noise: "white" | "pink" | "brown";
  /** Optional sustained tonal drone layered atop the noise bed. */
  tone?: { freq: number; type: OscillatorType; gain: number; detune?: number };
  /** Optional second tone for harmonic richness. */
  tone2?: { freq: number; type: OscillatorType; gain: number; detune?: number };
};
const SCENE_AUDIO: Record<SceneId, SceneAudio> = {
  // Foyer chaud — basses très feutrées, drone grave organique
  warmth:         { type: "lowpass",  baseFreq: 320,  q: 0.6, lfoRate: 0.07, lfoDepth: 90,  noise: "brown",
                    tone: { freq: 65, type: "sine", gain: 0.06 } },
  // Ciel matin — bandpass aigu, chant d'oiseaux suggéré par tons cristallins
  "morning-sky":  { type: "bandpass", baseFreq: 2200, q: 1.6, lfoRate: 0.09, lfoDepth: 900, noise: "pink",
                    tone: { freq: 880, type: "sine", gain: 0.012 },
                    tone2: { freq: 1320, type: "sine", gain: 0.008, detune: 7 } },
  // Rivage — vagues douces, lowpass, eau lointaine
  rivage:         { type: "lowpass",  baseFreq: 560,  q: 0.7, lfoRate: 0.11, lfoDepth: 220, noise: "brown",
                    tone: { freq: 90, type: "sine", gain: 0.03 } },
  // Ressac — vagues plus marquées, bandpass médium qui respire
  ressac:         { type: "bandpass", baseFreq: 900,  q: 1.2, lfoRate: 0.16, lfoDepth: 480, noise: "white",
                    tone: { freq: 130, type: "sine", gain: 0.028 } },
  // Brume rose — lowpass + drone très doux
  "rose-mist":    { type: "lowpass",  baseFreq: 700,  q: 0.9, lfoRate: 0.04, lfoDepth: 200, noise: "pink",
                    tone: { freq: 220, type: "sine", gain: 0.025, detune: -3 } },
  // Or du soir — vagues lentes, drone grave riche
  "evening-gold": { type: "lowpass",  baseFreq: 480,  q: 0.7, lfoRate: 0.05, lfoDepth: 180, noise: "brown",
                    tone: { freq: 110, type: "sine", gain: 0.04 },
                    tone2: { freq: 165, type: "sine", gain: 0.018 } },
  // Or du soir sur l'eau — bandpass médium, clapotis
  "or-soir-eau":  { type: "bandpass", baseFreq: 1200, q: 1.0, lfoRate: 0.22, lfoDepth: 400, noise: "white",
                    tone: { freq: 147, type: "triangle", gain: 0.02 } },
  // Feuilles vertes — frissons aigus
  "feuilles-vert":{ type: "highpass", baseFreq: 2600, q: 1.0, lfoRate: 0.25, lfoDepth: 800, noise: "pink"  },
  // Perle — drone cristallin, très calme
  perle:          { type: "lowpass",  baseFreq: 1100, q: 1.1, lfoRate: 0.04, lfoDepth: 250, noise: "pink",
                    tone: { freq: 330, type: "sine", gain: 0.022 },
                    tone2: { freq: 495, type: "sine", gain: 0.012, detune: -5 } },
  // Aurore — montée lente, harmoniques claires
  aurore:         { type: "bandpass", baseFreq: 1700, q: 1.4, lfoRate: 0.08, lfoDepth: 700, noise: "pink",
                    tone: { freq: 523, type: "sine", gain: 0.018 } },
  // Bougainvillier — chaleur méditerranéenne, cigales feutrées
  bougainvillier: { type: "bandpass", baseFreq: 3000, q: 2.2, lfoRate: 0.30, lfoDepth: 200, noise: "white",
                    tone: { freq: 174, type: "sine", gain: 0.025 } },
  // Lumière — installation, drone tenu lumineux
  lumiere:        { type: "lowpass",  baseFreq: 950,  q: 0.9, lfoRate: 0.02, lfoDepth: 120, noise: "pink",
                    tone: { freq: 261, type: "sine", gain: 0.03 },
                    tone2: { freq: 392, type: "sine", gain: 0.018, detune: 6 } },
  // Lune — paysage lunaire, basses profondes, presque sub
  lune:           { type: "lowpass",  baseFreq: 240,  q: 0.7, lfoRate: 0.03, lfoDepth: 60,  noise: "brown",
                    tone: { freq: 55,  type: "sine", gain: 0.05 },
                    tone2: { freq: 82,  type: "sine", gain: 0.025, detune: -8 } },
};

let sharedCtx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const Ctor = W.AudioContext || W.webkitAudioContext;
    if (!Ctor) return null;
    sharedCtx = new Ctor();
  }
  return sharedCtx;
}

function makeNoiseBuffer(ctx: AudioContext, kind: SceneAudio["noise"]): AudioBuffer {
  const seconds = 4;
  const length = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, length, ctx.sampleRate);
  const d = buf.getChannelData(0);
  if (kind === "white") {
    for (let i = 0; i < length; i++) d[i] = Math.random() * 2 - 1;
  } else if (kind === "pink") {
    // Paul Kellet's pink noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  } else {
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.5;
    }
  }
  return buf;
}

function createSound(seq: Sequence): NatureSound {
  const cfg = { volume: seq.volume, fadeIn: seq.fadeIn };
  const ctx = getCtx();
  const scene = SCENE_AUDIO[seq.id];
  let started = false;
  let stopped = false;
  let source: AudioBufferSourceNode | null = null;
  let gain: GainNode | null = null;
  let filter: BiquadFilterNode | null = null;
  let lfo: OscillatorNode | null = null;
  let lfoGain: GainNode | null = null;
  const tones: OscillatorNode[] = [];
  const toneGains: GainNode[] = [];

  const fadeGain = (target: number, ms: number) => {
    if (!gain || !ctx) return;
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(target, t + ms / 1000);
  };

  const start = (fadeMs: number) => {
    if (!ctx || started || stopped) return;
    started = true;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    source = ctx.createBufferSource();
    source.buffer = makeNoiseBuffer(ctx, scene.noise);
    source.loop = true;
    filter = ctx.createBiquadFilter();
    filter.type = scene.type;
    filter.frequency.value = scene.baseFreq;
    filter.Q.value = scene.q;
    lfo = ctx.createOscillator();
    lfo.frequency.value = scene.lfoRate;
    lfoGain = ctx.createGain();
    lfoGain.gain.value = scene.lfoDepth;
    lfo.connect(lfoGain).connect(filter.frequency);
    gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    lfo.start();
    // Optional sustained tones layered atop the noise bed
    const addTone = (t: NonNullable<SceneAudio["tone"]>) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      osc.type = t.type;
      osc.frequency.value = t.freq;
      if (t.detune) osc.detune.value = t.detune;
      const tg = ctx.createGain();
      tg.gain.value = 0;
      osc.connect(tg).connect(ctx.destination);
      osc.start();
      const now = ctx.currentTime;
      tg.gain.linearRampToValueAtTime(t.gain * cfg.volume * 3, now + fadeMs / 1000);
      tones.push(osc);
      toneGains.push(tg);
    };
    if (scene.tone) addTone(scene.tone);
    if (scene.tone2) addTone(scene.tone2);
    fadeGain(cfg.volume, fadeMs);
  };

  const cleanup = () => {
    try { source?.stop(); } catch (e) { void e; }
    try { lfo?.stop(); } catch (e) { void e; }
    try { source?.disconnect(); } catch (e) { void e; }
    try { lfo?.disconnect(); } catch (e) { void e; }
    try { lfoGain?.disconnect(); } catch (e) { void e; }
    try { filter?.disconnect(); } catch (e) { void e; }
    try { gain?.disconnect(); } catch (e) { void e; }
    tones.forEach((o) => { try { o.stop(); } catch (e) { void e; } try { o.disconnect(); } catch (e) { void e; } });
    toneGains.forEach((g) => { try { g.disconnect(); } catch (e) { void e; } });
    tones.length = 0;
    toneGains.length = 0;
    source = lfo = null;
    lfoGain = filter = gain = null;
  };

  return {
    cfg,
    play() { start(cfg.fadeIn); },
    pause() {
      fadeGain(0, 1200);
      if (ctx) {
        const t = ctx.currentTime;
        toneGains.forEach((g) => {
          g.gain.cancelScheduledValues(t);
          g.gain.setValueAtTime(g.gain.value, t);
          g.gain.linearRampToValueAtTime(0, t + 1.2);
        });
      }
    },
    resume() {
      if (!started) { start(1500); return; }
      fadeGain(cfg.volume, 1500);
    },
    fadeTo(next, duration = 3000) {
      fadeGain(0, duration);
      setTimeout(() => {
        stopped = true;
        cleanup();
        next.play();
      }, duration);
    },
    onTouch(pressure: number) {
      if (!gain || !ctx) return;
      const target = Math.min(cfg.volume * (1 + pressure * 0.5), 0.6);
      fadeGain(target, 600);
      if (filter) {
        const t = ctx.currentTime;
        filter.frequency.cancelScheduledValues(t);
        filter.frequency.linearRampToValueAtTime(scene.baseFreq * (1 + pressure * 0.3), t + 0.6);
      }
    },
    onTouchEnd() {
      fadeGain(cfg.volume, 2000);
    },
    destroy() {
      stopped = true;
      fadeGain(0, 1200);
      setTimeout(cleanup, 1300);
    },
  };
}

/* ─── Orbes CSS — animations plein écran ───────────────────── */
const ORB_STYLES = `
.souffle-scene { position: absolute; inset: 0; overflow: hidden; touch-action: none; }
.souffle-scene .scene-bg {
  position: absolute; inset: 0;
  transition: opacity 1.6s ease-in-out;
}

/* Couches d'image — chacune dérive lentement avec une déformation organique */
.souffle-scene .photo-layer {
  position: absolute; inset: -8%;
  background-size: cover;
  background-position: center;
  will-change: transform, opacity, filter;
  pointer-events: none;
  transform-origin: 50% 50%;
  transition: transform 2.8s ease-out;
}
.souffle-scene .photo-layer .inner {
  position: absolute; inset: 0;
  background: inherit;
  background-size: inherit;
  background-position: inherit;
  animation-fill-mode: both;
  transform: translate(var(--touch-x, 0px), var(--touch-y, 0px));
  transition: transform 2.6s ease-out;
}

/* Halo lumineux qui adoucit le tout */
.souffle-scene .glow {
  position: absolute; inset: 0;
  pointer-events: none;
  mix-blend-mode: screen;
  background: radial-gradient(
    ellipse at 50% 40%,
    rgba(255,245,230,0.35) 0%,
    rgba(255,235,225,0.18) 40%,
    transparent 75%
  );
}
/* Vignette douce pour cadrer */
.souffle-scene .vignette {
  position: absolute; inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 55%,
    rgba(255,255,255,0.18) 88%,
    rgba(255,255,255,0.32) 100%
  );
}

/* Déformations très lentes — comme une respiration sous verre dépoli */
@keyframes souffle-breathe-a {
  0%   { transform: scale(1.00) rotate(0deg) translate(0%, 0%); filter: blur(14px) saturate(1.00); }
  33%  { transform: scale(1.06) rotate(0.8deg) translate(1.2%, -1%); filter: blur(18px) saturate(1.05); }
  66%  { transform: scale(1.03) rotate(-0.6deg) translate(-1%, 1.4%); filter: blur(16px) saturate(0.98); }
  100% { transform: scale(1.00) rotate(0deg) translate(0%, 0%); filter: blur(14px) saturate(1.00); }
}
@keyframes souffle-breathe-b {
  0%   { transform: scale(1.08) rotate(0deg) translate(0%, 0%); filter: blur(22px) saturate(1.05); }
  50%  { transform: scale(1.14) rotate(-1.2deg) translate(-1.6%, 1.2%); filter: blur(26px) saturate(1.12); }
  100% { transform: scale(1.08) rotate(0deg) translate(0%, 0%); filter: blur(22px) saturate(1.05); }
}
@keyframes souffle-drift {
  0%   { transform: translate(0%, 0%) scale(1.00); }
  50%  { transform: translate(0.8%, -1.2%) scale(1.02); }
  100% { transform: translate(0%, 0%) scale(1.00); }
}
@keyframes souffle-glow-pulse {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.85; }
}

/* Grain organique très léger en surimpression */
.souffle-scene .grain {
  position: absolute; inset: 0;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

/* Touch halo — visible feedback that follows the finger / cursor */
.souffle-scene .touch-halo {
  position: absolute;
  left: 0; top: 0;
  width: 320px; height: 320px;
  margin-left: -160px; margin-top: -160px;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transform: translate3d(var(--halo-x, 50vw), var(--halo-y, 50vh), 0) scale(0.6);
  transition: opacity 0.6s ease-out, transform 0.18s ease-out;
  mix-blend-mode: screen;
  background: radial-gradient(
    circle at center,
    rgba(255, 240, 220, 0.55) 0%,
    rgba(255, 220, 200, 0.30) 30%,
    rgba(255, 200, 200, 0.12) 55%,
    transparent 75%
  );
  filter: blur(8px);
  will-change: transform, opacity;
}
.souffle-scene.is-touching .touch-halo {
  opacity: 1;
  transform: translate3d(var(--halo-x, 50vw), var(--halo-y, 50vh), 0) scale(1);
}

/* Video layer — autoplay ambient motion (rose-mist, evening-gold) */
.souffle-scene .photo-video {
  position: absolute; inset: -6%;
  width: 112%; height: 112%;
  object-fit: cover;
  pointer-events: none;
  mix-blend-mode: lighten;
  opacity: 0.78;
  filter: blur(2px) saturate(1.05);
  animation: souffle-drift 36s ease-in-out infinite;
  will-change: transform;
}

/* Fond doux par scène (pour la marge -8% au-delà du cadre) */
.scene-warmth        .scene-bg { background: linear-gradient(160deg, #FFE8DC 0%, #FFF4EE 100%); }
.scene-morning-sky   .scene-bg { background: linear-gradient(180deg, #FFE8D8 0%, #E8DEEC 60%, #D8DEEC 100%); }
.scene-rivage        .scene-bg { background: linear-gradient(180deg, #E8DCC8 0%, #C8D8E8 60%, #B8CCE0 100%); }
.scene-ressac        .scene-bg { background: linear-gradient(170deg, #D8E4DC 0%, #B8CCC4 60%, #98B0A8 100%); }
.scene-rose-mist     .scene-bg { background: linear-gradient(150deg, #F8EEF4 0%, #F0ECF8 100%); }
.scene-evening-gold  .scene-bg { background: linear-gradient(160deg, #FFF4E0 0%, #E8F0EC 100%); }
.scene-or-soir-eau   .scene-bg { background: linear-gradient(180deg, #F6E8D8 0%, #DCE6F0 60%, #C8D8E8 100%); }
.scene-feuilles-vert .scene-bg { background: linear-gradient(170deg, #E8F0E0 0%, #F4F8EC 100%); }
.scene-perle         .scene-bg { background: linear-gradient(160deg, #ECEEF4 0%, #F4EEF0 100%); }
.scene-aurore        .scene-bg { background: linear-gradient(180deg, #F8E4D8 0%, #E8DCEC 100%); }
.scene-bougainvillier .scene-bg { background: linear-gradient(160deg, #F8DCE8 0%, #F4E8D8 100%); }
.scene-lumiere       .scene-bg { background: linear-gradient(180deg, #FFF4D8 0%, #F4E0C8 100%); }
.scene-lune          .scene-bg { background: radial-gradient(ellipse at 50% 35%, #2C3142 0%, #14182A 55%, #0A0D18 100%); }

/* Lune — masquer les couches photo pour garder un vrai paysage nocturne */
.scene-lune .photo-layer,
.scene-lune .photo-video,
.scene-lune .grain { display: none; }
.scene-lune .glow {
  background: radial-gradient(ellipse at 50% 30%, rgba(180,195,225,0.18) 0%, rgba(120,140,180,0.08) 40%, transparent 75%);
}
.scene-lune .vignette {
  background: radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 90%, rgba(0,0,0,0.55) 100%);
}

/* Lune scene — invert text overlay color for legibility on dark bg */
.scene-lune .souffle-title { color: rgba(245, 240, 230, 0.92) !important; text-shadow: 0 1px 18px rgba(0,0,0,0.45) !important; }

/* Couche A — photo principale, animation longue */
.souffle-scene .layer-a {
  animation: souffle-breathe-a 42s ease-in-out infinite;
  opacity: 0.96;
}
.souffle-scene .layer-a .inner {
  animation: souffle-drift 30s ease-in-out infinite;
}
/* Couche B — même image, plus floue, décalée, en surimpression douce */
.souffle-scene .layer-b {
  animation: souffle-breathe-b 56s ease-in-out infinite;
  animation-delay: -18s;
  opacity: 0.55;
  mix-blend-mode: lighten;
}
.souffle-scene .layer-b .inner {
  animation: souffle-drift 38s ease-in-out infinite;
  animation-delay: -10s;
}
.souffle-scene .glow { animation: souffle-glow-pulse 18s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .souffle-scene .photo-layer,
  .souffle-scene .photo-layer .inner,
  .souffle-scene .glow {
    animation: none !important;
  }
}
.souffle-paused .photo-layer,
.souffle-paused .photo-layer .inner,
.souffle-paused .glow {
  animation-play-state: paused !important;
}
`;

const SCENE_VIDEOS: Partial<Record<SceneId, string>> = {
  "evening-gold": "/souffles/evening-gold.mp4",
};

function SouffleOrbs({ id }: { id: SceneId }) {
  const src = SCENE_IMAGES[id];
  const videoSrc = SCENE_VIDEOS[id];
  const bg: CSSProperties = { backgroundImage: `url(${src})` };
  return (
    <>
      <div className="photo-layer layer-a" style={bg}>
        <div className="inner" style={bg} />
      </div>
      <div className="photo-layer layer-b" style={bg}>
        <div className="inner" style={bg} />
      </div>
      {videoSrc && (
        <video
          className="photo-video"
          src={videoSrc}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
      <div className="glow" />
      <div className="vignette" />
      <div className="grain" />
      <div className="touch-halo" />
    </>
  );
}

/* ─── SoufflesView ──────────────────────────────────────────── */
function SoufflesView() {
  const { mode } = useLegato();
  const [index, setIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bloom, setBloom] = useState(false);
  const [playing, setPlaying] = useState(true);
  const soundRef = useRef<NatureSound | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Réordonne les souffles selon l'humeur active et les séquences likées.
  const sequence = useMemo<Sequence[]>(() => {
    const tagBonusByMode: Record<typeof mode, Partial<Record<BookTag, number>>> = {
      cocoon:    { "deuil récent": 3, "poétique": 2, "corps": 1 },
      anchoring: { "long terme": 3, "philosophique": 2 },
      breath:    { "philosophique": 3, "poétique": 2 },
      relay:     { "deuil récent": 2, "long terme": 2, "poétique": 1 },
    };
    const favTagCounts: Partial<Record<BookTag, number>> = {};
    favorites.forEach((id) => {
      const t = BASE.find((b) => b.id === id)?.tag;
      if (t) favTagCounts[t] = (favTagCounts[t] || 0) + 1;
    });
    return [...BASE].sort((a, b) => {
      const sa = (tagBonusByMode[mode][a.tag] || 0) + (favTagCounts[a.tag] || 0) * 2;
      const sb = (tagBonusByMode[mode][b.tag] || 0) + (favTagCounts[b.tag] || 0) * 2;
      return sb - sa;
    });
  }, [mode, favorites.join(",")]);

  const seq = sequence[index] ?? sequence[0];

  useEffect(() => { setFavorites(loadFavorites()); }, []);

  // Initialise sound on mount + cleanup
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = createSound(sequence[0]);
    soundRef.current = s;
    if (!reduced) s.play();
    // Browsers require a user gesture to start audio. Resume the context on first interaction.
    const resumeOnGesture = () => {
      const ctx = getCtx();
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
      if (!reduced) soundRef.current?.resume();
    };
    window.addEventListener("pointerdown", resumeOnGesture, { once: true });
    window.addEventListener("touchstart", resumeOnGesture, { once: true });
    window.addEventListener("keydown", resumeOnGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resumeOnGesture);
      window.removeEventListener("touchstart", resumeOnGesture);
      window.removeEventListener("keydown", resumeOnGesture);
      soundRef.current?.destroy();
      soundRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cross-fade when sequence changes (no auto-advance — manual only)
  useEffect(() => {
    if (index === 0 && !soundRef.current) return;
    const current = soundRef.current;
    if (!current) return;
    // skip on first render
  }, [index]);

  // Visibility: pause animations + audio
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => {
      const el = containerRef.current;
      if (document.hidden) {
        el?.classList.add("souffle-paused");
        soundRef.current?.pause();
      } else {
        el?.classList.remove("souffle-paused");
        if (playing) soundRef.current?.resume();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing]);

  // Pointer interaction — orbs drift, audio swells, visible halo follows finger
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const orbs = container.querySelectorAll<HTMLElement>(".photo-layer .inner");

    const apply = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (localX - cx) / cx;
      const dy = (localY - cy) / cy;
      const factors = [0.12, 0.22];
      orbs.forEach((orb, i) => {
        const f = factors[i % factors.length];
        orb.style.transition = "transform 1.6s ease-out";
        orb.style.setProperty("--touch-x", `${dx * f * 70}px`);
        orb.style.setProperty("--touch-y", `${dy * f * 60}px`);
      });
      container.style.setProperty("--halo-x", `${localX}px`);
      container.style.setProperty("--halo-y", `${localY}px`);
      const pressure = 1 - Math.sqrt(dx * dx + dy * dy) * 0.6;
      soundRef.current?.onTouch(Math.max(0, Math.min(1, pressure)));
    };
    const release = () => {
      orbs.forEach((orb) => {
        orb.style.transition = "transform 3.6s ease-out";
        orb.style.setProperty("--touch-x", "0px");
        orb.style.setProperty("--touch-y", "0px");
      });
      container.classList.remove("is-touching");
      soundRef.current?.onTouchEnd();
    };
    const onDown = (e: PointerEvent) => {
      container.classList.add("is-touching");
      apply(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      // For mouse: hover always animates. For touch: only when pressed.
      if (e.pointerType !== "mouse" && e.buttons === 0 && !container.classList.contains("is-touching")) return;
      if (e.pointerType === "mouse") container.classList.add("is-touching");
      apply(e.clientX, e.clientY);
    };
    const onUp = () => release();
    const onLeave = () => release();

    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [seq.id]);

  const changeIndex = (newIdx: number) => {
    if (newIdx === index) return;
    const current = soundRef.current;
    const next = createSound(sequence[newIdx]);
    if (current && playing) {
      current.fadeTo(next, 3000);
    } else {
      try { current?.destroy(); } catch (e) { void e; }
      if (playing) next.play();
    }
    soundRef.current = next;
    setIndex(newIdx);
  };
  const next = () => changeIndex((index + 1) % sequence.length);
  const prev = () => changeIndex((index - 1 + sequence.length) % sequence.length);

  const togglePlay = () => {
    const s = soundRef.current; if (!s) return;
    if (playing) { s.pause(); setPlaying(false); }
    else { s.resume(); setPlaying(true); }
  };

  const isFav = favorites.includes(seq.id);
  const onKeep = () => {
    if (isFav) return;
    const nx = [...favorites, seq.id];
    setFavorites(nx); saveFavorites(nx);
    setBloom(true);
    setTimeout(() => setBloom(false), 1800);
  };

  return (
    <div
      ref={containerRef}
      className={`souffle-scene scene-${seq.id} relative flex-1 flex flex-col overflow-hidden`}
    >
      <style>{ORB_STYLES}</style>
      <div className="scene-bg" />
      {/* Orbs key forces remount per sequence so animations restart cleanly */}
      <div key={seq.id} className="absolute inset-0">
        <SouffleOrbs id={seq.id} />
      </div>

      {/* Pause — top-right */}
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Reprendre"}
        className="absolute top-5 right-5 z-30 size-9 rounded-full flex items-center justify-center text-dusk/75"
        style={{
          background: "rgba(255,255,255,0.28)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {playing ? (
          <span className="flex gap-[3px]">
            <span className="block w-[3px] h-[12px] bg-current rounded-sm" />
            <span className="block w-[3px] h-[12px] bg-current rounded-sm" />
          </span>
        ) : (
          <span
            className="block"
            style={{
              width: 0, height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: "9px solid currentColor",
              marginLeft: 2,
            }}
          />
        )}
      </button>

      {/* Title */}
      <div className="relative z-10 pt-16 text-center pointer-events-none">
        <h2
          className="souffle-title font-serif italic text-[22px] leading-none text-dusk/85"
          style={{ textShadow: "0 1px 18px rgba(255,255,255,0.55)" }}
        >
          {noOrphan(seq.title)}
        </h2>
      </div>

      <div className="flex-1" />

      {bloom && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
          <BloomFlower />
        </div>
      )}

      {/* Bottom — manual navigation only, no auto-advance */}
      <div className="relative z-10 px-6 pb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="size-11 rounded-full flex items-center justify-center text-lg backdrop-blur-md text-dusk/70"
            style={{ background: "color-mix(in oklab, white 30%, transparent)" }}
            aria-label="Séquence précédente"
          >←</button>
          <button
            onClick={onKeep}
            disabled={isFav}
            className="flex-1 py-3 rounded-full text-[11px] uppercase tracking-[0.22em] backdrop-blur-md text-dusk/70"
            style={{ background: "color-mix(in oklab, white 30%, transparent)" }}
            aria-label={isFav ? "Séquence gardée" : "Garder cette séquence"}
          >
            {isFav ? "♥  gardée" : "♡  garder"}
          </button>
          <button
            onClick={next}
            className="size-11 rounded-full flex items-center justify-center text-lg backdrop-blur-md text-dusk/70"
            style={{ background: "color-mix(in oklab, white 30%, transparent)" }}
            aria-label="Séquence suivante"
          >→</button>
        </div>
        {favorites.length > 0 && (
          <Link
            to="/no-words"
            search={{ tab: "lire" } as never}
            className="text-center text-[10px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk"
          >
            Pour prolonger ce souffle&nbsp;→
          </Link>
        )}
      </div>

    </div>
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

