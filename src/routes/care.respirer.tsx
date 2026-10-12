import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExperienceLayout } from "@/components/legato/ds";

export const Route = createFileRoute("/care/respirer")({
  head: () => ({
    meta: [
      { title: "Respirer — Legato" },
      { name: "description", content: "Inspirer quatre secondes, expirer six. Dix cycles, à votre rythme." },
      { property: "og:title", content: "Respirer — Legato" },
      { property: "og:description", content: "Inspirer quatre secondes, expirer six." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Respirer,
});

const IN = 4, OUT = 6, CYCLES = 10;

function Respirer() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [cycle, setCycle] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      if (phase === "in") setPhase("out");
      else if (cycle + 1 >= CYCLES) { setRunning(false); setDone(true); }
      else { setCycle((c) => c + 1); setPhase("in"); }
    }, (phase === "in" ? IN : OUT) * 1000);
    return () => clearTimeout(t);
  }, [running, phase, cycle]);

  const start = () => { setDone(false); setCycle(0); setPhase("in"); setRunning(true); };
  const big = running && phase === "in";
  const label = done ? "merci" : !running ? "inspirez" : phase === "in" ? "inspirez" : "expirez";

  return (
    <ExperienceLayout variant="support" back="/care" backLabel="Soutien"
      top={<>
        <h1 className="lg-title lg-ds-title" style={{ fontSize: 34 }}>Inspirer quatre secondes,<br /><em>expirer six.</em></h1>
        <p className="mt-4 text-[14.5px]">{running ? `Cycle ${cycle + 1} sur ${CYCLES}. Vous pouvez arrêter à tout moment.` : "Dix cycles. Vous pouvez arrêter à tout moment."}</p>
      </>}
      action={
        <button type="button" onClick={running ? () => setRunning(false) : start}
          className="h-[54px] rounded-full px-14 text-[15px]"
          style={{ background: "color-mix(in oklab, var(--lg-cream) 88%, transparent)", color: "var(--lg-deep)" }}>
          {running ? "Arrêter" : done ? "Recommencer · 3 min" : "Commencer · 3 min"}
        </button>
      }>
      <div className="relative grid size-[252px] place-items-center rounded-full" style={{ border: "1px solid color-mix(in oklab, var(--lg-cream) 55%, transparent)" }}>
        <div className="grid size-[182px] place-items-center rounded-full"
          style={{
            border: "1px solid color-mix(in oklab, var(--lg-cream) 60%, transparent)",
            background: "color-mix(in oklab, var(--lg-cream) 18%, transparent)",
            transform: `scale(${big ? 1.36 : 1})`,
            transition: `transform ${running ? (phase === "in" ? IN : OUT) : 1}s ease-in-out`,
          }}>
          <span className="italic" style={{ fontFamily: "var(--lg-serif)", fontSize: 24, transform: `scale(${big ? 0.74 : 1})`, transition: "transform 1s" }}>{label}</span>
        </div>
      </div>
    </ExperienceLayout>
  );
}
