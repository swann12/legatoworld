import type { PracticalCategory } from "./journey-config";

/**
 * Guide concret par démarche : à quoi ça sert, à qui s'adresser,
 * ce qu'il faut avoir sous la main, et les étapes dans l'ordre.
 * Objectif : une intention claire → une action évidente.
 */
export type TaskGuide = {
  /** Une phrase : pourquoi cette démarche existe. */
  why: string;
  /** Interlocuteur principal. */
  who: string;
  /** Délai indicatif, en clair. */
  when: string;
  /** Ce qu'il faut avoir sous la main. */
  docs: string[];
  /** Les étapes, dans l'ordre, formulées à l'impératif doux. */
  steps: string[];
};

const FALLBACK: TaskGuide = {
  why: "Une étape administrative à traiter une seule fois.",
  who: "L'organisme concerné",
  when: "Quand vous vous en sentez capable",
  docs: ["Acte de décès", "Votre pièce d'identité"],
  steps: [
    "Rassembler les documents ci-dessus.",
    "Contacter l'organisme par téléphone ou en ligne.",
    "Noter la date de la demande et la réponse reçue.",
  ],
};

export const TASK_GUIDES: Partial<Record<PracticalCategory, TaskGuide>> = {
  first: {
    why: "Rendre le décès officiel : sans cela, rien d'autre ne peut avancer.",
    who: "Mairie du lieu de décès",
    when: "Dans les 24 h ouvrées",
    docs: ["Certificat médical de décès", "Livret de famille ou pièce d'identité du défunt", "Votre pièce d'identité"],
    steps: [
      "Récupérer le certificat médical auprès du médecin ou de l'établissement.",
      "Se rendre à la mairie du lieu de décès pour la déclaration.",
      "Demander plusieurs copies de l'acte de décès (comptez une dizaine).",
      "Ranger ces copies dans le coffre : tous les organismes les réclameront.",
    ],
  },
  obseques: {
    why: "Organiser la cérémonie et fixer un devis clair, sans se laisser presser.",
    who: "Pompes funèbres",
    when: "Sous 6 jours après le décès",
    docs: ["Acte de décès", "Contrat obsèques éventuel", "Volontés écrites du défunt si elles existent"],
    steps: [
      "Vérifier s'il existe un contrat obsèques déjà payé.",
      "Demander deux devis détaillés et les comparer ligne par ligne.",
      "Choisir inhumation ou crémation, le lieu et la date.",
      "Signer seulement quand le devis vous paraît juste.",
    ],
  },
  ceremony: {
    why: "Décider du déroulé : ce qui sera dit, joué, montré.",
    who: "Officiant ou maître de cérémonie",
    when: "Quelques jours avant",
    docs: ["Textes et musiques choisis", "Photos"],
    steps: [
      "Choisir le ton : civil, religieux, intime.",
      "Réunir textes, musiques et prises de parole.",
      "Envoyer le déroulé à l'officiant pour relecture.",
    ],
  },
  flowers: {
    why: "Un geste visible, souvent le premier que les proches remarquent.",
    who: "Fleuriste ou pompes funèbres",
    when: "48 h avant la cérémonie",
    docs: ["Lieu et heure de la cérémonie", "Budget indicatif"],
    steps: [
      "Choisir un style : sobre, coloré, champêtre.",
      "Indiquer le lieu et l'heure de livraison.",
      "Prévoir le message du bandeau.",
    ],
  },
  documents: {
    why: "Rassembler une fois pour toutes ce que chaque organisme redemandera.",
    who: "Vous seul·e",
    when: "Dès la première semaine",
    docs: ["Acte de décès", "Livret de famille", "Pièce d'identité du défunt", "RIB"],
    steps: [
      "Réunir les originaux dans une pochette.",
      "Photographier chaque document et le déposer dans le coffre.",
      "Noter le nombre de copies restantes.",
    ],
  },
  letters: {
    why: "Prévenir par écrit les organismes qui l'exigent, avec une preuve d'envoi.",
    who: "Employeur, banque, assurances, bailleur, mutuelle, opérateurs",
    when: "Dans le premier mois",
    docs: ["Acte de décès (une copie par courrier)", "Numéro de contrat ou de compte", "Votre pièce d'identité"],
    steps: [
      "Lister les organismes à prévenir, un par ligne.",
      "Pour chacun : joindre une copie de l'acte de décès et le numéro de contrat.",
      "Envoyer en recommandé lorsqu'il s'agit d'un contrat ou d'un bail.",
      "Cocher l'organisme une fois la confirmation reçue.",
    ],
  },
  succession: {
    why: "Faire établir qui hérite de quoi, et dans quelles conditions.",
    who: "Notaire",
    when: "Dans les 6 mois",
    docs: ["Acte de décès", "Livret de famille", "Titres de propriété", "Relevés bancaires"],
    steps: [
      "Prendre rendez-vous chez un notaire (obligatoire s'il y a un bien immobilier).",
      "Apporter les documents ci-dessus au premier rendez-vous.",
      "Demander une estimation écrite des frais avant d'engager quoi que ce soit.",
    ],
  },
  finances: {
    why: "Bloquer les comptes, arrêter les prélèvements, éviter les mauvaises surprises.",
    who: "Banques et assurances",
    when: "Dans les 15 jours",
    docs: ["Acte de décès", "Numéros de comptes", "Votre pièce d'identité"],
    steps: [
      "Prévenir chaque banque : les comptes personnels seront bloqués.",
      "Demander la liste des prélèvements automatiques en cours.",
      "Vérifier l'existence d'une assurance décès ou d'un capital.",
    ],
  },
  rights: {
    why: "Des aides existent : capital décès, pension de réversion, allocations.",
    who: "CPAM, CAF, caisse de retraite",
    when: "Dans le mois, certaines aides sont limitées dans le temps",
    docs: ["Acte de décès", "Derniers bulletins de salaire ou de pension", "RIB"],
    steps: [
      "Contacter la CPAM pour le capital décès.",
      "Contacter la caisse de retraite pour la réversion.",
      "Signaler le changement de situation à la CAF.",
    ],
  },
  digital: {
    why: "Fermer ou mettre en mémoire les comptes en ligne, arrêter les abonnements.",
    who: "Plateformes et opérateurs",
    when: "Quand vous en avez l'énergie",
    docs: ["Acte de décès", "Adresses mail connues"],
    steps: [
      "Lister les abonnements payants et les résilier.",
      "Demander la mise en mémoire ou la suppression des réseaux sociaux.",
      "Conserver ce qui a une valeur affective avant toute fermeture.",
    ],
  },
  housing: {
    why: "Régler le logement et le devenir des affaires, à votre rythme.",
    who: "Bailleur, syndic ou notaire",
    when: "Selon le bail, souvent sous 1 à 3 mois",
    docs: ["Bail ou titre de propriété", "Acte de décès", "Dernières factures"],
    steps: [
      "Prévenir le bailleur ou le syndic par écrit.",
      "Relever les compteurs et résilier les contrats d'énergie.",
      "Trier les affaires seulement quand vous vous en sentez capable.",
    ],
  },
  vet: {
    why: "Faire constater et décider de la suite, avec un professionnel de confiance.",
    who: "Vétérinaire",
    when: "Dans les 24 à 48 h",
    docs: ["Carnet de santé", "Numéro d'identification"],
    steps: [
      "Appeler la clinique pour le certificat.",
      "Demander les options de crémation ou d'inhumation et leurs tarifs.",
      "Signaler le décès au fichier d'identification.",
    ],
  },
  messages: {
    why: "Prévenir les proches sans avoir à répéter la même phrase vingt fois.",
    who: "Famille, amis, collègues",
    when: "Les premiers jours",
    docs: ["Liste des personnes à prévenir"],
    steps: [
      "Écrire un message unique, court, à envoyer tel quel.",
      "Confier une partie de la liste à quelqu'un de confiance.",
      "Indiquer la date et le lieu de la cérémonie si elle est fixée.",
    ],
  },
  aide_famille: {
    why: "Aider vraiment, sans envahir : proposer une chose précise.",
    who: "La famille proche",
    when: "Les premières semaines",
    docs: [],
    steps: [
      "Proposer une aide concrète plutôt qu'un « dis-moi si besoin ».",
      "Fixer un créneau précis.",
      "Reprendre contact deux semaines plus tard, quand les autres s'éloignent.",
    ],
  },
};

export function taskGuide(cat: PracticalCategory): TaskGuide {
  return TASK_GUIDES[cat] ?? FALLBACK;
}
