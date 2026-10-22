import { describe, expect, test } from "bun:test";
import scenarios from "./scenarios-test.json";
import { todayPlan, phaseOf } from "./today-engine";
const normalize = (s: string) => s.replace(/’/g, "'");
describe("Aujourd'hui — les 14 situations de référence", () => {
  for (const scenario of scenarios.scenarios) test(scenario.scenario, () => {
    const result = todayPlan(scenario.reponses);
    const expected = scenario.attendu.aujourdhui;
    expect(normalize(result.title)).toBe(normalize(expected.titre));
    expect(normalize(result.card.title)).toBe(normalize(expected.carte));
    expect(result.next.map(a => normalize(a.title))).toEqual(expected.ensuite.map(normalize));
    expect(result.blocked).toBe(expected.je_suis_bloque);
    expect(result.next.length).toBeLessThanOrEqual(2);
  });
  test("le simulateur bascule à 15 jours et après 90 jours", () => {
    const base = { days: "14", papiers: "", comment: "", besoins: [], emos: [], flags: [] };
    expect(phaseOf(base)).toBe(1);
    expect(phaseOf({ ...base, days: "15" })).toBe(2);
    expect(phaseOf({ ...base, days: "90" })).toBe(2);
    expect(phaseOf({ ...base, days: "91" })).toBe(3);
  });
  test("le danger passe avant la nuit et les obsèques", () => {
    expect(todayPlan({ days: "3", papiers: "R", comment: "", besoins: [], emos: [], flags: ["danger", "nuit"] }).card.title).toBe("Appeler le 3114");
  });
});