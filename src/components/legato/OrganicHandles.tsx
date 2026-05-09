import type React from "react";

/* OrganicHandles — petite couronne flottante de pastilles céramiques
 * autour d'un élément sélectionné dans le composeur ou le mini-composer.
 * - nord  : rotation (glisser circulaire)
 * - est   : taille (glisser radial / vertical)
 * - sud   : opacité (glisser vertical)
 * - ouest : miroir (tap H, double-tap V) */

export type HandleKind = "rotate" | "scale" | "opacity" | "flipH" | "flipV";

export function OrganicHandles({
  onPointerDown,
  onFlipH,
  onFlipV,
}: {
  onPointerDown: (kind: "rotate" | "scale" | "opacity") => (e: React.PointerEvent) => void;
  onFlipH: () => void;
  onFlipV: () => void;
}) {
  const dotBase =
    "absolute size-[22px] rounded-full bg-paper border border-dusk/25 shadow-[0_2px_6px_rgba(60,40,40,0.18),inset_0_1px_1px_rgba(255,255,255,0.85)] flex items-center justify-center text-[10px] text-dusk/65 select-none transition-transform";

  let lastFlipTap = 0;
  const onFlipTap = () => {
    const now = Date.now();
    if (now - lastFlipTap < 320) onFlipV();
    else onFlipH();
    lastFlipTap = now;
  };

  return (
    <>
      {/* Halo discret de sélection */}
      <div
        className="absolute inset-[-8%] pointer-events-none"
        style={{
          borderRadius: "50%",
          boxShadow: "0 0 0 1px color-mix(in oklab, var(--dusk) 18%, transparent)",
        }}
      />
      {/* Nord — rotation */}
      <button
        aria-label="Tourner"
        onPointerDown={onPointerDown("rotate")}
        className={`${dotBase} left-1/2 -top-9 -translate-x-1/2 cursor-grab active:cursor-grabbing`}
        style={{ touchAction: "none" }}
      >
        ↻
      </button>
      {/* Est — taille */}
      <button
        aria-label="Redimensionner"
        onPointerDown={onPointerDown("scale")}
        className={`${dotBase} -right-9 top-1/2 -translate-y-1/2`}
        style={{ touchAction: "none" }}
      >
        ⤡
      </button>
      {/* Sud — opacité */}
      <button
        aria-label="Opacité"
        onPointerDown={onPointerDown("opacity")}
        className={`${dotBase} left-1/2 -bottom-9 -translate-x-1/2`}
        style={{ touchAction: "none" }}
      >
        ◐
      </button>
      {/* Ouest — miroir */}
      <button
        aria-label="Miroir"
        onClick={(e) => {
          e.stopPropagation();
          onFlipTap();
        }}
        className={`${dotBase} -left-9 top-1/2 -translate-y-1/2`}
      >
        ⇋
      </button>
    </>
  );
}