import presence from "@/assets/ill-presence.png";
import demarches from "@/assets/ill-demarches.png";
import corps from "@/assets/ill-corps.png";
import nuit from "@/assets/ill-nuit.png";
import memoire from "@/assets/ill-memoire.png";
import souffle from "@/assets/ill-souffle.png";

export const PLATES = {
  presence: { src: presence, alt: "Collage : galet couvert de mousse, aplat terracotta décalé, tige sèche" },
  demarches: { src: demarches, alt: "Collage : papiers déchirés empilés, ligne graduée à l'encre, aplat olive" },
  corps: { src: corps, alt: "Collage : mousse, pierre grainée, fougère séchée et halo rose" },
  nuit: { src: nuit, alt: "Collage : pierre dressée sur un îlot d'herbes, fleurs sèches suspendues" },
  memoire: { src: memoire, alt: "Collage : plaques de lichen et fragments minéraux reliés par des traits fins" },
  souffle: { src: souffle, alt: "Collage : fleurs séchées dressées au-dessus d'un aplat terracotta" },

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
        className="relative"
        style={{ aspectRatio: ratio, background: "transparent" }}
      >
        <img
          src={plate.src}
          alt={plate.alt}
          width={1024}
          height={1024}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-contain"
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
