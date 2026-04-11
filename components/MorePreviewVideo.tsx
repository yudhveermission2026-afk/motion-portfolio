"use client";

import { useRef, useState, useEffect, useMemo } from "react";

export default function MorePreviewVideo({
  src,
  label,
}: {
  src: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const posterSrc = useMemo(() => {
    return src.replace(/\.(mp4|webm|mov|m4v)$/i, ".png");
  }, [src]);

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const allVideos = document.querySelectorAll(
        "video[data-more-preview-video='true']"
      );

      allVideos.forEach((node) => {
        const other = node as HTMLVideoElement;
        if (other !== video) {
          other.pause();
        }
      });

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
    <div className="group">
      <div className="relative overflow-hidden rounded-[20px] border border-black/8 bg-white/70 p-2 shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
        <div className="relative overflow-hidden rounded-[16px] bg-black">
          <video
            ref={videoRef}
            src={src}
            poster={posterSrc}
            className="aspect-[9/16] w-full object-cover"
            preload="metadata"
            playsInline
            muted
            data-more-preview-video="true"
          />

          <button
            onClick={handleToggle}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-md transition-all duration-300 ${
                showButton ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              {isPlaying ? (
                <div className="flex gap-[4px]">
                  <span className="block h-4 w-[3px] rounded-sm bg-white" />
                  <span className="block h-4 w-[3px] rounded-sm bg-white" />
                </div>
              ) : (
                <div className="ml-[2px] h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-white" />
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="px-1 pt-2 text-center text-xs font-medium text-black/60">
        {label}
      </div>
    </div>
  );
}