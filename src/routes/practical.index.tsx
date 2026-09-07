import { createFileRoute, Link } from "@tanstack/react-router";
import { Plate } from "@/components/legato/Plate";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import {
  journeyModules, PRACTICAL_LABELS, PRACTICAL_BUCKETS, BUCKET_LABELS,
  type PracticalCategory, type PracticalBucket,
} from "@/lib/journey-config";
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
  const { situation, primaryNeed, stage, softDay, lightMode, lovedOneRelation, legallyInvolved, hydrated, taskStatus, name } = useLegato();
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

  const softActive = hydrated && (softDay || lightMode);
  const visibleBuckets: PracticalBucket[] = softActive ? ["now"] : ORDER;
  const buckets = filter === "all" ? visibleBuckets : visibleBuckets.filter((b) => b === filter);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark to="/practical" size={20} />
          <Link
            to="/profile"
            aria-label="Mon profil"
            className="inline-flex items-center justify-center rounded-full text-[12px] font-medium"
            style={{ width: 30, height: 30, background: "var(--blush)", color: "var(--dusk)" }}
          >
            {(name || "?").trim().charAt(0).toUpperCase() || "?"}
          </Link>
        </header>

        <section className="px-6 pt-8 pb-2">
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
          <Plate name="demarches" caption="Papiers, clés, choses à poser" className="mt-7" ratio="1 / 1" />
        </section>

        {/* Bloc "Aujourd'hui" — une priorité claire + progression */}
        {hydrated && total > 0 && (
          <section className="px-5 pt-7">
            <div
              className="rounded-[22px] px-6 pt-6 pb-6"
              style={{ background: "var(--sun)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="mono-label text-dusk/65">Aujourd'hui</p>
                <p className="mono-label text-dusk/65">
                  {total ? Math.round((done / total) * 100) : 0}%
                </p>
              </div>
              <h2 className="mt-4 font-serif text-[24px] leading-[1.12] max-w-[20ch]">
                {grouped.now[0]
                  ? PRACTICAL_LABELS[grouped.now[0]].label
                  : "Rien d'urgent aujourd'hui."}
              </h2>
              {grouped.now[0] && (
                <p className="mt-2 text-[12.5px] text-dusk/65 max-w-[28ch]">
                  {PRACTICAL_LABELS[grouped.now[0]].hint}
                </p>
              )}
              <div className="mt-5 h-[3px] rounded-full overflow-hidden" style={{ background: "color-mix(in oklab, var(--dusk) 10%, transparent)" }}>
                <div className="h-full rounded-full" style={{ width: `${total ? (done / total) * 100 : 0}%`, background: "var(--terracotta)" }} />
              </div>
              {grouped.now[0] && (
                <Link
                  to="/practical/tasks/$id"
                  params={{ id: grouped.now[0] }}
                  className="mt-5 inline-block mono-label"
                  style={{ color: "var(--terracotta)" }}
                >
                  Avancer cette étape →
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Tuiles thématiques — chacune une couleur unique */}
        {!softActive && (
        <section className="px-5 pt-7">
          <div className="grid grid-cols-2 gap-3">
            <ThemeTile to="/practical/tasks" label="Tâches" hint="Avancer pas à pas" bg="var(--whisper)" />
            <ThemeTile to="/practical/vault" label="Documents" hint="Tout au même endroit" bg="var(--whisper)" />
            <ThemeTile to="/practical/pros"  label="Pros"     hint="Pompes funèbres, notaires" bg="var(--blush)" />
            <ThemeTile to="/practical/ceremony" label="Cérémonie" hint="Lieu, déroulé, hommage" bg="var(--sun)" />
          </div>
          <Link
            to="/practical/wishes"
            className="mt-3 block rounded-[18px] px-5 py-4"
            style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
          >
            <p className="mono-label" style={{ color: "color-mix(in oklab, var(--paper) 70%, transparent)" }}>Ancrage</p>
            <p className="mt-1.5 font-serif text-[18px] leading-[1.15]">Mes volontés</p>
            <p className="mt-1 text-[12px]" style={{ color: "color-mix(in oklab, var(--paper) 78%, transparent)" }}>
              Préparer en douceur, pour soi ou pour ses proches.
            </p>
          </Link>
        </section>
        )}

        {!softActive && (
          <section className="px-5 pt-8">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Tout</FilterChip>
              {ORDER.map((b) => (
                <FilterChip key={b} active={filter === b} onClick={() => setFilter(b)}>
                  {BUCKET_LABELS[b].label}
                </FilterChip>
              ))}
            </div>
          </section>
        )}

        {!softActive && buckets.map((b) => {
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
                          to="/practical/tasks/$id"
                          params={{ id: c }}
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

        {!softActive && (
          <div className="px-6 pt-8">
            <button
              type="button"
              onClick={() => setShowArchived((v) => !v)}
              className="text-[12px] text-dusk/50 underline underline-offset-4 hover:text-dusk"
            >
              {showArchived ? "Masquer les éléments archivés" : "Voir les éléments archivés"}
            </button>
          </div>
        )}

        <footer className="px-6 pt-12 flex flex-col items-center gap-3">
          <Link to="/practical/resources" className="mono-label tracking-[0.18em] text-dusk/55 hover:text-dusk">
            Comprendre les démarches →
          </Link>
          <Link to="/crisis" className="mono-label tracking-[0.18em] text-dusk/45 hover:text-dusk">
            Besoin d’aide tout de suite →
          </Link>
        </footer>

        <div className="pt-6" />
      </div>
    </Shell>
  );
}

function ThemeTile({ to, label, hint, bg }: { to: string; label: string; hint: string; bg: string }) {
  return (
    <Link
      to={to as "/practical"}
      className="rounded-[18px] px-5 py-5 min-h-[112px] flex flex-col justify-between"
      style={{ background: bg }}
    >
      <p className="font-serif text-[19px] leading-[1.12]">{label}</p>
      <p className="text-[12px] text-dusk/65">{hint}</p>
    </Link>
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
