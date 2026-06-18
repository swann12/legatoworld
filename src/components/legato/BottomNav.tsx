import { Link, useLocation } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";
import type { ReactNode } from "react";

// Petits glyphes — traits fins, hauteur uniforme, pour aligner la barre.
function Icon({ name }: { name: string }): ReactNode {
  const stroke = "currentColor";
  const sw = 1.6;
  switch (name) {
    case "today":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l2.5 2" />
        </svg>
      );
    case "heart":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        </svg>
      );
    case "sprout":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 20v-7" />
          <path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5z" />
          <path d="M12 13c3 0 5-2 5-5-3 0-5 2-5 5z" />
        </svg>
      );
    case "spark":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
        </svg>
      );
    case "user":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5 20c1.5-3.2 4-4.8 7-4.8s5.5 1.6 7 4.8" />
        </svg>
      );
    case "check":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 11l3 3 5-5" />
        </svg>
      );
    case "doc":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v4h4" />
          <path d="M10 13h6M10 17h6" />
        </svg>
      );
    case "pros":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="8" cy="10" r="3" />
          <circle cx="16" cy="10" r="3" />
          <path d="M3 20c1-2.5 3-4 5-4s4 1.5 5 4" />
          <path d="M13 20c1-2.5 3-4 5-4 1.4 0 2.8.7 3.7 1.8" />
        </svg>
      );
    default:
      return null;
  }
}

type ItemDef = {
  to: string;
  label: string;
  icon: string;
  match: (p: string) => boolean;
};

const TODAY_CARE: ItemDef     = { to: "/care",            label: "Aujourd'hui", icon: "today",  match: (p) => p === "/care" || p === "/care/" };
const EMOTIONS: ItemDef       = { to: "/care/emotions",   label: "Émotions",    icon: "heart",  match: (p) => p.startsWith("/care/emotions") };
const JARDIN: ItemDef         = { to: "/care/garden",     label: "Jardin",      icon: "sprout", match: (p) => p.startsWith("/care/garden") || p.startsWith("/care/memory") || p.startsWith("/care/dates") };
const PRESENCE: ItemDef       = { to: "/presence",        label: "Présence",    icon: "spark",  match: (p) => p.startsWith("/presence") };
const PROFILE: ItemDef        = { to: "/profile",         label: "Profil",      icon: "user",   match: (p) => p.startsWith("/profile") };

const TODAY_PRACT: ItemDef    = { to: "/practical",          label: "Aujourd'hui", icon: "today", match: (p) => p === "/practical" || p === "/practical/" };
const TASKS: ItemDef          = { to: "/practical/tasks",    label: "Tâches",      icon: "check", match: (p) => p.startsWith("/practical/tasks") };
const VAULT: ItemDef          = { to: "/practical/vault",    label: "Documents",   icon: "doc",   match: (p) => p.startsWith("/practical/vault") };
const PROS: ItemDef           = { to: "/practical/pros",     label: "Pros",        icon: "pros",  match: (p) => p.startsWith("/practical/pros") || p.startsWith("/practical/ceremony") || p.startsWith("/practical/wishes") };

type NavSpace = "care" | "practical";

function spaceFromPath(pathname: string, fallback: NavSpace): NavSpace {
  if (pathname.startsWith("/practical") || pathname.startsWith("/parcours") || pathname.startsWith("/wishes") || pathname.startsWith("/appointments")) return "practical";
  if (pathname.startsWith("/care") || pathname.startsWith("/journal") || pathname.startsWith("/no-words") || pathname.startsWith("/presence") || pathname.startsWith("/checkin")) return "care";
  return fallback;
}

export function BottomNav() {
  const { pathname } = useLocation();
  const { primaryNeed, hydrated } = useLegato();
  const fallback: NavSpace = primaryNeed === "practical" ? "practical" : "care";
  const space: NavSpace = hydrated ? spaceFromPath(pathname, fallback) : "care";

  // 5 items, "Aujourd'hui" toujours au centre (index 2) → barre équilibrée.
  const items: ItemDef[] = space === "care"
    ? [EMOTIONS, JARDIN, TODAY_CARE, PRESENCE, PROFILE]
    : [TASKS,    VAULT,  TODAY_PRACT, PROS,    PROFILE];

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 bg-paper/95 backdrop-blur-md"
      style={{ boxShadow: "0 -1px 0 color-mix(in oklab, var(--dusk) 8%, transparent)" }}
    >
      <div className="grid grid-cols-5 items-stretch px-1.5 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map((it, i) => (
          <NavItem key={it.to} item={it} active={it.match(pathname)} center={i === 2} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ item, active, center }: { item: ItemDef; active: boolean; center: boolean }) {
  return (
    <Link
      to={item.to as "/care"}
      aria-label={item.label}
      className="group relative flex flex-col items-center justify-start gap-[5px] py-1.5"
      style={{ color: active ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 55%, transparent)" }}
    >
      <span
        className="flex items-center justify-center rounded-full transition-colors"
        style={{
          width: center ? 38 : 30,
          height: center ? 38 : 30,
          background: center && active ? "color-mix(in oklab, var(--terracotta) 14%, transparent)"
                    : center ? "color-mix(in oklab, var(--dusk) 5%, transparent)"
                    : "transparent",
        }}
      >
        <Icon name={item.icon} />
      </span>
      <span
        className="text-center leading-tight text-[10px] tracking-[0.04em]"
        style={{
          color: active ? "var(--dusk)" : "color-mix(in oklab, var(--dusk) 55%, transparent)",
          fontWeight: active || center ? 600 : 500,
        }}
      >
        {item.label}
      </span>
      {active && !center && (
        <span
          aria-hidden
          className="absolute -top-[1px] h-[2px] w-7 rounded-full"
          style={{ background: "var(--terracotta)" }}
        />
      )}
    </Link>
  );
}
