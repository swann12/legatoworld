import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { Bell, Check } from "lucide-react";
import { PageHeader } from "@/components/legato/EditorialUI";
import { getProvider } from "@/lib/resources-data";
import { z } from "zod";

const searchSchema = z.object({ when: z.string().optional() });

export const Route = createFileRoute("/resources/confirm/$providerId")({
  validateSearch: searchSchema,
  component: ConfirmPage,
  notFoundComponent: () => (
    <Shell>
      <div className="px-7 pt-20">
        <p className="font-serif text-[1.6rem] text-dusk">Rendez-vous introuvable.</p>
        <Link to="/resources" className="mt-4 inline-block text-sm text-dusk/60 underline">
          Revenir
        </Link>
      </div>
    </Shell>
  ),
});

function ConfirmPage() {
  const { providerId } = Route.useParams();
  const { when } = Route.useSearch();
  const p = getProvider(providerId);
  if (!p) throw notFound();

  const [reminder, setReminder] = useState(false);

  return (
    <Shell>
      <PageHeader title="RENDEZ-VOUS" back="/resources" />
      <div className="px-7 pt-16 text-center">
        <div className="ceramic-soft mx-auto flex size-16 items-center justify-center rounded-full">
          <Check size={22} strokeWidth={1.5} className="text-dusk/70" />
        </div>
        <h1 className="mt-6 ed-page-title text-dusk">
          C'est noté.
        </h1>
        <p className="mt-4 font-serif text-[1.15rem] leading-relaxed text-dusk/80">
          {p.firstName} vous attend
          {when ? (
            <>
              {" "}le <span className="text-dusk">{when}</span>
            </>
          ) : null}
          .
        </p>
        <p className="mt-2 font-serif text-[1.05rem] text-dusk/65">
          Prenez soin de vous d'ici là.
        </p>
      </div>

      <section className="mt-10 px-7">
        <button
          onClick={() => setReminder((v) => !v)}
          className={`card-plain flex w-full items-center justify-between gap-3 px-5 py-4 transition-all ${
            reminder ? "ring-1 ring-dusk/20" : ""
          }`}
        >
          <span className="flex items-center gap-3 text-left">
            <Bell size={16} strokeWidth={1.5} className="text-dusk/65" />
            <span>
              <span className="block text-[14px] text-dusk">Ajouter un rappel doux</span>
              <span className="block text-[12px] italic text-dusk/55">
                Une notification calme la veille, sans bruit.
              </span>
            </span>
          </span>
          <span
            className={`text-[11px] uppercase tracking-[0.18em] ${
              reminder ? "text-dusk" : "text-dusk/45"
            }`}
          >
            {reminder ? "activé" : "activer"}
          </span>
        </button>
      </section>

      <div className="mt-10 px-7 text-center">
        <Link
          to="/home"
          className="font-serif text-[14px] text-dusk/65 underline-offset-4 hover:underline"
        >
          Revenir à l'accueil
        </Link>
      </div>
    </Shell>
  );
}