/* Détail du dernier check-in, gardé en local (jamais envoyé ailleurs). */

import type { Duration, Moment, BodySignal } from "./emotion-depth";

const KEY = "lg.checkin.v1";

export type CheckinDetail = {
  duration: Duration | null;
  moment: Moment | null;
  body: BodySignal[];
};

const EMPTY: CheckinDetail = { duration: null, moment: null, body: [] };

export function loadCheckin(): CheckinDetail {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<CheckinDetail>;
    return {
      duration: p.duration ?? null,
      moment: p.moment ?? null,
      body: Array.isArray(p.body) ? p.body : [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveCheckin(v: CheckinDetail) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* stockage indisponible */
  }
}
