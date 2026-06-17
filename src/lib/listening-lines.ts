export type ListeningLine = {
  name: string;
  phone: string;
  hours: string;
  scope: string;
  url?: string;
};

export const LISTENING_LINES: ListeningLine[] = [
  { name: "SOS Amitié", phone: "09 72 39 40 50", hours: "24h/24", scope: "Écoute généraliste, anonyme, gratuite.", url: "https://www.sos-amitie.com" },
  { name: "Suicide Écoute", phone: "01 45 39 40 00", hours: "24h/24", scope: "Pensées suicidaires, désarroi profond.", url: "https://suicide-ecoute.fr" },
  { name: "3114 — National prévention suicide", phone: "3114", hours: "24h/24", scope: "Professionnels de santé, gratuit.", url: "https://3114.fr" },
  { name: "Empreintes — vivre son deuil", phone: "01 42 38 08 08", hours: "Lun–Ven 14h–17h", scope: "Écoute spécifique au deuil.", url: "https://www.empreintes-asso.com" },
  { name: "Vivre Son Deuil", phone: "01 42 38 07 08", hours: "Sur rendez-vous", scope: "Accompagnement individuel et groupes.", url: "https://www.vivresondeuil.asso.fr" },
  { name: "Jonathan Pierres Vivantes", phone: "01 42 96 36 33", hours: "Lun–Ven 9h–17h", scope: "Parents endeuillés.", url: "https://www.anjpv.com" },
];