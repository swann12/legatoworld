import { scopedKey, ACTIVE_SPACE_EVENT } from "./active-space";
import { useEffect, useState } from "react";

/* ───────── Persistance locale des souvenirs ─────────
   Chaque souvenir appartient à un "being" (zone du jardin) et peut
   contenir une composition picturale. Stocké en localStorage. */

export type MemoryType = "voice" | "sentence" | "photo" | "text" | "sound";

export type CompositionItem = {
  id: string;
  elementId?: string;
  atlasId?: string;
  x: number;        // % canvas
  y: number;        // % canvas
  size?: number;
  width?: number;
  height?: number;
  rotation: number;
  opacity: number;  // 0..1
  tint?: string;
  z?: number;       // ordre de superposition (plus grand = au-dessus)
  flipX?: boolean;
  flipY?: boolean;
  name?: string;
  hidden?: boolean;
  locked?: boolean;
  maskDataUrl?: string | null;
  source?: string;
};

export type Memory = {
  id: string;
  zone: string;          // being id
  type: MemoryType;
  title?: string;
  body?: string;         // sentence / text content
  durationSec?: number;  // for voice / sound
  imageDataUrl?: string; // for photo
  composition?: CompositionItem[];
  createdAt: number;
};

const KEY_BASE = "legato.memories.v1";
const KEY = () => scopedKey(KEY_BASE);

function load(): Memory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY());
    return raw ? (JSON.parse(raw) as Memory[]) : [];
  } catch {
    return [];
  }
}

function save(list: Memory[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY(), JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("legato:memories"));
  } catch {
    /* quota dépassé : on ignore silencieusement */
  }
}

export function addMemory(m: Omit<Memory, "id" | "createdAt">): Memory {
  const full: Memory = {
    ...m,
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
  };
  const list = load();
  list.push(full);
  save(list);
  return full;
}

export function updateMemory(id: string, patch: Partial<Memory>) {
  const list = load().map((m) => (m.id === id ? { ...m, ...patch } : m));
  save(list);
}

export function getMemory(id: string): Memory | undefined {
  return load().find((m) => m.id === id);
}

export function getMemoriesForZone(zone: string): Memory[] {
  return load().filter((m) => m.zone === zone);
}

export function getAllMemories(): Memory[] {
  return load();
}

/** Hook réactif : se met à jour quand le store change (même onglet). */
export function useMemories(zone?: string) {
  const [list, setList] = useState<Memory[]>(() =>
    zone ? getMemoriesForZone(zone) : getAllMemories()
  );
  useEffect(() => {
    const handler = () =>
      setList(zone ? getMemoriesForZone(zone) : getAllMemories());
    window.addEventListener("legato:memories", handler);
    window.addEventListener(ACTIVE_SPACE_EVENT, handler);
    window.addEventListener("storage", handler);
    handler();
    return () => {
      window.removeEventListener("legato:memories", handler);
      window.removeEventListener(ACTIVE_SPACE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [zone]);
  return list;
}