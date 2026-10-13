import { describe, expect, test } from "vitest";
import { canonicalZone, memoriesInZone, newestMemories } from "./memory-garden";
import type { Memory } from "./memories-store";
const memories: Memory[] = [
  { id: "a", zone: "photos", type: "photo", createdAt: 1 },
  { id: "b", zone: "photo", type: "photo", createdAt: 3 },
  { id: "c", zone: "citation", type: "sentence", createdAt: 2 },
  { id: "d", zone: "lieu", type: "text", createdAt: 4 },
];
describe("Mémoire", () => {
  test("photos conserve les anciennes et nouvelles catégories", () => { expect(canonicalZone("photos")).toBe("photo"); expect(memoriesInZone(memories, "photos").map(m => m.id)).toEqual(["b", "a"]); });
  test("lettres conserve les citations sans mélanger les lieux", () => { expect(memoriesInZone(memories, "lettres").map(m => m.id)).toEqual(["c"]); expect(memoriesInZone(memories, "lieux").map(m => m.id)).toEqual(["d"]); });
  test("tous les souvenirs vont du plus récent au plus ancien sans modifier la source", () => { expect(newestMemories(memories).map(m => m.id)).toEqual(["d", "b", "c", "a"]); expect(memories[0].id).toBe("a"); });
});