export type Ritual = {
  id: string;
  tradition: "laic" | "catholique" | "protestant" | "juif" | "musulman" | "bouddhiste" | "hindou" | "libre";
  title: string;
  description: string;
  duration?: string;
};

export const RITUALS_CATALOG: Ritual[] = [
  { id: "bougie", tradition: "laic", title: "Allumer une bougie", description: "Un geste simple pour marquer un seuil, une pensée. À faire seul·e ou à plusieurs.", duration: "5 min" },
  { id: "lettre-bruler", tradition: "laic", title: "Écrire puis brûler une lettre", description: "Dire ce qui n'a pas été dit, puis laisser partir.", duration: "20 min" },
  { id: "veillee", tradition: "catholique", title: "Veillée de prière", description: "Temps de recueillement la veille des obsèques, en famille ou paroisse." },
  { id: "kaddish", tradition: "juif", title: "Kaddish", description: "Prière récitée pendant la période de deuil, traditionnellement en présence d'un minyan." },
  { id: "chiva", tradition: "juif", title: "Shiv'a (7 jours)", description: "Période de recueillement à domicile, où les proches viennent rendre visite." },
  { id: "ghusl", tradition: "musulman", title: "Toilette rituelle (ghusl)", description: "Lavage du défunt selon le rite, par des personnes du même sexe." },
  { id: "salat-janazah", tradition: "musulman", title: "Salat al-janâza", description: "Prière collective pour le défunt, en mosquée ou sur le lieu d'inhumation." },
  { id: "encens", tradition: "bouddhiste", title: "Offrande d'encens", description: "Allumer 3 bâtons d'encens et formuler une intention pour le défunt." },
  { id: "lecture-bardo", tradition: "bouddhiste", title: "Lecture du Bardo Thödol", description: "Accompagnement par lecture pendant 49 jours dans la tradition tibétaine." },
  { id: "antyesti", tradition: "hindou", title: "Antyeshti — derniers rites", description: "Crémation rituelle et dispersion des cendres dans un cours d'eau sacré." },
  { id: "cercle-parole", tradition: "libre", title: "Cercle de parole", description: "Chacun partage un souvenir, dans l'ordre qu'il souhaite. Silence accepté." },
  { id: "plantation", tradition: "libre", title: "Planter un arbre", description: "Geste de mémoire vivante — choisir une essence qui fera sens." },
];

/* ───── Rituels du monde (B103–B113) ───── */
export type RegionId = "asie" | "ameriques" | "afrique" | "europe" | "oceanie";
export const WORLD_REGIONS: { id: RegionId; label: string; countries: string; title: [string, string] }[] = [
  { id: "asie", label: "Asie", countries: "Japon, Chine, Corée, Népal", title: ["Asie : des morts", "qui restent proches."] },
  { id: "ameriques", label: "Amériques", countries: "Mexique, Nouvelle-Orléans, Bolivie, Guatemala", title: ["Amériques : la mort", "se fête aussi."] },
  { id: "afrique", label: "Afrique", countries: "Madagascar, Ghana, Afrique du Sud", title: ["Afrique : les morts", "restent de la famille."] },
  { id: "europe", label: "Europe et Moyen-Orient", countries: "Irlande, France, Grèce, traditions juive et musulmane", title: ["Europe et Moyen-Orient :", "veiller, recevoir, se souvenir."] },
  { id: "oceanie", label: "Océanie", countries: "Australie, Nouvelle-Zélande", title: ["Océanie : un deuil", "partagé par tous."] },
];

export type WorldTradition = {
  id: string; region: RegionId; place: string; period?: string; title: string; description: string;
  /** Fiche détaillée (modèle B109) */
  long: string; meaning: string; keep: [string, string];
};

export const WORLD_TRADITIONS: WorldTradition[] = [
  { id: "obon", region: "asie", place: "Japon", period: "Juillet ou août", title: "Obon et les lanternes", description: "On accueille les ancêtres trois jours, puis on les raccompagne avec des lanternes posées sur l'eau.",
    long: "Pendant Obon, les familles nettoient les tombes, allument des feux pour guider les ancêtres jusqu'à la maison, puis les raccompagnent en posant des lanternes de papier sur l'eau.", meaning: "Les morts reviennent nous visiter ; on les reçoit, puis on les laisse repartir.", keep: ["Accueillir sa présence quelques jours, puis la laisser repartir doucement.", "Confier quelques mots à une lumière qui s'éloigne."] },
  { id: "qingming", region: "asie", place: "Chine", period: "Début avril", title: "Qingming, la fête de la clarté", description: "On nettoie les tombes, on y apporte des fleurs et des plats.",
    long: "Au printemps, les familles se rendent sur les tombes pour les balayer, y déposer des fleurs, des plats et de l'encens, puis partagent souvent un pique-nique.", meaning: "Prendre soin de la tombe, c'est continuer à prendre soin de la personne.", keep: ["Un jour par an pour rendre visite, nettoyer, fleurir.", "Partager un repas là où l'on se souvient."] },
  { id: "butsudan", region: "asie", place: "Japon", period: "Chaque jour", title: "Le butsudan", description: "Un petit autel chez soi : photo, encens, un bol de riz. On salue ses morts le matin.",
    long: "Dans beaucoup de maisons japonaises, un petit autel accueille la photo des défunts. Chaque matin, on y dépose du riz ou du thé, on allume un bâton d'encens et on les salue.", meaning: "Les morts ont encore une place dans la maison, et dans la journée.", keep: ["Un petit coin chez soi, avec sa photo et un objet.", "Un salut le matin, quelques secondes."] },
  { id: "gai-jatra", region: "asie", place: "Népal", period: "Fin de l'été", title: "Gai Jatra", description: "Les familles en deuil défilent dans la rue, en chantant, pour accepter la mort ensemble.",
    long: "À Katmandou, les familles qui ont perdu quelqu'un dans l'année défilent dans les rues, souvent déguisées, au milieu des chants et des plaisanteries.", meaning: "Personne n'est seul à avoir perdu quelqu'un ; la ville entière le reconnaît.", keep: ["Se rappeler que d'autres traversent la même chose.", "Laisser une place au rire, même dans le deuil."] },
  { id: "chuseok", region: "asie", place: "Corée", period: "Chuseok, en automne", title: "La table des ancêtres", description: "On dresse une table d'offrandes et on s'incline devant les ancêtres.",
    long: "Pour Chuseok, la famille dispose sur une table les plats de saison selon un ordre précis, puis chacun s'incline devant les ancêtres avant de partager le repas.", meaning: "Les ancêtres font partie de la fête et du repas de famille.", keep: ["Préparer un plat qu'elle aimait, pour un repas en famille.", "Un moment de silence avant de manger."] },
  { id: "dia-de-muertos", region: "ameriques", place: "Mexique", period: "1er et 2 novembre", title: "Le Jour des morts", description: "On dresse un autel avec photos, fleurs orange et plats préférés pour accueillir les morts.",
    long: "Pour le Día de los Muertos, chaque famille dresse une ofrenda : photos, fleurs de cempasúchil orange, bougies, et les plats que les morts aimaient, pour les accueillir une nuit.", meaning: "La mort n'efface pas la personne : une fois par an, elle revient à la maison.", keep: ["Dresser un petit autel avec ce qu'elle aimait.", "Dire son prénom à voix haute."] },
  { id: "jazz", region: "ameriques", place: "Nouvelle-Orléans", period: "Lors des obsèques", title: "Les cortèges de jazz", description: "La fanfare joue lentement à l'aller, puis le cortège revient en dansant pour célébrer la vie.",
    long: "Lors des jazz funerals, la fanfare accompagne le cercueil avec des airs lents et graves, puis, au retour, le cortège se met à danser sur des airs joyeux.", meaning: "Le chagrin et la joie d'avoir connu quelqu'un peuvent se suivre.", keep: ["Écouter la musique qu'elle aimait, d'abord lente, puis joyeuse.", "Célébrer une vie, pas seulement pleurer une mort."] },
  { id: "natitas", region: "ameriques", place: "Bolivie", period: "8 novembre", title: "Le jour des Ñatitas", description: "On fleurit et on remercie des crânes gardés à la maison, vus comme des protecteurs.",
    long: "À La Paz, des familles gardent des crânes, les ñatitas, qu'elles parent de fleurs, de lunettes ou de bonnets le 8 novembre, et à qui elles demandent protection.", meaning: "Les morts veillent sur les vivants, qui le leur rendent.", keep: ["Remercier ceux qui sont partis pour ce qu'ils nous ont donné.", "Fleurir un objet qui la représente."] },
  { id: "barriletes", region: "ameriques", place: "Guatemala", period: "1er novembre", title: "Les cerfs-volants géants", description: "À Sumpango, on fait voler d'immenses cerfs-volants pour envoyer des messages aux défunts.",
    long: "À Sumpango et Santiago Sacatepéquez, on fabrique pendant des mois d'immenses cerfs-volants de papier, que l'on fait voler au-dessus des cimetières le 1er novembre.", meaning: "Le vent porte les messages jusqu'aux morts.", keep: ["Écrire un message et le confier au vent.", "Fabriquer quelque chose à plusieurs pour elle."] },
  { id: "famadihana", region: "afrique", place: "Madagascar · Hauts plateaux", period: "Tous les 5 à 7 ans", title: "Le retournement des morts", description: "On enveloppe les défunts dans de nouveaux linceuls et on danse avec eux.",
    long: "Pendant la Famadihana, la famille ouvre le tombeau, enveloppe ses défunts dans de nouveaux linceuls et danse avec eux, en musique, avant de les remettre en place.", meaning: "Les morts restent des membres de la famille, dont on prend soin.", keep: ["Prendre soin de ses morts, régulièrement, comme d'un lien qui continue.", "Faire de la mémoire une fête, et non seulement un chagrin."] },
  { id: "cercueils", region: "afrique", place: "Ghana", title: "Les cercueils figuratifs", description: "Un cercueil sculpté à l'image d'un métier ou d'une passion : un poisson, un avion…",
    long: "Dans la région d'Accra, des artisans sculptent des cercueils à l'image de ce que la personne a été : un poisson pour un pêcheur, un avion pour un voyageur.", meaning: "On enterre une personne avec ce qui faisait sa vie.", keep: ["Choisir un objet qui dit ce qu'elle aimait.", "Raconter sa vie par ce qu'elle faisait."] },
  { id: "couleurs", region: "afrique", place: "Ghana", title: "Des funérailles en couleurs", description: "Rouge et noir pour la famille proche, blanc pour célébrer une longue vie.",
    long: "Au Ghana, les funérailles réunissent souvent des centaines de personnes. Les couleurs portées disent le lien et le moment : rouge et noir pour le deuil, blanc pour une longue vie accomplie.", meaning: "Le deuil se montre, se partage, et peut aussi célébrer.", keep: ["Porter une couleur qui lui ressemble, un jour particulier.", "Inviter largement : le deuil se vit à plusieurs."] },
  { id: "unveiling", region: "afrique", place: "Afrique du Sud", period: "Un an après", title: "Le dévoilement de la pierre", description: "La famille se réunit pour dévoiler la pierre tombale et clore le deuil.",
    long: "Environ un an après le décès, la famille se réunit au cimetière pour dévoiler la pierre tombale, partager un repas et marquer la fin de la période de deuil.", meaning: "Le deuil a un temps, et un moment pour en sortir ensemble.", keep: ["Marquer la première année par un moment partagé.", "Se réunir pour dire : la vie continue avec elle."] },
  { id: "wake", region: "europe", place: "Irlande", title: "La veillée irlandaise", description: "On veille le défunt à la maison, avec des récits, de la musique, parfois des rires.",
    long: "Lors de la wake, le défunt reste à la maison une ou deux nuits. Voisins et proches passent, racontent des histoires, chantent et boivent un verre en sa mémoire.", meaning: "On ne laisse pas le mort seul, ni ceux qui restent.", keep: ["Se réunir pour raconter des histoires sur elle.", "Accepter que l'on rie aussi."] },
  { id: "toussaint", region: "europe", place: "France", period: "1er novembre", title: "La Toussaint", description: "On fleurit les tombes, souvent de chrysanthèmes.",
    long: "Autour du 1er et du 2 novembre, les familles se rendent au cimetière pour nettoyer et fleurir les tombes, souvent de chrysanthèmes.", meaning: "Un jour dans l'année où tout le pays pense à ses morts.", keep: ["Fleurir sa tombe, ou un endroit qui la rappelle.", "Rendre visite en famille."] },
  { id: "quarante-jours", region: "europe", place: "Grèce et monde orthodoxe", title: "Les quarante jours", description: "On partage la kollyva, un blé bouilli au miel, en mémoire du défunt.",
    long: "Quarante jours après le décès, puis aux anniversaires, la famille fait bénir la kollyva, un blé bouilli au miel, aux noix et aux grenades, et la partage avec les proches.", meaning: "Le deuil avance par étapes, que l'on marque ensemble.", keep: ["Marquer le quarantième jour par un moment partagé.", "Partager quelque chose de doux en sa mémoire."] },
  { id: "shiva", region: "europe", place: "Tradition juive", title: "La shiv'a", description: "Sept jours de deuil à la maison, puis chaque année une bougie de 24 heures.",
    long: "Après l'enterrement, la famille reste sept jours à la maison et reçoit les visites. Chaque année, à la date du décès, on allume une bougie qui brûle 24 heures.", meaning: "Les proches viennent à vous ; vous n'avez rien à faire que d'être là.", keep: ["Accepter les visites, sans rien avoir à préparer.", "Allumer une bougie chaque année, à la même date."] },
  { id: "azza", region: "europe", place: "Tradition musulmane", title: "Les trois jours de condoléances", description: "La famille reçoit pendant trois jours ; les proches apportent les repas.",
    long: "Pendant trois jours, la famille endeuillée reçoit les condoléances. Voisins et proches apportent les repas pour qu'elle n'ait pas à cuisiner.", meaning: "La communauté porte la famille pendant les premiers jours.", keep: ["Laisser les autres apporter les repas.", "Recevoir, écouter, prier ou se taire ensemble."] },
  { id: "sorry-business", region: "oceanie", place: "Peuples aborigènes d'Australie", title: "Le Sorry Business", description: "Un deuil collectif ; on évite souvent de prononcer le nom du défunt ou de montrer son image.",
    long: "Chez de nombreux peuples aborigènes, le deuil est l'affaire de toute la communauté. Pendant un temps, on évite de prononcer le nom du défunt ou de montrer son image.", meaning: "Le deuil appartient à tous, et se vit selon des règles partagées.", keep: ["Accepter de ne pas regarder ses photos, si c'est trop tôt.", "Laisser la communauté vous entourer."] },
  { id: "tangihanga", region: "oceanie", place: "Maoris · Nouvelle-Zélande", title: "Le tangihanga", description: "Plusieurs jours de veillée sur le lieu de rassemblement : le défunt n'est jamais laissé seul.",
    long: "Le défunt repose plusieurs jours sur le marae, le lieu de rassemblement. Discours, chants et larmes se succèdent ; il n'est jamais laissé seul.", meaning: "Pleurer ensemble, longuement, fait partie de l'adieu.", keep: ["Prendre plusieurs jours pour dire au revoir.", "Ne pas laisser seuls ceux qui pleurent."] },
  { id: "matariki", region: "oceanie", place: "Nouvelle-Zélande", period: "Juin ou juillet", title: "Matariki", description: "Au lever des Pléiades, on se souvient de ceux qui sont partis dans l'année.",
    long: "Au lever de l'amas des Pléiades, le nouvel an maori est l'occasion de nommer à voix haute ceux qui sont morts dans l'année, puis de se tourner vers l'avenir.", meaning: "Se souvenir des morts ouvre la nouvelle année.", keep: ["Un soir par an, nommer ceux qui sont partis.", "Regarder le ciel en pensant à elle."] },
];

/* ───── Calendrier des jours des morts (B111–B112) ───── */
export type WorldDate = { month: number; day?: number; when: string; title: string; place: string; hint?: string; tradition?: string; region?: RegionId };
export const WORLD_DATES: WorldDate[] = [
  { month: 4, when: "Avril", title: "Qingming", place: "Chine", tradition: "qingming", region: "asie" },
  { month: 6, when: "Juin, juillet", title: "Matariki", place: "Nouvelle-Zélande", tradition: "matariki", region: "oceanie" },
  { month: 7, when: "Juillet, août", title: "Obon", place: "Japon", tradition: "obon", region: "asie" },
  { month: 7, when: "Juillet à sept.", title: "Le retournement des morts", place: "Madagascar", tradition: "famadihana", region: "afrique" },
  { month: 8, when: "Août", title: "La fête des fantômes", place: "Chine" },
  { month: 8, when: "Août, sept.", title: "Gai Jatra", place: "Népal", tradition: "gai-jatra", region: "asie" },
  { month: 9, when: "Sept., oct.", title: "Pitru Paksha · Chuseok", place: "Inde · Corée", tradition: "chuseok", region: "asie" },
  { month: 10, day: 31, when: "31 oct.", title: "Samhain", place: "Irlande", hint: "Irlande · on pense à ceux qui sont partis" },
  { month: 11, day: 1, when: "1er et 2 nov.", title: "Toussaint · Jour des morts", place: "France · Mexique", hint: "France · on fleurit les tombes", tradition: "toussaint", region: "europe" },
  { month: 11, day: 2, when: "2 nov.", title: "Le Jour des morts", place: "Mexique", hint: "Mexique · autels, fleurs orange, plats préférés", tradition: "dia-de-muertos", region: "ameriques" },
  { month: 11, day: 8, when: "8 nov.", title: "Le jour des Ñatitas", place: "Bolivie", hint: "Bolivie · des crânes fleuris et remerciés", tradition: "natitas", region: "ameriques" },
];
/** Liste « Toute l'année » : la Toussaint et le Jour des morts y sont réunis. */
export const YEAR_DATES = WORLD_DATES.filter((d) => !(d.month === 11 && d.day === 2));

/** Prochaine date du monde (précise au jour) à partir d'aujourd'hui. */
export function nextWorldDate(now = new Date()) {
  const precise = WORLD_DATES.filter((d) => d.day).map((d) => {
    let t = new Date(now.getFullYear(), d.month - 1, d.day);
    if (t < new Date(now.getFullYear(), now.getMonth(), now.getDate())) t = new Date(now.getFullYear() + 1, d.month - 1, d.day);
    return { d, t };
  }).sort((a, b) => a.t.getTime() - b.t.getTime());
  return precise[0];
}

/* ───── Gestes seul et rituels à plusieurs (B092–B096) ───── */
export type Gesture = { id: string; title: string; origin: string; duration: string; mode: "seul" | "plusieurs" | "les deux"; to?: string; text: string; steps: string[] };
export const GESTURES_ALONE: Gesture[] = [
  { id: "bougie", title: "Allumer une bougie", origin: "Partout", duration: "5 min", mode: "les deux", to: "/care/rituels/fait", text: "Le geste le plus partagé au monde : une lumière, son prénom, quelques minutes avec elle.", steps: ["Allumez une bougie, ici ou chez vous.", "Dites son prénom.", "Restez avec elle le temps qu'il faut."] },
  { id: "lanterne", title: "Une lanterne sur l'eau", origin: "Japon · fête d'Obon", duration: "10 min", mode: "les deux", text: "Au Japon, à la fin d'Obon, on pose des lanternes sur l'eau pour accompagner les défunts. Ici, dans l'application, ou dehors avec une bougie et un bol d'eau.", steps: ["Écrivez-lui quelques mots.", "Posez la lanterne sur l'eau.", "Regardez-la s'éloigner, le temps qu'il faut."] },
  { id: "lettre", title: "Écrire une lettre, puis la laisser partir", origin: "Partout", duration: "20 min", mode: "seul", to: "/care/rituels/lettre", text: "Écrire ce qui n'a pas été dit, puis le laisser partir.", steps: ["Écrivez sans vous relire.", "Laissez partir la lettre.", "Respirez un moment."] },
  { id: "pierre", title: "Déposer une petite pierre", origin: "Tradition juive", duration: "2 min", mode: "seul", text: "Dans la tradition juive, on dépose une petite pierre sur la tombe plutôt qu'une fleur : elle ne fane pas, comme le souvenir.", steps: ["Choisissez une petite pierre.", "Déposez-la sur sa tombe, ou dans un lieu qui la rappelle.", "Dites-lui que vous êtes passé."] },
  { id: "encens", title: "Allumer un bâton d'encens", origin: "Asie bouddhiste", duration: "5 min", mode: "seul", text: "Dans les traditions bouddhistes, la fumée de l'encens relie les vivants et les morts. On l'allume devant une photo, en silence.", steps: ["Posez sa photo devant vous.", "Allumez un bâton d'encens.", "Pensez à elle pendant qu'il se consume."] },
  { id: "prenom", title: "Dire son prénom à voix haute", origin: "Mexique", duration: "1 min", mode: "seul", text: "Au Mexique, on dit que l'on meurt vraiment le jour où plus personne ne prononce notre nom. Le dire, c'est la garder vivante.", steps: ["Respirez.", "Dites son prénom à voix haute.", "Ajoutez une phrase, si vous voulez."] },
  { id: "silence", title: "Une minute de silence", origin: "Partout", duration: "1 min", mode: "seul", text: "Une minute pour elle, rien d'autre. Seul, ou à la même heure que des proches.", steps: ["Posez votre téléphone.", "Fermez les yeux une minute.", "Revenez doucement."] },
];
export const RITUALS_TOGETHER: Gesture[] = [
  { id: "repas", title: "Repas et récits", origin: "Partout · chacun apporte un plat et un souvenir", duration: "Une soirée", mode: "plusieurs", to: "/care/rituels/organiser", text: "Se réunir pour manger et raconter la personne. Chacun apporte un plat et un souvenir.", steps: ["Chacun apporte un plat qu'elle aimait.", "Chacun raconte un souvenir.", "On termine par une bougie, si on veut."] },
  { id: "veillee-musique", title: "Une veillée en musique", origin: "Irlande · récits, chansons, et parfois des rires", duration: "Une soirée", mode: "plusieurs", text: "Inspirée de la veillée irlandaise : on se retrouve pour raconter, chanter ses chansons, et parfois rire.", steps: ["Préparez une liste de chansons qu'elle aimait.", "Chacun raconte une histoire entre deux chansons.", "On termine par celle qu'elle préférait."] },
  { id: "cercle", title: "Un cercle de parole", origin: "Partout · Legato guide le cercle", duration: "1 heure", mode: "plusieurs", to: "/care/rituels/cercle", text: "", steps: [] },
  { id: "arbre", title: "Planter un arbre", origin: "Partout · un geste de mémoire vivante", duration: "Une matinée", mode: "plusieurs", to: "/care/rituels/arbre", text: "", steps: [] },
  { id: "table-offrandes", title: "Une table d'offrandes", origin: "Corée, Chine · un repas pour ceux qui sont partis", duration: "Un repas", mode: "plusieurs", text: "En Corée et en Chine, on dresse une table avec les plats que les défunts aimaient, avant de partager le repas en famille.", steps: ["Préparez un ou deux plats qu'elle aimait.", "Posez sa photo sur la table.", "Un moment de silence, puis on mange ensemble."] },
];
export const findGesture = (id: string) => [...GESTURES_ALONE, ...RITUALS_TOGETHER].find((g) => g.id === id);

/** Les traditions du monde gardent leur identité dans l'invitation. */
export function findOrganisedRitual(id = "repas") {
  const gesture = findGesture(id);
  if (gesture) return gesture;
  const tradition = WORLD_TRADITIONS.find((t) => t.id === id);
  if (tradition) return { id: tradition.id, title: tradition.title, text: tradition.long };
  return findGesture("repas");
}
