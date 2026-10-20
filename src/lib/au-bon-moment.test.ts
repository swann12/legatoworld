import { describe, expect, it } from "vitest";
import { pickMoment } from "./au-bon-moment";
import { isHeavy } from "./soutien";

const now = new Date(2026, 9, 20, 12);
const base = { now, safety: false, pointDoneThisMonth: false };

describe("au bon moment", () => {
  it("la sécurité passe avant tout", () => {
    expect(pickMoment({ ...base, safety: true, nextDeadlineDays: 2, deathDate: "2026-10-15" })?.id).toBe("securite_3114");
  });
  it("une échéance à moins de 7 jours passe avant « je suis bloqué »", () => {
    expect(pickMoment({ ...base, nextDeadlineDays: 7, deathDate: "2026-10-15" })?.id).toBe("echeance_moins_7_jours");
    expect(pickMoment({ ...base, nextDeadlineDays: 8, deathDate: "2026-10-15" })?.id).toBe("je_suis_bloque_14_premiers_jours");
  });
  it("« je suis bloqué » seulement les 14 premiers jours", () => {
    expect(pickMoment({ ...base, deathDate: "2026-10-07" })?.id).toBe("je_suis_bloque_14_premiers_jours");
    expect(pickMoment({ ...base, deathDate: "2026-10-06" })?.id).toBe("ce_qui_m_aiderait");
  });
  it("reprise du travail 3 jours avant", () => {
    expect(pickMoment({ ...base, workDate: "2026-10-23" })?.id).toBe("reprise_travail_j_moins_3");
    expect(pickMoment({ ...base, workDate: "2026-10-24" })).toBeNull();
  });
  it("point du mois dès le 2e mois, quelques jours après la date mensuelle, jamais un jour difficile", () => {
    expect(pickMoment({ ...base, deathDate: "2026-06-15" })?.id).toBe("point_du_mois");
    expect(pickMoment({ ...base, deathDate: "2026-06-15", hardDay: true })).toBeNull();
    expect(pickMoment({ ...base, deathDate: "2026-06-15", pointDoneThisMonth: true })).toBeNull();
    expect(pickMoment({ ...base, deathDate: "2026-06-15", pointOff: true })).toBeNull();
    expect(pickMoment({ ...base, deathDate: "2026-09-15" })?.id).toBe("point_du_mois");
    expect(pickMoment({ ...base, deathDate: "2026-06-19" })).toBeNull();
  });
  it("ce qui m'aiderait : 3 premières semaines ou fatigue 3 jours de suite", () => {
    expect(pickMoment({ ...base, deathDate: "2026-09-30" })?.id).toBe("ce_qui_m_aiderait");
    expect(pickMoment({ ...base, fatigueDays: 3 })?.id).toBe("ce_qui_m_aiderait");
  });
  it("le point du mois ne pose pas de diagnostic : lourd dès « souvent »", () => {
    expect(isHeavy([2, 0, 0])).toBe(true);
    expect(isHeavy([1, 2, 2])).toBe(true);
    expect(isHeavy([1, 1, 0])).toBe(false);
  });
});
