import { useCallback, useEffect, useState } from "react";
import { scopedKey, ACTIVE_SPACE_EVENT } from "./active-space";

/* « Vos rituels » (B101) : prévus et faits, gardés sur le téléphone, par espace. */
export type MyRitual = { id: string; title: string; sub?: string; date?: string; done: boolean; yearly?: boolean; createdAt: number };
const KEY = "lg.myRituals.v1";
const EVENT = "legato:my-rituals";

export function readMyRituals(): MyRitual[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(scopedKey(KEY)) || "[]") as MyRitual[]; } catch { return []; }
}
function write(list: MyRitual[]) {
  try { window.localStorage.setItem(scopedKey(KEY), JSON.stringify(list)); window.dispatchEvent(new Event(EVENT)); } catch { /* rien */ }
}
export function addMyRitual(r: Omit<MyRitual, "id" | "createdAt">) {
  const item = { ...r, id: Math.random().toString(36).slice(2, 10), createdAt: Date.now() };
  write([...readMyRituals(), item]);
  return item;
}
export function updateMyRitual(id: string, patch: Partial<MyRitual>) { write(readMyRituals().map((r) => (r.id === id ? { ...r, ...patch } : r))); }

/** Prévus (par date, sans date à la fin) et déjà faits (du plus récent au plus ancien). */
export function splitRituals(list: MyRitual[]) {
  const planned = list.filter((r) => !r.done || r.yearly).sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
  const done = list.filter((r) => r.done).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || b.createdAt - a.createdAt);
  return { planned, done };
}

export function useMyRituals() {
  const [list, setList] = useState<MyRitual[]>([]);
  const load = useCallback(() => setList(readMyRituals()), []);
  useEffect(() => {
    load();
    window.addEventListener(EVENT, load); window.addEventListener(ACTIVE_SPACE_EVENT, load);
    return () => { window.removeEventListener(EVENT, load); window.removeEventListener(ACTIVE_SPACE_EVENT, load); };
  }, [load]);
  return list;
}
