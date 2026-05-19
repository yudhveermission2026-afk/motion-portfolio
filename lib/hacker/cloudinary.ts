import type { SectionType } from "@/types/hacker";

export const CLOUD_NAME = "dgdyinboq";
export const UPLOAD_PRESET = "madebyankit_upload";

export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const e = error as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    try {
      return JSON.stringify(error);
    } catch {
      return "Unknown error";
    }
  }
  return "Unknown error";
}

export function uploadToCloudinary(
  file: File | Blob,
  resourceType: "video" | "image",
  section: SectionType,
  onProgress?: (progress: number) => void
) {
  return new Promise<string>((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", `madebyankit/${section}`);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable || !onProgress) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress(progress);
    });

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(data);
        }
      } catch (error) {
        reject(error);
      }
    };

    xhr.onerror = () => reject(new Error("Cloudinary upload failed"));
    xhr.send(formData);
  });
}