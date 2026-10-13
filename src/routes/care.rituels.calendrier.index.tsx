import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageTitle, Lead, TextLink } from "@/components/legato/ds";
import { RitualsLayout, DateBadge } from "@/components/legato/RitualsUI";
import { WORLD_DATES } from "@/lib/rituals-catalog";
import { useSpaces, upcomingForSpaces } from "@/lib/spaces-store";
import { useActiveSpaceId } from "@/lib/active-space";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/calendrier/")({
  head: () => legatoHead("Le calendrier des jours des morts", "Les dates du monde et les vôtres au même endroit."),
  component: Calendrier,
});

const LETTERS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const short = (m: number) => new Date(2026, m - 1, 1).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();

/** B111 · Le calendrier : le mois choisi et le suivant, dates du monde et dates de l'espace */
function Calendrier() {
  const { spaces } = useSpaces();
  const activeId = useActiveSpaceId();
  const [month, setMonth] = useState(10);
  useEffect(() => setMonth(new Date().getMonth() + 1), []);
  const active = spaces.find((s) => s.id === activeId) ?? spaces.find((s) => !s.archived);
  const mine = upcomingForSpaces(active ? [active] : [], 366).map((u) => { const d = new Date(Date.now() + u.daysAway * 86_400_000); return { m: d.getMonth() + 1, day: d.getDate(), label: u.label }; });
  const shown = [month, (month % 12) + 1];
  const busy = new Set([...WORLD_DATES.map((d) => d.month), ...mine.map((d) => d.m)]);
  type Item = { m: number; day?: number; title: string; hint: string; mine?: boolean; to?: { region: string; id: string } };
  const items: Item[] = [
    ...mine.filter((d) => shown.includes(d.m)).map((d) => ({ m: d.m, day: d.day, title: d.label, hint: "Préparer un geste, seul ou à plusieurs", mine: true })),
    ...WORLD_DATES.filter((d) => shown.includes(d.month)).map((d) => ({ m: d.month, day: d.day, title: d.title.split(" · ")[0] === "Toussaint" ? "La Toussaint" : d.title, hint: d.hint ?? d.place, to: d.tradition && d.region ? { region: d.region, id: d.tradition } : undefined })),
  ].sort((a, b) => (shown.indexOf(a.m) - shown.indexOf(b.m)) || ((a.day ?? 0) - (b.day ?? 0)));

  return (
    <RitualsLayout>
      <PageTitle className="pt-8">Le calendrier<br /><em>des jours des morts.</em></PageTitle>
      <Lead className="mt-3">Les dates du monde, et les vôtres, au même endroit. Touchez un mois.</Lead>
      <div className="mt-6 flex justify-between" role="tablist" aria-label="Mois">
        {LETTERS.map((l, i) => {
          const on = shown.includes(i + 1);
          return <button key={i} type="button" role="tab" aria-selected={on} aria-label={MONTHS[i]} onClick={() => setMonth(i + 1)}
            className="grid size-7 place-items-center rounded-full text-[12px]"
            style={{ background: on ? "var(--sp-accent)" : "transparent", color: on ? "var(--sp-bg)" : busy.has(i + 1) ? "var(--sp-ink)" : "var(--sp-sub)", opacity: busy.has(i + 1) || on ? 1 : 0.5 }}>{l}</button>;
        })}
      </div>
      <p className="lg-mono mt-7">{MONTHS[shown[0] - 1]} et {MONTHS[shown[1] - 1]}</p>
      <div className="mt-2">
        {!items.length && <p className="mt-3 text-[14px]" style={{ color: "var(--sp-sub)" }}>Aucune date ces deux mois-là.</p>}
        {items.map((it, i) => {
          const body = <><DateBadge day={it.day ? String(it.day) : "·"} month={short(it.m)} /><span className="min-w-0 flex-1"><span className="lg-row-title block">{it.title}</span><span className="lg-row-sub mt-1 block">{it.hint}</span></span>{it.mine && <span className="lg-mono shrink-0" style={{ color: "var(--sp-accent)" }}>Votre date</span>}</>;
          const style = { borderBottom: i < items.length - 1 ? "1px solid var(--sp-line)" : "none" };
          return it.mine ? <Link key={i} to="/care/rituels/organiser" className="flex items-center gap-5 py-4" style={style}>{body}</Link>
            : it.to ? <Link key={i} to="/care/rituels/monde/$region/$id" params={it.to} className="flex items-center gap-5 py-4" style={style}>{body}</Link>
            : <div key={i} className="flex items-center gap-5 py-4" style={style}>{body}</div>;
        })}
      </div>
      <div className="mt-8"><TextLink to="/care/rituels/calendrier/annee">Voir toute l'année</TextLink></div>
    </RitualsLayout>
  );
}
