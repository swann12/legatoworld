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
  const [needsTap, setNeedsTap] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
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
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "true");

    const startAutoplay = () => {
      try {
        if (v.currentTime < VIDEO_START_OFFSET) v.currentTime = VIDEO_START_OFFSET;
      } catch {
        // Some mobile browsers only allow setting currentTime after metadata loads.
      }
      // Try unmuted autoplay first; fall back to muted if the browser blocks it.
      v.muted = false;
      v.volume = 1;
      v.play()
        .then(() => {
          setIsMuted(false);
          setNeedsTap(false);
        })
        .catch(() => {
          v.muted = true;
          v.volume = 0;
          setIsMuted(true);
          v.play()
            .then(() => setNeedsTap(false))
            .catch(() => setNeedsTap(true));
        });
    };

    // Kick off muted autoplay immediately, then retry as metadata/buffer/page visibility become available.
    startAutoplay();
    const retryTimers = [80, 250, 700, 1400].map((delay) => window.setTimeout(startAutoplay, delay));
    const onPageReady = () => startAutoplay();
    v.addEventListener("loadedmetadata", startAutoplay, { once: true });
    v.addEventListener("canplay", startAutoplay, { once: true });
    v.addEventListener("canplaythrough", startAutoplay, { once: true });
    window.addEventListener("pageshow", onPageReady);
    document.addEventListener("visibilitychange", onPageReady);

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
      window.removeEventListener("pageshow", onPageReady);
      document.removeEventListener("visibilitychange", onPageReady);
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(t2);
      window.clearTimeout(fadeTimer);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("timeupdate", onTimeUpdateEnter);
      v.removeEventListener("timeupdate", syncLogoToVideo);
      v.removeEventListener("seeked", syncLogoToVideo);
    };
  }, []);

  if (isDesktop) {
    return <main className="min-h-dvh bg-paper" />;
  }

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
        onClick={() => {
          const v = videoRef.current;
          if (v && v.muted) {
            v.muted = false;
            v.volume = 1;
            setIsMuted(false);
            v.play().catch(() => undefined);
            return;
          }
          skipToEnd();
        }}
        className="absolute inset-0 h-full w-full object-cover cursor-pointer"
      />

      {/* Tap prompt — appears only if the browser blocked autoplay (e.g. iOS Low Power Mode) */}
      {needsTap && !logoVisible && (
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = false;
            v.volume = 1;
            setIsMuted(false);
            v.play().then(() => setNeedsTap(false)).catch(() => undefined);
          }}
          className="absolute inset-0 flex items-end justify-center pb-[14vh] bg-transparent"
          aria-label="Toucher pour commencer"
        >
          <span className="rounded-full border border-paper/60 bg-dusk/30 backdrop-blur-sm px-6 py-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-paper">
            Toucher pour commencer
          </span>
        </button>
      )}

      {/* Sound toggle — visible while video plays muted so the visitor can restore audio */}
      {!logoVisible && isMuted && !needsTap && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const v = videoRef.current;
            if (!v) return;
            v.muted = false;
            v.volume = 1;
            setIsMuted(false);
            v.play().catch(() => undefined);
          }}
          className="absolute right-4 top-4 z-20 rounded-full border border-paper/50 bg-dusk/30 backdrop-blur-sm px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-paper"
          aria-label="Activer le son"
        >
          ♪ Son
        </button>
      )}

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
