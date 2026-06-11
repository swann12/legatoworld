import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/practical/")({
  head: () => ({
    meta: [
      { title: "Avancer — Legato" },
      { name: "description", content: "Une priorité à la fois. Nous avons rassemblé ce qui mérite votre attention." },
    ],
  }),
  component: Practical,
});

const TASKS: { label: string; status: string; to: string }[] = [
  { label: "Prévenir l'employeur",   status: "À faire",  to: "/practical/steps" },
  { label: "Choisir le lieu",        status: "En cours", to: "/practical/ceremony" },
  { label: "Écrire les mots",        status: "En cours", to: "/practical/texts" },
  { label: "Décider les fleurs",     status: "À faire",  to: "/practical/flowers" },
  { label: "Prévenir les proches",   status: "Délégué",  to: "/practical/share" },
  { label: "Trouver un notaire",     status: "À voir",   to: "/resources" },
];

function Practical() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32 px-7">
        <header className="pt-9 flex items-center justify-between">
          <span className="font-serif text-[20px] leading-none">Legato</span>
          <Link
            to="/space"
            className="text-[13px] text-dusk/60 hover:text-dusk underline underline-offset-4"
          >
            Espace
          </Link>
        </header>

        <section className="pt-16">
          <h1 className="font-serif text-[38px] leading-[1.05] font-light text-balance">
            Une chose <span className="italic" style={{ color: "var(--terracotta)" }}>à la fois.</span>
          </h1>
        </section>

        {/* À faire en premier — carte couleur claire et nette */}
        <section className="-mx-7 px-5 pt-10">
          <Link
            to="/practical/steps"
            className="block rounded-[22px] px-7 py-7 text-[color:var(--paper)]"
            style={{ background: "var(--bordeaux)" }}
          >
            <p className="text-[12px] opacity-70 mb-2">À faire en premier</p>
            <h2 className="font-serif text-[28px] leading-[1.08] font-light">
              Déclarer le décès <span className="italic">à la mairie</span>
            </h2>
            <p className="mt-5 text-[13px] opacity-80">Commencer →</p>
          </Link>
        </section>

        {/* La suite — liste claire, statut à droite */}
        <section className="pt-10">
          <ol className="divide-y divide-dusk/12 border-t border-dusk/12">
            {TASKS.map((t) => (
              <li key={t.label}>
                <Link to={t.to as never} className="flex items-center justify-between py-4 group">
                  <span className="font-serif text-[19px] leading-snug font-light pr-3">
                    {t.label}
                  </span>
                  <span className="text-[12px] text-dusk/55 shrink-0">
                    {t.status}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Link
            to="/parcours"
            className="mt-6 inline-block text-[13px] text-dusk/70 hover:text-dusk underline underline-offset-4"
          >
            Voir tout mon parcours →
          </Link>
        </section>

        {/* Deux portes secondaires sobres */}
        <section className="-mx-7 px-5 pt-10 grid grid-cols-2 gap-3">
          <Link
            to="/practical/ceremony"
            className="rounded-[18px] px-5 py-6"
            style={{ background: "var(--blush)", color: "var(--dusk)" }}
          >
            <p className="font-serif text-[20px] italic leading-tight">Cérémonie</p>
            <p className="mt-1 text-[12px] text-dusk/65">Lieu, textes, musique</p>
          </Link>
          <Link
            to="/resources"
            className="rounded-[18px] px-5 py-6"
            style={{ background: "var(--clay)", color: "var(--dusk)" }}
          >
            <p className="font-serif text-[20px] italic leading-tight">Services</p>
            <p className="mt-1 text-[12px] text-dusk/65">Pompes funèbres, notaire</p>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
