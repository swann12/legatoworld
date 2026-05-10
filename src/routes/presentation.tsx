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
      if (e.key === "Home") setI(0);
      if (e.key === "End") setI(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mx-auto flex min-h-dvh max-w-[1280px] flex-col px-8 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-dusk/45">
            Legato · Présentation
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 tabular-nums">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        {/* Slide */}
        <div className="grid flex-1 items-center gap-12 py-10 md:grid-cols-[auto_1fr]">
          {/* Phone frame */}
          <div className="mx-auto">
            <div
              className="ceramic organic-radius-3 overflow-hidden"
              style={{ width: 360, height: 720, padding: 8 }}
            >
              <iframe
                key={slide.path}
                src={slide.path}
                title={slide.title}
                className="h-full w-full rounded-[28px] border-0 bg-paper"
              />
            </div>
          </div>

          {/* Caption */}
          <div className="max-w-[42ch]">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-dusk/45">
              {slide.eyebrow}
            </p>
            <h2
              className="mt-4 font-serif text-[2.6rem] leading-[1.05] font-light text-dusk"
              style={{ textWrap: "balance" }}
            >
              {slide.title}
            </h2>
            <p
              className="mt-6 text-[15px] leading-relaxed text-dusk/65"
              style={{ textWrap: "balance" }}
            >
              {slide.body}
            </p>
            <p className="mt-6 font-mono text-[11px] tracking-wide text-dusk/40">
              {slide.path}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-6">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="ceramic organic-radius-3 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-dusk/70 disabled:opacity-30"
          >
            ← Précédent
          </button>

          <div className="flex flex-1 flex-wrap items-center justify-center gap-1.5">
            {SLIDES.map((s, idx) => (
              <button
                key={s.path}
                onClick={() => setI(idx)}
                aria-label={`Aller à ${s.title}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: idx === i ? 24 : 8,
                  background: idx === i ? "var(--dusk)" : "color-mix(in oklab, var(--dusk) 25%, transparent)",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setI((v) => Math.min(total - 1, v + 1))}
            disabled={i === total - 1}
            className="ceramic organic-radius-3 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-dusk/70 disabled:opacity-30"
          >
            Suivant →
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-dusk/35">
          ← → pour naviguer · Espace pour avancer
        </p>
      </div>
    </main>
  );
}