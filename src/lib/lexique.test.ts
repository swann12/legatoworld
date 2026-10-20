import { describe, expect, it } from "vitest";
import { allWords, findWord } from "./lexique";

describe("lexique (ajouts-4 §3)", () => {
  it("contient les 37 mots du dossier de données", () => {
    expect(allWords().length).toBe(37);
  });

  it("retrouve un mot sans tenir compte de la casse", () => {
    expect(findWord("succession")?.definition).toContain("partage de ses biens");
    expect(findWord("Succession")).toEqual(findWord("succession"));
  });

  it("donne le délai des obsèques de 14 jours", () => {
    expect(findWord("Obsèques")?.definition).toContain("14 jours");
  });

  it("renvoie undefined pour un mot inconnu", () => {
    expect(findWord("mot inconnu")).toBeUndefined();
  });
});
