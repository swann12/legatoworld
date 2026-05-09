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
  "Raconter cette journée",
  "Me souvenir, ensemble",
  "Je n'ai pas de mots",
  "Mettre des mots, doucement",
];

function Presence() {
  const { mode, name } = useLegato();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<{ role: "you" | "presence"; text: string }[]>([
    { role: "presence", text: "Je suis là. Rien de particulier à dire, simplement présent·e." },
  ]);

  const send = (text?: string) => {
    const t = (text ?? draft).trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      { role: "you", text: t },
      { role: "presence", text: "Merci de me l'avoir confié. Prenez tout votre temps, rien ne presse." },
    ]);
    setDraft("");
  };

  return (
    <Shell hideNav>
      <div className="relative min-h-dvh flex flex-col">
        <Halos mode={mode} variant="rich" />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center justify-between px-8 pt-10">
            <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk">← Accueil</Link>
            <Link to="/no-words" className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk">Sans mots →</Link>
          </div>

          <div className="px-8 pt-12 flex flex-col items-center text-center">
            <div className="relative size-36 halo-lg">
              <div
                className="absolute inset-0 rounded-full breath"
                style={{
                  background: "radial-gradient(circle at 30% 30%, var(--peach), var(--rose))",
                  boxShadow: "inset 0 2px 6px rgba(255,255,255,0.7), 0 22px 50px -18px rgba(120,60,60,0.32)",
                  animationDuration: "7s",
                }}
              />
              <div
                className="absolute -inset-8 rounded-full breath -z-10 opacity-70"
                style={{
                  background: "radial-gradient(circle, color-mix(in oklab, var(--rose) 35%, transparent), transparent 70%)",
                  animationDuration: "11s",
                }}
              />
              <div
                className="absolute -inset-16 rounded-full breath -z-20 opacity-40"
                style={{
                  background: "radial-gradient(circle, color-mix(in oklab, var(--peach) 30%, transparent), transparent 70%)",
                  animationDuration: "14s",
                }}
              />
            </div>
            <div className="mt-9 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-dusk/45">
              <span className="h-px w-6 bg-dusk/20" />
              Présence
              <span className="h-px w-6 bg-dusk/20" />
            </div>
            <h1
              className="mt-4 font-serif text-[1.85rem] font-light text-dusk max-w-[20ch] leading-[1.18]"
              style={{ textWrap: "balance" }}
            >
              Je suis là, <span className="italic">{name}</span>.
              <span className="block mt-1 italic text-dusk/75 text-[1.45rem]">Tout le temps qu'il faut.</span>
            </h1>
          </div>

          <div className="flex-1 px-7 pt-10 pb-4 space-y-3 overflow-y-auto no-scrollbar">
            {messages.map((m, i) =>
              m.role === "presence" ? (
                <div key={i} className="ceramic-soft organic-radius-3 px-5 py-4 max-w-[85%]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40 mb-1">Présence</p>
                  <p className="font-serif text-[17px] italic leading-relaxed text-dusk">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="ml-auto organic-radius-3 px-5 py-3 max-w-[85%] bg-dusk text-paper">
                  <p className="text-[14px] leading-relaxed">{m.text}</p>
                </div>
              )
            )}
          </div>

          <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="ceramic-soft organic-radius shrink-0 px-4 py-2 text-[12.5px] text-dusk/75 italic font-serif">
                {s}
              </button>
            ))}
          </div>

          <div className="px-5 pb-8">
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="ceramic organic-radius-3 flex items-center gap-3 px-5 py-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Écrivez un mot, ou restez simplement en silence…"
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