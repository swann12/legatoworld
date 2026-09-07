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

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="PRÉSENCE" />

        <section className="px-6 pt-2 pb-1">
          <h1 className="ed-page-title text-[30px]">Comment c'est <span className="italic" style={{ color: "var(--terracotta)" }}>aujourd'hui</span>&nbsp;?</h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Écrivez ou parlez, à votre rythme. Rien à raconter d'un coup.
          </p>
        </section>

        {tab === "guide" && (
          <>
            <div className="px-6 pt-6 pb-2">
              <LinearProgress value={pct} />
              <p className="mt-3 mono-label">Étape {step + 1} / {STEPS.length} · {current.label}</p>
            </div>
            <section className="px-6 pt-3 pb-1">
              <h2 className="font-serif text-[22px] leading-[1.2] text-dusk">{current.q}</h2>
            </section>
          </>
        )}

        {/* Suggestions */}
        {history.length <= 1 && (
          <div className="px-6 pt-5 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                disabled={pending}
                onClick={() => send(s)}
                className="shrink-0 rounded-full border border-dusk/15 bg-paper px-4 py-2 text-[13px] text-dusk/75 font-serif disabled:opacity-40 hover:bg-dusk/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* History */}
        <div ref={scrollerRef} className="px-6 pt-6 pb-4 space-y-3 overflow-y-auto no-scrollbar">
          {history.map((m, i) =>
            m.role === "presence" ? (
              <div key={i} className="rounded-[18px] border border-dusk/10 bg-[color:var(--whisper)] px-5 py-4 max-w-[85%]">
                <p className="mono-label mb-1.5">Présence</p>
                <p className="font-serif text-[17px] leading-relaxed text-dusk">{m.text}</p>
              </div>
            ) : (
              <div key={i} className="ml-auto rounded-[16px] px-5 py-3 max-w-[85%] bg-dusk text-paper">
                <p className="text-[14px] leading-relaxed">{m.text}</p>
              </div>
            )
          )}
          {pending && (
            <div className="rounded-[18px] border border-dusk/10 bg-[color:var(--whisper)] px-5 py-4 max-w-[60%]">
              <p className="mono-label mb-1.5">Présence</p>
              <p className="font-serif text-[17px] text-dusk/55">
                <span className="inline-block animate-pulse">…</span>
              </p>
            </div>
          )}
        </div>

        {/* Second niveau : options et explication */}
        <div className="px-6 pt-2">
          <details className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-3">
            <summary className="cursor-pointer list-none mono-label text-dusk/60">Options & comment ça marche</summary>
            <div className="pt-4 pb-1 space-y-3">
              <button
                type="button"
                onClick={() => setTab(tab === "libre" ? "guide" : "libre")}
                className="w-full rounded-full border border-dusk/12 bg-paper px-4 py-2 text-[12.5px]"
              >
                {tab === "libre" ? "Passer en parcours guidé (5 temps)" : "Revenir à la conversation libre"}
              </button>
              <button
                type="button"
                onClick={() => setVoiceOut((v) => !v)}
                className="w-full rounded-full border border-dusk/12 px-4 py-2 text-[12.5px]"
                style={{ background: voiceOut ? "var(--sun)" : "var(--paper)" }}
              >
                {voiceOut ? "Réponse vocale activée" : "Activer les réponses vocales"}
              </button>
              <p className="text-[12px] leading-[1.55] text-dusk/55">
                Présence est une écoute automatisée : elle répond avec une intelligence artificielle,
                jamais à la place d'un professionnel. Vos échanges restent sur cet appareil.
              </p>
            </div>
          </details>
        </div>

        {/* Input */}
        <div className="px-6 pb-28 pt-4">
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="rounded-[18px] border border-dusk/15 bg-paper flex items-center gap-2 px-3 py-2"
          >
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={listening ? "Arrêter la dictée" : "Parler"}
              className="size-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
              style={{
                background: listening ? "var(--terracotta)" : "var(--whisper)",
                color: listening ? "var(--paper)" : "var(--dusk)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" />
                <path d="M12 18v3" />
              </svg>
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={listening ? "J'écoute…" : "Écrivez, ou parlez…"}
              className="flex-1 bg-transparent font-serif text-base text-dusk placeholder:text-dusk/35 outline-none py-2"
              disabled={pending}
            />
            <button
              type="submit"
              disabled={pending}
              className="size-10 rounded-full text-paper text-sm flex items-center justify-center disabled:opacity-50 shrink-0"
              style={{ background: "var(--bordeaux)" }}
              aria-label="Envoyer"
            >
              →
            </button>
          </form>
        </div>

        {tab === "guide" && (
          <div className="px-6 pb-8 flex items-center justify-between">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="mono-label text-dusk/50 disabled:opacity-30">← Précédent</button>
            <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step >= STEPS.length - 1} className="mono-label" style={{ color: "var(--terracotta)" }}>Suivant →</button>
          </div>
        )}
      </div>
    </Shell>
  );
}
