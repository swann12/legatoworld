import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { StandardLayout, PageTitle, PrimaryButton, OutlineButton, Row, SectionLabel } from "./ds";
import { useLegato } from "@/lib/legato-state";
import { useActiveSpace } from "@/lib/use-active-space";
import { getDeathDate, getNeeds, getPapers } from "@/lib/onboarding-flow";
import { papersCode } from "@/lib/ajouts5/today-engine";
import { supportPlan, fatigueThreeDays, localDay, type EmotionDay } from "@/lib/ajouts5/support-engine";
import { scopedKey } from "@/lib/active-space";
import { usePresenceHistory } from "@/lib/presence-history";
import { useSoutien } from "@/lib/soutien";
import { daysAway } from "@/lib/agenda-store";

export function SupportPage() {
  const legato = useLegato(), { space } = useActiveSpace(), history = usePresenceHistory();
  const { s } = useSoutien();
  const [input, setInput] = useState<{ days: string; papiers: string; besoins: string[]; fatigue: boolean } | null>(null);
  useEffect(() => {
    if (!legato.hydrated) return;
    const now = new Date(), deathDate = space?.deathDate ?? getDeathDate();
    const days = deathDate ? String(Math.max(0, Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12).getTime() - new Date(`${deathDate}T12:00:00`).getTime()) / 864e5))) : "";
    let emotions: EmotionDay[] = [];
    try { emotions = JSON.parse(localStorage.getItem(scopedKey("lg.today.emotion-history")) ?? "[]"); } catch { /* private local data unavailable */ }
    if (legato.currentEmotionAt && localDay(new Date(legato.currentEmotionAt)) === localDay(now)) {
      emotions = [...emotions.filter(e => e.day !== localDay(now)), { day: localDay(now), values: legato.currentEmotions.includes("fatigue") ? ["Fatigue"] : [] }];
    }
    setInput({ days, papiers: papersCode(getPapers()), besoins: getNeeds().map(n => ({ tenir: "T", demarches: "D", parler: "P", memoire: "M" })[n]), fatigue: fatigueThreeDays(emotions, now) });
  }, [legato.hydrated, legato.currentEmotionAt, space?.id, space?.deathDate]);
  if (!input) return <StandardLayout space="support" title="Soutien" activeTab="/care"><div aria-busy="true" /></StandardLayout>;
  const danger = legato.currentEmotions.includes("besoin_aide") || history.slice(-2).some(m => m.cards?.some(c => c.href === "tel:3114"));
  const work = s.workDate && daysAway(s.workDate) >= 0 && daysAway(s.workDate) <= 3;
  const plan = supportPlan({ ...input, comment: "", emos: [], flags: [danger ? "danger" : "", input.fatigue ? "fatigue3" : "", work ? "travail" : ""] });
  return <StandardLayout space="support" title="Soutien" activeTab="/care" className="lg-support-engine">
    <PageTitle size={36} className="pt-7">Ce qui peut <em>vous aider.</em></PageTitle>
    <section className={`lg-support-card ${plan.danger ? "lg-support-danger" : ""}`} aria-label="Utile maintenant">
      <p className="lg-support-label">Utile maintenant</p><h2>{plan.card.title}</h2><p className="lg-support-meta">{plan.card.meta}</p>
      <PrimaryButton to={plan.danger ? undefined : plan.card.to} onClick={plan.danger ? () => { window.location.href = "tel:3114"; } : undefined}>{plan.card.cta}</PrimaryButton>
    </section>
    {plan.sections.map(section => <section className="lg-support-section" key={section.title} aria-label={section.title}>
      <SectionLabel>{section.title}</SectionLabel>
      {section.rows.map((a, i) => <Row key={a.title} title={a.title} subtitle={a.meta} to={a.to} last={i === section.rows.length - 1} />)}
    </section>)}
    {/* Existing pages remain accessible, without promoting breathing or a second card. */}
    <details className="lg-support-extras"><summary>Autres pages</summary><Row title="Écrire" subtitle="Journal et lettres" to="/care/journal" /><Row title="Lire, écouter, voir" to="/care/resources" /><Row title="Prendre soin de vous" subtitle="Respirer, sons, professionnels" to="/care/sons" /><Row title="Trouver un professionnel" to="/care/help" last /></details>
    <Link to="/presence" className="lg-today-presence"><span>Une question ? Écrivez à Présence…</span><span><ArrowRight size={16} strokeWidth={1.3} /></span></Link>
    {plan.monthly && <section className="lg-support-monthly"><h2>Faire le point sur ce mois</h2><p>Trois questions, si vous le souhaitez.</p><OutlineButton to="/care/point">Commencer</OutlineButton></section>}
  </StandardLayout>;
}