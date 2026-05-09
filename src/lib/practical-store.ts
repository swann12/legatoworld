// Lightweight localStorage helpers for the "Aides concrètes" flow.
// No server persistence — everything stays on-device for now.

export type Budget = "essentiel" | "equilibre" | "elabore" | "";
export type FlowerStyle = "bouquet" | "couronne" | "ambiance" | "";

export type PracticalState = {
  budget: Budget;
  portrait: string;        // a few lines describing the person — used to personalize AI suggestions
  flowerStyle: FlowerStyle;
  flowerPalette: string[]; // hex tokens
  ceremonyKind: string;    // inhumation, crémation, libre…
  ceremonyVenue: string;
  selectedTexts: string[];
  selectedMusic: string[];
  selectedObjects: string[];
  bookletDraft: {
    photoUrl: string;
    name: string;
    dates: string;
    intro: string;
    program: string;
    closing: string;
  };
  steps: Record<string, boolean>; // checked steps
  lastConfide: string;
};

const KEY = "legato.practical.v1";

const EMPTY: PracticalState = {
  budget: "",
  portrait: "",
  flowerStyle: "",
  flowerPalette: [],
  ceremonyKind: "",
  ceremonyVenue: "",
  selectedTexts: [],
  selectedMusic: [],
  selectedObjects: [],
  bookletDraft: { photoUrl: "", name: "", dates: "", intro: "", program: "", closing: "" },
  steps: {},
  lastConfide: "",
};

export function loadPractical(): PracticalState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

export function savePractical(patch: Partial<PracticalState>) {
  if (typeof window === "undefined") return;
  const next = { ...loadPractical(), ...patch };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("legato:practical-change"));
}

export const BUDGET_LABELS: Record<Exclude<Budget, "">, { label: string; range: string; whisper: string }> = {
  essentiel: { label: "Essentiel", range: "≈ 2 000 – 3 500 €", whisper: "L'épure, la juste mesure." },
  equilibre: { label: "Équilibré", range: "≈ 3 500 – 6 000 €", whisper: "Un cadre soigné, sans excès." },
  elabore:   { label: "Élaboré",   range: "≈ 6 000 € et plus", whisper: "Tous les détails comptent." },
};
