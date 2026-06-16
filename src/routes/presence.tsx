import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { SpaceHeader } from "@/components/legato/SpaceHeader";
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
  unknown:   ()      => "Je suis là. Rien à dire, simplement présent·e.",
};

const BRANCH_SUGGESTIONS: Record<Branch, string[]> = {
  person:    ["Te raconter un souvenir", "Ce qui me manque, ce soir", "Je n'ai pas de mots"],
  animal:    ["Te parler de mon compagnon", "Ce vide à la maison", "Une habitude qui me revient"],
  fear:      ["Cette peur qui revient", "Ce que je n'arrive pas à dire", "Comment être présent·e"],
  anxiety:   ["Apprivoiser cette idée", "Ce qui m'angoisse en silence", "Juste respirer un peu"],
  practical: ["Cette journée, en deux mots", "Un seul tout petit pas", "Je suis épuisé·e"],
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

  const [messages, setMessages] = useState<{ role: "you" | "presence"; text: string }[]>([
    { role: "presence", text: greeting },
  ]);

  // Reset opening line if the user changes branch/mode while on the page
  useEffect(() => {
    setMessages([{ role: "presence", text: greeting }]);
  }, [greeting]);

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
    <Shell livingBg={false}>
      <div className="relative min-h-dvh flex flex-col">
        <div className="relative z-10 flex flex-1 flex-col">
          <SpaceHeader space="care" />

          <div className="px-6 pt-10">
            <p className="eyebrow">Parler à une présence</p>
            <h1 className="mt-4 display-xl">
              Je suis là, <span className="italic" style={{ color: "var(--terracotta)" }}>{name}</span>.
            </h1>
            <p className="mt-3 body-meta">Vous pouvez écrire ou parler. Prenez votre temps.</p>
          </div>

          {/* Actions visibles — selon spec */}
          <div className="px-7 pt-5">
            <div className="flex flex-wrap gap-2">
              {[
                { to: "/community" as const, label: "Contacter un proche" },
                { to: "/community" as const, label: "Trouver un groupe" },
                { to: "/resources" as const, label: "Contacter un pro", search: { space: "care" as const } },
                { to: "/crisis" as const,    label: "Lignes d'écoute", emph: true },
              ].map((s) => (
                <Link
                  key={s.label}
                  to={s.to}
                  search={(s as { search?: { space: "care" } }).search}
                  className="rounded-full border px-3.5 py-1.5 text-[12px]"
                  style={{
                    borderColor: s.emph ? "var(--ember)" : "color-mix(in oklab, var(--dusk) 18%, transparent)",
                    color: s.emph ? "var(--ember)" : "var(--dusk)",
                  }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          <div ref={scrollerRef} className="flex-1 px-7 pt-8 pb-4 space-y-3 overflow-y-auto no-scrollbar">
            {messages.map((m, i) =>
              m.role === "presence" ? (
                <div key={i} className="card-plain px-5 py-4 max-w-[85%]">
                  <p className="eyebrow mb-1.5">Présence</p>
                  <p className="font-serif text-[17px] italic leading-relaxed text-dusk">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="ml-auto rounded-[16px] px-5 py-3 max-w-[85%] bg-dusk text-paper">
                  <p className="text-[14px] leading-relaxed">{m.text}</p>
                </div>
              )
            )}
            {pending && (
              <div className="card-plain px-5 py-4 max-w-[60%]">
                <p className="eyebrow mb-1.5">Présence</p>
                <p className="font-serif text-[17px] italic text-dusk/55">
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
                className="shrink-0 rounded-full border border-dusk/15 bg-paper px-4 py-2 text-[13px] text-dusk/75 italic font-serif disabled:opacity-40 hover:bg-dusk/5 transition-colors"
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
                className="flex-1 bg-transparent font-serif text-base italic text-dusk placeholder:text-dusk/35 outline-none py-2"
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