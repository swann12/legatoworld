import { useMemo } from "react";
import { ELEMENTS } from "@/lib/elements";

/* LivingPatch — petit lopin de jardin propre à un être.
 * Densité = 0 → simple ovale terreux (lopin).
 * Densité grandit (0..1) avec le nombre de souvenirs.
 * Choix d'éléments déterministe par beingId (rendu identique à chaque visite). */

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function LivingPatch({
  beingId,
  density,
  tint,
  tint2,
}: {
  beingId: string;
  density: number;             // 0..1
  tint: string;
  tint2: string;
}) {
  const seed = useMemo(() => hash(beingId), [beingId]);

  // Combien d'éléments, par paliers
  const count =
    density <= 0.001 ? 0
    : density < 0.25 ? 1
    : density < 0.55 ? 3
    : density < 0.8  ? 5
                     : 7;

  // Pool : feuillage + florale, pioche déterministe
  const picks = useMemo(() => {
    const pool = ELEMENTS.filter(
      (e) => e.family === "florale" || e.family === "feuillage",
    );
    if (!pool.length) return [];
    const out: { src: string; left: number; top: number; size: number; rot: number; dur: number; delay: number; z: number }[] = [];
    for (let i = 0; i < count; i++) {
      const el = pool[(seed + i * 47) % pool.length];
      // Distribution organique sur l'ovale
      const a = ((seed + i * 91) % 360) * (Math.PI / 180);
      const r = 18 + ((seed + i * 13) % 26);
      out.push({
        src: el.src,
        left: 50 + Math.cos(a) * r * 0.7,
        top: 55 + Math.sin(a) * r * 0.45,
        size: 22 + ((seed + i * 17) % 18),
        rot: ((seed + i * 23) % 24) - 12,
        dur: 7 + ((seed + i * 7) % 5),
        delay: ((seed + i * 11) % 40) / 10,
        z: i,
      });
    }
    return out;
  }, [count, seed]);

  return (
    <div className="absolute inset-0 pointer-events-none bloom-in">
      {/* Éléments végétaux */}
      {picks.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute select-none feathered-soft sway-soft"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}%`,
            transform: `translate(-50%, -70%) rotate(${p.rot}deg)`,
            zIndex: p.z,
            mixBlendMode: "multiply",
            opacity: 0.9,
            ["--sway-dur" as string]: `${p.dur}s`,
            ["--sway-delay" as string]: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}