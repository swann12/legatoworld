import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CorpsPage, CorpsSection, StepList, CorpsFooterNote } from "@/components/legato/CorpsPage";

export const Route = createFileRoute("/help/corps/manger")({
  head: () => ({
    meta: [
      { title: "Manger — Legato" },
      { name: "description", content: "Cinq choses qu'on peut avaler sans y penser, et une étape à la fois pour quelque chose de chaud." },
      { property: "og:title", content: "Manger — Legato" },
      { property: "og:description", content: "Quand le corps oublie de manger." },
    ],
  }),
  component: Manger,
});

const CHOSES = [
  { t: "Un verre d'eau", b: "Le poser devant soi suffit déjà." },
  { t: "Une clémentine", b: "Elle s'épluche presque seule." },
  { t: "Du pain, debout", b: "Sans s'asseoir, sans faire semblant d'un repas." },
  { t: "Un carré de chocolat", b: "C'est suffisant." },
  { t: "Un bouillon chaud", b: "Comme un thé, dans la même tasse si vous voulez." },
];

const STEPS = [
  { title: "Faire bouillir de l'eau.", body: "Juste l'eau. Décider ensuite de ce qu'on en fait." },
  { title: "Prendre une tasse qui vous plaît.", body: "Pas la plus pratique. Celle qui fait du bien à tenir." },
  { title: "Verser, ajouter ce que vous avez.", body: "Un cube de bouillon, un sachet de thé, rien du tout." },
  { title: "Tenir la tasse entre vos mains.", body: "La chaleur agit même quand on ne la sent pas." },
];

function Manger() {
  const [done, setDone] = useState<number[]>([]);
  const [souvenir, setSouvenir] = useState("");
  const [saved, setSaved] = useState(false);
  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  const save = () => {
    if (!souvenir.trim()) return;
    try {
      const key = "legato.help.souvenirs.gouts";
      const prev: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([souvenir.trim(), ...prev]));
    } catch {}
    setSaved(true);
  };

  return (
    <CorpsPage
      kicker="LE CORPS · MANGER"
      title="Quand le corps oublie de manger."
      intro="Il y a des jours où cuisiner, s'asseoir, avaler est trop. Voici ce qui ne demande presque rien."
    >
      <CorpsSection label="Sans y penser" meta={String(CHOSES.length).padStart(2, "0")}>
        <ul className="craft px-5">
          {CHOSES.map((c, i) => (
            <li
              key={c.t}
              className="flex items-baseline gap-4 border-b border-dashed py-4 last:border-0"
              style={{ borderColor: i < CHOSES.length - 1 ? "color-mix(in oklab, var(--dusk) 16%, transparent)" : undefined }}
            >
              <span className="text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span className="block font-serif text-[16.5px] leading-[1.25]">{c.t}</span>
                <span className="mt-1 block text-[13px] leading-[1.55] text-dusk/60">{c.b}</span>
              </span>
            </li>
          ))}
        </ul>
      </CorpsSection>

      <CorpsSection label="Quelque chose de chaud" meta={`${done.length} / ${STEPS.length}`}>
        <StepList steps={STEPS} done={done} onToggle={toggle} />
      </CorpsSection>

      <CorpsSection label="Un repas pour se souvenir">
        <div className="tint-sand rounded-[18px] px-6 py-6">
          <p className="max-w-[34ch] text-[13.5px] leading-[1.65]">
            Y a-t-il quelque chose qu'il ou elle aimait manger ? Le manger aujourd'hui n'est pas se nourrir : c'est être près de lui, d'elle.
          </p>
          <textarea
            value={souvenir}
            onChange={(e) => setSouvenir(e.target.value)}
            placeholder="Ce qu'il ou elle aimait…"
            rows={3}
            className="mt-4 w-full resize-none rounded-[14px] bg-paper px-4 py-3 font-serif text-[15px] outline-none placeholder:text-dusk/35"
          />
          {!saved ? (
            <button
              type="button"
              onClick={save}
              disabled={!souvenir.trim()}
              className="mono-label mt-3 disabled:opacity-40"
              style={{ color: "var(--terracotta)" }}
            >
              Garder ce souvenir →
            </button>
          ) : (
            <p className="mt-3 font-serif text-[14px] text-dusk/70">C'est gardé dans votre jardin.</p>
          )}
        </div>
      </CorpsSection>

      <CorpsFooterNote>
        Si vous ne mangez presque plus depuis plusieurs jours, ou si vous perdez du poids rapidement, parlez-en à un médecin.
        <Link to="/practical/pros" className="mono-label mt-3 block" style={{ color: "var(--terracotta)" }}>
          Trouver un·e professionnel·le →
        </Link>
      </CorpsFooterNote>
    </CorpsPage>
  );
}
