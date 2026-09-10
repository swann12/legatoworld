import { Link, useLocation } from "@tanstack/react-router";

/** Navigation basse : une capsule rose, généreuse, avec un galet actif qui glisse. */
export function SpaceSwitch() {
  const { pathname } = useLocation();
  const practical = pathname.startsWith("/practical");

  const item = (on: boolean, to: "/care" | "/practical", label: string) => (
    <Link
      to={to}
      aria-current={on ? "page" : undefined}
      className="relative z-10 flex-1 rounded-full py-3 text-center text-[11px] uppercase tracking-[0.16em] transition-colors duration-300"
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
        className="pointer-events-auto relative flex w-[264px] items-stretch rounded-full p-[5px]"
        style={{
          background: "var(--blush)",
          boxShadow: "0 18px 38px -20px color-mix(in oklab, var(--bordeaux) 75%, transparent)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-y-[5px] w-[calc(50%-5px)] rounded-full transition-[left] duration-500"
          style={{
            background: "var(--bordeaux)",
            left: practical ? "50%" : "5px",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {item(!practical, "/care", "Soutien")}
        {item(practical, "/practical", "Démarches")}
      </div>
    </nav>
  );
}
