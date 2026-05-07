import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Halos } from "@/components/legato/Halos";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/presence")({
  head: () => ({ meta: [{ title: "Présence — Legato" }] }),
  component: Presence,
});

const SUGGESTIONS = [
  "Raconte-moi cette journée, doucement.",
  "J'ai envie de me souvenir de quelque chose.",
  "Je n'ai pas de mots, là.",
  "Aide-moi à nommer ce que je ressens.",
];

function Presence() {
  const { mode, name } = useLegato();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<{ role: "you" | "presence"; text: string }[]>([
    { role: "presence", text: "Je suis là. Rien de particulier à dire, vraiment." },
  ]);

  const send = (text?: string) => {
    const t = (text ?? draft).trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      { role: "you", text: t },
      { role: "presence", text: "Merci de me l'avoir dit. Prenez votre temps — rien ne presse, sauf si cela vous fait du bien." },
    ]);
    setDraft("");
  };

  return (
    <Shell hideNav>
      <div className="relative min-h-dvh flex flex-col">
        <Halos mode={mode} variant="rich" />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center justify-between px-7 pt-10">
            <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50 hover:text-dusk">← Accueil</Link>
            <Link to="/no-words" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50 hover:text-dusk">Sans mots →</Link>
          </div>

          <div className="px-7 pt-12 flex flex-col items-center text-center">
            <div className="relative size-32">
              <div
                className="absolute inset-0 organic-radius-2 breath"
                style={{
                  background: "radial-gradient(circle at 30% 30%, var(--peach), var(--rose))",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.6), 0 18px 40px -16px rgba(60,40,40,0.3)",
                }}
              />
            </div>
            <p className="mt-7 text-[10px] uppercase tracking-[0.22em] text-dusk/40">Présence</p>
            <h1 className="mt-2 font-serif text-3xl font-light italic text-dusk text-balance max-w-[26ch]">
              Je suis là, {name}. Nous avons le temps.
            </h1>
          </div>

          <div className="flex-1 px-7 pt-10 pb-4 space-y-3 overflow-y-auto no-scrollbar">
            {messages.map((m, i) =>
              m.role === "presence" ? (
                <div key={i} className="ceramic-soft organic-radius-3 px-5 py-4 max-w-[85%]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40 mb-1">Présence</p>
                  <p className="font-serif text-[17px] italic leading-snug text-dusk">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="ml-auto organic-radius-3 px-5 py-3 max-w-[85%] bg-dusk text-paper">
                  <p className="text-[14px] leading-relaxed">{m.text}</p>
                </div>
              )
            )}
          </div>

          <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="ceramic-soft organic-radius shrink-0 px-4 py-2 text-[12px] text-dusk/70">
                {s}
              </button>
            ))}
          </div>

          <div className="px-5 pb-8">
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="ceramic organic-radius-3 flex items-center gap-3 px-5 py-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Murmurez, ou restez en silence…"
                className="flex-1 bg-transparent font-serif text-base italic text-dusk placeholder:text-dusk/35 outline-none py-2"
              />
              <button type="submit" className="size-10 rounded-full bg-dusk text-paper text-sm flex items-center justify-center" aria-label="Envoyer">→</button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}