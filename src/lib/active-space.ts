import { useEffect, useState } from "react";

/* ───────── Espace actif ─────────
   Chaque espace (une mère, un ami, un animal…) garde ses propres
   souvenirs, son portrait et ses démarches. Toutes les données locales
   sont donc rangées sous une clé suffixée par l'identifiant de l'espace. */

const ACTIVE_KEY = "legato.activeSpace.v1";
const SPACES_KEY = "legato.spaces.v1";
export const ACTIVE_SPACE_EVENT = "legato:active-space";

function firstSpaceId(): string | null {
  try {
    const raw = window.localStorage.getItem(SPACES_KEY);
    const list = raw ? (JSON.parse(raw) as { id: string; archived?: boolean }[]) : [];
    const alive = list.find((s) => !s.archived) ?? list[0];
    return alive?.id ?? null;
  } catch {
    return null;
  }
}

export function getActiveSpaceId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(ACTIVE_KEY);
    if (stored) {
      // l'espace a pu être supprimé entre-temps
      const raw = window.localStorage.getItem(SPACES_KEY);
      const list = raw ? (JSON.parse(raw) as { id: string }[]) : [];
      if (!list.length || list.some((s) => s.id === stored)) return stored;
    }
    return firstSpaceId();
  } catch {
    return null;
  }
}

export function setActiveSpaceId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) window.localStorage.setItem(ACTIVE_KEY, id);
    else window.localStorage.removeItem(ACTIVE_KEY);
    window.dispatchEvent(new CustomEvent(ACTIVE_SPACE_EVENT));
  } catch {
    /* quota */
  }
}

/** Clé locale propre à l'espace actif, avec reprise des données existantes. */
export function scopedKey(base: string): string {
  if (typeof window === "undefined") return base;
  const id = getActiveSpaceId();
  if (!id) return base;
  const key = `${base}::${id}`;
  try {
    if (window.localStorage.getItem(key) === null) {
      const legacy = window.localStorage.getItem(base);
      if (legacy !== null) window.localStorage.setItem(key, legacy);
    }
  } catch {
    /* rien */
  }
  return key;
}

export function useActiveSpaceId() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    setId(getActiveSpaceId());
    const sync = () => setId(getActiveSpaceId());
    window.addEventListener(ACTIVE_SPACE_EVENT, sync);
    window.addEventListener("legato:spaces", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ACTIVE_SPACE_EVENT, sync);
      window.removeEventListener("legato:spaces", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return id;
}
