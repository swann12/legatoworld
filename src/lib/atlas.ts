import atlasBotanique from "@/assets/atlas-botanique.jpg";
import atlasHybride from "@/assets/atlas-hybride.jpg";
import atlasFaune from "@/assets/atlas-faune.jpg";
import atlasCiel from "@/assets/atlas-ciel.jpg";

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
  /** source planche */
  src: string;
  /** centre du crop, en % de l'image */
  cx: number; cy: number;
  /** taille du crop, en % de l'image (largeur) */
  cw: number; ch: number;
};

/* Coordonnées approximatives sur les planches uploadées par l'utilisateur. */
export const ATLAS: AtlasItem[] = [
  /* ─── FLORALE — atlas botanique (sections 1-3 + 8) ─── */
  { id: "petale-delicat",    label: "Pétale",          family: "florale", styles: ["léger","évanescent"],   src: atlasBotanique, cx: 5,  cy: 10, cw: 8,  ch: 9 },
  { id: "rose-ancienne",     label: "Rose ancienne",   family: "florale", styles: ["pictural","ornemental"], src: atlasBotanique, cx: 14, cy: 10, cw: 8,  ch: 9 },
  { id: "anemone",           label: "Anémone",         family: "florale", styles: ["pictural"],              src: atlasBotanique, cx: 23, cy: 10, cw: 8,  ch: 9 },
  { id: "iris",              label: "Iris",            family: "florale", styles: ["pictural","sculptural"], src: atlasBotanique, cx: 32, cy: 10, cw: 7,  ch: 10 },
  { id: "pavot",             label: "Pavot",           family: "florale", styles: ["pictural","dense"],      src: atlasBotanique, cx: 40, cy: 10, cw: 8,  ch: 9 },
  { id: "cosmos",            label: "Cosmos",          family: "florale", styles: ["léger","évanescent"],    src: atlasBotanique, cx: 49, cy: 10, cw: 7,  ch: 9 },
  { id: "tulipe",            label: "Tulipe",          family: "florale", styles: ["pictural"],              src: atlasBotanique, cx: 57, cy: 10, cw: 7,  ch: 9 },
  { id: "marguerite",        label: "Marguerite",      family: "florale", styles: ["léger"],                 src: atlasBotanique, cx: 65, cy: 10, cw: 7,  ch: 9 },
  { id: "fleur-prairie",     label: "Fleur de prairie",family: "florale", styles: ["évanescent","léger"],    src: atlasBotanique, cx: 73, cy: 10, cw: 7,  ch: 9 },
  { id: "grappe-florale",    label: "Grappe florale",  family: "florale", styles: ["pictural","dense"],      src: atlasBotanique, cx: 81, cy: 10, cw: 7,  ch: 10 },
  { id: "fleur-ronde",       label: "Fleur ronde",     family: "florale", styles: ["ornemental"],            src: atlasBotanique, cx: 88, cy: 10, cw: 7,  ch: 9 },
  { id: "renoncule",         label: "Renoncule",       family: "florale", styles: ["pictural"],              src: atlasBotanique, cx: 14, cy: 21, cw: 8,  ch: 9 },
  { id: "pois-senteur",      label: "Pois de senteur", family: "florale", styles: ["léger","évanescent"],    src: atlasBotanique, cx: 23, cy: 21, cw: 7,  ch: 9 },
  { id: "bleuet",            label: "Bleuet",          family: "florale", styles: ["léger"],                 src: atlasBotanique, cx: 32, cy: 21, cw: 7,  ch: 9 },
  { id: "hellebore",         label: "Hellébore",       family: "florale", styles: ["pictural"],              src: atlasBotanique, cx: 49, cy: 21, cw: 7,  ch: 9 },
  { id: "lupin",             label: "Lupin",           family: "florale", styles: ["sculptural"],            src: atlasBotanique, cx: 57, cy: 21, cw: 7,  ch: 10 },
  { id: "pivoine",           label: "Pivoine",         family: "florale", styles: ["pictural","dense"],      src: atlasBotanique, cx: 73, cy: 21, cw: 7,  ch: 9 },
  { id: "ombre-florale",     label: "Ombre florale",   family: "florale", styles: ["évanescent"],            src: atlasBotanique, cx: 81, cy: 21, cw: 8,  ch: 9 },
  // feuillages
  { id: "fougere",           label: "Fougère",         family: "florale", styles: ["organique","léger"],     src: atlasBotanique, cx: 6,  cy: 38, cw: 7,  ch: 9 },
  { id: "mousse",            label: "Mousse",          family: "florale", styles: ["organique"],             src: atlasBotanique, cx: 14, cy: 38, cw: 7,  ch: 8 },
  { id: "herbe-haute",       label: "Herbe haute",     family: "florale", styles: ["léger","japonisant"],    src: atlasBotanique, cx: 22, cy: 38, cw: 6,  ch: 9 },
  { id: "tige-fine",         label: "Tige fine",       family: "florale", styles: ["léger","japonisant"],    src: atlasBotanique, cx: 28, cy: 38, cw: 5,  ch: 9 },
  { id: "feuillage-leger",   label: "Feuillage léger", family: "florale", styles: ["léger","évanescent"],    src: atlasBotanique, cx: 34, cy: 38, cw: 7,  ch: 9 },
  { id: "liane-douce",       label: "Liane",           family: "florale", styles: ["organique"],             src: atlasBotanique, cx: 6,  cy: 47, cw: 7,  ch: 9 },
  { id: "arbuste-vaporeux",  label: "Arbuste",         family: "florale", styles: ["évanescent"],            src: atlasBotanique, cx: 14, cy: 47, cw: 8,  ch: 9 },
  // arbres
  { id: "arbre-fleuri",      label: "Arbre fleuri",    family: "florale", styles: ["pictural","japonisant"], src: atlasBotanique, cx: 50, cy: 38, cw: 9,  ch: 10 },
  { id: "arbre-fin",         label: "Arbre fin",       family: "florale", styles: ["léger","japonisant"],    src: atlasBotanique, cx: 60, cy: 38, cw: 7,  ch: 10 },

  /* ─── HYBRIDE — fleurs-coraux, sculpturales (atlas botanique section 8) ─── */
  { id: "fleur-coquillage",  label: "Fleur-coquillage",family: "hybride", styles: ["surréaliste","sculptural"], src: atlasBotanique, cx: 5,  cy: 92, cw: 9,  ch: 8 },
  { id: "corail-fleur",      label: "Corail-fleur",    family: "hybride", styles: ["surréaliste"],          src: atlasBotanique, cx: 14, cy: 92, cw: 9,  ch: 8 },
  { id: "arbre-nuageux",     label: "Arbre nuageux",   family: "hybride", styles: ["évanescent","japonisant"], src: atlasBotanique, cx: 24, cy: 92, cw: 9,  ch: 8 },
  { id: "arche-florale",     label: "Arche florale",   family: "hybride", styles: ["sculptural","ornemental"], src: atlasBotanique, cx: 33, cy: 92, cw: 8,  ch: 8 },
  { id: "colonne-vegetale",  label: "Colonne végétale",family: "hybride", styles: ["sculptural"],           src: atlasBotanique, cx: 50, cy: 92, cw: 8,  ch: 8 },
  { id: "coquille-lotus",    label: "Coquille-lotus",  family: "hybride", styles: ["japonisant"],            src: atlasBotanique, cx: 58, cy: 92, cw: 9,  ch: 8 },

  /* ─── MARIN — coquillages, coraux (atlas hybride 01_27_37) ─── */
  { id: "coquille-stj",      label: "St-Jacques",      family: "marin",   styles: ["pictural"],              src: atlasHybride, cx: 30, cy: 35, cw: 9,  ch: 9 },
  { id: "conque",            label: "Conque",          family: "marin",   styles: ["organique"],             src: atlasHybride, cx: 39, cy: 35, cw: 7,  ch: 9 },
  { id: "spirale-marine",    label: "Spirale",         family: "marin",   styles: ["organique"],             src: atlasHybride, cx: 71, cy: 32, cw: 7,  ch: 8 },
  { id: "corail-rouge",      label: "Corail rouge",    family: "marin",   styles: ["dense"],                 src: atlasHybride, cx: 22, cy: 50, cw: 9,  ch: 11 },
  { id: "corail-souple",     label: "Corail souple",   family: "marin",   styles: ["organique"],             src: atlasHybride, cx: 46, cy: 50, cw: 9,  ch: 11 },
  { id: "anemone-marine",    label: "Anémone marine",  family: "marin",   styles: ["organique"],             src: atlasHybride, cx: 35, cy: 53, cw: 8,  ch: 10 },
  { id: "hippocampe",        label: "Hippocampe",      family: "marin",   styles: ["pictural"],              src: atlasHybride, cx: 56, cy: 47, cw: 7,  ch: 11 },
  { id: "petits-coquillages",label: "Coquillages",     family: "marin",   styles: ["léger","ornemental"],    src: atlasHybride, cx: 32, cy: 79, cw: 9,  ch: 6 },

  /* ─── MINÉRAL — arches, cavités, architectures (atlas hybride) ─── */
  { id: "arche-ruine",       label: "Arche en ruine",  family: "minéral", styles: ["sculptural","surréaliste"], src: atlasHybride, cx: 7,  cy: 49, cw: 12, ch: 14 },
  { id: "tour-coquillage",   label: "Tour coquille",   family: "minéral", styles: ["sculptural"],           src: atlasHybride, cx: 42, cy: 22, cw: 12, ch: 14 },
  { id: "sanctuaire",        label: "Sanctuaire",      family: "minéral", styles: ["sculptural","ornemental"], src: atlasHybride, cx: 76, cy: 22, cw: 14, ch: 16 },
  { id: "ruine-littorale",   label: "Ruine littorale", family: "minéral", styles: ["surréaliste"],          src: atlasHybride, cx: 50, cy: 78, cw: 14, ch: 14 },
  { id: "cavite-coraux",     label: "Cavité",          family: "minéral", styles: ["organique"],             src: atlasHybride, cx: 76, cy: 78, cw: 14, ch: 16 },
  { id: "fragment-poreux",   label: "Fragment poreux", family: "minéral", styles: ["organique","léger"],     src: atlasHybride, cx: 18, cy: 75, cw: 8,  ch: 8 },

  /* ─── ATMOSPHÈRE — nuages, halos, soleils (atlas ciel) ─── */
  { id: "nuage-blanc",       label: "Nuage blanc",     family: "atmosphère", styles: ["évanescent","léger"], src: atlasCiel, cx: 28, cy: 6,  cw: 12, ch: 10 },
  { id: "nuage-sombre",      label: "Nuage sombre",    family: "atmosphère", styles: ["dense","pictural"],   src: atlasCiel, cx: 6,  cy: 8,  cw: 12, ch: 12 },
  { id: "nuage-flottant",    label: "Nuage flottant",  family: "atmosphère", styles: ["évanescent"],         src: atlasCiel, cx: 44, cy: 6,  cw: 12, ch: 10 },
  { id: "soleil-doux",       label: "Soleil doux",     family: "atmosphère", styles: ["évanescent"],         src: atlasCiel, cx: 67, cy: 5,  cw: 11, ch: 10 },
  { id: "lune-diffuse",      label: "Lune diffuse",    family: "atmosphère", styles: ["évanescent"],         src: atlasCiel, cx: 90, cy: 5,  cw: 9,  ch: 9 },
  { id: "halo-or",           label: "Halo doré",       family: "atmosphère", styles: ["évanescent","ornemental"], src: atlasCiel, cx: 82, cy: 17, cw: 9,  ch: 9 },
  { id: "horizon-marin",     label: "Horizon marin",   family: "atmosphère", styles: ["évanescent","pictural"], src: atlasCiel, cx: 14, cy: 36, cw: 22, ch: 5 },
  { id: "horizon-aube",      label: "Horizon d'aube",  family: "atmosphère", styles: ["évanescent"],         src: atlasCiel, cx: 36, cy: 36, cw: 22, ch: 5 },
  { id: "horizon-crepuscule",label: "Crépuscule",      family: "atmosphère", styles: ["pictural"],           src: atlasCiel, cx: 60, cy: 36, cw: 20, ch: 5 },
  { id: "brume-cote",        label: "Brume côtière",   family: "atmosphère", styles: ["évanescent"],         src: atlasCiel, cx: 6,  cy: 23, cw: 20, ch: 7 },

  /* ─── FAUNE — discrète (atlas faune) ─── */
  { id: "coleoptere",        label: "Coléoptère",      family: "faune",   styles: ["pictural"],              src: atlasFaune, cx: 7,  cy: 8,  cw: 10, ch: 10 },
  { id: "libellule",         label: "Libellule",       family: "faune",   styles: ["léger","japonisant"],    src: atlasFaune, cx: 22, cy: 8,  cw: 13, ch: 10 },
  { id: "papillon-fin",      label: "Papillon",        family: "faune",   styles: ["léger","pictural"],      src: atlasFaune, cx: 40, cy: 8,  cw: 11, ch: 10 },
  { id: "hirondelle",        label: "Hirondelle",      family: "faune",   styles: ["pictural"],              src: atlasFaune, cx: 75, cy: 6,  cw: 14, ch: 10 },
  { id: "abeille",           label: "Abeille",         family: "faune",   styles: ["pictural"],              src: atlasFaune, cx: 8,  cy: 22, cw: 11, ch: 9 },
  { id: "mante",             label: "Mante",           family: "faune",   styles: ["organique"],             src: atlasFaune, cx: 26, cy: 22, cw: 12, ch: 10 },
  { id: "papillon-tachete",  label: "Papillon tacheté",family: "faune",   styles: ["pictural"],              src: atlasFaune, cx: 44, cy: 24, cw: 11, ch: 10 },
  { id: "becasseau",         label: "Bécasseau",       family: "faune",   styles: ["pictural"],              src: atlasFaune, cx: 78, cy: 22, cw: 10, ch: 12 },
  { id: "bernard-hermite",   label: "Bernard-l'ermite",family: "faune",   styles: ["organique"],             src: atlasFaune, cx: 7,  cy: 38, cw: 12, ch: 10 },
  { id: "crabe",             label: "Crabe",           family: "faune",   styles: ["organique"],             src: atlasFaune, cx: 22, cy: 38, cw: 11, ch: 10 },
  { id: "escargot",          label: "Escargot",        family: "faune",   styles: ["léger"],                 src: atlasFaune, cx: 46, cy: 42, cw: 11, ch: 9 },
  { id: "lezard",            label: "Lézard",          family: "faune",   styles: ["organique"],             src: atlasFaune, cx: 5,  cy: 53, cw: 14, ch: 9 },
  { id: "cloporte",          label: "Cloporte",        family: "faune",   styles: ["léger"],                 src: atlasFaune, cx: 22, cy: 53, cw: 10, ch: 7 },
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