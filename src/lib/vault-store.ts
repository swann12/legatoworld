import { useCallback, useEffect, useState } from "react";

/** Mes documents (écran 059) : la liste des papiers rangés, gardée sur l'appareil. */
export type VaultCat = "identite" | "banque" | "logement" | "assurances" | "volontes";
export type VaultDoc = { id: string; cat: VaultCat; name: string; at: string };

export const VAULT_CATS: { id: VaultCat; label: string }[] = [
  { id: "identite", label: "Identité et état civil" },
  { id: "banque", label: "Banque" },
  { id: "logement", label: "Logement" },
  { id: "assurances", label: "Assurances" },
  { id: "volontes", label: "Volontés" },
];

/** Documents attendus, par ordre d'importance. */
export const EXPECTED = [
  { key: "acte-deces", cat: "identite" as VaultCat, name: "Acte de décès", short: "l'acte de décès", title: "L'acte de décès", why: "La banque et le notaire vous le demanderont." },
  { key: "livret", cat: "identite" as VaultCat, name: "Livret de famille", short: "le livret de famille", title: "Le livret de famille", why: "La mairie et le notaire vous le demanderont." },
];

const SEED: VaultDoc[] = [
  { id: "s1", cat: "identite", name: "Carte d'identité", at: "" },
  { id: "s2", cat: "identite", name: "Livret de famille", at: "" },
  { id: "s3", cat: "identite", name: "Certificat médical de décès", at: "" },
  { id: "s4", cat: "banque", name: "Relevé d'identité bancaire", at: "" },
  { id: "s5", cat: "banque", name: "Dernier relevé de compte", at: "" },
  { id: "s6", cat: "logement", name: "Bail du logement", at: "" },
  { id: "s7", cat: "assurances", name: "Contrat habitation", at: "" },
  { id: "s8", cat: "assurances", name: "Carte de mutuelle", at: "" },
  { id: "s9", cat: "volontes", name: "Contrat obsèques", at: "" },
];

const KEY = "legato.vault.v1";
function load(): VaultDoc[] {
  if (typeof window === "undefined") return SEED;
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : SEED; } catch { return SEED; }
}

export function useVault() {
  const [docs, setDocs] = useState<VaultDoc[]>(SEED);
  useEffect(() => setDocs(load()), []);
  const add = useCallback((cat: VaultCat, name: string) => {
    setDocs((prev) => {
      const next = [...prev, { id: `d${Date.now()}`, cat, name, at: new Date().toISOString() }];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const remove = useCallback((id: string) => {
    setDocs((prev) => { const next = prev.filter((d) => d.id !== id); localStorage.setItem(KEY, JSON.stringify(next)); return next; });
  }, []);
  const has = (name: string) => docs.some((d) => d.name.toLowerCase() === name.toLowerCase());
  const missing = EXPECTED.find((e) => !has(e.name));
  return { docs, add, remove, missing, count: (c: VaultCat) => docs.filter((d) => d.cat === c).length };
}
