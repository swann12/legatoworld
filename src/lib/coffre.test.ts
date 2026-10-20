import { describe, expect, it } from "vitest";
import { docsFor, looksLikeSecret, requestStage, transmissionDate, type CoffreDoc } from "./coffre";

const doc = (id: string, kind: CoffreDoc["kind"], recipients: string[]): CoffreDoc => ({ id, kind, title: id, at: "", recipients, readNow: [], remind: false });
const docs = [doc("t", "testament", ["claire"]), doc("d", "directives", ["claire", "morel"]), doc("c", "comptes", ["claire"])];

describe("coffre §9", () => {
  it("chacun ne reçoit que ce qui lui est destiné", () => {
    expect(docsFor("morel", docs, "deces").map((d) => d.id)).toEqual(["d"]);
    expect(docsFor("claire", docs, "deces")).toHaveLength(3);
  });
  it("hospitalisation : seulement les directives, seulement à la personne de confiance", () => {
    expect(docsFor("claire", docs, "hospitalisation", "claire").map((d) => d.id)).toEqual(["d"]);
    expect(docsFor("morel", docs, "hospitalisation", "claire")).toEqual([]);
  });
  it("sept jours de sécurité après la vérification", () => {
    expect(transmissionDate("2026-10-18T12:00:00.000Z").slice(0, 10)).toBe("2026-10-25");
    const r = { personName: "Anne", fileName: "acte.pdf", sentAt: "2026-10-18T10:00:00Z", verifiedAt: "2026-10-18T12:00:00Z" };
    expect(requestStage(r, new Date("2026-10-24T12:00:00Z"))).toBe("delai");
    expect(requestStage(r, new Date("2026-10-25T12:00:00Z"))).toBe("transmis");
  });
  it("rien sans vérification, et un arrêt bloque tout", () => {
    expect(requestStage({ personName: "Anne", fileName: "a", sentAt: "2026-10-01" }, new Date("2027-01-01"))).toBe("verification");
    expect(requestStage({ personName: "Anne", fileName: "a", sentAt: "2026-10-01", verifiedAt: "2026-10-01", stoppedAt: "2026-10-02" }, new Date("2027-01-01"))).toBe("arretee");
  });
  it("jamais de mot de passe", () => {
    expect(looksLikeSecret("mot de passe : Soleil42")).toBe(true);
    expect(looksLikeSecret("code 4821")).toBe(true);
    expect(looksLikeSecret("dans le tiroir du bureau")).toBe(false);
  });
});
