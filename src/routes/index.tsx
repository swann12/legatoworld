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
    const v = videoRef.current;
    if (!v) return;

    // Unmute only on first user interaction (browsers block unmuted autoplay)
    const onFirstInteract = () => {
      if (!v) return;
      v.muted = false;
      v.volume = 1;
      // Don't call play() again — it would restart/desync. Video is already playing muted.
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
    };
    window.addEventListener("pointerdown", onFirstInteract);
    window.addEventListener("keydown", onFirstInteract);
    window.addEventListener("touchstart", onFirstInteract);

    // Hide logo when the video has actually started playing (not on mount).
    let logoTimer: number | undefined;
    const onPlaying = () => {
      if (logoTimer) return;
      logoTimer = window.setTimeout(() => setLogoVisible(false), 1100);
    };
    v.addEventListener("playing", onPlaying);
    if (!v.paused && v.currentTime > 0) onPlaying();

    const onEnded = () => setShowEnter(true);
    v.addEventListener("ended", onEnded);
    // Fallback in case 'ended' doesn't fire
    const t2 = window.setTimeout(() => setShowEnter(true), 30000);
    return () => {
      if (logoTimer) window.clearTimeout(logoTimer);
      window.clearTimeout(t2);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("playing", onPlaying);
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
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
        muted
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
            className="rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/25 px-8 py-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-white/70 hover:bg-white/10 transition-colors"
            style={{ animation: "intro-enter-in 900ms ease-out forwards" }}
          >
            Entrer
          </button>
        </div>
      )}
    </main>
  );
}
