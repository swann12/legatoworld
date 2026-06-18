import { useLegato } from "./legato-state";

/** Retourne le nom du proche, sinon le lien (« ton père »), sinon « la personne ». */
export function useLovedName(): string {
  const { lovedOneName, lovedOneRelation, hydrated } = useLegato();
  // Stable côté SSR / avant hydratation — évite les mismatches.
  if (!hydrated) return "ton ou ta proche";
  if (lovedOneName && lovedOneName.trim()) return lovedOneName.trim();
  switch (lovedOneRelation) {
    case "pere":     return "ton père";
    case "mere":     return "ta mère";
    case "conjoint": return "ton ou ta conjoint·e";
    case "enfant":   return "ton enfant";
    case "frere_soeur": return "ton frère ou ta sœur";
    case "grand_parent": return "ton grand-parent";
    case "ami":      return "ton amie ou ton ami";
    case "collegue": return "ton collègue";
    case "animal":   return "ton compagnon";
    case "autre":    return "ton ou ta proche";
    default:         return "ton ou ta proche";
  }
}

/** Variante possessive courte pour titres : « pour Marie » ou « pour ton père ». */
export function useLovedFor(): string {
  return `pour ${useLovedName()}`;
}