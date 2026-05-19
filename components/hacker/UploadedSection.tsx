"use client";

import { useMemo } from "react";
import type { SectionType, VideoItem } from "@/types/hacker";
import UploadedTile from "@/components/hacker/UploadedTile";

type Props = {
  title: SectionType;
  items: VideoItem[];
  draggingId: string;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDropOnItem: (targetId: string) => void;
};

export default function UploadedSection({
  title,
  items,
  draggingId,
  onDelete,
  onDragStart,
  onDropOnItem,
}: Props) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold capitalize">{title}</h2>
        <span className="rounded-full bg-black/5 px-2 py-1 text-xs text-black/60">
          {sorted.length}
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-black/50">No uploads yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sorted.map((item, index) => (
            <div key={item.id} className="w-[108px]">
              <UploadedTile
                item={item}
                index={index}
                dragging={draggingId === item.id}
                onDelete={() => onDelete(item.id)}
                onDragStart={() => onDragStart(item.id)}
                onDrop={() => onDropOnItem(item.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}