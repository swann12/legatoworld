import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Legato — A quiet companion through grief" },
      {
        name: "description",
        content:
          "Un compagnon premium, doux et sensible, pour le deuil, la perte et la peur de perdre quelqu'un.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <Halos mode="cocoon" variant="rich" />

        <div className="relative z-10 flex flex-1 flex-col px-8 pt-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-dusk/40">
            Legato
          </p>

          <div className="mt-32 max-w-[28ch]">
            <h1 className="font-serif text-[3rem] leading-[1.02] font-light text-dusk text-balance">
              Certaines choses <span className="italic">ne se réparent pas,</span> elles s'accompagnent.
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-dusk/60 max-w-[34ch]">
              Un espace tranquille pour le deuil, la peur de perdre, et les
              grandes questions — tenu avec soin, sans pression.
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-4 pb-14">
            <Link
              to="/onboarding"
              className="ceramic organic-radius-3 px-7 py-5 text-center"
            >
              <span className="block font-serif text-xl italic text-dusk">Commencer doucement</span>
              <span className="mt-1 block text-[11px] uppercase tracking-[0.22em] text-dusk/50">
                Quatre questions, sans bruit
              </span>
            </Link>
            <Link
              to="/home"
              className="text-center text-[12px] uppercase tracking-[0.22em] text-dusk/50 hover:text-dusk transition-colors"
            >
              Passer — je suis déjà venu·e
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
