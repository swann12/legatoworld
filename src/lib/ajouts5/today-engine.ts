import rules from "./regles-aujourdhui-soutien-demarches.json";

export type TodayInput = { days: string; papiers: string; comment: string; besoins: string[]; emos: string[]; flags: string[]; name?: string; loved?: string; helper?: string; deadline?: { label: string; days: number; date: string; to: string }; anniversary?: { date: string; days: number }; completed?: string[] };
export type TodayAction = { title: string; meta: string; cta: string; to: string; params?: Record<string, string>; search?: Record<string, string>; label?: string };
export type TodayPlan = { phase: 1 | 2 | 3; title: string; feelings: string; card: TodayAction; next: TodayAction[]; blocked: boolean; night: boolean; danger: boolean; confirmFuneral: boolean };
const clean = (s: string) => s.replace(/[’]/g, "'");
const keys: Record<string, string> = { "Rien n'est commencé": "R", "Les obsèques sont passées": "O", "Presque tout est fait": "F", "Quelqu'un s'en occupe pour moi": "Q" };
export const papersCode = (value: string | null) => ({ rien: "R", obseques: "O", presque: "F", delegue: "Q" }[value ?? ""] ?? "");

/** Same boundary decisions as phaseOf in the supplied simulator. */
export function phaseOf(c: TodayInput): 1 | 2 | 3 {
  const d = c.days === "" ? null : Number(c.days);
  if (c.papiers === keys[clean(rules.entrees.papiers.R)]) return d !== null && d >= 15 ? 2 : 1;
  if (c.papiers === "O") return d !== null && d > 90 ? 3 : 2;
  if (c.papiers === "F") return 3;
  if (d === null) return 2;
  return d < 15 ? 1 : d <= 90 ? 2 : 3;
}
function target(title: string): Pick<TodayAction, "to" | "params" | "search"> {
  if (title.includes("pompes funèbres")) return { to: "/practical/tasks/$id", params: { id: "obseques" } };
  if (title.includes("cérémonie")) return { to: "/practical/ceremony" };
  if (title.includes("Prévenir les proches")) return { to: "/practical/prevenir" };
  if (title.includes("capital décès")) return { to: "/practical/bloque/$id", params: { id: "capital" } };
  if (title.includes("Prévenir la banque")) return { to: "/practical/tasks/$id/template", params: { id: "banque" } };
  if (title.includes("Écrire une lettre")) return { to: "/care/rituels/lettre" };
  if (title.includes("signature")) return { to: "/practical/share" };
  if (title.includes("succession")) return { to: "/practical/tasks/$id", params: { id: "notaire" } };
  if (title.includes("Apaiser")) return { to: "/care/angoisse" };
  if (title.includes("proche de venir")) return { to: "/partage/message", search: { texte: "Pourrais-tu venir me tenir compagnie aujourd'hui ? J'ai besoin de ne pas rester seul.", destinataires: "" } };
  if (title.includes("dormir cette nuit")) return { to: "/help/corps/dormir" };
  if (title.includes("vos proches ce qui")) return { to: "/care/aide" };
  if (title.includes("groupe de parole")) return { to: "/care/community" };
  if (title.includes("psychologue")) return { to: "/care/parler/psychologue" };
  if (title.includes("souvenir")) return { to: "/care/garden/depot" };
  if (title.includes("Ses dates")) return { to: "/care/garden/dates" };
  if (title.includes("geste")) return { to: "/care/rituels" };
  if (title.includes("travail")) return { to: "/care/travail" };
  if (title.includes("minimum") || title.includes("corps")) return { to: "/help/corps" };
  if (title.includes("Lire, écouter")) return { to: "/care/resources" };
  if (title.includes("Présence")) return { to: "/presence" };
  if (title.includes("s'endormir")) return { to: "/care/sons/endormir" };
  return { to: "/care/journal" };
}
function action(title: string, meta = "", cta = "Ouvrir", label?: string): TodayAction { return { title, meta, cta, label, ...target(title) }; }

export function todayPlan(input: TodayInput): TodayPlan {
  const c = { ...input, name: input.name ?? "Victor", loved: input.loved ?? "Anne", helper: input.helper ?? "Claire" };
  const phase = phaseOf(c);
  const d = c.days === "" ? null : Number(c.days);
  const recent = d === null || d <= 21;
  const has = (flag: string) => c.flags.includes(flag);
  const need = (value: string) => c.besoins.includes(value);
  const families = rules.emotions.familles_par_priorite.filter(f => f.emotions.some(e => c.emos.includes(e)));
  if (phase === 1) families.sort((a, b) => a.famille === "Choc" ? -1 : b.famille === "Choc" ? 1 : 0);
  const mainOf = (f: typeof families[number]): TodayAction => {
    if (typeof f.carte !== "string") return action(f.carte.titre, f.carte.ligne, f.carte.bouton, "Pour vous, aujourd'hui");
    if (f.famille === "Solitude") return recent ? action("Dire à vos proches ce qui vous aiderait", "repas, courses, enfants", "Faire ma liste", "Pour vous, aujourd'hui") : action("Un groupe de parole", "près de chez vous ou en visio", "Voir les groupes", "Pour vous, aujourd'hui");
    return c.emos.includes("Manque") && need("M") ? action("Ajouter un souvenir d'elle", "une photo, sa voix, une phrase", "Ajouter", "Pour vous, aujourd'hui") : action(`Écrire une lettre à ${c.loved}`, "10 minutes · personne ne la lira", "Commencer", "Pour vous, aujourd'hui");
  };
  const rowOf = (f: typeof families[number]) => {
    const a = mainOf(f);
    if (f.famille === "Apaisement") return action(f.ligne_ensuite ?? "Lire, écouter, voir", "ce que d'autres en ont dit");
    if (f.famille === "Épuisement") a.meta = "3 conseils, 2 minutes";
    if (f.famille === "Peine" && !a.title.includes("souvenir")) a.meta = "10 minutes · ce que vous n'avez pas pu lui dire";
    if (f.famille === "Solitude" && !recent) a.title = "Rejoindre un groupe de parole";
    return a;
  };
  let card: TodayAction | undefined;
  let title = rules.aujourdhui.regles_carte[7].titre_du_jour;
  let used = "";
  let from = "";
  for (const rule of rules.aujourdhui.regles_carte) {
    const match = [has("danger"), has("nuit"), phase === 1 && c.papiers === "R", has("echeance") && c.papiers !== "Q", has("anniv"), phase === 2 && need("D") && c.papiers !== "Q", families.length > 0, true][rule.ordre - 1];
    if (!match) continue;
    title = rule.titre_du_jour;
    if (typeof rule.carte !== "string") card = action(clean(rule.carte.titre), clean(rule.carte.ligne), rule.carte.bouton, clean(rule.carte.etiquette));
    if (rule.ordre === 7 && families[0]) { card = mainOf(families[0]); title = families[0].titre_du_jour; used = families[0].famille; }
    if (rule.ordre === 8) card = phase === 1 ? action("Dormir, manger : le minimum", "Ce qui aide vraiment ces premiers jours · 2 minutes de lecture.", "Lire", "Pour vous, aujourd'hui") : need("P") ? action("Prendre rendez-vous avec un psychologue", "12 séances remboursées par an · un message prêt pour prendre rendez-vous.", "Voir comment", "Pour vous, aujourd'hui") : need("M") ? action("Ajouter un souvenir d'elle", "Une photo, sa voix, une phrase · 5 minutes.", "Ajouter", "Pour vous, aujourd'hui") : action("Écrire 10 minutes", "Ce que vous ressentez aujourd'hui. Personne ne le lira.", "Commencer", "Pour vous, aujourd'hui");
    from = rule.ordre === 5 ? "date" : "";
    if (rule.ordre === 3 && card && c.completed?.includes("obseques")) card = c.completed.includes("ceremony") ? action("Prévenir les proches", "un seul message, à relire avant", "Voir le message", "Aujourd'hui") : action("Organiser la cérémonie", "le lieu, la date", "Commencer", "Aujourd'hui");
    if (rule.ordre === 4 && card && c.deadline) { card.title = c.deadline.label; card.label = `Avant le ${c.deadline.date} · dans ${c.deadline.days} jours`; Object.assign(card, target(card.title)); if (card.to === "/care/journal") card.to = c.deadline.to; }
    if (rule.ordre === 5 && card && c.anniversary) card.label = `Dans ${c.anniversary.days} jours, le ${c.anniversary.date}`;
    break;
  }
  const selected = card ?? action("Écrire 10 minutes");
  const next: TodayAction[] = [];
  const add = (a: TodayAction) => { if (next.length < 2 && a.title !== selected.title && !next.some(x => x.title === a.title)) next.push(a); };
  const other = families.find(f => f.famille !== used);
  if (other) { add(rowOf(other)); used = other.famille; }
  const period = phase === 1 ? rules.aujourdhui.ensuite.periode_1 : phase === 2 ? rules.aujourdhui.ensuite.periode_2 : rules.aujourdhui.ensuite.periode_3;
  const conditions: Record<string, boolean> = { "3 premières semaines": recent, "papiers = R": c.papiers === "R", "papiers = Q": c.papiers === "Q", "besoin D et papiers ≠ Q": need("D") && c.papiers !== "Q", "besoin P": need("P"), "besoin M": need("M"), "reprise du travail": has("travail"), "papiers = F": c.papiers === "F" };
  for (const row of period) {
    if ("si" in row && typeof row.si === "string" && !conditions[row.si]) continue;
    if (from === "date" && row.ligne === "Ses dates") continue;
    add(action(clean(row.ligne).replace(/Claire/g, c.helper), clean(row.sous)));
  }
  for (const family of families) if (family.famille !== used) add(rowOf(family));
  add(action(rules.aujourdhui.ensuite.par_defaut[String(phase) as "1" | "2" | "3"], phase === 2 ? "fatigue, gorge serrée : c'est fréquent" : phase === 1 ? "2 minutes de lecture" : "ce que d'autres en ont dit"));
  const danger = has("danger"), night = !danger && has("nuit");
  return { phase, title: danger ? title : `${night ? "Bonsoir" : "Bonjour"}${c.name ? ` ${c.name}` : ""}. ${title}`, feelings: c.emos.map(e => (rules.emotions.affichage as Record<string, string>)[e] ?? e.toLowerCase()).map(clean).join(", "), card: selected, next: danger || night ? [action("Écrire à Présence", night ? "si vous ne dormez pas" : "elle vous écoute et vous oriente")] : next, blocked: phase === 1 && !danger && !night, night, danger, confirmFuneral: c.papiers === "R" && d !== null && d >= 15 };
}