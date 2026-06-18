export type SubNavItem = {
  to: string;
  label: string;
  exact?: boolean;
};

/**
 * Sous-navigation désactivée : la navigation principale est désormais
 * dans la barre du bas + le toggle Soutien/Démarches en haut des index.
 * Le composant reste exporté pour compatibilité, mais ne rend rien.
 */
export function SubNav(_props: { items: SubNavItem[]; ariaLabel: string }) {
  return null;
}

export const CARE_SUBNAV: SubNavItem[] = [
  { to: "/care", label: "Aujourd'hui", exact: true },
  { to: "/care/emotions", label: "Émotions" },
  { to: "/care/journal", label: "Journal" },
  { to: "/care/garden", label: "Jardin" },
  { to: "/presence", label: "Présence" },
  { to: "/care/rituels", label: "Rituels" },
];

export const PRACTICAL_SUBNAV: SubNavItem[] = [
  { to: "/practical", label: "Aujourd'hui", exact: true },
  { to: "/practical/tasks", label: "Tâches" },
  { to: "/practical/vault", label: "Documents" },
  { to: "/practical/ceremony", label: "Cérémonie" },
  { to: "/practical/pros", label: "Pros" },
];