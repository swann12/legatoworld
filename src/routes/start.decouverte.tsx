import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LegatoLogo } from "@/components/legato/ds/LegatoLogo";
import { PrimaryButton, TextLink } from "@/components/legato/ds";
import { beginDiscovery } from "@/lib/discovery";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/start/decouverte")({ head: () => legatoHead("Découvrir sans compte", "Essayez Legato. Tout reste sur ce téléphone."), component: Discovery });
function Discovery() {
  const nav = useNavigate();
  return <main className="lg-space-today lg-discovery-entry"><div className="lg-discovery-frame"><header className="lg-discovery-entry-header"><LegatoLogo /><span className="lg-mono">Découverte</span></header><div className="lg-discovery-intro"><h1 className="lg-title">Découvrir,<br /><em>sans compte.</em></h1><p className="lg-lead">Répondez aux mêmes questions et essayez l'application. Tout reste sur ce téléphone.</p></div><footer className="lg-discovery-footer"><PrimaryButton full onClick={() => { beginDiscovery(); void nav({ to: "/onboarding" }); }}>Commencer</PrimaryButton><TextLink onClick={() => nav({ to: "/auth", search: { mode: "signup" } })}>Créer plutôt mon espace</TextLink></footer></div></main>;
}