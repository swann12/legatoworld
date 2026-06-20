import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/help/")({
  head: () => ({ meta: [{ title: "Accompagnement du jour — Legato" }] }),
  component: Help,
});

type Level = 1 | 2 | 3;
const LEVEL_LABEL: Record<Level, string> = { 1: "Très bas", 2: "Moyen", 3: "Tient" };

function loadLevel(key: string, def: Level): Level {
  if (typeof window === "undefined") return def;
  const v = Number(window.localStorage.getItem(key));
  return v === 1 || v === 2 || v === 3 ? (v as Level) : def;
}

function Help() {
  const [hydrated, setHydrated] = useState(false);
  const [energy, setEnergy] = useState<Level>(2);
  const [sleep, setSleep] = useState<Level>(2);
  const [hunger, setHunger] = useState<Level>(2);

  useEffect(() => {
    setEnergy(loadLevel("lg.help.energy", 2));
    setSleep(loadLevel("lg.help.sleep", 2));
    setHunger(loadLevel("lg.help.hunger", 2));
    setHydrated(true);
  }, []);

  function update(setter: (l: Level) => void, key: string, v: Level) {
    setter(v);
    if (typeof window !== "undefined") window.localStorage.setItem(key, String(v));
  }

  // Programme du jour : 3 gestes choisis selon les curseurs.
  const plan = buildPlan({ energy, sleep, hunger });

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="" back="/home" />

        <section className="px-6 pb-2">
          <p className="mono-label">Accompagnement du jour</p>
          <h1 className="mt-5 font-serif font-normal text-[32px] leading-[1.06]">
            Comment va votre<br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>corps aujourd'hui</span> ?
          </h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Trois curseurs courts. On adapte deux ou trois gestes — rien de plus.
          </p>
        </section>

        <section className="px-5 pt-7 space-y-3">
          <BodySlider label="Énergie" value={energy} onChange={(v) => update(setEnergy, "lg.help.energy", v)} tint="var(--sun)" />
          <BodySlider label="Sommeil" value={sleep}  onChange={(v) => update(setSleep,  "lg.help.sleep",  v)} tint="var(--sky)" />
          <BodySlider label="Faim"    value={hunger} onChange={(v) => update(setHunger, "lg.help.hunger", v)} tint="var(--blush)" />
        </section>

        <section className="px-5 pt-9">
          <div className="flex items-center justify-between px-1">
            <p className="mono-label">Pour aujourd'hui</p>
            <div className="h-px flex-1 bg-dusk/10 ml-3" />
          </div>
          <div className="mt-4 space-y-3">
            {plan.map((g) => <GestureCard key={g.id} gesture={g} />)}
          </div>
        </section>

        <section className="px-5 pt-9">
          <div className="flex items-center justify-between px-1">
            <p className="mono-label">Laisser aider</p>
            <div className="h-px flex-1 bg-dusk/10 ml-3" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/care/resources" search={{ space: "care" as const }} className="rounded-[18px] px-5 py-5 min-h-[110px] flex flex-col justify-between" style={{ background: "color-mix(in oklab, var(--terracotta) 18%, var(--paper))" }}>
              <p className="mono-label text-dusk/60">Un·e pro</p>
              <p className="font-serif text-[17px] leading-tight">Trouver un·e thérapeute</p>
            </Link>
            <Link to="/care/community" className="rounded-[18px] px-5 py-5 min-h-[110px] flex flex-col justify-between" style={{ background: "color-mix(in oklab, var(--sky) 50%, var(--paper))" }}>
              <p className="mono-label text-dusk/60">Une communauté</p>
              <p className="font-serif text-[17px] leading-tight">Petit cercle, chaque semaine</p>
            </Link>
          </div>
        </section>

        <section className="px-7 pt-10">
          <Link to="/crisis" className="block border-t border-dusk/12 pt-6 text-center">
            <p className="mono-label">Si aujourd'hui est trop</p>
            <p className="mt-2 font-serif text-[17px]" style={{ color: "var(--bordeaux)" }}>
              Une porte calme →
            </p>
          </Link>
        </section>

        {!hydrated && <div className="sr-only">Chargement…</div>}
      </div>
    </Shell>
  );
}

function BodySlider({
  label, value, onChange, tint,
}: { label: string; value: Level; onChange: (v: Level) => void; tint: string }) {
  const levels: Level[] = [1, 2, 3];
  return (
    <div className="rounded-[18px] border border-dusk/10 bg-paper px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="font-serif text-[16px]">{label}</p>
        <p className="mono-label text-dusk/55">{LEVEL_LABEL[value]}</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {levels.map((l) => {
          const active = value === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => onChange(l)}
              aria-label={`${label} ${LEVEL_LABEL[l]}`}
              className="h-[36px] rounded-full text-[12px] transition-colors"
              style={{
                background: active ? tint : "color-mix(in oklab, var(--dusk) 5%, transparent)",
                color: "var(--dusk)",
                fontWeight: active ? 600 : 500,
              }}
            >
              {LEVEL_LABEL[l]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type Gesture = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  bg: string;
  search?: Record<string, unknown>;
};

function GestureCard({ gesture: g }: { gesture: Gesture }) {
  const body = (
    <>
      <p className="mono-label text-dusk/60">{g.kicker}</p>
      <p className="mt-2 font-serif text-[20px] leading-[1.15]">{g.title}</p>
      <p className="mt-1 text-[12.5px] text-dusk/65 max-w-[34ch]">{g.body}</p>
      <p className="mt-3 mono-label text-dusk/55">{g.cta} →</p>
    </>
  );

  const className = "block rounded-[20px] px-5 py-5";
  const style = { background: g.bg };
  if (g.to === "/care/respirer") return <Link to="/care/respirer" className={className} style={style}>{body}</Link>;
  if (g.to === "/no-words") return <Link to="/no-words" search={{ tab: "souffles" }} className={className} style={style}>{body}</Link>;
  if (g.to === "/help/corps/manger") return <Link to="/help/corps/manger" className={className} style={style}>{body}</Link>;
  if (g.to === "/help/corps/nuits") return <Link to="/help/corps/nuits" className={className} style={style}>{body}</Link>;
  return <Link to="/help/corps/eau" className={className} style={style}>{body}</Link>;
}

function buildPlan({ energy, sleep, hunger }: { energy: Level; sleep: Level; hunger: Level }): Gesture[] {
  const out: Gesture[] = [];

  // Toujours : 2 min d'ancrage adapté à l'énergie
  out.push(
    energy === 1
      ? { id: "calm", kicker: "Le corps d'abord", title: "Se poser deux minutes", body: "Un cercle qui guide le souffle. Rien à comprendre, juste suivre.", cta: "Respirer", to: "/care/respirer", bg: "var(--mist, var(--sky))" }
      : { id: "move", kicker: "Bouger doucement", title: "Quelques pas, une fenêtre", body: "Trois minutes dehors ou près d'une lumière. Sans objectif.", cta: "Y aller", to: "/no-words", search: { tab: "souffles" }, bg: "var(--sun)" }
  );

  // Selon la faim
  if (hunger <= 2) {
    out.push({
      id: "eat", kicker: "Avaler quelque chose",
      title: hunger === 1 ? "Une chose tiède dans la bouche" : "Une bouchée, une gorgée",
      body: hunger === 1
        ? "Bouillon, lait chaud, soupe en sachet. Pas besoin de cuisiner."
        : "Pomme, biscuit, fromage. Posé à côté, pris quand ça vient.",
      cta: "Ouvrir la fiche", to: "/help/corps/manger", bg: "var(--blush)",
    });
  }

  // Selon le sommeil
  if (sleep === 1) {
    out.push({
      id: "night", kicker: "Pour la nuit", title: "Préparer un coin doux",
      body: "Lumière basse, une chanson lente, un texte court à relire. À garder pour 3h du matin.",
      cta: "Voir la fiche", to: "/help/corps/nuits", bg: "color-mix(in oklab, var(--lavender, var(--sky)) 45%, var(--paper))",
    });
  } else {
    out.push({
      id: "water", kicker: "L'eau, sans corvée", title: "Un verre, un visage",
      body: "Boire un grand verre, passer de l'eau sur le visage. Trois minutes.",
      cta: "Voir la fiche", to: "/help/corps/eau", bg: "var(--sky)",
    });
  }

  return out;
}