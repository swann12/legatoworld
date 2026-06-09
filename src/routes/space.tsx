import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato, BRANCHES, TODAY_STATES } from "@/lib/legato-state";

export const Route = createFileRoute("/space")({
  head: () => ({ meta: [{ title: "Espace — Legato" }] }),
  component: Space,
});

function Space() {
  const { name, branch, space, setSpace, todayState } = useLegato();
  const branchLabel = BRANCHES.find((b) => b.id === branch)?.label;
  const todayLabel = TODAY_STATES.find((t) => t.id === todayState)?.label;
  const spaceLabel =
    space === "concrete" ? "Aide concrète" : space === "psy" ? "Accompagnement" : "—";

  const items: { to: "/memories" | "/dates" | "/onboarding" | "/crisis"; eyebrow: string; title: string }[] = [
    { to: "/memories", eyebrow: "Bibliothèque", title: "Ce que vous avez gardé" },
    { to: "/dates", eyebrow: "Calendrier", title: "Dates sensibles" },
    { to: "/onboarding", eyebrow: "Ajuster", title: "Ajuster mes réponses" },
    { to: "/crisis", eyebrow: "Sécurité", title: "Si aujourd'hui pèse trop" },
  ];

  return (
    <Shell>
      <ScreenHeader
        eyebrow="Votre espace"
        title={`${name}, votre intérieur.`}
        back={{ to: "/home", label: "Aujourd'hui" }}
      />

      {/* Bascule entre les deux espaces — seule porte officielle. */}
      <Section className="mt-8">
        <p className="eyebrow mb-3">Espace actif</p>
        <div className="surface p-2 flex gap-1">
          {([
            ["psy", "Accompagnement"],
            ["concrete", "Aide concrète"],
          ] as const).map(([id, label]) => {
            const active = space === id;
            return (
              <button
                key={id}
                onClick={() => setSpace(id)}
                className={`flex-1 py-3 rounded-[12px] text-[13px] transition-colors ${
                  active ? "bg-dusk text-paper" : "text-dusk/70 hover:bg-dusk/[0.04]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section className="mt-8">
        <div className="surface p-6 space-y-3">
          <Row label="Espace" value={spaceLabel} />
          <Row label="Situation" value={branchLabel ?? ""} />
          <Row label="État du jour" value={todayLabel ?? "—"} />
          <Row label="Notifications" value="Silencieuses" />
          <Row label="Langue" value="Français" />
        </div>
      </Section>

      <Section className="mt-8">
        <Link to="/wishes" className="surface block p-6 hover:bg-dusk/[0.02] transition-colors group">
          <p className="eyebrow">Mes volontés</p>
          <h2 className="mt-3 font-serif text-[20px] font-light text-dusk leading-snug max-w-[22ch]">
            Ce que vous voudriez, pour plus tard.
          </h2>
          <p className="mt-2 text-[13px] leading-[1.55] text-dusk/65 max-w-[34ch]">
            Une atmosphère, des mots, des gestes. Rien d'urgent.
          </p>
          <p className="mt-4 eyebrow-sm group-hover:text-dusk">Ouvrir mes volontés →</p>
        </Link>
      </Section>

      <Section className="mt-8 space-y-3">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="surface p-5 flex items-baseline justify-between gap-4 hover:bg-dusk/[0.02] transition-colors"
          >
            <div>
              <p className="eyebrow">{it.eyebrow}</p>
              <p className="mt-2 font-serif text-[17px] font-light text-dusk">{it.title}</p>
            </div>
            <span className="text-dusk/40">→</span>
          </Link>
        ))}
      </Section>

      <Section className="mt-10 mb-8">
        <p className="text-center eyebrow-sm">Legato · v1 · fait avec soin</p>
      </Section>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dusk/10 pb-2 last:border-0 last:pb-0 gap-4">
      <span className="eyebrow-sm">{label}</span>
      <span className="text-[14px] text-dusk">{value}</span>
    </div>
  );
}