import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import { journeyModules, CARE_LABELS, type CareModule } from "@/lib/journey-config";
import { LegatoMark } from "@/components/legato/LegatoMark";

export const Route = createFileRoute("/care/")({
  head: () => ({
    meta: [
      { title: "Soutien — Legato" },
      { name: "description", content: "Émotions, journal, respiration, sommeil, communauté, thérapeutes — sans aucune démarche administrative." },
    ],
  }),
  component: Care,
});

function Care() {
  const { situation, primaryNeed, stage, currentEmotions } = useLegato();
  const lovedName = useLovedName();
  const { care } = journeyModules(situation, primaryNeed, stage);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <Link to="/checkin" className="mono-label text-dusk/55">Check-in →</Link>
        </header>
        <section className="px-6 pt-10">
          <p className="mono-label">Soutien émotionnel</p>
          <h1 className="mt-5 ed-page-title">
            Prendre soin de <span className="italic" style={{ color: "var(--terracotta)" }}>vous</span>
          </h1>
          <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            {currentEmotions.length > 0
              ? "Voici ce qui peut vous faire du bien, là."
              : `Un espace tendre pour vous, ${lovedName ? "et pour ce que vous portez de " + lovedName + "." : "et pour ce que vous traversez."}`}
          </p>
        </section>

        <section className="px-5 pt-8 flex flex-col gap-3">
          {care.map((m) => <CareCard key={m} module={m} />)}
        </section>

        <footer className="px-6 pt-10 text-center">
          <p className="text-[11px] italic text-dusk/45 max-w-[34ch] mx-auto">
            L'IA de Legato ne remplace pas un·e thérapeute. En cas de détresse, un humain reste à un appel.
          </p>
        </footer>
      </div>
    </Shell>
  );
}

function CareCard({ module: m }: { module: CareModule }) {
  const cfg = CARE_LABELS[m];
  return (
    <Link
      to={cfg.to as "/journal"}
      className="block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4 transition-colors hover:border-dusk/25"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-[18px] leading-[1.2] text-dusk">{cfg.label}</p>
          <p className="mt-1 text-[12.5px] text-dusk/55">{cfg.hint}</p>
        </div>
        <span className="text-dusk/40 text-[16px]">→</span>
      </div>
    </Link>
  );
}