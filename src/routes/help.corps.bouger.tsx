import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { StandardLayout, SplitHeader, Lead, Tip, PrimaryButton } from "@/components/legato/ds";

export const Route = createFileRoute("/help/corps/bouger")({
  head: () => ({
    meta: [
      { title: "Bouger un peu — Legato" },
      { name: "description", content: "Dix minutes, sans sport ni objectif : remettre le corps en mouvement, doucement." },
      { property: "og:title", content: "Bouger un peu — Legato" },
      { property: "og:description", content: "Dix minutes pour remettre le corps en mouvement, doucement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Bouger,
});

/* Une voix lue par le téléphone lui-même : rien n'est envoyé. Une phrase toutes les deux minutes. */
const WALK = [
  "Vous pouvez partir. Marchez à votre rythme, même lentement.",
  "Sentez vos pieds sur le sol, un pas après l'autre.",
  "Relâchez les épaules. Laissez les bras bouger.",
  "Regardez une chose autour de vous : un arbre, une fenêtre, le ciel.",
  "Respirez un peu plus longtemps en expirant.",
  "Vous pouvez rentrer doucement. Ces dix minutes comptent.",
];

/** B020 · Bouger un peu */
function Bouger() {
  const [on, setOn] = useState(false);
  const timers = useRef<number[]>([]);
  const stop = () => { timers.current.forEach(clearTimeout); timers.current = []; window.speechSynthesis?.cancel(); setOn(false); };
  useEffect(() => () => { timers.current.forEach(clearTimeout); if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }, []);
  const start = () => {
    if (!("speechSynthesis" in window)) return;
    setOn(true);
    WALK.forEach((line, i) => timers.current.push(window.setTimeout(() => {
      const u = new SpeechSynthesisUtterance(line); u.lang = "fr-FR"; u.rate = 0.9;
      window.speechSynthesis.speak(u);
      if (i === WALK.length - 1) u.onend = () => setOn(false);
    }, i * 120000)));
  };
  return (
    <StandardLayout space="support" back="/help/corps" backLabel="Le corps" activeTab="/care">
      <SplitHeader title={<>Bouger<br /><em>un peu.</em></>} value="10">
        <span className="lg-mono" style={{ color: "var(--sp-sub)" }}>minutes</span>
      </SplitHeader>
      <Lead className="mt-[22px] max-w-[310px]">Pas de sport, pas d'objectif. Remettre le corps en mouvement, doucement.</Lead>
      <p className="mt-8" style={{ fontFamily: "var(--lg-serif)", fontSize: 17, fontStyle: "italic" }}>Ce qui aide —</p>
      <Tip n={1}>Marcher dehors, même lentement.</Tip>
      <Tip n={2}>Étirer le dos et les épaules en vous levant.</Tip>
      <Tip n={3} last>Le faire avec quelqu'un, si possible.</Tip>
      <div className="pt-6">
        <PrimaryButton onClick={on ? stop : start}>{on ? "Arrêter la voix" : "Marcher avec une voix"}</PrimaryButton>
      </div>
    </StandardLayout>
  );
}
