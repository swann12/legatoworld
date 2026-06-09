import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { useLegato, type Branch } from "@/lib/legato-state";
import { talkToPresence } from "@/lib/presence.functions";

export const Route = createFileRoute("/presence")({
  head: () => ({ meta: [{ title: "Présence — Legato" }] }),
  component: Presence,
});

/* Greetings & suggestions tuned per branch — the Présence's tone shifts. */
const BRANCH_GREETING: Record<Branch, (name: string, lostName: string) => string> = {
  person:    (_n, l) => `Je suis là. Si tu veux, parle-moi de ${l || "celle ou celui qui te manque"}.`,
  animal:    (_n, l) => `Je suis là. Si tu veux, raconte-moi ${l ? l : "cet être fidèle"} — un geste, une habitude.`,
  fear:      ()      => "Je suis là. Pas besoin d'anticiper. Que ressens-tu, juste maintenant ?",
  anxiety:   ()      => "Je suis là. On peut s'approcher tout doucement, sans rien décider.",
  practical: (n)     => `Je suis là, ${n || ""}. Pas de démarches ici — juste un instant à respirer.`,
  wishes:    (n)     => `Je suis là, ${n || ""}. Si tu veux, on peut poser ensemble ce que tu voudrais — sans rien décider.`,
  unknown:   ()      => "Je suis là. Rien à dire, simplement présent·e.",
};

const BRANCH_SUGGESTIONS: Record<Branch, string[]> = {
  person:    ["Te raconter un souvenir", "Ce qui me manque, ce soir", "Je n'ai pas de mots"],
  animal:    ["Te parler de mon compagnon", "Ce vide à la maison", "Une habitude qui me revient"],
  fear:      ["Cette peur qui revient", "Ce que je n'arrive pas à dire", "Comment être présent·e"],
  anxiety:   ["Apprivoiser cette idée", "Ce qui m'angoisse en silence", "Juste respirer un peu"],
  practical: ["Cette journée, en deux mots", "Un seul tout petit pas", "Je suis épuisé·e"],
  wishes:    ["Mettre des mots sur ce que je voudrais", "Ce qui compte pour moi", "Je préfère juste parler"],
  unknown:   ["Raconter cette journée", "Je n'ai pas de mots", "Mettre des mots, doucement"],
};

function Presence() {
  const { mode, name, branch, lostName } = useLegato();
  const callPresence = useServerFn(talkToPresence);

  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const greeting = useMemo(
    () => BRANCH_GREETING[branch](name, lostName),
    [branch, name, lostName],
  );
  const suggestions = BRANCH_SUGGESTIONS[branch];

  const storageKey = `legato.presence.${branch}.${lostName || "_"}`;

  const [messages, setMessages] = useState<{ role: "you" | "presence"; text: string }[]>(() => {
    if (typeof window === "undefined") return [{ role: "presence", text: greeting }];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {/* noop */}
    return [{ role: "presence", text: greeting }];
  });

  // Si on change de branche / d'être, on bascule sur la conversation associée
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) { setMessages(parsed); return; }
      }
    } catch {/* noop */}
    setMessages([{ role: "presence", text: greeting }]);
  }, [storageKey, greeting]);

  // Persistance
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(storageKey, JSON.stringify(messages)); } catch {/* noop */}
  }, [storageKey, messages]);

  const startNew = () => {
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(storageKey); } catch {/* noop */}
    }
    setMessages([{ role: "presence", text: greeting }]);
  };

  const compact = messages.length > 1;

  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const send = async (text?: string) => {
    const t = (text ?? draft).trim();
    if (!t || pending) return;
    const nextMessages = [...messages, { role: "you" as const, text: t }];
    setMessages(nextMessages);
    setDraft("");
    setPending(true);

    const history = nextMessages.map((m) => ({
      role: m.role === "you" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));

    try {
      const { reply } = await callPresence({
        data: { branch, mode, name, lostName, history },
      });
      setMessages((m) => [...m, { role: "presence", text: reply }]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { role: "presence", text: "Je suis là, en silence. Reprenons quand tu veux." },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <Shell>
      <div className="relative min-h-dvh flex flex-col">
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center justify-between px-7 pt-10">
            <Link to="/home" className="eyebrow hover:text-dusk">← Aujourd'hui</Link>
            <p className="eyebrow">Présence</p>
            <Link to="/no-words" className="eyebrow hover:text-dusk">Sans mots →</Link>
          </div>

          {compact ? (
            <div className="px-8 pt-6 pb-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="size-7 rounded-full breath"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, var(--peach), var(--rose))",
                    animationDuration: "7s",
                  }}
                />
                <p className="text-[14px] text-dusk/70">
                  Je suis là, <span className="text-dusk">{name}</span>.
                </p>
              </div>
              <button onClick={startNew} className="eyebrow-sm hover:text-dusk transition-colors">
                Nouveau silence
              </button>
            </div>
          ) : (
            <div className="px-8 pt-10 flex flex-col items-center text-center">
              <div className="relative size-24">
                <div
                  className="absolute inset-0 rounded-full breath"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, var(--peach), var(--rose))",
                    animationDuration: "7s",
                  }}
                />
              </div>
              <h1 className="mt-8 font-serif text-[28px] font-light text-dusk max-w-[22ch] leading-[1.1] text-balance">
                Je suis là, {name}.
                <span className="block mt-2 text-dusk/65 text-[18px]">Tout le temps qu'il faut.</span>
              </h1>
            </div>
          )}

          <div ref={scrollerRef} className="flex-1 px-7 pt-10 pb-4 space-y-3 overflow-y-auto no-scrollbar">
            {messages.map((m, i) =>
              m.role === "presence" ? (
                <div key={i} className="surface px-5 py-4 max-w-[85%]">
                  <p className="eyebrow-sm mb-2">Présence</p>
                  <p className="font-serif text-[16px] leading-[1.55] text-dusk">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="ml-auto rounded-[16px] px-5 py-3 max-w-[85%] bg-dusk text-paper">
                  <p className="text-[14px] leading-relaxed">{m.text}</p>
                </div>
              )
            )}
            {pending && (
              <div className="surface px-5 py-4 max-w-[60%]">
                <p className="eyebrow-sm mb-2">Présence</p>
                <p className="font-serif text-[16px] text-dusk/55">
                  <span className="inline-block animate-pulse">…</span>
                </p>
              </div>
            )}
          </div>

          <div className="px-7 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {suggestions.map((s) => (
              <button
                key={s}
                disabled={pending}
                onClick={() => send(s)}
                className="shrink-0 rounded-full border border-dusk/15 bg-paper px-4 py-2 text-[13px] text-dusk/75 disabled:opacity-40 hover:bg-dusk/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="px-7 pb-28">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="rounded-[18px] border border-dusk/15 bg-paper flex items-center gap-3 px-4 py-2"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Écrivez un mot, ou restez simplement en silence…"
                className="flex-1 bg-transparent text-[15px] text-dusk placeholder:text-dusk/35 outline-none py-2"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending}
                className="size-10 rounded-full text-[color:var(--paper)] text-sm flex items-center justify-center disabled:opacity-50"
                style={{ background: "var(--bordeaux)" }}
                aria-label="Envoyer"
              >
                →
              </button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}