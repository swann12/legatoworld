import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help — Legato" }] }),
  component: Help,
});

const PRACTICAL = [
  { kind: "Administration", title: "What needs to be cancelled or notified", body: "A list, paced gently. Bank, subscriptions, the post office." },
  { kind: "Body", title: "When the body forgets to eat", body: "Five small things you can swallow without thinking." },
  { kind: "Sleep", title: "Nights that won't end", body: "What others have done at 3 a.m." },
  { kind: "Conversation", title: "Words for awkward sympathies", body: "When people say the wrong thing, kindly." },
];

const RELAY = [
  { kind: "A close friend", title: "Ask someone to take one task", body: "Forward a single, clear ask. We write the message for you." },
  { kind: "A professional", title: "Find a grief therapist nearby", body: "Curated by region and language." },
  { kind: "A community", title: "Quiet group, weekly", body: "Online circles for loss of a person, an animal, or anticipated grief." },
];

function Help() {
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <ScreenHeader
            eyebrow="Help — practical, quiet"
            title={<>Hands nearby, <br /><span className="italic">if you need them.</span></>}
            subtitle="Nothing here demands you do it now. Choose only what feels possible today."
          />

          <Section className="mt-10 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-2">Practical things</p>
            {PRACTICAL.map((p) => (
              <article key={p.title} className="ceramic-soft organic-radius-3 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{p.kind}</p>
                <h3 className="mt-1.5 font-serif text-lg italic text-dusk">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-dusk/60">{p.body}</p>
              </article>
            ))}
          </Section>

          <Section className="mt-10 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-2">Relay — let others help</p>
            {RELAY.map((p) => (
              <article key={p.title} className="ceramic organic-radius-3 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{p.kind}</p>
                <h3 className="mt-1.5 font-serif text-lg italic text-dusk">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-dusk/60">{p.body}</p>
              </article>
            ))}
          </Section>

          <Section className="mt-10">
            <Link to="/crisis" className="block border-t border-dusk/10 pt-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">If today is too much</p>
              <p className="mt-1 font-serif text-base italic text-dusk">A small, quiet door →</p>
            </Link>
          </Section>
        </div>
      </div>
    </Shell>
  );
}