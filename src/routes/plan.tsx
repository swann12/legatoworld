import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { loadPractical, savePractical } from "@/lib/practical-store";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Mon plan — Legato" },
      { name: "description", content: "Vos étapes, par ordre de priorité. À votre rythme." },
    ],
  }),
  component: PlanPage,
});

type Priority = "now" | "soon" | "later";
type Task = {
  id: string;
  title: string;
  why: string;
  duration: string;
  priority: Priority;
  category: string;
  /** Délai légal en jours après le décès — null si pas de délai officiel. */
  legalDeadlineDays: number | null;
  legalNote?: string;
};

const TASKS: Task[] = [
  { id: "constat",  title: "Faire établir le constat de décès", why: "Première étape officielle, faite par un médecin.", duration: "15 min", priority: "now", category: "Premiers jours", legalDeadlineDays: 0, legalNote: "Le jour même." },
  { id: "mairie",   title: "Déclarer le décès en mairie",       why: "Démarche officielle obligatoire. Acte de décès remis ensuite.", duration: "30 min", priority: "now", category: "Premiers jours", legalDeadlineDays: 1, legalNote: "Dans les 24 h ouvrées." },
  { id: "pf",       title: "Contacter une entreprise de pompes funèbres", why: "Pour organiser la mise en bière et la cérémonie.", duration: "10 min", priority: "now", category: "Premiers jours", legalDeadlineDays: 2 },
  { id: "proches",  title: "Prévenir les proches",              why: "À votre rythme. On peut préparer un message.", duration: "20 min", priority: "now", category: "Premiers jours", legalDeadlineDays: null },
  { id: "ceremony", title: "Organiser les obsèques",            why: "Inhumation ou crémation dans les 6 jours ouvrés.", duration: "à votre rythme", priority: "soon", category: "Cérémonie", legalDeadlineDays: 6, legalNote: "Dans les 6 jours ouvrés." },
  { id: "employeur",title: "Prévenir l'employeur",              why: "Un message court suffit. Un justificatif suivra.", duration: "10 min", priority: "soon", category: "Premiers jours", legalDeadlineDays: 3 },
  { id: "docs",     title: "Rassembler les documents essentiels", why: "Pièce d'identité, livret de famille, contrats.", duration: "1 h", priority: "soon", category: "Documents", legalDeadlineDays: null },
  { id: "banque",   title: "Prévenir la banque",                why: "Pour bloquer les comptes individuels du défunt.", duration: "20 min", priority: "soon", category: "Comptes & abonnements", legalDeadlineDays: 7 },
  { id: "notaire",  title: "Prendre rendez-vous chez un notaire", why: "Pour la succession. Acte indispensable au-delà de 5 000 €.", duration: "1 h", priority: "later", category: "Succession", legalDeadlineDays: 30 },
  { id: "impots",   title: "Déclarer la succession aux impôts", why: "Délai légal officiel.", duration: "à étaler", priority: "later", category: "Succession", legalDeadlineDays: 180, legalNote: "Dans les 6 mois." },
  { id: "comptes",  title: "Résilier les abonnements",          why: "Téléphone, énergie, presse. Pas urgent.", duration: "à étaler", priority: "later", category: "Comptes & abonnements", legalDeadlineDays: null },
  { id: "logement", title: "S'occuper du logement",             why: "Clés, contrats, objets importants. Rien ne presse.", duration: "à étaler", priority: "later", category: "Logement et objets", legalDeadlineDays: null },
];

const PRIO_LABEL: Record<Priority, { label: string; sub: string }> = {
  now:   { label: "À faire maintenant", sub: "Une ou deux choses, pas plus." },
  soon:  { label: "À faire bientôt",    sub: "Important, sans urgence." },
  later: { label: "Peut attendre",      sub: "Replié par défaut." },
};

const DEATH_KEY = "legato.deathDate";

function daysSinceDeath(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEATH_KEY);
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return null;
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  } catch { return null; }
}

function deadlineLabel(t: Task, elapsed: number | null): { text: string; tone: "neutral" | "soft" | "alert" } | null {
  if (t.legalDeadlineDays == null) return null;
  if (elapsed == null) {
    return { text: t.legalNote ?? `Délai : ${t.legalDeadlineDays} j`, tone: "neutral" };
  }
  const remaining = t.legalDeadlineDays - elapsed;
  if (remaining < 0)  return { text: `Délai dépassé de ${Math.abs(remaining)} j`, tone: "alert" };
  if (remaining === 0) return { text: "À faire aujourd'hui",          tone: "alert" };
  if (remaining <= 3)  return { text: `Encore ${remaining} j`,         tone: "alert" };
  if (remaining <= 14) return { text: `Dans ${remaining} j`,           tone: "soft"  };
  return { text: `Dans ${remaining} j`, tone: "neutral" };
}

function PlanPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [laterOpen, setLaterOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [death, setDeath] = useState<string>("");
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => { setDone(loadPractical().steps || {}); }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DEATH_KEY) || "";
    setDeath(raw);
    setElapsed(daysSinceDeath());
  }, []);
  const saveDeath = (v: string) => {
    setDeath(v);
    if (typeof window !== "undefined") {
      if (v) window.localStorage.setItem(DEATH_KEY, v);
      else window.localStorage.removeItem(DEATH_KEY);
    }
    setElapsed(daysSinceDeath());
  };

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    savePractical({ steps: next });
  };

  const groups: Priority[] = ["now", "soon", "later"];

  return (
    <Shell>
      <ScreenHeader
        back={{ to: "/practical", label: "Aide concrète" }}
        eyebrow="Votre plan, à votre rythme"
        title="Une seule chose à la fois suffit."
        subtitle="Cochez ce qui est fait, reportez ce qui peut attendre. Rien n'est obligatoire aujourd'hui."
      />

      <Section className="mt-8">
        <button
          onClick={() => setDatePickerOpen((o) => !o)}
          className="w-full surface p-5 text-left hover:bg-dusk/[0.02] transition-colors"
        >
          <div className="flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <p className="eyebrow">Date du décès (facultatif)</p>
              <p className="mt-2 text-[14px] text-dusk">
                {death
                  ? `Saisie · ${elapsed != null ? `${elapsed} j écoulés` : ""}`
                  : "Pour calculer les délais légaux."}
              </p>
            </div>
            <span className="text-dusk/40 text-sm">{datePickerOpen ? "−" : "+"}</span>
          </div>
          {datePickerOpen && (
            <div className="mt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <input
                type="date"
                value={death}
                onChange={(e) => saveDeath(e.target.value)}
                className="bg-transparent border-b border-dusk/15 pb-1 text-[14px] text-dusk outline-none focus:border-dusk/40"
              />
              {death && (
                <button onClick={() => saveDeath("")} className="eyebrow-sm hover:text-[color:var(--terracotta)]">Effacer</button>
              )}
            </div>
          )}
        </button>
      </Section>

      {groups.map((p) => {
        const tasks = TASKS.filter((t) => t.priority === p);
        const isLater = p === "later";
        const open = !isLater || laterOpen;
        return (
          <Section key={p} className="mt-10">
            <button
              onClick={() => isLater && setLaterOpen((o) => !o)}
              className={`w-full flex items-baseline justify-between border-t border-dusk/15 pt-4 ${isLater ? "" : "pointer-events-none"}`}
            >
              <div className="text-left">
                <p className="eyebrow">{PRIO_LABEL[p].label}</p>
                <p className="mt-1.5 text-[13px] text-dusk/60">{PRIO_LABEL[p].sub}</p>
              </div>
              {isLater && <span className="text-dusk/40 text-sm">{laterOpen ? "−" : "+"}</span>}
            </button>

            {open && (
              <div className="mt-4 space-y-3">
                {tasks.map((t) => {
                  const isOpen = expanded === t.id;
                  const dl = deadlineLabel(t, elapsed);
                  return (
                    <div key={t.id} className="surface p-5">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggle(t.id)}
                          aria-pressed={!!done[t.id]}
                          className={`mt-1 size-5 rounded-full border transition-colors ${done[t.id] ? "bg-dusk border-dusk" : "border-dusk/30 bg-transparent"} shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="eyebrow-sm">{t.category} · {t.duration}</p>
                            {dl && !done[t.id] && (
                              <span
                                className={`text-[10.5px] uppercase tracking-[0.18em] shrink-0 ${
                                  dl.tone === "alert"
                                    ? "text-[color:var(--terracotta)]"
                                    : dl.tone === "soft"
                                      ? "text-[color:var(--bordeaux-soft)]"
                                      : "text-dusk/50"
                                }`}
                              >
                                {dl.text}
                              </span>
                            )}
                          </div>
                          <h3 className={`mt-2 font-serif text-[17px] font-light leading-snug ${done[t.id] ? "text-dusk/40 line-through" : "text-dusk"}`}>{t.title}</h3>
                          {isOpen && (
                            <>
                              <p className="mt-2 text-[13.5px] leading-[1.55] text-dusk/65">{t.why}</p>
                              {t.legalNote && (
                                <p className="mt-1.5 text-[12.5px] text-dusk/55 italic">{t.legalNote}</p>
                              )}
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button className="btn-ghost">Reporter</button>
                                <Link to="/circle" className="btn-ghost">Confier</Link>
                                <Link to="/resources" className="btn-ghost">Demander de l'aide</Link>
                              </div>
                            </>
                          )}
                          <button
                            onClick={() => setExpanded(isOpen ? null : t.id)}
                            className="mt-3 eyebrow-sm hover:text-dusk"
                          >
                            {isOpen ? "Replier" : "Voir l'étape"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        );
      })}

      <Section className="mt-12 mb-10 text-center">
        <p className="font-serif italic text-[14px] text-dusk/55 max-w-[30ch] mx-auto text-balance">
          « Un seul pas suffit pour aujourd'hui. »
        </p>
      </Section>
    </Shell>
  );
}
