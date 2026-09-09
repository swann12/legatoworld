import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";

export const Route = createFileRoute("/care/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Legato" },
      { name: "description", content: "Écrire ce qui vient, sans relire. Un carnet privé, gardé pour vous." },
      { property: "og:title", content: "Journal — Legato" },
      { property: "og:description", content: "Écrire ce qui vient, sans relire." },
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

function jour(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });
  } catch {
    return "";
  }
}

function CareJournal() {
  const { journal, addJournalEntry } = useLegato();
  const lovedName = useLovedName();
  const [body, setBody] = useState("");
  const [to, setTo] = useState<"them" | "self" | "free">("them");

  const save = () => {
    if (!body.trim()) return;
    addJournalEntry({ body: body.trim(), to });
    setBody("");
  };

  const dest = DEST.map((d) => ({ ...d, label: d.id === "them" ? lovedName : d.label }));

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-36">
        <header className="px-6 pt-7">
          <Link to="/care" aria-label="Retour" className="text-[15px] leading-none text-dusk/50">←</Link>
        </header>

        <section className="px-6 pt-7">
          <p className="mono-label">Journal</p>
          <h1 className="mt-4 font-serif text-[32px] leading-[1.06]">
            Écrire ce qui <span className="italic" style={{ color: "var(--terracotta)" }}>vient</span>.
          </h1>
          <p className="mt-3 max-w-[30ch] text-[13px] leading-[1.55] text-dusk/55">
            Personne ne lit. Pas besoin de phrases justes.
          </p>
        </section>

        {/* Destinataire */}
        <section className="px-6 pt-7">
          <div className="flex gap-2">
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

        {/* Feuille */}
        <section className="px-5 pt-5">
          <div className="craft px-5 py-5">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={9}
              placeholder="Laissez les mots venir, sans relire…"
              className="w-full resize-none bg-transparent font-serif text-[17px] leading-[29px] text-dusk outline-none placeholder:text-dusk/30"
            />
            <div className="mt-2 flex items-center justify-between border-t border-dashed pt-3" style={{ borderColor: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}>
              <span className="text-[11px] tabular-nums tracking-[0.1em] text-dusk/35">
                {body.trim().length} signes
              </span>
              <button
                onClick={save}
                disabled={!body.trim()}
                className="rounded-full px-5 py-2 text-[12.5px] tracking-[0.04em] disabled:opacity-35"
                style={{ background: "var(--terracotta)", color: "var(--paper)" }}
              >
                Garder →
              </button>
            </div>
          </div>
        </section>

        {/* Amorces — bandeau ponctuel */}
        <section className="band band-blush mt-9 px-6 pt-7 pb-8">
          <p className="mono-label">Si les mots ne viennent pas</p>
          <div className="mt-4 flex flex-col gap-2.5">
            {AMORCES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setBody((b) => (b ? b : a + " "))}
                className="text-left font-serif text-[17px] leading-[1.3] text-dusk/80"
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* Ce que j'ai gardé */}
        {journal.length > 0 && (
          <section className="px-6 pt-9">
            <div className="flex items-baseline justify-between">
              <p className="mono-label">Ce que j'ai gardé</p>
              <span className="text-[11px] tabular-nums text-dusk/35">
                {String(journal.length).padStart(2, "0")}
              </span>
            </div>
            <ul className="mt-4">
              {journal.slice(0, 8).map((e) => (
                <li
                  key={e.id}
                  className="border-b border-dashed py-4 last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                >
                  <p className="mono-label text-dusk/45">{jour(e.date)}</p>
                  <p className="mt-1.5 line-clamp-3 text-[13.5px] leading-[1.55] text-dusk/75">{e.body}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Shell>
  );
}
