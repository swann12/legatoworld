import { describe, expect, it } from "vitest";
import { seedIfEmpty } from "./spaces-store";
import { emotionIds, writeDailyEmotions } from "./daily-emotions";

describe("Le parcours reste celui choisi après les émotions", () => {
  for (const [who, kind] of [["personne", "deuil"], ["animal", "animal"], ["malade", "malade"], ["moi", "questions"]]) {
    it(`conserve le parcours ${who}`, () => {
      const values = new Map<string, string>();
      const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
      const previous = globalThis.window;
      Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: storage, dispatchEvent: () => true } });
      try {
        storage.setItem("lg.onb.forWhom", JSON.stringify(who));
        storage.setItem("lg.lovedLabel", JSON.stringify("Ulysse"));
        storage.setItem("lg.onb.animalBody", JSON.stringify("choisir"));
        storage.setItem("lg.onb.careState", JSON.stringify("maison"));
        const [space] = seedIfEmpty();
        expect(space.kind).toBe(kind);
        if (kind === "animal") expect(space.animalBodyState).toBe("choisir");
        if (kind === "malade") expect(space.careState).toBe("maison");
        const before = storage.getItem("legato.spaces.v1");
        storage.setItem("legato.activeSpace.v1", space.id);
        writeDailyEmotions(storage, `day::${space.id}`, `history::${space.id}`, ["Tristesse", "Fatigue"], new Date(2026, 9, 22));
        expect(storage.getItem("legato.spaces.v1")).toBe(before);
        expect(storage.getItem("legato.activeSpace.v1")).toBe(space.id);
        expect(emotionIds(["Tristesse", "Fatigue"])).toEqual(["fatigue", "tristesse"]);
      } finally { Object.defineProperty(globalThis, "window", { configurable: true, value: previous }); }
    });
  }
});