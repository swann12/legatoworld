export type Space = "today" | "support" | "practical" | "memory" | "community" | "night";

/** Classe qui applique le couple de couleurs de l'espace (§3, voir styles.css). */
export const spaceClass = (space: Space = "today") => `lg-space-${space}`;

export const SPACES: Space[] = ["today", "support", "practical", "memory", "community", "night"];

export const SPACE_LABEL: Record<Space, string> = {
  today: "Aujourd'hui",
  support: "Soutien",
  practical: "Démarches",
  memory: "Mémoire",
  community: "Communauté",
  night: "Nuit",
};
