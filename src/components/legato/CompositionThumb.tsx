import { getElementById } from "@/lib/elements";
import type { CompositionItem } from "@/lib/memories-store";

/* CompositionThumb — mini-prévisualisation d'une composition (3:4)
 * pour la carte d'un souvenir. Fidèle aux positions/rotations/opacités/flips. */

export function CompositionThumb({
  items,
  className = "",
  width = 60,
  height = 80,
}: {
  items: CompositionItem[];
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-paper ${className}`}
      style={{
        width,
        height,
        borderRadius: 10,
        boxShadow:
          "inset 0 0 0 1px rgba(60,40,40,0.06), 0 6px 14px -10px rgba(60,40,40,0.25)",
      }}
      aria-hidden
    >
      {[...items]
        .sort((a, b) => (a.z ?? 0) - (b.z ?? 0))
        .map((it) => {
          const el = it.elementId ? getElementById(it.elementId) : null;
          if (!el) return null;
          const sx = it.flipX ? -1 : 1;
          const sy = it.flipY ? -1 : 1;
          return (
            <img
              key={it.id}
              src={el.src}
              alt=""
              draggable={false}
              className="absolute select-none feathered-soft"
              style={{
                left: `${it.x}%`,
                top: `${it.y}%`,
                width: `${it.width ?? 20}%`,
                height: `${it.height ?? 20}%`,
                transform: `translate(-50%, -50%) rotate(${it.rotation ?? 0}deg) scale(${sx}, ${sy})`,
                opacity: it.opacity ?? 1,
              }}
            />
          );
        })}
    </div>
  );
}