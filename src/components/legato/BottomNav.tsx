import { Link, useLocation } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

type ItemDef = {
  to: string;
  label: string;
  match: (p: string) => boolean;
};

const TODAY_CARE: ItemDef     = { to: "/care",            label: "Aujourd'hui", match: (p) => p === "/care" || p === "/care/" };
const EMOTIONS: ItemDef       = { to: "/care/emotions",   label: "Émotions",    match: (p) => p.startsWith("/care/emotions") };
const JARDIN: ItemDef         = { to: "/care/garden",     label: "Jardin",      match: (p) => p.startsWith("/care/garden") || p.startsWith("/care/memory") || p.startsWith("/care/dates") };
const PRESENCE: ItemDef       = { to: "/presence",        label: "Présence",    match: (p) => p.startsWith("/presence") };
const PROFILE: ItemDef        = { to: "/profile",         label: "Profil",      match: (p) => p.startsWith("/profile") };

const TODAY_PRACT: ItemDef    = { to: "/practical",          label: "Aujourd'hui", match: (p) => p === "/practical" || p === "/practical/" };
const TASKS: ItemDef          = { to: "/practical/tasks",    label: "Tâches",      match: (p) => p.startsWith("/practical/tasks") };
const VAULT: ItemDef          = { to: "/practical/vault",    label: "Documents",   match: (p) => p.startsWith("/practical/vault") };
const PROS: ItemDef           = { to: "/practical/pros",     label: "Pros",        match: (p) => p.startsWith("/practical/pros") || p.startsWith("/practical/ceremony") || p.startsWith("/practical/wishes") };

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
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 border-t border-dusk/10 bg-paper/95 backdrop-blur-md"
    >
      <div className="grid grid-cols-5 items-stretch px-1 pt-2.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map((it, i) => <NavItem key={it.to} item={it} active={it.match(pathname)} center={i === 2} />)}
      </div>
    </nav>
  );
}

function NavItem({ item, active, center }: { item: ItemDef; active: boolean; center?: boolean }) {
  return (
    <Link
      to={item.to as "/care"}
      aria-label={item.label}
      className="group relative flex flex-col items-center justify-center gap-1.5 px-1 py-2"
    >
      <span
        aria-hidden
        className="h-[4px] w-[4px] rounded-full transition-colors"
        style={{ background: active ? "var(--terracotta)" : "transparent" }}
      />
      <span className={`text-center leading-tight transition-colors ${center ? "text-[11px] font-semibold" : "text-[10.5px] font-medium"} tracking-[0.02em] ${active ? "text-dusk" : "text-dusk/55 group-hover:text-dusk/80"}`}>
        {item.label}
      </span>
    </Link>
  );
}
