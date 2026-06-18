import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useEffect } from "react";

export const Route = createFileRoute("/space")({
  head: () => ({
    meta: [
      { title: "Votre espace — Legato" },
      { name: "description", content: "Soutien, démarches, mémoire — trois espaces distincts pour ne pas mélanger." },
    ],
  }),
  component: Space,
});

function Space() {
  const { name, primaryNeed } = useLegato();
  const navigate = useNavigate();

  // Redirection automatique quand un seul espace dominant.
  useEffect(() => {
    if (primaryNeed === "emotional" || primaryNeed === "practical") {
      navigate({ to: "/home" });
    }
  }, [primaryNeed, navigate]);

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="pt-9 px-6 flex justify-center">
          <LegatoMark to="/space" size={24} />
        </header>

        <section className="px-7 pt-16 text-center">
          {name && (
            <p className="mono-label tracking-[0.18em] text-dusk/60">
              Bonjour, {name}
            </p>
          )}
          <h1 className="mt-7 font-serif font-normal text-[36px] leading-[1.05] tracking-[-0.01em] text-dusk">
            De quoi avez-vous
            <br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>besoin</span>&nbsp;?
          </h1>
          <p className="mt-5 mx-auto max-w-[28ch] text-[13px] leading-[1.6] text-dusk/60">
            Trois espaces. Vous passerez de l'un à l'autre quand bon vous semble.
          </p>
        </section>

        <section className="px-7 pt-12 flex-1 flex flex-col justify-center gap-3">
          <SpaceChoice to="/home"      num="01" label="Soutien"   title="Prendre soin de soi"      hint="Ressentir, écrire, respirer." />
          <SpaceChoice to="/practical" num="02" label="Démarches" title="Organiser et avancer"     hint="Étapes, documents, cérémonie." />
          <SpaceChoice to="/memory"    num="03" label="Mémoire"   title="Garder ce qui compte"     hint="Jardin, voix, dates, souvenirs." />
        </section>

        <footer className="px-7 pt-8 pb-10 text-center">
          <p className="mono-label tracking-[0.22em] text-dusk/45">LEGATO</p>
        </footer>
      </div>
    </main>
  );
}

function SpaceChoice({ to, num, label, title, hint }: {
  to: "/home" | "/practical" | "/memory";
  num: string; label: string; title: string; hint: string;
}) {
  return (
    <Link
      to={to}
      className="group block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-6 py-5 transition-colors hover:border-dusk/25"
    >
      <div className="flex items-center gap-5">
        <span className="font-mono text-[11px] tracking-[0.18em] text-dusk/45 w-6">{num}</span>
        <div className="flex-1 min-w-0">
          <p className="mono-label text-dusk/55">{label}</p>
          <p className="mt-1.5 font-serif text-[20px] leading-[1.15] text-dusk">{title}</p>
          <p className="mt-1 text-[12px] text-dusk/55">{hint}</p>
        </div>
        <span className="text-dusk/40 text-[18px] transition-transform group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}