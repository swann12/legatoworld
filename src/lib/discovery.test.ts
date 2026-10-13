import { describe, expect, test } from "bun:test";
import { collectDiscoveryContent, isDiscoveryContentKey } from "./discovery";
describe("Reprise de découverte", () => {
  test("reprend réponses, journal, souvenirs et préférences", () => {
    const entries = new Map([["lg.forWhom", "animal"], ["legato.journal.v1", "lettre"], ["legato.memories.v1::anne", "photo"], ["legato.space-prefs", "nuit"], ["sb-app-auth-token", "secret"], ["legato.discovery.v1", "active"]]);
    const keys = [...entries.keys()];
    const result = collectDiscoveryContent({ length: keys.length, key: i => keys[i] ?? null, getItem: k => entries.get(k) ?? null });
    expect(result).toEqual({ "lg.forWhom": "animal", "legato.journal.v1": "lettre", "legato.memories.v1::anne": "photo", "legato.space-prefs": "nuit" });
  });
  test("ne transfère aucun identifiant de connexion", () => {
    for (const key of ["sb-app-auth-token", "legato.auth", "lg.session", "legato.token", "foreign-key"]) expect(isDiscoveryContentKey(key)).toBe(false);
  });
});