/**
 * Évite les "veuves" : si le dernier mot d'une chaîne fait 4 caractères ou
 * moins (en ignorant la ponctuation finale), remplace l'espace qui le précède
 * par un espace insécable. Préserve le balisage existant.
 */
export function noOrphan(input: string): string {
  if (!input) return input;
  // capture le dernier espace suivi d'un mot court + ponctuation optionnelle
  return input.replace(/ (\S{1,4})([.,;:!?»\)\]\u2026]*)$/u, "\u00A0$1$2");
}
