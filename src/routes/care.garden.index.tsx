import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import { useSpaces } from "@/lib/spaces-store";
import { setActiveSpaceId, useActiveSpaceId } from "@/lib/active-space";
import gardenPainted from "@/assets/garden-painted-v4.png";

export const Route = createFileRoute("/care/garden/")({
  head: () => ({
    meta: [
      { title: "Le Jardin — Legato" },
      { name: "description", content: "Le jardin de vos proches : une parcelle par être aimé, qui fleurit avec vos souvenirs." },
      { property: "og:title", content: "Le Jardin — Legato" },
      { property: "og:description", content: "Une parcelle par être aimé, qui fleurit avec vos souvenirs." },
    ],
  }),
  component: CareGarden,
});

/* Emplacements des parcelles sur la planche peinte — stables, organiques. */
const SLOTS = [
  { cx: 17, cy: 24, r: 16 },
  { cx: 82, cy: 22, r: 16 },
  { cx: 82, cy: 48, r: 15 },
  { cx: 16, cy: 74, r: 16 },
  { cx: 50, cy: 83, r: 16 },
  { cx: 49, cy: 50, r: 14 },
];

const MEM_BASE = "legato.memories.v1";

function countsBySpace(ids: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const id of ids) {
    let n = 0;
    try {
      const raw = window.localStorage.getItem(`${MEM_BASE}::${id}`) ?? window.localStorage.getItem(MEM_BASE);
      n = raw ? (JSON.parse(raw) as unknown[]).length : 0;
    } catch {
      n = 0;
    }
    out[id] = n;
  }
  return out;
}

function CareGarden() {
  const { spaces } = useSpaces();
  const activeId = useActiveSpaceId();
  const navigate = useNavigate();
  const living = spaces.filter((s) => !s.archived).slice(0, SLOTS.length);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [touched, setTouched] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setCounts(countsBySpace(living.map((s) => s.id)));
    sync();
    window.addEventListener("legato:memories", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("legato:memories", sync);
      window.removeEventListener("storage", sync);
    };
  }, [living.map((s) => s.id).join(",")]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const named = living.find((s) => s.id === touched);

  const open = (id: string) => {
    setActiveSpaceId(id);
    navigate({ to: "/care/garden/depot" });
  };

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader back="/care" title="LE JARDIN" />

        <section className="px-6">
          <h1 className="ed-page-title">
            Vos <span className="italic" style={{ color: "var(--terracotta)" }}>parcelles</span>.
          </h1>
        </section>

        {/* La planche peinte — une parcelle par être aimé */}
        <div className="relative mt-5 w-full" style={{ aspectRatio: "3 / 4" }}>
          <img
            src={gardenPainted}
            alt="Jardin peint : parcelles fleuries, sentiers et bosquets"
            className="absolute inset-0 h-full w-full select-none object-cover"
            draggable={false}
          />
          {living.map((s, i) => {
            const slot = SLOTS[i];
            const n = counts[s.id] ?? 0;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => open(s.id)}
                onMouseEnter={() => setTouched(s.id)}
                onMouseLeave={() => setTouched((t) => (t === s.id ? null : t))}
                onFocus={() => setTouched(s.id)}
                onBlur={() => setTouched((t) => (t === s.id ? null : t))}
                aria-label={`Parcelle de ${s.name} — ${n} souvenir${n > 1 ? "s" : ""}`}
                className="absolute grid place-items-end justify-items-center pb-1 transition-transform duration-500 active:scale-95"
                style={{
                  left: `${slot.cx - slot.r}%`,
                  top: `${slot.cy - slot.r}%`,
                  width: `${slot.r * 2}%`,
                  height: `${slot.r * 2}%`,
                  borderRadius: "50%",
                  opacity: touched && touched !== s.id ? 0.55 : 1,
                }}
              >
                <span
                  className="rounded-full px-3 py-1 text-[11px] backdrop-blur-[2px]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: s.id === activeId ? "var(--bordeaux)" : "color-mix(in oklab, var(--paper) 86%, transparent)",
                    color: s.id === activeId ? "var(--paper)" : "var(--bordeaux)",
                  }}
                >
                  {s.name}
                  <span className="ml-2 tabular-nums opacity-60">{String(n).padStart(2, "0")}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 px-6 text-[12px] italic text-dusk/45">
          {named ? `La parcelle de ${named.name}` : total === 0 ? "Le jardin attend son premier souvenir." : "Touchez une parcelle."}
        </p>

        <section className="px-6 pt-8">
          <Link
            to="/care/garden/depot"
            className="flex items-center justify-between border-t border-dashed pt-4"
            style={{ borderColor: "color-mix(in oklab, var(--dusk) 18%, transparent)" }}
          >
            <span className="font-serif text-[19px]">Déposer un souvenir</span>
            <span aria-hidden className="text-dusk/30">→</span>
          </Link>
          <Link
            to="/profile/proches"
            className="mt-3 flex items-center justify-between border-t border-dashed pt-4"
            style={{ borderColor: "color-mix(in oklab, var(--dusk) 18%, transparent)" }}
          >
            <span className="font-serif text-[19px]">Ajouter une parcelle</span>
            <span aria-hidden className="text-dusk/30">→</span>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
