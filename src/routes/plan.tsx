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
};

const TASKS: Task[] = [
  { id: "constat",  title: "Faire établir le constat de décès", why: "Première étape officielle, faite par un médecin.", duration: "15 min",       priority: "now",   category: "Premiers jours" },
  { id: "pf",       title: "Contacter une entreprise de pompes funèbres", why: "Pour organiser la mise en bière et la cérémonie.", duration: "10 min", priority: "now",   category: "Premiers jours" },
  { id: "proches",  title: "Prévenir les proches",       why: "À votre rythme. On peut préparer un message.", duration: "20 min",  priority: "now",   category: "Premiers jours" },
  { id: "mairie",   title: "Déclarer le décès en mairie", why: "Dans les 24 heures ouvrées suivant le décès.", duration: "30 min", priority: "soon",  category: "Premiers jours" },
  { id: "employeur",title: "Prévenir l'employeur",       why: "Un message court suffit. Un justificatif suivra.", duration: "10 min", priority: "soon", category: "Premiers jours" },
  { id: "docs",     title: "Rassembler les documents essentiels", why: "Pièce d'identité, livret de famille, contrats.", duration: "1 h", priority: "soon", category: "Documents" },
  { id: "ceremony", title: "Choisir le déroulé de la cérémonie", why: "Lieu, intervenants, textes, musiques.", duration: "à votre rythme", priority: "soon", category: "Cérémonie" },
  { id: "comptes",  title: "Résilier les abonnements",   why: "Téléphone, énergie, presse. Pas urgent.",       duration: "à étaler", priority: "later", category: "Comptes & abonnements" },
  { id: "notaire",  title: "Prendre rendez-vous chez un notaire", why: "Pour la succession. Dans les semaines à venir.", duration: "1 h", priority: "later", category: "Succession" },
  { id: "logement", title: "S'occuper du logement",      why: "Clés, contrats, objets importants. Rien ne presse.", duration: "à étaler", priority: "later", category: "Logement et objets" },
];

const PRIO_LABEL: Record<Priority, { label: string; sub: string }> = {
  now:   { label: "À faire maintenant", sub: "Une ou deux choses, pas plus." },
  soon:  { label: "À faire bientôt",    sub: "Important, sans urgence." },
  later: { label: "Peut attendre",      sub: "Replié par défaut." },
};

function PlanPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [laterOpen, setLaterOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setDone(loadPractical().steps || {}); }, []);
  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    savePractical({ steps: next });
  };

  const groups: Priority[] = ["now", "soon", "later"];

  return (
    <Shell>
      <div className="px-7 pt-10 flex items-center justify-between">
        <Link to="/practical" className="text-[10px] uppercase tracking-[0.3em] text-dusk/55 hover:text-dusk" style={{ fontFamily: "var(--font-mono)" }}>
          ← Avancer
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>Mon plan</span>
      </div>
      <ScreenHeader
        eyebrow="Votre plan, à votre rythme"
        title={<>Une seule chose à la fois <span className="italic">suffit.</span></>}
        subtitle="Cochez ce qui est fait, reportez ce qui peut attendre. Rien n'est obligatoire aujourd'hui."
      />

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
                <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>{PRIO_LABEL[p].label}</p>
                <p className="mt-1 font-serif italic text-[14px] text-dusk/60">{PRIO_LABEL[p].sub}</p>
              </div>
              {isLater && <span className="text-dusk/40 text-sm">{laterOpen ? "−" : "+"}</span>}
            </button>

            {open && (
              <div className="mt-4 space-y-3">
                {tasks.map((t) => {
                  const isOpen = expanded === t.id;
                  return (
                    <div key={t.id} className="rounded-[16px] border border-dusk/12 bg-paper p-5">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggle(t.id)}
                          aria-pressed={!!done[t.id]}
                          className={`mt-1 size-5 rounded-full border ${done[t.id] ? "bg-sage border-sage" : "border-dusk/30 bg-transparent"} shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45" style={{ fontFamily: "var(--font-mono)" }}>{t.category} · {t.duration}</p>
                          <h3 className={`mt-1 font-serif text-[17px] leading-snug ${done[t.id] ? "text-dusk/40 line-through" : "text-dusk"}`}>{t.title}</h3>
                          {isOpen && (
                            <>
                              <p className="mt-2 text-[13.5px] leading-[1.55] text-dusk/65">{t.why}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button className="ceramic-soft organic-radius px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase text-dusk/70">Reporter</button>
                                <Link to="/circle" className="ceramic-soft organic-radius px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase text-dusk/70">Confier</Link>
                                <Link to="/resources" className="ceramic-soft organic-radius px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase text-dusk/70">Demander de l'aide</Link>
                              </div>
                            </>
                          )}
                          <button
                            onClick={() => setExpanded(isOpen ? null : t.id)}
                            className="mt-2 text-[11px] tracking-[0.18em] uppercase text-dusk/50 hover:text-dusk"
                            style={{ fontFamily: "var(--font-mono)" }}
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
