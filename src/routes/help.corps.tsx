import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/help/corps")({
  head: () => ({ meta: [{ title: "Le corps — Aide" }] }),
  component: Hub,
});

const SPACES: { to: "/help/corps/manger" | "/help/corps/eau" | "/help/corps/habiller" | "/help/corps/nuits"; eyebrow: string; title: string; body: string }[] = [
  { to: "/help/corps/manger",   eyebrow: "Manger",   title: "Quand le corps oublie de manger",  body: "Cinq petites choses, presque rien à faire." },
  { to: "/help/corps/eau",      eyebrow: "Se laver", title: "L'eau et le corps",                 body: "Une étape à la fois." },
  { to: "/help/corps/habiller", eyebrow: "S'habiller", title: "Trouver la chose la plus douce", body: "Aujourd'hui, juste ça." },
  { to: "/help/corps/nuits",    eyebrow: "Nuits",    title: "Quand la nuit n'en finit pas",     body: "Ce que d'autres ont fait à 3 h du matin." },
];

function Hub() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="LE CORPS" back="/help" />
        <section className="px-6 pt-10 pb-8">
          <p className="mono-label">Le corps</p>
          <h1 className="mt-4 ed-page-title">
            Prendre soin <span className="italic">du corps.</span>
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Quatre espaces, à ouvrir si l'envie vient. Rien à finir, rien à prouver.
          </p>
        </section>
        <div className="px-5 space-y-3">
          {SPACES.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="card-plain p-5 block active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="eyebrow">{s.eyebrow}</p>
                  <h3 className="mt-2 h-section italic">{s.title}</h3>
                  <p className="mt-2 body-meta">{s.body}</p>
                </div>
                <span className="font-serif text-[22px] opacity-50">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}