import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { StandardLayout, PageTitle, Lead, ArrowRow, PrimaryButton } from "@/components/legato/ds";

export const Route = createFileRoute("/profile/help")({
  head: () => ({
    meta: [
      { title: "Aide et contact — Legato" },
      { name: "description", content: "Une question sur l'application, un problème, une remarque." },
      { property: "og:title", content: "Aide et contact — Legato" },
      { property: "og:description", content: "Questions fréquentes et contact de l'équipe Legato." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Help,
});

const FAQ = [
  { q: "Comment supprimer un souvenir ?", a: "Ouvrez le souvenir dans Mémoire, puis touchez « Supprimer » en bas de la page. Rien n'est effacé sans votre confirmation." },
  { q: "Comment inviter un proche ?", a: "Dans Vos espaces, ouvrez « Votre cercle » puis « Inviter un proche ». Vous recevez un lien à lui envoyer." },
  { q: "Mes données sont-elles protégées ?", a: "Votre journal, votre humeur et vos échanges avec Présence ne sont visibles que par vous. Vous pouvez tout télécharger ou tout supprimer dans « Vos données »." },
];

/** 105 · Aide et contact */
function Help() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <StandardLayout back="/profile" backLabel="Mon compte" activeTab="/home">
      <PageTitle className="pt-8">Aide <em>et contact.</em></PageTitle>
      <Lead className="mt-3">Une question sur l'application, un problème, une remarque.</Lead>
      <div className="mt-5">
        <ArrowRow title="Comment fonctionne Legato" subtitle="Les cinq espaces, en une page" to="/presentation" />
        {FAQ.map((f, i) => (
          <div key={f.q} style={{ borderBottom: i < FAQ.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-4 py-[18px] text-left">
              <span className="lg-row-title flex-1">{f.q}</span>
              <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.3} />
            </button>
            {open === i && <p className="-mt-2 pb-4 text-[14px] leading-[1.55]" style={{ color: "var(--sp-sub)" }}>{f.a}</p>}
          </div>
        ))}
      </div>
      <div className="mt-6"><PrimaryButton onClick={() => { window.location.href = "mailto:contact@legato.app?subject=Legato"; }}>Écrire à l'équipe</PrimaryButton></div>
    </StandardLayout>
  );
}
