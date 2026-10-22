import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LegatoLogo } from "@/components/legato/ds/LegatoLogo";
import { PrimaryButton, TextLink } from "@/components/legato/ds";
import { beginDiscovery, discoveryResumeTarget, getDiscovery, type DiscoveryState } from "@/lib/discovery";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/start/decouverte")({ head: () => legatoHead("Découvrir sans compte", "Essayez Legato. Tout reste sur ce téléphone."), component: Discovery });
function Discovery() {
  const nav = useNavigate();
  const [saved, setSaved] = useState<DiscoveryState | null>(null);
  useEffect(() => setSaved(getDiscovery()), []);
  if (!saved) return <main className="min-h-dvh bg-lg-cream" aria-busy="true" />;
  const date = saved.startedAt ? new Date(saved.startedAt) : null;
  const dateLabel = date && !Number.isNaN(date.getTime()) ? ` le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}` : "";
  const start = () => { beginDiscovery(saved.active); window.location.assign("/onboarding"); };
  const resume = () => {
    const completed = !!localStorage.getItem("legato.spaces.v1");
    window.location.assign(discoveryResumeTarget(saved, completed));
  };
  return <main className={`lg-space-today lg-discovery-entry ${saved.active ? "lg-discovery-resume" : ""}`}><div className="lg-discovery-frame"><header className="lg-discovery-entry-header"><LegatoLogo /><span className="lg-mono">Découverte</span></header><div className="lg-discovery-intro">{saved.active ? <><h1 className="lg-title">Une découverte<br /><em>est en cours.</em></h1><p className="lg-lead">Vous aviez commencé sur ce téléphone{dateLabel}. Voulez-vous reprendre, ou repartir de zéro ?</p></> : <><h1 className="lg-title">Découvrir,<br /><em>sans compte.</em></h1><p className="lg-lead">Répondez aux mêmes questions et essayez l'application. Tout reste sur ce téléphone.</p></>}</div><footer className="lg-discovery-footer"><PrimaryButton full onClick={start}>{saved.active ? "Recommencer" : "Commencer"}</PrimaryButton>{saved.active ? <TextLink onClick={resume}>Reprendre là où j'en étais</TextLink> : <TextLink onClick={() => nav({ to: "/auth", search: { mode: "signup" } })}>Créer plutôt mon espace</TextLink>}</footer></div></main>;
}