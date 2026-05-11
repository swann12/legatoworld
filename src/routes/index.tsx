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
const VIDEO_START_OFFSET = 3;
const LOGO_SHOW_AT_SECONDS = 6.2;

function Intro() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const [bottomFadeVisible, setBottomFadeVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // On desktop, the home page is the marketing vitrine, not the intro video.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsDesktop(true);
      navigate({ to: "/vitrine", replace: true });
    }
  }, [navigate]);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => navigate({ to: "/start" }), 900);
  };

  const skipToEnd = () => {
    const v = videoRef.current;
    if (v) {
      try {
        if (v.duration && isFinite(v.duration)) {
          v.currentTime = Math.max(0, v.duration - 0.05);
        }
        v.pause();
      } catch {
        // ignore
      }
    }
    setLogoVisible(true);
    setShowEnter(true);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = PLAYBACK_RATE;
    v.defaultMuted = true;
    v.muted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "true");

    const startAutoplay = () => {
      try {
        if (v.currentTime < VIDEO_START_OFFSET) v.currentTime = VIDEO_START_OFFSET;
      } catch {
        // Some mobile browsers only allow setting currentTime after metadata loads.
      }
      v.muted = true;
      v.defaultMuted = true;
      v.play()
        .then(() => {
          // Try to unmute right after autoplay starts. Most browsers will block this,
          // in which case the first user interaction unmutes (see tryUnmute below).
          v.muted = false;
        })
        .catch(() => undefined);
    };

    // Some browsers permit unmuting once playback is rolling; retry on first user interaction.
    const tryUnmute = () => {
      v.muted = false;
      v.play().catch(() => undefined);
    };
    window.addEventListener("pointerdown", tryUnmute, { once: true });
    window.addEventListener("keydown", tryUnmute, { once: true });

    // Kick off muted autoplay immediately, then retry as metadata/buffer become available.
    startAutoplay();
    v.addEventListener("loadedmetadata", startAutoplay, { once: true });
    v.addEventListener("canplay", startAutoplay, { once: true });
    v.addEventListener("canplaythrough", startAutoplay, { once: true });

    // Hide the bottom fade after 2 seconds.
    const fadeTimer = window.setTimeout(() => setBottomFadeVisible(false), 2000);

    // Reveal the paper background + black logo together near the end of the video.
    const syncLogoToVideo = () => {
      const t = v.currentTime;
      if (v.duration && t >= Math.max(LOGO_SHOW_AT_SECONDS, v.duration - 1.5)) {
        setLogoVisible(true);
      }
    };
    v.addEventListener("timeupdate", syncLogoToVideo);
    v.addEventListener("seeked", syncLogoToVideo);
    syncLogoToVideo();

    const onEnded = () => {
      setLogoVisible(true);
      setShowEnter(true);
    };
    v.addEventListener("ended", onEnded);
    // Reveal the "Entrer" button slightly before the video ends
    const onTimeUpdateEnter = () => {
      if (v.duration && v.currentTime >= v.duration - 1.2) {
        setShowEnter(true);
        setLogoVisible(true);
      }
    };
    v.addEventListener("timeupdate", onTimeUpdateEnter);
    // Fallback in case 'ended' doesn't fire
    const t2 = window.setTimeout(() => setShowEnter(true), 30000);
    return () => {
      v.removeEventListener("loadedmetadata", startAutoplay);
      v.removeEventListener("canplay", startAutoplay);
      v.removeEventListener("canplaythrough", startAutoplay);
      window.removeEventListener("pointerdown", tryUnmute);
      window.removeEventListener("keydown", tryUnmute);
      window.clearTimeout(t2);
      window.clearTimeout(fadeTimer);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("timeupdate", onTimeUpdateEnter);
      v.removeEventListener("timeupdate", syncLogoToVideo);
      v.removeEventListener("seeked", syncLogoToVideo);
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
        onClick={skipToEnd}
        className="absolute inset-0 h-full w-full object-cover cursor-pointer"
      />

      {/* Soft fade from the video into the paper background along the bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--color-paper, #f5efe6) 60%, transparent) 60%, var(--color-paper, #f5efe6) 100%)",
          opacity: logoVisible || !bottomFadeVisible ? 0 : 1,
          transition: "opacity 2400ms ease",
        }}
      />

      {/* Paper background + black logo — fade in together near the end of the video */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none px-10 bg-paper"
        style={{
          opacity: logoVisible ? 1 : 0,
          transition: "opacity 600ms ease",
        }}
      >
        <img src="/legato-logo-noir.png" alt="Legato" className="w-[140%] max-w-[760px] h-auto" />
      </div>

      {/* Enter button — appears at end of video */}
      {showEnter && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-[8vh] px-8">
          <button
            onClick={enter}
            className="rounded-full bg-transparent border border-dusk/30 px-8 py-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-dusk hover:bg-dusk/5 transition-colors"
            style={{ animation: "intro-enter-in 900ms ease-out forwards" }}
          >
            Entrer
          </button>
        </div>
      )}
    </main>
  );
}
