/// <reference types="bun" />
import { expect, test } from "bun:test";
import { CEREMONY_OBJECTS, toggleCeremonyObject } from "./ceremony-objects";

test("cercueil clair : fourchette de la capture 076", () => { expect([CEREMONY_OBJECTS[0]?.min, CEREMONY_OBJECTS[0]?.max]).toEqual([800, 1200]); });
test("cercueil noble : fourchette de la capture 076", () => { expect([CEREMONY_OBJECTS[1]?.min, CEREMONY_OBJECTS[1]?.max]).toEqual([1500, 3000]); });
test("urne : fourchette de la capture 076", () => { expect([CEREMONY_OBJECTS[2]?.min, CEREMONY_OBJECTS[2]?.max]).toEqual([150, 400]); });
test("plaque : fourchette de la capture 076", () => { expect([CEREMONY_OBJECTS[3]?.min, CEREMONY_OBJECTS[3]?.max]).toEqual([200, 600]); });
test("garder puis retirer un objet ne perd pas les autres choix", () => {
  expect(toggleCeremonyObject(["Urne"], "Plaque")).toEqual(["Urne", "Plaque"]);
  expect(toggleCeremonyObject(["Urne", "Plaque"], "Plaque")).toEqual(["Urne"]);
});