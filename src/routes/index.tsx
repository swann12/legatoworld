import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

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
        <div className="relative z-10 flex flex-1 flex-col px-9 pt-14 pb-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-dusk/45">
            Legato
          </p>

          <div className="flex flex-1 flex-col justify-center max-w-[24ch] py-10">
            <h1
              className="font-serif text-[2.4rem] leading-[1.1] font-light text-dusk"
              style={{ textWrap: "balance" }}
            >
              Certaines choses <span className="italic">s'accompagnent</span>,
              plutôt qu'elles ne se réparent.
            </h1>
            <p
              className="mt-7 max-w-[28ch] text-[14.5px] leading-relaxed text-dusk/60"
              style={{ textWrap: "balance" }}
            >
              Un espace tranquille pour le deuil et la peur de perdre. Tenu avec soin, sans pression.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <Link
              to="/onboarding"
              className="ceramic organic-radius-3 px-7 py-5 text-center"
            >
              <span className="block font-serif text-[1.25rem] italic text-dusk">
                Commencer doucement
              </span>
              <span className="mt-1.5 block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                À votre rythme, sans pression
              </span>
            </Link>
            <Link
              to="/home"
              className="text-center text-[11px] uppercase tracking-[0.22em] text-dusk/50 hover:text-dusk transition-colors"
            >
              Je suis déjà venu·e
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
