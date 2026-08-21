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
