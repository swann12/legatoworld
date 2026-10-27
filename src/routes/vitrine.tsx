import { createFileRoute, Link } from "@tanstack/react-router";
import { LegatoLogo } from "@/components/legato/ds/LegatoLogo";

const OG = "https://legatoworld.lovable.app/og-legato.jpg";

export const Route = createFileRoute("/vitrine")({
  head: () => ({
    meta: [
      { title: "Legato — Traverser le deuil, à votre rythme" },
      { name: "description", content: "Legato accompagne le deuil, la maladie d'un proche et les questions sur la mort : soutien, démarches, souvenirs et rituels." },
      { property: "og:title", content: "Legato — Traverser le deuil, à votre rythme" },
      { property: "og:description", content: "Soutien, démarches, souvenirs et rituels, au jour le jour." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://legatoworld.lovable.app/vitrine" },
      { property: "og:image", content: OG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG },
    ],
    links: [{ rel: "canonical", href: "https://legatoworld.lovable.app/vitrine" }],
  }),
  component: Vitrine,
});

const serif = { fontFamily: "var(--lg-serif)" } as const;
const sans = { fontFamily: "var(--lg-sans)", color: "var(--lg-deep)" } as const;
const sub = { color: "var(--lg-sub)" } as const;

function Label({ children }: { children: string }) {
  return <p className="lg-mono" style={sub}>{children} —</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-4 max-w-[22ch]" style={{ ...serif, fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.05, textWrap: "balance" }}>{children}</h2>;
}

function PhoneFrame({ src, label }: { src: string; label: string }) {
  const NATIVE_W = 390, NATIVE_H = 800, FRAME_W = 280;
  const scale = FRAME_W / NATIVE_W;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="overflow-hidden" style={{ width: FRAME_W, height: NATIVE_H * scale, borderRadius: 28, border: "6px solid var(--lg-deep)", background: "var(--lg-cream)" }}>
        <iframe src={src} title={label} loading="lazy" className="border-0"
          style={{ width: NATIVE_W, height: NATIVE_H, transform: `scale(${scale})`, transformOrigin: "top left" }} />
      </div>
      <p className="lg-mono" style={sub}>{label}</p>
    </div>
  );
}

const SPACES = [
  { t: "Une personne est morte", d: "Les démarches dans le bon ordre, le soutien des premières semaines, un jardin de souvenirs." },
  { t: "Un animal est mort", d: "Un chagrin reconnu, les choix pour son corps, ses papiers, une parcelle pour lui." },
  { t: "Un proche est gravement malade", d: "Un carnet partagé avec le cercle, qui fait quoi, les questions au médecin." },
  { t: "Je pense souvent à la mort", d: "Préparer, transmettre, écrire ce qui compte. Une aide immédiate si c'est trop lourd." },
];

const DAYS = [
  { t: "Aujourd'hui", d: "Selon vos émotions et la période traversée, une seule chose : ce qui compte maintenant." },
  { t: "Soutien", d: "Parler à quelqu'un, un psychologue remboursé, dire à vos proches ce qui vous aiderait." },
  { t: "Démarches", d: "Ce qui vient en premier, puis la suite, numérotée. Et « Je suis bloqué » quand rien n'avance." },
  { t: "Mémoire", d: "Photos, voix, recettes, lettres : un jardin peint où chaque être aimé a sa parcelle." },
];

function Vitrine() {
  return (
    <main className="min-h-dvh" style={{ background: "var(--lg-cream)", ...sans }}>
      <header className="mx-auto flex max-w-[1120px] items-center justify-between px-7 py-6">
        <LegatoLogo />
        <nav className="hidden gap-7 sm:flex">
          {[["#pour-qui", "Pour qui"], ["#au-quotidien", "Au quotidien"], ["#apercu", "Aperçu"]].map(([h, l]) => (
            <a key={h} href={h} className="lg-mono" style={sub}>{l}</a>
          ))}
        </nav>
      </header>

      {/* Ouverture */}
      <section className="mx-auto max-w-[880px] px-7 pb-28 pt-24 text-center">
        <Label>Traverser, au jour le jour</Label>
        <h1 className="mx-auto mt-6" style={{ ...serif, fontSize: "clamp(44px,6.5vw,84px)", lineHeight: 1.02, textWrap: "balance" }}>
          Certaines choses <em>s'accompagnent,</em> plutôt qu'elles ne se réparent.
        </h1>
        <p className="mx-auto mt-7 max-w-[52ch] text-[17px] leading-relaxed" style={sub}>
          Legato vous accompagne après la mort d'une personne ou d'un animal, auprès d'un proche gravement malade, ou quand vous pensez souvent à la mort. Une intention claire, une action évidente.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link to="/" className="inline-flex items-center px-7 py-4 text-[15px]" style={{ background: "var(--lg-deep)", color: "var(--lg-mint)", borderRadius: 999 }}>
            Découvrir Legato
          </Link>
          <span className="lg-mono" style={sub}>Sans compte · iOS et Android bientôt</span>
        </div>
      </section>

      {/* Pour qui */}
      <section id="pour-qui" style={{ background: "var(--lg-linen)" }}>
        <div className="mx-auto max-w-[1120px] px-7 py-24">
          <Label>Pour qui</Label>
          <H2>Un espace qui s'adapte à <em>ce que vous vivez.</em></H2>
          <div className="mt-12 grid gap-x-12 sm:grid-cols-2">
            {SPACES.map((s, i) => (
              <div key={s.t} className="flex gap-5 py-6" style={{ borderTop: "1px solid color-mix(in oklab, var(--lg-deep) 14%, transparent)" }}>
                <span style={{ ...serif, fontSize: 30, lineHeight: 1, color: "var(--lg-sub)" }}>{i + 1}</span>
                <div>
                  <h3 style={{ ...serif, fontSize: 24, lineHeight: 1.15 }}>{s.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed" style={sub}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Au quotidien */}
      <section id="au-quotidien">
        <div className="mx-auto max-w-[1120px] px-7 py-24">
          <Label>Au quotidien</Label>
          <H2>Chaque jour, <em>une seule chose</em> utile.</H2>
          <div className="mt-12 grid gap-10 md:grid-cols-4">
            {DAYS.map((d) => (
              <div key={d.t}>
                <h3 style={{ ...serif, fontSize: 26 }}>{d.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={sub}>{d.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 max-w-[640px] px-7 py-6" style={{ background: "var(--lg-blue)" }}>
            <p className="lg-mono" style={sub}>Présence</p>
            <p className="mt-2" style={{ ...serif, fontSize: 24, lineHeight: 1.25 }}>
              Une voix qui écoute, puis vous guide vers la bonne page. Elle n'invente ni règle ni délai.
            </p>
          </div>
        </div>
      </section>

      {/* Aperçu */}
      <section id="apercu" style={{ background: "var(--lg-linen)" }}>
        <div className="mx-auto max-w-[1120px] px-7 py-24">
          <Label>Aperçu</Label>
          <H2>Quelques fenêtres <em>sur l'application.</em></H2>
          <div className="mt-14 flex flex-wrap justify-center gap-10">
            <PhoneFrame src="/home" label="Aujourd'hui" />
            <PhoneFrame src="/care" label="Soutien" />
            <PhoneFrame src="/care/garden" label="Le jardin" />
          </div>
        </div>
      </section>

      {/* Confidentialité */}
      <section>
        <div className="mx-auto max-w-[760px] px-7 py-24 text-center">
          <Label>Vos mots restent à vous</Label>
          <p className="mx-auto mt-5 max-w-[26ch]" style={{ ...serif, fontSize: "clamp(28px,3.4vw,40px)", lineHeight: 1.15 }}>
            Sans compte, tout reste <em>sur votre téléphone.</em>
          </p>
          <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-relaxed" style={sub}>
            Un compte ne sert qu'à inviter vos proches, écrire à plusieurs ou retrouver votre espace sur un autre appareil.
          </p>
          <Link to="/" className="mt-8 inline-block text-[15px] underline underline-offset-4">Découvrir Legato</Link>
        </div>
      </section>

      <footer style={{ background: "var(--lg-deep)" }}>
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-7 py-10">
          <LegatoLogo night />
          <p className="lg-mono" style={{ color: "var(--lg-cream)", opacity: 0.7 }}>© {new Date().getFullYear()} · Tenu avec soin</p>
        </div>
      </footer>
    </main>
  );
}
