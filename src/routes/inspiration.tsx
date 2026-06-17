import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Shell } from "@/components/legato/Shell";
import { suggestInspiration } from "@/lib/inspiration.functions";
import { PageHeader, IvoryCard } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/inspiration")({
  head: () => ({
    meta: [
      { title: "Inspirations — Legato" },
      { name: "description", content: "Décrire une personne et recevoir des pistes douces pour une cérémonie." },
    ],
  }),
  component: InspirationPage,
});

function InspirationPage() {
  const [text, setText] = useState("");
  const [context, setContext] = useState<"self" | "loved-one">("loved-one");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const call = useServerFn(suggestInspiration);

  const HINTS = [
    "Sa voix, son rire",
    "Ce qu'il/elle aimait manger",
    "Sa musique, son chanteur",
    "Une saison, un parfum",
    "Un lieu qui lui ressemble",
    "Un objet, un vêtement",
    "Une habitude, un geste",
    "Ce qu'il/elle ne supportait pas",
  ];
  const addHint = (h: string) => {
    setText((prev) => (prev.trim() ? prev.trim() + "\n— " + h + " : " : "— " + h + " : "));
  };

  const onSubmit = async () => {
    const v = text.trim();
    if (v.length < 3 || loading) return;
    setLoading(true);
    setError(null);
    setResult("");
    try {
      const r = await call({ data: { description: v, context } });
      setResult(r.text);
      if (r.error) setError(r.error);
    } catch {
      setError("Le service n'a pas répondu. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="INSPIRATIONS" back="/practical" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Inspirations</p>
          <h1 className="mt-3 ed-page-title">
            Décrire la personne, <span className="italic">recevoir des pistes.</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/65">
            Quelques mots, un souvenir, une habitude. Nous proposerons des idées sensibles : cérémonie, fleurs, musiques, textes, lieux, objets.
          </p>
        </section>

        <div className="px-6 flex gap-2">
          {([
            { id: "loved-one", label: "Pour un être cher" },
            { id: "self", label: "Pour moi-même" },
          ] as const).map((o) => (
            <button
              key={o.id}
              onClick={() => setContext(o.id)}
              className={`px-4 py-1.5 rounded-full text-[11px] tracking-[0.06em] transition-all ${
                context === o.id ? "bg-dusk text-paper" : "rounded-[18px] border border-dusk/10 bg-paper text-dusk/65"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="px-5 mt-4">
          <IvoryCard className="p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Sa douceur, ses passions, un souvenir, ce qu'il ou elle aimait…"
              rows={7}
              className="w-full bg-transparent resize-none outline-none font-serif italic text-[16px] leading-[26px] text-dusk placeholder:text-dusk/30"
            />
          </IvoryCard>
          <div className="mt-3 flex flex-wrap gap-2">
            {HINTS.map((h) => (
              <button
                key={h}
                onClick={() => addHint(h)}
                className="rounded-[14px] border border-dusk/10 px-3 py-1.5 text-[11px] text-dusk/65 hover:text-dusk hover:bg-dusk/5 transition"
                type="button"
              >
                + {h}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 mt-3">
          <button
            onClick={onSubmit}
            disabled={loading || text.trim().length < 3}
            className={`w-full rounded-[14px] border border-dusk/10 px-7 py-5 text-center transition-opacity ${
              loading || text.trim().length < 3 ? "opacity-50" : "opacity-100"
            }`}
          >
            <span className="font-serif text-[18px] italic text-dusk">
              {loading ? "Un instant…" : "Recevoir des pistes"}
            </span>
          </button>
        </div>

        {error && <p className="px-6 mt-4 text-[13px] text-dusk/60 italic">{error}</p>}

        {result && (
          <div className="px-5 mt-8">
            <IvoryCard className="p-7 space-y-3 text-dusk/80">
              <ReactMarkdown
                components={{
                  h1: (p) => <h2 className="font-serif italic text-[24px] text-dusk mt-2" {...p} />,
                  h2: (p) => <h3 className="font-serif italic text-[20px] text-dusk mt-4" {...p} />,
                  h3: (p) => <p className="mono-label mt-5 mb-1" {...p} />,
                  p:  (p) => <p className="text-[14.5px] leading-relaxed text-dusk/75" {...p} />,
                  ul: (p) => <ul className="list-disc pl-5 space-y-1.5" {...p} />,
                  ol: (p) => <ol className="list-decimal pl-5 space-y-1.5" {...p} />,
                  li: (p) => <li className="text-[14px] leading-relaxed text-dusk/75" {...p} />,
                  strong: (p) => <strong className="text-dusk font-medium" {...p} />,
                  em: (p) => <em className="italic text-dusk/85" {...p} />,
                }}
              >
                {result}
              </ReactMarkdown>
            </IvoryCard>
          </div>
        )}
      </div>
    </Shell>
  );
}
