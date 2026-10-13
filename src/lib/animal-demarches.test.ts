import { expect, test } from "bun:test";
import { ANIMAL_TASKS, animalTaskDone } from "./animal-demarches";

test("quatre démarches : une pour son corps, trois papiers", () => {
  expect(ANIMAL_TASKS.map((t) => t.section)).toEqual(["corps", "papiers", "papiers", "papiers"]);
});
test("encore chez le vétérinaire : son corps reste à faire", () => {
  expect(animalTaskDone("animal-body", undefined, "choisir")).toBe(false);
});
test("tout est fait : son corps est coché, pas les papiers", () => {
  expect(animalTaskDone("animal-body", undefined, "fait")).toBe(true);
  expect(animalTaskDone("animal-id", undefined, "fait")).toBe(false);
});
test("un statut enregistré l'emporte sur la réponse", () => {
  expect(animalTaskDone("animal-body", "todo", "fait")).toBe(false);
});
