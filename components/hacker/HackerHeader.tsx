import type { SectionType, UploadMode } from "@/types/hacker";

type Props = {
  email: string;
  section: SectionType;
  mode: UploadMode;
  onSectionChange: (section: SectionType) => void;
  onModeChange: (mode: UploadMode) => void;
  onLogout: () => void;
};

const sections: SectionType[] = ["trending", "political", "ai", "memes"];

export default function HackerHeader({
  email,
  section,
  mode,
  onSectionChange,
  onModeChange,
  onLogout,
}: Props) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Hacker Panel</h1>
          <p className="text-sm text-black/60">{email}</p>
        </div>

        <button onClick={onLogout} className="rounded-lg border px-3 py-2 text-sm">
          Logout
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {sections.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => onSectionChange(sec)}
            className={`rounded-lg border px-4 py-2 text-sm capitalize ${
              section === sec
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-black/15 bg-white text-black"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onModeChange("single")}
          className={`rounded-lg border px-4 py-2 text-sm ${
            mode === "single"
              ? "border-blue-600 bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
        >
          Single Upload
        </button>

        <button
          type="button"
          onClick={() => onModeChange("bulk")}
          className={`rounded-lg border px-4 py-2 text-sm ${
            mode === "bulk"
              ? "border-blue-600 bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
        >
          Bulk Upload
        </button>
      </div>
    </div>
  );
}