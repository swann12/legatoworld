/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { ceremonyDecisions, EMPTY_CEREMONY_PLAN, flowerChoicesText } from "./ceremony-flow";
import { loadPractical } from "./practical-store";

describe("Cérémonie", () => {
  test("les cinq décisions dépendent des choix réels, pas de la maquette", () => {
    const s = { ...loadPractical(), ceremonyPlan: { ...EMPTY_CEREMONY_PLAN } };
    expect(ceremonyDecisions(s)).toEqual([false, false, false, false, false]);
    s.ceremonyPlan.providerId = "pf-prado";
    s.ceremonyKind = "cremation";
    expect(ceremonyDecisions(s)).toEqual([true, true, false, false, false]);
    s.ceremonyVenue = "Marseille";
    s.ceremonyPlan.date = "2026-10-16";
    s.ceremonyPlan.flowersChosen = true;
    s.ceremonyPlan.relativesNotified = true;
    expect(ceremonyDecisions(s)).toEqual([true, true, true, true, true]);
  });
  test("les réponses aux questions sont transmises à l’IA", () => {
    expect(flowerChoicesText({ colors: "blanc", univers: "jardin", esprit: "cercueil" })).toContain("Blanc et vert");
    expect(flowerChoicesText({ colors: "blanc", univers: "jardin", esprit: "cercueil" })).toContain("Devant le cercueil");
  });
});