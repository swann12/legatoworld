import { createContext, useContext, useState, type ReactNode } from "react";

export type Branch =
  | "person"
  | "animal"
  | "fear"
  | "anxiety"
  | "unknown";

export type Mode = "cocoon" | "anchoring" | "breath" | "relay";

export const BRANCHES: { id: Branch; label: string; whisper: string }[] = [
  { id: "person", label: "Une personne", whisper: "Quelqu'un que vous portez." },
  { id: "animal", label: "Un animal", whisper: "Une petite présence dévouée." },
  { id: "fear", label: "La peur de perdre quelqu'un", whisper: "Une anticipation, en amont." },
  { id: "anxiety", label: "Réflexion sur la mort", whisper: "Les grandes questions, tout doucement." },
  { id: "unknown", label: "Je ne sais pas encore", whisper: "C'est un lieu, aussi." },
];

export const MODES: { id: Mode; label: string; whisper: string; tint: string }[] = [
  { id: "cocoon", label: "Cocon", whisper: "Peu d'énergie. Peu de choix. Enveloppé·e.", tint: "rose" },
  { id: "anchoring", label: "Ancrage", whisper: "Du brouillard. Besoin de sol sous les pieds.", tint: "sage" },
  { id: "breath", label: "Souffle", whisper: "Une petite réouverture. Plus d'air.", tint: "mist" },
  { id: "relay", label: "Relais", whisper: "Des mains concrètes. L'aide des autres.", tint: "lavender" },
];

type Ctx = {
  branch: Branch;
  setBranch: (b: Branch) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  name: string;
  setName: (s: string) => void;
};

const LegatoContext = createContext<Ctx | null>(null);

export function LegatoProvider({ children }: { children: ReactNode }) {
  const [branch, setBranch] = useState<Branch>("person");
  const [mode, setMode] = useState<Mode>("cocoon");
  const [name, setName] = useState<string>("Maya");
  return (
    <LegatoContext.Provider value={{ branch, setBranch, mode, setMode, name, setName }}>
      {children}
    </LegatoContext.Provider>
  );
}

export function useLegato() {
  const ctx = useContext(LegatoContext);
  if (!ctx) throw new Error("useLegato must be used inside LegatoProvider");
  return ctx;
}

export function modeTint(mode: Mode): string {
  switch (mode) {
    case "cocoon": return "var(--rose)";
    case "anchoring": return "var(--sage)";
    case "breath": return "var(--mist)";
    case "relay": return "var(--lavender)";
  }
}