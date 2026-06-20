import { useEffect, useState } from "react";

/** Petite fleur qui éclôt à un endroit donné, puis disparaît en fondu.
 *  Cohérent avec l'animation du Jardin (pas de gadget, ~800ms d'apparition,
 *  fondu 1.2s). */
export function BloomFlower({ x, y, onDone }: { x: number; y: number; onDone?: () => void }) {
  const [phase, setPhase] = useState<"bloom" | "fade">("bloom");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 800);
    const t2 = setTimeout(() => onDone?.(), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[60]"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 1.1s ease-out",
      }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" style={{
        transform: phase === "bloom" ? "scale(1)" : "scale(1.15)",
        transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        transformOrigin: "center",
        animation: "bloom-in 800ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        <defs>
          <radialGradient id="petal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBE6D8" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#F2C9C0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E3A7A0" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="22"
            cy="13"
            rx="5"
            ry="9"
            fill="url(#petal)"
            transform={`rotate(${deg} 22 22)`}
          />
        ))}
        <circle cx="22" cy="22" r="3" fill="#F0D9A8" opacity="0.9" />
      </svg>
      <style>{`
        @keyframes bloom-in {
          0% { transform: scale(0.1); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/** Petit toast doux qui s'affiche en bas de l'écran 1.5s, puis disparaît. */
export function SoftToast({ text, onDone }: { text: string; onDone?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-[55] -translate-x-1/2 px-5 py-3 ceramic organic-radius-3 animate-fade-in"
      style={{ pointerEvents: "none" }}
    >
      <p className="font-serif text-[14px] text-dusk/85 text-center max-w-[26ch]">{text}</p>
    </div>
  );
}