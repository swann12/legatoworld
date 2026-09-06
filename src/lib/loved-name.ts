import { useLegato } from "./legato-state";

/** Retourne le nom du proche, sinon le lien (« votre père »), sinon « la personne ». */
export function useLovedName(): string {
  const { lovedOneName, lovedOneRelation, hydrated } = useLegato();
  // Stable côté SSR / avant hydratation — évite les mismatches.
  if (!hydrated) return "votre proche";
  if (lovedOneName && lovedOneName.trim()) return lovedOneName.trim();
  switch (lovedOneRelation) {
    case "pere":     return "votre père";
    case "mere":     return "votre mère";
    case "conjoint": return "votre conjoint·e";
    case "enfant":   return "votre enfant";
    case "frere_soeur": return "votre frère ou votre sœur";
    case "grand_parent": return "votre grand-parent";
    case "ami":      return "votre ami·e";
    case "collegue": return "votre collègue";
    case "animal":   return "votre compagnon";
    case "autre":    return "votre proche";
    default:         return "votre proche";
  }
}

/** Variante possessive courte pour titres : « pour Marie » ou « pour votre père ». */
export function useLovedFor(): string {
  return `pour ${useLovedName()}`;
}