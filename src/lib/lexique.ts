import data from "./lexique.json";

export type MotLexique = { mot: string; definition: string };

const mots = (data as { mots: MotLexique[] }).mots;

/** Lexique unique (ajouts-4 §3) : utilisé par « Le mot expliqué » et par Présence. */
export function findWord(mot: string): MotLexique | undefined {
  const wanted = mot.trim().toLowerCase();
  return mots.find((m) => m.mot.toLowerCase() === wanted);
}

export function allWords(): MotLexique[] {
  return mots;
}
