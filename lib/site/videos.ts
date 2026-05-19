import { get, onValue, ref as dbRef } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import type { SectionType, VideoItem } from "@/types/hacker";

const validSections: SectionType[] = ["trending", "political", "ai", "memes"];

function normalizeItems(data: unknown): VideoItem[] {
  if (!data || typeof data !== "object") return [];

  return Object.entries(data as Record<string, Omit<VideoItem, "id">>)
    .map(([id, value]) => ({
      id,
      ...value,
    }))
    .filter((item) => validSections.includes(item.section));
}

function sortByOrder(items: VideoItem[]) {
  return [...items].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export async function fetchAllVideos(): Promise<VideoItem[]> {
  const snapshot = await get(dbRef(rtdb, "videos"));
  const data = snapshot.val();

  return sortByOrder(normalizeItems(data));
}

export async function fetchHomeSections(): Promise<Record<SectionType, VideoItem[]>> {
  const all = await fetchAllVideos();

  const grouped: Record<SectionType, VideoItem[]> = {
    trending: [],
    political: [],
    ai: [],
    memes: [],
  };

  all.forEach((item) => {
    grouped[item.section].push(item);
  });

  (Object.keys(grouped) as SectionType[]).forEach((key) => {
    grouped[key] = sortByOrder(grouped[key]);
  });

  return grouped;
}

export async function fetchSectionVideos(section: SectionType): Promise<VideoItem[]> {
  const all = await fetchAllVideos();

  return sortByOrder(all.filter((item) => item.section === section));
}

export function subscribeSectionVideos(
  section: SectionType,
  callback: (items: VideoItem[]) => void
) {
  return onValue(dbRef(rtdb, "videos"), (snapshot) => {
    const data = snapshot.val();
    const all = normalizeItems(data);

    callback(sortByOrder(all.filter((item) => item.section === section)));
  });
}