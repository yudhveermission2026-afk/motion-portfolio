"use client";

import type { VideoItem } from "@/types/hacker";

type Props = {
  item: VideoItem;
  index: number;
  dragging: boolean;
  onDelete: () => void;
  onDragStart: () => void;
  onDrop: () => void;
};

export default function UploadedTile({
  item,
  index,
  dragging,
  onDelete,
  onDragStart,
  onDrop,
}: Props) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`flex items-center gap-2 rounded-md border p-2 ${dragging ? "opacity-50" : ""}`}
    >
      <div className="w-6 text-center text-xs font-semibold text-black/70">{index + 1}</div>

      <video
        src={item.videoUrl}
        controls
        playsInline
        className="h-20 w-12 rounded bg-black"
      />

      <button
        type="button"
        onClick={onDelete}
        className="ml-auto rounded border border-red-300 px-2 py-1 text-[10px] text-red-600"
      >
        Delete
      </button>
    </div>
  );
}