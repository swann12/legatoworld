import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/care/journal")({
  head: () => ({
    meta: [
      { title: "Mon journal intime — Legato" },
      { name: "description", content: "Un carnet privé : écrire ce qui vient, sans relire, et garder chaque page." },
      { property: "og:title", content: "Mon journal intime — Legato" },
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

function jourLong(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

function CareJournal() {
  const { journal, addJournalEntry } = useLegato();
  const lovedName = useLovedName();
  const [body, setBody] = useState("");
  const [to, setTo] = useState<"them" | "self" | "free">("free");
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

  const dest: { id: "free" | "them" | "self"; label: string }[] = [
    { id: "free", label: "Pour moi seul·e" },
    { id: "them", label: lovedName ? `À ${lovedName}` : "À iel" },
    { id: "self", label: "À moi, plus tard" },
  ];

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <header className="px-6 pt-7">
          <Link to="/care" aria-label="Retour" className="text-[15px] leading-none text-dusk/45">←</Link>
        </header>

        <section className="px-6 pt-8">
          <p className="mono-label">Mon journal intime</p>
          <h1 className="mt-4 font-serif text-[30px] leading-[1.08]">
            Écrire, <span className="italic" style={{ color: "var(--terracotta)" }}>sans relire</span>.
          </h1>
          <p className="mt-3 max-w-[30ch] text-[13px] leading-[1.55] text-dusk/50">
            Personne ne lit. Pas besoin de phrases justes.
          </p>
        </section>

        {/* La page du jour — sobre, sans cadre lourd */}
        <section className="px-6 pt-9">
          <div
            className="flex items-baseline justify-between border-b border-dashed pb-2"
            style={{ borderColor: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}
          >
            <p className="font-serif text-[14px] italic text-dusk/50">{today}</p>
            <span className="text-[10.5px] tabular-nums tracking-[0.14em] text-dusk/35">
              PAGE {String(journal.length + 1).padStart(2, "0")}
            </span>
          </div>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={11}
            placeholder="Laissez les mots venir…"
            className="mt-4 w-full resize-none bg-transparent font-serif text-[18px] leading-[1.75] text-dusk outline-none placeholder:text-dusk/25"
          />

          <button
            type="button"
            onClick={() => setShowPrompts((v) => !v)}
            className="text-[12px] text-dusk/45 underline decoration-dotted underline-offset-4"
          >
            {showPrompts ? "Masquer" : "Si les mots ne viennent pas"}
          </button>

          {showPrompts && (
            <div className="mt-3 flex flex-col gap-2.5">
              {AMORCES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setBody((b) => (b ? b : a + " ")); setShowPrompts(false); }}
                  className="text-left font-serif text-[16px] italic leading-[1.35] text-dusk/60"
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Destinataire — discret */}
        <section className="px-6 pt-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {dest.map((d) => {
              const on = to === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setTo(d.id)}
                  className="pb-1 text-[12.5px] transition-colors"
                  style={{
                    color: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 45%, transparent)",
                    borderBottom: on ? "1px solid var(--bordeaux)" : "1px solid transparent",
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-6 pt-7">
          <button
            onClick={save}
            disabled={!body.trim()}
            className="w-full rounded-full py-3.5 text-[13px] tracking-[0.05em] disabled:opacity-25"
            style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
          >
            Garder cette page
          </button>
          {justSaved && (
            <p className="mt-3 text-center font-serif text-[15px] italic text-dusk/50">
              Votre page est rangée.
            </p>
          )}
        </section>

        {/* Les pages gardées — une liste calme */}
        {journal.length > 0 && (
          <section className="px-6 pt-12">
            <div className="flex items-baseline justify-between">
              <p className="mono-label">Pages gardées</p>
              <span className="text-[11px] tabular-nums text-dusk/35">
                {String(journal.length).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-3">
              {journal.slice(0, 8).map((e) => (
                <article
                  key={e.id}
                  className="border-b border-dashed py-4 last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 14%, transparent)" }}
                >
                  <p className="font-serif text-[13px] italic text-dusk/45">{jourLong(e.date)}</p>
                  <p className="mt-1.5 line-clamp-3 font-serif text-[16px] leading-[1.6] text-dusk/80">{e.body}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </Shell>
  );
}
