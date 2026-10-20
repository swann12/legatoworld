import { createFileRoute } from "@tanstack/react-router";
import { SiteOfficiel } from "@/components/legato/shared-pages";
import { legatoHead } from "@/lib/legato-head";

type SiteSearch = { site?: string; url?: string; papiers?: string; duree?: string };

/** D007 · x-lien-officiel : page réutilisée avant d'ouvrir un site officiel. */
export const Route = createFileRoute("/partage/site-officiel")({
  validateSearch: (s: Record<string, unknown>): SiteSearch => ({
    site: typeof s.site === "string" ? s.site : undefined,
    url: typeof s.url === "string" ? s.url : undefined,
    papiers: typeof s.papiers === "string" ? s.papiers : undefined,
    duree: typeof s.duree === "string" ? s.duree : undefined,
  }),
  head: () => legatoHead("Avant d'ouvrir un site officiel", "Préparer les papiers utiles avant de quitter Legato pour un site officiel."),
  component: Page,
});

function Page() {
  const { site, url, papiers, duree } = Route.useSearch();
  return (
    <SiteOfficiel
      site={site ?? "ameli.fr"}
      url={url ?? "https://www.ameli.fr"}
      papiers={papiers?.split("|").filter(Boolean) ?? ["L'acte de décès", "Votre RIB", "Le livret de famille"]}
      duree={duree ?? "environ 10 minutes"}
    />
  );
}
