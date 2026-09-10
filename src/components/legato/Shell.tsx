import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { SpaceSwitch } from "./SpaceSwitch";
import { ModeBackground } from "./ModeBackground";
import { useLegato } from "@/lib/legato-state";

/** Pastille profil, discrète, toujours en haut à droite pendant le scroll. */
function ProfileDot() {
  const { name } = useLegato();
  const { pathname } = useLocation();
  const on = pathname.startsWith("/profile");
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <Link
      to="/profile"
      aria-label="Mon profil"
      aria-current={on ? "page" : undefined}
      className="fixed right-4 top-[max(env(safe-area-inset-top),0.75rem)] z-50 grid h-9 w-9 place-items-center rounded-full text-[11px] backdrop-blur-sm"
      style={{
        fontFamily: "var(--font-mono)",
        background: on ? "var(--bordeaux)" : "color-mix(in oklab, var(--paper) 88%, transparent)",
        color: on ? "var(--paper)" : "var(--bordeaux)",
        border: "1px solid color-mix(in oklab, var(--bordeaux) 22%, transparent)",
        boxShadow: "0 10px 24px -18px color-mix(in oklab, var(--bordeaux) 80%, transparent)",
      }}
    >
      {initial}
    </Link>
  );
}

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
  const { pathname } = useLocation();
  const inCare = pathname.startsWith("/care") || pathname === "/presence" || pathname.startsWith("/agenda");
  const showConfide = !hideNav && inCare && !pathname.startsWith("/presence");
  return (
    <div className="min-h-dvh bg-paper text-dusk">
      <div className={`mobile-frame grain veil relative ${hideNav ? "pb-0" : "pb-32"}`}>
        {livingBg && <ModeBackground mode={mode} />}
        <div className="relative rise" style={{ zIndex: 1 }}>{children}</div>
      </div>
      {!hideNav && <ProfileDot />}
      {showConfide && <ConfideAccess />}
      {!hideNav && <SpaceSwitch />}
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
