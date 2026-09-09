import { Link, useLocation } from "@tanstack/react-router";

/** Navigation basse : un galet actif qui glisse dans une barre rose. */
export function SpaceSwitch() {
  const { pathname } = useLocation();
  const practical = pathname.startsWith("/practical");

  const item = (on: boolean, to: "/care" | "/practical", label: string) => (
    <Link
      to={to}
      aria-current={on ? "page" : undefined}
      className="relative z-10 flex-1 rounded-full py-3 text-center text-[11.5px] uppercase tracking-[0.16em] transition-colors duration-300"
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
      className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 px-6 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <div
        className="pointer-events-auto relative flex items-stretch rounded-full p-1"
        style={{
          background: "var(--blush)",
          boxShadow: "0 14px 30px -18px color-mix(in oklab, var(--bordeaux) 70%, transparent)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full transition-[left] duration-500"
          style={{
            background: "var(--bordeaux)",
            left: practical ? "calc(50% + 0rem)" : "0.25rem",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {item(!practical, "/care", "Soutien")}
        {item(practical, "/practical", "Démarches")}
      </div>
    </nav>
  );
}

