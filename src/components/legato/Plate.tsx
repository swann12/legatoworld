import presence from "@/assets/ill-presence.jpg";
import demarches from "@/assets/ill-demarches.jpg";
import corps from "@/assets/ill-corps.jpg";
import nuit from "@/assets/ill-nuit.jpg";
import memoire from "@/assets/ill-memoire.jpg";
import souffle from "@/assets/ill-souffle.jpg";

export const PLATES = {
  presence: { src: presence, alt: "Collage : une main ouverte tenant une mousse et un galet" },
  demarches: { src: demarches, alt: "Collage : enveloppe, papiers superposés, fougère pressée et petite clé" },
  corps: { src: corps, alt: "Collage : bol d'eau, pain, linge plié et paysage de collines" },
  nuit: { src: nuit, alt: "Collage : deux silhouettes assises dans les herbes sous une lune pâle" },
  memoire: { src: memoire, alt: "Collage : fragments de lettres et fleurs séchées pressées" },
  souffle: { src: souffle, alt: "Collage : herbes fines et souffle coloré montant vers le ciel" },
} as const;

export type PlateName = keyof typeof PLATES;

/**
 * Planche illustrée — collage botanique posé sur le papier.
 * `caption` : un mot-clé discret, comme une légende d'herbier.
 */
export function Plate({
  name,
  caption,
  ratio = "4 / 3",
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
        className="overflow-hidden rounded-[18px]"
        style={{ aspectRatio: ratio, background: "var(--paper)" }}
      >
        <img
          src={plate.src}
          alt={plate.alt}
          width={1024}
          height={1024}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover"
          style={{ mixBlendMode: "multiply", opacity: 0.96 }}
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
