/**
 * Communauté Legato — contenu de démonstration.
 * Groupes segmentés, discussions et réponses, pour donner à voir
 * ce qu'est un échange ici : lent, modéré, sans performance.
 */

export type Reply = {
  id: string;
  author: string;
  when: string;
  body: string;
  care: number;
};

export type Thread = {
  id: string;
  group: string;
  title: string;
  author: string;
  when: string;
  body: string;
  care: number;
  tag: "question" | "témoignage" | "conseil pratique" | "coup dur";
  replies: Reply[];
};

export type Group = {
  id: string;
  label: string;
  hint: string;
  members: number;
};

export const GROUPS: Group[] = [
  { id: "conjoint", label: "Perte d'un conjoint", hint: "Vivre après, seul·e, avec ou sans enfants.", members: 1240 },
  { id: "parent", label: "Perte d'un parent", hint: "Devenir l'aîné·e, trier une maison, se réinventer.", members: 2180 },
  { id: "enfant", label: "Perte d'un enfant", hint: "Un groupe très protégé, modéré en continu.", members: 410 },
  { id: "soudaine", label: "Mort soudaine", hint: "Accident, arrêt cardiaque, suicide : le choc.", members: 730 },
  { id: "demarches", label: "Démarches et papiers", hint: "S'entraider sur le concret, sans jargon.", members: 1590 },
  { id: "premiers-mois", label: "Les premiers mois", hint: "Dormir, manger, tenir. Jour après jour.", members: 2640 },
];

export const THREADS: Thread[] = [
  {
    id: "t1",
    group: "premiers-mois",
    title: "Le soir, à 19h, tout s'effondre",
    author: "Anouk",
    when: "il y a 2 h",
    body: "Je tiens toute la journée. Et puis vers 19h, quand la maison devient silencieuse, je m'écroule. Est-ce que quelqu'un a trouvé quelque chose à mettre à cette heure-là ?",
    care: 34,
    tag: "question",
    replies: [
      { id: "r1", author: "Farid", when: "il y a 1 h", body: "Chez moi c'était 18h30. J'ai commencé à sortir marcher exactement à ce moment, même dix minutes. Ce n'est pas magique, mais ça déplace le creux.", care: 12 },
      { id: "r2", author: "Claire", when: "il y a 48 min", body: "La radio. Une voix dans la pièce, sans avoir à répondre. Ça m'a portée les premiers mois.", care: 9 },
      { id: "r3", author: "Modération Legato", when: "il y a 30 min", body: "Si ce moment devient trop lourd, la ligne d'écoute nationale est ouverte 24h/24. Vous n'avez pas à tenir seul·e.", care: 4 },
    ],
  },
  {
    id: "t2",
    group: "premiers-mois",
    title: "Je n'arrive plus à manger de vrais repas",
    author: "Sam",
    when: "hier",
    body: "Trois semaines que je vis de pain et de café. Je sais que ce n'est pas bien, mais cuisiner pour un me paraît absurde.",
    care: 21,
    tag: "témoignage",
    replies: [
      { id: "r4", author: "Hélène", when: "hier", body: "J'ai arrêté de viser « un repas ». Je pose trois choses sur une assiette, c'est tout. Ça compte quand même.", care: 15 },
      { id: "r5", author: "Yann", when: "il y a 20 h", body: "Un voisin m'a apporté une soupe une fois par semaine pendant deux mois. Demander a été le plus dur, mais ça m'a tenu.", care: 8 },
    ],
  },
  {
    id: "t3",
    group: "demarches",
    title: "Combien de temps pour l'acte de décès ?",
    author: "Miriam",
    when: "il y a 5 h",
    body: "La mairie m'a dit « quelques jours ». J'ai besoin de plusieurs copies pour la banque et la caisse de retraite. Vous en avez demandé combien ?",
    care: 11,
    tag: "conseil pratique",
    replies: [
      { id: "r6", author: "Bertrand", when: "il y a 4 h", body: "Prenez-en dix d'un coup, c'est gratuit. J'en ai redemandé trois fois faute d'avoir anticipé.", care: 22 },
      { id: "r7", author: "Nour", when: "il y a 3 h", body: "Et gardez-en deux de côté : l'assurance et le notaire en réclament souvent en même temps.", care: 10 },
    ],
  },
  {
    id: "t4",
    group: "demarches",
    title: "Résilier les abonnements sans tout revivre",
    author: "Pierre",
    when: "il y a 2 j",
    body: "Chaque appel, je dois redire qu'il est mort. Est-ce qu'il existe une manière d'éviter ça ?",
    care: 40,
    tag: "question",
    replies: [
      { id: "r8", author: "Léa", when: "il y a 2 j", body: "J'ai tout fait par courrier type, avec une copie de l'acte. Zéro appel. C'est plus lent mais tellement plus tenable.", care: 31 },
      { id: "r9", author: "Modération Legato", when: "il y a 1 j", body: "Un modèle de courrier est disponible dans Démarches › Lettres, à remplir et à envoyer tel quel.", care: 6 },
    ],
  },
  {
    id: "t5",
    group: "parent",
    title: "Vider la maison : par où commencer ?",
    author: "Inès",
    when: "il y a 3 j",
    body: "Mes frères veulent aller vite, moi je n'arrive pas à ouvrir son armoire. On se dispute pour des serviettes.",
    care: 52,
    tag: "coup dur",
    replies: [
      { id: "r10", author: "Marc", when: "il y a 3 j", body: "On a fait des cartons « plus tard » sans rien trier. Six mois après, ouvrir un carton était supportable.", care: 27 },
      { id: "r11", author: "Sylvie", when: "il y a 2 j", body: "Photographier avant de donner m'a beaucoup aidée. L'objet part, l'image reste.", care: 19 },
    ],
  },
  {
    id: "t6",
    group: "conjoint",
    title: "Retirer l'alliance, ou pas",
    author: "Djamila",
    when: "il y a 1 j",
    body: "On me dit que ce serait « une étape ». Je n'ai pas envie d'étape. J'ai envie qu'on me laisse tranquille.",
    care: 63,
    tag: "témoignage",
    replies: [
      { id: "r12", author: "Olivier", when: "il y a 1 j", body: "Quatre ans, toujours au doigt. Personne n'a à décider du calendrier à votre place.", care: 44 },
      { id: "r13", author: "Rita", when: "il y a 22 h", body: "Je l'ai mise en pendentif un jour où je l'ai voulu, pas un jour où on me l'a suggéré.", care: 18 },
    ],
  },
  {
    id: "t7",
    group: "soudaine",
    title: "Les images reviennent en boucle",
    author: "Thomas",
    when: "il y a 6 h",
    body: "Je revois la scène plusieurs fois par jour, sans prévenir. Est-ce que ça s'apaise ?",
    care: 29,
    tag: "question",
    replies: [
      { id: "r14", author: "Camille", when: "il y a 5 h", body: "Oui, mais avec de l'aide. L'EMDR a beaucoup réduit ça chez moi, en quelques mois.", care: 25 },
      { id: "r15", author: "Modération Legato", when: "il y a 4 h", body: "Ces reviviscences sont fréquentes après une mort soudaine et se traitent bien. Vous trouverez des psychologues formés dans Démarches › Professionnels.", care: 7 },
    ],
  },
  {
    id: "t8",
    group: "enfant",
    title: "Comment répondre à « vous avez des enfants ? »",
    author: "Anonyme",
    when: "il y a 4 j",
    body: "Je ne sais jamais quoi dire. Dire oui ouvre une conversation impossible, dire non me donne l'impression de l'effacer.",
    care: 88,
    tag: "question",
    replies: [
      { id: "r16", author: "Anonyme", when: "il y a 4 j", body: "Je dis « un fils », et je change de sujet. Je ne dois d'explication à personne.", care: 51 },
      { id: "r17", author: "Nadia", when: "il y a 3 j", body: "Je m'autorise une réponse différente selon les jours. Ce n'est pas une trahison.", care: 33 },
    ],
  },
];

export const TAG_TONE: Record<Thread["tag"], string> = {
  question: "var(--terracotta)",
  témoignage: "var(--olive)",
  "conseil pratique": "var(--sky)",
  "coup dur": "var(--bordeaux)",
};

export const groupById = (id: string) => GROUPS.find((g) => g.id === id);
export const threadsOf = (groupId: string) => THREADS.filter((t) => t.group === groupId);
export const threadById = (id: string) => THREADS.find((t) => t.id === id);
