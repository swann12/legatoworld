import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { ModeBackground } from "./ModeBackground";
import { ConfideDock } from "./ConfideDock";
import { useLegato } from "@/lib/legato-state";

export function Shell({
  children,
  hideNav = false,
  livingBg = true,
  hideConfide = false,
  confideStep,
}: {
  children: ReactNode;
  hideNav?: boolean;
  /** Render the mode-aware living background. Pages that paint their own
   *  full-screen ambiance (no-words sequences, onboarding) should pass false. */
  livingBg?: boolean;
  /** Hide the floating Présence dock (e.g. for the onboarding/intro screens). */
  hideConfide?: boolean;
  /** Optional context label sent to the Présence dock. */
  confideStep?: string;
}) {
  const { mode } = useLegato();
  return (
    <div className="min-h-dvh bg-paper text-dusk">
      <div className={`mobile-frame relative ${hideNav ? "pb-0" : "pb-32"}`}>
        {livingBg && <ModeBackground mode={mode} />}
        <div className="relative" style={{ zIndex: 1 }}>{children}</div>
      </div>
      {!hideNav && <BottomNav />}
      {!hideConfide && <ConfideDock step={confideStep} />}
    </div>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  back,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Retour vers le parent (filet mono discret au-dessus du titre). */
  back?: { to: string; label?: string };
}) {
  return (
    <>
      {/* Top hairline bar — ancre identique à /start, sigle gauche */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-dusk/12">
        {back ? (
          <Link
            to={back.to}
            className="text-[10px] uppercase tracking-[0.22em] text-dusk/60 hover:text-dusk transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← {back.label ?? "Retour"}
          </Link>
        ) : (
          <span
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/70"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            L <span className="mx-1.5 opacity-40">·</span> Legato
          </span>
        )}
        <span
          className="text-[10px] uppercase tracking-[0.24em] text-dusk/45"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {eyebrow ?? "Legato"}
        </span>
      </div>
      <header className="px-7 pt-10">
        <h1 className="font-serif italic text-[36px] leading-[1.05] tracking-tight text-balance text-dusk">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-[32ch] text-[15px] leading-[1.55] text-dusk/70">{subtitle}</p>
        )}
      </header>
    </>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`px-7 ${className}`}>{children}</section>;
}

/** Carte cliquable standard : eyebrow mono · titre serif · corps sans · chevron.
 *  Une seule affordance partout dans l'app. */
export function NavCard({
  to,
  params,
  eyebrow,
  title,
  body,
  action = "Ouvrir",
}: {
  to: string;
  params?: Record<string, string>;
  eyebrow: string;
  title: string;
  body?: string;
  action?: string;
}) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link
      to={to as any}
      params={params as any}
      className="surface block p-5 hover:bg-dusk/[0.02] transition-colors group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="mt-2 font-serif text-[19px] font-light text-dusk leading-snug">
            {title}
          </h3>
          {body && (
            <p className="mt-2 text-[13px] leading-[1.55] text-dusk/65">{body}</p>
          )}
        </div>
        <span className="text-dusk/40 group-hover:text-dusk transition-colors text-base shrink-0 mt-1">
          →
        </span>
      </div>
      <span className="sr-only">{action}</span>
    </Link>
  );
}

/** Filet horizontal cliquable : pour les liens secondaires (« Découvrir… », crise). */
export function NavLine({
  to,
  eyebrow,
  title,
  tone = "neutral",
}: {
  to: string;
  eyebrow: string;
  title: string;
  tone?: "neutral" | "alert";
}) {
  const eyebrowColor =
    tone === "alert" ? "text-[color:var(--terracotta)]" : "text-dusk/55";
  const lineColor =
    tone === "alert"
      ? "border-[color:var(--terracotta)]/30"
      : "border-dusk/15";
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link
      to={to as any}
      className={`block border-t ${lineColor} pt-4 flex items-baseline justify-between gap-4 group`}
    >
      <div className="min-w-0">
        <p className={`eyebrow ${eyebrowColor}`}>{eyebrow}</p>
        <p className="mt-1.5 font-sans text-[15px] text-dusk leading-snug">
          {title}
        </p>
      </div>
      <span className="text-dusk/40 group-hover:text-dusk text-sm shrink-0">→</span>
    </Link>
  );
}