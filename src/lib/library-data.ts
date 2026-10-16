import { useEffect, useState } from "react";

/** Bibliothèque de Soutien (écrans 040–041). kind = onglet : lire ou ecouter. */
export type LibKind = "lire" | "ecouter" | "voir";
export type LibItem = {
  id: string; kind: LibKind; type: string; length: string; year?: string;
  title: string; titleEnd?: string; author: string; summary: string;
  forWho: string; when: string; how: string; where: string;
  tag?: string; caption?: string; country?: string; tone?: string;
};

const q = (s: string) => `https://www.google.com/search?q=${encodeURIComponent(s)}`;

export const LIBRARY: LibItem[] = [
  { id: "chagrin-sommeil", kind: "lire", type: "Article", length: "5 minutes", title: "Pourquoi le chagrin", titleEnd: "empêche de dormir.", author: "Rédaction Legato",
    summary: "Le deuil agit sur le corps comme un stress continu. Comprendre pourquoi les nuits se dérèglent aide à moins s'en vouloir.",
    forWho: "Toute perte d'un proche", when: "Les premières semaines", how: "D'une traite", where: q("deuil sommeil insomnie pourquoi") },
  { id: "chagrin-appetit", kind: "lire", type: "Article", length: "4 minutes", title: "Quand le chagrin", titleEnd: "coupe l'appétit.", author: "Rédaction Legato",
    summary: "Ne plus avoir faim est fréquent. Quelques repères pour nourrir le corps sans se forcer.",
    forWho: "Toute perte d'un proche", when: "Les premières semaines", how: "D'une traite", where: q("deuil perte d'appétit conseils") },
  { id: "petits-gestes", kind: "lire", type: "Article", length: "4 minutes", title: "Les petits gestes", titleEnd: "qui comptent.", author: "Rédaction Legato",
    summary: "Se laver, s'habiller, sortir : quand tout coûte, commencer plus petit que d'habitude.",
    forWho: "Toute perte d'un proche", when: "Les jours sans énergie", how: "D'une traite", where: q("deuil prendre soin de soi petits gestes") },
  { id: "pensee-magique", kind: "lire", type: "Livre", length: "280 pages", year: "2007", title: "L'année de la", titleEnd: "pensée magique.", author: "Joan Didion",
    summary: "Le récit de l'année qui a suivi la mort de son mari. Pour ceux qui ne se reconnaissent plus dans leurs propres pensées.",
    forWho: "La perte d'un conjoint", when: "Les premiers mois", how: "Par petits morceaux", where: q("L'année de la pensée magique Joan Didion livre") },
  { id: "vivre-le-deuil", kind: "lire", type: "Livre", length: "320 pages", year: "2004", title: "Vivre le deuil", titleEnd: "au jour le jour.", author: "Christophe Fauré",
    summary: "Un psychiatre décrit les étapes ordinaires du deuil, sans jargon. Utile pour comprendre ce qui vous arrive.",
    forWho: "Toute perte d'un proche", when: "Quand vous voulez comprendre", how: "Un chapitre à la fois", where: q("Vivre le deuil au jour le jour Christophe Fauré") },
  { id: "silence-maison", kind: "lire", type: "Article", length: "6 minutes", title: "Quand le silence", titleEnd: "de la maison pèse.", author: "Rédaction Legato",
    summary: "Le soir, la maison devient trop calme. Quelques gestes simples pour traverser ces heures-là.",
    forWho: "Celles et ceux qui vivent seuls", when: "Le soir", how: "D'une traite", where: q("silence maison deuil soir conseils") },
  { id: "vivre-avec-nos-morts", kind: "lire", type: "Livre", length: "208 pages", year: "2021", title: "Vivre avec", titleEnd: "nos morts.", author: "Delphine Horvilleur",
    summary: "Onze récits d'une rabbine qui accompagne les vivants. Beaucoup de tendresse, parfois de l'humour.",
    forWho: "Toute perte", when: "Quelques mois après", how: "Un récit par soir", where: q("Vivre avec nos morts Delphine Horvilleur") },
  { id: "floraisons", kind: "ecouter", type: "Podcast", length: "8 épisodes", title: "Floraisons", author: "France Inter",
    summary: "Des personnes racontent leur deuil, longtemps après. Des voix posées, sans pathos.",
    forWho: "Toute perte", when: "Quand le silence pèse", how: "Un épisode, le soir", where: q("Floraisons podcast deuil") },
  { id: "emotions-tristesse", kind: "ecouter", type: "Podcast", length: "35 minutes", title: "Émotions :", titleEnd: "la tristesse.", author: "Louie Media",
    summary: "Ce que la tristesse fait au corps et à la pensée, expliqué simplement.",
    forWho: "Toute perte", when: "Les premières semaines", how: "En marchant", where: q("Louie Media Émotions tristesse") },
];

// Les identifiants historiques restent valides, y compris dans les favoris.
Object.assign(LIBRARY.find((i) => i.id === "pensee-magique") ?? {}, { tag: "Livre · récit", caption: "après la mort de son mari" });
Object.assign(LIBRARY.find((i) => i.id === "vivre-le-deuil") ?? {}, { tag: "Livre · repères", caption: "ce qui se passe, mois après mois" });

LIBRARY.push(
  { id: "journal-de-deuil", kind: "lire", type: "Livre", tag: "Livre · journal", length: "272 pages", year: "2009", title: "Journal de deuil", author: "Roland Barthes", caption: "des notes courtes, à lire par morceaux", summary: "Des notes écrites après la mort de sa mère, à lire par petits morceaux, sans chercher un récit continu.", forWho: "Toute perte d'un proche", when: "À votre rythme", how: "Quelques notes à la fois", where: q("Journal de deuil Roland Barthes") },
  { id: "pieds-sur-terre", kind: "ecouter", type: "Podcast", tag: "Podcast · témoignages", length: "28 minutes", title: "Les Pieds sur terre", author: "France Culture", caption: "des récits de vie, sans commentaire", summary: "Des récits de vie racontés par celles et ceux qui les ont vécus, sans commentaire.", forWho: "Toute perte", when: "Quand vous souhaitez écouter une autre voix", how: "Un épisode à la fois", where: "https://www.radiofrance.fr/franceculture/podcasts/les-pieds-sur-terre" },
  { id: "griefcast", kind: "ecouter", type: "Podcast", tag: "Podcast · en anglais", length: "Un épisode", title: "Griefcast", author: "Cariad Lloyd", caption: "parler du deuil, avec humour aussi", summary: "Des conversations en anglais sur la perte, qui laissent aussi une place à l'humour.", forWho: "Toute perte", when: "Quand vous souhaitez écouter", how: "En anglais", where: "https://cariadlloyd.com/griefcast" },
  { id: "requiem-faure", kind: "ecouter", type: "Musique", tag: "Musique", length: "Selon l'interprétation", title: "Requiem", author: "Gabriel Fauré", caption: "une heure, doux et lumineux", summary: "Une œuvre chorale qui fait une place au repos et à la lumière.", forWho: "Toute perte", when: "Un moment calme", how: "À écouter par mouvements", where: q("Gabriel Fauré Requiem écouter") },
  { id: "departures", kind: "voir", type: "Film", tag: "Film · Japon, 2008", country: "Japon", year: "2008", length: "2 h 10", title: "Departures", author: "Yōjirō Takita", caption: "celui qui prépare les défunts", summary: "Un violoncelliste devient, presque par hasard, celui qui prépare les défunts avant la cérémonie. Un film doux sur les gestes qu'on accomplit pour ceux qui partent.", forWho: "Tous les deuils", when: "Quand vous vous sentez prêt", how: "Grave, mais souvent drôle", tone: "Grave, mais souvent drôle", where: q("Departures 2008 où regarder France") },
  { id: "chambre-du-fils", kind: "voir", type: "Film", tag: "Film · Italie, 2001", country: "Italie", year: "2001", length: "1 h 39", title: "La Chambre du fils", author: "Nanni Moretti", caption: "une famille après la perte d'un enfant", summary: "Une famille traverse la perte d'un enfant. Un récit intime, qui peut remuer profondément.", forWho: "La perte d'un enfant", when: "Quand vous vous sentez prêt", how: "Intime et grave", where: q("La Chambre du fils où regarder") },
  { id: "coco", kind: "voir", type: "Film d'animation", tag: "Film d'animation · 2017", year: "2017", length: "1 h 45", title: "Coco", author: "Pixar", caption: "le Jour des morts au Mexique, à voir en famille", summary: "Un jeune musicien découvre les histoires de sa famille à travers le Jour des morts au Mexique.", forWho: "À voir en famille", when: "Pour ouvrir une conversation", how: "Avec un enfant, accompagné", where: q("Coco Pixar où regarder") },
  { id: "still-walking", kind: "voir", type: "Film", tag: "Film · Japon, 2008", country: "Japon", year: "2008", length: "1 h 55", title: "Still Walking", author: "Hirokazu Kore-eda", caption: "une famille se souvient d'un fils, autour d'un repas d'été", summary: "Une famille se retrouve autour d'un repas d'été et du souvenir d'un fils disparu. Les gestes ordinaires portent la mémoire.", forWho: "Tous les deuils", when: "Quand vous vous sentez prêt", how: "Doux, avec des tensions familiales", where: q("Still Walking où regarder") },
  { id: "ghost-story", kind: "voir", type: "Film", tag: "Film · États-Unis, 2017", country: "États-Unis", year: "2017", length: "1 h 32", title: "A Ghost Story", author: "David Lowery", caption: "l'absence, vue de l'autre côté, presque sans paroles", summary: "L'absence et le passage du temps vus de l'autre côté, dans un film presque sans paroles.", forWho: "La perte d'un conjoint", when: "Quand vous vous sentez prêt", how: "Contemplatif, parfois éprouvant", where: q("A Ghost Story où regarder") },
  { id: "six-feet-under", kind: "voir", type: "Série", tag: "Série · États-Unis", length: "5 saisons", title: "Six Feet Under", author: "Alan Ball", summary: "Le quotidien d'une famille qui dirige une entreprise de pompes funèbres. Certaines scènes de décès peuvent être difficiles.", forWho: "Adultes", when: "Quand vous vous sentez prêt", how: "Un épisode à la fois, humour noir", where: q("Six Feet Under où regarder France") },
  { id: "dick-johnson", kind: "voir", type: "Documentaire", tag: "Documentaire · 2020", year: "2020", length: "1 h 29", title: "Dick Johnson Is Dead", author: "Kirsten Johnson", summary: "Une cinéaste et son père abordent ensemble la vieillesse et la mort, avec tendresse et humour. Le film montre des mises en scène de mort.", forWho: "Adultes", when: "Quand vous vous sentez prêt", how: "Tendre et décalé", where: q("Dick Johnson Is Dead où regarder") },
);

export const FEATURED: Record<LibKind, string[]> = {
  lire: ["pensee-magique", "journal-de-deuil", "vivre-le-deuil"],
  ecouter: ["pieds-sur-terre", "griefcast", "requiem-faure"],
  voir: ["departures", "chambre-du-fils", "coco"],
};
export type LibTab = LibKind | "gardes";
export const toLibTab = (value: unknown): LibTab => value === "ecouter" || value === "podcasts" ? "ecouter" : value === "voir" || value === "gardes" ? value : "lire";
export const libraryTitle = (item: LibItem) => `${item.title}${item.titleEnd ? ` ${item.titleEnd}` : ""}`.replace(/\.$/, "");

export const getLibItem = (id: string) => LIBRARY.find((i) => i.id === id);

const KEY = "legato.library.saved.v1";
const EVT = "legato:library-saved";
const read = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };

export function toggleSaved(id: string) {
  const s = read();
  localStorage.setItem(KEY, JSON.stringify(s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  window.dispatchEvent(new Event(EVT));
}

export function useSaved() {
  const [s, setS] = useState<string[]>([]);
  useEffect(() => { const f = () => setS(read()); f(); window.addEventListener(EVT, f); return () => window.removeEventListener(EVT, f); }, []);
  return s;
}
