import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { suggestRituals } from "@/lib/rituals.functions";
import { PageHeader, IvoryCard, SectionLabel } from "@/components/legato/EditorialUI";

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

type Ritual = {
  title: string;
  whisper: string;
  durationMin: number;
  origin?: string;
  originDetail?: string;
};

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
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="DATES" back="/home" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Dates sensibles</p>
          <h1 className="mt-5 ed-page-title">
            Des jours qui <span className="italic">savent déjà.</span>
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Des rituels venus d'ailleurs, courts ou plus longs, à essayer si vous le sentez.
          </p>
        </section>

        <SectionLabel>À venir</SectionLabel>

        <section className="px-5 space-y-3">
          {DATES.map((d) => {
            const open = openId === d.id;
            const data = ritualsByDate[d.id];
            const isLoading = loadingId === d.id;
            return (
              <IvoryCard key={d.id} className="overflow-hidden">
                <button onClick={() => toggle(d)} className="w-full p-5 text-left">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <p className="mono-label">{d.kind}</p>
                      <h3 className="mt-1.5 font-serif text-[20px] italic text-dusk">{d.title}</h3>
                      <p className="mt-1 text-[13px] text-dusk/55">{d.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-[28px] leading-none text-dusk">{d.inDays}</p>
                      <p className="mono-label mt-1">jours</p>
                    </div>
                  </div>
                  <p className="mt-3 mono-label">
                    {open ? "Replier" : isLoading ? "Un instant…" : "Recevoir des rituels →"}
                  </p>
                </button>
                {open && (
                  <div className="px-5 pb-5 space-y-5 border-t border-dusk/10 pt-5">
                    {isLoading && <p className="text-[13px] italic text-dusk/55">Quelques pistes arrivent…</p>}
                    {data && (
                      <>
                        <RitualGroup label="Rituels rapides — quelques minutes" items={data.quick} />
                        <RitualGroup label="Rituels plus longs — pour s'y poser" items={data.long} />
                      </>
                    )}
                    {error && !data && <p className="text-[13px] italic text-dusk/60">{error}</p>}
                  </div>
                )}
              </IvoryCard>
            );
          })}
        </section>

        <div className="px-5 mt-8">
          <button className="w-full rounded-[14px] border border-dusk/10 px-7 py-5 text-center hover:bg-dusk/5 transition-colors">
            <span className="font-serif text-[18px] italic text-dusk">Ajouter une date</span>
          </button>
        </div>
      </div>
    </Shell>
  );
}

function RitualGroup({ label, items }: { label: string; items: Ritual[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mono-label">{label}</p>
      <div className="mt-3 space-y-2">
        {items.map((it, i) => (
          <RitualCard key={i} item={it} />
        ))}
      </div>
    </div>
  );
}

function RitualCard({ item }: { item: Ritual }) {
  const [open, setOpen] = useState(false);
  return (
    <IvoryCard className="p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif italic text-[15px] text-dusk">{item.title}</p>
        <span className="mono-label shrink-0">{item.durationMin} min</span>
      </div>
      <p className="mt-1 text-[13px] leading-relaxed text-dusk/65">{item.whisper}</p>
      {item.origin && (
        <button onClick={() => setOpen((v) => !v)} className="mt-3 mono-label">
          D'où ça vient · {item.origin} {open ? "−" : "+"}
        </button>
      )}
      {open && item.originDetail && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-dusk/60 italic">{item.originDetail}</p>
      )}
    </IvoryCard>
  );
}
