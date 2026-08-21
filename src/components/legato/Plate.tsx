import presence from "@/assets/ill-presence.jpg";
import demarches from "@/assets/ill-demarches.jpg";
import corps from "@/assets/ill-corps.jpg";
import nuit from "@/assets/ill-nuit.jpg";
import memoire from "@/assets/ill-memoire.jpg";
import souffle from "@/assets/ill-souffle.jpg";

export const PLATES = {
  presence: { src: presence, alt: "Planche : main de mousse tenant un galet" },
  demarches: { src: demarches, alt: "Planche : deux mains liées, dessin à l'encre" },
  corps: { src: corps, alt: "Planche : colline de mousse et arbre solitaire" },
  nuit: { src: nuit, alt: "Planche : nuit bleue, lune pâle, île de mousse" },
  memoire: { src: memoire, alt: "Planche : spirale de nautile dorée sur bleu nuit" },

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
          className="h-full w-full object-cover"
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
