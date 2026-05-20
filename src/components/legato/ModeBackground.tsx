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
    gradient: "radial-gradient(ellipse at 30% 20%, #FFD9CC 0%, #FBE4D8 45%, #F5E2D5 100%)",
    blobs: [
      { width: 380, height: 320, color: "#F2A48E", blur: 90, opacity: 0.55,
        top: -80, right: -100, anim: "blob-float-1" },
      { width: 260, height: 260, color: "#F5C0B0", blur: 80, opacity: 0.40,
        bottom: 80, left: -60, anim: "blob-float-2" },
    ],
  },
  anchoring: {
    gradient: "radial-gradient(ellipse at 70% 25%, #D9E8D5 0%, #E8F0E2 50%, #EDF2E5 100%)",
    blobs: [
      { width: 460, height: 220, color: "#9CC09C", blur: 100, opacity: 0.50,
        top: -50, right: -120, transform: "rotate(-28deg)", anim: "blob-float-2" },
      { width: 240, height: 240, color: "#B8D4B0", blur: 85, opacity: 0.38,
        bottom: 60, right: -30, anim: "blob-float-3" },
    ],
  },
  breath: {
    gradient: "radial-gradient(circle at 50% 35%, #CFE0F2 0%, #E2ECF6 55%, #EAEFF6 100%)",
    blobs: [
      { width: 340, height: 340, color: "#8FB5DD", blur: 80, opacity: 0.50,
        top: 30, left: "50%", transform: "translateX(-50%)", anim: "blob-float-3" },
      { width: 220, height: 220, color: "#A8C4E0", blur: 70, opacity: 0.42,
        bottom: 120, left: -40, anim: "blob-float-4" },
    ],
  },
  relay: {
    gradient: "radial-gradient(ellipse at 40% 55%, #E2D6F2 0%, #EFE6F8 55%, #F0E8F6 100%)",
    blobs: [
      { width: 280, height: 280, color: "#B59DDB", blur: 75, opacity: 0.50,
        top: -40, left: -60, anim: "blob-float-4" },
      { width: 220, height: 220, color: "#D4C0E8", blur: 70, opacity: 0.45,
        bottom: 100, right: -40, anim: "blob-float-5" },
    ],
  },
};