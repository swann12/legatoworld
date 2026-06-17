import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

/** Coquille commune aux espaces "Aide et accompagnement" (mode RELAIS).
 *  Fournit le bouton retour discret "← AIDE" en haut à gauche et le fond
 *  d'ambiance, sans nav du bas (immersif). */
export function HelpShell({
  children,
  backTo = "/help",
  backLabel = "← Aide",
}: {
  children: ReactNode;
  backTo?: "/help" | "/help/corps";
  backLabel?: string;
}) {
  return (
    <Shell hideNav>
      <div className="relative pb-16">
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link
              to={backTo}
              className="eyebrow hover:text-dusk transition-colors"
            >
              {backLabel}
            </Link>
          </div>
          {children}
        </div>
      </div>
    </Shell>
  );
}

export function HelpHeader({
  title,
  subtitle,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <header className="px-7 pt-10">
      <h1 className="ed-page-title italic text-dusk text-balance">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-5 body-meta max-w-[34ch]">
          {subtitle}
        </p>
      )}
    </header>
  );
}