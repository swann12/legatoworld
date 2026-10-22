import { describe, expect, it } from "vitest";
import { emotionChoices, readDailyEmotions, writeDailyEmotions } from "./daily-emotions";
describe("Les émotions quotidiennes E002", () => {
  const storage = () => { const values = new Map<string, string>(); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } }; };
  it("offre exactement les 14 émotions, dont Je ne réalise pas et Autre", () => {
    expect(emotionChoices).toEqual(["Sidéré", "Je ne réalise pas", "Angoisse", "Peur", "Fatigue", "Vide", "Seul", "Colère", "Culpabilité", "Tristesse", "Manque", "Apaisé", "Soulagé", "Autre"]);
  });
  it("conserve plusieurs réponses aujourd’hui, pas le lendemain", () => {
    const s = storage(), today = new Date(2026, 9, 22, 12);
    writeDailyEmotions(s, "day", "history", ["Angoisse", "Fatigue", "Autre"], today);
    expect(readDailyEmotions(s, "day", today)).toEqual(["Angoisse", "Fatigue", "Autre"]);
    expect(readDailyEmotions(s, "day", new Date(2026, 9, 23, 12))).toEqual([]);
  });
  it("une modification remplace la journée et n’efface pas les autres espaces", () => {
    const s = storage(), today = new Date(2026, 9, 22, 12);
    writeDailyEmotions(s, "day::anne", "history::anne", ["Fatigue"], today);
    writeDailyEmotions(s, "day::anne", "history::anne", ["Je ne réalise pas", "Sidéré"], today);
    writeDailyEmotions(s, "day::paul", "history::paul", ["Apaisé"], today);
    expect(readDailyEmotions(s, "day::anne", today)).toEqual(["Sidéré", "Je ne réalise pas"]);
    expect(JSON.parse(s.getItem("history::anne") ?? "[]")).toHaveLength(1);
    expect(readDailyEmotions(s, "day::paul", today)).toEqual(["Apaisé"]);
  });
});