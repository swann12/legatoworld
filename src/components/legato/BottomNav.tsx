import { Link, useLocation } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

type ItemDef = {
  to: string;
  label: string;
  match: (p: string) => boolean;
};

const HOME: ItemDef    = { to: "/home",      label: "Aujourd'hui", match: (p) => p === "/home" || p === "/" };
const CARE: ItemDef    = { to: "/care",      label: "Soutien",     match: (p) => p.startsWith("/care") || p.startsWith("/journal") || p.startsWith("/no-words") || p.startsWith("/community") || p.startsWith("/help") || p.startsWith("/checkin") };
const PRACT: ItemDef   = { to: "/practical", label: "Démarches",   match: (p) => p.startsWith("/practical") || p.startsWith("/parcours") || p.startsWith("/wishes") || p.startsWith("/appointments") };
const CIRCLE: ItemDef  = { to: "/_authenticated/circle", label: "Cercle", match: (p) => p.startsWith("/_authenticated/circle") || p.startsWith("/circle") };
const PROFILE: ItemDef = { to: "/profile",   label: "Profil",      match: (p) => p.startsWith("/profile") };
const EMOTIONS: ItemDef = { to: "/care/emotions", label: "Émotions", match: (p) => p.startsWith("/care/emotions") };
const JOURNAL: ItemDef = { to: "/care/journal", label: "Journal", match: (p) => p.startsWith("/care/journal") };
const GARDEN: ItemDef = { to: "/care/garden", label: "Jardin", match: (p) => p.startsWith("/care/garden") || p.startsWith("/care/memory") || p.startsWith("/care/dates") };
const PRESENCE: ItemDef = { to: "/presence", label: "Présence", match: (p) => p.startsWith("/presence") };
const TASKS: ItemDef = { to: "/practical/tasks", label: "Tâches", match: (p) => p.startsWith("/practical/tasks") || p === "/practical" };
const VAULT: ItemDef = { to: "/practical/vault", label: "Docs", match: (p) => p.startsWith("/practical/vault") };
const PROS: ItemDef = { to: "/practical/pros", label: "Pros", match: (p) => p.startsWith("/practical/pros") || p.startsWith("/practical/ceremony") || p.startsWith("/practical/wishes") };

type NavSpace = "home" | "care" | "practical";

function spaceFromPath(pathname: string): NavSpace {
  if (pathname.startsWith("/care") || pathname.startsWith("/journal") || pathname.startsWith("/no-words") || pathname.startsWith("/presence")) return "care";
  if (pathname.startsWith("/practical") || pathname.startsWith("/parcours") || pathname.startsWith("/wishes") || pathname.startsWith("/appointments")) return "practical";
  return "home";
}

function itemsFor(need: ReturnType<typeof useLegato>["primaryNeed"]): ItemDef[] {
  switch (need) {
    case "emotional": return [HOME, CARE, CIRCLE, PROFILE];
    case "practical": return [HOME, PRACT, CIRCLE, PROFILE];
    case "both":
    default:          return [HOME, CARE, PRACT, PROFILE];
  }
}

export function BottomNav() {
  const { pathname } = useLocation();
  const { primaryNeed, hydrated } = useLegato();
  // SSR-stable: use a deterministic default until client hydration.
  const space = hydrated ? spaceFromPath(pathname) : "home";
  const items = space === "care"
    ? [HOME, EMOTIONS, PRESENCE, GARDEN, PROFILE]
    : space === "practical"
      ? [HOME, TASKS, VAULT, PROS, PROFILE]
      : itemsFor(hydrated ? primaryNeed : "both");

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 border-t border-dusk/10 bg-paper/95 backdrop-blur-md"
    >
      <div className="grid grid-flow-col auto-cols-fr items-stretch px-1 pt-2.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map((it) => <NavItem key={it.to} item={it} active={it.match(pathname)} />)}
      </div>
    </nav>
  );
}

function NavItem({ item, active }: { item: ItemDef; active: boolean }) {
  return (
    <Link
      to={item.to as "/home"}
      aria-label={item.label}
      className="group relative flex flex-col items-center justify-center gap-1.5 px-1 py-2"
    >
      <span
        aria-hidden
        className="h-[4px] w-[4px] rounded-full transition-colors"
        style={{ background: active ? "var(--terracotta)" : "transparent" }}
      />
      <span className={`text-[10.5px] font-medium tracking-[0.02em] transition-colors ${active ? "text-dusk" : "text-dusk/50 group-hover:text-dusk/80"}`}>
        {item.label}
      </span>
    </Link>
  );
}