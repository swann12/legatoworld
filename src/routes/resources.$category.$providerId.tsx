import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/legato/EditorialUI";
import { getCategory, getProvider } from "@/lib/resources-data";

export const Route = createFileRoute("/resources/$category/$providerId")({
  component: ProviderPage,
  notFoundComponent: () => (
    <Shell>
      <div className="px-7 pt-20">
        <p className="font-serif text-[1.6rem] italic text-dusk">
          Cette personne n'est plus disponible.
        </p>
        <Link to="/resources" className="mt-4 inline-block text-sm text-dusk/60 underline">
          Revenir
        </Link>
      </div>
    </Shell>
  ),
});

const SLOTS = [
  { day: "Jeu. 15 mai", times: ["09h30", "14h00", "17h30"] },
  { day: "Ven. 16 mai", times: ["10h00", "16h00"] },
  { day: "Lun. 19 mai", times: ["11h00", "15h30", "18h00"] },
];

function ProviderPage() {
  const { category, providerId } = Route.useParams();
  const p = getProvider(providerId);
  const cat = getCategory(category);
  if (!p || !cat) throw notFound();

  const navigate = useNavigate();
  const [slot, setSlot] = useState<string | null>(null);

  const confirm = () => {
    if (!slot) return;
    navigate({
      to: "/resources/confirm/$providerId",
      params: { providerId },
      search: { when: slot },
    });
  };

  return (
    <Shell>
      <PageHeader title={cat.label.toUpperCase()} back="/resources" />

      {/* En-tête prestataire */}
      <header className="mt-6 px-7">
        <div
          className="ceramic-soft mx-auto size-32 rounded-[44%_56%_50%_50%/55%_45%_55%_45%]"
          aria-hidden
          style={{
            background: `linear-gradient(160deg, color-mix(in oklab, ${cat.tint} 40%, var(--paper)), color-mix(in oklab, ${cat.tint} 70%, var(--clay)))`,
          }}
        />
        <h1 className="mt-5 ed-page-title text-dusk text-center">
          {p.firstName} <span className="italic">{p.lastName}</span>
        </h1>
        <p className="mt-1 text-center text-[12px] italic text-dusk/60">{p.speciality}</p>
        <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-dusk/55">
          <Sparkles size={11} className="text-dusk/45" />
          Recommandé·e par Legato
        </p>
      </header>

      {/* Approche */}
      <section className="mt-8 px-7">
        <p className="eyebrow">Son approche</p>
        <div className="mt-3 space-y-3 font-serif text-[1.05rem] leading-relaxed italic text-dusk/85">
          {p.approach.map((line, i) => (
            <p key={i}>« {line} »</p>
          ))}
        </div>
      </section>

      {/* Offres */}
      <section className="mt-8 px-7">
        <p className="eyebrow">
          Ce que propose {p.firstName}
        </p>
        <div className="mt-3 space-y-2.5">
          {p.offers.map((o) => (
            <div
              key={o.title}
              className="card-plain flex items-start justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="text-[14px] text-dusk">{o.title}</p>
                <p className="text-[12px] text-dusk/55">{o.detail}</p>
              </div>
              <p className="shrink-0 font-serif text-[1.05rem] text-dusk">{o.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Devis transparence (pompes funèbres) */}
      {p.estimate && (
        <section className="mt-8 px-7">
          <p className="eyebrow">
            Devis estimatif — transparence
          </p>
          <p className="mt-1 text-[11px] italic text-dusk/55">
            Conformément à la réglementation funéraire française.
          </p>
          <div className="card-plain mt-3 px-4 py-4">
            {p.estimate.lines.map((l) => (
              <div
                key={l.label}
                className="flex items-center justify-between border-b border-dusk/6 py-2 text-[13px] text-dusk/75 last:border-0"
              >
                <span>{l.label}</span>
                <span className="text-dusk">{l.price}</span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between pt-3 text-[14px] text-dusk">
              <span className="font-serif italic">Total estimé</span>
              <span className="font-serif text-[1.15rem]">{p.estimate.total}</span>
            </div>
          </div>
        </section>
      )}

      {/* Témoignages */}
      <section className="mt-8 px-7">
        <p className="eyebrow">
          Quelques mots reçus
        </p>
        <div className="mt-3 space-y-3">
          {p.testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="card-plain px-4 py-4 font-serif text-[1rem] leading-relaxed text-dusk/85"
            >
              « {t.body} »
              <footer className="mt-2 text-[11px] not-italic text-dusk/45">— {t.from}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Disponibilités */}
      <section className="mt-10 px-7">
        <p className="eyebrow">
          Prendre un moment avec {p.firstName}
        </p>
        <div className="mt-4 space-y-4">
          {SLOTS.map((d) => (
            <div key={d.day}>
              <p className="text-[12px] text-dusk/65">{d.day}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {d.times.map((t) => {
                  const id = `${d.day} · ${t}`;
                  const active = slot === id;
                  return (
                    <button
                      key={t}
                      onClick={() => setSlot(id)}
                      className={`rounded-full px-4 py-2 text-[12px] tracking-wide transition-all ${
                        active
                          ? "bg-dusk text-paper"
                          : "card-plain text-dusk/70 hover:text-dusk"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={confirm}
          disabled={!slot}
          className="mt-6 w-full rounded-full bg-dusk px-6 py-3.5 font-serif text-[1.05rem] text-paper transition-all disabled:opacity-40"
        >
          {slot ? `Confirmer — ${slot}` : "Choisir un créneau"}
        </button>
        <p className="mt-4 text-center text-[12px] italic text-dusk/50">
          Vous hésitez ? Vous pouvez aussi revenir plus tard.
        </p>
      </section>
    </Shell>
  );
}