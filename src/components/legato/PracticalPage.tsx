import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, HelpCircle } from "lucide-react";
import { StandardLayout, PageTitle, PrimaryButton, Row, SectionLabel, TextLink } from "./ds";
import { useActiveSpace } from "@/lib/use-active-space";
import { getDeathDate, getPapers, getPapersHelper } from "@/lib/onboarding-flow";
import { papersCode } from "@/lib/ajouts5/today-engine";
import { practicalPlan } from "@/lib/ajouts5/practical-engine";

export function PracticalPage() {
  const { space, hydrated } = useActiveSpace();
  const [plan, setPlan] = useState<ReturnType<typeof practicalPlan> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    const now = new Date(), death = space?.deathDate ?? getDeathDate();
    const days = death ? String(Math.max(0, Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12).getTime() - new Date(`${death}T12:00:00`).getTime()) / 864e5))) : "";
    setPlan(practicalPlan({ days, papiers: papersCode(getPapers()), helper: getPapersHelper(), comment: "", besoins: [], emos: [], flags: [] }));
  }, [hydrated, space?.id, space?.deathDate]);
  return <StandardLayout space="practical" title="Démarches" activeTab="/practical" className="lg-practical-engine">
    {plan ? <>
      <PageTitle size={36} className="pt-7">{plan.title[0]}<br /><em>{plan.title[1]}</em></PageTitle>
      <section className="lg-practical-card" aria-label="En premier"><p className="lg-practical-label">{plan.label}</p><h2>{plan.card.title}</h2><p>{plan.helper ? `${plan.helper} · ` : ""}{plan.card.meta}</p><PrimaryButton to={plan.card.to}>{plan.cta}</PrimaryButton></section>
      {plan.next.length > 0 && <><SectionLabel className="mt-6" accent>Ensuite</SectionLabel><ol>{plan.next.map((r, i) => <li key={r.title}><Row n={i + 2} title={r.title} subtitle={r.meta} to={r.to} last={i === plan.next.length - 1} /></li>)}</ol></>}
      <Link to="/practical/bloque" className="lg-today-blocked lg-practical-blocked"><span className="lg-today-help-icon"><HelpCircle size={18} strokeWidth={1.5} /></span><span className="flex-1 min-w-0"><span className="lg-row-title block">Je suis bloqué</span><span className="lg-row-sub block">mot de passe, argent bloqué, papier introuvable : la solution pas à pas</span></span><ChevronRight size={14} /></Link>
      {plan.link && <div className="pt-4"><TextLink to={plan.link.to}>{plan.link.title} →</TextLink></div>}
      <details className="lg-support-extras"><summary>Autres pages</summary><Row title="Mes documents" to="/practical/vault" /><Row title="Un courrier à comprendre ?" to="/practical/letter" /><Row title="Mon avancement" to="/practical/progress" /><Row title="Toutes les démarches" to="/practical/tasks" last /></details>
    </> : <div aria-busy="true" />}
  </StandardLayout>;
}