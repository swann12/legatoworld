import spritesFlorale from "@/assets/sprites-florale.png";
import spritesHybride from "@/assets/sprites-hybride.png";
import spritesMarin from "@/assets/sprites-marin.png";
import spritesMineral from "@/assets/sprites-mineral.png";
import spritesAtmosphere from "@/assets/sprites-atmosphere.png";

export type Family =
  | "florale"
  | "hybride"
  | "marin"
  | "minéral"
  | "atmosphère";

export type Style = "pictural" | "ornemental" | "organique" | "léger" | "évanescent" | "sculptural" | "japonisant" | "dense" | "surréaliste";

export type AtlasItem = {
  id: string; label: string; family: Family; styles: Style[];
  src: string; col: number; row: number; cols: number; rows: number;
};

export const ATLAS: AtlasItem[] = [
  { id: "petale-delicat", label: "Pétale délicat", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 0, row: 0, cols: 8, rows: 5 },
  { id: "rose-ancienne", label: "Rose ancienne", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 1, row: 0, cols: 8, rows: 5 },
  { id: "anemone", label: "Anémone", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 2, row: 0, cols: 8, rows: 5 },
  { id: "iris", label: "Iris", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 3, row: 0, cols: 8, rows: 5 },
  { id: "pavot", label: "Pavot", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 4, row: 0, cols: 8, rows: 5 },
  { id: "cosmos", label: "Cosmos", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 5, row: 0, cols: 8, rows: 5 },
  { id: "tulipe-parrot", label: "Tulipe parrot", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 6, row: 0, cols: 8, rows: 5 },
  { id: "marguerite", label: "Marguerite fine", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 7, row: 0, cols: 8, rows: 5 },
  { id: "petite-prairie", label: "Petite fleur de prairie", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 0, row: 1, cols: 8, rows: 5 },
  { id: "grappe-florale", label: "Grappe florale", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 1, row: 1, cols: 8, rows: 5 },
  { id: "fleur-ronde", label: "Fleur ronde stylisée", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 2, row: 1, cols: 8, rows: 5 },
  { id: "floraison-diffuse", label: "Floraison diffuse", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 3, row: 1, cols: 8, rows: 5 },
  { id: "bouton-rose", label: "Bouton de rose", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 4, row: 1, cols: 8, rows: 5 },
  { id: "renoncule", label: "Renoncule", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 5, row: 1, cols: 8, rows: 5 },
  { id: "pois-senteur", label: "Pois de senteur", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 6, row: 1, cols: 8, rows: 5 },
  { id: "bleuet", label: "Bleuet", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 7, row: 1, cols: 8, rows: 5 },
  { id: "freesia", label: "Freesia", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 0, row: 2, cols: 8, rows: 5 },
  { id: "hellebore", label: "Hellébore", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 1, row: 2, cols: 8, rows: 5 },
  { id: "lupin", label: "Lupin", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 2, row: 2, cols: 8, rows: 5 },
  { id: "narcisse", label: "Narcisse", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 3, row: 2, cols: 8, rows: 5 },
  { id: "pivoine", label: "Pivoine", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 4, row: 2, cols: 8, rows: 5 },
  { id: "immortelle", label: "Immortelle", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 5, row: 2, cols: 8, rows: 5 },
  { id: "ombe-florale", label: "Ombe florale", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 6, row: 2, cols: 8, rows: 5 },
  { id: "fleur-evanescente", label: "Fleur évanescente", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 7, row: 2, cols: 8, rows: 5 },
  { id: "fougere", label: "Fougère", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 0, row: 3, cols: 8, rows: 5 },
  { id: "mousse", label: "Mousse", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 1, row: 3, cols: 8, rows: 5 },
  { id: "herbe-haute", label: "Herbe haute", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 2, row: 3, cols: 8, rows: 5 },
  { id: "tige-fine", label: "Tige fine", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 3, row: 3, cols: 8, rows: 5 },
  { id: "feuillage-leger", label: "Feuillage léger", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 4, row: 3, cols: 8, rows: 5 },
  { id: "liane-douce", label: "Liane douce", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 5, row: 3, cols: 8, rows: 5 },
  { id: "arbuste-vaporeux", label: "Arbuste vaporeux", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 6, row: 3, cols: 8, rows: 5 },
  { id: "touffe-vegetale", label: "Touffe végétale", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 7, row: 3, cols: 8, rows: 5 },
  { id: "feuillage-stylise", label: "Feuillage stylisé", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 0, row: 4, cols: 8, rows: 5 },
  { id: "plante-sous-bois", label: "Plante de sous-bois", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 1, row: 4, cols: 8, rows: 5 },
  { id: "petit-arbre-poetique", label: "Petit arbre poétique", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 2, row: 4, cols: 8, rows: 5 },
  { id: "arbre-fleuri", label: "Arbre fleuri stylisé", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 3, row: 4, cols: 8, rows: 5 },
  { id: "arbre-fin-elance", label: "Arbre fin élancé", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 4, row: 4, cols: 8, rows: 5 },
  { id: "branche-fleurie", label: "Branche fleurie", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 5, row: 4, cols: 8, rows: 5 },
  { id: "arbre-corail", label: "Arbre-corail", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 6, row: 4, cols: 8, rows: 5 },
  { id: "petit-bosquet", label: "Petit bosquet", family: "florale", styles: ["pictural"], src: spritesFlorale, col: 7, row: 4, cols: 8, rows: 5 },
  { id: "stjacques", label: "Coquille Saint-Jacques", family: "marin", styles: ["pictural"], src: spritesMarin, col: 0, row: 0, cols: 6, rows: 2 },
  { id: "conque-spiralee", label: "Conque spiralée", family: "marin", styles: ["pictural"], src: spritesMarin, col: 1, row: 0, cols: 6, rows: 2 },
  { id: "coquillage-nacre", label: "Coquillage nacré", family: "marin", styles: ["pictural"], src: spritesMarin, col: 2, row: 0, cols: 6, rows: 2 },
  { id: "coquille-ouverte", label: "Coquille ouverte", family: "marin", styles: ["pictural"], src: spritesMarin, col: 3, row: 0, cols: 6, rows: 2 },
  { id: "petit-coquillage", label: "Petit coquillage strié", family: "marin", styles: ["pictural"], src: spritesMarin, col: 4, row: 0, cols: 6, rows: 2 },
  { id: "coquille-eventail", label: "Coquille éventail", family: "marin", styles: ["pictural"], src: spritesMarin, col: 5, row: 0, cols: 6, rows: 2 },
  { id: "corail-ramifie", label: "Corail ramifié", family: "marin", styles: ["pictural"], src: spritesMarin, col: 0, row: 1, cols: 6, rows: 2 },
  { id: "corail-bulbeux", label: "Corail bulbeux", family: "marin", styles: ["pictural"], src: spritesMarin, col: 1, row: 1, cols: 6, rows: 2 },
  { id: "corail-dentele", label: "Corail dentelé", family: "marin", styles: ["pictural"], src: spritesMarin, col: 2, row: 1, cols: 6, rows: 2 },
  { id: "forme-spongieuse", label: "Forme spongieuse", family: "marin", styles: ["pictural"], src: spritesMarin, col: 3, row: 1, cols: 6, rows: 2 },
  { id: "anemone-marine", label: "Anémone marine", family: "marin", styles: ["pictural"], src: spritesMarin, col: 4, row: 1, cols: 6, rows: 2 },
  { id: "nuage-doux", label: "Nuage doux", family: "atmosphère", styles: ["pictural"], src: spritesAtmosphere, col: 0, row: 0, cols: 6, rows: 1 },
  { id: "nuage-flottant", label: "Nuage flottant", family: "atmosphère", styles: ["pictural"], src: spritesAtmosphere, col: 1, row: 0, cols: 6, rows: 1 },
  { id: "brume-legere", label: "Brume légère", family: "atmosphère", styles: ["pictural"], src: spritesAtmosphere, col: 2, row: 0, cols: 6, rows: 1 },
  { id: "halo-solaire", label: "Halo solaire", family: "atmosphère", styles: ["pictural"], src: spritesAtmosphere, col: 3, row: 0, cols: 6, rows: 1 },
  { id: "poussiere-lumineuse", label: "Poussière lumineuse", family: "atmosphère", styles: ["pictural"], src: spritesAtmosphere, col: 4, row: 0, cols: 6, rows: 1 },
  { id: "voile-atmospherique", label: "Voile atmosphérique", family: "atmosphère", styles: ["pictural"], src: spritesAtmosphere, col: 5, row: 0, cols: 6, rows: 1 },
  { id: "galet-doux", label: "Galet doux", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 0, row: 0, cols: 7, rows: 2 },
  { id: "fragment-poreux", label: "Fragment poreux", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 1, row: 0, cols: 7, rows: 2 },
  { id: "sable-leger", label: "Sable léger", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 2, row: 0, cols: 7, rows: 2 },
  { id: "amas-graines", label: "Amas de graines", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 3, row: 0, cols: 7, rows: 2 },
  { id: "relief-organique", label: "Relief organique", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 4, row: 0, cols: 7, rows: 2 },
  { id: "texture-minerale", label: "Texture minérale", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 5, row: 0, cols: 7, rows: 2 },
  { id: "arche-biomorphique", label: "Arche biomorphique", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 6, row: 0, cols: 7, rows: 2 },
  { id: "colonne-poreuse", label: "Colonne poreuse", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 0, row: 1, cols: 7, rows: 2 },
  { id: "escalier-organique", label: "Escalier organique", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 1, row: 1, cols: 7, rows: 2 },
  { id: "cavite-sculptee", label: "Cavité sculptée", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 2, row: 1, cols: 7, rows: 2 },
  { id: "passerelle-douce", label: "Passerelle douce", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 3, row: 1, cols: 7, rows: 2 },
  { id: "portail-coquillage", label: "Portail coquillage", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 4, row: 1, cols: 7, rows: 2 },
  { id: "volume-corallien", label: "Volume corallien", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 5, row: 1, cols: 7, rows: 2 },
  { id: "niche-architecturale", label: "Niche architecturale", family: "minéral", styles: ["pictural"], src: spritesMineral, col: 6, row: 1, cols: 7, rows: 2 },
  { id: "fleur-coquillage", label: "Fleur-coquillage", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 0, row: 0, cols: 10, rows: 1 },
  { id: "corail-fleur", label: "Corail-fleur", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 1, row: 0, cols: 10, rows: 1 },
  { id: "arbre-nuageux", label: "Arbre nuageux", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 2, row: 0, cols: 10, rows: 1 },
  { id: "arche-florale", label: "Arche florale", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 3, row: 0, cols: 10, rows: 1 },
  { id: "nuage-petale", label: "Nuage pétale", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 4, row: 0, cols: 10, rows: 1 },
  { id: "colonne-vegetale", label: "Colonne végétale", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 5, row: 0, cols: 10, rows: 1 },
  { id: "coquille-lotus", label: "Coquille-lotus", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 6, row: 0, cols: 10, rows: 1 },
  { id: "eventail-marin-bota", label: "Éventail marin botanique", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 7, row: 0, cols: 10, rows: 1 },
  { id: "petit-sanctuaire", label: "Petit sanctuaire organique", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 8, row: 0, cols: 10, rows: 1 },
  { id: "forme-hybride-japo", label: "Forme hybride japonisante", family: "hybride", styles: ["pictural"], src: spritesHybride, col: 9, row: 0, cols: 10, rows: 1 },
];

export const FAMILIES: { id: Family; label: string }[] = [
  { id: "florale", label: "Botanique" },
  { id: "marin", label: "Marin" },
  { id: "atmosphère", label: "Atmosphère" },
  { id: "minéral", label: "Minéral / Architecture" },
  { id: "hybride", label: "Hybrides inspirées" },
];

export const STYLES: Style[] = ["pictural","ornemental","organique","léger","évanescent","sculptural","japonisant","dense","surréaliste"];

export function getAtlasItem(id: string): AtlasItem | undefined {
  return ATLAS.find((a) => a.id === id);
}