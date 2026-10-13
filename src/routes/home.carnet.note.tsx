import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCarnet } from "@/lib/carnet";
import { upcoming, todayIso } from "@/lib/carnet-model";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/home/carnet/note")({
  head: () => legatoHead("Noter ce qui a été dit", "Noter l'essentiel juste après le rendez-vous, pour les proches du carnet."),
  component: NotePage,
});

type Rec = { start: () => void; stop: () => void; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; lang: string; continuous: boolean; interimResults: boolean };

/** B051 · Noter ce qui a été dit */
function NotePage() {
  const navigate = useNavigate();
  const { addNote, rdvs, shared } = useCarnet();
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const rec = useRef<Rec | null>(null);
  const recent = [...rdvs].filter((r) => r.date <= todayIso()).sort((a, b) => b.date.localeCompare(a.date))[0] ?? upcoming(rdvs)[0];

  const save = async () => {
    const t = text.trim(); if (!t) return;
    try { await addNote(t, recent?.who.split(",")[0].trim()); } catch { toast.error("La note n'a pas pu être gardée. Réessayez."); return; }
    navigate({ to: "/home/carnet" });
  };
  const dictate = () => {
    if (listening) { rec.current?.stop(); return; }
    const W = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const C = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!C) { toast("La dictée n'est pas disponible sur ce navigateur."); return; }
    const r = new C(); r.lang = "fr-FR"; r.continuous = true; r.interimResults = false;
    r.onresult = (e) => { const said = Array.from(e.results).map((x) => x[0].transcript).join(" "); setText((t) => (t ? `${t} ` : "") + said); };
    r.onend = () => setListening(false);
    rec.current = r; r.start(); setListening(true);
  };

  return (
    <StandardLayout back="/home/carnet" backLabel="Le carnet" activeTab="/home">
      <PageTitle className="pt-8">Ce qui<br /><em>a été dit.</em></PageTitle>
      <Lead className="mt-3">Notez l'essentiel juste après le rendez-vous. {shared ? "Vos proches du carnet le verront." : "La note reste sur ce téléphone."}</Lead>
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} rows={7} aria-label="Ce qui a été dit"
        placeholder="Le traitement continue, prochain bilan dans un mois…"
        className="mt-6 w-full resize-none bg-transparent italic outline-none placeholder:opacity-50"
        style={{ fontFamily: "var(--lg-serif)", fontSize: 21, lineHeight: 1.4, borderBottom: "1px solid var(--sp-line-2)" }} />
      <div className="mt-6"><PrimaryButton onClick={() => void save()} disabled={!text.trim()}>Garder dans le carnet</PrimaryButton></div>
      <div className="mt-5"><TextLink onClick={dictate}>{listening ? "Arrêter la dictée" : "Dicter plutôt"}</TextLink></div>
    </StandardLayout>
  );
}
