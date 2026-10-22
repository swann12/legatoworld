import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, HelpCircle } from "lucide-react";
import { StandardLayout, PrimaryButton, Row, TextLink } from "./ds";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { todayPlan, papersCode } from "@/lib/ajouts5/today-engine";
import rules from "@/lib/ajouts5/regles-aujourdhui-soutien-demarches.json";
import { useLegato, type Emotion } from "@/lib/legato-state";
import { getPapers, getNeeds, getPapersHelper } from "@/lib/onboarding-flow";
import { useAgenda, daysAway } from "@/lib/agenda-store";
import { upcomingForSpaces, type Space } from "@/lib/spaces-store";
import { useSoutien } from "@/lib/soutien";
import { usePresenceHistory } from "@/lib/presence-history";
import { scopedKey } from "@/lib/active-space";

const EMOTION_LABELS: Partial<Record<Emotion, string>> = { sideration: "Sidéré", anxiete: "Angoisse", peur: "Peur", fatigue: "Fatigue", vide: "Vide", solitude: "Seul", colere: "Colère", culpabilite: "Culpabilité", tristesse: "Tristesse", nostalgie: "Manque", besoin_calme: "Apaisé", soulagement: "Soulagé" };
const ID_BY_LABEL = Object.fromEntries(Object.entries(EMOTION_LABELS).map(([id, label]) => [label, id])) as Record<string, Emotion>;
const dateKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export function TodayPage({ space, header, name, night }: { space?: Space; header: ReactNode; name: string; night: boolean }) {
  const legato = useLegato();
  const { events } = useAgenda();
  const { s: soutien } = useSoutien();
  const history = usePresenceHistory();
  const [now, setNow] = useState<Date | null>(null);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [papiers, setPapiers] = useState("");
  const [besoins, setBesoins] = useState<string[]>([]);
  const [helper, setHelper] = useState("");
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => {
    if (!legato.hydrated) return;
    const today = new Date(); setNow(today);
    setPapiers(papersCode(getPapers()));
    setBesoins(getNeeds().map(n => ({ tenir: "T", demarches: "D", parler: "P", memoire: "M" }[n] ?? "")));
    setHelper(getPapersHelper());
    try {
      setComment(JSON.parse(localStorage.getItem("lg.onb.comment") ?? '""'));
      const stored = JSON.parse(localStorage.getItem(scopedKey("lg.today.emotions")) ?? "null") as { day: string; values: string[] } | null;
      if (stored?.day === dateKey(today)) setEmotions(stored.values);
      else if (legato.currentEmotionAt && dateKey(new Date(legato.currentEmotionAt)) === dateKey(today)) setEmotions(legato.currentEmotions.flatMap(e => EMOTION_LABELS[e] ? [EMOTION_LABELS[e] ?? ""] : []));
      else setEmotions([]);
    } catch { setEmotions([]); }
  }, [legato.hydrated, legato.currentEmotionAt, space?.id]);
  if (!now) return <StandardLayout title="Legato" headerLeft={header}><div aria-busy="true" /></StandardLayout>;
  const deathDate = space?.deathDate;
  const elapsed = deathDate ? String(Math.max(0, Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12).getTime() - new Date(`${deathDate}T12:00:00`).getTime()) / 864e5))) : "";
  const deadline = events.filter(e => e.kind === "demarche" && daysAway(e.date) >= 0 && daysAway(e.date) < 7).sort((a, b) => a.date.localeCompare(b.date))[0];
  const anniversary = space ? upcomingForSpaces([space], 10)[0] : undefined;
  const danger = legato.currentEmotions.includes("besoin_aide") || history.slice(-2).some(m => m.cards?.some(c => c.href === "tel:3114"));
  const format = (date: Date) => date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const plan = todayPlan({ days: elapsed, papiers, comment, besoins, emos: emotions, name, loved: space?.name ?? legato.lovedOneName || "votre proche", helper: helper || "Votre proche", flags: [danger ? "danger" : "", night ? "nuit" : "", deadline ? "echeance" : "", anniversary ? "anniv" : "", soutien.workDate && daysAway(soutien.workDate) >= 0 && daysAway(soutien.workDate) <= 3 ? "travail" : ""], deadline: deadline ? { label: deadline.title, days: daysAway(deadline.date), date: format(new Date(`${deadline.date}T12:00:00`)), to: "/practical" } : undefined, anniversary: anniversary ? { days: anniversary.daysAway, date: format(anniversary.date) } : undefined, completed: Object.entries(legato.taskStatus).filter(([, value]) => value === "done").map(([id]) => id) });
  const edit = () => { setPicked(emotions); setOpen(true); };
  const save = () => {
    const values = picked;
    localStorage.setItem(scopedKey("lg.today.emotions"), JSON.stringify({ day: dateKey(now), values }));
    setEmotions(values);
    legato.setCurrentEmotions(values.flatMap(label => ID_BY_LABEL[label] ? [ID_BY_LABEL[label]] : []));
    setOpen(false);
  };
  const split = plan.title.indexOf(". ");
  return <StandardLayout space={plan.night ? "night" : "today"} title="Legato" headerLeft={header} activeTab="/home" className="lg-today-engine">
    <h1 className="lg-title lg-today-title">{split >= 0 ? <>{plan.title.slice(0, split + 1)} <em>{plan.title.slice(split + 2)}</em></> : plan.title}</h1>
    {!plan.danger && !plan.night && <div className="lg-today-mood"><span>Vous vous sentez : <span>{plan.feelings || "choisir"}</span></span><TextLink onClick={edit}>Modifier</TextLink></div>}
    <section className={`lg-today-card ${plan.danger ? "lg-today-danger" : ""}`} aria-label="Proposition du jour">
      {plan.card.label && <p className="lg-today-label">{plan.card.label}</p>}
      <h2>{plan.card.title}</h2><p className="lg-today-meta">{plan.card.meta}</p>
      <PrimaryButton to={plan.danger ? undefined : plan.card.to} params={plan.card.params} search={plan.card.search} onClick={plan.danger ? () => { window.location.href = "tel:3114"; } : undefined}>{plan.card.cta}</PrimaryButton>
    </section>
    {plan.next.length > 0 && <><p className="lg-section mt-[22px] mb-0.5">Ensuite —</p><div>{plan.next.map((a, i) => <Row key={a.title} title={a.title} subtitle={a.meta} to={a.to} params={a.params} onClick={undefined} last={i === plan.next.length - 1} />)}</div></>}
    {plan.blocked && <Link to="/practical/bloque" className="lg-today-blocked"><span className="lg-today-help-icon"><HelpCircle size={18} strokeWidth={1.5} /></span><span className="flex-1 min-w-0"><span className="lg-row-title block">Je suis bloqué</span><span className="lg-row-sub block">mot de passe, argent, papier introuvable</span></span><ChevronRight size={14} /></Link>}
    <Link to="/presence" className="lg-today-presence"><span>Une question ? Écrivez à Présence…</span><span><ArrowRight size={16} strokeWidth={1.3} /></span></Link>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="lg-today-emotions"><DialogTitle className="lg-title">Comment allez-vous<br /><em>aujourd'hui ?</em></DialogTitle><DialogDescription>Plusieurs choix possibles. Aucune réponse n'est fausse, et elle reste privée.</DialogDescription><div className="flex flex-wrap gap-2">{rules.emotions.liste.map(label => <Button key={label} variant="outline" aria-pressed={picked.includes(label)} onClick={() => setPicked(values => values.includes(label) ? values.filter(v => v !== label) : [...values, label])}>{label}</Button>)}</div><PrimaryButton onClick={save}>Enregistrer</PrimaryButton></DialogContent></Dialog>
  </StandardLayout>;
}