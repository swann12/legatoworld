import { describe, expect, it } from "vitest";
import { localLibrarySuggestions } from "./library-suggestions";
import { LIBRARY } from "./library-data";
describe("suggestions locales de la bibliothèque", () => {
  it("propose un contenu familial pour la précision enfant", () => {
    expect(localLibrarySuggestions("un film", ["Pour un enfant"], "voir").map((p) => p.id)).toEqual(["coco"]);
  });
  it("propose une ressource en anglais pour la précision anglais", () => {
    expect(localLibrarySuggestions("", ["En anglais"], "lire").map((p) => p.id)).toEqual(["griefcast"]);
  });
  it("dispose de films, séries et documentaires dans Voir", () => {
    expect(new Set(LIBRARY.filter((i) => i.kind === "voir").map((i) => i.type))).toEqual(new Set(["Film", "Film d'animation", "Série", "Documentaire"]));
  });
  it("chaque proposition locale ouvre une fiche existante", () => {
    for (const kind of ["lire", "ecouter", "voir"] as const) {
      for (const proposal of localLibrarySuggestions("", [], kind)) expect(LIBRARY.some((i) => i.id === proposal.id)).toBe(true);
    }
  });
});