import { scopedKey, ACTIVE_SPACE_EVENT } from "./active-space";
import { useCallback, useEffect, useState } from "react";

/* ───────── Portrait de la personne ─────────
   Construit par sélections successives. Sert de contexte partagé :
   Présence, rituels, cérémonie, jardin, recommandations. */

export type Portrait = {
  spaceId: string | null;
  traits: string[];      // comment elle était
  loves: string[];       // ce qui lui ressemblait
  places: string[];      // ses endroits
  music: string[];       // son écoute
  colors: string[];      // ses couleurs
  freeText: string;      // facultatif, en fin de parcours
  updatedAt: number;
};

export const PORTRAIT_OPTIONS = {
  traits: [
    { id: "douce", label: "Douce" }, { id: "drole", label: "Drôle" },
    { id: "discrete", label: "Discrète" }, { id: "forte", label: "Forte" },
    { id: "genereuse", label: "Généreuse" }, { id: "exigeante", label: "Exigeante" },
    { id: "reveuse", label: "Rêveuse" }, { id: "terre", label: "Les pieds sur terre" },
    { id: "protectrice", label: "Protectrice" }, { id: "libre", label: "Libre" },
  ],
  loves: [
    { id: "jardin", label: "Le jardin" }, { id: "cuisine", label: "La cuisine" },
    { id: "mer", label: "La mer" }, { id: "montagne", label: "La montagne" },
    { id: "livres", label: "Les livres" }, { id: "animaux", label: "Les animaux" },
    { id: "bricolage", label: "Bricoler" }, { id: "voyages", label: "Partir" },
    { id: "fetes", label: "Les tablées" }, { id: "silence", label: "Le calme" },
  ],
  places: [
    { id: "maison", label: "La maison" }, { id: "campagne", label: "La campagne" },
    { id: "bord_mer", label: "Le bord de mer" }, { id: "ville", label: "La ville" },
    { id: "atelier", label: "Son atelier" }, { id: "eglise", label: "L'église" },
  ],
  music: [
    { id: "classique", label: "Classique" }, { id: "chanson", label: "Chanson française" },
    { id: "jazz", label: "Jazz" }, { id: "rock", label: "Rock" },
    { id: "variete", label: "Variété" }, { id: "sacre", label: "Chants sacrés" },
    { id: "aucune", label: "Peu de musique" },
  ],
  colors: [
    { id: "blanc", label: "Blanc" }, { id: "creme", label: "Crème" },
    { id: "rose", label: "Rose poudré" }, { id: "rouge", label: "Rouge" },
    { id: "bleu", label: "Bleu" }, { id: "vert", label: "Vert" },
    { id: "jaune", label: "Jaune" }, { id: "violet", label: "Violet" },
  ],
} as const;

const KEY_BASE = "legato.portrait.v1";
const KEY = () => scopedKey(KEY_BASE);
const EVENT = "legato:portrait";

export const EMPTY_PORTRAIT: Portrait = {
  spaceId: null, traits: [], loves: [], places: [], music: [], colors: [],
  freeText: "", updatedAt: 0,
};

function load(): Portrait {
  if (typeof window === "undefined") return EMPTY_PORTRAIT;
  try {
    const raw = window.localStorage.getItem(KEY());
    if (!raw) return EMPTY_PORTRAIT;
    return { ...EMPTY_PORTRAIT, ...(JSON.parse(raw) as Partial<Portrait>) };
  } catch {
    return EMPTY_PORTRAIT;
  }
}

export function usePortrait() {
  const [portrait, setPortrait] = useState<Portrait>(EMPTY_PORTRAIT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPortrait(load());
    setHydrated(true);
    const sync = () => setPortrait(load());
    window.addEventListener(EVENT, sync);
    window.addEventListener(ACTIVE_SPACE_EVENT, sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener(ACTIVE_SPACE_EVENT, sync);
    };
  }, []);

  const update = useCallback((patch: Partial<Portrait>) => {
    const next = { ...load(), ...patch, updatedAt: Date.now() };
    setPortrait(next);
    try {
      window.localStorage.setItem(KEY(), JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(EVENT));
    } catch {
      /* quota */
    }
    return next;
  }, []);

  const filled =
    portrait.traits.length + portrait.loves.length + portrait.places.length +
    portrait.music.length + portrait.colors.length;

  return { portrait, hydrated, update, filled };
}

function labelsOf(group: keyof typeof PORTRAIT_OPTIONS, ids: string[]): string[] {
  const opts = PORTRAIT_OPTIONS[group] as readonly { id: string; label: string }[];
  return ids.map((id) => opts.find((o) => o.id === id)?.label ?? id);
}

/** Une phrase courte, réutilisable partout (Présence, cérémonie, rituels). */
export function portraitSentence(p: Portrait, name?: string): string {
  const who = name || "Cette personne";
  const traits = labelsOf("traits", p.traits).map((t) => t.toLowerCase());
  const loves = labelsOf("loves", p.loves).map((t) => t.toLowerCase());
  if (!traits.length && !loves.length) return "";
  const a = traits.length ? `${who} était ${traits.slice(0, 3).join(", ")}` : who;
  const b = loves.length ? ` — ${loves.slice(0, 3).join(", ")}` : "";
  return `${a}${b}.`;
}

export function portraitLabels(p: Portrait) {
  return {
    traits: labelsOf("traits", p.traits),
    loves: labelsOf("loves", p.loves),
    places: labelsOf("places", p.places),
    music: labelsOf("music", p.music),
    colors: labelsOf("colors", p.colors),
  };
}
