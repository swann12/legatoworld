import type { Portrait } from "./portrait-store";

/* Propositions de cérémonie construites à partir de choix successifs.
   Toujours une conversation guidée par sélection, jamais un formulaire. */

export type Choice = { id: string; label: string };

export const FLOWER_STEPS: { key: string; question: string; options: Choice[] }[] = [
  {
    key: "colors",
    question: "Quelles couleurs vous viennent ?",
    options: [
      { id: "blanc", label: "Blanc et crème" }, { id: "pastel", label: "Pastels" },
      { id: "chaud", label: "Tons chauds" }, { id: "vif", label: "Couleurs vives" },
      { id: "sombre", label: "Tons profonds" },
    ],
  },
  {
    key: "univers",
    question: "Dans quel univers ?",
    options: [
      { id: "champetre", label: "Champêtre" }, { id: "classique", label: "Classique" },
      { id: "moderne", label: "Épuré" }, { id: "sauvage", label: "Sauvage" },
      { id: "jardin", label: "Jardin de maison" },
    ],
  },
  {
    key: "esprit",
    question: "Quel esprit doit s'en dégager ?",
    options: [
      { id: "doux", label: "Doux" }, { id: "solennel", label: "Solennel" },
      { id: "lumineux", label: "Lumineux" }, { id: "intime", label: "Intime" },
    ],
  },
];

export const MUSIC_STEPS: { key: string; question: string; options: Choice[] }[] = [
  {
    key: "energie",
    question: "Quelle énergie ?",
    options: [
      { id: "recueillie", label: "Recueillie" }, { id: "lumineuse", label: "Lumineuse" },
      { id: "grave", label: "Grave" }, { id: "joyeuse", label: "Joyeuse" },
    ],
  },
  {
    key: "epoque",
    question: "De quelle époque ?",
    options: [
      { id: "ancien", label: "Répertoire ancien" }, { id: "60_80", label: "Années 60–80" },
      { id: "90_00", label: "Années 90–2000" }, { id: "actuel", label: "Aujourd'hui" },
    ],
  },
  {
    key: "style",
    question: "Quel style lui allait ?",
    options: [
      { id: "classique", label: "Classique" }, { id: "chanson", label: "Chanson française" },
      { id: "jazz", label: "Jazz" }, { id: "rock", label: "Rock" },
      { id: "sacre", label: "Chant sacré" }, { id: "instrumental", label: "Instrumental" },
    ],
  },
];

export const TEXT_STEPS: { key: string; question: string; options: Choice[] }[] = [
  {
    key: "sensibilite",
    question: "Quelle sensibilité ?",
    options: [
      { id: "laique", label: "Laïque" }, { id: "spirituelle", label: "Spirituelle" },
      { id: "religieuse", label: "Religieuse" }, { id: "poetique", label: "Poétique" },
    ],
  },
  {
    key: "type",
    question: "Quel type de texte ?",
    options: [
      { id: "hommage", label: "Hommage" }, { id: "lettre", label: "Lettre à la personne" },
      { id: "poeme", label: "Poème" }, { id: "souvenir", label: "Un souvenir raconté" },
    ],
  },
  {
    key: "longueur",
    question: "Quelle longueur ?",
    options: [
      { id: "court", label: "Une minute" }, { id: "moyen", label: "Deux à trois minutes" },
      { id: "long", label: "Cinq minutes" },
    ],
  },
];

function label(steps: typeof FLOWER_STEPS, key: string, id?: string) {
  return steps.find((s) => s.key === key)?.options.find((o) => o.id === id)?.label ?? "";
}

export type Proposal = { title: string; body: string };

export function flowerProposals(a: Record<string, string>, portrait: Portrait): Proposal[] {
  const c = a.colors, u = a.univers, e = a.esprit;
  if (!c || !u || !e) return [];
  const palette: Record<string, string> = {
    blanc: "blanc, crème et beaucoup de feuillage",
    pastel: "rose poudré, pêche et blanc cassé",
    chaud: "terracotta, ambre et rouge sourd",
    vif: "jaune, corail et fuchsia",
    sombre: "bordeaux, prune et vert profond",
  };
  const shape: Record<string, string> = {
    champetre: "une gerbe libre, tiges apparentes",
    classique: "une composition ronde et dense",
    moderne: "une ligne longue, peu de variétés",
    sauvage: "des fleurs des champs, presque cueillies",
    jardin: "un bouquet de jardin, comme fait à la maison",
  };
  const hint = portrait.loves.includes("jardin")
    ? "Elle aimait le jardin : demandez des fleurs de saison, pas d'importation."
    : portrait.loves.includes("mer")
      ? "Ajoutez des graminées et des tons de sable, en écho à la mer."
      : "Montrez cette description telle quelle au fleuriste.";
  return [
    { title: `Proposition principale — ${label(FLOWER_STEPS, "univers", u)}`, body: `${shape[u]}, dans ${palette[c]}. Esprit ${label(FLOWER_STEPS, "esprit", e).toLowerCase()}.` },
    { title: "Variante plus sobre", body: `La même palette, une seule variété répétée, sans ruban ni support visible.` },
    { title: "À dire au fleuriste", body: hint },
  ];
}

export function musicProposals(a: Record<string, string>, portrait: Portrait): Proposal[] {
  const en = a.energie, ep = a.epoque, st = a.style;
  if (!en || !ep || !st) return [];
  const moment = {
    entree: "Entrée : un morceau lent, reconnaissable dès les premières notes.",
    hommage: "Pendant l'hommage : instrumental uniquement, pour laisser passer les mots.",
    sortie: "Sortie : le morceau qui lui ressemblait le plus, même s'il est joyeux.",
  };
  const known = portrait.music.length ? " Vos réponses sur son écoute ont été prises en compte." : "";
  return [
    { title: "Trois moments à couvrir", body: `${moment.entree} ${moment.hommage} ${moment.sortie}` },
    { title: `Direction ${label(MUSIC_STEPS, "style", st).toLowerCase()}`, body: `Énergie ${label(MUSIC_STEPS, "energie", en).toLowerCase()}, répertoire ${label(MUSIC_STEPS, "epoque", ep).toLowerCase()}.${known}` },
    { title: "Repère pratique", body: "Prévoyez trois morceaux maximum, en version enregistrée, et un fichier de secours confié à quelqu'un." },
  ];
}

export function textProposals(a: Record<string, string>, portrait: Portrait, lovedName?: string): Proposal[] {
  const se = a.sensibilite, ty = a.type, lo = a.longueur;
  if (!se || !ty || !lo) return [];
  const who = lovedName || "elle";
  const openings: Record<string, string> = {
    hommage: `« Nous sommes là pour ${who}, et pour tout ce qu'${who === "elle" ? "elle" : "il"} nous laisse. »`,
    lettre: `« ${lovedName ? lovedName + "," : "Toi,"} je t'écris une dernière fois à voix haute. »`,
    poeme: "« Ce qui a été vécu ne se retire pas. »",
    souvenir: "« Je voudrais vous raconter un jour précis. »",
  };
  const words = lo === "court" ? "150 mots environ" : lo === "moyen" ? "350 mots environ" : "700 mots environ";
  const traitHint = portrait.traits.length
    ? "Gardez le ton du portrait : ce qui a été coché doit s'entendre dans le texte."
    : "Un détail concret vaut mieux qu'une belle phrase générale.";
  return [
    { title: "Première phrase", body: openings[ty] ?? openings.hommage },
    { title: "Structure", body: `Sensibilité ${label(TEXT_STEPS, "sensibilite", se).toLowerCase()} · ${words}. Un souvenir précis, ce qu'${who === "elle" ? "elle" : "il"} vous a transmis, une phrase d'adieu.` },
    { title: "Conseil", body: traitHint },
  ];
}
