import { describe, expect, it } from "vitest";
import { guide, safetyCheck } from "./presence-guide";

const first = (q: string) => guide(q).cards.map((c) => c.params?.id ?? c.to);

describe("Présence qui guide (04-PRESENCE §7)", () => {
  it("envie de ne plus vivre : 3114 seul, aucune autre carte", () => {
    const g = guide("Je n'ai plus envie de vivre sans lui.");
    expect(g.safety).toBe("3114");
    expect(g.cards).toHaveLength(1);
    expect(g.cards[0].href).toBe("tel:3114");
  });
  it("douleur à la poitrine : 15", () => expect(safetyCheck("J'ai mal à la poitrine depuis ce matin.")).toBe("15"));
  it("banque bloquée : courrier puis b-argent avec source", () => {
    const g = guide("La banque a bloqué ses comptes. Comment je paie les pompes funèbres ?");
    expect(first("La banque a bloqué ses comptes.")).toEqual(["banque", "argent"]);
    expect(g.cards[1].source).toMatch(/L312-1-4/);
    expect(g.fiches.length).toBeGreaterThan(0);
  });
  it("courses : ce qui m'aiderait + manger", () => expect(first("Je n'y arrive plus, je ne fais plus les courses.")).toEqual(["/care/aide", "/help/corps/manger"]));
  it("deux cartes au plus", () => {
    for (const q of ["Je n'arrive plus à dormir", "Mon mari est dans le coma", "Je ne mange plus rien."]) expect(guide(q).cards.length).toBeLessThanOrEqual(2);
  });
  it("codes du téléphone : mots de passe", () => expect(first("Je n'ai pas les codes de son téléphone.")).toEqual(["mots-de-passe"]));
  it("pacs : réversion", () => expect(first("Est-ce que j'ai droit à sa retraite ? Nous étions pacsés.")).toEqual(["reversion"]));
  it("coffre", () => expect(first("Je veux préparer les choses pour mes enfants si je meurs.")).toEqual(["/practical/coffre"]));
  it("aucune carte refusée n'est reproposée", () => expect(guide("Je n'arrive pas à dormir", ["/help/corps/dormir"]).cards.map((c) => c.to)).toEqual(["/care/sons/endormir"]));
});
