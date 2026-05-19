"use client";

import { useEffect, useState } from "react";
import SectionVideoGrid from "@/components/site/SectionVideoGrid";
import { subscribeSectionVideos } from "@/lib/site/videos";
import type { SectionType, VideoItem } from "@/types/hacker";

type Props = {
  section: SectionType;
  title: string;
  initialItems: VideoItem[];
};

export default function SectionPageClient({
  section,
  title,
  initialItems,
}: Props) {
  const [items, setItems] = useState<VideoItem[]>(initialItems);

  useEffect(() => {
    const unsub = subscribeSectionVideos(section, setItems);
    return () => unsub();
  }, [section]);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <SectionVideoGrid
          title={title}
          section={section}
          items={items}
          showMoreLink={false}
        />
      </div>
    </main>
  );
}