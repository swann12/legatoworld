import { describe, expect, test } from "bun:test";
import { collectDiscoveryContent, isDiscoveryContentKey, discoveryAllowsFunction, clearDiscoveryContent, clearDiscoveryAnswers, discoveryResumeTarget } from "./discovery";
describe("Reprise de découverte", () => {
  const storageOf = (entries: Map<string, string>) => ({ get length() { return entries.size; }, key: (i: number) => [...entries.keys()][i] ?? null, getItem: (k: string) => entries.get(k) ?? null, removeItem: (k: string) => { entries.delete(k); } });
  test("Recommencer efface les réponses et contenus de découverte sans toucher à la connexion", () => {
    const entries = new Map([["lg.onb.forWhom", "animal"], ["legato.memories.v1::anne", "photo"], ["lg.lovedOneName", "Anne"], ["sb-app-auth-token", "secret"], ["foreign-key", "other"]]);
    clearDiscoveryContent(storageOf(entries));
    expect([...entries.keys()]).toEqual(["sb-app-auth-token", "foreign-key"]);
  });
  test("une nouvelle découverte n'a aucune réponse présélectionnée", () => {
    const entries = new Map([["lg.onb.forWhom", "animal"], ["lg.onb.needs", "memoire"], ["lg.lovedOneName", "Anne"], ["legato.spaces.v1", "existing"]]);
    clearDiscoveryAnswers(storageOf(entries));
    expect([...entries.keys()]).toEqual(["legato.spaces.v1"]);
  });
  test("Reprendre revient à l'étape sauvegardée sans modifier les réponses", () => {
    const state = { active: true, pending: false, resumeTo: "/onboarding?etape=prenom" };
    expect(discoveryResumeTarget(state)).toBe("/onboarding?etape=prenom");
    expect(state.resumeTo).toBe("/onboarding?etape=prenom");
  });
  test("une ancienne découverte terminée reprend sur Aujourd'hui et refuse une adresse externe", () => {
    expect(discoveryResumeTarget({ active: true, pending: false }, true)).toBe("/home");
    expect(discoveryResumeTarget({ active: true, pending: false, resumeTo: "//external.example" })).toBe("/onboarding");
  });
  test("reprend réponses, journal, souvenirs et préférences", () => {
    const entries = new Map([["lg.forWhom", "animal"], ["legato.journal.v1", "lettre"], ["legato.memories.v1::anne", "photo"], ["legato.space-prefs", "nuit"], ["sb-app-auth-token", "secret"], ["legato.discovery.v1", "active"]]);
    const keys = [...entries.keys()];
    const result = collectDiscoveryContent({ length: keys.length, key: i => keys[i] ?? null, getItem: k => entries.get(k) ?? null });
    expect(result).toEqual({ "lg.forWhom": "animal", "legato.journal.v1": "lettre", "legato.memories.v1::anne": "photo", "legato.space-prefs": "nuit" });
  });
  test("ne transfère aucun identifiant de connexion", () => {
    for (const key of ["sb-app-auth-token", "legato.auth", "lg.session", "legato.token", "foreign-key"]) expect(isDiscoveryContentKey(key)).toBe(false);
  });
  test("ne permet aucun envoi en découverte", () => {
    for (const path of ["/home", "/presence", "/auth", "/care/emotions"]) expect(discoveryAllowsFunction({ active: true, pending: false }, path)).toBe(false);
  });
  test("une conversion en attente ne permet pas les appels depuis les pages de découverte", () => {
    expect(discoveryAllowsFunction({ active: true, pending: true }, "/presence")).toBe(false);
    expect(discoveryAllowsFunction({ active: true, pending: true }, "/auth")).toBe(true);
  });
});