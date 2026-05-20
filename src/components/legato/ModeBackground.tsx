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
      {cfg.blobs.map((b, i) => (
        <div
          key={i}
          className={b.anim}
          style={{
            position: "absolute",
            width: b.width,
            height: b.height,
            background: b.color,
            filter: `blur(${b.blur}px)`,
            opacity: b.opacity,
            borderRadius: "50%",
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            transform: b.transform,
          }}
        />
      ))}
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
    // Aube douce — ciel rose qui glisse vers l'abricot
    gradient:
      "linear-gradient(180deg, #E8DDE4 0%, #F3D9D0 38%, #F8E2D3 72%, #F1DCCC 100%)",
    blobs: [
      { width: 520, height: 520, color: "#F4B8A4", blur: 120, opacity: 0.45,
        top: -180, right: -160, anim: "blob-float-1" },
      { width: 360, height: 360, color: "#E8C4D0", blur: 110, opacity: 0.35,
        bottom: -100, left: -120, anim: "blob-float-2" },
    ],
  },
  anchoring: {
    // Brume de matin — ciel pâle qui pose sur sauge tendre
    gradient:
      "linear-gradient(180deg, #E4ECE5 0%, #EAF1E3 40%, #F0F2E0 72%, #EEEAD8 100%)",
    blobs: [
      { width: 540, height: 480, color: "#B8D2B0", blur: 130, opacity: 0.38,
        top: -180, right: -140, anim: "blob-float-2" },
      { width: 320, height: 320, color: "#D8E0BE", blur: 100, opacity: 0.34,
        bottom: -80, left: -100, anim: "blob-float-3" },
    ],
  },
  breath: {
    // Ciel d'altitude — bleu lavé qui fond dans la lumière
    gradient:
      "linear-gradient(180deg, #BCCFE2 0%, #D5E1EC 38%, #ECEAE3 78%, #F0E5DA 100%)",
    blobs: [
      { width: 600, height: 500, color: "#9FBDD8", blur: 140, opacity: 0.32,
        top: -200, left: "50%", transform: "translateX(-50%)", anim: "blob-float-3" },
      { width: 360, height: 360, color: "#E8D4C0", blur: 120, opacity: 0.35,
        bottom: -120, right: -100, anim: "blob-float-4" },
    ],
  },
  relay: {
    // Crépuscule tendre — lavande qui descend vers la chaleur
    gradient:
      "linear-gradient(180deg, #D6CFE6 0%, #E2D6E8 40%, #EEDCD8 75%, #F0DCCC 100%)",
    blobs: [
      { width: 520, height: 460, color: "#B8A6D8", blur: 130, opacity: 0.36,
        top: -160, left: -140, anim: "blob-float-4" },
      { width: 360, height: 360, color: "#E8C0C8", blur: 115, opacity: 0.34,
        bottom: -100, right: -120, anim: "blob-float-5" },
    ],
  },
};