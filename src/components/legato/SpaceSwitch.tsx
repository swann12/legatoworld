import { Link, useLocation } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

/** Navigation basse : un galet actif qui glisse dans une barre rose, + accès profil. */
export function SpaceSwitch() {
  const { pathname } = useLocation();
  const { name } = useLegato();
  const practical = pathname.startsWith("/practical");
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";

  const item = (on: boolean, to: "/care" | "/practical", label: string) => (
    <Link
      to={to}
      aria-current={on ? "page" : undefined}
      className="relative z-10 flex-1 rounded-full py-1.5 text-center text-[9.5px] uppercase tracking-[0.12em] transition-colors duration-300"
      style={{
        fontFamily: "var(--font-mono)",
        color: on ? "var(--paper)" : "color-mix(in oklab, var(--bordeaux) 70%, transparent)",
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav
      aria-label="Navigation principale"
      className="pointer-events-none fixed bottom-0 left-1/2 z-50 flex w-full max-w-[420px] -translate-x-1/2 items-center gap-2.5 px-8 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <div
        className="pointer-events-auto relative flex flex-1 items-stretch rounded-full p-[3px]"
        style={{
          background: "var(--blush)",
          boxShadow: "0 14px 30px -18px color-mix(in oklab, var(--bordeaux) 70%, transparent)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-y-[3px] w-[calc(50%-3px)] rounded-full transition-[left] duration-500"
          style={{
            background: "var(--bordeaux)",
            left: practical ? "50%" : "3px",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {item(!practical, "/care", "Soutien")}
        {item(practical, "/practical", "Démarches")}
      </div>

      <Link
        to="/profile"
        aria-label="Mon profil"
        aria-current={pathname.startsWith("/profile") ? "page" : undefined}
        className="pointer-events-auto flex shrink-0 items-center justify-center rounded-full text-[11px]"
        style={{
          width: 32,
          height: 32,
          fontFamily: "var(--font-mono)",
          background: pathname.startsWith("/profile") ? "var(--bordeaux)" : "var(--blush)",
          color: pathname.startsWith("/profile") ? "var(--paper)" : "var(--bordeaux)",
          boxShadow: "0 14px 30px -18px color-mix(in oklab, var(--bordeaux) 70%, transparent)",
        }}
      >
        {initial}
      </Link>
    </nav>
  );
}
