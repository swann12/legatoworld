import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato, MODES, BRANCHES } from "@/lib/legato-state";

export const Route = createFileRoute("/space")({
  head: () => ({ meta: [{ title: "Space — Legato" }] }),
  component: Space,
});

function Space() {
  const { name, mode, branch } = useLegato();
  const modeLabel = MODES.find((m) => m.id === mode)?.label;
  const branchLabel = BRANCHES.find((b) => b.id === branch)?.label;

  const items: { to: "/memories" | "/dates" | "/onboarding" | "/crisis"; eyebrow: string; title: string }[] = [
    { to: "/memories", eyebrow: "Library", title: "Everything you've kept" },
    { to: "/dates", eyebrow: "Calendar", title: "Sensitive dates" },
    { to: "/onboarding", eyebrow: "Adjust", title: "Change branch or mode" },
    { to: "/crisis", eyebrow: "Safety", title: "If today is too much" },
  ];

  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <ScreenHeader
            eyebrow="Space — your settings, gently"
            title={<>{name}, <br /><span className="italic">your interior.</span></>}
          />

          <Section className="mt-8">
            <div className="ceramic organic-radius-3 p-6 space-y-3">
              <Row label="Holding" value={branchLabel ?? ""} />
              <Row label="Mode" value={modeLabel ?? ""} />
              <Row label="Notifications" value="Quiet (no pings)" />
              <Row label="Language" value="English" />
            </div>
          </Section>

          <Section className="mt-8 space-y-3">
            {items.map((it) => (
              <Link key={it.to} to={it.to} className="ceramic-soft organic-radius-3 p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">{it.eyebrow}</p>
                  <p className="mt-1 font-serif text-lg italic text-dusk">{it.title}</p>
                </div>
                <span className="text-dusk/40">→</span>
              </Link>
            ))}
          </Section>

          <Section className="mt-10">
            <p className="text-center text-[11px] uppercase tracking-[0.22em] text-dusk/35">
              Legato · v1 · made with care
            </p>
          </Section>
        </div>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dusk/10 pb-2 last:border-0 last:pb-0">
      <span className="text-[11px] uppercase tracking-[0.2em] text-dusk/45">{label}</span>
      <span className="font-serif text-base italic text-dusk">{value}</span>
    </div>
  );
}