import { useLegato } from "./legato-state";

/** Retourne le nom du proche, sinon le lien (« ton père »), sinon « la personne ». */
export function useLovedName(): string {
  const { lovedOneName, lovedOneRelation } = useLegato();
  if (lovedOneName && lovedOneName.trim()) return lovedOneName.trim();
  switch (lovedOneRelation) {
    case "parent":   return "ton parent";
    case "conjoint": return "ton ou ta conjoint·e";
    case "enfant":   return "ton enfant";
    case "ami":      return "ton ami·e";
    case "animal":   return "ton compagnon";
    case "autre":    return "ton ou ta proche";
    default:         return "ton ou ta proche";
  }
}

/** Variante possessive courte pour titres : « pour Marie » ou « pour ton père ». */
export function useLovedFor(): string {
  return `pour ${useLovedName()}`;
}