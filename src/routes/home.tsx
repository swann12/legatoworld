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

        {/* ═══════════ UNIVERS 1 — INTÉRIEUR ═══════════
         * Tout ce qui touche au ressenti, au lien, à la traversée intime.
         * Présence (oreille calme), Journal, Jardin de souvenir, Sans-mots. */}
        <section className="px-7 pt-14">
          <div className="flex items-baseline gap-3">
            <span
              className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--bordeaux)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {lang === "fr" ? "I · Intérieur" : "I · Inner"}
            </span>
            <span className="flex-1 h-px bg-dusk/15" />
          </div>
          <p className="mt-4 font-serif italic text-[17px] leading-snug text-dusk/75 max-w-[32ch]">
            {lang === "fr"
              ? "Ce qui se vit en dedans. Une oreille, une page, un souvenir."
              : "What is lived inside. An ear, a page, a memory."}
          </p>

          {/* Carte feature Présence — bordeaux profond */}
          <Link
            to="/presence"
            className="mt-6 block rounded-[18px] overflow-hidden text-[color:var(--paper)]"
            style={{ background: "var(--bordeaux)" }}
          >
            <div className="px-6 pt-7 pb-6">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/60"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lang === "fr" ? "Présence · accompagnement intime" : "Presence · inner companion"}
              </p>
              <p className="mt-4 font-serif text-[26px] leading-[1.1]" style={{ textWrap: "balance" }}>
                {lang === "fr" ? (
                  <>Parler à une présence,<br /><span className="italic">sans rien devoir dire.</span></>
                ) : (
                  <>Speak to a presence,<br /><span className="italic">with nothing owed.</span></>
                )}
              </p>
              <p className="mt-4 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/72 max-w-[34ch]">
                {lang === "fr"
                  ? "Une oreille calme, à toute heure. Vous racontez, ou pas."
                  : "A quiet ear, anytime. You speak, or not."}
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

          {/* Trois portes intérieures, sous la carte */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            {INNER_DOORS.map((d) => (
              <Link
                key={d.to}
                to={d.to as never}
                className="block rounded-[14px] p-4 min-h-[110px] flex flex-col justify-between"
                style={{ background: d.bg }}
              >
                <p
                  className="text-[9px] uppercase tracking-[0.24em] text-dusk/60"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {d.eyebrow[lang]}
                </p>
                <p
                  className="font-serif italic text-[15px] leading-[1.2] text-dusk"
                  style={{ textWrap: "balance" }}
                >
                  {d.title[lang]}
                </p>
              </Link>
            ))}
          </div>

          {/* Lien jardin — souvenir vivant lié à la personne */}
          <Link
            to="/garden"
            className="mt-4 block border-t border-dusk/15 pt-4 flex items-baseline justify-between gap-4"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lang === "fr" ? "Le jardin de" : "The garden of"}{" "}
                <span className="text-dusk/75">{lostName}</span>
              </p>
              <p className="mt-1 font-serif italic text-[17px] text-dusk">
                {lang === "fr" ? "Y déposer un souvenir." : "Plant a memory there."}
              </p>
            </div>
            <span className="text-dusk/55 text-sm shrink-0">→</span>
          </Link>
        </section>

        {/* ═══════════ UNIVERS 2 — CONCRET ═══════════
         * Tout ce qui s'organise, se décide, se transmet.
         * Démarches, cérémonie, volontés, ressources. */}
        <section className="px-7 pt-16">
          <div className="flex items-baseline gap-3">
            <span
              className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--sage-deep,var(--dusk))]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {lang === "fr" ? "II · Concret" : "II · Concrete"}
            </span>
            <span className="flex-1 h-px bg-dusk/15" />
          </div>
          <p className="mt-4 font-serif italic text-[17px] leading-snug text-dusk/75 max-w-[32ch]">
            {lang === "fr"
              ? "Ce qui s'organise dehors. Un seul pas à la fois, sans urgence."
              : "What is arranged outside. One step at a time, no rush."}
          </p>

          {/* Carte feature Avancer — sage profond */}
          <Link
            to="/practical"
            className="mt-6 block rounded-[18px] overflow-hidden"
            style={{ background: "var(--sage)" }}
          >
            <div className="px-6 pt-7 pb-6">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lang === "fr" ? "Avancer · accompagnement concret" : "Move on · concrete steps"}
              </p>
              <p className="mt-4 font-serif text-[26px] leading-[1.1] text-dusk" style={{ textWrap: "balance" }}>
                {lang === "fr" ? (
                  <>Les démarches,<br /><span className="italic">un pas à la fois.</span></>
                ) : (
                  <>The steps,<br /><span className="italic">one at a time.</span></>
                )}
              </p>
              <p className="mt-4 text-[13.5px] leading-[1.55] text-dusk/70 max-w-[34ch]">
                {lang === "fr"
                  ? "Démarches, cérémonie, atmosphère, partage. Quatre portes claires, jamais imposées."
                  : "Paperwork, ceremony, atmosphere, sharing. Four clear doors, never imposed."}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span
                  className="text-[11px] uppercase tracking-[0.24em] text-dusk/75"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {lang === "fr" ? "Ouvrir" : "Open"}
                </span>
                <span className="text-dusk/60 text-base">→</span>
              </div>
            </div>
          </Link>

          {/* Volontés — secondaire, en lien sobre */}
          <Link
            to="/wishes"
            className="mt-4 block border-t border-dusk/15 pt-4 flex items-baseline justify-between gap-4"
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lang === "fr" ? "Mes volontés" : "My wishes"}
              </p>
              <p className="mt-1 font-serif italic text-[17px] text-dusk">
                {lang === "fr" ? "Écrire ce que je voudrais, pour le jour venu." : "Write what I would wish, when the day comes."}
              </p>
            </div>
            <span className="text-dusk/55 text-sm shrink-0">→</span>
          </Link>
        </section>

        {/* ─── Mode discret — chips minces ─── */}
        <section className="px-7 pt-14">
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
    to: "/practical",
    bg: "var(--sage)",
    eyebrow: { fr: "Avancer", en: "Move forward" },
    title: { fr: "Un seul pas, à votre rythme.", en: "One step, your pace." },
  },
  {
    to: "/no-words",
    bg: "var(--sky)",
    eyebrow: { fr: "Sans mots", en: "Without words" },
    title: { fr: "Respirer, écouter.", en: "Breathe, listen." },
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