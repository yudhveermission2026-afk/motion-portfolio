"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type GlowTheme = "pink" | "blue" | "green" | "orange";

type HomePreviewVideoProps = {
  src: string;
  label: string;
  glowTheme?: GlowTheme;
};

export default function HomePreviewVideo({
  src,
  label,
  glowTheme = "blue",
}: HomePreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControl, setShowControl] = useState(true);

  const posterSrc = useMemo(() => {
    return src.replace(/\.(mp4|webm|mov|m4v)$/i, ".png");
  }, [src]);

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
      if (videoRef.current && !videoRef.current.paused) {
        setShowControl(false);
      }
    }, 900);
  };

  const showControlsBriefly = () => {
    setShowControl(true);
    startHideTimer();
  };

  const pauseAllHomeVideos = () => {
    const allHomeVideos = document.querySelectorAll(
      "video[data-home-preview-video='true']"
    );

    allHomeVideos.forEach((node) => {
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

  const playLoadedVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    pauseAllHomeVideos();
    video.muted = false;

    try {
      await video.play();
      setIsPlaying(true);
      startHideTimer();
    } catch {
      video.muted = true;
      await video.play();
      setIsPlaying(true);
      startHideTimer();
    }
  };

  const toggleVideo = async () => {
    const video = videoRef.current;
    setShowControl(true);

    if (!isLoaded) {
      setIsLoaded(true);
      return;
    }

    if (!video) return;

    if (video.paused) {
      await playLoadedVideo();
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControl(true);
      clearHideTimer();
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    playLoadedVideo();
  }, [isLoaded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      startHideTimer();
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowControl(true);
      clearHideTimer();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControl(true);
      clearHideTimer();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      clearHideTimer();
    };
  }, [isLoaded]);

  return (
    <div className="group relative">
      <div
        className={`pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-br opacity-60 blur-2xl transition duration-300 group-hover:opacity-100 ${glowMap[glowTheme]}`}
      />

      <div className="relative overflow-hidden rounded-[26px] border border-black/8 bg-white/68 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
        <div className="relative overflow-hidden rounded-[20px] bg-black">
          {!isLoaded ? (
            <button
              type="button"
              onClick={toggleVideo}
              className="relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-[20px] bg-black"
              aria-label="Play preview video"
            >
              <img
                src={posterSrc}
                alt={label}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/10" />

              <div className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur-md transition duration-300 group-hover:scale-105">
                <div className="ml-[3px] h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-white" />
              </div>
            </button>
          ) : (
            <>
              <video
                ref={videoRef}
                src={src}
                poster={posterSrc}
                playsInline
                preload="none"
                controls={false}
                data-home-preview-video="true"
                className={`relative z-10 aspect-[9/16] w-full rounded-[20px] object-cover transition duration-300 ${
                  isPlaying ? "scale-[1.008]" : "scale-100"
                }`}
                onClick={toggleVideo}
                onMouseMove={showControlsBriefly}
                onMouseEnter={() => setShowControl(true)}
              />

              <button
                type="button"
                onClick={toggleVideo}
                className="absolute inset-0 z-20 flex items-center justify-center"
                aria-label={isPlaying ? "Pause preview video" : "Play preview video"}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur-md transition-all duration-300 ${
                    showControl
                      ? "opacity-100 scale-100"
                      : "pointer-events-none opacity-0 scale-90"
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
              </button>
            </>
          )}
        </div>

        <div className="px-1 pt-2 text-center text-xs font-medium tracking-[0.25em] text-black/55 uppercase">
          {label}
        </div>
      </div>
    </div>
  );
}