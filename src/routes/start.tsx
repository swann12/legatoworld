import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/start")({
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
  component: Start,
});

function Start() {
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <div className="relative z-10 flex flex-1 flex-col px-9 pt-14 pb-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-dusk/45">
            Legato
          </p>

          <div className="flex flex-1 flex-col justify-center max-w-[24ch] py-10">
            <h1
              className="font-serif text-[2.4rem] leading-[1.15] font-light text-dusk"
              style={{ textWrap: "balance" }}
            >
              Préparer un adieu, <span className="italic">garder une présence.</span>
            </h1>
            <p
              className="mt-7 max-w-[30ch] text-[14.5px] leading-relaxed text-dusk/60"
              style={{ textWrap: "balance" }}
            >
              Legato vous aide à composer une cérémonie, écrire ce qui compte, et faire vivre le souvenir d'un être cher. À votre rythme.
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