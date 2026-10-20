/* « Au bon moment » (ajouts-4 §6, donnees/moments.json) : une seule carte sur Aujourd'hui,
 * dans l'ordre sécurité → échéance < 7 j → je suis bloqué (14 j) → reprise J-3 → point du mois → ce qui m'aiderait. */

export type MomentId = "securite_3114" | "echeance_moins_7_jours" | "je_suis_bloque_14_premiers_jours" | "reprise_travail_j_moins_3" | "point_du_mois" | "ce_qui_m_aiderait";

export type MomentCard = { id: MomentId; label: string; title: string; meta: string; cta: string; to: string };

export type MomentInput = {
  now: Date;
  /** Envie de ne plus être là, ou besoin d'aide urgent déclaré. */
  safety: boolean;
  /** Jours avant la prochaine échéance de démarche, si elle existe. */
  nextDeadlineDays?: number | null;
  nextDeadlineLabel?: string;
  deathDate?: string | null;
  workDate?: string | null;
  pointDoneThisMonth: boolean;
  pointOff?: boolean;
  /** Jour difficile connu aujourd'hui (anniversaire, fête…). */
  hardDay?: boolean;
  fatigueDays?: number;
};

const DAY = 864e5;
function dayDiff(from: Date, to: Date) {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / DAY);
}
function parse(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso.length === 10 ? iso + "T12:00:00" : iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Mois entiers depuis le décès, et jours depuis la dernière date mensuelle. */
export function monthlyOffset(death: Date, now: Date) {
  let months = (now.getFullYear() - death.getFullYear()) * 12 + now.getMonth() - death.getMonth();
  if (now.getDate() < death.getDate()) months -= 1;
  const anchor = new Date(death.getFullYear(), death.getMonth() + months, death.getDate());
  return { months, daysAfter: dayDiff(anchor, now) };
}

export function pickMoment(i: MomentInput): MomentCard | null {
  if (i.safety) return { id: "securite_3114", label: "Tout de suite", title: "Parler à quelqu'un maintenant", meta: "Le 3114, gratuit, jour et nuit", cta: "Appeler le 3114", to: "/crisis" };

  if (i.nextDeadlineDays != null && i.nextDeadlineDays >= 0 && i.nextDeadlineDays <= 7) {
    const when = i.nextDeadlineDays === 0 ? "aujourd'hui" : i.nextDeadlineDays === 1 ? "demain" : `dans ${i.nextDeadlineDays} jours`;
    return { id: "echeance_moins_7_jours", label: "Une échéance", title: i.nextDeadlineLabel ?? "Une date approche", meta: `C'est ${when}`, cta: "Voir", to: "/practical" };
  }

  const death = parse(i.deathDate);
  const since = death ? dayDiff(death, i.now) : null;

  if (since !== null && since >= 0 && since < 14) return { id: "je_suis_bloque_14_premiers_jours", label: "Si quelque chose coince", title: "Je suis bloqué", meta: "Mots de passe, argent, papiers", cta: "Voir", to: "/practical/bloque" };

  const work = parse(i.workDate);
  if (work) {
    const d = dayDiff(i.now, work);
    if (d >= 0 && d <= 3) return { id: "reprise_travail_j_moins_3", label: "Bientôt", title: "Reprendre le travail", meta: d === 0 ? "C'est aujourd'hui" : `Dans ${d} jour${d > 1 ? "s" : ""}`, cta: "S'y préparer", to: "/care/travail" };
  }

  if (death && !i.pointOff && !i.pointDoneThisMonth && !i.hardDay) {
    const { months, daysAfter } = monthlyOffset(death, i.now);
    if (months >= 1 && daysAfter >= 3 && daysAfter <= 10) return { id: "point_du_mois", label: "Pour vous, en ce moment", title: "Votre point du mois", meta: "3 questions · 2 min", cta: "Faire le point", to: "/care/point" };
  }

  if ((since !== null && since >= 0 && since < 21) || (i.fatigueDays ?? 0) >= 3) return { id: "ce_qui_m_aiderait", label: "Être entouré", title: "Dire à vos proches ce qui vous aiderait", meta: "Un repas, des courses, une présence", cta: "Choisir", to: "/care/aide" };

  return null;
}
