import { useEffect, useState } from "react";

/** Bibliothèque de Soutien (écrans 040–041). kind = onglet : lire ou ecouter. */
export type LibKind = "lire" | "ecouter";
export type LibItem = {
  id: string; kind: LibKind; type: string; length: string; year?: string;
  title: string; titleEnd?: string; author: string; summary: string;
  forWho: string; when: string; how: string; where: string;
};

const q = (s: string) => `https://www.google.com/search?q=${encodeURIComponent(s)}`;

export const LIBRARY: LibItem[] = [
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
