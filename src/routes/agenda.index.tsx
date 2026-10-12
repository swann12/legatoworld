import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useAgenda, daysAway, KIND_LABELS, IMPORTANCE_LABELS, type AgendaEvent } from "@/lib/agenda-store";
import { useSpaces, upcomingForSpaces } from "@/lib/spaces-store";
import { useActiveSpaceId } from "@/lib/active-space";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";

export const Route = createFileRoute("/agenda/")({
  validateSearch: (search: Record<string, unknown>): { from?: "care" | "practical" } => ({
    from: search.from === "practical" ? "practical" : search.from === "care" ? "care" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Les jours qui viennent — Legato" },
      { name: "description", content: "Les dates importantes de cet espace, au même endroit." },
      { property: "og:title", content: "Les jours qui viennent — Legato" },
      { property: "og:description", content: "Démarches, rendez-vous, dates difficiles : au même endroit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Agenda,
});

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
type Item = { key: string; date: Date; title: string; sub: string; to: string };

function eventSub(e: AgendaEvent) {
  if (e.kind === "demarche") return "Démarche · à faire avant ce jour";
  if (e.kind === "rdv") return `Rendez-vous · ${e.importance === "essentiel" ? "à maintenir" : IMPORTANCE_LABELS[e.importance].toLowerCase()}`;
  return `${KIND_LABELS[e.kind]}${e.time ? ` · ${e.time.replace(":", " h ")}` : ""}`;
}

function Agenda() {
  const { from } = Route.useSearch();
  const { events } = useAgenda();
  const { spaces } = useSpaces();
  const activeId = useActiveSpaceId();
  const active = spaces.find((s) => s.id === activeId);

  const items: Item[] = [
    ...events.filter((e) => daysAway(e.date) >= 0).map((e) => ({
      key: e.id, date: new Date(`${e.date}T12:00:00`), title: e.title, sub: eventSub(e),
      to: e.kind === "rdv" ? "/appointments" : "/practical/tasks",
    })),
    ...upcomingForSpaces(active ? [active] : spaces, 365).map((d) => ({
      key: d.key, date: d.date, title: d.label, sub: "Une date difficile · la préparer", to: "/care/dates",
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const back = from === "practical" ? "/practical" : from === "care" ? "/care" : "/home";
  const backLabel = from === "practical" ? "Démarches" : from === "care" ? "Soutien" : "Aujourd'hui";

  return (
    <StandardLayout back={back} backLabel={backLabel}>
      <PageTitle className="pt-8">Les jours<br /><em>qui viennent.</em></PageTitle>
      <Lead className="mt-3">Les dates importantes de cet espace, au même endroit.</Lead>
      <ul className="mt-7">
        {items.length === 0 && <li className="py-6 lg-lead">Aucune date pour l'instant.</li>}
        {items.map((it, i) => (
          <li key={it.key}>
            <Link to={it.to} className="flex items-center gap-4 py-[18px]" style={{ borderBottom: i < items.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
              <span className="w-[44px] shrink-0">
                <span className="block" style={{ fontFamily: "var(--lg-serif)", fontSize: 26, lineHeight: 1 }}>{it.date.getDate()}</span>
                <span className="lg-mono mt-1 block">{MONTHS[it.date.getMonth()]}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="lg-row-title block">{it.title}</span>
                <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{it.sub}</span>
              </span>
              <ChevronRight className="size-4 shrink-0" strokeWidth={1.3} />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6"><PrimaryButton plus to="/agenda/new">Ajouter une date</PrimaryButton></div>
    </StandardLayout>
  );
}
