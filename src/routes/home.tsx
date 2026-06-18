import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato, type PrimaryNeed } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import { emotionPlan, isEmotionStale, isNightHour } from "@/lib/emotion-routing";
import { journeyModules, PRACTICAL_LABELS } from "@/lib/journey-config";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Aujourd'hui — Legato" },
      { name: "description", content: "Un tableau du jour clair : soutien et démarches restent séparés." },
    ],
  }),
  component: Home,
});

function Home() {
  const {
    name, primaryNeed, situation, stage, currentEmotions, currentEmotionAt,
    softDay, nightModeOverride, hydrated, lovedOneRelation, legallyInvolved,
  } = useLegato();
  const lovedName = useLovedName();
  const [todayLabel, setTodayLabel] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [view, setView] = useState<"care" | "practical">("care");

  useEffect(() => {
    const d = new Date();
    setNow(d);
    setTodayLabel(new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long" }).format(d));
  }, []);

  const night = useMemo(() => {
    if (!hydrated) return false;
    if (nightModeOverride !== null) return nightModeOverride;
    return now ? isNightHour(now) : false;
  }, [hydrated, nightModeOverride, now]);

  const mode: PrimaryNeed = hydrated ? (primaryNeed ?? "both") : "both";
  const softActive = hydrated && softDay;
  const stale = hydrated ? isEmotionStale(currentEmotionAt) : true;
  const plan = useMemo(() => emotionPlan(hydrated ? currentEmotions : []), [currentEmotions, hydrated]);
  const modules = journeyModules(situation, mode, stage, { relation: lovedOneRelation, legallyInvolved });

  const activeView: "care" | "practical" =
    mode === "emotional" ? "care" : mode === "practical" ? "practical" : view;

  return (
    <Shell livingBg={false}>
      <main className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 pb-2 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <span className="mono-label">{todayLabel || "\u00A0"}</span>
        </header>

        <section className="px-6 pt-10 pb-2">
          <p className="mono-label">{greetingForHour(now)}{name ? `, ${name}` : ""}</p>
          <h1 className="mt-5 font-serif font-normal text-[36px] leading-[1.05] text-dusk">
            Votre tableau<br />du <span className="italic" style={{ color: "var(--terracotta)" }}>jour</span>.
          </h1>
        </section>

        {softActive && <SoftBanner />}
        {night && !softActive && <NightBanner />}

        {mode === "both" && (
          <div className="px-6 pt-6">
            <SpaceToggle value={view} onChange={setView} />
          </div>
        )}

        {activeView === "care" && (
          <CareTodayBlock lovedName={lovedName} stale={stale} plan={plan} />
        )}
        {activeView === "practical" && (
          <PracticalTodayBlock softDay={softActive} night={night} firstTask={modules.practical[0]} />
        )}

        <footer className="px-6 pt-14 pb-4 flex flex-col items-center gap-3">
          <Link to="/crisis" className="mono-label tracking-[0.18em] text-dusk/45 hover:text-dusk">Si aujourd'hui pèse trop →</Link>
        </footer>
      </main>
    </Shell>
  );
}

function SpaceToggle({ value, onChange }: { value: "care" | "practical"; onChange: (v: "care" | "practical") => void }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-full border border-dusk/12 bg-[color:var(--whisper)] p-1">
      {([
        { id: "care", label: "Soutien" },
        { id: "practical", label: "Démarches" },
      ] as const).map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-full px-4 py-2.5 text-[12.5px] font-medium tracking-[0.02em] transition-colors ${active ? "bg-dusk text-paper" : "text-dusk/65"}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function CareTodayBlock({ lovedName, stale, plan }: {
  lovedName: string;
  stale: boolean;
  plan: ReturnType<typeof emotionPlan>;
}) {
  return (
    <section className="px-5 pt-8">
      <Link
        to={(stale ? "/care/emotions" : plan.primary.to) as "/care"}
        className="block rounded-[22px] px-6 pt-7 pb-7"
        style={{ background: "var(--sun)", color: "var(--dusk)" }}
      >
        <p className="mono-label">{stale ? "Check-in" : plan.primary.label}</p>
        <h2 className="mt-4 font-serif font-normal text-[28px] leading-[1.1] max-w-[18ch]">
          {stale ? "Comment vous sentez-vous ?" : plan.primary.hint ?? "Une petite chose, maintenant."}
        </h2>
        <span className="mt-6 inline-block mono-label" style={{ color: "var(--terracotta)" }}>
          {stale ? "Commencer" : "Ouvrir"} →
        </span>
      </Link>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <QuickTile to="/care/journal" label="Journal" bg="var(--sky)" />
        <QuickTile to="/care/memory" label={`Mémoire${lovedName ? ` · ${lovedName}` : ""}`} bg="var(--blush)" />
      </div>
    </section>
  );
}

function PracticalTodayBlock({ softDay, night, firstTask }: {
  softDay: boolean;
  night: boolean;
  firstTask?: keyof typeof PRACTICAL_LABELS;
}) {
  const cfg = firstTask ? PRACTICAL_LABELS[firstTask] : null;
  return (
    <section className="px-5 pt-8">
      {softDay || night ? (
        <div className="rounded-[22px] px-6 pt-7 pb-7" style={{ background: "var(--sky)" }}>
          <p className="mono-label">À préserver</p>
          <h2 className="mt-4 font-serif font-normal text-[27px] leading-[1.1]">Les démarches peuvent attendre.</h2>
          <Link to="/practical" className="mt-6 inline-block mono-label" style={{ color: "var(--terracotta)" }}>Voir seulement l'essentiel →</Link>
        </div>
      ) : (
        <Link to="/practical" className="block rounded-[22px] px-6 pt-7 pb-7" style={{ background: "var(--sky)", color: "var(--dusk)" }}>
          <p className="mono-label">Une étape concrète</p>
          <h2 className="mt-4 font-serif font-normal text-[28px] leading-[1.1] max-w-[18ch]">
            {cfg ? cfg.label : "Avancer une étape."}
          </h2>
          <span className="mt-6 inline-block mono-label" style={{ color: "var(--terracotta)" }}>Ouvrir →</span>
        </Link>
      )}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <QuickTile to="/practical/vault" label="Documents" bg="var(--sun)" />
        <QuickTile to="/practical/pros" label="Professionnels" bg="var(--blush)" />
      </div>
    </section>
  );
}

function QuickTile({ to, label, bg }: { to: string; label: string; bg: string }) {
  return (
    <Link
      to={to as "/care"}
      className="rounded-[16px] px-4 py-5 min-h-[88px] flex flex-col justify-between"
      style={{ background: bg, color: "var(--dusk)" }}
    >
      <p className="font-serif text-[17px] leading-[1.15]">{label}</p>
      <span className="self-end text-dusk/55 text-[14px]">→</span>
    </Link>
  );
}

function SoftBanner() {
  return (
    <div className="mx-6 mt-4 rounded-[14px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-3">
      <p className="mono-label" style={{ color: "var(--terracotta)" }}>Mode doux</p>
      <p className="mt-1 text-[12.5px] text-dusk/65 italic">Aujourd'hui sera plus léger.</p>
    </div>
  );
}

function NightBanner() {
  return (
    <div className="mx-6 mt-4 rounded-[14px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-3">
      <p className="mono-label">Mode nuit</p>
      <p className="mt-1 text-[12.5px] text-dusk/65 italic">Ce soir, place au calme.</p>
    </div>
  );
}

function greetingForHour(now: Date | null) {
  if (!now) return "Bonjour";
  const h = now.getHours();
  if (h < 5) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}