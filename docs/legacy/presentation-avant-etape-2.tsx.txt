import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Legato — Présentation" },
      { name: "description", content: "Une promenade guidée à travers les pages de Legato." },
    ],
  }),
  component: Presentation,
});

type Slide = {
  path: string;
  eyebrow: string;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  { path: "/", eyebrow: "Accueil", title: "Certaines choses s'accompagnent", body: "Une porte d'entrée tranquille, sans pression. Le ton du produit est posé dès la première seconde." },
  { path: "/onboarding", eyebrow: "Onboarding", title: "Faire connaissance, doucement", body: "Quelques questions essentielles pour personnaliser le compagnon : qui, quoi, comment être tenu·e." },
  { path: "/home", eyebrow: "Foyer", title: "Le foyer du jour", body: "Un point de retour calme : présence, jardin, journal, et un geste du jour adapté à l'état émotionnel." },
  { path: "/garden", eyebrow: "Jardin", title: "Un paysage qui se souvient", body: "Une peinture vivante. Chaque être habite un lopin ; on entre par effleurement." },
  { path: "/garden/elise", eyebrow: "Jardin / Personne", title: "Le jardin d'Élise", body: "L'espace personnel d'un être : ses souvenirs, ses floraisons, son atmosphère propre." },
  { path: "/compose/elise", eyebrow: "Composition", title: "Composer avec ses mains", body: "Un atelier doux pour assembler fleurs, couronnes et atmosphères — pour le jardin ou le fleuriste." },
  { path: "/memories", eyebrow: "Souvenirs", title: "Tenir ce qui reste", body: "Un herbier de souvenirs : mots, voix, images. Tout y est rangé sans hiérarchie." },
  { path: "/no-words", eyebrow: "Sans mots", title: "Quand les mots manquent", body: "Des gestes simples lorsqu'il n'y a rien à dire — respirer, allumer, déposer." },
  { path: "/presence", eyebrow: "Présence", title: "Une présence tenue", body: "Un compagnon à confier. Sans jugement, sans solution, juste là." },
  { path: "/journal", eyebrow: "Journal", title: "Tenir le fil des jours", body: "Un journal libre. Quelques lignes suffisent, certains jours rien du tout." },
  { path: "/dates", eyebrow: "Dates", title: "Les dates qui pèsent", body: "Anticiper et tenir les anniversaires, les saisons, les seuils difficiles." },
  { path: "/crisis", eyebrow: "Crise", title: "Quand ça serre", body: "Un protocole d'urgence émotionnelle, à portée immédiate." },
  { path: "/help", eyebrow: "Aide", title: "Demander de l'aide", body: "Des ressources humaines et professionnelles, choisies avec soin." },
  { path: "/inspiration", eyebrow: "Inspiration", title: "Des voix qui éclairent", body: "Lectures, rituels, gestes proposés sans imposer." },
  { path: "/space", eyebrow: "Espace", title: "Un espace à soi", body: "Un endroit personnel, modulable, pour ce qui n'a pas encore de forme." },
  { path: "/practical", eyebrow: "Pratique", title: "Tenir le pratique aussi", body: "Cérémonie, fleurs, textes, démarches : ce qu'il faut faire, pas à pas." },
  { path: "/wishes", eyebrow: "Souhaits", title: "Déposer ses souhaits", body: "Un endroit doux pour confier ce qu'on aimerait, pour soi ou pour ceux qu'on aime." },
];

function Presentation() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const total = SLIDES.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") setI((v) => Math.min(total - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  return (
    <main className="h-dvh overflow-hidden bg-paper text-dusk">
      <div className="mx-auto flex h-full max-w-[1200px] flex-col px-4 py-4 sm:px-8 sm:py-6">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-dusk/45">
            Legato · Présentation
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 tabular-nums">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        {/* Slide — phone + caption, both fluid */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 py-4 md:flex-row md:gap-10">
          {/* Phone frame: scales with available height, capped */}
          <div
            className="ceramic organic-radius-3 shrink-0 overflow-hidden"
            style={{
              height: "min(70vh, 640px)",
              aspectRatio: "9 / 18",
              padding: 6,
            }}
          >
            <iframe
              key={slide.path}
              src={slide.path}
              title={slide.title}
              className="h-full w-full rounded-[24px] border-0 bg-paper"
            />
          </div>

          {/* Caption */}
          <div className="max-w-[42ch] text-center md:text-left">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-dusk/45">
              {slide.eyebrow}
            </p>
            <h2
              className="mt-3 font-serif text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.08] text-dusk"
              style={{ textWrap: "balance" }}
            >
              {slide.title}
            </h2>
            <p
              className="mt-4 text-[clamp(13px,1.4vw,15px)] leading-relaxed text-dusk/65"
              style={{ textWrap: "balance" }}
            >
              {slide.body}
            </p>
          </div>
        </div>

        {/* Controls — minimal */}
        <div className="flex shrink-0 items-center justify-between gap-4">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="ceramic organic-radius-3 px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-dusk/70 disabled:opacity-30"
          >
            ←
          </button>
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
            ← → pour naviguer
          </p>
          <button
            onClick={() => setI((v) => Math.min(total - 1, v + 1))}
            disabled={i === total - 1}
            className="ceramic organic-radius-3 px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-dusk/70 disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}