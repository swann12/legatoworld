import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import { emotionPlan, isEmotionStale, isNightHour } from "@/lib/emotion-routing";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Aujourd'hui — Legato" },
      { name: "description", content: "Une seule priorité à la fois, adaptée à votre situation et à votre émotion." },
    ],
  }),
  component: Home,
});

function Home() {
  const { name, primaryNeed, situation, currentEmotions, currentEmotionAt, softDay, nightModeOverride, hydrated } = useLegato();
  const lovedName = useLovedName();

  const [greeting, setGreeting] = useState("Bonjour");
  const [now, setNow] = useState<Date | null>(null);
  const [todayLabel, setTodayLabel] = useState<string>("");
  useEffect(() => {
    setGreeting(greetingForHour());
    setNow(new Date());
    setTodayLabel(new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long" }).format(new Date()));
  }, []);
  const night = useMemo(() => {
    if (!hydrated) return false;
    if (nightModeOverride !== null) return nightModeOverride;
    return now ? isNightHour(now) : false;
  }, [nightModeOverride, now, hydrated]);

  const stale = hydrated ? isEmotionStale(currentEmotionAt) : true;
  const plan = useMemo(() => emotionPlan(currentEmotions), [currentEmotions]);

  // Mode résolu — stable avant hydratation pour éviter les mismatches.
  const mode: "emotional" | "practical" | "both" = hydrated ? (primaryNeed ?? "both") : "both";
  const softActive = hydrated && softDay;

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 pb-2 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <span className="mono-label">{todayLabel || "\u00A0"}</span>
        </header>

        <section className="px-6 pt-10 pb-2">
          <p className="mono-label">{greeting}{name ? `, ${name}` : ""}</p>
          <h1 className="mt-5 font-serif font-normal text-[36px] leading-[1.05] tracking-[-0.01em] text-dusk">
            {mode === "practical" ? (
              <>Une chose<br /><span className="italic" style={{ color: "var(--terracotta)" }}>à la fois.</span></>
            ) : (
              <>Comment allez-vous<br /><span className="italic" style={{ color: "var(--terracotta)" }}>aujourd'hui&nbsp;?</span></>
            )}
          </h1>
        </section>

        {softActive && <SoftBanner />}
        {night && !softActive && <NightBanner />}

        {mode === "emotional" && (
          <EmotionalView lovedName={lovedName} stale={stale} plan={plan} situation={situation} softDay={softActive} night={night} />
        )}

        {mode === "practical" && (
          <PracticalView softDay={softActive} night={night} />
        )}

        {mode === "both" && (
          <BothView lovedName={lovedName} stale={stale} plan={plan} situation={situation} softDay={softActive} night={night} />
        )}

        <footer className="px-6 pt-14 pb-4 flex flex-col items-center gap-3">
          <Link to="/care/emotions" className="mono-label text-dusk/55 hover:text-dusk">
            Faire un check-in →
          </Link>
          <Link to="/crisis" className="mono-label tracking-[0.18em] text-dusk/45 hover:text-dusk">
            Si aujourd'hui pèse trop →
          </Link>
        </footer>
      </div>
    </Shell>
  );
}

function EmotionalView({ lovedName, stale, plan, situation, softDay, night }: {
  lovedName: string; stale: boolean; plan: ReturnType<typeof emotionPlan>;
  situation: ReturnType<typeof useLegato>["situation"]; softDay: boolean; night: boolean;
}) {
  return (
    <>
      <PrimaryBlock
        eyebrow="Pour vous soutenir"
        title={stale ? "Où en êtes-vous, là ?" : titleFromPlan(plan)}
        cta={stale ? { label: "Faire un check-in", to: "/care/emotions" } : { label: plan.primary.label, to: plan.primary.to }}
        tint="sun"
      />
      {!softDay && !night && (
        <Pair>
          <SmallCard to="/care/journal" eyebrow="Journal" title="Déposer une pensée" />
          <SmallCard to="/care/memory"  eyebrow="Mémoire" title={situation === "soutenir" ? "Témoigner" : `Garder ${lovedName}`} />
        </Pair>
      )}
      {plan.showCrisis && <CrisisCard />}
    </>
  );
}

function PracticalView({ softDay, night }: { softDay: boolean; night: boolean }) {
  if (softDay || night) {
    return (
      <PrimaryBlock
        eyebrow="Mode doux"
        title="Les démarches peuvent attendre demain."
        cta={{ label: "Se poser un instant", to: "/no-words" }}
        tint="whisper"
      />
    );
  }
  return (
    <>
      <PrimaryBlock
        eyebrow="Tâche prioritaire"
        title="Avancer une étape."
        cta={{ label: "Voir mon plan", to: "/practical" }}
        tint="sun"
      />
      <Pair>
        <SmallCard to="/practical/vault" eyebrow="Coffre" title="Mes documents" />
        <SmallCard to="/_authenticated/circle" eyebrow="Déléguer" title="Demander à un proche" />
      </Pair>
    </>
  );
}

function BothView({ lovedName, stale, plan, softDay, night }: {
  lovedName: string; stale: boolean; plan: ReturnType<typeof emotionPlan>;
  situation: ReturnType<typeof useLegato>["situation"]; softDay: boolean; night: boolean;
}) {
  return (
    <>
      <SectionTitle>Pour vous soutenir aujourd'hui</SectionTitle>
      <PrimaryBlock
        eyebrow={stale ? "Check-in" : "Suggestion"}
        title={stale ? "Où en êtes-vous, là ?" : titleFromPlan(plan)}
        cta={stale ? { label: "Faire un check-in", to: "/care/emotions" } : { label: plan.primary.label, to: plan.primary.to }}
        tint="sun"
      />
      <SectionTitle>Pour avancer concrètement</SectionTitle>
      {softDay || night ? (
        <p className="px-6 mt-2 text-[13px] text-dusk/55 max-w-[34ch]">Les démarches peuvent attendre. Reposez-vous ce soir.</p>
      ) : (
        <PrimaryBlock
          eyebrow="Une seule étape"
          title={`Avancer ${lovedName ? "pour " + lovedName : ""}.`}
          cta={{ label: "Voir mon plan", to: "/practical" }}
          tint="whisper"
        />
      )}
    </>
  );
}

function titleFromPlan(plan: ReturnType<typeof emotionPlan>) {
  if (plan.primary.hint) return plan.primary.hint;
  return "Une petite chose, maintenant.";
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <section className="px-6 pt-10">
      <p className="mono-label">{children}</p>
      <div className="mt-2 h-px bg-dusk/12" />
    </section>
  );
}

function PrimaryBlock({ eyebrow, title, cta, tint }: {
  eyebrow: string; title: ReactNode; cta: { label: string; to: string }; tint: "sun" | "whisper" | "blush";
}) {
  const bg = tint === "sun" ? "var(--sun)" : tint === "blush" ? "var(--blush)" : "var(--whisper)";
  return (
    <section className="px-5 pt-6">
      <Link
        to={cta.to as "/journal"}
        className="block rounded-[20px] px-6 pt-7 pb-6"
        style={{ background: bg, color: "var(--dusk)" }}
      >
        <p className="mono-label">{eyebrow}</p>
        <h2 className="mt-5 font-serif font-normal text-[26px] leading-[1.15] max-w-[18ch]">{title}</h2>
        <div className="mt-6 flex items-center justify-between">
          <span className="mono-label" style={{ color: "var(--terracotta)" }}>{cta.label} →</span>
          <span
            className="h-10 w-10 rounded-full grid place-items-center text-paper text-[16px]"
            style={{ background: "var(--terracotta)" }}
          >→</span>
        </div>
      </Link>
    </section>
  );
}

function Pair({ children }: { children: ReactNode }) {
  return <section className="px-5 pt-3 grid grid-cols-2 gap-3">{children}</section>;
}

function SmallCard({ to, eyebrow, title }: { to: string; eyebrow: string; title: string }) {
  return (
    <Link
      to={to as "/journal"}
      className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 pt-5 pb-4 flex flex-col justify-between min-h-[120px]"
    >
      <div>
        <p className="mono-label">{eyebrow}</p>
        <p className="mt-3 font-serif text-[19px] leading-[1.1]">{title}</p>
      </div>
      <span className="self-end text-dusk/55 text-[16px]">→</span>
    </Link>
  );
}

function CrisisCard() {
  return (
    <section className="px-5 pt-3">
      <Link to="/crisis" className="block rounded-[18px] px-5 py-4" style={{ background: "var(--blush)" }}>
        <p className="mono-label" style={{ color: "var(--terracotta)" }}>Si ça déborde</p>
        <p className="mt-2 font-serif text-[17px] text-dusk">Parler à quelqu'un, maintenant.</p>
      </Link>
    </section>
  );
}

function SoftBanner() {
  return (
    <div className="mx-6 mt-4 rounded-[14px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-3">
      <p className="mono-label" style={{ color: "var(--terracotta)" }}>Mode doux</p>
      <p className="mt-1 text-[12.5px] text-dusk/65 italic">Activé jusqu'à demain. Les démarches non urgentes sont masquées.</p>
    </div>
  );
}

function NightBanner() {
  return (
    <div className="mx-6 mt-4 rounded-[14px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-3">
      <p className="mono-label">Mode nuit</p>
      <p className="mt-1 text-[12.5px] text-dusk/65 italic">Une voix calme, un souffle, rien à faire ce soir.</p>
    </div>
  );
}

function greetingForHour() {
  const h = new Date().getHours();
  if (h < 5) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}