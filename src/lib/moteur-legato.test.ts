import { describe, expect, it } from "vitest";
import scenarios from "./ajouts5/scenarios-test.json";
import { moteurLegato } from "./moteur-legato";
const normalize = (s: string) => s.replace(/’/g, "'");
describe("Moteur Legato — 14 situations complètes de référence", () => {
  for (const scenario of scenarios.scenarios) it(scenario.scenario, () => {
    const result = moteurLegato(scenario.reponses);
    const expected = scenario.attendu;
    expect(normalize(result.titreDuJour)).toBe(normalize(expected.aujourdhui.titre));
    expect(normalize(result.carteAujourdhui.title)).toBe(normalize(expected.aujourdhui.carte));
    if (expected.aujourdhui.etiquette) expect(normalize(result.carteAujourdhui.label ?? "")).toBe(normalize(expected.aujourdhui.etiquette));
    expect(result.ensuite.map(a => normalize(a.title))).toEqual(expected.aujourdhui.ensuite.map(normalize));
    expect(result.aujourdhui.blocked).toBe(expected.aujourdhui.je_suis_bloque);
    expect(normalize(result.carteSoutien.title)).toBe(normalize(expected.soutien.carte_du_haut));
    expect(result.rubriquesSoutien.map(s => s.title)).toEqual(expected.soutien.rubriques);
    expect(result.soutien.monthly).toBe(expected.soutien.point_du_mois_en_bas);
    expect(normalize(result.carteEnPremier.title)).toBe(normalize(expected.demarches.en_premier));
    expect(result.periode).toBe(result.soutien.phase);
    expect(result.ensuite.length).toBeLessThanOrEqual(2);
  });
  it("limites de période : 15 jours, 90 jours ; R reste en période 2 après 90 jours", () => {
    const input = { days: "14", papiers: "Q", comment: "", besoins: [], emos: [], flags: [] };
    expect(moteurLegato(input).periode).toBe(1);
    expect(moteurLegato({ ...input, days: "15" }).periode).toBe(2);
    expect(moteurLegato({ ...input, days: "90" }).periode).toBe(2);
    expect(moteurLegato({ ...input, days: "91" }).periode).toBe(3);
    expect(moteurLegato({ ...input, days: "120", papiers: "R" }).periode).toBe(2);
    expect(moteurLegato({ ...input, days: "15", papiers: "R" }).aujourdhui.confirmFuneral).toBe(true);
  });
  it("danger avant nuit, émotions et démarches : le 3114 est appelable", () => {
    const result = moteurLegato({ days: "3", papiers: "R", comment: "S", besoins: ["D"], emos: ["Sidéré"], flags: ["nuit", "danger"] });
    expect(result.carteAujourdhui.to).toBe("tel:3114");
    expect(result.carteSoutien.to).toBe("tel:3114");
    expect(result.aujourdhui.night).toBe(false);
  });
});