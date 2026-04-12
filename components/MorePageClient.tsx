"use client";

import { useEffect, useState } from "react";
import MorePageTemplate from "./MorePageTemplate";

type Manifest = {
  trending?: string[];
  political?: string[];
  ai?: string[];
  memes?: string[];
};

export default function MorePageClient({
  section,
  title,
  badge,
  pillClass,
  glowClass,
}: {
  section: keyof Manifest;
  title: string;
  badge: string;
  pillClass: string;
  glowClass: string;
}) {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const res = await fetch("/projects/manifest.json", {
          cache: "no-store",
        });
        const data: Manifest = await res.json();
        setVideos(data[section] || []);
      } catch (error) {
        console.error("Failed to load manifest:", error);
        setVideos([]);
      }
    };

    loadManifest();
  }, [section]);

  return (
    <MorePageTemplate
      title={title}
      badge={badge}
      pillClass={pillClass}
      glowClass={glowClass}
      videos={videos}
    />
  );
}