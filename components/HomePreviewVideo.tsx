"use client";

import { useEffect, useRef, useState } from "react";

type GlowTheme = "pink" | "blue" | "green" | "orange";

type HomePreviewVideoProps = {
  src: string;
  poster?: string;
  label: string;
  glowTheme?: GlowTheme;
};

export default function HomePreviewVideo({
  src,
  poster,
  label,
  glowTheme = "blue",
}: HomePreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControl, setShowControl] = useState(true);

  const glowMap: Record<GlowTheme, string> = {
    pink: "from-pink-300/30 via-fuchsia-300/20 to-rose-300/25",
    blue: "from-sky-300/30 via-cyan-300/20 to-blue-300/25",
    green: "from-emerald-300/30 via-green-300/20 to-teal-300/25",
    orange: "from-amber-300/30 via-orange-300/20 to-yellow-300/25",
  };

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const startHideTimer = () => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused) {
        setShowControl(false);
      }
    }, 900);
  };

  const pauseOtherPortfolioVideos = () => {
    const videos = document.querySelectorAll(
      "video[data-portfolio-preview='true']"
    );

    videos.forEach((node) => {
      const other = node as HTMLVideoElement;
      if (other !== videoRef.current) {
        other.pause();
      }
    });

    const showreel = document.querySelector(
      "video[data-showreel-video='true']"
    ) as HTMLVideoElement | null;

    if (showreel) {
      showreel.muted = true;
    }
  };

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    setShowControl(true);

    if (video.paused) {
      pauseOtherPortfolioVideos();

      try {
        await video.play();
      } catch {
        return;
      }

      setIsPlaying(true);
      startHideTimer();
    } else {
      video.pause();
      setIsPlaying(false);
      clearHideTimer();
      setShowControl(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setIsPlaying(true);
      setShowControl(true);
      startHideTimer();
    };

    const onPause = () => {
      setIsPlaying(false);
      setShowControl(true);
      clearHideTimer();
    };

    const onEnded = () => {
      setIsPlaying(false);
      setShowControl(true);
      clearHideTimer();
      video.currentTime = 0;
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      clearHideTimer();
    };
  }, []);

  return (
    <div className="group relative tilt-hover" data-cursor="pointer">
      <div
        className={`pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-br opacity-60 blur-2xl transition duration-300 group-hover:opacity-100 ${glowMap[glowTheme]}`}
      />

      <div className="relative overflow-hidden rounded-[26px] border border-black/8 bg-white/68 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
        <div
          onClick={() => void handleToggle()}
          className="relative cursor-pointer overflow-hidden rounded-[20px] bg-black"
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            preload="metadata"
            controls={false}
            data-portfolio-preview="true"
            className="aspect-[9/16] w-full rounded-[20px] object-cover"
            onMouseMove={() => {
              setShowControl(true);
              startHideTimer();
            }}
          />

          <div className="pointer-events-none absolute inset-0 z-10 bg-black/10" />

          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur-md transition-all duration-300 ${
                showControl ? "scale-100 opacity-100" : "scale-90 opacity-0"
              }`}
            >
              {isPlaying ? (
                <div className="flex gap-[4px]">
                  <span className="block h-4 w-[3px] rounded-sm bg-white" />
                  <span className="block h-4 w-[3px] rounded-sm bg-white" />
                </div>
              ) : (
                <div className="ml-[2px] h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-white" />
              )}
            </div>
          </div>
        </div>

        <div className="px-1 pt-2 text-center text-xs font-medium uppercase tracking-[0.25em] text-black/55">
          {label}
        </div>
      </div>
    </div>
  );
}