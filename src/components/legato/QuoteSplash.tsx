import type { CSSProperties, ReactNode } from "react";

type Tone = "blush" | "sun" | "sardine" | "butter" | "bordeaux" | "sky" | "terracotta";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  blush:      { bg: "var(--blush)",      fg: "var(--dusk)" },
  sun:        { bg: "var(--sun)",        fg: "var(--dusk)" },
  sardine:    { bg: "var(--peach, var(--sun))", fg: "var(--dusk)" },
  butter:     { bg: "var(--butter, var(--sun))", fg: "var(--dusk)" },
  sky:        { bg: "var(--sky)",        fg: "var(--dusk)" },
  terracotta: { bg: "var(--terracotta)", fg: "var(--paper)" },
  bordeaux:   { bg: "var(--bordeaux)",   fg: "var(--paper)" },
};

/**
 * Plage de couleur pleine page : un souvenir, une citation, une respiration visuelle.
 * Pas de chrome, juste du texte qui prend toute la place.
 */
export function QuoteSplash({
  quote,
  attribution,
  tone = "blush",
  children,
  style,
}: {
  quote: string;
  attribution?: string;
  tone?: Tone;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const t = TONES[tone];
  return (
    <section
      className="relative w-full min-h-[420px] flex flex-col justify-end px-7 pt-12 pb-10 rounded-[24px] overflow-hidden"
      style={{ background: t.bg, color: t.fg, ...style }}
    >
      <p className="mono-label opacity-70">Un souvenir</p>
      <p className="mt-4 font-serif italic text-[28px] leading-[1.15] max-w-[24ch]">
        « {quote} »
      </p>
      {attribution && (
        <p className="mt-5 text-[12.5px] opacity-75">— {attribution}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}