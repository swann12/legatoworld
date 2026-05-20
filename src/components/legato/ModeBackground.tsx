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
    gradient: "radial-gradient(ellipse at 35% 25%, #FFE8E0 0%, #FDF6F2 65%, #FAF2EE 100%)",
    blobs: [
      { width: 340, height: 290, color: "#F5C0B0", blur: 85, opacity: 0.22,
        top: -60, right: -80, anim: "blob-float-1" },
    ],
  },
  anchoring: {
    gradient: "radial-gradient(ellipse at 68% 28%, #EBF2EB 0%, #F5FAF5 65%, #F2F8F2 100%)",
    blobs: [
      { width: 420, height: 190, color: "#B8D4B8", blur: 100, opacity: 0.20,
        top: -40, right: -100, transform: "rotate(-28deg)", anim: "blob-float-2" },
    ],
  },
  breath: {
    gradient: "radial-gradient(circle at 52% 38%, #E8F0F8 0%, #F4F8FC 60%, #F0F4F8 100%)",
    blobs: [
      { width: 300, height: 300, color: "#A8C4E0", blur: 75, opacity: 0.18,
        top: 40, left: "50%", transform: "translateX(-50%)", anim: "blob-float-3" },
    ],
  },
  relay: {
    gradient: "radial-gradient(ellipse at 42% 58%, #F0EBF8 0%, #FAF8FC 65%, #F6F2FA 100%)",
    blobs: [
      { width: 220, height: 220, color: "#C8B8E0", blur: 70, opacity: 0.20,
        top: -30, left: -40, anim: "blob-float-4" },
      { width: 180, height: 180, color: "#D4C0E8", blur: 65, opacity: 0.18,
        bottom: 120, right: -30, anim: "blob-float-5" },
    ],
  },
};