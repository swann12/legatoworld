import { useCallback, useEffect, useState } from "react";
import type { Reply } from "./community-data";

/** Échanges locaux : réponses, discussions ouvertes, soutiens, pseudonyme et signalements. */
type State = {
  replies: Record<string, Reply[]>;
  care: Record<string, boolean>;
  own: {
    id: string;
    group: string;
    title: string;
    body: string;
    when: string;
  }[];
  /** Nom affiché dans la communauté. Jamais le vrai nom par défaut. */
  pseudo: string;
  /** Signalements envoyés à la modération : id du message → motif. */
  reports: Record<string, string>;
};

const KEY = "legato.community.v3";
const EMPTY: State = { replies: {}, care: {}, own: [], pseudo: "Anonyme", reports: {} };

function read(): State {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as State) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function useCommunity() {
  const [state, setState] = useState<State>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  const save = useCallback((next: State) => {
    setState(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const addReply = useCallback(
    (threadId: string, body: string) => {
      const next = read();
      const reply: Reply = {
        id: `own-${Date.now()}`,
        author: next.pseudo || "Anonyme",
        when: "à l'instant",
        body,
        care: 0,
      };
      next.replies = { ...next.replies, [threadId]: [...(next.replies[threadId] ?? []), reply] };
      save(next);
    },
    [save],
  );

  const toggleCare = useCallback(
    (id: string) => {
      const next = read();
      next.care = { ...next.care, [id]: !next.care[id] };
      save(next);
    },
    [save],
  );

  const openThread = useCallback(
    (group: string, title: string, body: string) => {
      const next = read();
      const id = `own-${Date.now()}`;
      next.own = [{ id, group, title, body, when: "à l'instant" }, ...next.own];
      save(next);
      return id;
    },
    [save],
  );

  const setPseudo = useCallback(
    (pseudo: string) => {
      const next = read();
      next.pseudo = pseudo.trim() || "Anonyme";
      save(next);
    },
    [save],
  );

  const report = useCallback(
    (id: string, reason: string) => {
      const next = read();
      next.reports = { ...next.reports, [id]: reason };
      save(next);
    },
    [save],
  );

  return { ...state, hydrated, addReply, toggleCare, openThread, setPseudo, report };
}
