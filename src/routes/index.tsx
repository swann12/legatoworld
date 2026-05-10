import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

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

// Slow the source video down a touch so the bloom feels even more unhurried.
const PLAYBACK_RATE = 0.7;
// Source clip ~5.08s; at 0.7x ≈ 7.26s. Hold a beat after, then auto-enter.
const AUTO_ENTER_MS = 9500;

function Intro() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = PLAYBACK_RATE;
    }
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
        @keyframes intro-video-in {
          0%   { opacity: 0; filter: blur(14px); transform: scale(1.06); }
          100% { opacity: 1; filter: blur(0);    transform: scale(1.0); }
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
      `}</style>

      {/* Warm wash backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 110%, color-mix(in oklab, var(--clay) 55%, transparent) 0%, transparent 60%), radial-gradient(100% 70% at 50% -10%, color-mix(in oklab, var(--paper) 90%, white) 0%, transparent 65%), var(--paper)",
        }}
      />

      {/* Garden video — full-bleed, slowed slightly */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        style={{
          mixBlendMode: "multiply",
          opacity: 0,
          animation: "intro-video-in 1800ms ease-out 100ms forwards",
        }}
      />

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
