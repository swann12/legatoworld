/**
 * Évite les "veuves" : si le dernier mot d'une chaîne fait 4 caractères ou
 * moins (en ignorant la ponctuation finale), remplace l'espace qui le précède
 * par un espace insécable. Préserve le balisage existant.
 */
export function noOrphan(input: string): string {
  if (!input) return input;
  // 1) Liaison du dernier espace si le dernier mot est court (≤5 lettres).
  let out = input.replace(/ (\S{1,5})([.,;:!?»\)\]\u2026]*)$/u, "\u00A0$1$2");
  // 2) Liaison des espaces autour des mots de liaison courants (insécables typographiques).
  out = out.replace(/ (à|au|aux|de|des|du|en|et|la|le|les|ne|ou|par|pour|que|qui|sa|se|si|son|sur|ta|te|un|une|y) /giu, "\u00A0$1 ");
  // 3) Espace insécable avant les ponctuations doubles françaises.
  out = out.replace(/ ([;:!?»])/g, "\u00A0$1");
  return out;
}
