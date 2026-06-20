import { createFileRoute, Link } from "@tanstack/react-router";
import gardenPainted from "@/assets/garden-painted-v4.png";

export const Route = createFileRoute("/vitrine")({
  head: () => ({
    meta: [
      { title: "Legato — Un compagnon doux pour le deuil" },
      {
        name: "description",
        content:
          "Legato accompagne le deuil et la peur de perdre. Téléchargez l'application pour un espace tenu, sans pression.",
      },
    ],
  }),
  component: Vitrine,
});

function PhoneFrame({ src, label }: { src: string; label: string }) {
  // Render the app at its native mobile width (390x800) and scale it down
  // so the layout inside the iframe never reflows or feels cramped.
  const NATIVE_W = 390;
  const NATIVE_H = 800;
  const FRAME_W = 300;
  const scale = FRAME_W / NATIVE_W;
  const FRAME_H = NATIVE_H * scale;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="ceramic organic-radius-3 relative overflow-hidden shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--dusk)_25%,transparent)]"
        style={{ width: FRAME_W, height: FRAME_H, padding: 6 }}
      >
        <div
          className="overflow-hidden rounded-[22px] bg-paper"
          style={{ width: FRAME_W - 12, height: FRAME_H - 12 }}
        >
          <iframe
            src={src}
            title={label}
            loading="lazy"
            className="border-0 bg-paper"
            style={{
              width: NATIVE_W,
              height: NATIVE_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-[0.24em] text-dusk/45">{label}</p>
    </div>
  );
}

function Vitrine() {
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      {/* Top bar */}
      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 sm:px-10">
        <p className="font-serif text-xl italic text-dusk">Legato</p>
        <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
          <a href="#manifeste" className="hover:text-dusk">Manifeste</a>
          <a href="#apercu" className="hover:text-dusk">Aperçu</a>
          <a href="#telecharger" className="hover:text-dusk">Télécharger</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-[1200px] gap-12 px-6 pt-10 pb-24 sm:px-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-dusk/45">
            Un compagnon premium pour le deuil
          </p>
          <h1
            className="mt-6 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-light text-dusk"
            style={{ textWrap: "balance" }}
          >
            Certaines choses <span className="italic">s'accompagnent,</span><br />
            plutôt qu'elles ne se réparent.
          </h1>
          <p
            className="mt-7 max-w-[44ch] text-[clamp(15px,1.4vw,17px)] leading-relaxed text-dusk/65"
            style={{ textWrap: "balance" }}
          >
            Legato est un espace tranquille pour traverser le deuil, l'absence et la peur de perdre.
            Tenu avec soin, sans pression, sans solutions toutes faites.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#telecharger"
              className="ceramic organic-radius-3 px-7 py-4 text-center"
            >
              <span className="block font-serif text-[1.1rem] text-dusk">
                Télécharger l'application
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                iOS · Android · bientôt disponible
              </span>
            </a>
            <Link
              to="/"
              className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk"
            >
              Essayer la démo →
            </Link>
          </div>
        </div>

        <div className="relative mx-auto">
          <img
            src={gardenPainted}
            alt="Le jardin peint de Legato"
            className="w-full max-w-[460px] select-none garden-dissolve"
            draggable={false}
          />
        </div>
      </section>

      {/* Manifeste */}
      <section id="manifeste" className="border-t border-dusk/8 bg-clay/40">
        <div className="mx-auto max-w-[1100px] px-6 py-24 sm:px-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-dusk/45">
            Manifeste
          </p>
          <h2
            className="mt-5 max-w-[24ch] font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-light leading-[1.1] text-dusk"
            style={{ textWrap: "balance" }}
          >
            Pas une app de productivité. Une présence.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              { t: "Tenu, pas guidé", d: "Pas de plan en 5 étapes. Juste des gestes simples, à votre rythme, qui s'adaptent à ce que vous traversez." },
              { t: "Doux, pas froid", d: "Une esthétique tactile : papier, céramique, peinture. Une voix posée, jamais clinique, jamais performante." },
              { t: "Privé, pour de vrai", d: "Vos souvenirs, votre journal, vos êtres aimés restent vôtres. Pensé pour la pudeur de ce qu'on confie." },
            ].map((b) => (
              <div key={b.t}>
                <h3 className="font-serif text-[1.4rem] italic font-light text-dusk">
                  {b.t}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-dusk/65">
                  {b.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aperçu — phones */}
      <section id="apercu" className="border-t border-dusk/8">
        <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-dusk/45">
            Aperçu
          </p>
          <h2
            className="mt-5 max-w-[28ch] font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-light leading-[1.1] text-dusk"
            style={{ textWrap: "balance" }}
          >
            Quelques fenêtres, vivantes, sur l'application.
          </h2>

          <div className="mt-14 flex flex-wrap items-start justify-center gap-10 md:gap-14">
            <PhoneFrame src="/home" label="Le foyer" />
            <PhoneFrame src="/garden" label="Le jardin" />
            <PhoneFrame src="/journal" label="Le journal" />
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="telecharger" className="border-t border-dusk/8 bg-clay/40">
        <div className="mx-auto max-w-[900px] px-6 py-28 text-center sm:px-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-dusk/45">
            Télécharger
          </p>
          <h2
            className="mt-5 font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-[1.05] text-dusk"
            style={{ textWrap: "balance" }}
          >
            Legato vit dans votre poche.
          </h2>
          <p
            className="mx-auto mt-6 max-w-[48ch] text-[15.5px] leading-relaxed text-dusk/65"
            style={{ textWrap: "balance" }}
          >
            L'application est pensée pour le téléphone — un objet intime, près du cœur.
            Téléchargez-la pour l'avoir à vos côtés, dans les moments qui comptent.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="ceramic organic-radius-3 px-8 py-5"
              aria-label="Télécharger sur l'App Store"
            >
              <span className="block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                Bientôt sur
              </span>
              <span className="mt-1 block font-serif text-[1.3rem] text-dusk">
                App Store
              </span>
            </a>
            <a
              href="#"
              className="ceramic organic-radius-3 px-8 py-5"
              aria-label="Télécharger sur Google Play"
            >
              <span className="block text-[10px] uppercase tracking-[0.22em] text-dusk/50">
                Bientôt sur
              </span>
              <span className="mt-1 block font-serif text-[1.3rem] text-dusk">
                Google Play
              </span>
            </a>
          </div>

          <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-dusk/40">
            En attendant — <Link to="/" className="text-dusk/70 hover:text-dusk">essayer la démo dans votre navigateur</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dusk/8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-10 sm:px-10">
          <p className="font-serif text-lg italic text-dusk">Legato</p>
          <p className="text-[10px] uppercase tracking-[0.24em] text-dusk/45">
            © {new Date().getFullYear()} · Tenu avec soin
          </p>
        </div>
      </footer>
    </main>
  );
}