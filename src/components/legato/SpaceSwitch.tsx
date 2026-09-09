import { Link, useLocation } from "@tanstack/react-router";

/**
 * Switch bas : Soutien · Démarches.
 * Barre sombre (sumi) — un galet clair glisse sous le mot actif.
 */
export function SpaceSwitch() {
  const { pathname } = useLocation();
  const practical = pathname.startsWith("/practical");

  const item = (on: boolean, to: "/care" | "/practical", label: string) => (
    <Link
      to={to}
      aria-current={on ? "page" : undefined}
      className="relative z-10 flex-1 rounded-full py-2.5 text-center text-[13px] tracking-[0.04em] transition-colors duration-300"
      style={{
        color: on ? "var(--sumi)" : "color-mix(in oklab, var(--paper) 72%, transparent)",
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
          background: "#2C2320",
          boxShadow: "0 12px 30px -18px rgba(44, 35, 32, 0.75)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 rounded-full transition-transform duration-500"
          style={{
            width: "calc(50% - 0.25rem)",
            background: "var(--paper)",
            transform: practical ? "translateX(100%)" : "translateX(0)",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {item(!practical, "/care", "Soutien")}
        {item(practical, "/practical", "Démarches")}
      </div>
    </nav>
  );
}

