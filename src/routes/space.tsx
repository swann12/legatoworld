import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato, MODES, BRANCHES } from "@/lib/legato-state";

export const Route = createFileRoute("/space")({
  head: () => ({ meta: [{ title: "Espace — Legato" }] }),
  component: Space,
});

function Space() {
  const { name, mode, branch } = useLegato();
  const modeLabel = MODES.find((m) => m.id === mode)?.label;
  const branchLabel = BRANCHES.find((b) => b.id === branch)?.label;

  const items: { to: "/memories" | "/dates" | "/onboarding" | "/crisis"; eyebrow: string; title: string }[] = [
    { to: "/memories", eyebrow: "Bibliothèque", title: "Ce que vous avez gardé" },
    { to: "/dates", eyebrow: "Calendrier", title: "Dates sensibles" },
    { to: "/onboarding", eyebrow: "Ajuster", title: "Changer de branche ou de mode" },
    { to: "/crisis", eyebrow: "Sécurité", title: "Si aujourd'hui pèse trop" },
  ];

  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <ScreenHeader
            eyebrow="Votre espace"
            title={<>{name}, <br /><span className="italic">votre intérieur.</span></>}
          />

          <Section className="mt-8">
            <div className="ceramic organic-radius-3 p-6 space-y-3 opacity-85">
              <Row label="Présence tenue" value={branchLabel ?? ""} />
              <Row label="Mode" value={modeLabel ?? ""} />
              <Row label="Notifications" value="Silencieuses" />
              <Row label="Langue" value="Français" />
            </div>
          </Section>

          {/* Mes volontés — surface distincte, plus engageante */}
          <Section className="mt-8">
            <Link
              to="/wishes"
              className="ceramic organic-radius-3 block p-7 relative overflow-hidden opacity-90 hover:opacity-100 transition-opacity"
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-10 size-40 rounded-full opacity-50 halo"
                style={{ background: "radial-gradient(circle, var(--lavender), transparent 70%)" }}
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/45">
                  Mes volontés
                </p>
                <h2 className="mt-2 font-serif text-[1.5rem] font-light italic text-dusk leading-snug max-w-[22ch]">
                  Ce que vous voudriez, pour plus tard.
                </h2>
                <p className="mt-3 text-[12.5px] leading-relaxed text-dusk/60 max-w-[34ch]">
                  Une atmosphère, des mots, des gestes. Rien d'urgent.
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
                  Ouvrir mes volontés →
                </p>
              </div>
            </Link>
          </Section>

          <Section className="mt-8 space-y-3">
            {items.map((it) => (
              <Link key={it.to} to={it.to} className="ceramic-soft organic-radius-3 p-5 flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
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
              Legato · v1 · fait avec soin
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