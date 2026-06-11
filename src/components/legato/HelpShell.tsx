import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { Halos } from "@/components/legato/Halos";
import { useLegato } from "@/lib/legato-state";

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
  const { mode } = useLegato();
  return (
    <Shell hideNav>
      <div className="relative pb-16">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link
              to={backTo}
              className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk transition-colors"
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
      <h1 className="font-serif italic text-[1.7rem] leading-[1.15] font-light text-dusk text-balance">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-dusk/65">
          {subtitle}
        </p>
      )}
    </header>
  );
}