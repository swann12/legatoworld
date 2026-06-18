import { Link, useLocation } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

type ItemDef = {
  to: "/home" | "/care" | "/practical" | "/care/memory" | "/_authenticated/circle" | "/practical/vault" | "/profile";
  label: string;
  match: (p: string) => boolean;
};

const HOME: ItemDef    = { to: "/home",      label: "Aujourd'hui", match: (p) => p === "/home" || p === "/" };
const CARE: ItemDef    = { to: "/care",      label: "Soutien",     match: (p) => p.startsWith("/care") || p.startsWith("/journal") || p.startsWith("/presence") || p.startsWith("/no-words") || p.startsWith("/community") || p.startsWith("/help") || p.startsWith("/checkin") };
const PRACT: ItemDef   = { to: "/practical", label: "Démarches",   match: (p) => p.startsWith("/practical") || p.startsWith("/parcours") || p.startsWith("/wishes") || p.startsWith("/appointments") };
const CIRCLE: ItemDef  = { to: "/_authenticated/circle", label: "Cercle", match: (p) => p.startsWith("/_authenticated/circle") || p.startsWith("/circle") };
const PROFILE: ItemDef = { to: "/profile",   label: "Profil",      match: (p) => p.startsWith("/profile") };

function itemsFor(need: ReturnType<typeof useLegato>["primaryNeed"]): ItemDef[] {
  switch (need) {
    case "emotional": return [HOME, CARE, CIRCLE, PROFILE];
    case "practical": return [HOME, PRACT, CIRCLE, PROFILE];
    case "both":
    default:          return [HOME, CARE, PRACT, CIRCLE];
  }
}

export function BottomNav() {
  const { pathname } = useLocation();
  const { primaryNeed, softDay, toggleSoftDay, hydrated } = useLegato();
  // SSR-stable: use a deterministic default until client hydration.
  const items = itemsFor(hydrated ? primaryNeed : "both");
  const soft = hydrated && softDay;

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 border-t border-dusk/10 bg-paper/95 backdrop-blur-md"
    >
      <div className="flex items-stretch justify-between px-2 pt-3 pb-[max(env(safe-area-inset-bottom),0.55rem)]">
        {items.slice(0, 2).map((it) => <NavItem key={it.to} item={it} active={it.match(pathname)} />)}

        <button
          onClick={toggleSoftDay}
          aria-label={soft ? "Mode doux activé" : "Aujourd'hui c'est dur"}
          className="group relative flex flex-col items-center justify-end gap-1 px-2 -mt-5"
        >
          <span
            className="h-12 w-12 rounded-full grid place-items-center text-paper text-[14px] shadow-sm transition-transform active:scale-95"
            style={{ background: soft ? "var(--terracotta)" : "var(--dusk)" }}
          >
            ♡
          </span>
          <span className="mt-1 text-[9.5px] font-medium tracking-[0.04em] text-dusk/60">
            {soft ? "Mode doux" : "Aujourd'hui"}
          </span>
        </button>

        {items.slice(2).map((it) => <NavItem key={it.to} item={it} active={it.match(pathname)} />)}
      </div>
    </nav>
  );
}

function NavItem({ item, active }: { item: ItemDef; active: boolean }) {
  return (
    <Link
      to={item.to}
      aria-label={item.label}
      className="group relative flex flex-1 flex-col items-center justify-center gap-1.5 px-1 py-1.5"
    >
      <span
        aria-hidden
        className="h-[5px] w-[5px] rounded-full transition-colors"
        style={{ background: active ? "var(--terracotta)" : "transparent" }}
      />
      <span className={`text-[10px] font-medium tracking-[0.04em] transition-colors ${active ? "text-dusk" : "text-dusk/45 group-hover:text-dusk/75"}`}>
        {item.label}
      </span>
    </Link>
  );
}