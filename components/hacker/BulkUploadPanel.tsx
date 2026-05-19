"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { captureFrameFromVideoElement, formatTime } from "@/lib/hacker/frame-capture";
import type { BulkVideoItem } from "@/types/hacker";

type Props = {
  uploading: boolean;
  totalProgress: number;
  statusText: string;
  onUpload: (items: BulkVideoItem[]) => Promise<void>;
};

export default function BulkUploadPanel({
  uploading,
  totalProgress,
  statusText,
  onUpload,
}: Props) {
  const [bulkVideos, setBulkVideos] = useState<BulkVideoItem[]>([]);
  const [selectedBulkId, setSelectedBulkId] = useState("");
  const [bulkEditorDuration, setBulkEditorDuration] = useState(0);
  const [bulkSeekTime, setBulkSeekTime] = useState(0);

  const bulkPreviewVideoRef = useRef<HTMLVideoElement | null>(null);
  const bulkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bulkInputRef = useRef<HTMLInputElement | null>(null);
  const seekRequestIdRef = useRef(0);

  const cleanupUrlsRef = useRef<string[]>([]);

  const selectedBulkItem = useMemo(
    () => bulkVideos.find((v) => v.id === selectedBulkId) || null,
    [bulkVideos, selectedBulkId]
  );

  useEffect(() => {
    return () => {
      cleanupUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
      cleanupUrlsRef.current = [];
    };
  }, []);

  const trackUrl = (url: string) => {
    if (!cleanupUrlsRef.current.includes(url)) {
      cleanupUrlsRef.current.push(url);
    }
  };

  const makeObjectUrl = (blob: Blob | File) => {
    const url = URL.createObjectURL(blob);
    trackUrl(url);
    return url;
  };

  const clearBulkState = (clearInput = true) => {
    setBulkVideos([]);
    setSelectedBulkId("");
    setBulkEditorDuration(0);
    setBulkSeekTime(0);
    seekRequestIdRef.current = 0;

    if (clearInput && bulkInputRef.current) {
      bulkInputRef.current.value = "";
    }
  };

  const handleBulkVideosChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const pickedFiles = Array.from(files);
    const acceptedExtensions = [".mp4", ".mov", ".webm", ".m4v"];

    const validFiles = pickedFiles.filter((file) => {
      const name = file.name.toLowerCase();
      return acceptedExtensions.some((ext) => name.endsWith(ext));
    });

    if (validFiles.length === 0) {
      alert("Valid video files select kar. MP4/MOV/WEBM/M4V use kar.");
      return;
    }

    clearBulkState(false);

    const nextItems: BulkVideoItem[] = validFiles.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      file,
      name: file.name,
      previewUrl: makeObjectUrl(file),
      savedThumbBlob: null,
      savedThumbPreviewUrl: "",
    }));

    setBulkVideos(nextItems);
    setSelectedBulkId(nextItems[0].id);
    setBulkEditorDuration(0);
    setBulkSeekTime(0);
    seekRequestIdRef.current = 0;
  };

  const updateSelectedThumb = (blob: Blob, previewUrl: string) => {
    setBulkVideos((prev) =>
      prev.map((item) => {
        if (item.id !== selectedBulkId) return item;

        return {
          ...item,
          savedThumbBlob: blob,
          savedThumbPreviewUrl: previewUrl,
        };
      })
    );
  };

  const captureCurrentFrame = async (requestId: number) => {
    const videoEl = bulkPreviewVideoRef.current;
    const canvas = bulkCanvasRef.current;
    if (!videoEl || !canvas) return;
    if (requestId !== seekRequestIdRef.current) return;

    const blob = await captureFrameFromVideoElement(videoEl, canvas);
    if (requestId !== seekRequestIdRef.current) return;

    const previewUrl = makeObjectUrl(blob);
    updateSelectedThumb(blob, previewUrl);
  };

  const seekAndCapture = async (time: number) => {
    const videoEl = bulkPreviewVideoRef.current;
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

  const handleBulkVideoLoadedMetadata = async () => {
    const videoEl = bulkPreviewVideoRef.current;
    if (!videoEl) return;

    const duration = videoEl.duration || 0;
    setBulkEditorDuration(duration);

    const startTime = Math.min(0.1, Math.max(duration - 0.1, 0));
    setBulkSeekTime(startTime);

    try {
      await seekAndCapture(startTime);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkSeekChange = async (value: number) => {
    setBulkSeekTime(value);

    try {
      await seekAndCapture(value);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectVideo = (id: string) => {
    setSelectedBulkId(id);
    setBulkEditorDuration(0);
    setBulkSeekTime(0);
    seekRequestIdRef.current = 0;
  };

  const handleUploadClick = async () => {
    if (bulkVideos.length === 0) {
      alert("Bulk videos select kar.");
      return;
    }

    await onUpload(bulkVideos);
    clearBulkState();
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          ref={bulkInputRef}
          id="bulk-video-upload"
          type="file"
          accept=".mp4,.mov,.webm,.m4v,video/mp4,video/quicktime,video/webm,video/x-m4v"
          multiple
          onChange={(e) => handleBulkVideosChange(e.target.files)}
          className="block w-full rounded-lg border px-3 py-2 text-sm"
        />

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Bulk Upload"}
        </button>
      </div>

      <div className="mb-3 flex items-center gap-3 text-xs text-black/60">
        <span>Videos: {bulkVideos.length}</span>
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

      <div className="grid gap-4 lg:grid-cols-[235px_190px_1fr]">
        <div className="rounded-lg border p-3">
          <h2 className="mb-2 text-sm font-semibold">Bulk Preview</h2>

          {selectedBulkItem ? (
            <>
              <video
                key={selectedBulkItem.id}
                ref={bulkPreviewVideoRef}
                src={selectedBulkItem.previewUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-lg bg-black"
                onLoadedMetadata={handleBulkVideoLoadedMetadata}
              />

              {bulkEditorDuration > 0 && (
                <div className="mt-3">
                  <input
                    type="range"
                    min={0}
                    max={bulkEditorDuration}
                    step={0.1}
                    value={bulkSeekTime}
                    onChange={(e) => handleBulkSeekChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-1 text-xs text-black/60">{formatTime(bulkSeekTime)}</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-[180px] items-center justify-center rounded-lg border border-dashed text-center text-xs text-black/45">
              Select a video
            </div>
          )}

          <canvas ref={bulkCanvasRef} className="hidden" />
        </div>

        <div className="rounded-lg border p-3">
          <h2 className="mb-2 text-sm font-semibold">Thumb Preview</h2>

          {selectedBulkItem?.savedThumbPreviewUrl ? (
            <img
              src={selectedBulkItem.savedThumbPreviewUrl}
              alt="Bulk thumb preview"
              className="h-[180px] w-full rounded-lg border object-contain"
            />
          ) : (
            <div className="flex h-[180px] items-center justify-center rounded-lg border border-dashed text-center text-xs text-black/45">
              Frame choose kar
            </div>
          )}
        </div>

        <div className="rounded-lg border p-3">
          <h2 className="mb-2 text-sm font-semibold">Bulk Video List</h2>

          <div className="max-h-[300px] space-y-2 overflow-auto pr-1">
            {bulkVideos.length === 0 ? (
              <p className="text-sm text-black/50">No bulk videos selected.</p>
            ) : (
              bulkVideos.map((item) => {
                const isSelected = item.id === selectedBulkId;
                const isSaved = !!item.savedThumbBlob;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectVideo(item.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-black/10 bg-white"
                    }`}
                  >
                    <span className="truncate pr-3">{item.name}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${
                        isSaved
                          ? "bg-green-100 text-green-700"
                          : "bg-black/5 text-black/60"
                      }`}
                    >
                      {isSaved ? "Saved" : "Auto"}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}