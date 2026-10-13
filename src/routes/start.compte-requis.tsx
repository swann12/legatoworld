import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StandardLayout, PrimaryButton, TextLink } from "@/components/legato/ds";
import { prepareDiscoveryAccount } from "@/lib/discovery";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/start/compte-requis")({ validateSearch: (s: Record<string, unknown>) => ({ action: s.action === "group" ? "group" as const : "invite" as const }), head: () => legatoHead("Compte nécessaire", "Gardez ce que vous avez commencé et créez votre espace."), component: Required });
function Required() {
  const { action } = Route.useSearch(); const nav = useNavigate();
  return <StandardLayout back="/home" backLabel="Aujourd'hui" nav={false} className="lg-discovery-prompt"><div className="lg-discovery-prompt-body"><h1 className="lg-title">{action === "group" ? "Pour écrire dans un groupe," : "Pour inviter un proche,"}<br /><em>créez votre espace.</em></h1><p className="lg-lead mt-[22px]">Ce que vous avez déjà fait sera gardé.</p></div><footer className="lg-discovery-footer"><PrimaryButton full onClick={() => { prepareDiscoveryAccount(); void nav({ to: "/auth", search: { mode: "signup" } }); }}>Créer mon espace</PrimaryButton><TextLink to="/home">Continuer la découverte</TextLink></footer></StandardLayout>;
}