import spritesFlorale from "@/assets/sprites-florale.png";
import spritesHybride from "@/assets/sprites-hybride.png";
import spritesMarin from "@/assets/sprites-marin.png";
import spritesMineral from "@/assets/sprites-mineral.png";
import spritesAtmosphere from "@/assets/sprites-atmosphere.png";
import spritesFaune from "@/assets/sprites-faune.png";
import spritesFonds from "@/assets/sprites-fonds.png";

export type Family =
  | "florale"
  | "hybride"
  | "marin"
  | "minéral"
  | "atmosphère"
  | "fonds"
  | "faune";

export type Style =
  | "évanescent"
  | "pictural"
  | "ornemental"
  | "organique"
  | "surréaliste"
  | "japonisant"
  | "sculptural"
  | "dense"
  | "léger";

export type AtlasItem = {
  id: string;
  label: string;
  family: Family;
  styles: Style[];
  src: string;
  col: number;
  row: number;
  cols: number;
  rows: number;
};

const FLORALE_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "renoncule", label: "Renoncule", styles: ["pictural", "ornemental"] },
  { id: "anemone", label: "Anémone", styles: ["pictural", "dense"] },
  { id: "iris", label: "Iris", styles: ["pictural", "sculptural"] },
  { id: "pavot", label: "Pavot", styles: ["pictural", "dense"] },
  { id: "cosmos", label: "Cosmos", styles: ["léger", "évanescent"] },
  { id: "tulipe", label: "Tulipe", styles: ["pictural"] },
  { id: "marguerite", label: "Marguerite", styles: ["léger"] },
  { id: "pois-senteur", label: "Pois de senteur", styles: ["léger", "évanescent"] },
  { id: "renoncule-jaune", label: "Renoncule jaune", styles: ["pictural"] },
  { id: "lavande", label: "Lavande", styles: ["sculptural", "japonisant"] },
  { id: "fougere", label: "Fougère", styles: ["organique", "léger"] },
  { id: "herbes", label: "Herbes folles", styles: ["léger", "japonisant"] },
  { id: "saule-pleureur", label: "Saule pleureur", styles: ["japonisant", "évanescent"] },
  { id: "feuillage-ginkgo", label: "Feuillage ginkgo", styles: ["japonisant", "léger"] },
  { id: "lavande-haute", label: "Lavande haute", styles: ["sculptural"] },
  { id: "cerisier", label: "Cerisier en fleurs", styles: ["japonisant", "pictural"] },
  { id: "arbre-nu", label: "Arbre nu", styles: ["léger", "japonisant"] },
  { id: "pivoine", label: "Pivoine", styles: ["pictural", "dense"] },
  { id: "chardon", label: "Chardon séché", styles: ["organique"] },
  { id: "bouquet-sauvage", label: "Bouquet sauvage", styles: ["dense", "pictural"] },
  { id: "rose-ancienne", label: "Rose ancienne", styles: ["ornemental", "pictural"] },
  { id: "glycine", label: "Glycine", styles: ["évanescent", "japonisant"] },
  { id: "magnolia", label: "Magnolia", styles: ["pictural", "sculptural"] },
  { id: "hellebore", label: "Hellébore", styles: ["léger", "organique"] },
  { id: "muguet", label: "Muguet", styles: ["léger", "évanescent"] },
  { id: "mimosa", label: "Mimosa", styles: ["léger", "ornemental"] },
  { id: "hortensia", label: "Hortensia", styles: ["dense", "pictural"] },
  { id: "scabieuse", label: "Scabieuse", styles: ["léger", "pictural"] },
  { id: "dahlia", label: "Dahlia", styles: ["dense", "ornemental"] },
  { id: "petales-roses", label: "Pétales roses", styles: ["léger", "évanescent"] },
];

const HYBRIDE_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "fleur-nacre", label: "Fleur de nacre", styles: ["surréaliste", "ornemental"] },
  { id: "rose-corail", label: "Rose-corail", styles: ["surréaliste", "sculptural"] },
  { id: "arbre-nuage", label: "Arbre-nuage", styles: ["évanescent", "japonisant"] },
  { id: "arche-fleurie", label: "Arche fleurie", styles: ["sculptural", "ornemental"] },
  { id: "colonne-vegetale", label: "Colonne végétale", styles: ["sculptural", "organique"] },
  { id: "lotus-coquille", label: "Lotus dans coquille", styles: ["japonisant", "surréaliste"] },
  { id: "branche-cerisier", label: "Branche de cerisier", styles: ["japonisant", "pictural"] },
  { id: "lotus-rose", label: "Lotus rose", styles: ["japonisant", "ornemental"] },
  { id: "calice-orne", label: "Calice orné", styles: ["sculptural", "ornemental"] },
  { id: "fleur-tubulaire", label: "Fleur tubulaire", styles: ["organique", "sculptural"] },
  { id: "fleur-evanescente", label: "Fleur évanescente", styles: ["évanescent"] },
  { id: "bouquet-hybride", label: "Bouquet hybride", styles: ["dense", "ornemental"] },
  { id: "fleur-coquillage", label: "Fleur-coquillage", styles: ["surréaliste", "pictural"] },
  { id: "corolle-sculpturale", label: "Corolle sculpturale", styles: ["sculptural", "ornemental"] },
  { id: "tige-tubulaire", label: "Tige tubulaire", styles: ["organique", "sculptural"] },
  { id: "orchidee-surreelle", label: "Orchidée surréelle", styles: ["surréaliste", "pictural"] },
  { id: "fleur-klimt", label: "Fleur architecturale", styles: ["ornemental", "sculptural"] },
  { id: "meduse-fleur", label: "Méduse-fleur", styles: ["évanescent", "surréaliste"] },
  { id: "anemone-hybride", label: "Anémone hybride", styles: ["dense", "surréaliste"] },
  { id: "pavot-coquillage", label: "Pavot-coquillage", styles: ["pictural", "surréaliste"] },
];

const MARIN_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "stjacques", label: "Saint-Jacques", styles: ["pictural", "ornemental"] },
  { id: "conque", label: "Conque", styles: ["organique"] },
  { id: "nautile", label: "Nautile", styles: ["organique", "sculptural"] },
  { id: "porcelaine", label: "Porcelaine", styles: ["léger", "ornemental"] },
  { id: "corail-eventail", label: "Corail éventail", styles: ["organique"] },
  { id: "corail-rouge", label: "Corail rouge", styles: ["dense"] },
  { id: "corail-rose", label: "Corail rose", styles: ["dense", "ornemental"] },
  { id: "corail-jaune", label: "Corail jaune", styles: ["organique"] },
  { id: "anemone-mer", label: "Anémone de mer", styles: ["organique", "dense"] },
  { id: "hippocampe", label: "Hippocampe", styles: ["pictural"] },
  { id: "coquillages", label: "Petits coquillages", styles: ["léger", "ornemental"] },
  { id: "galet", label: "Galet", styles: ["léger", "organique"] },
  { id: "corail-brun", label: "Corail brun", styles: ["organique"] },
  { id: "corail-pale", label: "Corail pâle", styles: ["évanescent"] },
  { id: "algue", label: "Algue", styles: ["organique", "japonisant"] },
  { id: "sand-dollar", label: "Sand dollar", styles: ["léger", "ornemental"] },
  { id: "oursin", label: "Oursin", styles: ["dense", "surréaliste"] },
  { id: "etoile-mer", label: "Étoile de mer", styles: ["ornemental", "pictural"] },
  { id: "bigorneau", label: "Bigorneau", styles: ["organique"] },
  { id: "ormeau", label: "Ormeau", styles: ["ornemental", "pictural"] },
  { id: "murex", label: "Murex", styles: ["sculptural", "organique"] },
  { id: "conque-trompette", label: "Conque trompette", styles: ["sculptural"] },
  { id: "triton", label: "Triton", styles: ["sculptural", "ornemental"] },
  { id: "coquillage-cornet", label: "Coquillage cornet", styles: ["léger"] },
  { id: "moule", label: "Moule", styles: ["dense", "pictural"] },
  { id: "huitre", label: "Huître", styles: ["organique", "pictural"] },
  { id: "meduse", label: "Méduse", styles: ["évanescent", "surréaliste"] },
  { id: "algue-brune", label: "Algue brune", styles: ["organique"] },
  { id: "varech", label: "Varech", styles: ["organique", "léger"] },
  { id: "plume-mer", label: "Plume de mer", styles: ["évanescent", "ornemental"] },
];

const MINERAL_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "arche-poreuse", label: "Arche poreuse", styles: ["sculptural", "organique"] },
  { id: "colonne-erodee", label: "Colonne érodée", styles: ["sculptural"] },
  { id: "escalier-spiral", label: "Escalier spiral", styles: ["sculptural", "surréaliste"] },
  { id: "escalier-sinueux", label: "Escalier sinueux", styles: ["sculptural"] },
  { id: "pierre-poreuse", label: "Pierre poreuse", styles: ["organique"] },
  { id: "galet-tachete", label: "Galet tacheté", styles: ["organique", "léger"] },
  { id: "roche-cratere", label: "Roche cratère", styles: ["organique", "dense"] },
  { id: "cavite-spirale", label: "Cavité spirale", styles: ["organique", "sculptural"] },
  { id: "corail-mineral", label: "Corail minéral", styles: ["organique", "ornemental"] },
  { id: "niche-coquille", label: "Niche coquille", styles: ["sculptural", "ornemental"] },
  { id: "portail-floral", label: "Portail floral", styles: ["sculptural", "ornemental"] },
  { id: "niche-rose", label: "Niche rose", styles: ["ornemental"] },
  { id: "geode-bleue", label: "Géode bleue", styles: ["sculptural"] },
  { id: "geode-violette", label: "Géode violette", styles: ["sculptural"] },
  { id: "grotte", label: "Grotte", styles: ["surréaliste", "dense"] },
  { id: "cairn", label: "Cairn", styles: ["léger", "japonisant"] },
  { id: "monolithe", label: "Monolithe", styles: ["sculptural", "dense"] },
  { id: "colonne-brisee", label: "Colonne brisée", styles: ["sculptural"] },
  { id: "arche-brisee", label: "Arche brisée", styles: ["sculptural", "surréaliste"] },
  { id: "fenetre-erodee", label: "Fenêtre érodée", styles: ["organique", "surréaliste"] },
];

const ATMOSPHERE_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "nuage-blanc", label: "Nuage blanc", styles: ["évanescent", "léger"] },
  { id: "nuage-gris", label: "Nuage gris", styles: ["dense", "pictural"] },
  { id: "stratus", label: "Stratus", styles: ["évanescent"] },
  { id: "soleil", label: "Soleil", styles: ["évanescent", "ornemental"] },
  { id: "lune-croissant", label: "Croissant de lune", styles: ["évanescent"] },
  { id: "pleine-lune", label: "Pleine lune", styles: ["évanescent"] },
  { id: "halo", label: "Halo doré", styles: ["évanescent", "ornemental"] },
  { id: "brume-rose", label: "Brume rose", styles: ["évanescent"] },
  { id: "horizon-aube", label: "Horizon d'aube", styles: ["évanescent"] },
  { id: "horizon-crepuscule", label: "Crépuscule", styles: ["pictural"] },
  { id: "horizon-mer", label: "Horizon de mer", styles: ["évanescent", "pictural"] },
  { id: "poussiere-or", label: "Poussière d'or", styles: ["évanescent", "ornemental"] },
  { id: "nuage-klimt", label: "Nuage rose", styles: ["ornemental", "pictural"] },
  { id: "nappe-lumineuse", label: "Nappe lumineuse", styles: ["évanescent"] },
  { id: "halo-argente", label: "Halo argenté", styles: ["évanescent", "ornemental"] },
  { id: "arc-pastel", label: "Arc pastel", styles: ["évanescent", "surréaliste"] },
  { id: "etoile-filante", label: "Étoile filante", styles: ["léger", "ornemental"] },
  { id: "constellation", label: "Constellation", styles: ["léger", "ornemental"] },
  { id: "vapeur", label: "Vapeur blanche", styles: ["évanescent"] },
  { id: "brume-bleue", label: "Brume bleu-gris", styles: ["évanescent"] },
];

const FONDS_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "fond-aube-rose", label: "Fond aube rose", styles: ["évanescent", "pictural"] },
  { id: "fond-brume-lilas", label: "Fond brume lilas", styles: ["évanescent", "japonisant"] },
  { id: "fond-prairie-sauge", label: "Fond prairie sauge", styles: ["organique", "léger"] },
  { id: "fond-or-doux", label: "Fond or doux", styles: ["ornemental", "évanescent"] },
  { id: "fond-mer-bleue", label: "Fond mer bleue", styles: ["pictural", "évanescent"] },
  { id: "fond-couchant-rose", label: "Fond couchant rose", styles: ["pictural", "dense"] },
  { id: "fond-matin-jaune", label: "Fond matin jaune", styles: ["léger", "évanescent"] },
  { id: "fond-soir-mauve", label: "Fond soir mauve", styles: ["évanescent", "pictural"] },
  { id: "fond-terre-rose", label: "Fond terre rose", styles: ["organique", "pictural"] },
  { id: "fond-songe-bleu", label: "Fond songe bleu", styles: ["évanescent", "léger"] },
  { id: "fond-haze-rose", label: "Fond haze rose", styles: ["évanescent", "ornemental"] },
  { id: "fond-halo-creme", label: "Fond halo crème", styles: ["ornemental", "évanescent"] },
];

const FAUNE_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "coleoptere", label: "Coléoptère", styles: ["pictural"] },
  { id: "libellule", label: "Libellule", styles: ["léger", "japonisant"] },
  { id: "phalene", label: "Phalène", styles: ["léger"] },
  { id: "fauvette", label: "Fauvette", styles: ["pictural"] },
  { id: "hirondelle", label: "Hirondelle", styles: ["pictural", "léger"] },
  { id: "becasseau", label: "Bécasseau", styles: ["pictural"] },
  { id: "abeille", label: "Abeille", styles: ["pictural"] },
  { id: "mante", label: "Mante", styles: ["organique"] },
  { id: "papillon", label: "Papillon", styles: ["pictural"] },
  { id: "escargot", label: "Escargot", styles: ["léger"] },
  { id: "lezard", label: "Lézard", styles: ["organique"] },
  { id: "chrysope", label: "Chrysope", styles: ["léger"] },
  { id: "bernard-hermite", label: "Bernard-l'ermite", styles: ["organique"] },
  { id: "coccinelle", label: "Coccinelle", styles: ["léger"] },
  { id: "cloporte", label: "Cloporte", styles: ["organique"] },
  { id: "mesange", label: "Mésange", styles: ["pictural", "léger"] },
  { id: "rouge-gorge", label: "Rouge-gorge", styles: ["pictural"] },
  { id: "sphinx", label: "Papillon de nuit", styles: ["dense", "pictural"] },
  { id: "demoiselle", label: "Demoiselle", styles: ["léger", "japonisant"] },
  { id: "sauterelle", label: "Sauterelle", styles: ["organique", "léger"] },
];

function build(
  list: { id: string; label: string; styles: Style[] }[],
  family: Family,
  src: string,
  cols: number,
  rows: number,
): AtlasItem[] {
  return list.map((item, i) => ({
    ...item,
    family,
    src,
    col: i % cols,
    row: Math.floor(i / cols),
    cols,
    rows,
  }));
}

export const ATLAS: AtlasItem[] = [
  ...build(FLORALE_LIST, "florale", spritesFlorale, 6, 5),
  ...build(HYBRIDE_LIST, "hybride", spritesHybride, 5, 4),
  ...build(MARIN_LIST, "marin", spritesMarin, 6, 5),
  ...build(MINERAL_LIST, "minéral", spritesMineral, 5, 4),
  ...build(ATMOSPHERE_LIST, "atmosphère", spritesAtmosphere, 5, 4),
  ...build(FONDS_LIST, "fonds", spritesFonds, 3, 4),
  ...build(FAUNE_LIST, "faune", spritesFaune, 4, 5),
];

export const FAMILIES: { id: Family; label: string }[] = [
  { id: "florale", label: "Botanique" },
  { id: "hybride", label: "Hybride" },
  { id: "marin", label: "Marin / Littoral" },
  { id: "minéral", label: "Minéral / Architecture" },
  { id: "atmosphère", label: "Atmosphère / Ciel" },
  { id: "fonds", label: "Fonds / Lavis" },
  { id: "faune", label: "Faune discrète" },
];

export const STYLES: Style[] = [
  "évanescent",
  "pictural",
  "ornemental",
  "organique",
  "surréaliste",
  "japonisant",
  "sculptural",
  "dense",
  "léger",
];

export function getAtlasItem(id: string): AtlasItem | undefined {
  return ATLAS.find((a) => a.id === id);
}
