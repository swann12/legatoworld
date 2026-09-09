import { createFileRoute, Link } from "@tanstack/react-router";
import { Plate } from "@/components/legato/Plate";
import { Shell } from "@/components/legato/Shell";
import { useLegato, type Emotion } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import { journeyModules, CARE_LABELS, type CareModule } from "@/lib/journey-config";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { emotionPlan, isEmotionStale } from "@/lib/emotion-routing";
import { DateNudge } from "@/components/legato/DateNudge";
import { IndexMark } from "@/components/legato/Viz";
import { NextActions } from "@/components/legato/NextActions";



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
      <main className="wash-blush min-h-dvh text-dusk pb-32">
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
          <p className="mono-label">Soutien</p>
          <h1 className="mt-4 ed-page-title">
            Un espace pour <span className="italic" style={{ color: "var(--terracotta)" }}>traverser</span>.
          </h1>
          <Plate name="presence" className="mt-6" ratio="4 / 3" priority />
        </section>

        <DateNudge />
        <NextActions />


        <section className="px-5 pt-8">
          <Link
            to={(stale ? "/care/emotions" : plan.primary.to) as "/care/emotions"}
            className="surf-sumi block rounded-[22px] px-6 pt-7 pb-6"
          >
            <p className="mono-label">{stale ? "Check-in" : focus.label}</p>
            <h2 className="mt-4 font-serif font-normal text-[26px] leading-[1.12] max-w-[16ch]">
              {stale ? "Comment vous sentez-vous ?" : focus.title}
            </h2>
            <span className="mt-6 inline-block mono-label">
              {stale ? "Nommer" : plan.primary.label} →
            </span>
          </Link>
        </section>


        {!light && primaryCare.length > 0 && (
          <section className="px-5 pt-7">
            <SectionKicker label="Maintenant" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {primaryCare.map((m, i) => <CareTile key={m} module={m} i={i} />)}
            </div>
          </section>
        )}

        {!light && (
        <section className="px-5 pt-9">
          <SectionKicker label="Présence & mémoire" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              to="/presence"
              className="flex min-h-[104px] flex-col justify-between rounded-[18px] px-5 py-4"
              style={{ background: TINT_MEMORY }}
            >
              <IndexMark i={1} total={3} />
              <p className="font-serif text-[20px] leading-[1.1]">Se confier</p>
            </Link>
            <Link
              to="/care/garden"
              className="flex min-h-[104px] flex-col justify-between rounded-[18px] px-5 py-4"
              style={{ background: TINT_MEMORY }}
            >
              <IndexMark i={2} total={3} />
              <p className="font-serif text-[20px] leading-[1.1]">{lovedName}</p>
            </Link>

          </div>
          <Link to="/care/rituels" className="craft mt-3 flex items-center justify-between gap-3 px-5 py-4">
            <p className="font-serif text-[18px] leading-[1.15]">Rituels d'hommage</p>
            <IndexMark i={3} total={3} />
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
      bg: "surf-pearl",
      modules: ["checkin", "journal"],
      hidden: [],
    };
  }
  if (emotions.some((e) => e === "peur" || e === "anxiete" || e === "besoin_calme")) {
    return { label: "Peur / anxiété", title: "Revenir au corps avant le reste.", intro: "Respiration courte, ancrage, journal bref et aide humaine accessible.", bg: "surf-sand", modules: ["breathe", "journal", "crisis"], hidden: [] };
  }
  if (emotions.includes("fatigue")) {
    return { label: "Fatigue", title: "Moins de contenu, plus de repos.", intro: "Juste se poser. Tout le reste peut attendre.", bg: "surf-pearl", modules: ["sleep", "breathe"], hidden: ["meditations"] };
  }
  if (emotions.includes("nostalgie")) {
    return { label: "Nostalgie", title: "Transformer le manque en trace.", intro: "Vos souvenirs passent devant.", bg: "surf-blush", modules: ["letters", "journal"], hidden: [] };
  }
  if (emotions.includes("solitude") || emotions.includes("besoin_aide")) {
    return { label: "Vous n'êtes pas seul·e", title: "Ne pas rester seul·e avec ça.", intro: "Vos appuis humains passent devant.", bg: "surf-blush", modules: ["community", "therapists"], hidden: [] };
  }
  if (emotions.includes("culpabilite") || emotions.includes("colere")) {
    return { label: "Ce qui pèse", title: "Déposer sans juger.", intro: "Écrire avant tout le reste.", bg: "surf-butter", modules: ["journal", "breathe"], hidden: [] };
  }
  return { label: "Soutien adapté", title: "Une petite chose, maintenant.", intro: "", bg: "surf-pearl", modules: ["journal", "breathe"], hidden: [] };
}


/** Une seule teinte par section — jamais d'alternance de couleurs. */
const TINT_NOW = "color-mix(in oklab, var(--blush) 78%, var(--whisper))";
const TINT_MEMORY = "color-mix(in oklab, var(--sun) 100%, var(--whisper))";



function CareTile({ module: m }: { module: CareModule; i?: number }) {
  const cfg = CARE_LABELS[m];
  return (
    <Link
      to={cfg.to as "/care/journal"}
      className="flex min-h-[104px] flex-col justify-end rounded-[18px] px-5 py-4"
      style={{ background: TINT_NOW }}
    >
      <p className="font-serif text-[19px] leading-[1.15] text-dusk">{cfg.label}</p>
    </Link>
  );
}


function CareRow({ module: m }: { module: CareModule }) {
  const cfg = CARE_LABELS[m];
  return <SimpleRow to={cfg.to} label={cfg.label} />;
}

function SimpleRow({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to as "/care/memory"} className="flex items-center justify-between gap-4 border-b border-dashed border-dusk/20 px-1 py-3.5">
      <p className="font-serif text-[18px] leading-[1.2] text-dusk">{label}</p>
      <span className="text-dusk/35 text-[15px]">→</span>
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