import { onValue, push, ref as dbRef, remove, set, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import type { SectionType, VideoItem } from "@/types/hacker";

export function subscribeToVideos(callback: (items: VideoItem[]) => void) {
  const videosRef = dbRef(rtdb, "videos");

  return onValue(videosRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    const parsed: VideoItem[] = Object.entries(data).map(([id, value]) => ({
      id,
      ...(value as Omit<VideoItem, "id">),
    }));

    callback(parsed);
  });
}

export function getNextOrder(items: VideoItem[], section: SectionType) {
  const sectionItems = items.filter((item) => item.section === section);
  if (!sectionItems.length) return 1;
  return Math.max(...sectionItems.map((item) => Number(item.order || 0))) + 1;
}

export async function saveVideoItem(
  section: SectionType,
  videoUrl: string,
  thumbUrl: string,
  order: number
) {
  const newItemRef = push(dbRef(rtdb, "videos"));
  await set(newItemRef, {
    section,
    videoUrl,
    thumbUrl,
    order,
    createdAt: Date.now(),
  });
}

export async function deleteVideoItem(id: string) {
  await remove(dbRef(rtdb, `videos/${id}`));
}

export async function reorderSectionItems(items: VideoItem[]) {
  const payload: Record<string, number> = {};

  items.forEach((item, index) => {
    payload[`${item.id}/order`] = index + 1;
  });

  await update(dbRef(rtdb, "videos"), payload);
}