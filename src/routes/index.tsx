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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => navigate({ to: "/start" }), 900);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = PLAYBACK_RATE;
    v.volume = 1;
    // Start muted so autoplay is allowed by the browser, then try to unmute.
    v.defaultMuted = true;
    v.muted = true;

    const startWithSound = () => {
      try {
        if (v.currentTime < VIDEO_START_OFFSET) v.currentTime = VIDEO_START_OFFSET;
      } catch {}
      // Always start playback (muted is allowed); try to unmute right after.
      v.play()
        .then(() => {
          v.muted = false;
          v.defaultMuted = false;
        })
        .catch(() => {
          v.muted = true;
          v.defaultMuted = true;
          v.play().catch(() => undefined);
        });
    };

    // Kick off immediately, and also retry on canplay/loadedmetadata for safety.
    startWithSound();
    v.addEventListener("canplay", startWithSound, { once: true });
    v.addEventListener("loadedmetadata", startWithSound, { once: true });

    // If the browser blocks sound on first load, enable it on first interaction.
    const onFirstInteract = () => {
      if (!v) return;
      v.muted = false;
      v.defaultMuted = false;
      v.volume = 1;
      if (v.paused) v.play().catch(() => undefined);
      window.removeEventListener("pointerdown", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
    };
    window.addEventListener("pointerdown", onFirstInteract);
    window.addEventListener("keydown", onFirstInteract);
    window.addEventListener("touchstart", onFirstInteract);

    // Reveal the paper background + black logo together near the end of the video.
    const syncLogoToVideo = () => {
      const t = v.currentTime;
      if (v.duration && t >= v.duration - 1.5) setLogoVisible(true);
      else if (t >= LOGO_SHOW_AT_SECONDS && v.duration && t >= v.duration - 1.5) setLogoVisible(true);
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
      v.removeEventListener("canplay", startWithSound);
      window.clearTimeout(t2);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("timeupdate", onTimeUpdateEnter);
      v.removeEventListener("timeupdate", syncLogoToVideo);
      v.removeEventListener("seeked", syncLogoToVideo);
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
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Paper background + black logo — fade in together near the end of the video */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none px-10 bg-paper"
        style={{
          opacity: logoVisible ? 1 : 0,
          transition: "opacity 1600ms ease",
        }}
      >
        <img
          src="/legato-logo-noir.png"
          alt="Legato"
          className="w-[120%] max-w-[640px] h-auto"
        />
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
