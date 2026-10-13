import { describe, expect, it } from "bun:test";
import { kindForWhom, showPracticalTab, spaceTabLabels } from "./space-navigation";

describe("les quatre espaces", () => {
  it("conserve les quatre types choisis", () => {
    expect(["personne", "animal", "malade", "moi"].map(w => kindForWhom(w as "personne" | "animal" | "malade" | "moi"))).toEqual(["deuil", "animal", "malade", "questions"]);
  });
  it("nomme Aides et Souvenirs pour un proche malade", () => {
    expect(spaceTabLabels("malade")).toEqual({ practical: "Aides", memory: "Souvenirs" });
  });
  it("nomme Préparer et Transmettre pour soi", () => {
    expect(spaceTabLabels("questions")).toEqual({ practical: "Préparer", memory: "Transmettre" });
  });
  it("masque Démarches pour l'animal quand tout est fait", () => {
    expect(showPracticalTab("animal", "fait")).toBe(false);
    expect(showPracticalTab("deuil", "fait")).toBe(true);
  });
  it("masque Démarches pour l'animal quand on préfère ne pas y penser", () => {
    expect(showPracticalTab("animal", "pas_maintenant")).toBe(false);
    expect(showPracticalTab("animal", "choisir")).toBe(true);
  });
});