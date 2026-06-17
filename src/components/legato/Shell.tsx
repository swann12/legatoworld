import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { ModeBackground } from "./ModeBackground";
import { useLegato } from "@/lib/legato-state";

export function Shell({
  children,
  hideNav = false,
  livingBg = true,
}: {
  children: ReactNode;
  hideNav?: boolean;
  /** Render the mode-aware living background. Pages that paint their own
   *  full-screen ambiance (no-words sequences, onboarding) should pass false. */
  livingBg?: boolean;
}) {
  const { mode } = useLegato();
  return (
    <div className="min-h-dvh bg-paper text-dusk">
      <div className={`mobile-frame relative ${hideNav ? "pb-0" : "pb-32"}`}>
        {livingBg && <ModeBackground mode={mode} />}
        <div className="relative" style={{ zIndex: 1 }}>{children}</div>
      </div>
      {!hideNav && <BottomNav />}
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
    <header className="px-6 pt-10 pb-7">
      {eyebrow && <p className="mono-label mb-4">{eyebrow}</p>}
      <h1 className="ed-page-title text-balance">{title}</h1>
      {subtitle && <p className="mt-5 body-meta max-w-[34ch]">{subtitle}</p>}
    </header>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`px-7 ${className}`}>{children}</section>;
}