/* B032–B039 · Démarches d'un espace « animal ». Statut dans legato-state (taskStatus), étapes dans task-steps. */
import type { AnimalBodyState } from "./space-navigation";
import type { TaskStatus } from "./legato-state";

export type AnimalTask = { id: string; title: string; sub: (name: string) => string; to: string; section: "corps" | "papiers" };

export const ANIMAL_TASKS: AnimalTask[] = [
  { id: "animal-body", title: "Crémation ou enterrement", sub: () => "À décider avec le vétérinaire", to: "/practical/animal-body", section: "corps" },
  { id: "animal-id", title: "Déclarer son décès", sub: () => "Fichier national d'identification · 5 min", to: "/practical/animal-id", section: "papiers" },
  { id: "animal-insurance", title: "Prévenir son assurance", sub: (n) => `Si ${n} était assuré`, to: "/practical/animal-insurance", section: "papiers" },
  { id: "animal-subscriptions", title: "Arrêter les abonnements", sub: () => "Croquettes, mutuelle animale", to: "/practical/animal-subscriptions", section: "papiers" },
];

/** La réponse « pour son corps » de la première ouverture coche déjà le corps quand tout est fait. */
export function animalTaskDone(id: string, status: TaskStatus | undefined, body?: AnimalBodyState): boolean {
  if (status) return status === "done";
  return id === "animal-body" && (body === "fait" || body === "organise");
}

export const SUBSCRIPTIONS = ["Livraison de croquettes", "Mutuelle animale", "Pension, garde, promeneur", "Toilettage"];

export function subscriptionMessage(service: string, name: string) {
  return `Bonjour,\n\nNotre animal, ${name}, est mort. Je vous remercie d'arrêter l'abonnement « ${service} » à son nom et les prélèvements associés.\n\nBien cordialement`;
}

export function insuranceLetter(name: string) {
  return `Madame, Monsieur,\n\nJe vous informe du décès de ${name}, assuré auprès de vous (contrat n° …). Je vous joins le certificat de décès établi par le vétérinaire.\n\nJe vous remercie de bien vouloir résilier ce contrat et arrêter les prélèvements à compter de cette date.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.`;
}
