import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { suggestInspiration } from "@/lib/inspiration.functions";

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
  const { mode } = useLegato();
  const [text, setText] = useState("");
  const [context, setContext] = useState<"self" | "loved-one">("loved-one");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const call = useServerFn(suggestInspiration);

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
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/practical" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Retour</Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Inspirations</span>
          </div>

          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Inspirations</p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.08] font-light text-dusk text-balance">
              Décrire la personne, <span className="italic">recevoir des pistes.</span>
            </h1>
            <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/65">
              Quelques mots, un souvenir, une habitude. Nous proposerons des idées sensibles : cérémonie, fleurs, musiques, textes, lieux, objets.
            </p>
          </header>

          <div className="px-7 mt-8 flex gap-2">
            {([
              { id: "loved-one", label: "Pour un être cher" },
              { id: "self", label: "Pour moi-même" },
            ] as const).map((o) => (
              <button
                key={o.id}
                onClick={() => setContext(o.id)}
                className={`px-4 py-1.5 rounded-full text-[11px] tracking-[0.06em] transition-all ${
                  context === o.id ? "bg-dusk text-paper" : "paper-card text-dusk/65"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="px-5 mt-4">
            <div className="paper-card p-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Sa douceur, ses passions, ses musiques, un souvenir précis, ce qu'il ou elle aimait, ce qu'il ou elle ne supportait pas…"
                rows={7}
                className="w-full bg-transparent resize-none outline-none font-serif italic text-[16px] leading-[26px] text-dusk placeholder:text-dusk/30"
              />
            </div>
          </div>

          <div className="px-5 mt-3">
            <button
              onClick={onSubmit}
              disabled={loading || text.trim().length < 3}
              className={`ceramic organic-radius-3 w-full px-7 py-5 text-center transition-opacity ${
                loading || text.trim().length < 3 ? "opacity-50" : "opacity-100"
              }`}
            >
              <span className="font-serif text-xl italic text-dusk">
                {loading ? "Un instant…" : "Recevoir des pistes"}
              </span>
            </button>
          </div>

          {error && (
            <p className="px-7 mt-4 text-[13px] text-dusk/60 italic">{error}</p>
          )}

          {result && (
            <div className="px-5 mt-8">
              <div className="paper-card p-7">
                <div className="prose prose-sm max-w-none font-serif text-dusk/80
                  prose-headings:font-serif prose-headings:italic prose-headings:font-normal prose-headings:text-dusk
                  prose-h3:text-[15px] prose-h3:uppercase prose-h3:tracking-[0.18em] prose-h3:not-italic prose-h3:font-medium prose-h3:text-dusk/55
                  prose-p:text-[15px] prose-p:leading-relaxed
                  prose-li:text-[14.5px] prose-li:leading-relaxed prose-li:my-1
                  prose-strong:text-dusk">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}