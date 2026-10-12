/* Réglages par espace et préférences de notifications (gardés sur l'appareil). */
export type SpacePrefs = { demarches: boolean; memoire: boolean; communaute: boolean; nuit: boolean; matin: boolean };
export const DEFAULT_SPACE_PREFS: SpacePrefs = { demarches: true, memoire: true, communaute: true, nuit: true, matin: true };
const SK = "lg.spacePrefs.v1";
const NK = "lg.notifications.v1";

function readAll<T>(k: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(k) ?? "{}"); } catch { return {}; }
}
export function getSpacePrefs(id: string | null | undefined): SpacePrefs {
  if (!id) return DEFAULT_SPACE_PREFS;
  return { ...DEFAULT_SPACE_PREFS, ...(readAll<SpacePrefs>(SK)[id] ?? {}) };
}
export function setSpacePrefs(id: string, p: SpacePrefs) {
  const all = readAll<SpacePrefs>(SK); all[id] = p;
  try { window.localStorage.setItem(SK, JSON.stringify(all)); } catch { /* indisponible */ }
}

export type NotifPrefs = { jour: boolean; echeances: boolean; groupes: boolean; dates: boolean };
export const DEFAULT_NOTIFS: NotifPrefs = { jour: true, echeances: true, groupes: false, dates: true };
export function getNotifs(): NotifPrefs {
  if (typeof window === "undefined") return DEFAULT_NOTIFS;
  try { return { ...DEFAULT_NOTIFS, ...JSON.parse(window.localStorage.getItem(NK) ?? "{}") }; } catch { return DEFAULT_NOTIFS; }
}
export function setNotifs(p: NotifPrefs) {
  try { window.localStorage.setItem(NK, JSON.stringify(p)); } catch { /* indisponible */ }
}
