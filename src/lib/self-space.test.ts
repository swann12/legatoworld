import { describe, it, expect } from "vitest";
import { momentNext, readyCount, prepareSummary, nextThursday, LIFE_QUESTIONS, type SelfData } from "./self-space";

const base: SelfData = { ready: [], histoire: [], lettres: [], objets: [] };

describe("espace « je pense beaucoup à la mort »", () => {
  it("l'envie de ne plus être là ouvre immédiatement l'écran 3114", () => {
    expect(momentNext("envie")).toBe("/home/penser-a-mourir");
    expect(momentNext("angoisse")).toBe("/onboarding?etape=pret");
  });
  it("compte six éléments à préparer, obsèques et confiance remplis", () => {
    const d = { ...base, obseques: { choix: "Crémation", ceremonie: "", musique: "", cendres: "", quiConnait: "", date: "2026-10-02" }, confiance: { name: "Claire" } };
    expect(readyCount(d)).toBe(2);
    expect(prepareSummary(d)).toBe("2 sur 6 · votre personne de confiance est choisie");
  });
  it("raconter sa vie compte douze questions, la troisième sur le premier souvenir", () => {
    expect(LIFE_QUESTIONS).toHaveLength(12);
    expect(LIFE_QUESTIONS[2]).toBe("Quel est votre premier souvenir ?");
  });
  it("le café mortel a lieu le jeudi suivant à 19 h", () => {
    const d = nextThursday(new Date(2026, 9, 13, 11, 0));
    expect([d.getDate(), d.getDay(), d.getHours()]).toEqual([15, 4, 19]);
  });
});
