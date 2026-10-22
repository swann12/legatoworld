import type { SpaceKind } from "./spaces-store";

export type AnimalBodyState = "choisir" | "organise" | "fait" | "pas_maintenant";
export const MEMORY_ENTRY_PATH = "/care/garden/space";
export const kindForWhom = (who: "personne" | "animal" | "malade" | "moi" | null): SpaceKind =>
  who === "animal" ? "animal" : who === "malade" ? "malade" : who === "moi" ? "questions" : "deuil";

export function spaceTabLabels(kind: SpaceKind) {
  return {
    practical: kind === "malade" ? "Aides" : kind === "questions" ? "Préparer" : "Démarches",
    memory: kind === "malade" ? "Souvenirs" : kind === "questions" ? "Transmettre" : "Mémoire",
  };
}

export const showPracticalTab = (kind: SpaceKind, body?: AnimalBodyState) =>
  kind !== "animal" || (body !== "fait" && body !== "pas_maintenant");