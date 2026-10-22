import { describe, expect, it } from "vitest";
import { getDeathCircumstance, setDeathCircumstance } from "./onboarding-flow";
describe("E001 — Comment est-ce arrivé ?", () => {
  it("conserve Soudainement et Après une maladie ; passer reste vide", () => {
    const map = new Map<string, string>();
    const previous = globalThis.window;
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => map.set(key, value), removeItem: (key: string) => map.delete(key) } } });
    try {
      expect(getDeathCircumstance()).toBe("");
      setDeathCircumstance("S"); expect(getDeathCircumstance()).toBe("S");
      setDeathCircumstance("M"); expect(getDeathCircumstance()).toBe("M");
      setDeathCircumstance(""); expect(getDeathCircumstance()).toBe("");
    } finally { Object.defineProperty(globalThis, "window", { configurable: true, value: previous }); }
  });
});