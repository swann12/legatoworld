import rules from "./regles-aujourdhui-soutien-demarches.json";
import { phaseOf, type TodayInput } from "./today-engine";

export type SupportAction = { title: string; meta: string; cta: string; to: string };
export type SupportPlan = { phase: 1 | 2 | 3; danger: boolean; card: SupportAction; sections: { title: string; rows: SupportAction[] }[]; monthly: boolean };
const row = (title: string, meta: string, to: string, cta = "Ouvrir"): SupportAction => ({ title, meta, to, cta });

/** The JSON defines priority and headings; copy/rows follow soutien() in the supplied simulator. */
export function supportPlan(c: TodayInput): SupportPlan {
  const phase = phaseOf(c), days = c.days === "" ? null : Number(c.days);
  const recent = days === null || days <= 21;
  const has = (flag: string) => c.flags.includes(flag);
  const parler = row("Voir un psychologue", c.besoins.includes("P") ? "vous avez demandé à parler" : "12 séances remboursées par an", "/care/parler/psychologue");
  const groupe = row("Un groupe de parole", "avec d'autres personnes en deuil", "/care/community", "Voir les groupes");
  const proches = row("Dire à vos proches ce qui vous aiderait", "ils choisissent quoi faire", "/care/aide", "Faire ma liste");
  const choices = {
    danger: row("Appeler le 3114", "Gratuit, jour et nuit. Quelqu'un vous répond.", "tel:3114", "Appeler"),
    fatigue: row("Mieux dormir cette nuit", "fatigué depuis trois jours · 3 conseils", "/help/corps/dormir", "Lire"),
    travail: row("Préparer votre retour lundi", "messages prêts, reprise progressive", "/care/travail"),
    recent: { ...proches, meta: "Ils veulent aider : vous choisissez quoi." },
    parler: { ...parler, meta: "Vous avez demandé à parler · 12 séances remboursées.", cta: "Trouver un psychologue" },
    groupe: { ...groupe, meta: "Près de chez vous ou en visio." },
  };
  const priority = rules.soutien.carte_du_haut.split(";");
  let card = choices.groupe;
  for (const condition of priority) {
    if (condition.includes("danger") && has("danger")) { card = choices.danger; break; }
    if (condition.includes("fatigue") && has("fatigue3")) { card = choices.fatigue; break; }
    if (condition.includes("travail") && has("travail")) { card = choices.travail; break; }
    if (condition.includes("semaines") && recent) { card = choices.recent; break; }
    if (condition.includes("besoin P") && c.besoins.includes("P")) { card = choices.parler; break; }
  }
  const withoutCard = (rows: SupportAction[], max = 2) => rows.filter(r => r.title !== card.title).slice(0, max);
  const body = row("Ce que le deuil fait au corps", phase === 1 ? "c'est fréquent" : "fatigue, gorge serrée", "/help/corps/comprendre");
  const rows = phase === 1
    ? [withoutCard([parler, groupe, proches]), [row("Dormir, manger", "l'essentiel en 2 minutes", "/help/corps"), body]]
    : phase === 2
      ? [withoutCard([parler, proches, groupe]), [body, row("Quand consulter un médecin", "les signes d'alerte", "/help/corps/consulter")]]
      : [withoutCard([parler, groupe], 1), withoutCard([row("Reprendre le travail", "messages prêts, reprise progressive", "/care/travail"), row("Lire, écouter, voir", "ce que d'autres en ont dit", "/care/resources")], 1)];
  return { phase, danger: has("danger"), card, sections: rules.soutien.rubriques[String(phase) as "1" | "2" | "3"].map((title, i) => ({ title, rows: rows[i] ?? [] })), monthly: phase >= 2 && (days === null || days >= 30) };
}

export type EmotionDay = { day: string; values: string[] };
export const localDay = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
export function fatigueThreeDays(history: EmotionDay[], now: Date): boolean {
  return [0, 1, 2].every(offset => {
    const d = new Date(now); d.setDate(d.getDate() - offset);
    return history.some(entry => entry.day === localDay(d) && entry.values.includes("Fatigue"));
  });
}