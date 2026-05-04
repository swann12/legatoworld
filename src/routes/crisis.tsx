import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/crisis")({
  head: () => ({ meta: [{ title: "A small, quiet door — Legato" }] }),
  component: Crisis,
});

function Crisis() {
  return (
    <Shell hideNav>
      <div className="relative min-h-dvh flex flex-col bg-paper">
        <div
          aria-hidden
          className="halo-lg absolute -top-20 left-1/2 -translate-x-1/2 size-80 rounded-full opacity-50 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--mist), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-1 flex-col px-8 pt-10">
          <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Home</Link>

          <div className="mt-16 max-w-[28ch]">
            <h1 className="font-serif text-[2.6rem] leading-[1.05] font-light text-dusk text-balance">
              You are <span className="italic">here.</span><br />
              Nothing is required.
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-dusk/65 max-w-[34ch]">
              Breathe with the dot. When you're ready, one of these doors is open.
            </p>
          </div>

          <div className="my-12 flex justify-center">
            <div
              className="size-28 rounded-full breath"
              style={{
                background: "radial-gradient(circle at 30% 30%, var(--mist), var(--lavender))",
                boxShadow: "inset 0 2px 4px rgba(255,255,255,0.6), 0 18px 40px -16px rgba(60,40,60,0.25)",
                animationDuration: "7s",
              }}
            />
          </div>

          <div className="space-y-3 pb-12">
            <a href="tel:988" className="ceramic organic-radius-3 block px-7 py-5 text-center">
              <span className="font-serif text-xl italic text-dusk">Call someone now</span>
              <span className="block mt-1 text-[11px] uppercase tracking-[0.22em] text-dusk/50">A crisis line, in your country</span>
            </a>
            <button className="ceramic-soft organic-radius-3 w-full px-7 py-5 text-center">
              <span className="font-serif text-lg italic text-dusk">Notify a trusted person</span>
            </button>
            <Link to="/no-words" className="ceramic-soft organic-radius-3 block px-7 py-5 text-center">
              <span className="font-serif text-lg italic text-dusk">Just breathe with me</span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}