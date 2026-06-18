import type { TaskStatus } from "./legato-state";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "À faire",
  doing: "En cours",
  done: "Fait",
  delegated: "Délégué",
  blocked: "Bloqué",
  missing_doc: "Doc manquant",
  snoozed: "Reporté",
  not_concerned: "Non concerné",
};

export const ACTIVE_STATUSES: TaskStatus[] = [
  "todo", "doing", "delegated", "blocked", "missing_doc",
];

export const ARCHIVED_STATUSES: TaskStatus[] = [
  "done", "not_concerned",
];

/** Une tâche est masquée des vues actives si elle est faite ou hors périmètre. */
export function isHiddenFromActive(status: TaskStatus | undefined): boolean {
  if (!status) return false;
  return status === "done" || status === "not_concerned" || status === "snoozed";
}

export function isArchived(status: TaskStatus | undefined): boolean {
  if (!status) return false;
  return ARCHIVED_STATUSES.includes(status);
}

/** Filtre une liste d'IDs de tâches en gardant seulement celles encore actives. */
export function filterActive<T extends string>(
  ids: T[],
  statusMap: Record<string, TaskStatus>,
): T[] {
  return ids.filter((id) => !isHiddenFromActive(statusMap[id]));
}

/** Compte tâches faites / total dans une liste. */
export function countProgress<T extends string>(
  ids: T[],
  statusMap: Record<string, TaskStatus>,
): { done: number; total: number } {
  let done = 0;
  for (const id of ids) if (statusMap[id] === "done") done += 1;
  return { done, total: ids.length };
}