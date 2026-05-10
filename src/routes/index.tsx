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

function Intro() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);
  const [showEnter, setShowEnter] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => navigate({ to: "/start" }), 900);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = PLAYBACK_RATE;
    }
    const t1 = window.setTimeout(() => setLogoVisible(false), 700);
    const onEnded = () => setShowEnter(true);
    const v = videoRef.current;
    v?.addEventListener("ended", onEnded);
    // Fallback in case 'ended' doesn't fire (looping or metadata issue)
    const t2 = window.setTimeout(() => setShowEnter(true), 12000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      v?.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <main
      className="fixed inset-0 overflow-hidden bg-paper text-dusk select-none"
      style={{
        opacity: leaving ? 0 : 1,
        transition: "opacity 900ms ease",
      }}
      aria-label="Entrer dans Legato"
    >
      <style>{`
        @keyframes intro-enter-in {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Logo overlay — fades out after 2s */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none px-10"
        style={{
          opacity: logoVisible ? 1 : 0,
          transition: "opacity 1400ms ease",
        }}
      >
        <img
          src="/legato-logo.png"
          alt="Legato"
          className="w-[42%] max-w-[220px] h-auto"
          style={{ filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.35))" }}
        />
      </div>

      {/* Enter button — appears at end of video */}
      {showEnter && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-[8vh] px-8">
          <button
            onClick={enter}
            className="rounded-full bg-white/15 backdrop-blur-md border border-white/70 px-10 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-white hover:bg-white/25 transition-colors"
            style={{ animation: "intro-enter-in 900ms ease-out forwards" }}
          >
            Entrer
          </button>
        </div>
      )}
    </main>
  );
}
