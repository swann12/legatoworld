import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { loadPractical, savePractical } from "@/lib/practical-store";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import { PageHeader, IvoryCard } from "@/components/legato/EditorialUI";
import { ChipSelect } from "@/components/legato/ChipSelect";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { refineCeremony, type CeremonyIdea } from "@/lib/ceremony-ai.functions";
import {
  FLOWER_STEPS, MUSIC_STEPS, TEXT_STEPS,
  flowerProposals, musicProposals, textProposals, type Proposal,
} from "@/lib/ceremony-suggest";


export const Route = createFileRoute("/practical/ceremony")({
  head: () => ({
    meta: [
      { title: "Cérémonie — Legato" },
      { name: "description", content: "Fleurs, musique, textes : un accompagnement guidé par vos choix, jamais un formulaire." },
      { property: "og:title", content: "Préparer la cérémonie — Legato" },
      { property: "og:description", content: "Choisissez, Legato propose : fleurs, musique et textes qui lui ressemblent." },
    ],
  }),
  component: Ceremony,
});

const KINDS = [
  { id: "inhumation", label: "Inhumation", body: "Mise en terre. Permet un lieu de recueillement durable." },
  { id: "cremation",  label: "Crémation",  body: "Urne, dispersion, jardin du souvenir. Plus souple." },
  { id: "civile",     label: "Cérémonie civile", body: "Sans rite religieux. Mots, musiques, gestes choisis." },
  { id: "religieuse", label: "Cérémonie religieuse", body: "Selon la tradition de la personne." },
  { id: "intime",     label: "Hommage intime", body: "Quelques proches, dehors ou chez soi." },
];

function Ceremony() {
  const { situation, stage, lovedOneRelation, hydrated } = useLegato();
  const lovedName = useLovedName();
  const { portrait } = usePortrait();
  const [kind, setKind] = useState("");
  const [venue, setVenue] = useState("");
  const [flowers, setFlowers] = useState<Record<string, string>>({});
  const [music, setMusic] = useState<Record<string, string>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});

  useEffect(() => { const s = loadPractical(); setKind(s.ceremonyKind); setVenue(s.ceremonyVenue); }, []);
  const update = (k: string, v: string) => { setKind(k); setVenue(v); savePractical({ ceremonyKind: k, ceremonyVenue: v }); };

  const hidden = hydrated && lovedOneRelation === "animal";
  const passed = hydrated && situation !== "volontes" && (stage === "obseques_passees" || stage === "demarches" || stage === "apres");
  if (hidden || passed) {
    return (
      <Shell livingBg={false}>
        <div className="min-h-dvh bg-paper text-dusk p-6">
          <PageHeader title="CÉRÉMONIE" back="/practical" />
          <h1 className="mt-10 ed-page-title">Cette étape n'est pas prioritaire dans votre parcours.</h1>
          <Link to="/care/memory" className="mt-6 inline-block mono-label">Créer un hommage symbolique →</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="CÉRÉMONIE" back="/practical" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Préparer la cérémonie</p>
          <h1 className="mt-4 ed-page-title">
            Quelque chose qui <span className="italic" style={{ color: "var(--terracotta)" }}>lui ressemble.</span>
          </h1>
          <p className="mt-5 body-meta max-w-[36ch]">
            Vous choisissez, Legato propose. Rien à rédiger : tout se fait par sélection.
          </p>
        </section>

        <section className="px-5 space-y-2.5">
          {KINDS.map((k) => {
            const active = kind === k.id;
            return (
              <button
                key={k.id}
                onClick={() => update(k.id, venue)}
                className={`w-full text-left rounded-[14px] border p-5 transition-colors ${
                  active ? "border-dusk/30 bg-clay" : "border-dusk/12 bg-paper hover:bg-clay/40"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <p className="font-serif text-[18px] text-dusk">{k.label}</p>
                  {active && <span className="mono-label">Choisi</span>}
                </div>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-dusk/65">{k.body}</p>
              </button>
            );
          })}
        </section>

        <section className="px-5 mt-6">
          <IvoryCard className="p-5">
            <p className="mono-label">Lieu pressenti</p>
            <input
              value={venue}
              onChange={(e) => update(kind, e.target.value)}
              placeholder="Une église, un jardin, la maison, ailleurs…"
              className="mt-3 w-full bg-transparent outline-none border-b border-dusk/15 pb-2 font-serif text-[16px] text-dusk placeholder:text-dusk/30"
            />
          </IvoryCard>
        </section>

        <GuidedBlock
          label="Fleurs"
          section="fleurs"
          title="Composer les fleurs"
          steps={FLOWER_STEPS}
          answers={flowers}
          setAnswers={setFlowers}
          proposals={flowerProposals(flowers, portrait)}
          footer={<Link to="/practical/flowers" className="mono-label" style={{ color: "var(--terracotta)" }}>Composer l'image du bouquet →</Link>}
        />

        <GuidedBlock
          label="Musique"
          section="musique"
          title="Choisir la musique"
          steps={MUSIC_STEPS}
          answers={music}
          setAnswers={setMusic}
          proposals={musicProposals(music, portrait)}
          footer={<Link to="/practical/atmosphere" className="mono-label" style={{ color: "var(--terracotta)" }}>Composer l'atmosphère →</Link>}
        />

        <GuidedBlock
          label="Textes"
          section="textes"
          title="Écrire les mots"
          steps={TEXT_STEPS}
          answers={texts}
          setAnswers={setTexts}
          proposals={textProposals(texts, portrait, lovedName)}
          footer={<Link to="/practical/texts" className="mono-label" style={{ color: "var(--terracotta)" }}>Travailler le texte →</Link>}
        />

        <section className="px-5 mt-10">
          <Link to="/practical/booklet" className="block rounded-[14px] border border-dusk/10 bg-paper p-5 flex items-baseline justify-between hover:bg-dusk/[0.02] transition-colors">
            <span className="font-serif text-[16px] text-dusk">Préparer un livret de cérémonie</span>
            <span className="text-dusk/45">→</span>
          </Link>
          <Link
            to="/profile/portrait"
            className="mt-3 block rounded-[14px] px-5 py-4"
            style={{ background: "var(--whisper)" }}
          >
            <p className="mono-label text-dusk/55">Pour des propositions plus justes</p>
            <p className="mt-1.5 font-serif text-[16px]">Compléter son portrait →</p>
          </Link>
          <Link
            to="/practical/share"
            className="mt-3 block rounded-[14px] border border-dusk/10 bg-paper px-5 py-4"
          >
            <p className="mono-label text-dusk/55">À plusieurs</p>
            <p className="mt-1.5 font-serif text-[16px]">Envoyer ces choix à un proche →</p>
          </Link>
        </section>

      </div>
      <ConfideDock step="cérémonie" />
    </Shell>
  );
}

function GuidedBlock({
  label, title, steps, answers, setAnswers, proposals, footer, section,
}: {
  label: string;
  title: string;
  steps: { key: string; question: string; options: { id: string; label: string }[] }[];
  answers: Record<string, string>;
  setAnswers: (v: Record<string, string>) => void;
  proposals: Proposal[];
  footer?: React.ReactNode;
  section: "fleurs" | "musique" | "textes";
}) {
  const answered = steps.filter((s) => answers[s.key]).length;
  const visible = steps.slice(0, Math.min(steps.length, answered + 1));

  const { portrait } = usePortrait();
  const lovedName = useLovedName();
  const refine = useServerFn(refineCeremony);
  const [brief, setBrief] = useState("");
  const [ideas, setIdeas] = useState<CeremonyIdea[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = async () => {
    const text = brief.trim();
    if (text.length < 3 || pending) return;
    setPending(true);
    setError(null);
    try {
      const choices = steps
        .filter((s) => answers[s.key])
        .map((s) => `${s.question} ${s.options.find((o) => o.id === answers[s.key])?.label ?? ""}`)
        .join(" · ");
      const res = await refine({
        data: {
          section,
          brief: text,
          choices: choices || undefined,
          portrait: portraitSentence(portrait, lovedName) || undefined,
          lovedName: lovedName || undefined,
        },
      });
      if (res.ideas.length) setIdeas(res.ideas);
      else setError(res.error ?? "Aucune proposition pour l'instant.");
    } catch {
      setError("Impossible de joindre le service pour le moment.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="px-5 mt-10">
      <div className="rounded-[22px] border border-dusk/12 bg-paper px-5 py-6">
        <div className="flex items-baseline justify-between">
          <p className="mono-label">{label}</p>
          <p className="mono-label text-dusk/40">{answered}/{steps.length}</p>
        </div>
        <h2 className="mt-3 font-serif text-[21px] leading-[1.15]">{title}</h2>

        <div className="mt-5 space-y-5">
          {visible.map((s) => (
            <div key={s.key}>
              <p className="text-[13.5px] text-dusk/70">{s.question}</p>
              <div className="mt-2.5">
                <ChipSelect
                  options={s.options}
                  value={answers[s.key] ? [answers[s.key]] : []}
                  onChange={(next) => setAnswers({ ...answers, [s.key]: next[0] ?? "" })}
                />
              </div>
            </div>
          ))}
        </div>

        {proposals.length > 0 && (
          <div className="mt-6 space-y-2.5">
            {proposals.map((p) => (
              <div key={p.title} className="rounded-[16px] px-4 py-4" style={{ background: "var(--whisper)" }}>
                <p className="mono-label text-dusk/55">{p.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-[1.55] text-dusk/80">{p.body}</p>
              </div>
            ))}
            {footer && <div className="pt-2">{footer}</div>}
          </div>
        )}

        {/* Écrire librement — l'IA part de vos mots */}
        <div className="mt-7 border-t border-dusk/10 pt-5">
          <p className="mono-label text-dusk/55">Ou dites-le avec vos mots</p>
          <p className="mt-2 text-[12.5px] leading-[1.55] text-dusk/60">
            Une intention, un souvenir, une ambiance : écrivez ce que vous avez en tête, même si aucune proposition ne correspond.
          </p>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={3}
            placeholder="Elle aimait les fleurs des champs, ramassées au bord du chemin…"
            className="mt-3 w-full resize-none rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] leading-[1.5] outline-none focus:border-dusk/35"
          />
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={ask}
              disabled={pending || brief.trim().length < 3}
              className="rounded-full px-5 py-2.5 text-[13px] disabled:opacity-40"
              style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
            >
              {pending ? "Un instant…" : "Proposer à partir de mes mots"}
            </button>
            {ideas.length > 0 && (
              <button type="button" onClick={() => { setIdeas([]); setBrief(""); }} className="mono-label text-dusk/45">
                Effacer
              </button>
            )}
          </div>
          {error && <p className="mt-3 text-[12.5px] text-dusk/55">{error}</p>}
          {ideas.length > 0 && (
            <div className="mt-4 space-y-2.5">
              {ideas.map((i) => (
                <div key={i.title} className="rounded-[16px] px-4 py-4" style={{ background: "var(--blush)" }}>
                  <p className="mono-label text-dusk/60">{i.title}</p>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-dusk/80">{i.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

