import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import grass from "@/assets/intro-grass.png";
import bloom from "@/assets/intro-bloom.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Legato — Un jardin qui éclôt" },
      {
        name: "description",
        content:
          "Une ouverture douce sur Legato. Un jardin qui fleurit lentement, comme une respiration.",
      },
    ],
  }),
  component: Intro,
});

const AUTO_ENTER_MS = 16000;

// Small bloom clusters that grow from the ground.
// Each cluster is a circular crop of the painted bloom image,
// positioned along the lower band and scaled up from its base.
const BLOOMS = [
  { left: 8,  bottom: 6,  size: 26, delay: 3.2, dur: 5.5, bgX: 20, bgY: 30 },
  { left: 28, bottom: 2,  size: 34, delay: 4.0, dur: 6.0, bgX: 60, bgY: 55 },
  { left: 52, bottom: 8,  size: 30, delay: 4.8, dur: 6.2, bgX: 35, bgY: 70 },
  { left: 74, bottom: 3,  size: 32, delay: 5.4, dur: 6.0, bgX: 80, bgY: 40 },
  { left: 18, bottom: 22, size: 22, delay: 6.2, dur: 5.5, bgX: 50, bgY: 20 },
  { left: 62, bottom: 26, size: 24, delay: 7.0, dur: 5.5, bgX: 15, bgY: 60 },
  { left: 42, bottom: 34, size: 20, delay: 8.2, dur: 5.0, bgX: 70, bgY: 80 },
  { left: 86, bottom: 18, size: 20, delay: 7.6, dur: 5.0, bgX: 40, bgY: 10 },
];

function Intro() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => navigate({ to: "/start" }), 900);
  };

  useEffect(() => {
    const t = window.setTimeout(enter, AUTO_ENTER_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      onClick={enter}
      className="fixed inset-0 overflow-hidden bg-paper text-dusk cursor-pointer select-none"
      style={{
        opacity: leaving ? 0 : 1,
        transition: "opacity 900ms ease",
      }}
      aria-label="Entrer dans Legato"
    >
      <style>{`
        @keyframes intro-drift {
          0%   { transform: translate3d(0, 4%, 0)  scale(1.02); }
          100% { transform: translate3d(0, -6%, 0) scale(1.04); }
        }
        @keyframes intro-grass-in {
          0%   { opacity: 0; filter: blur(10px); }
          100% { opacity: 0.92; filter: blur(0); }
        }
        @keyframes intro-bloom-grow {
          0%   { transform: translateX(-50%) scaleY(0)    scaleX(0.6); opacity: 0; filter: blur(6px); }
          30%  { opacity: 0.5; }
          100% { transform: translateX(-50%) scaleY(1)    scaleX(1);   opacity: 0.95; filter: blur(0.5px); }
        }
        @keyframes intro-sway {
          0%, 100% { transform: translateX(-50%) rotate(-1.2deg); }
          50%      { transform: translateX(-50%) rotate(1.2deg); }
        }
        @keyframes intro-text-in {
          0%   { opacity: 0; transform: translateY(12px); letter-spacing: 0.4em; }
          100% { opacity: 1; transform: translateY(0);    letter-spacing: 0.32em; }
        }
        @keyframes intro-hint {
          0%, 100% { opacity: 0.0; }
          50%      { opacity: 0.55; }
        }
        @keyframes intro-haze {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.78; }
        }
        .intro-bloom {
          position: absolute;
          transform-origin: bottom center;
          background-repeat: no-repeat;
          mix-blend-mode: multiply;
          pointer-events: none;
          will-change: transform, opacity, filter;
        }
        .intro-bloom-inner {
          position: absolute; inset: 0;
          transform-origin: bottom center;
          will-change: transform;
        }
      `}</style>

      {/* Warm wash backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 110%, color-mix(in oklab, var(--clay) 55%, transparent) 0%, transparent 60%), radial-gradient(100% 70% at 50% -10%, color-mix(in oklab, var(--paper) 90%, white) 0%, transparent 65%), var(--paper)",
        }}
      />

      {/* Diffuse herb base — fills screen, very gentle drift */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${grass})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "multiply",
          opacity: 0,
          animation:
            "intro-grass-in 5000ms ease-out 200ms forwards, intro-drift 30000ms ease-in-out 200ms forwards",
          filter: "saturate(0.95)",
        }}
      />

      {/* Bloom clusters — grow from the ground, staggered */}
      {BLOOMS.map((b, i) => (
        <div
          key={i}
          className="intro-bloom"
          style={{
            left: `${b.left}%`,
            bottom: `${b.bottom}%`,
            width: `${b.size}vmin`,
            height: `${b.size * 1.15}vmin`,
            backgroundImage: `url(${bloom})`,
            backgroundSize: "320% auto",
            backgroundPosition: `${b.bgX}% ${b.bgY}%`,
            WebkitMaskImage:
              "radial-gradient(60% 70% at 50% 90%, black 35%, transparent 75%)",
            maskImage:
              "radial-gradient(60% 70% at 50% 90%, black 35%, transparent 75%)",
            opacity: 0,
            animation: `intro-bloom-grow ${b.dur}s cubic-bezier(.22,.9,.32,1) ${b.delay}s forwards`,
          }}
        >
          <div
            className="intro-bloom-inner"
            style={{
              animation: `intro-sway ${7 + (i % 3)}s ease-in-out ${b.delay + b.dur}s infinite`,
            }}
          />
        </div>
      ))}

      {/* Soft luminous haze, breathing */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 60%, color-mix(in oklab, white 70%, transparent) 0%, transparent 70%)",
          mixBlendMode: "screen",
          animation: "intro-haze 9000ms ease-in-out infinite",
        }}
      />

      {/* Top & bottom feathering for painterly fade */}
      <div
        className="absolute inset-x-0 top-0 h-[28%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--paper) 0%, color-mix(in oklab, var(--paper) 40%, transparent) 60%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[34%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--paper) 0%, color-mix(in oklab, var(--paper) 50%, transparent) 55%, transparent 100%)",
        }}
      />

      {/* Wordmark */}
      <div className="absolute inset-x-0 top-0 flex justify-center pt-[14vh] pointer-events-none">
        <p
          className="text-[11px] font-medium uppercase text-dusk/55"
          style={{
            letterSpacing: "0.32em",
            opacity: 0,
            animation: "intro-text-in 2400ms ease-out 800ms forwards",
          }}
        >
          Legato
        </p>
      </div>

      {/* Whispered line */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 pb-[10vh] pointer-events-none px-8">
        <p
          className="font-serif italic text-dusk/75 text-center text-[clamp(1.1rem,2.4vw,1.45rem)] leading-snug max-w-[22ch]"
          style={{
            opacity: 0,
            animation: "intro-text-in 3200ms ease-out 5500ms forwards",
            textWrap: "balance",
          }}
        >
          Quelque chose éclôt, doucement.
        </p>
        <p
          className="text-[10px] uppercase text-dusk/45"
          style={{
            letterSpacing: "0.28em",
            animation: "intro-hint 3600ms ease-in-out 8500ms infinite",
          }}
        >
          Touchez pour entrer
        </p>
      </div>
    </main>
  );
}
