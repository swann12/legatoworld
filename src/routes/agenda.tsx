import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { useLegato } from "@/lib/legato-state";
import { loadSelfCare } from "@/lib/self-care";
import {
  useAgenda, agendaSuggestions, formatDay, daysAway,
  KIND_LABELS, IMPORTANCE_LABELS,
  loadReminders, saveReminders, DEFAULT_REMINDERS,
  type AgendaEvent, type EventKind, type Importance, type ReminderPrefs,
} from "@/lib/agenda-store";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — Legato" },
      { name: "description", content: "Vos rendez-vous, vos obligations et vos temps de repos, ajustés à votre état." },
      { property: "og:title", content: "Agenda — Legato" },
      { property: "og:description", content: "Organiser les jours qui viennent, sans se surcharger." },
    ],
  }),
  component: Agenda,
});

function Agenda() {
  const { events, hydrated, add, remove } = useAgenda();
  const { currentEmotions, hydrated: lgReady } = useLegato();
  const [adding, setAdding] = useState(false);
  const [reminders, setReminders] = useState<ReminderPrefs>(DEFAULT_REMINDERS);
  const [body, setBody] = useState<{ energy?: string; sleep?: string }>({});

  useEffect(() => {
    setReminders(loadReminders());
    setBody(loadSelfCare().answers);
  }, []);

  const setR = (p: Partial<ReminderPrefs>) => {
    const next = { ...reminders, ...p };
    setReminders(next);
    saveReminders(next);
  };

  const suggestions = agendaSuggestions(events, {
    lowEnergy: body.energy === "vide" || body.energy === "lente",
    badSleep: body.sleep === "peu" || body.sleep === "coupe" || body.sleep === "endormir",
    heavyEmotion: lgReady && currentEmotions.some((e) => ["fatigue", "anxiete", "peur", "sideration", "besoin_aide"].includes(e)),
  });

  const upcoming = events.filter((e) => daysAway(e.date) >= 0);
  const past = events.filter((e) => daysAway(e.date) < 0).slice(-6).reverse();

  const byDay = new Map<string, AgendaEvent[]>();
  upcoming.forEach((e) => byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]));

  

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="AGENDA" back="/practical" />

        <section className="px-6 pt-4">
          <h1 className="ed-page-title text-[32px]">Les jours qui viennent</h1>
        </section>

        {/* Un seul relevé chiffré, lisible d'un coup d'œil */}
        {hydrated && (
          <section className="px-5 pt-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-dashed border-dusk/25 px-5 py-5">
                <p className="font-serif text-[30px] leading-none">{upcoming.length}</p>
                <p className="mt-2 text-[12.5px] text-dusk/55">à venir</p>
              </div>
              <div className="rounded-[18px] border border-dashed border-dusk/25 px-5 py-5">
                <p className="font-serif text-[30px] leading-none">
                  {upcoming.filter((e) => e.kind === "repos" || e.kind === "pour_soi").length}
                </p>
                <p className="mt-2 text-[12.5px] text-dusk/55">pour vous</p>
              </div>
            </div>
          </section>
        )}

        {hydrated && suggestions.length > 0 && (
          <section className="px-5 pt-6">
            <p className="px-1 text-[12.5px] text-dusk/45">Suggestion</p>
            <p className="mt-2 rounded-[16px] px-4 py-3.5 text-[13.5px] leading-[1.5] text-dusk/80" style={{ background: "var(--whisper)" }}>
              {suggestions[0].text}
            </p>
          </section>
        )}

        <section className="px-5 pt-7">
          {adding ? (
            <AddForm onCancel={() => setAdding(false)} onSubmit={(e) => { add(e); setAdding(false); }} />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="w-full rounded-[18px] border border-dashed border-dusk/30 px-5 py-4 text-center font-serif text-[17px]"
            >
              + Ajouter
            </button>
          )}
        </section>

        {[...byDay.entries()].map(([date, list]) => (
          <section key={date} className="px-5 pt-8">
            <p className="px-1 font-serif text-[19px]">{formatDay(date)}</p>
            <div className="mt-3 divide-y divide-dusk/10 border-t border-dusk/10">
              {list.map((e) => <EventRow key={e.id} e={e} onRemove={() => remove(e.id)} />)}
            </div>
          </section>
        ))}

        {hydrated && upcoming.length === 0 && !adding && (
          <section className="px-5 pt-8">
            <div className="rounded-[20px] border border-dashed border-dusk/25 px-5 py-8 text-center">
              <p className="text-[13.5px] text-dusk/55">Rien de prévu. C'est très bien aussi.</p>
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="px-5 pt-9">
            <details>
              <summary className="cursor-pointer list-none px-1 text-[12.5px] text-dusk/45">Ce qui est passé ({past.length})</summary>
              <div className="mt-3 space-y-2">
                {past.map((e) => (
                  <p key={e.id} className="px-1 text-[12.5px] text-dusk/50">
                    {formatDay(e.date)} · {e.title}
                  </p>
                ))}
              </div>
            </details>
          </section>
        )}
        


        <section className="px-5 pt-10">
          <div className="rounded-[20px] border border-dusk/12 bg-paper px-5 py-5">
            <p className="mono-label">Rappels doux</p>
            <p className="mt-2 text-[12.5px] leading-[1.55] text-dusk/60">
              Une invitation, jamais une alarme. Vous pouvez les couper à tout moment.
            </p>
            <button
              type="button"
              onClick={() => setR({ enabled: !reminders.enabled })}
              className="mt-4 rounded-full border px-4 py-2 text-[12.5px]"
              style={{
                borderColor: reminders.enabled ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 15%, transparent)",
                background: reminders.enabled ? "color-mix(in oklab, var(--terracotta) 14%, var(--paper))" : "transparent",
              }}
            >
              {reminders.enabled ? "Rappels activés" : "Rappels désactivés"}
            </button>

            {reminders.enabled && (
              <>
                <p className="mt-5 mono-label text-dusk/55">Quand</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["matin", "midi", "soir"] as const).map((m) => (
                    <Chip key={m} active={reminders.moment === m} onClick={() => setR({ moment: m })}>{m}</Chip>
                  ))}
                </div>
                <p className="mt-4 mono-label text-dusk/55">À quelle fréquence</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["quotidien", "hebdo"] as const).map((f) => (
                    <Chip key={f} active={reminders.frequency === f} onClick={() => setR({ frequency: f })}>
                      {f === "quotidien" ? "Chaque jour" : "Une fois par semaine"}
                    </Chip>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="px-7 pt-9">
          <Link to="/help/corps" className="block border-t border-dusk/12 pt-6 text-center">
            <p className="mono-label">Pour ajuster au plus juste</p>
            <p className="mt-2 font-serif text-[17px]" style={{ color: "var(--terracotta)" }}>Faire le point sur le corps →</p>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3.5 py-1.5 text-[12px]"
      style={{
        borderColor: active ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 14%, transparent)",
        background: active ? "color-mix(in oklab, var(--terracotta) 14%, var(--paper))" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

function EventRow({ e, onRemove }: { e: AgendaEvent; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[18px] border border-dusk/12 px-5 py-4" style={{ background: e.kind === "repos" || e.kind === "pour_soi" ? "var(--whisper)" : "var(--paper)" }}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-serif text-[18px] leading-[1.15]">{e.title}</p>
          <span className="mono-label text-dusk/45 shrink-0">{e.time || KIND_LABELS[e.kind]}</span>
        </div>
        <p className="mt-1 text-[12px] text-dusk/55">
          {KIND_LABELS[e.kind]} · {IMPORTANCE_LABELS[e.importance]} · {e.movable ? "déplaçable" : "non déplaçable"}
        </p>
      </button>
      {open && (
        <div className="mt-3">
          {e.note && <p className="text-[12.5px] leading-[1.55] text-dusk/65">{e.note}</p>}
          <button type="button" onClick={onRemove} className="mt-3 mono-label" style={{ color: "var(--bordeaux)" }}>
            Retirer
          </button>
        </div>
      )}
    </div>
  );
}

function AddForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (e: Omit<AgendaEvent, "id">) => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [kind, setKind] = useState<EventKind>("rdv");
  const [importance, setImportance] = useState<Importance>("normal");
  const [movable, setMovable] = useState(true);
  const [note, setNote] = useState("");

  return (
    <form
      className="rounded-[20px] border border-dusk/15 bg-paper px-5 py-5"
      onSubmit={(ev) => {
        ev.preventDefault();
        if (!title.trim() || !date) return;
        onSubmit({ title: title.trim(), date, time: time || undefined, kind, importance, movable, note: note.trim() || undefined });
      }}
    >
      <p className="mono-label text-dusk/60">Nouvel élément</p>

      <label className="mt-4 block mono-label text-dusk/55">Ce que c'est</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Notaire, banque, dîner chez Claire…"
        className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[15px] outline-none focus:border-dusk/35"
      />

      <div className="mt-4 flex gap-3">
        <div className="flex-1">
          <label className="block mono-label text-dusk/55">Le jour</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] outline-none focus:border-dusk/35" />
        </div>
        <div className="w-[38%]">
          <label className="block mono-label text-dusk/55">Heure</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] outline-none focus:border-dusk/35" />
        </div>
      </div>

      <p className="mt-4 mono-label text-dusk/55">De quel type</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(KIND_LABELS) as EventKind[]).map((k) => (
          <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{KIND_LABELS[k]}</Chip>
        ))}
      </div>

      <p className="mt-4 mono-label text-dusk/55">Quelle importance</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(IMPORTANCE_LABELS) as Importance[]).map((i) => (
          <Chip key={i} active={importance === i} onClick={() => setImportance(i)}>{IMPORTANCE_LABELS[i]}</Chip>
        ))}
      </div>

      <p className="mt-4 mono-label text-dusk/55">Peut-on le déplacer&nbsp;?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip active={movable} onClick={() => setMovable(true)}>Oui</Chip>
        <Chip active={!movable} onClick={() => setMovable(false)}>Non</Chip>
      </div>

      <label className="mt-4 block mono-label text-dusk/55">Une note (facultatif)</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Ce que j'appréhende, ce dont j'ai besoin ce jour-là…"
        className="mt-2 w-full resize-none rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] outline-none focus:border-dusk/35"
      />

      <div className="mt-5 flex items-center gap-4">
        <button type="submit" disabled={!title.trim() || !date}
          className="rounded-full px-5 py-2.5 text-[13px] disabled:opacity-40"
          style={{ background: "var(--bordeaux)", color: "var(--paper)" }}>
          Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="mono-label text-dusk/55">Annuler</button>
      </div>
    </form>
  );
}
