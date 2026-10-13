import { expect, test } from "bun:test";
import { dayKey, gentleNote, weekDays } from "./corps-suivi";

const ref = new Date(2026, 9, 14); // mercredi
test("la semaine va du lundi au dimanche", () => {
  const w = weekDays(ref);
  expect(dayKey(w[0])).toBe("2026-10-12");
  expect(dayKey(w[6])).toBe("2026-10-18");
});
test("deux sorties de plus que la semaine dernière", () => {
  const s = { "2026-10-06": { sorti: true }, "2026-10-12": { sorti: true }, "2026-10-13": { sorti: true }, "2026-10-14": { sorti: true } };
  expect(gentleNote(s, ref)).toBe("Vous êtes sorti deux fois de plus que la semaine dernière.");
});
test("aucune phrase quand rien ne va mieux", () => {
  expect(gentleNote({ "2026-10-06": { sorti: true } }, ref)).toBeNull();
});
