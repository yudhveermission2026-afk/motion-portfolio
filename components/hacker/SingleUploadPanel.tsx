"use client";

import { useEffect, useRef, useState } from "react";
import { captureFrameFromVideoElement, formatTime } from "@/lib/hacker/frame-capture";
import type { SectionType } from "@/types/hacker";

type Props = {
  section: SectionType;
  uploading: boolean;
  totalProgress: number;
  statusText: string;
  onUpload: (data: {
    video: File;
    thumb: File | Blob;
  }) => Promise<void>;
};

export default function SingleUploadPanel({
  uploading,
  totalProgress,
  statusText,
  onUpload,
}: Props) {
  const [video, setVideo] = useState<File | null>(null);
  const [manualThumb, setManualThumb] = useState<File | null>(null);

  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [manualThumbPreviewUrl, setManualThumbPreviewUrl] = useState("");
  const [autoThumbPreviewUrl, setAutoThumbPreviewUrl] = useState("");
  const [autoThumbBlob, setAutoThumbBlob] = useState<Blob | null>(null);

  const [videoDuration, setVideoDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);

  const manualThumbInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seekRequestIdRef = useRef(0);

  const activeThumbPreview = manualThumbPreviewUrl || autoThumbPreviewUrl;

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      if (manualThumbPreviewUrl) URL.revokeObjectURL(manualThumbPreviewUrl);
      if (autoThumbPreviewUrl) URL.revokeObjectURL(autoThumbPreviewUrl);
    };
  }, []);

  const handleVideoChange = (file: File | null) => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (manualThumbPreviewUrl) URL.revokeObjectURL(manualThumbPreviewUrl);
    if (autoThumbPreviewUrl) URL.revokeObjectURL(autoThumbPreviewUrl);

    setVideo(file);
    setManualThumb(null);
    setManualThumbPreviewUrl("");
    setAutoThumbBlob(null);
    setAutoThumbPreviewUrl("");
    setVideoDuration(0);
    setSeekTime(0);

    if (file) {
      setVideoPreviewUrl(URL.createObjectURL(file));
    } else {
      setVideoPreviewUrl("");
    }
  };

  const handleThumbChange = (file: File | null) => {
    if (manualThumbPreviewUrl) URL.revokeObjectURL(manualThumbPreviewUrl);

    setManualThumb(file);
    if (file) {
      setManualThumbPreviewUrl(URL.createObjectURL(file));
    } else {
      setManualThumbPreviewUrl("");
    }
  };

  const removeManualThumb = () => {
    if (manualThumbPreviewUrl) URL.revokeObjectURL(manualThumbPreviewUrl);
    setManualThumb(null);
    setManualThumbPreviewUrl("");

    const input = document.getElementById("thumb-upload") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const captureCurrentFrame = async (requestId: number) => {
    const videoEl = videoRef.current;
    const canvas = canvasRef.current;
    if (!videoEl || !canvas) return;

    const blob = await captureFrameFromVideoElement(videoEl, canvas);
    if (requestId !== seekRequestIdRef.current) return;

    if (autoThumbPreviewUrl) URL.revokeObjectURL(autoThumbPreviewUrl);
    setAutoThumbBlob(blob);
    setAutoThumbPreviewUrl(URL.createObjectURL(blob));
  };

  const seekAndCapture = async (time: number) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const requestId = ++seekRequestIdRef.current;

    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        videoEl.onseeked = null;
        videoEl.onerror = null;
      };

      videoEl.onseeked = () => {
        cleanup();
        resolve();
      };

      videoEl.onerror = () => {
        cleanup();
        reject(new Error("Seek failed"));
      };

      videoEl.currentTime = time;
    });

    await captureCurrentFrame(requestId);
  };

  const handleLoadedMetadata = async () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const duration = videoEl.duration || 0;
    setVideoDuration(duration);

    const firstFrameTime = Math.min(0.1, Math.max(duration - 0.1, 0));
    setSeekTime(firstFrameTime);

    try {
      await seekAndCapture(firstFrameTime);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSliderChange = async (value: number) => {
    setSeekTime(value);
    try {
      await seekAndCapture(value);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadClick = async () => {
    if (!video) {
      alert("Video select kar.");
      return;
    }

    const finalThumb = manualThumb || autoThumbBlob;
    if (!finalThumb) {
      alert("Thumb select kar.");
      return;
    }

    await onUpload({ video, thumb: finalThumb });
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
          className="block w-full rounded-lg border px-3 py-2 text-sm"
        />

        <input
          ref={manualThumbInputRef}
          id="thumb-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleThumbChange(e.target.files?.[0] || null)}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => manualThumbInputRef.current?.click()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
        >
          Add Thumb Manually
        </button>

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="mb-3 flex items-center gap-3 text-xs text-black/60">
        {video && <span>Video: {video.name}</span>}
        {manualThumb && <span>Manual thumb added</span>}
        {(uploading || statusText) && <span>{statusText}</span>}
        {(uploading || totalProgress > 0) && <span>{totalProgress}%</span>}
      </div>

      {(uploading || totalProgress > 0) && (
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-black transition-all"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[205px_175px]">
        <div className="rounded-lg border p-3">
          <h2 className="mb-2 text-sm font-semibold">Video Preview</h2>

          {videoPreviewUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoPreviewUrl}
                controls
                playsInline
                className="w-full rounded-lg bg-black"
                onLoadedMetadata={handleLoadedMetadata}
              />

              {videoDuration > 0 && (
                <div className="mt-3">
                  <input
                    type="range"
                    min={0}
                    max={videoDuration}
                    step={0.1}
                    value={seekTime}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-1 text-xs text-black/60">{formatTime(seekTime)}</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-[150px] items-center justify-center rounded-lg border border-dashed text-center text-xs text-black/45">
              No video
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="rounded-lg border p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Thumb Preview</h2>

            {manualThumbPreviewUrl && (
              <button
                type="button"
                onClick={removeManualThumb}
                className="rounded-full border border-red-200 px-2 py-1 text-xs text-red-600"
                title="Remove manual thumbnail"
              >
                🗑
              </button>
            )}
          </div>

          {activeThumbPreview ? (
            <img
              src={activeThumbPreview}
              alt="Thumb preview"
              className="h-[160px] w-full rounded-lg border object-contain"
            />
          ) : (
            <div className="flex h-[160px] items-center justify-center rounded-lg border border-dashed text-center text-xs text-black/45">
              Manual ya slider thumb
            </div>
          )}

          <p className="mt-2 text-xs text-black/55">
            Manual thumb ho to wahi use hogi, warna slider wali.
          </p>
        </div>
      </div>
    </div>
  );
}