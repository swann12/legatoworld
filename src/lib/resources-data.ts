import type { LucideIcon } from "lucide-react";
import { HeartHandshake, Camera, Gem, Flower, Sprout, Leaf, Users, Scale, Truck, Building2 } from "lucide-react";

export type CategoryId =
  | "therapeutes"
  | "medecines-douces"
  | "ecoute"
  | "photographes"
  | "objets"
  | "fleuristes"
  | "pompes"
  | "notaires"
  | "debarras"
  | "administrations";

export type ResourceSpace = "care" | "practical";

export type Category = {
  id: CategoryId;
  label: string;
  intent: string;
  Icon: LucideIcon;
  tint: string;
  space: ResourceSpace;
};

export const CATEGORIES: Category[] = [
  {
    id: "therapeutes",
    label: "Thérapeutes deuil",
    intent: "Quelqu'un qui connaît ce chemin.",
    Icon: HeartHandshake,
    tint: "var(--rose)",
    space: "care",
  },
  {
    id: "medecines-douces",
    label: "Médecines douces",
    intent: "Sophrologie, acupuncture, ostéopathie émotionnelle.",
    Icon: Leaf,
    tint: "var(--sage)",
    space: "care",
  },
  {
    id: "ecoute",
    label: "Lignes d'écoute & groupes",
    intent: "Parler à quelqu'un, sans rendez-vous.",
    Icon: Users,
    tint: "var(--mist)",
    space: "care",
  },
  {
    id: "photographes",
    label: "Photographes de cérémonie",
    intent: "Garder une image de ce jour.",
    Icon: Camera,
    tint: "var(--mist)",
    space: "practical",
  },
  {
    id: "objets",
    label: "Créateurs d'objets mémoriels",
    intent: "Urnes, bijoux de cendres, objets qui portent.",
    Icon: Gem,
    tint: "var(--lavender)",
    space: "care",
  },
  {
    id: "fleuristes",
    label: "Fleuristes funéraires",
    intent: "Des fleurs qui lui ressemblent.",
    Icon: Flower,
    tint: "var(--peach)",
    space: "practical",
  },
  {
    id: "pompes",
    label: "Pompes funèbres",
    intent: "Un accompagnement transparent, sans pression.",
    Icon: Sprout,
    tint: "var(--sage)",
    space: "practical",
  },
  {
    id: "notaires",
    label: "Notaires & succession",
    intent: "Pour les actes, la succession, sans pression.",
    Icon: Scale,
    tint: "var(--lavender)",
    space: "practical",
  },
  {
    id: "debarras",
    label: "Débarras & déménageurs",
    intent: "Vider, trier un logement, en douceur.",
    Icon: Truck,
    tint: "var(--peach)",
    space: "practical",
  },
  {
    id: "administrations",
    label: "Démarches administratives",
    intent: "Mairie, CPAM, caisses de retraite : un guide pas à pas.",
    Icon: Building2,
    tint: "var(--rose)",
    space: "practical",
  },
];

export type Testimonial = { body: string; from: string };

export type Offer = {
  title: string;
  detail: string;
  price: string;
};

export type Provider = {
  id: string;
  category: CategoryId;
  firstName: string;
  lastName: string;
  city: string;
  modes: ("cabinet" | "visio" | "domicile")[];
  speciality: string;
  approach: string[]; // 3-4 phrases first person
  nextSlot: string;
  offers: Offer[];
  testimonials: Testimonial[];
  // For pompes funèbres: legally required transparent estimate
  estimate?: { lines: { label: string; price: string }[]; total: string };
};

export const PROVIDERS: Provider[] = [
  {
    id: "claire-m",
    category: "therapeutes",
    firstName: "Claire",
    lastName: "Marchand",
    city: "Paris",
    modes: ["cabinet", "visio"],
    speciality: "Deuil de conjoint",
    approach: [
      "J'accompagne depuis quinze ans des personnes qui traversent une perte.",
      "Mon approche est lente, attentive — je ne cherche pas à réparer.",
      "On avance à votre rythme, sans étapes obligatoires.",
    ],
    nextSlot: "jeudi 15 mai",
    offers: [
      { title: "Première rencontre", detail: "60 min · cabinet ou visio", price: "70 €" },
      { title: "Séance de suivi", detail: "50 min · cabinet ou visio", price: "65 €" },
    ],
    testimonials: [
      { body: "Je suis arrivée fermée. Je suis repartie avec un peu d'air.", from: "M., Paris" },
      { body: "Elle ne m'a jamais bousculée. C'est rare.", from: "S., 42 ans" },
    ],
  },
  {
    id: "yann-d",
    category: "therapeutes",
    firstName: "Yann",
    lastName: "Delcourt",
    city: "Lyon",
    modes: ["visio"],
    speciality: "Deuil périnatal",
    approach: [
      "Je reçois les parents qui ont perdu un enfant avant, pendant ou peu après la naissance.",
      "Je sais combien ces silences sont lourds. Je ne les remplis pas à votre place.",
      "Je propose un cadre stable, des mots quand vous en voulez, du silence sinon.",
    ],
    nextSlot: "mardi 20 mai",
    offers: [
      { title: "Rencontre individuelle", detail: "60 min · visio", price: "75 €" },
      { title: "Séance en couple", detail: "75 min · visio", price: "95 €" },
    ],
    testimonials: [
      { body: "Le premier endroit où on a pu nommer notre fille.", from: "Couple, Lyon" },
      { body: "Sa présence est juste. Pas un mot de trop.", from: "A., 35 ans" },
    ],
  },
  {
    id: "sophie-r",
    category: "therapeutes",
    firstName: "Sophie",
    lastName: "Reyer",
    city: "Bordeaux",
    modes: ["cabinet", "domicile"],
    speciality: "Accompagnement enfant",
    approach: [
      "J'accompagne les enfants et adolescents qui traversent une perte.",
      "On dessine, on joue, on parle parfois — chacun trouve son chemin.",
      "Je rencontre aussi les parents pour penser ensemble la place du deuil à la maison.",
    ],
    nextSlot: "lundi 12 mai",
    offers: [
      { title: "Séance enfant", detail: "45 min · cabinet", price: "60 €" },
      { title: "Séance famille", detail: "75 min · domicile possible", price: "90 €" },
    ],
    testimonials: [
      { body: "Mon fils a recommencé à parler de son papa, doucement.", from: "Maman, 38 ans" },
    ],
  },
  {
    id: "mathieu-l",
    category: "photographes",
    firstName: "Mathieu",
    lastName: "Lambert",
    city: "Paris · déplacements France",
    modes: ["cabinet"],
    speciality: "Cérémonies discrètes",
    approach: [
      "Je photographie les cérémonies comme on regarde un visage aimé : sans bruit.",
      "Je reste en retrait, je capte les gestes vrais, jamais la pose.",
      "Vous recevez une sélection sobre, jamais de planche commerciale.",
    ],
    nextSlot: "samedi 17 mai",
    offers: [
      { title: "Cérémonie courte", detail: "2h sur place · 40 photos", price: "490 €" },
      { title: "Journée complète", detail: "6h · 120 photos", price: "950 €" },
    ],
    testimonials: [
      { body: "Il était là sans qu'on le voie. Les photos disent tout.", from: "Famille C." },
    ],
  },
  {
    id: "anouk-v",
    category: "objets",
    firstName: "Anouk",
    lastName: "Vidal",
    city: "Atelier · Nantes",
    modes: ["cabinet", "visio"],
    speciality: "Bijoux de cendres",
    approach: [
      "Je façonne à la main des bijoux qui contiennent une part de cendres ou de mèche.",
      "On échange longuement avant : ce que vous voulez porter, comment, pourquoi.",
      "Chaque pièce est unique — je ne refais jamais deux fois le même geste.",
    ],
    nextSlot: "vendredi 16 mai",
    offers: [
      { title: "Pendentif argent", detail: "Sur mesure · 4 semaines", price: "à partir de 220 €" },
      { title: "Bague or fin", detail: "Sur mesure · 6 semaines", price: "à partir de 480 €" },
    ],
    testimonials: [
      { body: "Je le porte tous les jours. C'est doux, sans être lourd.", from: "L., 51 ans" },
    ],
  },
  {
    id: "fleurs-aubepine",
    category: "fleuristes",
    firstName: "Hélène",
    lastName: "Aubépine",
    city: "Paris 11e",
    modes: ["cabinet"],
    speciality: "Compositions à son image",
    approach: [
      "Je compose des fleurs à partir de ce que vous me dites de la personne.",
      "Pas de catalogue : on parle, et la composition naît de là.",
      "Je travaille de saison, en local autant que possible.",
    ],
    nextSlot: "demain matin",
    offers: [
      { title: "Bouquet d'adieu", detail: "Composition libre", price: "à partir de 65 €" },
      { title: "Composition cérémonie", detail: "Sur mesure", price: "à partir de 180 €" },
    ],
    testimonials: [
      { body: "Elle a fait des fleurs qui lui ressemblaient, vraiment.", from: "Famille R." },
    ],
  },
  {
    id: "pf-douceur",
    category: "pompes",
    firstName: "Maison",
    lastName: "Douceur",
    city: "Île-de-France",
    modes: ["cabinet", "domicile"],
    speciality: "Cérémonies sur mesure, sans pression",
    approach: [
      "Nous sommes une petite maison familiale, indépendante.",
      "Nous prenons le temps qu'il faut, sans jamais pousser à la dépense.",
      "Tous nos tarifs sont publics — vous ne découvrez rien le jour venu.",
    ],
    nextSlot: "appel sous 24h",
    offers: [
      { title: "Accompagnement cérémonie civile", detail: "Préparation et conduite", price: "à partir de 1 290 €" },
    ],
    testimonials: [
      { body: "On nous a écoutés, on ne nous a rien vendu.", from: "Famille L." },
    ],
    estimate: {
      lines: [
        { label: "Cercueil bois certifié", price: "590 €" },
        { label: "Soins et préparation", price: "260 €" },
        { label: "Convoi local", price: "340 €" },
        { label: "Démarches administratives", price: "180 €" },
        { label: "Maître de cérémonie", price: "320 €" },
      ],
      total: "1 690 €",
    },
  },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getProvider(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function providersByCategory(id: CategoryId): Provider[] {
  return PROVIDERS.filter((p) => p.category === id);
}

export function categoriesBySpace(space: ResourceSpace): Category[] {
  return CATEGORIES.filter((c) => c.space === space);
}