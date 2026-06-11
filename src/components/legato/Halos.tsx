import { modeTint, type Mode } from "@/lib/legato-state";

/** Soft luminous halos that tint subtly with the active interface mode. */
export function Halos({ mode, variant = "default" }: { mode: Mode; variant?: "default" | "calm" | "rich" }) {
  const tint = modeTint(mode);

  if (variant === "calm") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="halo-lg drift absolute -top-20 -right-24 size-80 rounded-full opacity-50"
          style={{ background: `radial-gradient(circle, ${tint} 0%, transparent 70%)` }}
        />
        <div
          className="halo-lg absolute bottom-1/3 -left-24 size-72 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, var(--peach) 0%, transparent 70%)` }}
        />
      </div>
    );
  }

  if (variant === "rich") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="halo-lg drift absolute -top-32 -left-20 size-[28rem] rounded-full opacity-60"
          style={{ background: `radial-gradient(circle, ${tint} 0%, transparent 70%)` }}
        />
        <div
          className="halo-lg absolute -bottom-20 -right-20 size-[24rem] rounded-full opacity-50"
          style={{ background: `radial-gradient(circle, var(--lavender) 0%, transparent 70%)` }}
        />
        <div
          className="halo absolute top-1/3 left-1/4 size-48 rounded-full opacity-40"
          style={{ background: `radial-gradient(circle, var(--peach) 0%, transparent 70%)` }}
        />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="halo-lg drift absolute -top-24 -right-20 size-80 rounded-full opacity-60"
        style={{ background: `radial-gradient(circle, ${tint} 0%, transparent 70%)` }}
      />
      <div
        className="halo-lg absolute bottom-32 -left-24 size-80 rounded-full opacity-45"
        style={{ background: `radial-gradient(circle, var(--mist) 0%, transparent 70%)` }}
      />
    </div>
  );
}