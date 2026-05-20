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
    // Aube — ciel beige rosé presque imperceptible
    gradient:
      "linear-gradient(180deg, #F4ECE4 0%, #F6EAE0 50%, #F4E4D8 100%)",
    blobs: [
      { width: 460, height: 460, color: "#F0CFC2", blur: 140, opacity: 0.22,
        top: -200, right: -180, anim: "blob-float-1" },
    ],
  },
  anchoring: {
    // Brume claire — beige avec un soupçon de sauge
    gradient:
      "linear-gradient(180deg, #EFEFE6 0%, #F1EFE2 50%, #F3ECDC 100%)",
    blobs: [
      { width: 480, height: 420, color: "#CFD7C0", blur: 150, opacity: 0.20,
        top: -200, right: -160, anim: "blob-float-2" },
    ],
  },
  breath: {
    // Ciel d'altitude — bleu pâle qui s'efface dans le beige chaud
    gradient:
      "linear-gradient(180deg, #DCE4EC 0%, #ECE9E1 55%, #F3E8D8 100%)",
    blobs: [
      { width: 540, height: 440, color: "#BDCFE0", blur: 150, opacity: 0.22,
        top: -220, left: "50%", transform: "translateX(-50%)", anim: "blob-float-3" },
    ],
  },
  relay: {
    // Chaleur partagée — terre rose, ambre tendre, jamais violet
    gradient:
      "linear-gradient(180deg, #F2E4DB 0%, #F2DCCE 55%, #EFD0C0 100%)",
    blobs: [
      { width: 500, height: 440, color: "#E8B8A4", blur: 150, opacity: 0.22,
        top: -180, left: -140, anim: "blob-float-4" },
    ],
  },
};