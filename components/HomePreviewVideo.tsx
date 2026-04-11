"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface WindowEventMap {
    "pause-home-preview-videos": CustomEvent<{ id: string }>;
    "mute-home-showreel": CustomEvent;
  }
}

type GlowTheme = "pink" | "blue" | "green" | "orange";

type HomePreviewVideoProps = {
  src: string;
  label?: string;
  glowTheme?: GlowTheme;
};

const glowMap: Record<GlowTheme, string> = {
  pink: "bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.38),rgba(244,114,182,0.20),transparent_72%)]",
  blue: "bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.38),rgba(34,211,238,0.20),transparent_72%)]",
  green:
    "bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.38),rgba(16,185,129,0.20),transparent_72%)]",
  orange:
    "bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.38),rgba(251,191,36,0.20),transparent_72%)]",
};

export default function HomePreviewVideo({
  src,
  label = "",
  glowTheme = "blue",
}: HomePreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(`home-preview-${Math.random().toString(36).slice(2)}`);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlayButton, setShowOverlayButton] = useState(true);

  const clearFadeTimeout = () => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
  };

  const resetToPausedState = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    videoRef.current.muted = true;
    setIsPlaying(false);
    setShowOverlayButton(true);
    clearFadeTimeout();
  };

  const showButtonTemporarily = () => {
    setShowOverlayButton(true);
    clearFadeTimeout();

    fadeTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowOverlayButton(false);
      }
    }, 900);
  };

  const playVideo = async () => {
    if (!videoRef.current) return;

    window.dispatchEvent(
      new CustomEvent("pause-home-preview-videos", {
        detail: { id: idRef.current },
      })
    );

    window.dispatchEvent(new CustomEvent("mute-home-showreel"));

    videoRef.current.muted = false;

    try {
      await videoRef.current.play();
      setIsPlaying(true);
      showButtonTemporarily();
    } catch {
      setIsPlaying(false);
      setShowOverlayButton(true);
    }
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      await playVideo();
    } else {
      resetToPausedState();
    }
  };

  useEffect(() => {
    const handlePauseOthers = (
      event: WindowEventMap["pause-home-preview-videos"]
    ) => {
      if (event.detail?.id !== idRef.current) {
        resetToPausedState();
      }
    };

    window.addEventListener("pause-home-preview-videos", handlePauseOthers);

    return () => {
      window.removeEventListener("pause-home-preview-videos", handlePauseOthers);
      clearFadeTimeout();
    };
  }, []);

  useEffect(() => {
    resetToPausedState();
  }, [src]);

  return (
    <div
      className={`group relative overflow-visible rounded-[24px] transition-all duration-500 ${
        isPlaying ? "scale-[1.03]" : "hover:scale-[1.02]"
      }`}
      onClick={togglePlayPause}
    >
      <div
        className={`pointer-events-none absolute -inset-5 z-0 transition-opacity duration-500 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className={`absolute inset-0 rounded-[32px] blur-[42px] ${glowMap[glowTheme]}`} />
      </div>

      <div
        className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-zinc-900 transition-all duration-500 ${
          isPlaying
            ? "shadow-[0_0_50px_rgba(255,255,255,0.06)]"
            : "shadow-[0_0_20px_rgba(255,255,255,0.03)]"
        }`}
      >
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="metadata"
          loop
          className={`relative z-10 aspect-[9/16] w-full object-cover transition duration-500 ${
            isPlaying ? "scale-[1.02]" : "group-hover:scale-[1.03]"
          }`}
        />

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <div
          className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${
            showOverlayButton ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="rounded-full border border-white/20 bg-black/65 p-4 text-white backdrop-blur-md">
            {isPlaying ? (
              <span className="block text-xl leading-none">❚❚</span>
            ) : (
              <span className="block text-xl leading-none">▶</span>
            )}
          </div>
        </div>

        {label ? (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">
              {label}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}