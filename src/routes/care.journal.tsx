import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/care/journal")({
  head: () => ({
    meta: [
      { title: "Journal intime — Legato" },
      { name: "description", content: "Un carnet privé : écrire ce qui vient, sans relire, et garder chaque page." },
      { property: "og:title", content: "Journal intime — Legato" },
      { property: "og:description", content: "Écrire ce qui vient, sans relire. Vos pages restent avec vous." },
    ],
  }),
  component: CareJournal,
});

const AMORCES = [
  "Aujourd'hui, ce qui pèse c'est…",
  "Je voudrais te dire que…",
  "Ce dont je me souviens…",
  "Ce qui m'a aidé·e…",
];

const DEST: { id: "them" | "self" | "free"; label: string }[] = [
  { id: "them", label: "À iel" },
  { id: "self", label: "À moi" },
  { id: "free", label: "Libre" },
];

function jourLong(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

/** Papier réglé : interlignes fins, comme un carnet tenu à la main. */
const RULED: React.CSSProperties = {
  background: "var(--whisper)",
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 30px, color-mix(in oklab, var(--dusk) 9%, transparent) 30px, color-mix(in oklab, var(--dusk) 9%, transparent) 31px)",
  backgroundPosition: "0 14px",
};

function CareJournal() {
  const { journal, addJournalEntry } = useLegato();
  const lovedName = useLovedName();
  const [body, setBody] = useState("");
  const [to, setTo] = useState<"them" | "self" | "free">("them");
  const [showPrompts, setShowPrompts] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const today = useMemo(() => jourLong(new Date().toISOString()), []);

  const save = () => {
    if (!body.trim()) return;
    addJournalEntry({ body: body.trim(), to });
    setBody("");
    setShowPrompts(false);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2600);
  };

  const dest = DEST.map((d) => ({ ...d, label: d.id === "them" ? lovedName : d.label }));
  const destName = to === "them" ? lovedName : to === "self" ? "moi" : null;

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <header className="px-6 pt-7">
          <Link to="/care" aria-label="Retour" className="text-[15px] leading-none text-dusk/50">←</Link>
        </header>

        <section className="px-6 pt-6">
          <p className="mono-label">Journal intime</p>
          <h1 className="mt-4 font-serif text-[32px] leading-[1.06]">
            Votre <span className="italic" style={{ color: "var(--terracotta)" }}>carnet</span>, rien qu'à vous.
          </h1>
          <p className="mt-3 max-w-[32ch] text-[13px] leading-[1.55] text-dusk/55">
            Personne ne lit. Pas besoin de phrases justes.
          </p>
        </section>

        {/* La feuille : date écrite en haut, lignes, marge, numéro de page */}
        <section className="px-5 pt-7">
          <div
            className="relative overflow-hidden rounded-[6px] px-6 pt-6 pb-5"
            style={{
              ...RULED,
              border: "1px solid color-mix(in oklab, var(--dusk) 14%, transparent)",
              boxShadow: "0 18px 40px -34px color-mix(in oklab, var(--dusk) 70%, transparent)",
            }}
          >
            {/* marge de carnet */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0"
              style={{ left: 22, width: 1, background: "color-mix(in oklab, var(--terracotta) 32%, transparent)" }}
            />
            <p className="font-serif text-[15px] italic text-dusk/55">
              {today}
              {destName ? <> — pour {destName}</> : null}
            </p>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              placeholder="Laissez les mots venir, sans relire…"
              className="mt-3 w-full resize-none bg-transparent font-serif text-[17px] leading-[31px] text-dusk outline-none placeholder:text-dusk/28"
            />

            <div className="mt-1 flex items-center justify-between">
              <span className="text-[11px] tabular-nums tracking-[0.1em] text-dusk/35">
                page {String(journal.length + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => setShowPrompts((v) => !v)}
                className="text-[12px] text-dusk/45 underline decoration-dotted underline-offset-4"
              >
                {showPrompts ? "Masquer" : "Si les mots ne viennent pas"}
              </button>
            </div>

            {showPrompts && (
              <div className="mt-3 flex flex-col gap-2 border-t border-dashed pt-3"
                style={{ borderColor: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}>
                {AMORCES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { setBody((b) => (b ? b : a + " ")); setShowPrompts(false); }}
                    className="text-left font-serif text-[16px] italic leading-[1.35] text-dusk/65"
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* À qui j'écris — discret, sous la feuille */}
        <section className="px-6 pt-5">
          <p className="text-[11.5px] text-dusk/45">J'écris…</p>
          <div className="mt-2.5 flex gap-2">
            {dest.map((d) => {
              const on = to === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setTo(d.id)}
                  className="rounded-full px-4 py-2 text-[12.5px] transition-colors"
                  style={{
                    border: "1px dashed color-mix(in oklab, var(--dusk) 22%, transparent)",
                    background: on ? "var(--terracotta)" : "transparent",
                    borderColor: on ? "transparent" : undefined,
                    color: on ? "var(--paper)" : "color-mix(in oklab, var(--dusk) 60%, transparent)",
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-6 pt-6">
          <button
            onClick={save}
            disabled={!body.trim()}
            className="w-full rounded-full py-3.5 text-[13px] tracking-[0.05em] disabled:opacity-30"
            style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
          >
            Garder cette page
          </button>
          {justSaved && (
            <p className="mt-3 text-center font-serif text-[15px] italic text-dusk/55">
              Votre page est rangée dans le carnet.
            </p>
          )}
        </section>

        {/* Les pages gardées */}
        {journal.length > 0 && (
          <section className="px-5 pt-11">
            <div className="flex items-baseline justify-between px-1">
              <p className="mono-label">Pages gardées</p>
              <span className="text-[11px] tabular-nums text-dusk/35">
                {String(journal.length).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {journal.slice(0, 8).map((e, i) => (
                <article
                  key={e.id}
                  className="relative overflow-hidden rounded-[4px] px-5 py-4"
                  style={{
                    ...RULED,
                    border: "1px solid color-mix(in oklab, var(--dusk) 12%, transparent)",
                    transform: `rotate(${i % 2 === 0 ? -0.35 : 0.3}deg)`,
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0"
                    style={{
                      width: 18, height: 18,
                      background: "color-mix(in oklab, var(--clay) 80%, var(--paper))",
                      clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                    }}
                  />
                  <p className="font-serif text-[13.5px] italic text-dusk/50">{jourLong(e.date)}</p>
                  <p className="mt-1.5 line-clamp-4 font-serif text-[15px] leading-[26px] text-dusk/80">{e.body}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </Shell>
  );
}
