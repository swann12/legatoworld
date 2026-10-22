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
    expect(result.ensuite.map(a => normalize(a.title))).toEqual(expected.aujourdhui.ensuite.map(normalize));
    expect(result.aujourdhui.blocked).toBe(expected.aujourdhui.je_suis_bloque);
    expect(normalize(result.carteSoutien.title)).toBe(normalize(expected.soutien.carte_du_haut));
    expect(result.rubriquesSoutien.map(s => s.title)).toEqual(expected.soutien.rubriques);
    expect(result.soutien.monthly).toBe(expected.soutien.point_du_mois_en_bas);
    expect(normalize(result.carteEnPremier.title)).toBe(normalize(expected.demarches.en_premier));
    expect(result.periode).toBe(result.soutien.phase);
    expect(result.ensuite.length).toBeLessThanOrEqual(2);
  });
});