import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { practicalSuggestions, type PracticalTopic } from "@/lib/practical-suggestions.functions";
import { loadPractical, savePractical } from "@/lib/practical-store";
import { useLegato } from "@/lib/legato-state";

type Suggestion = { title: string; detail: string; reason: string };

export function PersonalSuggestions({
  topic,
  eyebrow,
  cta = "Recevoir des suggestions sur mesure",
}: {
  topic: PracticalTopic;
  eyebrow: string;
  cta?: string;
}) {
  const { branch, mode } = useLegato();
  const call = useServerFn(practicalSuggestions);
  const [portrait, setPortrait] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setPortrait(loadPractical().portrait ?? "");
  }, []);

  const onPortraitChange = (v: string) => {
    setPortrait(v);
    savePractical({ portrait: v });
  };

  const generate = async () => {
    if (loading || portrait.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      const r = await call({ data: { portrait: portrait.trim(), topic, branch, mode } });
      if (r.error) setError(r.error);
      setSuggestions(r.suggestions);
    } catch {
      setError("Le service n'a pas répondu. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-5 mt-6">
      <div className="ceramic organic-radius-3 p-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-baseline justify-between gap-3 text-left"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{eyebrow}</p>
            <p className="mt-1 font-serif text-[16px] text-dusk leading-snug">
              Décrire la personne, recevoir des suggestions personnelles
            </p>
          </div>
          <span className="text-dusk/40 shrink-0">{open ? "−" : "+"}</span>
        </button>

        {open && (
          <div className="mt-5 space-y-3">
            <div className="paper-card p-5">
              <textarea
                value={portrait}
                onChange={(e) => onPortraitChange(e.target.value)}
                rows={5}
                placeholder="Sa douceur, ses passions, une habitude, une saison…"
                className="w-full bg-transparent resize-none outline-none font-serif text-[15px] leading-[24px] text-dusk placeholder:text-dusk/30"
              />
            </div>
            <p className="text-[11px] text-dusk/45 italic">
              Conservé sur cet appareil, réutilisé pour les autres rubriques.
            </p>
            <button
              onClick={generate}
              disabled={loading || portrait.trim().length < 3}
              className={`w-full ceramic-soft organic-radius-3 px-7 py-4 text-center transition-opacity ${
                loading || portrait.trim().length < 3 ? "opacity-50" : "opacity-100"
              }`}
            >
              <span className="font-serif italic text-[16px] text-dusk">
                {loading ? "Un instant…" : cta}
              </span>
            </button>
            {error && <p className="text-[13px] italic text-dusk/60">{error}</p>}

            {suggestions.length > 0 && (
              <div className="mt-3 space-y-2">
                {suggestions.map((s, i) => (
                  <article key={i} className="paper-card p-4">
                    <p className="font-serif italic text-[15.5px] text-dusk leading-snug">{s.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-dusk/70" style={{ textWrap: "pretty" }}>
                      {s.detail}
                    </p>
                    {s.reason && (
                      <p className="mt-2 text-[11.5px] italic text-dusk/50">— inspiré par {s.reason}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}