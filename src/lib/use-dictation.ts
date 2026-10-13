import { useRef, useState } from "react";
import { getDiscovery } from "./discovery";

type Rec = {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: (e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
  onend: () => void; onerror: () => void; start: () => void; stop: () => void;
};

/** Dictée vocale (reconnaissance du navigateur). onText reçoit le texte dicté depuis le début de l'écoute. */
export function useDictation(onText: (t: string) => void) {
  const [listening, setListening] = useState(false);
  const ref = useRef<Rec | null>(null);

  const toggle = () => {
    if (typeof window === "undefined") return;
    if (getDiscovery().active) { alert("La dictée peut envoyer votre voix à un service de reconnaissance. Elle n'est pas disponible en mode découverte."); return; }
    const W = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const Ctor = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Ctor) { alert("La dictée n'est pas disponible sur ce navigateur."); return; }
    if (listening && ref.current) { try { ref.current.stop(); } catch { /* noop */ } setListening(false); return; }
    const rec = new Ctor();
    rec.lang = "fr-FR"; rec.interimResults = true; rec.continuous = true;
    rec.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      onText(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    ref.current = rec;
    setListening(true);
    rec.start();
  };

  return { listening, toggle };
}
