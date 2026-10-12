import { useEffect, useState } from "react";

/** Conversations avec Présence, gardées sur l'appareil uniquement, effaçables (écran 032). */
export type PresenceMsg = { role: "you" | "presence"; text: string };
const KEY = "legato.presence.history.v1";
const EVT = "legato:presence-history";

function read(): PresenceMsg[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function savePresenceHistory(h: PresenceMsg[]) {
  localStorage.setItem(KEY, JSON.stringify(h));
  window.dispatchEvent(new Event(EVT));
}

export function clearPresenceHistory() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}

export function usePresenceHistory() {
  const [h, setH] = useState<PresenceMsg[]>([]);
  useEffect(() => {
    const sync = () => setH(read());
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  return h;
}
