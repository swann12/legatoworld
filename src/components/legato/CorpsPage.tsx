import type { ReactNode } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";

/* Grammaire commune aux pages du Corps : papier, air, filets, index numérotés.
   Une seule colonne, une seule intention par section. */

export function CorpsPage({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Shell hideNav>
      <div className="min-h-dvh bg-paper text-dusk pb-24">
        <PageHeader back="/help/corps" title={kicker} />
        <header className="px-6 pt-2">
          <h1 className="ed-page-title text-[29px] leading-[1.1]">{title}</h1>
          {intro && <p className="mt-4 max-w-[34ch] text-[13.5px] leading-[1.65] text-dusk/65">{intro}</p>}
        </header>
        {children}
      </div>
    </Shell>
  );
}

export function CorpsSection({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="px-5 pt-10">
      <SectionHead label={label} meta={meta} />
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Liste d'étapes : une seule colonne, index numérotés, séparateurs pointillés.
 *  Chaque étape se coche ; rien ne se verrouille, on peut revenir en arrière. */
export function StepList({
  steps,
  done,
  onToggle,
}: {
  steps: { title: string; body?: string }[];
  done: number[];
  onToggle: (i: number) => void;
}) {
  return (
    <ul className="craft px-5">
      {steps.map((s, i) => {
        const on = done.includes(i);
        return (
          <li
            key={s.title}
            className="border-b border-dashed last:border-0"
            style={{ borderColor: "color-mix(in oklab, var(--dusk) 16%, transparent)" }}
          >
            <button
              type="button"
              onClick={() => onToggle(i)}
              aria-pressed={on}
              className="flex w-full items-start gap-4 py-4 text-left"
            >
              <span
                aria-hidden
                className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full"
                style={{
                  border: on ? "none" : "1px solid color-mix(in oklab, var(--dusk) 26%, transparent)",
                  background: on ? "var(--terracotta)" : "transparent",
                }}
              >
                {on && <span className="text-[10px] leading-none" style={{ color: "var(--paper)" }}>✓</span>}
              </span>
              <span className="flex-1">
                <span
                  className="block font-serif text-[17px] leading-[1.25]"
                  style={{ opacity: on ? 0.5 : 1 }}
                >
                  {s.title}
                </span>
                {s.body && <span className="mt-1.5 block text-[13px] leading-[1.55] text-dusk/60">{s.body}</span>}
              </span>
              <span className="shrink-0 pt-[3px] text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/30">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Note de bas de page : quand cela dure, où trouver de l'aide. */
export function CorpsFooterNote({ children }: { children: ReactNode }) {
  return (
    <section className="px-6 pt-12">
      <div className="h-px" style={{ background: "color-mix(in oklab, var(--dusk) 12%, transparent)" }} />
      <div className="pt-5 text-[12.5px] leading-[1.65] text-dusk/60">{children}</div>
    </section>
  );
}
