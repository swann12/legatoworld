import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLegato } from "@/lib/legato-state";
import { suggestPractical, type PracticalSuggestion } from "@/lib/practical-ai.functions";
import { useServerFn } from "@tanstack/react-start";
import { savePractical, loadPractical } from "@/lib/practical-store";
import { recordEmotion } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";

export function ConfideDock({ step }: { step?: string }) {
  const { mode } = useLegato();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<PracticalSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);

  const ask = useServerFn(suggestPractical);
  const record = useServerFn(recordEmotion);

  useEffect(() => {
    if (!open) return;
    const last = loadPractical().lastConfide;
    if (last && !text) setText(last);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("La voix n'est pas disponible sur ce navigateur. Vous pouvez écrire à la place.");
      return;
    }
    const rec = new SR();
    rec.lang = "fr-FR";
    rec.interimResults = true;
    rec.continuous = true;
    rec.onresult = (e: any) => {
      let acc = "";
      for (let i = 0; i < e.results.length; i++) acc += e.results[i][0].transcript + " ";
      setText(acc.trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };
  const stopListening = () => {
    recRef.current?.stop?.();
    setListening(false);
  };

  const send = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestion(null);
    savePractical({ lastConfide: text });
    // Si l'utilisateur est connecté, on capture une trace émotionnelle douce
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        record({ data: { source: "confide", note: text.slice(0, 240), mood: mode } }).catch(() => {});
      }
    });
    try {
      const r = await ask({ data: { description: text, mode, step, budget: loadPractical().budget || undefined } });
      if (r.error) setError(r.error);
      else setSuggestion(r.suggestion);
    } catch {
      setError("Quelque chose s'est interrompu. Réessayez tout doucement.");
    }
    setLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Parler ou écrire à Lovely"
          className="dock-halo fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full ceramic flex items-center justify-center"
        >
          <span className="font-serif italic text-dusk text-[20px] leading-none">L</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-paper border-t border-dusk/10 p-0 max-h-[85dvh] overflow-y-auto">
        <div className="px-7 pt-7 pb-10 max-w-[640px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Se confier — texte ou voix</p>
          <h2 className="mt-2 font-serif text-[26px] text-dusk leading-tight text-balance">
            Dites simplement ce qui est là.
          </h2>
          <p className="mt-3 text-[13px] text-dusk/60 max-w-[40ch]">
            Quelques mots, un souvenir, une hésitation. Lovely vous proposera des pistes douces, jamais à la place de votre choix.
          </p>

          <div className="mt-6 paper-card p-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Écrivez ici, ou touchez le micro pour parler…"
              className="w-full bg-transparent outline-none resize-none font-serif text-[16px] leading-[26px] text-dusk placeholder:text-dusk/30"
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={listening ? stopListening : startListening}
                className={`ceramic-soft organic-radius px-4 py-2 text-[12px] tracking-[0.16em] uppercase ${listening ? "text-rose" : "text-dusk/70"}`}
              >
                {listening ? "● écoute…" : "🎙 parler"}
              </button>
              <button
                onClick={send}
                disabled={loading || !text.trim()}
                className="ceramic organic-radius-3 px-5 py-2 text-[12px] tracking-[0.16em] uppercase text-dusk disabled:opacity-40"
              >
                {loading ? "écoute…" : "recevoir des pistes"}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-[13px] italic text-rose/80">{error}</p>
          )}

          {suggestion && (
            <div className="mt-6 space-y-4">
              <p className="font-serif italic text-[16px] text-dusk/80">{suggestion.intro}</p>
              {([
                ["Fleurs", suggestion.flowers],
                ["Musiques", suggestion.music],
                ["Textes", suggestion.texts],
                ["Objets, rituels", suggestion.objects],
                ["Lieux, ambiances", suggestion.places],
                ["Organisation", suggestion.organization],
              ] as const).map(([title, items]) => (
                <div key={title} className="paper-card p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{title}</p>
                  <ul className="mt-2 space-y-1.5 text-[13.5px] leading-relaxed text-dusk/75">
                    {items.map((it, i) => <li key={i}>— {it}</li>)}
                  </ul>
                </div>
              ))}
              <p className="font-serif italic text-[14px] text-dusk/60 text-center">{suggestion.closing}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
