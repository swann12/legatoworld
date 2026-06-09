import type { ReactNode } from "react";
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
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <header className="px-7 pt-14">
      {eyebrow && (
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-dusk/40">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-[2.4rem] leading-[1.05] font-light text-balance text-dusk">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-dusk/60">{subtitle}</p>
      )}
    </header>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`px-7 ${className}`}>{children}</section>;
}