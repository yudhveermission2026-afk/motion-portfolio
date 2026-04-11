"use client";

import { useEffect, useRef, useState } from "react";

type MorePreviewVideoProps = {
  src: string;
  label: string;
};

export default function MorePreviewVideo({
  src,
  label,
}: MorePreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControl, setShowControl] = useState(true);

  const startHideTimer = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

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

  const pauseAllOtherVideos = () => {
    const allVideos = document.querySelectorAll(
      "video[data-more-preview-video='true']"
    );

    allVideos.forEach((node) => {
      const other = node as HTMLVideoElement;
      if (other !== videoRef.current) {
        other.pause();
      }
    });
  };

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    setShowControl(true);

    if (video.paused) {
      pauseAllOtherVideos();
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
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControl(true);
    }
  };

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
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControl(true);
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-black/8 bg-white/55 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.75)]">
      <div className="relative overflow-hidden rounded-[22px] bg-black">
        <div
          className={`pointer-events-none absolute inset-0 z-0 rounded-[22px] opacity-0 blur-3xl transition duration-300 ${
            isPlaying ? "opacity-100" : "opacity-0"
          } bg-gradient-to-br from-pink-300/20 via-sky-300/20 to-amber-300/20`}
        />

        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="metadata"
          controls={false}
          data-more-preview-video="true"
          className={`relative z-10 aspect-[9/16] w-full rounded-[22px] object-cover transition duration-300 ${
            isPlaying ? "scale-[1.02]" : "scale-100"
          }`}
          onClick={toggleVideo}
          onMouseMove={showControlsBriefly}
          onMouseEnter={() => setShowControl(true)}
        />

        <button
          type="button"
          onClick={toggleVideo}
          className="absolute inset-0 z-20 flex items-center justify-center"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur-md transition-all duration-300 ${
              showControl
                ? "opacity-100 scale-100"
                : "pointer-events-none opacity-0 scale-90"
            }`}
          >
            {isPlaying ? (
              <div className="flex gap-[5px]">
                <span className="block h-5 w-[4px] rounded-sm bg-white" />
                <span className="block h-5 w-[4px] rounded-sm bg-white" />
              </div>
            ) : (
              <div
                className="ml-[3px] h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white"
              />
            )}
          </div>
        </button>
      </div>

      <div className="px-2 pb-1 pt-3 text-center text-sm font-medium text-black/65">
        {label}
      </div>
    </div>
  );
}