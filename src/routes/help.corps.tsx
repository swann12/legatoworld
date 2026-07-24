import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/help/corps")({
  head: () => ({ meta: [{ title: "Le corps — Aide" }] }),
  component: Hub,
});

function Hub() {
  const [step, setStep] = useState<"scan" | "action" | "content">("scan");
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [hunger, setHunger] = useState(3);

  // Simple routing: lowest signal decides the single next action.
  const pick = (): { to: "/help/corps/manger" | "/help/corps/eau" | "/help/corps/habiller" | "/help/corps/nuits"; label: string; body: string } => {
    const scores = [
      { key: "sleep",  v: sleep,  to: "/help/corps/nuits" as const,    label: "Reposer un peu",     body: "Quelques minutes pour la nuit d'après." },
      { key: "hunger", v: hunger, to: "/help/corps/manger" as const,   label: "Manger, sans y penser", body: "Une petite chose facile à avaler." },
      { key: "energy", v: energy, to: "/help/corps/eau" as const,      label: "Un peu d'eau",       body: "Un verre, puis on verra." },
    ].sort((a, b) => a.v - b.v);
    return scores[0];
  };
  const action = pick();

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="LE CORPS" back="/help" />

        {step === "scan" && (
          <>
            <section className="px-6 pt-10 pb-6">
              <p className="mono-label">Le corps</p>
              <h1 className="mt-4 ed-page-title">Comment va votre <span className="italic">corps</span>&nbsp;?</h1>
              <p className="mt-5 body-meta max-w-[34ch]">Un curseur à la fois. On adapte ensuite.</p>
            </section>
            <section className="px-6 space-y-6">
              <Slider label="Énergie"  value={energy} onChange={setEnergy} />
              <Slider label="Sommeil"  value={sleep}  onChange={setSleep} />
              <Slider label="Appétit"  value={hunger} onChange={setHunger} />
            </section>
            <section className="px-6 pt-10">
              <button onClick={() => setStep("action")} className="w-full rounded-full py-4" style={{ background: "var(--terracotta)", color: "var(--paper)" }}>
                <span className="mono-label" style={{ color: "var(--paper)", letterSpacing: "0.2em", fontSize: 10 }}>Continuer</span>
              </button>
            </section>
          </>
        )}

        {step === "action" && (
          <>
            <section className="px-6 pt-10 pb-4">
              <p className="mono-label">Une seule chose</p>
              <h1 className="mt-4 ed-page-title">{action.label}</h1>
              <p className="mt-5 body-meta max-w-[34ch]">{action.body}</p>
            </section>
            <section className="px-5 pt-4 space-y-3">
              <Link to={action.to} className="block rounded-[18px] px-5 py-5" style={{ background: "var(--blush)" }}>
                <p className="font-serif text-[18px] leading-[1.15]">Faire ce geste</p>
                <p className="mt-1 text-[12px] text-dusk/60">Guidé, quelques minutes.</p>
              </Link>
              <button onClick={() => setStep("scan")} className="block w-full text-left rounded-[18px] px-5 py-4" style={{ background: "var(--whisper)" }}>
                <p className="font-serif text-[16px]">Proposer autre chose</p>
                <p className="mt-1 text-[12px] text-dusk/60">Refaire le point.</p>
              </button>
              <button onClick={() => setStep("content")} className="block w-full text-left rounded-[18px] px-5 py-4" style={{ background: "var(--sun)" }}>
                <p className="font-serif text-[16px]">C'est déjà assez</p>
                <p className="mt-1 text-[12px] text-dusk/60">Vous voir suggérer un peu d'écoute, de lecture.</p>
              </button>
            </section>
          </>
        )}

        {step === "content" && (
          <>
            <section className="px-6 pt-10 pb-4">
              <p className="mono-label">Pour vous</p>
              <h1 className="mt-4 ed-page-title">Un peu de <span className="italic">douceur.</span></h1>
              <p className="mt-5 body-meta max-w-[34ch]">Trois suggestions, rien de plus.</p>
            </section>
            <section className="px-5 pt-4 space-y-3">
              <Link to="/care/resources" className="block rounded-[18px] px-5 py-4" style={{ background: "var(--whisper)" }}>
                <p className="mono-label text-dusk/60">Podcasts</p>
                <p className="mt-1 font-serif text-[17px]">Voix qui accompagnent</p>
              </Link>
              <Link to="/care/resources" className="block rounded-[18px] px-5 py-4" style={{ background: "var(--whisper)" }}>
                <p className="mono-label text-dusk/60">Lectures</p>
                <p className="mt-1 font-serif text-[17px]">Quelques pages, sans presser</p>
              </Link>
              <Link to="/crisis" className="block rounded-[18px] px-5 py-4" style={{ background: "var(--blush)" }}>
                <p className="mono-label text-dusk/60">Si c'est trop</p>
                <p className="mt-1 font-serif text-[17px]">Demander une présence humaine</p>
              </Link>
            </section>
          </>
        )}
      </div>
    </Shell>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-serif text-[17px]">{label}</p>
        <span className="mono-label text-dusk/55">{value}/5</span>
      </div>
      <input
        type="range" min={1} max={5} step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-3 w-full"
        style={{ accentColor: "var(--terracotta)" }}
      />
    </div>
  );
}