import { useEffect, useState } from "react";
import { loadPractical, savePractical, type PracticalState } from "./practical-store";
import { ACTIVE_SPACE_EVENT } from "./active-space";

export type FlowerProposal = { title: string; accent: string; body: string; flowers: string; shape: string; price: string };
export type CeremonyPlan = {
  providerId: string; date: string; flowersBrief: string; flowerAnswers: Record<string, string>;
  flowerProposal: FlowerProposal | null; flowersChosen: boolean; relativesNotified: boolean;
};
export const EMPTY_CEREMONY_PLAN: CeremonyPlan = {
  providerId: "", date: "", flowersBrief: "", flowerAnswers: {}, flowerProposal: null, flowersChosen: false, relativesNotified: false,
};
export function ceremonyDecisions(s: PracticalState): boolean[] {
  const plan = s.ceremonyPlan ?? EMPTY_CEREMONY_PLAN;
  return [!!plan.providerId, !!s.ceremonyKind, !!(s.ceremonyVenue && plan.date), plan.flowersChosen, plan.relativesNotified];
}
export function useCeremonyPlan() {
  const [state, setState] = useState<PracticalState>({ budget: "", portrait: "", flowerStyle: "", flowerPalette: [], ceremonyKind: "", ceremonyVenue: "", selectedTexts: [], selectedMusic: [], selectedObjects: [], bookletDraft: { photoUrl: "", name: "", dates: "", intro: "", program: "", closing: "" }, steps: {}, lastConfide: "", ceremonyPlan: EMPTY_CEREMONY_PLAN });
  useEffect(() => {
    const sync = () => setState(loadPractical());
    sync();
    window.addEventListener("legato:practical-change", sync);
    window.addEventListener(ACTIVE_SPACE_EVENT, sync);
    return () => { window.removeEventListener("legato:practical-change", sync); window.removeEventListener(ACTIVE_SPACE_EVENT, sync); };
  }, []);
  const plan = state.ceremonyPlan ?? EMPTY_CEREMONY_PLAN;
  const update = (patch: Partial<CeremonyPlan>) => savePractical({ ceremonyPlan: { ...(loadPractical().ceremonyPlan ?? EMPTY_CEREMONY_PLAN), ...patch } });
  return { state, plan, update, decisions: ceremonyDecisions(state) };
}

export const FLOWER_QUESTIONS = [
  { key: "colors", title: "Quelles couleurs", accent: "lui ressemblent ?", lead: "Une seule réponse. Présence s'adaptera à la saison.", options: [
    { id: "blanc", label: "Blanc et vert", hint: "Sobre, lumineux" },
    { id: "chaud", label: "Tons chauds", hint: "Orange, rouge, jaune" },
    { id: "pastel", label: "Tons doux", hint: "Rose pâle, mauve, crème" },
    { id: "inconnu", label: "Je ne sais pas", hint: "Présence choisira des fleurs de saison" },
  ] },
  { key: "univers", title: "Quel style", accent: "lui ressemble ?", lead: "Une seule réponse. Il n'y a pas de bon ou de mauvais choix.", options: [
    { id: "jardin", label: "Comme dans son jardin", hint: "Simple, naturel" },
    { id: "champetre", label: "Des fleurs des champs", hint: "Libre, léger" },
    { id: "classique", label: "Une composition classique", hint: "Ronde, soigneusement composée" },
    { id: "inconnu", label: "Je ne sais pas", hint: "Présence vous proposera une forme" },
  ] },
  { key: "esprit", title: "Quelle place", accent: "pour ces fleurs ?", lead: "Une seule réponse. Vous pourrez modifier la proposition.", options: [
    { id: "cercueil", label: "Devant le cercueil", hint: "Un bouquet bas, posé" },
    { id: "urne", label: "Autour de l'urne", hint: "Une composition discrète" },
    { id: "proches", label: "Dans les mains des proches", hint: "De petits bouquets à partager" },
    { id: "inconnu", label: "Je ne sais pas", hint: "Présence s'adaptera à votre cérémonie" },
  ] },
];
export function flowerChoicesText(answers: Record<string, string>): string {
  return FLOWER_QUESTIONS.map(q => `${q.title} ${q.accent} ${q.options.find(o => o.id === answers[q.key])?.label ?? "Sans préférence"}`).join(" · ");
}