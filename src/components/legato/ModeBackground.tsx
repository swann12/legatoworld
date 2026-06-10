import type { Mode } from "@/lib/legato-state";

/**
 * Living full-screen background per Foyer mode.
 * Radial gradient + soft animated blob(s). Sits behind page content.
 * Used by <Shell> by default; pages that paint their own bg can opt out.
 */
export function ModeBackground({ mode }: { mode: Mode }) {
  const cfg = MODE_BG[mode];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden transition-[background] duration-[450ms] ease-out"
      style={{ background: cfg.gradient, zIndex: 0 }}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-dusk/8" />
    </div>
  );
}

type Blob = {
  width: number; height: number; color: string; blur: number; opacity: number;
  top?: string | number; left?: string | number; right?: string | number; bottom?: string | number;
  transform?: string;
  anim: string;
};

const MODE_BG: Record<Mode, { gradient: string; blobs: Blob[] }> = {
  cocoon: {
    // Aube lactée — chaleur intime, presque blanche
    gradient:
      "linear-gradient(180deg, #FFF9F4 0%, #F8EEE6 52%, #F5E6DA 100%)",
    blobs: [
      { width: 520, height: 420, color: "#F4D8C9", blur: 170, opacity: 0.18,
        top: -230, right: -220, anim: "blob-float-1" },
    ],
  },
  anchoring: {
    // Lin clair — sol doux, sans gris
    gradient:
      "linear-gradient(180deg, #FFFBF2 0%, #F7F1E4 52%, #F2EAD8 100%)",
    blobs: [
      { width: 520, height: 420, color: "#E4E4C9", blur: 175, opacity: 0.18,
        top: -220, right: -180, anim: "blob-float-2" },
    ],
  },
  breath: {
    // Ciel chaud — bleu très lavé, jamais froid
    gradient:
      "linear-gradient(180deg, #F7FBFC 0%, #EEF3F1 45%, #F7EBDD 100%)",
    blobs: [
      { width: 580, height: 430, color: "#D7E7EC", blur: 180, opacity: 0.18,
        top: -240, left: "48%", transform: "translateX(-50%)", anim: "blob-float-3" },
    ],
  },
  relay: {
    // Chaleur partagée — abricot clair, sans violet
    gradient:
      "linear-gradient(180deg, #FFF8F0 0%, #F8E8DA 52%, #F2DCCA 100%)",
    blobs: [
      { width: 540, height: 420, color: "#F0C8B6", blur: 175, opacity: 0.18,
        top: -220, left: -190, anim: "blob-float-4" },
    ],
  },
};