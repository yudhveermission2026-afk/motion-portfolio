"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function MorePreviewVideo({
  src,
  label,
}: {
  src: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControl, setShowControl] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  const previewSrc = useMemo(() => {
    return src.replace(/\.(mp4|webm|mov|m4v)$/i, ".png");
  }, [src]);

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

  const pauseOtherVideos = () => {
    const videos = document.querySelectorAll(
      "video[data-portfolio-preview='true']"
    );

    videos.forEach((node) => {
      const other = node as HTMLVideoElement;
      if (other !== videoRef.current) {
        other.pause();
      }
    });
  };

  const playVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    pauseOtherVideos();

    try {
      video.muted = false;
      await video.play();
    } catch {
      video.muted = true;
      await video.play();
    }

    setIsPlaying(true);
    setShowControl(true);
    startHideTimer();
  };

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (!started) {
      setStarted(true);
      requestAnimationFrame(() => {
        void playVideo();
      });
      return;
    }

    if (video.paused) {
      await playVideo();
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControl(true);
      clearHideTimer();
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
      setStarted(false);
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
  }, [started]);

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-[20px] border border-black/8 bg-white/70 p-2 shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={() => void handleToggle()}
          className="relative block w-full overflow-hidden rounded-[16px] bg-black text-left"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <video
            ref={videoRef}
            src={src}
            poster={previewSrc}
            playsInline
            preload="metadata"
            muted
            controls={false}
            data-portfolio-preview="true"
            className="aspect-[9/16] w-full rounded-[16px] object-cover"
            onMouseMove={() => {
              setShowControl(true);
              startHideTimer();
            }}
          />

          {!started && (
            <img
              src={previewSrc}
              alt={label}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-black/10" />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md transition-all duration-300 ${
                showControl ? "opacity-100 scale-100" : "opacity-0 scale-90"
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
          </div>
        </button>
      </div>

      <div className="px-1 pt-2 text-center text-xs font-medium text-black/60">
        {label}
      </div>
    </div>
  );
}