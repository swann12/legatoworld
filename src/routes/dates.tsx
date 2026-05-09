import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { suggestRituals } from "@/lib/rituals.functions";

export const Route = createFileRoute("/dates")({
  head: () => ({ meta: [{ title: "Dates sensibles — Legato" }] }),
  component: Dates,
});

const DATES = [
  { id: "d1", kind: "Anniversaire", title: "Un an", date: "16 mai", inDays: 12, soft: true },
  { id: "d2", kind: "Naissance", title: "Ses 64 ans", date: "2 juillet", inDays: 59, soft: false },
  { id: "d3", kind: "Mémoire", title: "Le jour au lac", date: "24 août", inDays: 112, soft: false },
  { id: "d4", kind: "Récurrent", title: "Les déjeuners du dimanche", date: "Chaque dimanche", inDays: 3, soft: true },
];

type Ritual = { title: string; whisper: string; durationMin: number };

function Dates() {
  const { mode, branch, lostName } = useLegato();
  const callRituals = useServerFn(suggestRituals);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ritualsByDate, setRitualsByDate] = useState<Record<string, { quick: Ritual[]; long: Ritual[] }>>({});

  const toggle = async (d: typeof DATES[number]) => {
    if (openId === d.id) {
      setOpenId(null);
      return;
    }
    setOpenId(d.id);
    if (ritualsByDate[d.id] || loadingId === d.id) return;
    setLoadingId(d.id);
    setError(null);
    try {
      const r = await callRituals({
        data: { kind: d.kind, title: d.title, date: d.date, branch, mode, lostName },
      });
      if (r.error) setError(r.error);
      setRitualsByDate((m) => ({ ...m, [d.id]: { quick: r.quick, long: r.long } }));
    } catch {
      setError("Le service n'a pas répondu. Réessayez dans un instant.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Accueil</Link>
          </div>
          <ScreenHeader
            eyebrow="Dates sensibles"
            title={<>Des jours qui <br /><span className="italic">savent déjà.</span></>}
            subtitle="Touchez une date pour des rituels — courts ou plus longs."
          />

          <Section className="mt-10 space-y-3">
            {DATES.map((d) => {
              const open = openId === d.id;
              const data = ritualsByDate[d.id];
              const isLoading = loadingId === d.id;
              return (
                <article key={d.id} className={`organic-radius-3 ${d.soft ? "ceramic" : "ceramic-soft"} overflow-hidden`}>
                  <button onClick={() => toggle(d)} className="w-full p-5 text-left">
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{d.kind}</p>
                        <h3 className="mt-1.5 font-serif text-xl italic text-dusk">{d.title}</h3>
                        <p className="mt-1 text-[13px] text-dusk/55">{d.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-serif text-3xl font-light text-dusk leading-none">{d.inDays}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40 mt-1">jours</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-dusk/45">
                      {open ? "Replier" : isLoading ? "Un instant…" : "Recevoir des rituels →"}
                    </p>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 space-y-5 border-t border-dusk/10 pt-5">
                      {isLoading && (
                        <p className="text-[13px] italic text-dusk/55">Quelques pistes arrivent…</p>
                      )}
                      {data && (
                        <>
                          <RitualGroup label="Rituels rapides — quelques minutes" items={data.quick} />
                          <RitualGroup label="Rituels plus longs — pour s'y poser" items={data.long} />
                        </>
                      )}
                      {error && !data && (
                        <p className="text-[13px] italic text-dusk/60">{error}</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </Section>

          <Section className="mt-8">
            <button className="ceramic organic-radius-3 w-full px-7 py-5 text-center">
              <span className="font-serif text-lg italic text-dusk">Ajouter une date</span>
            </button>
          </Section>
        </div>
      </div>
    </Shell>
  );
}

function RitualGroup({ label, items }: { label: string; items: Ritual[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{label}</p>
      <div className="mt-3 space-y-2">
        {items.map((it, i) => (
          <div key={i} className="paper-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-serif italic text-[15px] text-dusk">{it.title}</p>
              <span className="text-[10px] uppercase tracking-[0.2em] text-dusk/40 shrink-0">
                {it.durationMin} min
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-dusk/65" style={{ textWrap: "pretty" }}>
              {it.whisper}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}