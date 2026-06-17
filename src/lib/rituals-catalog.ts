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