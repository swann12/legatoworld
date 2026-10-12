/** Sons doux générés dans le navigateur (aucun fichier audio) : pluie, mer, forêt, matin, nuit. */
export type AmbientKind = "pluie" | "mer" | "foret" | "matin" | "nuit";

export type Ambient = { pause: () => void; resume: () => void; stop: () => void };

function noiseBuffer(ctx: AudioContext, color: "white" | "pink" | "brown") {
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0, b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (color === "white") d[i] = w;
    else if (color === "brown") { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    else { b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048; d[i] = (b0 + b1 + b2 + w * 0.02) * 2; }
  }
  return buf;
}

export function startAmbient(kind: AmbientKind): Ambient | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);

  const src = ctx.createBufferSource();
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  const g = ctx.createGain();
  src.connect(filter).connect(g).connect(master);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.connect(lfoGain).connect(g.gain);

  const preset = {
    pluie: { color: "white", type: "bandpass", f: 2500, q: 0.4, gain: 0.12, lfo: 0, depth: 0 },
    mer:   { color: "brown", type: "lowpass", f: 700, q: 0.7, gain: 0.35, lfo: 0.09, depth: 0.25 },
    foret: { color: "pink", type: "bandpass", f: 1800, q: 0.6, gain: 0.16, lfo: 0.2, depth: 0.06 },
    matin: { color: "pink", type: "lowpass", f: 600, q: 0.5, gain: 0.12, lfo: 0.05, depth: 0.04 },
    nuit:  { color: "brown", type: "lowpass", f: 320, q: 0.5, gain: 0.3, lfo: 0.06, depth: 0.08 },
  }[kind] as { color: "white" | "pink" | "brown"; type: BiquadFilterType; f: number; q: number; gain: number; lfo: number; depth: number };

  src.buffer = noiseBuffer(ctx, preset.color);
  filter.type = preset.type;
  filter.frequency.value = preset.f;
  filter.Q.value = preset.q;
  g.gain.value = preset.gain;
  lfo.frequency.value = preset.lfo || 0.01;
  lfoGain.gain.value = preset.depth;

  // Un bourdon très doux pour Matin et Nuit
  let drone: OscillatorNode | null = null;
  if (kind === "matin" || kind === "nuit") {
    drone = ctx.createOscillator();
    const dg = ctx.createGain();
    drone.frequency.value = kind === "matin" ? 220 : 110;
    dg.gain.value = 0.015;
    drone.connect(dg).connect(master);
    drone.start();
  }

  src.start();
  lfo.start();

  return {
    pause: () => { void ctx.suspend(); },
    resume: () => { void ctx.resume(); },
    stop: () => {
      try {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        setTimeout(() => { try { src.stop(); lfo.stop(); drone?.stop(); void ctx.close(); } catch { /* déjà arrêté */ } }, 700);
      } catch { /* noop */ }
    },
  };
}

export const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
