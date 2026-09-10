import { createFileRoute, Link } from "@tanstack/react-router";
import presenceImg from "@/assets/hero-care.webp";
import { Shell } from "@/components/legato/Shell";
import { useLegato, type Emotion } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import { journeyModules, CARE_LABELS, type CareModule } from "@/lib/journey-config";
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
    lovedOneRelation, legallyInvolved, hydrated, lightMode,
  } = useLegato();
  const lovedName = useLovedName();
  const { care } = journeyModules(situation, primaryNeed, stage, { relation: lovedOneRelation, legallyInvolved });
  const plan = emotionPlan(hydrated ? currentEmotions : []);
  const stale = hydrated ? isEmotionStale(currentEmotionAt) : true;
  const selected = hydrated ? currentEmotions : [];
  const light = hydrated && lightMode;
  const focus = focusFromEmotions(selected, stale);
  const visibleCare = care.filter((m) => !focus.hidden.includes(m));
 // La carte principale mène déjà au check-in : on ne le répète pas en tuile.
 const primaryCare = focus.modules.filter((m) => visibleCare.includes(m) && m !== "checkin");
  

  return (
    <Shell livingBg={false}>
      <main className="wash-blush min-h-dvh text-dusk pb-32">
        {/* Deux fonds superposés : la planche illustrée, puis la feuille crème qui remonte dessus. */}
        <section className="pt-0">
          <div className="relative">
            <div className="overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
              <img
                src={presenceImg}
                alt="Illustration peinte : une silhouette marche sur une dune sous un ciel bleu nuagé"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div
              className="relative -mt-28 rounded-t-[26px] px-6 pt-7 pb-7"
              style={{
                background: "var(--paper)",
                boxShadow: "0 -14px 40px -22px color-mix(in oklab, var(--bordeaux) 55%, transparent)",
              }}
            >

              <p className="mono-label">Soutien</p>
              <h1 className="mt-3 ed-page-title">
                Un espace pour <span className="italic" style={{ color: "var(--terracotta)" }}>traverser</span>.
              </h1>
            </div>
          </div>
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

        {/* Se confier — l'entrée la plus importante de Soutien : de l'air, un filet d'encre, rien d'autre. */}
        <section className="px-5 pt-10">
          <Link
            to="/presence"
            className="block px-2"
            style={{
              borderTop: "1px solid color-mix(in oklab, var(--bordeaux) 55%, transparent)",
              borderBottom: "1px solid color-mix(in oklab, var(--bordeaux) 20%, transparent)",
            }}
          >
            <span className="block pt-6 text-[10px] uppercase tracking-[0.2em] text-dusk/45" style={{ fontFamily: "var(--font-mono)" }}>
              À toute heure, sans rendez-vous
            </span>
            <span className="mt-3 block font-serif text-[40px] leading-[1.02]" style={{ color: "var(--bordeaux)" }}>
              Se confier
            </span>
            <span className="mt-3 block max-w-[28ch] text-[13.5px] leading-[1.55] text-dusk/60">
              Dire ce que vous ne diriez à personne. Rien n'est jugé, rien n'est perdu.
            </span>
            <span className="mb-6 mt-5 flex items-center gap-2 text-[12.5px]" style={{ color: "var(--bordeaux)" }}>
              Commencer <span aria-hidden>→</span>
            </span>
          </Link>
        </section>

        {!light && (
        <section className="px-5 pt-9">
          <SectionKicker label="Présence & mémoire" />
          <p className="mt-3 px-1 text-[13px] leading-[1.55] text-dusk/60 max-w-[38ch]">
            Retrouver {lovedName ? lovedName : "la personne"}, déposer un souvenir, nourrir le Jardin.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/care/garden" className="craft flex min-h-[96px] flex-col justify-between px-5 py-4">
              <IndexMark i={1} total={2} />
              <span className="block font-serif text-[19px] leading-[1.1]">Le Jardin</span>
            </Link>
            <Link to="/care/rituels" className="craft flex min-h-[96px] flex-col justify-between px-5 py-4">
              <IndexMark i={2} total={2} />
              <span className="block font-serif text-[19px] leading-[1.1]">Rituels</span>
            </Link>
          </div>
        </section>
        )}

        {!light && (
          <section className="px-5 pt-9">
            <SectionKicker label="Vos jours" />
            <Link
              to="/agenda"
              className="mt-4 flex items-center justify-between gap-4 rounded-[20px] px-6 py-6"
              style={{ background: "color-mix(in oklab, var(--blush) 62%, var(--whisper))" }}
            >
              <span>
                <span className="mono-label block">Agenda</span>
                <span className="mt-2 block font-serif text-[22px] leading-[1.1]">Vos rendez-vous et vos démarches</span>
                <span className="mt-1 block text-[12.5px] text-dusk/60">Une seule vue, personnelle et pratique.</span>
              </span>
              <span aria-hidden className="text-dusk/40">→</span>
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link to="/care/dates" className="craft px-5 py-4 font-serif text-[17px] leading-[1.15]">Dates importantes</Link>
              <Link to="/care/journal" className="craft px-5 py-4 font-serif text-[17px] leading-[1.15]">Journal intime</Link>
            </div>
          </section>
        )}

        {!light && (
          <section className="px-5 pt-9">
            <SectionKicker label="Appuis" />
            <div className="mt-4 flex flex-col">
              <SimpleRow to="/care/respirer" label="Respirer" />
              <SimpleRow to="/no-words" label="Sans mots" />
              <SimpleRow to="/care/community" label="Communauté" />
              <SimpleRow to="/care/aide" label="Aide humaine" />
              <SimpleRow to="/care/resources" label="Ressources" />
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