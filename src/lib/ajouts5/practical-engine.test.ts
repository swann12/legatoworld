import { describe, it, expect } from "vitest";
import scenarios from "./scenarios-test.json";
import { practicalPlan } from "./practical-engine";
describe("Démarches Ajouts-5", () => {
  for (const [i, s] of scenarios.scenarios.entries()) it(`réponse ${i + 1}`, () => {
    expect(practicalPlan(s.reponses).card.title.replace(/’/g, "'")).toBe(s.attendu.demarches.en_premier.replace(/’/g, "'"));
  });
  it("rien commencé : cérémonie puis proches", () => {
    expect(practicalPlan({ days: "3", papiers: "R", comment: "", besoins: [], emos: [], flags: [] }).next.map(r => r.to)).toEqual(["/practical/ceremony", "/practical/prevenir"]);
  });
  it("papiers confiés : aucune liste imposée", () => {
    expect(practicalPlan({ days: "21", papiers: "Q", comment: "", besoins: [], emos: [], flags: [] }).next).toEqual([]);
  });
});