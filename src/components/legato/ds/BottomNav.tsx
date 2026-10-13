import { Link, useLocation } from "@tanstack/react-router";
import { Sun, Heart, ListChecks, Sprout, Users } from "lucide-react";

const TABS = [
  { to: "/home", label: "Aujourd'hui", Icon: Sun, match: (p: string) => p.startsWith("/home") },
  { to: "/care", label: "Soutien", Icon: Heart, match: (p: string) => p.startsWith("/help") || p.startsWith("/presence") || p.startsWith("/library") || p.startsWith("/appointments") || p === "/no-words" || (p.startsWith("/care") && !p.startsWith("/care/garden") && !p.startsWith("/care/community") && !p.startsWith("/care/rituels") && !p.startsWith("/care/dates")) },
  { to: "/practical", label: "Démarches", Icon: ListChecks, match: (p: string) => p.startsWith("/practical") || p.startsWith("/agenda") },
  { to: "/care/garden", label: "Mémoire", Icon: Sprout, match: (p: string) => p.startsWith("/care/garden") || p.startsWith("/care/rituels") || p.startsWith("/care/dates") || p.startsWith("/compose") || p === "/profile/portrait" },
  { to: "/care/community", label: "Communauté", Icon: Users, match: (p: string) => p.startsWith("/care/community") },
] as const;

/** Barre flottante à 5 onglets (§6). `night` pour le mode nuit. */
export function BottomNav({ night = false, active, fixed = true }: { night?: boolean; active?: string; fixed?: boolean }) {
  const { pathname } = useLocation();
  const current = active ?? pathname;
  return (
    <nav aria-label="Navigation principale"
      className={`${fixed ? "fixed inset-x-4 bottom-5 z-40 mx-auto max-w-[398px]" : "relative w-full"} flex h-[60px] items-center justify-between rounded-[30px] px-1.5`}
      style={{ background: night ? "var(--lg-night-2)" : "var(--lg-deep)", border: night ? "1px solid var(--lg-night-line)" : "none" }}>
      {TABS.map(({ to, label, Icon, match }) => {
        const on = active ? active === to : match(current);
        return (
          <Link key={to} to={to} aria-label={label} aria-current={on ? "page" : undefined}
            className="flex h-12 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-[14px] transition-all"
            style={{
              fontFamily: "var(--lg-sans)",
              background: on ? (night ? "var(--lg-mint)" : "var(--lg-cream)") : "transparent",
              color: on ? "var(--lg-deep)" : night ? "var(--lg-mint)" : "var(--lg-cream)",
              opacity: on ? 1 : 0.75,
              flex: on ? "0 0 auto" : "1 1 0",
            }}>
            <Icon className="size-[18px]" strokeWidth={1.3} />
            {on && <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
