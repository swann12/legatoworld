import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { ThemeToggle } from "@/components/legato/ThemeToggle";
import { useLegato, MODES } from "@/lib/legato-state";
import type { Mode } from "@/lib/legato-state";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Aujourd'hui — Legato" },
      { name: "description", content: "Un intérieur tranquille pour traverser, se souvenir, avancer." },
    ],
  }),
  component: Home,
});

/* ─── Editorial home — Papier & Terre, magazine intime ───
 * Inspiré de Un. / LeLiv / Grief Guidance : cream chaud, encre bordeaux-brun,
 * une seule porte mise en avant (carte bordeaux pleine), grille sobre en dessous.
 * Pas d'effet glass. Hiérarchie typographique éditoriale (Instrument Serif +
 * mono pour les eyebrows). Une intention par bloc, rien de superflu. */

function Home() {
  const { name, lostName, mode, lang, setLang } = useLegato();
  const today = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const intent = INTENT[mode][lang];

  return (
    <Shell>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        {/* ─── Bandeau éditorial ─── */}
        <header className="px-7 pt-10">
          <div className="flex items-center justify-between">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Legato · {today}
            </p>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                className="text-[10px] uppercase tracking-[0.22em] text-dusk/55 px-2 py-1"
                style={{ fontFamily: "var(--font-mono)" }}
                aria-label="Toggle language"
              >
                {lang.toUpperCase()}
              </button>
              <Link
                to="/space"
                className="size-8 rounded-full border border-dusk/20 flex items-center justify-center hover:bg-dusk/5 transition-colors"
                aria-label="Mon espace"
              >
                <span className="font-serif italic text-[14px] text-dusk">
                  {name.charAt(0).toUpperCase()}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* ─── Salutation éditoriale ─── */}
        <section className="px-7 pt-16">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {lang === "fr" ? "Aujourd'hui" : "Today"}
          </p>
          <h1
            className="mt-4 font-serif text-[40px] leading-[1.02] text-dusk font-light"
            style={{ textWrap: "balance" }}
          >
            {lang === "fr" ? <>Bonjour {name},</> : <>Hello {name},</>}
            <br />
            <span className="italic text-dusk/80">{intent.greeting}</span>
          </h1>
          <p className="mt-6 max-w-[32ch] text-[14.5px] leading-[1.6] text-dusk/65">
            {intent.sub}
          </p>
        </section>

        {/* ─── Carte feature — bordeaux profond, esprit LeLiv ─── */}
        <section className="px-7 pt-12">
          <Link
            to="/presence"
            className="block rounded-[18px] overflow-hidden text-[color:var(--paper)] relative"
            style={{ background: "var(--bordeaux)" }}
          >
            <div className="px-6 pt-7 pb-6">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/60"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lang === "fr" ? "La porte calme" : "The quiet door"}
              </p>
              <p
                className="mt-4 font-serif text-[28px] leading-[1.1]"
                style={{ textWrap: "balance" }}
              >
                {lang === "fr" ? (
                  <>
                    Parler à une présence,
                    <br />
                    <span className="italic">sans rien devoir dire.</span>
                  </>
                ) : (
                  <>
                    Speak to a presence,
                    <br />
                    <span className="italic">with nothing owed.</span>
                  </>
                )}
              </p>
              <p className="mt-4 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/72 max-w-[34ch]">
                {lang === "fr"
                  ? "Une oreille calme, à toute heure. Vous racontez, ou pas. On vous accompagne."
                  : "A quiet ear, anytime. You speak, or not. We stay close."}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span
                  className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--paper)]/80"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {lang === "fr" ? "Entrer" : "Enter"}
                </span>
                <span className="text-[color:var(--paper)]/70 text-base">→</span>
              </div>
            </div>
          </Link>
        </section>

        {/* ─── Grille magazine — quatre portes ─── */}
        <section className="px-7 pt-3">
          <div className="grid grid-cols-2 gap-3">
            {DOORS.map((d) => (
              <Link
                key={d.to}
                to={d.to as never}
                className="block rounded-[14px] p-5 min-h-[148px] flex flex-col justify-between"
                style={{ background: d.bg }}
              >
                <p
                  className="text-[9px] uppercase tracking-[0.26em] text-dusk/60"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {d.eyebrow[lang]}
                </p>
                <p
                  className="font-serif italic text-[19px] leading-[1.2] text-dusk"
                  style={{ textWrap: "balance" }}
                >
                  {d.title[lang]}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Bandeau jardin — souvenir vivant ─── */}
        <section className="px-7 pt-10">
          <Link
            to="/garden"
            className="block border-y border-dusk/15 py-6 flex items-baseline justify-between gap-4"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lang === "fr" ? "Le jardin de" : "The garden of"}{" "}
                <span className="not-italic text-dusk/75">{lostName}</span>
              </p>
              <p className="mt-2 font-serif text-[22px] leading-tight text-dusk">
                <span className="italic">{lang === "fr" ? "Y déposer un souvenir." : "Plant a memory there."}</span>
              </p>
            </div>
            <span className="text-dusk/55 text-sm shrink-0">→</span>
          </Link>
        </section>

        {/* ─── Mode discret — chips minces ─── */}
        <section className="px-7 pt-8">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {lang === "fr" ? "Comment je me sens" : "How I feel"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MODES.map((m) => (
              <ModeChip key={m.id} id={m.id} label={m.label} active={m.id === mode} />
            ))}
          </div>
        </section>

        {/* ─── Porte de crise — toujours là, jamais bruyante ─── */}
        <section className="px-7 pt-10">
          <Link
            to="/crisis"
            className="block border-t border-dusk/15 pt-5 flex items-baseline justify-between"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--terracotta)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lang === "fr" ? "Si aujourd'hui pèse trop" : "If today is too heavy"}
              </p>
              <p className="mt-1 font-serif italic text-[17px] text-dusk">
                {lang === "fr" ? "Une porte calme, ouverte." : "A quiet door, open."}
              </p>
            </div>
            <span className="text-dusk/55 text-sm">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

/* ─── data ─── */

const DOORS: {
  to: string;
  bg: string;
  eyebrow: { fr: string; en: string };
  title: { fr: string; en: string };
}[] = [
  {
    to: "/journal",
    bg: "var(--clay)",
    eyebrow: { fr: "Journal", en: "Journal" },
    title: { fr: "Déposer une pensée.", en: "Set a thought down." },
  },
  {
    to: "/no-words",
    bg: "var(--sky)",
    eyebrow: { fr: "Sans mots", en: "Without words" },
    title: { fr: "Respirer, écouter.", en: "Breathe, listen." },
  },
  {
    to: "/practical",
    bg: "var(--sage)",
    eyebrow: { fr: "Avancer", en: "Move forward" },
    title: { fr: "Un seul pas, à votre rythme.", en: "One step, your pace." },
  },
  {
    to: "/wishes",
    bg: "var(--blush)",
    eyebrow: { fr: "Préparer", en: "Prepare" },
    title: { fr: "Mes volontés, en douceur.", en: "My wishes, gently." },
  },
];

const INTENT: Record<Mode, { fr: { greeting: string; sub: string }; en: { greeting: string; sub: string } }> = {
  cocoon: {
    fr: { greeting: "se replier un peu.", sub: "Rien à faire aujourd'hui. Le souvenir reste tout près." },
    en: { greeting: "fold inward, gently.", sub: "Nothing to do today. The memory stays close." },
  },
  anchoring: {
    fr: { greeting: "poser un pied par terre.", sub: "Des repères simples, sans pression. Un pas, puis l'autre." },
    en: { greeting: "find solid ground.", sub: "Simple anchors, no pressure. One step, then another." },
  },
  breath: {
    fr: { greeting: "laisser un peu d'air.", sub: "Quelques respirations, quelques images. Sans rien chercher." },
    en: { greeting: "let some air in.", sub: "A few breaths, a few images. Nothing to seek." },
  },
  relay: {
    fr: { greeting: "ne pas porter seul·e.", sub: "Confier ce qui pèse. Une présence, un proche, un appel." },
    en: { greeting: "don't carry alone.", sub: "Let it be heard. A presence, a friend, a call." },
  },
};

function ModeChip({ id, label, active }: { id: Mode; label: string; active: boolean }) {
  const { setMode } = useLegato();
  return (
    <button
      onClick={() => setMode(id)}
      className={[
        "px-3.5 py-1.5 rounded-full text-[12px] tracking-wide border transition-colors",
        active
          ? "bg-dusk text-paper border-dusk"
          : "border-dusk/20 text-dusk/75 hover:bg-dusk/5",
      ].join(" ")}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {label}
    </button>
  );
}