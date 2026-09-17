import { Link, useLocation } from "@tanstack/react-router";

/** Navigation basse : une capsule rose, généreuse, avec un galet actif qui glisse. */
export function SpaceSwitch({ activeSpace }: { activeSpace?: "care" | "practical" }) {
  const { pathname } = useLocation();
  const practical = activeSpace ? activeSpace === "practical" : pathname.startsWith("/practical");

  const item = (on: boolean, to: "/care" | "/practical", label: string) => (
    <Link
      to={to}
      aria-current={on ? "page" : undefined}
      className="relative z-10 flex-1 rounded-full py-2.5 text-center text-[10px] uppercase tracking-[0.14em] transition-colors duration-300"
      style={{
        fontFamily: "var(--font-mono)",
        color: on ? "var(--paper)" : "color-mix(in oklab, var(--bordeaux) 72%, transparent)",
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav
      aria-label="Navigation principale"
      className="pointer-events-none fixed bottom-0 left-1/2 z-50 flex w-full max-w-[420px] -translate-x-1/2 justify-center px-6 pb-[max(env(safe-area-inset-bottom),0.9rem)]"
    >
      <div
        className="pointer-events-auto relative flex w-[218px] items-stretch rounded-full p-[4px]"
        style={{
          background: "var(--blush)",
          border: "1px dashed color-mix(in oklab, var(--bordeaux) 18%, transparent)",
          boxShadow: "0 16px 34px -22px color-mix(in oklab, var(--bordeaux) 70%, transparent)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-y-[4px] w-[calc(50%-4px)] rounded-full transition-[left] duration-500"
          style={{
            background: "var(--bordeaux)",
            left: practical ? "50%" : "4px",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {item(!practical, "/care", "Soutien")}
        {item(practical, "/practical", "Démarches")}
      </div>
    </nav>
  );
}
