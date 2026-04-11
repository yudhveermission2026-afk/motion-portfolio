import fs from "fs";
import path from "path";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

function naturalSort(a: string, b: string) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function getProjectVideos(section: string): string[] {
  const dirPath = path.join(process.cwd(), "public", "projects", section);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath);

  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return VIDEO_EXTENSIONS.includes(ext);
    })
    .sort(naturalSort)
    .map((file) => `/projects/${section}/${file}`);
}