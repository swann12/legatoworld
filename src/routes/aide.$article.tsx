import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, TextLink } from "@/components/legato/ds";
import { useSavedToast } from "@/components/legato/ActionFeedback";
import { findArticle } from "@/lib/aide-articles";
import { legatoHead } from "@/lib/legato-head";

/** D011 · x-article : un article d'aide, ouvert par plusieurs boutons. */
export const Route = createFileRoute("/aide/$article")({
  head: () => legatoHead("Une réponse de l'aide", "Une réponse courte à une question sur Legato, geste par geste."),
  component: Page,
});

const serif = { fontFamily: "var(--lg-serif)", fontWeight: 400 } as const;

function Page() {
  const { article } = Route.useParams();
  const { show, toast } = useSavedToast();
  const a = findArticle(article);
  return (
    <StandardLayout back="/profile/help" backLabel="Aide" activeTab="/home">
      {a ? (
        <>
          <PageTitle className="pt-8">{a.title[0]}<br /><em>{a.title[1]}</em></PageTitle>
          <p className="lg-section mt-6" style={{ color: "var(--sp-accent)" }}>{a.intro}</p>
          <ol className="mt-2">
            {a.steps.map((s, i) => (
              <li key={i} className="flex gap-5 py-4" style={{ borderBottom: i < a.steps.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
                <span aria-hidden style={{ ...serif, fontSize: 22, color: "var(--sp-accent)" }}>{i + 1}</span>
                <p className="text-[15px] leading-[1.55]">{s}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center text-[14px]" style={{ color: "var(--sp-sub)" }}>Cette réponse vous a aidé ?</p>
          <div className="mt-3 flex justify-center gap-3">
            <button type="button" onClick={() => show("Merci, c'est noté.")} className="h-10 rounded-full px-8 text-[14px]" style={{ border: "1px solid var(--sp-line-2)" }}>Oui</button>
            <button type="button" onClick={() => show("Merci, nous allons l'améliorer.")} className="h-10 rounded-full px-8 text-[14px]" style={{ border: "1px solid var(--sp-line-2)" }}>Non</button>
          </div>
          <div className="mt-8 text-center">
            <TextLink onClick={() => { window.location.href = "mailto:contact@legato.app?subject=Legato"; }}>Écrire à l'équipe</TextLink>
          </div>
        </>
      ) : (
        <>
          <PageTitle className="pt-8">Réponse introuvable.</PageTitle>
          <Lead className="mt-4">Revenez à l'aide pour retrouver les questions.</Lead>
        </>
      )}
      {toast}
    </StandardLayout>
  );
}
