import { describe, expect, test } from "bun:test";
import { planSections, showsCeremony, viewFor } from "./papers-plan";

const none = () => false;
const ids = (s: ReturnType<typeof planSections>) => s.flatMap((x) => x.rows.map((r) => r.id));

describe("Démarches selon la réponse", () => {
  test("rien n'est commencé : pompes funèbres et cérémonie en premier", () => {
    expect(ids(planSections("rien", none)).slice(0, 2)).toEqual(["obseques", "ceremonie"]);
  });
  test("la cérémonie n'apparaît que si rien n'est commencé", () => {
    expect(showsCeremony("rien")).toBe(true);
    for (const s of ["obseques", "presque", "delegue", null] as const) {
      expect(showsCeremony(s)).toBe(false);
      expect(ids(planSections(s, none))).not.toContain("ceremonie");
    }
  });
  test("obsèques passées : acte de décès et banque en premier", () => {
    expect(ids(planSections("obseques", none)).slice(0, 2)).toEqual(["acte-deces", "banque"]);
  });
  test("presque tout est fait : il reste la succession et les contrats", () => {
    expect(ids(planSections("presque", none))).toEqual(["notaire", "logement"]);
  });
  test("quelqu'un s'en occupe : aucune démarche affichée", () => {
    expect(viewFor("delegue")).toBe("confie");
    expect(planSections("delegue", none)).toEqual([]);
  });
});
