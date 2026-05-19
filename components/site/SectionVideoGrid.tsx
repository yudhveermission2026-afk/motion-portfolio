import Link from "next/link";
import type { SectionType, VideoItem } from "@/types/hacker";

type Props = {
  title: string;
  section: SectionType;
  items: VideoItem[];
  showMoreLink?: boolean;
};

export default function SectionVideoGrid({
  title,
  section,
  items,
  showMoreLink = true,
}: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

        {showMoreLink && (
          <Link
            href={`/${section}`}
            className="rounded-full border px-4 py-2 text-sm transition hover:bg-black hover:text-white"
          >
            More
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border p-6 text-sm text-black/50">
          No videos yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-white"
            >
              <div className="aspect-[9/16] bg-black">
                <video
                  src={item.videoUrl}
                  poster={item.thumbUrl}
                  preload="metadata"
                  playsInline
                  controls
                  className="h-full w-full object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}