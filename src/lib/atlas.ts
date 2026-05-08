import spritesFlorale from "@/assets/sprites-florale.png";
import spritesHybride from "@/assets/sprites-hybride.png";
import spritesMarin from "@/assets/sprites-marin.png";
import spritesMineral from "@/assets/sprites-mineral.png";
import spritesAtmosphere from "@/assets/sprites-atmosphere.png";
import spritesFaune from "@/assets/sprites-faune.png";

/* ───────── Atlas — éléments isolés extraits des planches sources ─────────
   Chaque élément est une fenêtre rectangulaire (en %) découpée dans une
   planche peinte. Les éléments restent picturaux, jamais des pictogrammes. */

export type Family =
  | "florale"     // botanique picturale, fleurs isolées, feuillages, arbres
  | "hybride"     // fleurs-coraux, formes hybrides, sculpturales
  | "marin"       // coquillages, coraux, architectures marines
  | "minéral"     // pierres, arches, cavités, fragments
  | "atmosphère"  // nuages, halos, soleils, brumes
  | "faune";      // papillons, libellules, oiseaux, lézards, insectes

export type Style =
  | "évanescent" | "pictural" | "ornemental"
  | "organique" | "surréaliste" | "japonisant"
  | "sculptural" | "dense" | "léger";

export type AtlasItem = {
  id: string;
  label: string;
  family: Family;
  styles: Style[];
  src: string;
  /** colonne (0-indexée) dans la grille de la planche */
  col: number;
  /** ligne (0-indexée) dans la grille de la planche */
  row: number;
  /** nombre total de colonnes de la planche */
  cols: number;
  /** nombre total de lignes de la planche */
  rows: number;
};

/* ───────── Planches sprites — chaque élément est isolé sur fond
   transparent et placé dans une cellule de grille régulière. ───────── */

/* FLORALE — 5 cols × 4 rows, ordre exact de la planche */
const FLORALE_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "renoncule",      label: "Renoncule",       styles: ["pictural","ornemental"] },
  { id: "anemone",        label: "Anémone",         styles: ["pictural"] },
  { id: "iris",           label: "Iris",            styles: ["pictural","sculptural"] },
  { id: "pavot",          label: "Pavot",           styles: ["pictural","dense"] },
  { id: "cosmos",         label: "Cosmos",          styles: ["léger","évanescent"] },
  { id: "tulipe",         label: "Tulipe",          styles: ["pictural"] },
  { id: "marguerite",     label: "Marguerite",      styles: ["léger"] },
  { id: "pois-senteur",   label: "Pois de senteur", styles: ["léger","évanescent"] },
  { id: "renoncule-jaune",label: "Renoncule jaune", styles: ["pictural"] },
  { id: "lavande",        label: "Lavande",         styles: ["sculptural","japonisant"] },
  { id: "fougere",        label: "Fougère",         styles: ["organique","léger"] },
  { id: "herbes",         label: "Herbes",          styles: ["léger","japonisant"] },
  { id: "saule-pleureur", label: "Saule pleureur",  styles: ["japonisant","évanescent"] },
  { id: "feuillage-leger",label: "Feuillage léger", styles: ["léger","évanescent"] },
  { id: "lavande-haute",  label: "Lavande haute",   styles: ["sculptural"] },
  { id: "cerisier",       label: "Cerisier en fleurs", styles: ["japonisant","pictural"] },
  { id: "arbre-nu",       label: "Arbre nu",        styles: ["léger","japonisant"] },
  { id: "pivoine",        label: "Pivoine",         styles: ["pictural","dense"] },
  { id: "chardon",        label: "Chardon séché",   styles: ["organique"] },
  { id: "bouquet-sauvage",label: "Bouquet sauvage", styles: ["dense","pictural"] },
];

/* MARIN — 4 cols × 4 rows */
const MARIN_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "stjacques",     label: "Saint-Jacques",  styles: ["pictural"] },
  { id: "conque",        label: "Conque",         styles: ["organique"] },
  { id: "nautile",       label: "Nautile",        styles: ["organique","sculptural"] },
  { id: "porcelaine",    label: "Porcelaine",     styles: ["léger","ornemental"] },
  { id: "corail-eventail",label:"Corail éventail",styles: ["organique"] },
  { id: "corail-rouge",  label: "Corail rouge",   styles: ["dense"] },
  { id: "corail-rose",   label: "Corail rose",    styles: ["dense","ornemental"] },
  { id: "corail-jaune",  label: "Corail jaune",   styles: ["organique"] },
  { id: "anemone-mer",   label: "Anémone de mer", styles: ["organique"] },
  { id: "hippocampe",    label: "Hippocampe",     styles: ["pictural"] },
  { id: "coquillages",   label: "Petits coquillages", styles: ["léger","ornemental"] },
  { id: "galet",         label: "Galet",          styles: ["léger"] },
  { id: "corail-brun",   label: "Corail brun",    styles: ["organique"] },
  { id: "corail-pale",   label: "Corail pâle",    styles: ["évanescent"] },
  { id: "algue",         label: "Algue",          styles: ["organique","japonisant"] },
  { id: "sand-dollar",   label: "Sand dollar",    styles: ["léger","ornemental"] },
];

/* ATMOSPHÈRE — 4 cols × 3 rows */
const ATMOSPHERE_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "nuage-blanc",       label: "Nuage blanc",      styles: ["évanescent","léger"] },
  { id: "nuage-gris",        label: "Nuage gris",       styles: ["dense","pictural"] },
  { id: "stratus",           label: "Stratus",          styles: ["évanescent"] },
  { id: "soleil",            label: "Soleil",           styles: ["évanescent","ornemental"] },
  { id: "lune-croissant",    label: "Croissant de lune",styles: ["évanescent"] },
  { id: "pleine-lune",       label: "Pleine lune",      styles: ["évanescent"] },
  { id: "halo",              label: "Halo doré",        styles: ["évanescent","ornemental"] },
  { id: "brume-rose",        label: "Brume rose",       styles: ["évanescent"] },
  { id: "horizon-aube",      label: "Horizon d'aube",   styles: ["évanescent"] },
  { id: "horizon-crepuscule",label: "Crépuscule",       styles: ["pictural"] },
  { id: "horizon-mer",       label: "Horizon de mer",   styles: ["évanescent","pictural"] },
  { id: "poussiere-or",      label: "Poussière d'or",   styles: ["évanescent","ornemental"] },
];

/* FAUNE — 3 cols × 5 rows */
const FAUNE_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "coleoptere",     label: "Coléoptère",      styles: ["pictural"] },
  { id: "libellule",      label: "Libellule",       styles: ["léger","japonisant"] },
  { id: "phalene",        label: "Phalène",         styles: ["léger"] },
  { id: "fauvette",       label: "Fauvette",        styles: ["pictural"] },
  { id: "hirondelle",     label: "Hirondelle",      styles: ["pictural"] },
  { id: "becasseau",      label: "Bécasseau",       styles: ["pictural"] },
  { id: "abeille",        label: "Abeille",         styles: ["pictural"] },
  { id: "mante",          label: "Mante",           styles: ["organique"] },
  { id: "papillon",       label: "Papillon",        styles: ["pictural"] },
  { id: "escargot",       label: "Escargot",        styles: ["léger"] },
  { id: "lezard",         label: "Lézard",          styles: ["organique"] },
  { id: "chrysope",       label: "Chrysope",        styles: ["léger"] },
  { id: "bernard-hermite",label: "Bernard-l'ermite",styles: ["organique"] },
  { id: "coccinelle",     label: "Coccinelle",      styles: ["léger"] },
  { id: "cloporte",       label: "Cloporte",        styles: ["organique"] },
];

/* MINÉRAL — 4 cols × 4 rows */
const MINERAL_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "arche-poreuse",   label: "Arche poreuse",   styles: ["sculptural","organique"] },
  { id: "colonne-erodee",  label: "Colonne érodée",  styles: ["sculptural"] },
  { id: "escalier-spiral", label: "Escalier spiral", styles: ["sculptural","surréaliste"] },
  { id: "escalier-sinueux",label: "Escalier sinueux",styles: ["sculptural"] },
  { id: "pierre-poreuse",  label: "Pierre poreuse",  styles: ["organique"] },
  { id: "galet-tachete",   label: "Galet tacheté",   styles: ["organique","léger"] },
  { id: "roche-cratere",   label: "Roche cratère",   styles: ["organique","dense"] },
  { id: "cavite-spirale",  label: "Cavité spirale",  styles: ["organique","sculptural"] },
  { id: "corail-mineral",  label: "Corail minéral",  styles: ["organique"] },
  { id: "niche-coquille",  label: "Niche coquille",  styles: ["sculptural","ornemental"] },
  { id: "portail-floral",  label: "Portail floral",  styles: ["sculptural","ornemental"] },
  { id: "niche-rose",      label: "Niche rose",      styles: ["ornemental"] },
  { id: "geode-bleue",     label: "Géode bleue",     styles: ["sculptural"] },
  { id: "geode-violette",  label: "Géode violette",  styles: ["sculptural"] },
  { id: "grotte",          label: "Grotte",          styles: ["surréaliste"] },
  { id: "cairn",           label: "Cairn",           styles: ["léger","japonisant"] },
];

/* HYBRIDE — 4 cols × 3 rows */
const HYBRIDE_LIST: { id: string; label: string; styles: Style[] }[] = [
  { id: "fleur-nacre",      label: "Fleur de nacre",     styles: ["surréaliste","ornemental"] },
  { id: "rose-corail",      label: "Rose-corail",        styles: ["surréaliste","sculptural"] },
  { id: "arbre-nuage",      label: "Arbre-nuage",        styles: ["évanescent","japonisant"] },
  { id: "arche-fleurie",    label: "Arche fleurie",      styles: ["sculptural","ornemental"] },
  { id: "colonne-vegetale", label: "Colonne végétale",   styles: ["sculptural"] },
  { id: "lotus-coquille",   label: "Lotus dans coquille",styles: ["japonisant","surréaliste"] },
  { id: "branche-cerisier", label: "Branche de cerisier",styles: ["japonisant","pictural"] },
  { id: "lotus-rose",       label: "Lotus rose",         styles: ["japonisant"] },
  { id: "calice-orne",      label: "Calice orné",        styles: ["sculptural","ornemental"] },
  { id: "fleur-tubulaire",  label: "Fleur tubulaire",    styles: ["organique","sculptural"] },
  { id: "fleur-evanescente",label: "Fleur évanescente",  styles: ["évanescent"] },
  { id: "bouquet-hybride",  label: "Bouquet hybride",    styles: ["dense","ornemental"] },
];

/* ───────── Construction de l'atlas à partir des listes + grilles ───────── */

function build(
  list: { id: string; label: string; styles: Style[] }[],
  family: Family, src: string, cols: number, rows: number,
): AtlasItem[] {
  return list.map((item, i) => ({
    ...item,
    family,
    src,
    col: i % cols,
    row: Math.floor(i / cols),
    cols, rows,
  }));
}

export const ATLAS: AtlasItem[] = [
  ...build(FLORALE_LIST,    "florale",    spritesFlorale,    5, 4),
  ...build(HYBRIDE_LIST,    "hybride",    spritesHybride,    4, 3),
  ...build(MARIN_LIST,      "marin",      spritesMarin,      4, 4),
  ...build(MINERAL_LIST,    "minéral",    spritesMineral,    4, 4),
  ...build(ATMOSPHERE_LIST, "atmosphère", spritesAtmosphere, 4, 3),
  ...build(FAUNE_LIST,      "faune",      spritesFaune,      3, 5),
];

export const FAMILIES: { id: Family; label: string }[] = [
  { id: "florale",     label: "Botanique" },
  { id: "hybride",     label: "Hybride" },
  { id: "marin",       label: "Marin" },
  { id: "minéral",     label: "Minéral" },
  { id: "atmosphère",  label: "Atmosphère" },
  { id: "faune",       label: "Faune" },
];

export const STYLES: Style[] = [
  "évanescent", "pictural", "ornemental",
  "organique", "surréaliste", "japonisant",
  "sculptural", "dense", "léger",
];

export function getAtlasItem(id: string): AtlasItem | undefined {
  return ATLAS.find((a) => a.id === id);
}