import { createContext, useContext, useState, type ReactNode } from "react";

export type Branch =
  | "person"
  | "animal"
  | "fear"
  | "anxiety"
  | "unknown";

export type Mode = "cocoon" | "anchoring" | "breath" | "relay";

export const BRANCHES: { id: Branch; label: string; whisper: string }[] = [
  { id: "person", label: "A person", whisper: "Someone you carry." },
  { id: "animal", label: "An animal", whisper: "A small, devoted presence." },
  { id: "fear", label: "Fear of losing someone", whisper: "Anticipation, ahead of time." },
  { id: "anxiety", label: "Reflection on death", whisper: "The quiet, larger questions." },
  { id: "unknown", label: "I don't know yet", whisper: "That's a place too." },
];

export const MODES: { id: Mode; label: string; whisper: string; tint: string }[] = [
  { id: "cocoon", label: "Cocoon", whisper: "Low energy. Few choices. Wrapped.", tint: "rose" },
  { id: "anchoring", label: "Anchoring", whisper: "Fog. Need structure under the feet.", tint: "sage" },
  { id: "breath", label: "Breath", whisper: "A small reopening. More air.", tint: "mist" },
  { id: "relay", label: "Relay", whisper: "Practical hands. Help from others.", tint: "lavender" },
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