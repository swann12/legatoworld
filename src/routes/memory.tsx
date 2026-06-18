import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { useLovedName } from "@/lib/loved-name";
import { journeyModules, MEMORY_LABELS, type MemoryModule } from "@/lib/journey-config";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { upcomingSensitiveDates } from "@/lib/sensitive-dates";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "Mémoire — Legato" },
      { name: "description", content: "Le jardin, les voix, les lettres, les dates qui comptent." },
    ],
  }),
  component: MemoryIndex,
});

function MemoryIndex() {
  const { situation, primaryNeed, stage } = useLegato();
  const lovedName = useLovedName();
  const { memory } = journeyModules(situation, primaryNeed, stage);
  const dates = upcomingSensitiveDates({ windowDays: 7 });

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <Link to="/garden" className="mono-label text-dusk/55">Jardin →</Link>
        </header>
        <section className="px-6 pt-10">
          <p className="mono-label">Mémoire</p>
          <h1 className="mt-5 ed-page-title">
            Garder <span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span>
          </h1>
          <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Voix, photos, mots, dates — ici, rien ne s'efface. Tout reste à vous.
          </p>
        </section>

        {dates.length > 0 && (
          <section className="px-5 pt-8">
            <p className="mono-label px-1" style={{ color: "var(--terracotta)" }}>Une date approche</p>
            <div className="mt-3 rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4">
              {dates.slice(0, 2).map((d) => (
                <p key={d.id} className="font-serif text-[16px] text-dusk italic">
                  {d.label} — {d.daysAway === 0 ? "aujourd'hui" : `dans ${d.daysAway} j`}
                </p>
              ))}
              <Link to="/dates" className="mt-3 inline-block mono-label" style={{ color: "var(--terracotta)" }}>
                Préparer un geste →
              </Link>
            </div>
          </section>
        )}

        <section className="px-5 pt-8 flex flex-col gap-3">
          {(memory.length ? memory : (["garden", "voices", "letters", "dates"] as MemoryModule[])).map((m) => {
            const cfg = MEMORY_LABELS[m];
            return (
              <Link
                key={m}
                to={cfg.to as "/garden"}
                className="block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4"
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
          })}
        </section>
      </div>
    </Shell>
  );
}