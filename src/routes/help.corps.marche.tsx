import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ExperienceLayout } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

/** D022 · Le corps · marcher avec une voix (plein écran). La voix est lue par le téléphone : rien n'est envoyé. */
export const Route = createFileRoute("/help/corps/marche")({
  head: () => legatoHead("Marcher avec une voix", "Une voix douce vous parle toutes les deux minutes. Marchez à votre rythme."),
  component: Marche,
});

const WALK = [
  "Vous pouvez partir. Marchez à votre rythme, même lentement.",
  "Sentez vos pieds sur le sol, un pas après l'autre.",
  "Relâchez les épaules. Laissez les bras bouger.",
  "Regardez une chose autour de vous : un arbre, une fenêtre, le ciel.",
  "Respirez un peu plus longtemps en expirant.",
  "Vous pouvez rentrer doucement. Ces dix minutes comptent.",
];

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Marche() {
  const navigate = useNavigate();
  const [left, setLeft] = useState(600);
  const timers = useRef<number[]>([]);
  const leave = () => navigate({ to: "/help/corps/bouger" });

  useEffect(() => {
    if ("speechSynthesis" in window) {
      WALK.forEach((line, i) => timers.current.push(window.setTimeout(() => {
        const u = new SpeechSynthesisUtterance(line);
        u.lang = "fr-FR"; u.rate = 0.9;
        window.speechSynthesis.speak(u);
      }, i * 120000)));
    }
    const tick = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => {
      timers.current.forEach(clearTimeout);
      window.clearInterval(tick);
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <ExperienceLayout back="/help/corps/bouger" backLabel="Bouger un peu" onClose={leave}
      action={
        <div className="flex flex-col items-center gap-5">
          <p className="lg-mono text-[26px] tracking-[0.12em]" style={{ color: "var(--lg-deep)" }} aria-label="Temps restant">{mmss(left)}</p>
          <button type="button" onClick={leave} className="text-[14px] underline underline-offset-4" style={{ color: "var(--lg-cream)" }}>
            Arrêter
          </button>
        </div>
      }>
      <div style={{ color: "var(--lg-deep)" }}>
        <h1 className="lg-title lg-ds-title" style={{ fontSize: 34 }}>Marcher<br /><em>avec une voix.</em></h1>
        <p className="mt-5 max-w-[300px] text-[15px]" style={{ opacity: 0.75 }}>
          Une voix douce vous parle toutes les deux minutes. Marchez à votre rythme.
        </p>
      </div>
    </ExperienceLayout>
  );
}
