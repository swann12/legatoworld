import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpShell, HelpHeader } from "@/components/legato/HelpShell";

export const Route = createFileRoute("/help/corps")({
  head: () => ({ meta: [{ title: "Le corps — Aide" }] }),
  component: Hub,
});

const SPACES: { to: "/help/corps/manger" | "/help/corps/eau" | "/help/corps/habiller" | "/help/corps/nuits"; symbol: string; title: string; body: string }[] = [
  { to: "/help/corps/manger",   symbol: "♡", title: "Quand le corps oublie de manger", body: "Cinq petites choses, presque rien à faire." },
  { to: "/help/corps/eau",      symbol: "♡", title: "L'eau et le corps",                body: "Se laver, une étape à la fois." },
  { to: "/help/corps/habiller", symbol: "♡", title: "S'habiller",                        body: "Trouver la chose la plus douce, aujourd'hui." },
  { to: "/help/corps/nuits",    symbol: "♡", title: "Les nuits qui n'en finissent pas",  body: "Ce que d'autres ont fait à 3 h du matin." },
];

function Hub() {
  return (
    <HelpShell backTo="/help" backLabel="← Aide">
      <HelpHeader
        title="Prendre soin du corps."
        subtitle="Quatre espaces, à ouvrir uniquement si l'envie vient. Rien à finir, rien à prouver."
      />
      <div className="px-5 mt-10 space-y-4">
        {SPACES.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="glass-card organic-radius-3 px-7 py-6 block hover:opacity-95 transition-opacity"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-serif italic text-[18px] text-dusk/45">{s.symbol}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif italic text-[18px] text-dusk leading-snug">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-dusk/65">{s.body}</p>
              </div>
              <span className="text-dusk/40">→</span>
            </div>
          </Link>
        ))}
      </div>
    </HelpShell>
  );
}