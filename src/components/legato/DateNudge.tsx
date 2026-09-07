import { Link } from "@tanstack/react-router";
import { useSpaces, upcomingForSpaces, formatDaysAway } from "@/lib/spaces-store";
import { ritualsForDate } from "@/lib/date-rituals";

/**
 * Proposition discrète de rituel quand une date importante approche.
 * Silencieux si aucune date n'est proche.
 */
export function DateNudge({ withinDays = 10 }: { withinDays?: number }) {
  const { spaces, hydrated } = useSpaces();
  if (!hydrated) return null;
  const next = upcomingForSpaces(spaces, withinDays)[0];
  if (!next) return null;
  const ritual = ritualsForDate(next)[0];

  return (
    <section className="px-5 pt-7">
      <div className="rounded-[18px] border border-dusk/12 px-5 py-4" style={{ background: "var(--whisper)" }}>
        <p className="mono-label text-dusk/55">
          {formatDaysAway(next.daysAway)} · {next.spaceName}
        </p>
        <p className="mt-2 font-serif text-[17px] leading-[1.25]">{next.label}</p>
        <p className="mt-1.5 text-[12.5px] text-dusk/60 max-w-[32ch]">{ritual.body}</p>
        <div className="mt-3 flex items-center gap-4">
          <Link to={ritual.to} className="mono-label" style={{ color: "var(--terracotta)" }}>
            {ritual.cta} →
          </Link>
          <Link to="/care/dates" className="mono-label text-dusk/45">
            Toutes les dates
          </Link>
        </div>
      </div>
    </section>
  );
}
