/* Présence qui guide (ajouts-4, 04-PRESENCE.md).
   Pur et testé : sécurité d'abord, puis une ou deux cartes choisies dans la base
   de Legato (jamais inventées), et les fiches utiles envoyées au modèle. */
import { SITUATIONS, type Situation } from "./je-suis-bloque";
import lexique from "./lexique.json";

export type CardType = "ouvrir_page" | "preparer_message" | "preparer_courrier" | "demander_aide_proches" | "appel";
export type Card = { etiquette: string; titre: string; sous?: string; to: string; params?: Record<string, string>; type: CardType; source?: string; href?: string };
export type Guide = { safety: "3114" | "15" | null; cards: Card[]; fiches: string[]; topic: "soutien" | "demarches" | null };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['’]/g, " ");
const has = (t: string, ...words: string[]) => words.some((w) => t.includes(norm(w)));

/** Règle 6 : sécurité avant tout. */
export function safetyCheck(text: string): "3114" | "15" | null {
  const t = norm(text);
  if (has(t, "plus envie de vivre", "envie de mourir", "me tuer", "suicide", "en finir", "me faire du mal", "le rejoindre", "la rejoindre", "plus etre la", "disparaitre pour toujours")) return "3114";
  if (has(t, "mal a la poitrine", "douleur poitrine", "je n arrive plus a respirer", "j etouffe", "perdu connaissance", "malaise", "paralyse")) return "15";
  return null;
}

const sit = (id: string): Situation | undefined => SITUATIONS.find((s) => s.id === id);
const bloque = (id: string, etiquette = "Pour en savoir plus"): Card => {
  const s = sit(id);
  return { etiquette, titre: s?.titre ?? id, to: "/practical/bloque/$id", params: { id }, type: "ouvrir_page", source: s ? `Source : ${s.source}` : undefined };
};
const page = (etiquette: string, titre: string, to: string, extra: Partial<Card> = {}): Card => ({ etiquette, titre, to, type: "ouvrir_page", ...extra });

type Rule = { when: string[]; topic: "soutien" | "demarches"; cards: () => Card[]; situations?: string[] };
/** Ordre = priorité. Repris des questions de test (§7). */
const RULES: Rule[] = [
  { when: ["bloque ses comptes", "compte bloque", "comptes bloques", "payer les pompes", "paie les pompes", "plus acces a l argent"], topic: "demarches", situations: ["argent"],
    cards: () => [page("Prêt à envoyer", "Le courrier pour sa banque", "/practical/tasks/$id/template", { params: { id: "banque" }, sous: "rempli avec ses informations", type: "preparer_courrier" }), bloque("argent")] },
  { when: ["code", "mot de passe", "mots de passe", "deverrouiller"], topic: "demarches", situations: ["mots-de-passe", "telephone"], cards: () => [bloque("mots-de-passe")] },
  { when: ["assurance-vie", "assurance vie"], topic: "demarches", situations: ["assurance-vie"], cards: () => [bloque("assurance-vie")] },
  { when: ["papiers de banque", "trouve pas ses papiers", "ses comptes bancaires"], topic: "demarches", situations: ["papiers"], cards: () => [bloque("papiers")] },
  { when: ["a la maison cette nuit", "mort a la maison", "decede a la maison"], topic: "demarches", situations: ["maison"], cards: () => [bloque("maison", "Maintenant")] },
  { when: ["espagne", "etranger", "vacances"], topic: "demarches", situations: ["etranger"], cards: () => [bloque("etranger")] },
  { when: ["enquete", "police"], topic: "demarches", situations: ["enquete"], cards: () => [bloque("enquete")] },
  { when: ["coma", "hospitalise", "a l hopital"], topic: "demarches", situations: ["hopital", "habilitation"], cards: () => [bloque("hopital"), bloque("habilitation")] },
  { when: ["capital deces"], topic: "demarches", situations: ["capital"], cards: () => [bloque("capital")] },
  { when: ["retraite", "reversion", "pacs"], topic: "demarches", situations: ["reversion"], cards: () => [bloque("reversion")] },
  { when: ["accepte la succession", "succession", "dettes", "credits"], topic: "demarches", situations: ["credits"], cards: () => [bloque("credits")] },
  { when: ["locataire", "logement", "bail"], topic: "demarches", situations: ["logement"], cards: () => [bloque("logement")] },
  { when: ["voiture"], topic: "demarches", situations: ["voiture"], cards: () => [bloque("voiture")] },
  { when: ["enfants n ont plus", "mes enfants"], topic: "demarches", situations: ["enfants"], cards: () => [bloque("enfants")] },
  { when: ["jours de conge", "conge"], topic: "demarches", situations: ["conges"], cards: () => [bloque("conges")] },
  { when: ["facebook", "instagram", "reseaux", "anniversaire en ligne"], topic: "demarches", situations: ["comptes"], cards: () => [bloque("comptes")] },
  { when: ["combien de temps", "delai pour les obseques", "obseques"], topic: "demarches", situations: ["maison"], cards: () => [bloque("maison")] },
  { when: ["preparer les choses", "si je meurs", "mes documents"], topic: "demarches", cards: () => [page("Préparer", "Mon coffre pour mes proches", "/practical/coffre")] },
  { when: ["recevra mes documents", "transmis"], topic: "demarches", cards: () => [page("Mon coffre", "Comment ils seront transmis", "/practical/coffre/transmission")] },
  { when: ["prochaines demarches", "quoi faire maintenant"], topic: "demarches", cards: () => [page("Démarches", "Ce qu'il reste à faire", "/practical")] },
  { when: ["prevenir tout le monde", "prevenir les proches"], topic: "demarches", cards: () => [page("Prêt à envoyer", "Prévenir les proches", "/practical/prevenir", { type: "preparer_message" })] },
  { when: ["formulaire", "site officiel", "assurance maladie"], topic: "demarches", cards: () => [page("Avant d'ouvrir un site", "Le site de l'Assurance maladie", "/partage/site-officiel", { type: "ouvrir_page" })] },
  { when: ["notaire"], topic: "demarches", cards: () => [page("Démarches", "Trouver un notaire", "/practical/pros/$kind", { params: { kind: "notaire" } })] },
  { when: ["vaut sa maison"], topic: "demarches", cards: () => [page("Démarches", "Trouver un notaire", "/practical/pros/$kind", { params: { kind: "notaire" } })] },
  // Soutien
  { when: ["courses", "n y arrive plus", "je mange n importe quoi"], topic: "soutien",
    cards: () => [page("Être entouré", "Dire à vos proches ce qui vous aiderait", "/care/aide", { type: "demander_aide_proches" }), page("Le corps", "Manger, même un peu", "/help/corps/manger")] },
  { when: ["mange plus", "mange rien", "pas faim"], topic: "soutien", cards: () => [page("Le corps", "Manger, même un peu", "/help/corps/manger"), page("Le corps", "Quand consulter", "/help/corps/consulter")] },
  { when: ["dormir", "dors plus", "insomnie", "nuit"], topic: "soutien", cards: () => [page("Le corps", "Dormir, les nuits", "/help/corps/dormir"), page("Les sons", "Des sons pour s'endormir", "/care/sons/endormir")] },
  { when: ["amis ne savent pas", "quoi me dire"], topic: "soutien", cards: () => [page("Être entouré", "Dire à vos proches ce qui vous aiderait", "/care/aide", { type: "demander_aide_proches" })] },
  { when: ["psychologue", "psy"], topic: "soutien", cards: () => [page("Parler à quelqu'un", "Un psychologue remboursé", "/care/parler/psychologue")] },
  { when: ["travail", "reprends le travail", "collegues"], topic: "soutien", cards: () => [page("Soutien", "Reprendre le travail", "/care/travail")] },
  { when: ["son anniversaire", "j apprehende", "date difficile"], topic: "soutien", cards: () => [page("Mémoire", "Ses dates", "/care/garden/dates"), page("Rituels", "Un geste pour ce jour-là", "/care/rituels")] },
  { when: ["garder sa voix", "sa voix"], topic: "soutien", cards: () => [page("Mémoire", "Ajouter sa voix", "/care/garden/ajouter/voix")] },
  { when: ["livre", "album"], topic: "soutien", cards: () => [page("Mémoire", "Un livre pour elle", "/care/garden/livre")] },
  { when: ["comment l aider", "ami a perdu"], topic: "soutien", cards: () => [page("Soutien", "Ce qui aide vraiment", "/care/aide")] },
  { when: ["coupable"], topic: "soutien", cards: () => [page("Écrire", "Mettre des mots", "/care/journal")] },
  { when: ["envie de rien", "rien faire"], topic: "soutien", cards: () => [page("Un moment", "Respirer", "/care/respirer")] },
];

/** Règle 5 : mots expliqués trouvés dans la question. */
export function lexiqueFor(text: string): string[] {
  const t = norm(text);
  const list = (lexique as unknown as { mots?: { mot: string; definition: string }[] }).mots ?? (Array.isArray(lexique) ? (lexique as { mot: string; definition: string }[]) : []);
  return list.filter((m) => m.mot && t.includes(norm(m.mot))).slice(0, 2).map((m) => `${m.mot} : ${m.definition}`);
}

function fiche(s: Situation) {
  return `Fiche « ${s.titre} » (${s.statut === "verifie" ? "vérifiée" : "à vérifier"}) : ${s.etapes.map((e) => e.texte).join(" ")} Source : ${s.source}.`;
}

export function guide(text: string, refused: string[] = []): Guide {
  const safety = safetyCheck(text);
  if (safety === "3114") return { safety, cards: [{ etiquette: "Maintenant", titre: "Appeler le 3114", sous: "gratuit, jour et nuit", to: "/crisis", type: "appel", href: "tel:3114" }], fiches: [], topic: null };
  if (safety === "15") return { safety, cards: [{ etiquette: "Urgence", titre: "Appeler le 15", sous: "le SAMU, jour et nuit", to: "/crisis", type: "appel", href: "tel:15" }], fiches: [], topic: null };
  const t = norm(text);
  const rule = RULES.find((r) => r.when.some((w) => t.includes(norm(w))));
  if (!rule) return { safety: null, cards: [], fiches: lexiqueFor(text), topic: null };
  const cards = rule.cards().filter((c) => !refused.includes(c.to)).slice(0, 2);
  const fiches = [...(rule.situations ?? []).map(sit).filter(Boolean).map((s) => fiche(s!)), ...lexiqueFor(text)];
  return { safety: null, cards, fiches, topic: rule.topic };
}
