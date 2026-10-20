/* « Je suis bloqué » (ajouts-4 §7) : les contenus viennent tels quels de je-suis-bloque.json.
 * Ce module ne fait que relier les actions aux pages réutilisées et aux liens officiels (§4, §13). */
import data from "./je-suis-bloque.json";
import titres from "./je-suis-bloque-titres.json";

export type Action = { libelle: string; type: "appel" | "page" | "lien_officiel" | "courrier" | "message"; cible: string | null };
export type Situation = {
  id: string; ecran: string; famille: string; titre: string; en_clair: string | null;
  etapes: { texte: string; action: Action | null }[];
  papiers: string[]; bouton_principal: Action | null; source: string; verifie_le: string | null; statut: "verifie" | "a_verifier";
};

export const SITUATIONS = data.situations as Situation[];
export const TITRES = titres as unknown as Record<string, [string, string]>;

export function findSituation(id: string) {
  return SITUATIONS.find((s) => s.id === id) ?? null;
}

/** Les cinq familles (D079–D083), avec leurs lignes et sous-titres exacts. */
export type Family = { slug: string; id: string; title: [string, string]; label: string; rows: { to: string; title: string; sub: string }[] };

export const FAMILIES: Family[] = [
  { slug: "cat-heures", id: "premieres-heures", label: "Les premières heures", title: ["Les premières", "heures."], rows: [
    { to: "maison", title: "Le décès a eu lieu à la maison", sub: "Qui appeler, dans quel ordre" },
    { to: "hopital-deces", title: "À l'hôpital ou en maison de retraite", sub: "Ce que l'établissement fait pour vous" },
    { to: "enquete", title: "Un accident, une mort inexpliquée", sub: "Quand il y a une enquête" },
    { to: "etranger", title: "Le décès a eu lieu à l'étranger", sub: "Consulat, rapatriement" },
    { to: "enfant-deces", title: "Le décès d'un enfant", sub: "Vos droits, votre entourage" },
    { to: "suicide", title: "Après un suicide", sub: "Être soutenu, tout de suite" },
  ] },
  { slug: "cat-acces", id: "acces-argent-papiers", label: "Accès, argent, papiers", title: ["Accès, argent,", "papiers."], rows: [
    { to: "mots-de-passe", title: "Je n'ai pas ses mots de passe", sub: "Téléphone, ordinateur" },
    { to: "comptes", title: "Ses comptes en ligne", sub: "Mails, réseaux sociaux" },
    { to: "papiers", title: "Je ne trouve pas ses papiers", sub: "Comptes, assurances, testament" },
    { to: "argent", title: "Je n'ai plus accès à l'argent", sub: "Comptes bloqués, obsèques" },
    { to: "credits", title: "Ses crédits et ses dettes", sub: "Ce qui est remboursé, ce qui ne l'est pas" },
    { to: "contrats", title: "Ses abonnements et contrats", sub: "Téléphone, énergie, assurances" },
  ] },
  { slug: "cat-famille", id: "famille-maison-travail", label: "Famille, maison, travail", title: ["Famille, maison,", "travail."], rows: [
    { to: "enfants", title: "Les enfants mineurs", sub: "Qui s'en occupe, les aides" },
    { to: "logement", title: "Le logement", sub: "Bail, propriété, factures" },
    { to: "voiture", title: "La voiture", sub: "Assurance, carte grise" },
    { to: "quotidien", title: "L'animal", sub: "Qui s'en occupe ce soir" },
    { to: "conges", title: "Votre travail", sub: "Vos jours de congé" },
    { to: "son-travail", title: "Son travail ou son entreprise", sub: "Employeur, indépendant" },
  ] },
  { slug: "cat-vivant", id: "il-ne-peut-plus-decider", label: "Il ne peut plus décider", title: ["Il est en vie mais", "ne peut plus décider."], rows: [
    { to: "hopital", title: "Il est à l'hôpital, il ne peut plus parler", sub: "Les premières solutions" },
    { to: "habilitation", title: "Agir à sa place, durablement", sub: "L'habilitation familiale" },
    { to: "telephone", title: "Son téléphone, ses comptes", sub: "Ce que vous pouvez faire, ou non" },
  ] },
  { slug: "cat-aides", id: "sommes-a-demander", label: "Les sommes à demander", title: ["Les sommes", "à demander."], rows: [
    { to: "capital", title: "Le capital décès", sub: "À demander dans le mois" },
    { to: "reversion", title: "La pension de réversion", sub: "Une seule demande en ligne" },
    { to: "assurance-vie", title: "L'assurance-vie et la prévoyance", sub: "Retrouver les contrats" },
  ] },
];

export function familyBySlug(slug: string) { return FAMILIES.find((f) => f.slug === slug) ?? null; }
export function familyOf(s: Situation) { return FAMILIES.find((f) => f.id === s.famille)!; }

/** Où mène chaque bouton : écran interne, appel confirmé, ou page réutilisée. */
export type Target =
  | { kind: "call"; number: string; tel: string }
  | { kind: "route"; to: string }
  | { kind: "official"; site: string; url: string; papiers: string; duree: string }
  | { kind: "message"; destinataires: string; texte: string };

const PAGES: Record<string, string> = {
  "f-pompes-funebres": "/resources/pompes",
  "f-pro-guide": "/practical/pros/notaire",
  "f-modele-courrier": "/practical/letter",
  "b-presence": "/practical/bloque/presence",
  "b-habilitation": "/practical/bloque/habilitation",
  "b-mots-de-passe": "/practical/bloque/mots-de-passe",
};

const ACTE = "L'acte de décès";
const OFFICIAL: Record<string, Omit<Extract<Target, { kind: "official" }>, "kind">> = {
  "etranger|Trouver le consulat": { site: "diplomatie.gouv.fr", url: "https://www.diplomatie.gouv.fr/fr/le-ministere-et-son-reseau/annuaires-et-adresses-du-maedi/ambassades-et-consulats-francais-a-l-etranger/", papiers: `Son passeport|${ACTE} du pays`, duree: "environ 5 minutes" },
  "mots-de-passe|Faire la demande Apple": { site: "support.apple.com", url: "https://support.apple.com/fr-afri/102431", papiers: `${ACTE}|La clé de contact légataire, si vous l'avez`, duree: "environ 10 minutes" },
  "mots-de-passe|Formulaire Google": { site: "support.google.com", url: "https://support.google.com/accounts/troubleshooter/6357590", papiers: `${ACTE}|Votre pièce d'identité`, duree: "environ 10 minutes" },
  "comptes|Faire la demande": { site: "facebook.com", url: "https://www.facebook.com/help/contact/234739086860192", papiers: `${ACTE}|L'adresse de son profil`, duree: "environ 5 minutes" },
  "comptes|Ouvrir les formulaires": { site: "support.google.com", url: "https://support.google.com/accounts/troubleshooter/6357590", papiers: `${ACTE}|Votre pièce d'identité`, duree: "environ 10 minutes" },
  "papiers|Faire la demande": { site: "agira-vie.fr", url: "https://www.agira-vie.fr", papiers: `${ACTE}|Son nom, sa date et son lieu de naissance`, duree: "environ 10 minutes" },
  "argent|Faire la recherche": { site: "agira-vie.fr", url: "https://www.agira-vie.fr", papiers: `${ACTE}|Son nom, sa date et son lieu de naissance`, duree: "environ 10 minutes" },
  "enfants|Faire la demande": { site: "caf.fr", url: "https://www.caf.fr", papiers: "Votre numéro d'allocataire|" + ACTE, duree: "environ 15 minutes" },
  "voiture|Site de l'ANTS": { site: "ants.gouv.fr", url: "https://ants.gouv.fr", papiers: `L'ancienne carte grise|${ACTE}|Le certificat de non-gage`, duree: "environ 15 minutes" },
  "habilitation|Formulaire officiel": { site: "service-public.fr", url: "https://www.service-public.fr/particuliers/vosdroits/F33367", papiers: "Un certificat médical d'un médecin habilité|Le livret de famille", duree: "environ 20 minutes" },
  "capital|Formulaire déjà rempli": { site: "ameli.fr", url: "https://www.ameli.fr/assure/droits-demarches/deces-proche/capital-deces", papiers: `${ACTE}|Votre RIB|Son numéro de sécurité sociale`, duree: "environ 10 minutes" },
  "reversion|Faire la demande": { site: "info-retraite.fr", url: "https://www.info-retraite.fr", papiers: `${ACTE}|Votre acte de mariage|Votre RIB`, duree: "environ 20 minutes" },
  "assurance-vie|Faire la demande": { site: "agira-vie.fr", url: "https://www.agira-vie.fr", papiers: `${ACTE}|Son nom, sa date et son lieu de naissance`, duree: "environ 10 minutes" },
};

const MESSAGES: Record<string, { destinataires: string; texte: string }> = {
  "comptes|Message prêt à envoyer": { destinataires: "Ses contacts", texte: "« Bonjour, je vous écris depuis le compte de mon proche pour vous annoncer son décès. Merci pour vos pensées. »" },
  "conges|Message prêt": { destinataires: "Mon employeur", texte: "« Bonjour, je viens de perdre un proche. Je prends les jours de congé pour décès prévus par la loi, à partir d'aujourd'hui. Je vous tiens informé. Merci de votre compréhension. »" },
  "enfant-deces|Prévenir mon employeur": { destinataires: "Mon employeur", texte: "« Bonjour, je viens de perdre mon enfant. Je prends le congé de deuil prévu par la loi, à partir d'aujourd'hui. Je vous tiens informé. Merci de votre compréhension. »" },
};

export function targetFor(s: Situation, a: Action): Target | null {
  const key = `${s.id}|${a.libelle}`;
  if (a.type === "appel") return a.libelle.includes("3114") ? { kind: "call", number: "3114", tel: "tel:3114" } : { kind: "call", number: "15", tel: "tel:15" };
  if (a.type === "courrier") return { kind: "route", to: "/practical/letter" };
  if (a.type === "message") return MESSAGES[key] ? { kind: "message", ...MESSAGES[key] } : null;
  if (a.type === "page") return a.cible && PAGES[a.cible] ? { kind: "route", to: PAGES[a.cible] } : null;
  // « Voir les groupes » mène au premier dossier (098 · trouver un groupe), pas à un site.
  if (key === "enfant-deces|Voir les groupes") return { kind: "route", to: "/care/community/groups" };
  return OFFICIAL[key] ? { kind: "official", ...OFFICIAL[key] } : null;
}

export function verifiedWords(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return m ? `${months[m - 1]} ${y}` : iso;
}

/** Présence oriente : quelques mots suffisent pour proposer une ou deux situations. */
const HINTS: [RegExp, string][] = [
  [/t[ée]l[ée]phone|portable|code/i, "telephone"],
  [/mot[s]? de passe|ordinateur|icloud|apple|google/i, "mots-de-passe"],
  [/h[ôo]pital|coma|ne peut plus (parler|d[ée]cider)|hospitalis/i, "hopital"],
  [/banque|argent|compte[s]? bloqu/i, "argent"],
  [/papier|testament|assurance/i, "papiers"],
  [/facebook|instagram|r[ée]seau|mail/i, "comptes"],
  [/[ée]tranger|consulat|rapatri/i, "etranger"],
  [/suicide/i, "suicide"],
  [/enfant/i, "enfants"],
  [/logement|bail|loyer/i, "logement"],
  [/voiture|carte grise/i, "voiture"],
  [/cr[ée]dit|dette/i, "credits"],
  [/r[ée]version|retraite/i, "reversion"],
  [/capital/i, "capital"],
  [/travail|employeur|cong[ée]/i, "conges"],
];

export function suggestSituations(text: string, max = 2): string[] {
  const out: string[] = [];
  for (const [re, id] of HINTS) if (re.test(text) && !out.includes(id)) out.push(id);
  return out.slice(0, max);
}
