import { createFileRoute } from "@tanstack/react-router";
import { Lead } from "@/components/legato/ds";
import { AnimalSheet, Spec } from "@/components/legato/AnimalPractical";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/animal-body/cimetiere")({
  head: () => legatoHead("Un cimetière pour animaux", "Une tombe où vous pourrez revenir, louée pour quelques années renouvelables."),
  component: Cimetiere,
});

/** B036 · Cimetière animalier */
function Cimetiere() {
  return (
    <AnimalSheet back="/practical/animal-body" backLabel="Crémation ou enterrement" title={<>Un cimetière<br /><em>pour animaux.</em></>}>
      <Lead className="mt-[10px] max-w-[310px]">Une tombe où vous pourrez revenir. On loue l'emplacement pour quelques années, renouvelables.</Lead>
      <Spec className="mt-7" items={[
        { label: "Où", value: "Il en existe dans la plupart des régions" },
        { label: "Durée", value: "Quelques années, renouvelables" },
        { label: "Avant", value: "Demander les prix et l'entretien" },
      ]} />
      <div className="pt-7">
        <a href="https://www.google.com/maps/search/cimeti%C3%A8re+animalier" target="_blank" rel="noreferrer"
          className="inline-flex h-12 items-center rounded-full px-6 text-[15px]" style={{ background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" }}>Trouver un cimetière proche</a>
      </div>
    </AnimalSheet>
  );
}
