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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const thumbSrc = useMemo(() => {
    return src.replace(/\.(mp4|webm|mov|m4v)$/i, ".png");
  }, [src]);

  const glowMap: Record<GlowTheme, string> = {
    pink: "from-pink-300/30 via-fuchsia-300/20 to-rose-300/25",
    blue: "from-sky-300/30 via-cyan-300/20 to-blue-300/25",
    green: "from-emerald-300/30 via-green-300/20 to-teal-300/25",
    orange: "from-amber-300/30 via-orange-300/20 to-yellow-300/25",
  };

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const allHomeVideos = document.querySelectorAll(
        "video[data-home-preview-video='true']"
      );

      allHomeVideos.forEach((node) => {
        const other = node as HTMLVideoElement;
        if (other !== video) {
          other.pause();
        }
      });

      const showreel = document.querySelector(
        "video[data-showreel-video='true']"
      ) as HTMLVideoElement | null;

      if (showreel) {
        showreel.muted = true;
      }

      try {
        video.muted = false;
        await video.play();
      } catch {
        video.muted = true;
        await video.play();
      }

      setIsPlaying(true);
      setShowButton(true);
      setTimeout(() => setShowButton(false), 300);
    } else {
      video.pause();
      setIsPlaying(false);
      setShowButton(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPause = () => {
      setIsPlaying(false);
      setShowButton(true);
    };

    const onPlay = () => {
      setIsPlaying(true);
      setTimeout(() => setShowButton(false), 300);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setShowButton(true);
    };

    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div className="group relative">
      <div
        className={`pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-br opacity-60 blur-2xl transition duration-300 group-hover:opacity-100 ${glowMap[glowTheme]}`}
      />

      <div className="relative overflow-hidden rounded-[26px] border border-black/8 bg-white/68 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
        <div className="relative overflow-hidden rounded-[20px] bg-black">
          <video
            ref={videoRef}
            src={src}
            className={`aspect-[9/16] w-full object-cover transition duration-300 ${
              isPlaying ? "scale-[1.008]" : "scale-100"
            }`}
            preload="none"
            playsInline
            muted
            data-home-preview-video="true"
          />

          {!isPlaying && (
            <img
              src={thumbSrc}
              alt={label}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          )}

          <button
            onClick={handleToggle}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={isPlaying ? "Pause preview video" : "Play preview video"}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur-md transition-all duration-300 ${
                showButton ? "opacity-100 scale-100" : "opacity-0 scale-90"
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
        </div>

        <div className="px-1 pt-2 text-center text-xs font-medium tracking-[0.25em] text-black/55 uppercase">
          {label}
        </div>
      </div>
    </div>
  );
}