import presence from "@/assets/ill-presence.jpg";
import demarches from "@/assets/ill-demarches.jpg";
import corps from "@/assets/ill-corps.jpg";
import nuit from "@/assets/ill-nuit.jpg";
import memoire from "@/assets/ill-memoire.jpg";
import souffle from "@/assets/ill-souffle.jpg";

export const PLATES = {
  presence: { src: presence, alt: "Planche : une main ouverte tenant un galet, une graminée séchée" },
  demarches: { src: demarches, alt: "Planche : papier plié, petite clé, fougère pressée, fragments" },
  corps: { src: corps, alt: "Planche : bol d'eau, linge plié, pain, feuille d'olivier" },
  nuit: { src: nuit, alt: "Planche : nuée d'encre bleue, lune pâle, herbes fines" },
  memoire: { src: memoire, alt: "Planche : fragment de lettre, fleur séchée, photographie de ciel" },
  souffle: { src: souffle, alt: "Planche : aigrette de pissenlit et graines emportées" },
} as const;

export type PlateName = keyof typeof PLATES;

/**
 * Planche illustrée — collage botanique posé sur le papier.
 * `caption` : un mot-clé discret, comme une légende d'herbier.
 */
export function Plate({
  name,
  caption,
  ratio = "1 / 1",
  className = "",
  priority = false,
}: {
  name: PlateName;
  caption?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
}) {
  const plate = PLATES[name];
  return (
    <figure className={`relative ${className}`}>
      <Scatter seed={name} />
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: ratio, background: "transparent" }}
      >
        <img
          src={plate.src}
          alt={plate.alt}
          width={1024}
          height={1024}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-contain"
          style={{ mixBlendMode: "multiply", opacity: 0.97 }}
        />
      </div>
      {caption && (
        <figcaption
          className="mono-label mt-2.5 block"
          style={{ color: "color-mix(in oklab, var(--dusk) 45%, transparent)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* Éléments épars — fragments colorés qui débordent de la planche.
 * Déterministe par nom de planche : même composition à chaque visite. */
const SCATTER_PALETTE = ["#2C3E7B", "#D9552F", "#7F7D47", "#E8A62B"];

function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function Scatter({ seed }: { seed: string }) {
  const h = hashSeed(seed);
  const bits = Array.from({ length: 7 }, (_, i) => {
    const n = h + i * 977;
    const round = (n >> 3) % 3 !== 0;
    return {
      color: SCATTER_PALETTE[(n >> 2) % SCATTER_PALETTE.length],
      size: 5 + (n % 13),
      top: -5 + ((n >> 4) % 112),
      left: -7 + ((n >> 6) % 116),
      round,
      rot: ((n >> 5) % 90) - 45,
      opacity: 0.5 + ((n >> 7) % 4) / 10,
    };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute -inset-6 overflow-visible">
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: b.size,
            height: b.round ? b.size : Math.max(2, b.size / 4),
            background: b.color,
            opacity: b.opacity,
            borderRadius: b.round ? "9999px" : "1px",
            transform: `rotate(${b.rot}deg)`,
            mixBlendMode: "multiply",
          }}
        />
      ))}
    </div>
  );
}
