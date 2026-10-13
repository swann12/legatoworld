import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCarnet } from "@/lib/carnet";
import { taskState } from "@/lib/carnet-model";
import { StandardLayout, PageTitle, Lead, PrimaryButton, OutlineButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/home/equipe/")({
  head: () => legatoHead("Qui fait quoi", "Répartir les coups de main de la semaine avec les proches, pour ne pas tout porter seul."),
  component: Equipe,
});

/** B052 · Qui fait quoi, cette semaine */
function Equipe() {
  const { tasks, ready, acceptTask, shared } = useCarnet();
  const accept = async (id: string) => { try { await acceptTask(id); toast.success("Vous vous en chargez."); } catch { toast.error("Impossible pour l'instant. Réessayez."); } };
  return (
    <StandardLayout back="/home" backLabel="Aujourd'hui" activeTab="/home">
      <PageTitle className="pt-8">Qui fait quoi,<br /><em>cette semaine.</em></PageTitle>
      <Lead className="mt-3">Pour ne pas tout porter seul. Chacun voit ce qu'il a accepté de faire.</Lead>
      <div className="mt-6">
        {ready && !tasks.length && <p className="text-[14px]" style={{ color: "var(--sp-sub)" }}>Rien n'est encore réparti.</p>}
        {tasks.map((t) => {
          const st = taskState(t);
          return (
            <div key={t.id} className="flex items-center gap-4 py-4" style={{ borderBottom: "1px solid var(--sp-line)" }}>
              <span className="min-w-0 flex-1"><span className="lg-row-title block">{[t.when, t.what].filter(Boolean).join(" · ")}</span>
                <span className="lg-row-sub block mt-1">{st === "accepte" ? t.assignee : st === "attente" ? t.askedTo.join(", ") : "Personne pour l'instant"}</span></span>
              {st === "accepte" && <span className="lg-mono" style={{ color: "var(--sp-accent)" }}>Accepté</span>}
              {st === "attente" && (shared && !t.mine ? <OutlineButton onClick={() => void accept(t.id)}>Je m'en charge</OutlineButton> : <span className="lg-mono">En attente</span>)}
              {st === "personne" && <Link to="/home/equipe/demande" search={{ tache: t.id }} className="text-[13.5px] underline underline-offset-4" style={{ color: "var(--sp-stroke)" }}>Demander</Link>}
            </div>
          );
        })}
      </div>
      <div className="mt-8"><PrimaryButton to="/home/equipe/demande" plus>Ajouter une tâche</PrimaryButton></div>
    </StandardLayout>
  );
}
