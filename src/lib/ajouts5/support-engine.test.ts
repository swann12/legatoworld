import { describe, expect, it } from "vitest";
import scenarios from "./scenarios-test.json";
import { supportPlan, fatigueThreeDays } from "./support-engine";
const base = { days: "42", papiers: "O", comment: "", besoins: [], emos: [], flags: [] };
describe("Soutien — règles Ajouts-5", () => {
  for (const [i, scenario] of scenarios.scenarios.entries()) it(`situation ${i + 1}`, () => {
    const plan = supportPlan(scenario.reponses);
    expect(plan.card.title).toBe(scenario.attendu.soutien.carte_du_haut);
    expect(plan.sections.map(s => s.title)).toEqual(scenario.attendu.soutien.rubriques);
    expect(plan.monthly).toBe(scenario.attendu.soutien.point_du_mois_en_bas);
    expect(plan.sections.every(s => s.rows.length <= 2 && s.rows.every(r => r.title !== plan.card.title))).toBe(true);
  });
  it("fatigue trois jours avant reprise et besoin de parler", () => {
    expect(supportPlan({ ...base, besoins: ["P"], flags: ["fatigue3", "travail"] }).card.to).toBe("/help/corps/dormir");
  });
  it("danger avant fatigue", () => {
    expect(supportPlan({ ...base, flags: ["danger", "fatigue3"] }).card.to).toBe("tel:3114");
  });
  it("point mensuel à partir du jour 30", () => {
    expect(supportPlan({ ...base, days: "29" }).monthly).toBe(false);
    expect(supportPlan({ ...base, days: "30" }).monthly).toBe(true);
  });
  it("fatigue sur trois jours calendaires consécutifs", () => {
    const history = ["2026-10-20", "2026-10-21", "2026-10-22"].map(day => ({ day, values: ["Fatigue"] }));
    expect(fatigueThreeDays(history, new Date(2026, 9, 22))).toBe(true);
    expect(fatigueThreeDays(history.slice(1), new Date(2026, 9, 22))).toBe(false);
  });
});