import rules from "./regles-aujourdhui-soutien-demarches.json";
import { phaseOf, type TodayInput } from "./today-engine";

type Action = { title: string; meta: string; to: string };
export function practicalPlan(c: TodayInput) {
  const phase = phaseOf(c);
  const code = c.papiers === "Q" ? "Q" : c.papiers === "R" && phase === 1 ? "R" : c.papiers === "F" ? "F" : c.papiers === "O" || c.papiers === "R" ? "O" : phase === 1 ? "R" : phase === 3 ? "F" : "O";
  const data = rules.demarches[code];
  const helper = c.helper || "Votre proche";
  const title = { R: ["Les premiers jours,", "dans l'ordre."], O: ["Ce qu'il reste", "à faire."], F: ["Presque", "terminé."], Q: [`${helper} s'occupe`, "des démarches."] }[code];
  const meta = { R: "20 minutes · elles déclarent aussi le décès", O: "10 minutes · en ligne, à la mairie", F: "avec le notaire · dans les six mois", Q: "2 minutes · un document à signer" }[code];
  const to = { R: "/practical/tasks/obseques", O: "/practical/tasks/acte-deces", F: "/practical/tasks/notaire", Q: "/practical/tasks/banque" }[code];
  const rows: Record<string, Omit<Action, "title">> = {
    "Organiser la cérémonie": { meta: "le lieu, la date", to: "/practical/ceremony" },
    "Prévenir les proches": { meta: "un seul message", to: "/practical/prevenir" },
    "Prévenir la banque": { meta: "15 minutes · courrier prêt", to: "/practical/tasks/banque/template" },
    "Retraite, assurance maladie": { meta: "ce mois-ci", to: "/practical/tasks/retraite" },
    "Résilier les derniers contrats": { meta: "téléphone, abonnements", to: "/practical/tasks/logement" },
  };
  return {
    code, title,
    card: { title: code === "Q" ? data.en_premier.split(": ")[1]?.replace(/^signer/, "Signer") ?? data.en_premier : data.en_premier, meta, to },
    label: "En premier", helper: code === "Q" ? `${helper} a besoin de vous` : undefined,
    cta: { R: "Voir comment", O: "Faire la demande", F: "Préparer le rendez-vous", Q: "Voir le document" }[code],
    next: ("puis" in data ? data.puis : []).flatMap(title => rows[title] ? [{ title, ...rows[title] }] : []),
    link: code === "O" ? { title: "Vos échéances", to: "/agenda" } : code === "Q" ? { title: "Voir toutes les démarches", to: "/practical/tasks" } : undefined,
  };
}