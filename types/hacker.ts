export type SectionType = "trending" | "political" | "ai" | "memes";
export type UploadMode = "single" | "bulk";

export type VideoItem = {
  id: string;
  section: SectionType;
  videoUrl: string;
  thumbUrl: string;
  order: number;
  createdAt: number;
};

export type BulkVideoItem = {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  savedThumbBlob: Blob | null;
  savedThumbPreviewUrl: string;
};