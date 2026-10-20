import { describe, expect, it } from "vitest";
import { FAMILIES, SITUATIONS, TITRES, targetFor, suggestSituations } from "./je-suis-bloque";

describe("je suis bloqué", () => {
  it("chaque bouton des données mène quelque part", () => {
    for (const s of SITUATIONS) {
      for (const e of s.etapes) if (e.action) expect(targetFor(s, e.action), `${s.id} · ${e.action.libelle}`).not.toBeNull();
      if (s.bouton_principal) expect(targetFor(s, s.bouton_principal), s.id).not.toBeNull();
    }
  });
  it("chaque situation a son titre exact et sa famille", () => {
    const rows = FAMILIES.flatMap((f) => f.rows.map((r) => r.to));
    for (const s of SITUATIONS) { expect(TITRES[s.id]).toHaveLength(2); expect(rows).toContain(s.id); }
  });
  it("le 15 et le 3114 sont des appels", () => {
    const maison = SITUATIONS.find((s) => s.id === "maison")!;
    expect(targetFor(maison, maison.etapes[0].action!)).toMatchObject({ kind: "call", number: "15" });
    const suicide = SITUATIONS.find((s) => s.id === "suicide")!;
    expect(targetFor(suicide, suicide.etapes[0].action!)).toMatchObject({ kind: "call", number: "3114" });
  });
  it("Présence propose au plus deux pages", () => {
    expect(suggestSituations("Mon mari est à l'hôpital, il ne peut plus parler. Je n'ai pas les codes de son téléphone ni de la banque.")).toEqual(["telephone", "hopital"]);
  });
});
