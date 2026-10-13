/* §6 · Démarches selon la réponse « Où en êtes-vous avec les papiers ? »
   (plan-demarches.png). Logique pure : la page /practical ne fait qu'afficher. */
import type { PapersState } from "./onboarding-flow";

export type PlanRow = { id: string; title: string; sub: string; to: string };
export type PlanSection = { label: string; accent: boolean; rows: PlanRow[] };
export type PapersView = "avant" | "apres" | "presque" | "confie";

export const viewFor = (s: PapersState | null): PapersView =>
  s === "rien" ? "avant" : s === "presque" ? "presque" : s === "delegue" ? "confie" : "apres";

/** La cérémonie n'apparaît que si les obsèques n'ont pas eu lieu. */
export const showsCeremony = (s: PapersState | null) => viewFor(s) === "avant";

const SIX_MONTHS = (deathIso: string | null) => {
  const t = deathIso ? new Date(deathIso) : null;
  if (!t || isNaN(+t)) return "dans les six mois";
  t.setMonth(t.getMonth() + 6);
  const m = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return `avant le ${t.getDate()} ${m[t.getMonth()]}`;
};

/** Démarches visibles, dans l'ordre, pour une réponse donnée. `isDone` retire ce qui est déjà fait. */
export function planSections(s: PapersState | null, isDone: (id: string) => boolean, deathIso: string | null = null): PlanSection[] {
  const v = viewFor(s);
  const keep = (rows: PlanRow[]) => rows.filter((r) => !isDone(r.id));
  if (v === "avant") return [{ label: "Aujourd'hui ou demain", accent: true, rows: [
    { id: "obseques", title: "Choisir les pompes funèbres", sub: "Elles déclarent aussi le décès", to: "/practical/tasks/obseques" },
    { id: "ceremonie", title: "Organiser la cérémonie", sub: "Le lieu, la date, les détails", to: "/practical/ceremony" },
    { id: "proches", title: "Prévenir les proches", sub: "Un message prêt à envoyer", to: "/practical/share" },
  ] }];
  if (v === "presque") return [{ label: "Il reste", accent: true, rows: keep([
    { id: "notaire", title: "La déclaration de succession", sub: `avec le notaire · ${SIX_MONTHS(deathIso)}`, to: "/practical/tasks/notaire" },
    { id: "logement", title: "Résilier les derniers contrats", sub: "téléphone, abonnements", to: "/practical/tasks/logement" },
  ]) }];
  if (v === "confie") return [];
  return [
    { label: "Cette semaine", accent: true, rows: keep([
      { id: "acte-deces", title: "Commander l'acte de décès", sub: "10 min · mairie", to: "/practical/tasks/acte-deces" },
      { id: "banque", title: "Prévenir la banque", sub: "15 min · courrier prêt", to: "/practical/tasks/banque/template" },
    ]) },
    { label: "Ensuite", accent: false, rows: keep([
      { id: "retraite", title: "Retraite, assurance maladie, mutuelle", sub: "ce mois-ci", to: "/practical/tasks/retraite" },
      { id: "notaire", title: "La succession", sub: "avec un notaire, dans les six mois", to: "/practical/tasks/notaire" },
    ]) },
  ].filter((x) => x.rows.length > 0);
}
