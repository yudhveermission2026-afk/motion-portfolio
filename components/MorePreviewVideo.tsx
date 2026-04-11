"use client";

import { useRef, useState, useEffect, useMemo } from "react";

export default function MorePreviewVideo({
  src,
}: {
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);

  // 🔥 PNG thumbnail auto generate (same name)
  const posterSrc = useMemo(() => {
    return src.replace(/\.(mp4|webm|mov)$/i, ".png");
  }, [src]);

  // 👉 autoplay only when clicked (performance fix)
  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);

      // fade out button
      setTimeout(() => setShowButton(false), 300);
    } else {
      video.pause();
      setIsPlaying(false);
      setShowButton(true);
    }
  };

  // 👉 ensure only 1 video plays
  useEffect(() => {
    const handleGlobalPause = (e: any) => {
      if (videoRef.current && videoRef.current !== e.detail) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowButton(true);
      }
    };

    window.addEventListener("pause-other-videos", handleGlobalPause);
    return () =>
      window.removeEventListener("pause-other-videos", handleGlobalPause);
  }, []);

  const handlePlay = () => {
    window.dispatchEvent(
      new CustomEvent("pause-other-videos", { detail: videoRef.current })
    );
  };

  return (
    <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden bg-black">
      
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={src}
        poster={posterSrc} // ✅ FIXED BLACK FRAME
        className="w-full h-full object-cover"
        preload="metadata"
        playsInline
        muted
        onPlay={handlePlay}
      />

      {/* PLAY BUTTON */}
      <button
        onClick={handleToggle}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          showButton ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20">
          <svg
            className="w-6 h-6 text-white"
            fill="white"
            viewBox="0 0 24 24"
          >
            {isPlaying ? (
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            ) : (
              <path d="M5 3l14 9-14 9V3z" />
            )}
          </svg>
        </div>
      </button>
    </div>
  );
}