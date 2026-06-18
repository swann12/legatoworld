import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
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
          <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            {mode === "both"
              ? "Deux entrées séparées. Aucune checklist dans le soutien, aucun journal dans les démarches."
              : mode === "emotional"
                ? "Votre accueil met le soutien en premier, avec un accès discret aux démarches."
                : "Votre accueil met l'action en premier, avec un accès discret au soutien."}
          </p>
        </section>

        {softActive && <SoftBanner />}
        {night && !softActive && <NightBanner />}

        {mode === "both" && <TwoSpaceSwitch />}

        {mode === "emotional" && (
          <CareTodayBlock lovedName={lovedName} stale={stale} plan={plan} compact={mode === "both"} />
        )}

        {mode === "practical" && (
          <PracticalTodayBlock lovedName={lovedName} softDay={softActive} night={night} firstTask={modules.practical[0]} compact={mode === "both"} />
        )}

        {mode === "emotional" && <SecondarySwitch to="/practical" label="Ouvrir les démarches concrètes" />}
        {mode === "practical" && <SecondarySwitch to="/care" label="Ouvrir le soutien psychologique" />}

        <footer className="px-6 pt-14 pb-4 flex flex-col items-center gap-3">
          <Link to="/space" className="mono-label text-dusk/55 hover:text-dusk">Changer d'espace →</Link>
          <Link to="/crisis" className="mono-label tracking-[0.18em] text-dusk/45 hover:text-dusk">Si aujourd'hui pèse trop →</Link>
        </footer>
      </main>
    </Shell>
  );
}

function CareTodayBlock({ lovedName, stale, plan, compact }: {
  lovedName: string;
  stale: boolean;
  plan: ReturnType<typeof emotionPlan>;
  compact: boolean;
}) {
  const secondary = stale
    ? [{ label: "Journal", to: "/care/journal" }, { label: "Mémoire", to: "/care/memory" }]
    : plan.secondary.slice(0, 2);
  return (
    <section className="px-5 pt-8">
      <SectionKicker label="Soutien psychologique" />
      <Link
        to={(stale ? "/care/emotions" : plan.primary.to) as "/care"}
        className="mt-4 block rounded-[20px] px-6 pt-7 pb-6"
        style={{ background: "var(--sun)", color: "var(--dusk)" }}
      >
        <p className="mono-label">{stale ? "Check-in" : plan.primary.label}</p>
        <h2 className="mt-5 font-serif font-normal text-[26px] leading-[1.15] max-w-[18ch]">
          {stale ? "Où en êtes-vous, là ?" : plan.primary.hint ?? "Une petite chose, maintenant."}
        </h2>
        <p className="mt-4 text-[12.5px] leading-[1.55] text-dusk/60 max-w-[31ch]">
          {stale ? "Votre émotion récente adapte le journal, les audios, les ressources et la mémoire." : `Pour vous, et pour ${lovedName}.`}
        </p>
        <span className="mt-6 inline-block mono-label" style={{ color: "var(--terracotta)" }}>
          {stale ? "Faire un check-in" : plan.primary.label} →
        </span>
      </Link>
      {!compact && <CareQuickLinks items={secondary} />}
      {compact && <SpaceDoor to="/care" title="Entrer dans le soutien" hint="Émotions, journal, mémoire, ressources." />}
    </section>
  );
}

function TwoSpaceSwitch() {
  return (
    <section className="px-5 pt-8 flex flex-col gap-3">
      <SpaceDoor to="/care" title="Soutien psychologique" hint="Émotions, journal, mémoire, respiration, aide humaine." />
      <SpaceDoor to="/practical" title="Démarches concrètes" hint="Tâches, documents, cérémonie, professionnels, délégation." />
    </section>
  );
}

function PracticalTodayBlock({ lovedName, softDay, night, firstTask, compact }: {
  lovedName: string;
  softDay: boolean;
  night: boolean;
  firstTask?: keyof typeof PRACTICAL_LABELS;
  compact: boolean;
}) {
  const cfg = firstTask ? PRACTICAL_LABELS[firstTask] : null;
  return (
    <section className="px-5 pt-8">
      <SectionKicker label="Démarches concrètes" />
      {softDay || night ? (
        <div className="mt-4 rounded-[20px] px-6 pt-7 pb-6" style={{ background: "var(--whisper)" }}>
          <p className="mono-label">À préserver</p>
          <h2 className="mt-5 font-serif font-normal text-[25px] leading-[1.15]">Les démarches peuvent attendre.</h2>
          <Link to="/practical" className="mt-6 inline-block mono-label" style={{ color: "var(--terracotta)" }}>Voir seulement l'essentiel →</Link>
        </div>
      ) : (
        <Link to="/practical" className="mt-4 block rounded-[20px] px-6 pt-7 pb-6" style={{ background: "var(--whisper)", color: "var(--dusk)" }}>
          <p className="mono-label">Une étape concrète</p>
          <h2 className="mt-5 font-serif font-normal text-[26px] leading-[1.15] max-w-[18ch]">
            {cfg ? cfg.label : "Avancer une étape."}
          </h2>
          <p className="mt-4 text-[12.5px] leading-[1.55] text-dusk/60 max-w-[31ch]">
            {cfg ? cfg.hint : `Un plan clair pour ${lovedName}, sans contenus émotionnels mélangés.`}
          </p>
          <span className="mt-6 inline-block mono-label" style={{ color: "var(--terracotta)" }}>Ouvrir les démarches →</span>
        </Link>
      )}
      {compact && <SpaceDoor to="/practical" title="Entrer dans les démarches" hint="Tâches, documents, professionnels, délégation." />}
    </section>
  );
}

function CareQuickLinks({ items }: { items: { label: string; to: string }[] }) {
  const fallback = items.length ? items : [{ label: "Journal", to: "/care/journal" }, { label: "Mémoire", to: "/care/memory" }];
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {fallback.map((item) => (
        <Link key={item.to} to={item.to as "/care"} className="rounded-[16px] border border-dusk/12 bg-paper px-4 py-4">
          <p className="font-serif text-[17px] leading-[1.15] text-dusk">{item.label}</p>
          <span className="mt-3 inline-block text-dusk/45">→</span>
        </Link>
      ))}
    </div>
  );
}

function SectionKicker({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <p className="mono-label">{label}</p>
      <div className="h-px flex-1 bg-dusk/12" />
    </div>
  );
}

function SpaceDoor({ to, title, hint }: { to: "/care" | "/practical"; title: string; hint: string }) {
  return (
    <Link to={to} className="mt-3 block rounded-[16px] border border-dusk/12 bg-paper px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-serif text-[18px] leading-[1.15] text-dusk">{title}</p>
          <p className="mt-1 text-[12px] text-dusk/55">{hint}</p>
        </div>
        <span className="text-dusk/45">→</span>
      </div>
    </Link>
  );
}

function SecondarySwitch({ to, label }: { to: "/care" | "/practical"; label: string }) {
  return (
    <section className="px-6 pt-8">
      <Link to={to} className="mono-label text-dusk/55 hover:text-dusk">{label} →</Link>
    </section>
  );
}

function SoftBanner() {
  return (
    <div className="mx-6 mt-4 rounded-[14px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-3">
      <p className="mono-label" style={{ color: "var(--terracotta)" }}>Mode doux</p>
      <p className="mt-1 text-[12.5px] text-dusk/65 italic">Le tableau du jour réduit la charge et garde les espaces séparés.</p>
    </div>
  );
}

function NightBanner() {
  return (
    <div className="mx-6 mt-4 rounded-[14px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-3">
      <p className="mono-label">Mode nuit</p>
      <p className="mt-1 text-[12.5px] text-dusk/65 italic">Ce soir, Legato privilégie le calme et masque le superflu.</p>
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