import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { useLegato, type Branch } from "@/lib/legato-state";
import { talkToPresence } from "@/lib/presence.functions";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { PageHeader, LinearProgress } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/presence")({
  head: () => ({ meta: [{ title: "Présence — Legato" }] }),
  component: Presence,
});

const BRANCH_GREETING: Record<Branch, (name: string, lostName: string) => string> = {
  person:    (_n, l) => `Je suis là. Si vous le souhaitez, parlez-moi de ${l || "celle ou celui qui vous manque"}.`,
  animal:    (_n, l) => `Je suis là. Si vous le souhaitez, racontez-moi ${l ? l : "cet être fidèle"} — un geste, une habitude.`,
  fear:      ()      => "Je suis là. Pas besoin d'anticiper. Que ressentez-vous, juste maintenant ?",
  anxiety:   ()      => "Je suis là. On peut s'approcher tout doucement, sans rien décider.",
  practical: (n)     => `Je suis là, ${n || ""}. Pas de démarches ici — juste un instant à respirer.`,
  unknown:   ()      => "Je suis là. Rien à dire, simplement présent·e.",
};

const BRANCH_SUGGESTIONS: Record<Branch, string[]> = {
  person:    ["Vous raconter un souvenir", "Ce qui me manque, ce soir", "Je n'ai pas de mots"],
  animal:    ["Vous parler de mon compagnon", "Ce vide à la maison", "Une habitude qui me revient"],
  fear:      ["Cette peur qui revient", "Ce que je n'arrive pas à dire", "Comment être présent·e"],
  anxiety:   ["Apprivoiser cette idée", "Ce qui m'angoisse en silence", "Juste respirer un peu"],
  practical: ["Cette journée, en deux mots", "Un seul tout petit pas", "Je suis épuisé·e"],
  unknown:   ["Raconter cette journée", "Je n'ai pas de mots", "Mettre des mots, doucement"],
};

const STEPS = [
  { label: "Respirer", q: "Comment vous sentez-vous, juste maintenant ?" },
  { label: "Nommer", q: "Qu'est-ce qui occupe le plus votre esprit aujourd'hui ?" },
  { label: "Accueillir", q: "Qu'avez-vous besoin d'entendre ?" },
  { label: "Relier", q: "Qui ou quoi vous soutient en ce moment ?" },
  { label: "Retour", q: "Un mot pour vous-même, avant de reprendre." },
];

type Tab = "libre" | "guide";

function Presence() {
  const { mode, name, branch, lostName } = useLegato();
  const callPresence = useServerFn(talkToPresence);
  const { portrait } = usePortrait();
  const portraitLine = portraitSentence(portrait, lostName);

  const [tab, setTab] = useState<Tab>("libre");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [history, setHistory] = useState<{ role: "you" | "presence"; text: string }[]>([]);
  const [listening, setListening] = useState(false);
  const [voiceOut, setVoiceOut] = useState(false);
  const recogRef = useRef<unknown>(null);

  const greeting = useMemo(() => BRANCH_GREETING[branch](name, lostName), [branch, name, lostName]);
  const suggestions = BRANCH_SUGGESTIONS[branch];

  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [history, pending]);

  // Greeting in libre mode, the first time
  useEffect(() => {
    if (tab === "libre" && history.length === 0) {
      setHistory([{ role: "presence", text: greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const send = async (text?: string) => {
    const t = (text ?? draft).trim();
    if (!t || pending) return;
    const next = [...history, { role: "you" as const, text: t }];
    setHistory(next);
    setDraft("");
    setPending(true);

    try {
      const { reply } = await callPresence({
        data: {
          branch, mode, name, lostName, portrait: portraitLine,
          history: next.map((m) => ({ role: m.role === "you" ? ("user" as const) : ("assistant" as const), content: m.text })),
        },
      });
      setHistory((m) => [...m, { role: "presence", text: reply }]);
      if (voiceOut && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = "fr-FR";
        utterance.rate = 0.88;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setHistory((m) => [...m, { role: "presence", text: "Je suis là, en silence. Reprenons quand vous voulez." }]);
    } finally {
      setPending(false);
    }
  };

  const toggleVoice = () => {
    if (typeof window === "undefined") return;
    const W = window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown };
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) {
      alert("La reconnaissance vocale n'est pas disponible sur ce navigateur.");
      return;
    }
    if (listening && recogRef.current) {
      try { (recogRef.current as { stop: () => void }).stop(); } catch { /* noop */ }
      setListening(false);
      return;
    }
    const rec = new Ctor() as {
      lang: string; interimResults: boolean; continuous: boolean;
      onresult: (e: { results: { 0: { transcript: string } }[] }) => void;
      onend: () => void; onerror: () => void; start: () => void; stop: () => void;
    };
    rec.lang = "fr-FR";
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e) => {
      let interim = "";
      const results = e.results as unknown as ArrayLike<{ 0: { transcript: string } }>;
      for (let i = 0; i < results.length; i++) interim += results[i][0].transcript;
      setDraft(interim);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recogRef.current = rec;
    setListening(true);
    rec.start();
  };

  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  const started = history.length > 1 || pending;

  return (
    <Shell livingBg={false}>
      <div className="relative flex min-h-dvh flex-col bg-paper text-dusk">
        <PageHeader title="PRÉSENCE" />

        {/* Ouverture — se retire dès que la conversation commence */}
        <section
          className="px-7 transition-all duration-700"
          style={{
            paddingTop: started ? 0 : 8,
            maxHeight: started ? 0 : 320,
            opacity: started ? 0 : 1,
            overflow: "hidden",
          }}
        >
          <h1 className="font-serif text-[34px] leading-[1.06] tracking-[-0.01em]">
            Comment c'est
            <br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>aujourd'hui</span>&nbsp;?
          </h1>
          <p className="mt-5 max-w-[30ch] text-[13px] leading-[1.7] text-dusk/55">
            Écrivez ou parlez, à votre rythme. Rien à raconter d'un coup.
          </p>
          <span
            aria-hidden
            className="mt-8 block h-px w-16"
            style={{ background: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}
          />
        </section>

        {tab === "guide" && (
          <div className="px-7 pt-7">
            <LinearProgress value={pct} />
            <p className="mono-label mt-3">Temps {step + 1} / {STEPS.length} · {current.label}</p>
            <h2 className="mt-4 font-serif text-[22px] leading-[1.25]">{current.q}</h2>
          </div>
        )}

        {/* Conversation */}
        <div
          ref={scrollerRef}
          className="no-scrollbar flex-1 overflow-y-auto px-7 pt-8"
          style={{ paddingBottom: 190 }}
        >
          <div className="space-y-7">
            {history.map((m, i) =>
              m.role === "presence" ? (
                <div key={i} className="max-w-[32ch]">
                  <p
                    className="mono-label mb-2"
                    style={{ color: "color-mix(in oklab, var(--dusk) 40%, transparent)" }}
                  >
                    Présence
                  </p>
                  <p className="font-serif text-[19px] leading-[1.55] text-dusk">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <p
                    className="max-w-[80%] rounded-[16px] px-4 py-3 text-[14px] leading-[1.55]"
                    style={{ background: "var(--clay)", color: "var(--dusk)" }}
                  >
                    {m.text}
                  </p>
                </div>
              ),
            )}
            {pending && (
              <p className="font-serif text-[19px] italic text-dusk/35">…</p>
            )}
          </div>

          {/* Amorces */}
          {history.length <= 1 && !pending && (
            <div className="mt-10 flex flex-col items-start gap-3.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left font-serif text-[16px] leading-[1.4] text-dusk/70 underline decoration-dusk/15 underline-offset-[6px] transition-colors hover:text-dusk"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Second niveau, très discret */}
          <details className="mt-12 border-t border-dusk/8 pt-5">
            <summary className="mono-label cursor-pointer list-none text-dusk/45">
              Options & comment ça marche
            </summary>
            <div className="space-y-3 pt-5">
              <button
                type="button"
                onClick={() => setTab(tab === "libre" ? "guide" : "libre")}
                className="w-full rounded-full border border-dusk/12 bg-[color:var(--whisper)] px-4 py-2.5 text-[12.5px]"
              >
                {tab === "libre" ? "Passer en parcours guidé (5 temps)" : "Revenir à la conversation libre"}
              </button>
              <button
                type="button"
                onClick={() => setVoiceOut((v) => !v)}
                className="w-full rounded-full border border-dusk/12 px-4 py-2.5 text-[12.5px]"
                style={{ background: voiceOut ? "var(--clay)" : "var(--whisper)" }}
              >
                {voiceOut ? "Réponse vocale activée" : "Activer les réponses vocales"}
              </button>
              <p className="text-[12px] leading-[1.6] text-dusk/50">
                Présence est une écoute automatisée : elle répond avec une intelligence artificielle,
                jamais à la place d'un professionnel. Vos échanges restent sur cet appareil.
              </p>
            </div>
          </details>

          {tab === "guide" && (
            <div className="flex items-center justify-between pt-8">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="mono-label text-dusk/45 disabled:opacity-30">← Précédent</button>
              <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step >= STEPS.length - 1} className="mono-label" style={{ color: "var(--terracotta)" }}>Suivant →</button>
            </div>
          )}
        </div>

        {/* Composer */}
        <div
          className="fixed bottom-0 left-1/2 z-40 w-full max-w-[420px] -translate-x-1/2 px-6 pb-[calc(env(safe-area-inset-bottom)+72px)] pt-6"
          style={{
            background:
              "linear-gradient(to top, var(--paper) 62%, color-mix(in oklab, var(--paper) 0%, transparent))",
          }}
        >
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 rounded-full px-2 py-1.5"
            style={{
              background: "var(--whisper)",
              border: "1px solid color-mix(in oklab, var(--dusk) 10%, transparent)",
            }}
          >
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={listening ? "Arrêter la dictée" : "Parler"}
              className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
              style={{
                background: listening ? "var(--terracotta)" : "transparent",
                color: listening ? "var(--paper)" : "color-mix(in oklab, var(--dusk) 55%, transparent)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" />
                <path d="M12 18v3" />
              </svg>
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={listening ? "J'écoute…" : "Écrivez, ou parlez…"}
              className="flex-1 bg-transparent py-2 font-serif text-[15px] text-dusk outline-none placeholder:text-dusk/30"
              disabled={pending}
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] disabled:opacity-30"
              style={{ background: "var(--clay)", color: "var(--dusk)" }}
              aria-label="Envoyer"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </Shell>
  );
}

