import { createFileRoute, Link } from "@tanstack/react-router";
import { Plate } from "@/components/legato/Plate";
import { Shell } from "@/components/legato/Shell";
import { useLegato, type Emotion } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import { journeyModules, CARE_LABELS, type CareModule } from "@/lib/journey-config";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { emotionPlan, isEmotionStale } from "@/lib/emotion-routing";
import { DateNudge } from "@/components/legato/DateNudge";


export const Route = createFileRoute("/care/")({
  head: () => ({
    meta: [
      { title: "Soutien — Legato" },
      { name: "description", content: "Un espace psychologique guidé : émotions, journal, mémoire, respiration et aide humaine." },
    ],
  }),
  component: Care,
});

function Care() {
  const {
    situation, primaryNeed, stage, currentEmotions, currentEmotionAt,
    lovedOneRelation, legallyInvolved, hydrated, name, lightMode,
  } = useLegato();
  const lovedName = useLovedName();
  const { care } = journeyModules(situation, primaryNeed, stage, { relation: lovedOneRelation, legallyInvolved });
  const plan = emotionPlan(hydrated ? currentEmotions : []);
  const stale = hydrated ? isEmotionStale(currentEmotionAt) : true;
  const selected = hydrated ? currentEmotions : [];
  const light = hydrated && lightMode;
  const focus = focusFromEmotions(selected, stale);
  const visibleCare = care.filter((m) => !focus.hidden.includes(m));
  const primaryCare = focus.modules.filter((m) => visibleCare.includes(m));
  const restCare = visibleCare.filter((m) => !primaryCare.includes(m) && m !== "checkin").slice(0, plan.contentLength === "court" ? 2 : 3);

  return (
    <Shell livingBg={false}>
      <main className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark to="/care" size={20} />
          <Link
            to="/profile"
            aria-label="Mon profil"
            className="inline-flex items-center justify-center rounded-full text-[12px] font-medium"
            style={{ width: 30, height: 30, background: "var(--blush)", color: "var(--dusk)" }}
          >
            {(name || "?").trim().charAt(0).toUpperCase() || "?"}
          </Link>
        </header>

        <section className="px-6 pt-8">
          <p className="mono-label">Soutien psychologique</p>
          <h1 className="mt-5 ed-page-title">
            Un espace pour <span className="italic" style={{ color: "var(--terracotta)" }}>traverser</span>.
          </h1>
          {(stale || focus.intro) && (
            <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[35ch]">
              {stale ? "Commencez par nommer ce qui est là." : focus.intro}
            </p>
          )}
          <Plate name="presence" caption="Ce qui reste tient dans la main" className="mt-7" ratio="1 / 1" priority />
        </section>

        <DateNudge />

        <section className="px-5 pt-8">
          <Link
            to={(stale ? "/care/emotions" : plan.primary.to) as "/care/emotions"}
            className="block rounded-[22px] px-6 pt-7 pb-6"
            style={{ background: focus.bg, color: "var(--dusk)" }}
          >
            <p className="mono-label">{stale ? "Check-in émotionnel" : focus.label}</p>
            <h2 className="mt-5 font-serif font-normal text-[27px] leading-[1.12] max-w-[18ch]">
              {stale ? "Comment vous sentez-vous maintenant ?" : plan.primary.hint ?? focus.title}
            </h2>
            <span className="mt-6 inline-block mono-label text-dusk/80">
              {stale ? "Choisir une émotion" : plan.primary.label} →
            </span>
          </Link>
        </section>

        {!light && primaryCare.length > 0 && (
          <section className="px-5 pt-7">
            <SectionKicker label="À privilégier maintenant" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {primaryCare.map((m) => <CareTile key={m} module={m} />)}
            </div>
          </section>
        )}

        {!light && (
        <section className="px-5 pt-9">
          <SectionKicker label="Présence & mémoire" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/presence" className="rounded-[18px] px-5 py-5 min-h-[120px] flex flex-col justify-between" style={{ background: "var(--terracotta)", color: "var(--paper)" }}>
              <p className="mono-label" style={{ opacity: 0.75 }}>Présence</p>
              <div>
                <p className="font-serif text-[20px] leading-[1.1]">Se confier</p>
                <p className="mt-1 text-[12px]" style={{ opacity: 0.85 }}>Une voix qui écoute.</p>
              </div>
            </Link>
            <Link to="/care/garden" className="rounded-[18px] px-5 py-5 min-h-[120px] flex flex-col justify-between" style={{ background: "var(--blush)" }}>
              <p className="mono-label text-dusk/60">Jardin</p>
              <div>
                <p className="font-serif text-[20px] leading-[1.1] ">{lovedName}</p>
                <p className="mt-1 text-[12px] text-dusk/65">Photos · voix · lettres</p>
              </div>
            </Link>
          </div>
          <Link to="/care/rituels" className="mt-3 block rounded-[18px] px-5 py-4" style={{ background: "var(--sun)" }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mono-label text-dusk/60">Rituels d'hommage</p>
                <p className="mt-1 font-serif text-[17px] leading-[1.15]">Honorer, à votre manière.</p>
              </div>
              <span className="text-dusk/50 text-[16px]">→</span>
            </div>
          </Link>
        </section>
        )}

        {!light && restCare.length > 0 && (
          <section className="px-5 pt-9">
            <SectionKicker label="Autres appuis" />
            <div className="mt-4 flex flex-col gap-3">
              {restCare.map((m) => <CareRow key={m} module={m} />)}
            </div>
          </section>
        )}

        <div className="pt-10" />
      </main>
    </Shell>
  );
}

type Focus = {
  label: string;
  title: string;
  intro: string;
  bg: string;
  modules: CareModule[];
  hidden: CareModule[];
};

function focusFromEmotions(emotions: Emotion[], stale: boolean): Focus {
  if (stale || emotions.length === 0) {
    return {
      label: "Aujourd'hui",
      title: "Une porte d'entrée simple.",
      intro: "Un soutien clair, selon ce que vous ressentez.",
      bg: "var(--sun)",
      modules: ["checkin", "journal"],
      hidden: [],
    };
  }
  if (emotions.some((e) => e === "peur" || e === "anxiete" || e === "besoin_calme")) {
    return { label: "Peur / anxiété", title: "Revenir au corps avant le reste.", intro: "Respiration courte, ancrage, journal bref et aide humaine accessible.", bg: "var(--mist)", modules: ["breathe", "journal", "crisis"], hidden: [] };
  }
  if (emotions.includes("fatigue")) {
    return { label: "Fatigue", title: "Moins de contenu, plus de repos.", intro: "Juste se poser. Tout le reste peut attendre.", bg: "var(--sky)", modules: ["sleep", "breathe"], hidden: ["meditations"] };
  }
  if (emotions.includes("nostalgie")) {
    return { label: "Nostalgie", title: "Transformer le manque en trace.", intro: "Vos souvenirs passent devant.", bg: "var(--blush)", modules: ["letters", "journal"], hidden: [] };
  }
  if (emotions.includes("solitude") || emotions.includes("besoin_aide")) {
    return { label: "Vous n'êtes pas seul·e", title: "Ne pas rester seul·e avec ça.", intro: "Vos appuis humains passent devant.", bg: "var(--sun)", modules: ["community", "therapists"], hidden: [] };
  }
  if (emotions.includes("culpabilite") || emotions.includes("colere")) {
    return { label: "Ce qui pèse", title: "Déposer sans juger.", intro: "Écrire avant tout le reste.", bg: "var(--blush)", modules: ["journal", "breathe"], hidden: [] };
  }
  return { label: "Soutien adapté", title: "Une petite chose, maintenant.", intro: "", bg: "var(--sun)", modules: ["journal", "breathe"], hidden: [] };
}

function CareTile({ module: m }: { module: CareModule }) {
  const cfg = CARE_LABELS[m];
  return (
    <Link to={cfg.to as "/care/journal"} className="rounded-[16px] border border-dusk/12 bg-paper px-4 py-4 min-h-[116px] flex flex-col justify-between">
      <div>
        <p className="font-serif text-[18px] leading-[1.15] text-dusk">{cfg.label}</p>
        <p className="mt-2 text-[12px] leading-[1.35] text-dusk/55">{cfg.hint}</p>
      </div>
      <span className="self-end text-dusk/45">→</span>
    </Link>
  );
}

function CareRow({ module: m }: { module: CareModule }) {
  const cfg = CARE_LABELS[m];
  return <SimpleRow to={cfg.to} label={cfg.label} hint={cfg.hint} />;
}

function SimpleRow({ to, label, hint }: { to: string; label: string; hint: string }) {
  return (
    <Link to={to as "/care/memory"} className="block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-[18px] leading-[1.2] text-dusk">{label}</p>
          <p className="mt-1 text-[12.5px] text-dusk/55">{hint}</p>
        </div>
        <span className="text-dusk/40 text-[16px]">→</span>
      </div>
    </Link>
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