import { useEffect, useState } from "react";

/* Mon coffre pour mes proches (D109–D118, §9).
   Gardé sur ce téléphone, comme le reste de l'espace « je pense à la mort ».
   Règles : chacun ne reçoit que ce qui lui est destiné ; sept jours de sécurité
   après la vérification de l'acte de décès ; jamais de mot de passe. */

export type CoffreKind = "testament" | "directives" | "contrat" | "comptes" | "codes" | "autre";
export type CoffreDoc = {
  id: string; kind: CoffreKind; title: string; fileName?: string; pages?: number; at: string;
  /** Pour les « codes » : l'endroit, jamais les codes. */
  where?: string;
  recipients: string[]; readNow: string[]; remind: boolean;
};
export type Recipient = { id: string; name: string; link: string; requester?: boolean };
export type CoffreData = { docs: CoffreDoc[]; recipients: Recipient[]; hospital: boolean; stoppedAt?: string };
export type ReceivedRequest = { personName: string; fileName: string; sentAt: string; verifiedAt?: string; stoppedAt?: string };

export const KINDS: { kind: CoffreKind; title: string; sub: string; docTitle: string }[] = [
  { kind: "testament", title: "Copie de mon testament", sub: "l'original reste chez vous ou chez le notaire", docTitle: "Copie de mon testament" },
  { kind: "directives", title: "Mes directives anticipées", sub: "pour la fin de vie", docTitle: "Mes directives anticipées" },
  { kind: "contrat", title: "Un contrat", sub: "obsèques, assurance-vie, prévoyance", docTitle: "Mon contrat obsèques" },
  { kind: "comptes", title: "La liste de mes comptes", sub: "banques, épargne, crédits", docTitle: "La liste de mes comptes" },
  { kind: "codes", title: "Où trouver mes codes", sub: "l'endroit, jamais les codes", docTitle: "Où trouver mes codes" },
  { kind: "autre", title: "Un autre document", sub: "une photo ou un fichier", docTitle: "Un autre document" },
];
export const kindOf = (k: string) => KINDS.find((x) => x.kind === k);

export const SECURITY_DAYS = 7;

/** Fin du délai de sécurité : sept jours après la vérification de l'acte. */
export function transmissionDate(verifiedAt: string): string {
  const d = new Date(verifiedAt);
  d.setDate(d.getDate() + SECURITY_DAYS);
  return d.toISOString();
}

/** Ce qu'une personne reçoit. Décès : seulement ses documents. Hospitalisation : seulement
    les directives anticipées, et seulement pour la personne de confiance. */
export function docsFor(recipientId: string, docs: CoffreDoc[], reason: "deces" | "hospitalisation", confianceId?: string): CoffreDoc[] {
  const mine = docs.filter((d) => d.recipients.includes(recipientId));
  if (reason === "deces") return mine;
  return recipientId === confianceId ? mine.filter((d) => d.kind === "directives") : [];
}

/** Étape d'une demande vue par le proche. */
export function requestStage(r: ReceivedRequest | null, now = new Date()): "aucune" | "verification" | "delai" | "transmis" | "arretee" {
  if (!r) return "aucune";
  if (r.stoppedAt) return "arretee";
  if (!r.verifiedAt) return "verification";
  return now >= new Date(transmissionDate(r.verifiedAt)) ? "transmis" : "delai";
}

/** Legato ne garde jamais de mot de passe : refuse un texte qui en contient un. */
export function looksLikeSecret(text: string): boolean {
  const t = text.toLowerCase();
  if (/(mot de passe|mdp|password|code pin|pin|code)\s*[:=]\s*\S+/.test(t)) return true;
  // Une suite de chiffres de 4 à 8 seule, typique d'un code.
  if (/(^|\s)\d{4,8}(\s|$)/.test(t)) return true;
  return false;
}

const KEY = "legato.coffre.v1";
const KEY_RECU = "legato.coffre-recu.v1";
const EMPTY: CoffreData = { docs: [], recipients: [], hospital: true };
const listeners = new Set<() => void>();

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? { ...fallback, ...JSON.parse(v) } : fallback; } catch { return fallback; }
}
export const getCoffre = () => read<CoffreData>(KEY, EMPTY);
export function updateCoffre(fn: (c: CoffreData) => Partial<CoffreData>) {
  const c = getCoffre();
  localStorage.setItem(KEY, JSON.stringify({ ...c, ...fn(c) }));
  listeners.forEach((l) => l());
}
export const getReceived = (): ReceivedRequest | null => {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(KEY_RECU); return v ? JSON.parse(v) : null; } catch { return null; }
};
export function setReceived(r: ReceivedRequest | null) {
  if (r) localStorage.setItem(KEY_RECU, JSON.stringify(r)); else localStorage.removeItem(KEY_RECU);
  listeners.forEach((l) => l());
}

export function useCoffre() {
  const [s, set] = useState<{ c: CoffreData; r: ReceivedRequest | null }>({ c: EMPTY, r: null });
  useEffect(() => {
    const l = () => set({ c: getCoffre(), r: getReceived() });
    l(); listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return s;
}

export const newId = () => Math.random().toString(36).slice(2, 10);
export const frDay = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
export function namesFor(doc: CoffreDoc, recipients: Recipient[]) {
  const n = doc.recipients.map((id) => recipients.find((r) => r.id === id)?.name.split(",")[0]).filter(Boolean) as string[];
  return n.length ? `pour ${n.length > 1 ? `${n.slice(0, -1).join(", ")} et ${n[n.length - 1]}` : n[0]}` : "pour personne encore";
}
