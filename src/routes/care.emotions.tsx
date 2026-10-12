import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { recordEmotion } from "@/lib/emotional.functions";
import { useLegato, type Emotion } from "@/lib/legato-state";
import { loadCheckin, saveCheckin } from "@/lib/checkin-store";
import { saveIntensity } from "@/lib/emotion-intensity";
import { StandardLayout, PageTitle, Lead, MoodBar, Block, PrimaryButton, Row } from "@/components/legato/ds";

export const Route = createFileRoute("/care/emotions")({
  head: () => ({
    meta: [
      { title: "Comment allez-vous ? — Legato" },
      { name: "description", content: "Dire comment vous allez, pour recevoir ce qui peut aider aujourd'hui." },
      { property: "og:title", content: "Comment allez-vous ? — Legato" },
      { property: "og:description", content: "Il n'y a pas de bonne réponse. Cela sert seulement à vous proposer ce qui peut aider." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Emotions,
});

type Choice = Emotion | "autre";
const CHOICES: { id: Choice; label: string }[] = [
  { id: "tristesse", label: "Tristesse" },
  { id: "fatigue", label: "Fatigue" },
  { id: "colere", label: "Colère" },
  { id: "culpabilite", label: "Culpabilité" },
  { id: "nostalgie", label: "Nostalgie" },
  { id: "vide", label: "Vide" },
  { id: "autre", label: "Autre chose" },
];
const label = (id: Choice) => CHOICES.find((c) => c.id === id)?.label ?? "";

function Emotions() {
  const { currentEmotions, setCurrentEmotions, hydrated } = useLegato();
  const record = useServerFn(recordEmotion);
  const [picked, setPicked] = useState<Choice[]>([]);
  const [mood, setMood] = useState(30);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (hydrated) setPicked(currentEmotions.filter((e) => CHOICES.some((c) => c.id === e))); }, [hydrated]);

  const toggle = (id: Choice) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const save = async () => {
    const emotions = picked.filter((p): p is Emotion => p !== "autre");
    setCurrentEmotions(emotions);
    const intensity = Math.round((100 - mood) / 10); // 10 = très dur
    saveIntensity(intensity);
    saveCheckin(loadCheckin());
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      record({ data: { source: "checkin", mood: emotions[0], intensity, tags: picked.map(String), note: note.trim() || undefined } }).catch(() => {});
    }
    setSaved(true);
    window.scrollTo(0, 0);
  };

  if (saved) {
    const names = picked.map(label).map((l, i) => (i ? l.toLowerCase() : l));
    const said = names.length > 1 ? `${names.slice(0, -1).join(", ")} et ${names[names.length - 1]}` : names[0];
    const day = mood < 50 ? "une journée dure" : "une journée plus douce";
    const reason = picked.includes("fatigue") ? "Parce que la fatigue pèse sur tout le reste" : "Pour relâcher un peu ce qui pèse";
    return (
      <StandardLayout back="/home" backLabel="Aujourd'hui">
        <PageTitle className="pt-8">C'est noté.<br /><em>Merci de l'avoir dit.</em></PageTitle>
        <Lead className="mt-3">{said ? `${said} : ${day}.` : `Merci. ${day.charAt(0).toUpperCase() + day.slice(1)}.`} Voici ce qui peut aider, sans obligation.</Lead>
        <Block className="mt-8" label="Maintenant" title="Une respiration de trois minutes" meta={reason}>
          <PrimaryButton to="/care/respirer">Respirer</PrimaryButton>
        </Block>
        <div className="mt-2">
          <Row title="Parler à quelqu'un, tout de suite" subtitle="Présence, ou une ligne d'écoute" to="/care/aide" />
          <Row title="Revenir à Aujourd'hui" to="/home" last />
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout back="/home" backLabel="Aujourd'hui">
      <PageTitle className="pt-8">Comment allez-vous,<br /><em>vraiment ?</em></PageTitle>
      <Lead className="mt-3">Il n'y a pas de bonne réponse. Cela sert seulement à vous proposer ce qui peut aider.</Lead>

      <p className="lg-mono mt-9" style={{ color: "var(--sp-ink)" }}>1 · Ce que vous ressentez</p>
      <p className="mt-3" style={{ fontFamily: "var(--lg-serif)", fontSize: 21, lineHeight: 1.35 }}>
        {CHOICES.map((c, i) => {
          const on = picked.includes(c.id);
          return (
            <span key={c.id}>
              <button type="button" onClick={() => toggle(c.id)} aria-pressed={on}
                className={on ? "underline underline-offset-4" : ""} style={{ color: on ? "var(--sp-ink)" : "var(--sp-sub)", textDecorationThickness: 1 }}>{c.label}</button>
              {i < CHOICES.length - 1 && <span style={{ color: "var(--sp-sub)" }}>, </span>}
            </span>
          );
        })}
      </p>

      <p className="lg-mono mt-9 mb-4" style={{ color: "var(--sp-ink)" }}>2 · Aujourd'hui, c'est plutôt</p>
      <MoodBar value={mood} onChange={setMood} />

      <label className="mt-9 block">
        <span className="lg-mono" style={{ color: "var(--sp-ink)" }}>3 · Un mot de plus, si vous voulez</span>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ce matin…" maxLength={500}
          className="mt-3 w-full bg-transparent pb-3 italic outline-none placeholder:opacity-50"
          style={{ fontFamily: "var(--lg-serif)", fontSize: 21, color: "var(--sp-ink)", borderBottom: "1px solid var(--sp-line-2)" }} />
      </label>

      <div className="mt-8">
        <PrimaryButton onClick={save} disabled={picked.length === 0}>Enregistrer</PrimaryButton>
      </div>
      <p className="sr-only"><Link to="/crisis">Besoin d'aide</Link></p>
    </StandardLayout>
  );
}
