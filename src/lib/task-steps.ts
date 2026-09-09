/* Cochage des étapes d'une démarche — local, sans compte. */

const KEY = "lg.taskSteps.v1";

type Store = Record<string, number[]>;

function load(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}") as Store;
  } catch {
    return {};
  }
}

export function loadTaskSteps(taskId: string): number[] {
  return load()[taskId] ?? [];
}

export function toggleTaskStep(taskId: string, index: number): number[] {
  const store = load();
  const cur = store[taskId] ?? [];
  const next = cur.includes(index) ? cur.filter((i) => i !== index) : [...cur, index];
  store[taskId] = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(store));
    } catch {
      /* stockage indisponible */
    }
  }
  return next;
}
