import { LIBRARY, type LibKind } from "./library-data";

export const PRECISIONS = ["Court", "Qui fait du bien", "Pour un enfant", "En anglais"] as const;
export type Precision = typeof PRECISIONS[number];
export type LibraryProposal = { id: string; why: string };

/** Sélection locale : aucune phrase de visiteur ne quitte l'appareil. */
export function localLibrarySuggestions(query: string, precisions: readonly Precision[], kind: LibKind): LibraryProposal[] {
  const text = query.toLocaleLowerCase("fr");
  if (precisions.includes("Pour un enfant")) return [{ id: "coco", why: "Pour ouvrir une conversation en famille, en accompagnant l'enfant." }];
  if (precisions.includes("En anglais")) return [{ id: "griefcast", why: "Des voix en anglais qui laissent une place à l'humour." }];
  const selectedKind = /film|série|documentaire/.test(text) ? "voir" : /livre|lire/.test(text) ? "lire" : /podcast|musique|écouter/.test(text) ? "ecouter" : kind;
  let ids = selectedKind === "voir" ? ["still-walking", "ghost-story"] : selectedKind === "lire" ? ["pensee-magique", "journal-de-deuil"] : ["pieds-sur-terre", "requiem-faure"];
  if (/série/.test(text)) ids = ["six-feet-under"];
  if (/documentaire/.test(text)) ids = ["dick-johnson"];
  if (precisions.includes("Court")) ids = selectedKind === "voir" ? ["ghost-story"] : ["journal-de-deuil", "pieds-sur-terre"];
  if (precisions.includes("Qui fait du bien")) ids = selectedKind === "voir" ? ["departures", "coco"] : selectedKind === "lire" ? ["vivre-avec-nos-morts"] : ["requiem-faure"];
  return ids.flatMap((id) => {
    const item = LIBRARY.find((entry) => entry.id === id);
    return item ? [{ id, why: item.caption ?? item.summary }] : [];
  });
}