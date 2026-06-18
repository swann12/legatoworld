import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import {
  journeyModules, PRACTICAL_LABELS, PRACTICAL_BUCKETS, BUCKET_LABELS,
  type PracticalCategory, type PracticalBucket,
} from "@/lib/journey-config";
import { SpaceToggle } from "@/components/legato/SpaceToggle";
import { TASK_STATUS_LABELS, isHiddenFromActive } from "@/lib/task-status";

export const Route = createFileRoute("/practical/")({
  head: () => ({
    meta: [
      { title: "Démarches — Legato" },
      { name: "description", content: "Vos démarches, organisées par temporalité et adaptées à votre situation." },
    ],
  }),
  component: Practical,
});

type Status = "todo" | "doing" | "done" | "delegate" | "blocked" | "missing";
const STATUS_LABEL: Record<Status, string> = {
  todo: "À faire", doing: "En cours", done: "Fait",
  delegate: "Délégué", blocked: "Bloqué", missing: "Doc manquant",
};
const STATUS_KEY = "legato.practical.status.v1";
function loadStatus(): Record<string, Status> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(STATUS_KEY) ?? "{}"); } catch { return {}; }
}

const ORDER: PracticalBucket[] = ["now", "week", "month", "later"];

function Practical() {
  const { situation, primaryNeed, stage, softDay, lovedOneRelation, legallyInvolved, hydrated, taskStatus } = useLegato();
  const lovedName = useLovedName();
  const { practical } = journeyModules(situation, primaryNeed, stage, { relation: lovedOneRelation, legallyInvolved });
  const [filter, setFilter] = useState<PracticalBucket | "all">("all");
  const [showArchived, setShowArchived] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({});
  useEffect(() => { setStatusMap(loadStatus()); }, []);

  const allCats: PracticalCategory[] = practical.length
    ? practical
    : hydrated && situation
      ? []
      : (Object.keys(PRACTICAL_LABELS) as PracticalCategory[]);
  const allowed: PracticalCategory[] = showArchived
    ? allCats
    : allCats.filter((c) => !isHiddenFromActive(hydrated ? taskStatus[c] : undefined));

  const grouped = useMemo(() => {
    const map: Record<PracticalBucket, PracticalCategory[]> = { now: [], week: [], month: [], later: [] };
    for (const c of allowed) map[PRACTICAL_BUCKETS[c]].push(c);
    return map;
  }, [allowed]);

  const total = allowed.length;
  const done = allowed.filter((c) => statusMap[c] === "done").length;

  const softActive = hydrated && softDay;
  const visibleBuckets: PracticalBucket[] = softActive ? ["now"] : ORDER;
  const buckets = filter === "all" ? visibleBuckets : visibleBuckets.filter((b) => b === filter);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-center">
          <LegatoMark to="/practical" size={22} />
        </header>
        <SpaceToggle />

        <section className="px-6 pt-10 pb-2">
          <p className="mono-label">Démarches</p>
          <h1 className="mt-5 font-serif font-normal text-[34px] leading-[1.05] text-dusk">
            Avancer sans se<br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>brusquer</span>.
          </h1>
          <p className="mt-5 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            {softActive
              ? "Mode doux : seules les démarches vraiment urgentes restent visibles."
              : hydrated
                ? `${done} sur ${total} étapes faites${lovedName ? ` pour ${lovedName}` : ""}. Le reste peut attendre.`
                : `${total} étapes au total. Le reste peut attendre.`}
          </p>
        </section>

        {!softActive && (
          <section className="px-5 pt-6">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Tout</FilterChip>
              {ORDER.map((b) => (
                <FilterChip key={b} active={filter === b} onClick={() => setFilter(b)}>
                  {BUCKET_LABELS[b].label}
                </FilterChip>
              ))}
              <FilterChip active={showArchived} onClick={() => setShowArchived((v) => !v)}>
                {showArchived ? "Masquer archives" : "Voir archives"}
              </FilterChip>
            </div>
          </section>
        )}

        {buckets.map((b) => {
          const cats = grouped[b];
          if (!cats.length) return null;
          const meta = BUCKET_LABELS[b];
          return (
            <section key={b} className="px-6 pt-9">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full" style={{ background: meta.tone }} />
                <p className="mono-label">{meta.label}</p>
              </div>
              <ul className="mt-4 overflow-hidden rounded-[18px] border border-dusk/12 bg-paper">
                {cats.map((c) => {
                  const cfg = PRACTICAL_LABELS[c];
                  const tsStatus = hydrated ? taskStatus[c] : undefined;
                  const stLabel = tsStatus ? TASK_STATUS_LABELS[tsStatus] : STATUS_LABEL[statusMap[c] ?? "todo"];
                  return (
                    <li key={c} className="border-t border-dusk/10 first:border-t-0">
                      <Link
                        to={"/practical/tasks/$id" as "/practical"}
                        params={{ id: c } as never}
                        className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-dusk/[0.02]"
                      >
                        <div className="min-w-0">
                          <p className="font-serif text-[18px] leading-[1.15] text-dusk">{cfg.label}</p>
                          <p className="mt-1 text-[11.5px] uppercase tracking-[0.1em] text-dusk/45">{cfg.hint}</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-dusk/15 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.08em] text-dusk/65">
                          {stLabel}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <footer className="px-6 pt-12 flex flex-col items-center gap-3">
          <Link to="/crisis" className="mono-label tracking-[0.18em] text-dusk/45 hover:text-dusk">
            Si ça déborde →
          </Link>
        </footer>
      </div>
    </Shell>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-[12px] transition-colors ${active ? "border-dusk/40 bg-[color:var(--whisper)] text-dusk" : "border-dusk/15 bg-paper text-dusk/65 hover:border-dusk/30"}`}
    >
      {children}
    </button>
  );
}
