import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function Shell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame pb-32">{children}</div>
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