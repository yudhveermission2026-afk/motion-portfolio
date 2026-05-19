"use client";

import { useMemo, useState } from "react";

type AppKey =
  | "desktop"
  | "premiere"
  | "aftereffects"
  | "photoshop"
  | "capcut"
  | "chatgpt"
  | "gemini"
  | "grok"
  | "kling"
  | "higgsfield"
  | "minimax";

const apps: { key: Exclude<AppKey, "desktop">; label: string; icon: string }[] = [
  { key: "premiere", label: "Premiere", icon: "Pr" },
  { key: "aftereffects", label: "After FX", icon: "Ae" },
  { key: "photoshop", label: "Photoshop", icon: "Ps" },
  { key: "capcut", label: "CapCut", icon: "Cc" },
  { key: "chatgpt", label: "ChatGPT", icon: "Cg" },
  { key: "gemini", label: "Gemini", icon: "Ge" },
  { key: "grok", label: "Grok", icon: "Gr" },
  { key: "kling", label: "Kling", icon: "Kl" },
  { key: "higgsfield", label: "Higgsfield", icon: "Hg" },
  { key: "minimax", label: "MiniMax", icon: "Mx" },
];

const appContent: Record<
  Exclude<AppKey, "desktop">,
  { title: string; lines: string[]; accent: string }
> = {
  premiere: {
    title: "Adobe Premiere Pro",
    lines: ["Timeline ready", "Reels edit", "Fast cuts", "Export queue"],
    accent: "from-violet-400 to-blue-400",
  },
  aftereffects: {
    title: "Adobe After Effects",
    lines: ["Motion graphics", "Text animation", "Compositions", "Preview render"],
    accent: "from-fuchsia-400 to-violet-400",
  },
  photoshop: {
    title: "Adobe Photoshop",
    lines: ["Poster layout", "Thumbnail cleanup", "Masking", "Color polish"],
    accent: "from-sky-400 to-cyan-400",
  },
  capcut: {
    title: "CapCut",
    lines: ["Short-form workflow", "Captions", "Beat sync", "Quick export"],
    accent: "from-zinc-300 to-zinc-500",
  },
  chatgpt: {
    title: "ChatGPT",
    lines: ["Hooks", "Captions", "Ideas", "Script help"],
    accent: "from-emerald-400 to-green-400",
  },
  gemini: {
    title: "Gemini",
    lines: ["Prompt drafting", "Visual ideation", "Quick iteration", "Scene help"],
    accent: "from-sky-400 to-indigo-400",
  },
  grok: {
    title: "Grok",
    lines: ["Video prompts", "Shot flow", "Scene continuity", "Creative assist"],
    accent: "from-zinc-400 to-neutral-600",
  },
  kling: {
    title: "Kling",
    lines: ["AI video setup", "Prompt control", "Motion planning", "Render queue"],
    accent: "from-cyan-400 to-blue-400",
  },
  higgsfield: {
    title: "Higgsfield",
    lines: ["Stylized shots", "Creative framing", "Prompt tuning", "Render tests"],
    accent: "from-lime-400 to-green-400",
  },
  minimax: {
    title: "MiniMax",
    lines: ["Audio ideas", "AI voice flow", "Scene support", "Fast drafts"],
    accent: "from-orange-400 to-rose-400",
  },
};

function ScreenUI({ powerOn }: { powerOn: boolean }) {
  const [openApp, setOpenApp] = useState<AppKey>("desktop");

  const windowAccent = useMemo(() => {
    if (openApp === "desktop") return "from-emerald-400 to-cyan-400";
    return appContent[openApp].accent;
  }, [openApp]);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[16px] bg-[#07150d]"
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className={`absolute inset-0 origin-center transition-all duration-500 ${
          powerOn
            ? "scale-y-100 opacity-100 brightness-100"
            : "scale-y-[0.02] opacity-0 brightness-0"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(85,255,170,.16),rgba(8,24,14,.94)_60%,rgba(5,12,8,.98)_100%)]" />
        <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(to_bottom,rgba(145,255,195,.05)_0px,rgba(145,255,195,.05)_2px,transparent_2px,transparent_6px)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_44%,rgba(0,0,0,.28)_100%)]" />

        {openApp === "desktop" ? (
          <>
            <div className="relative z-20 flex h-8 items-center justify-between border-b border-white/10 bg-white/5 px-4 text-[9px] uppercase tracking-[0.16em] text-[#baffd3]">
              <span>ANKIT OS</span>
              <span>CRT DESKTOP</span>
            </div>

            <div className="relative z-10 h-[calc(100%-2rem)] overflow-y-auto overscroll-contain px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-3 gap-x-3 gap-y-3 pb-4">
                {apps.map((app) => (
                  <button
                    key={app.key}
                    onClick={() => setOpenApp(app.key)}
                    className="group flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-transparent p-1 transition hover:bg-white/5"
                    data-cursor="pointer"
                    type="button"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/10 text-[13px] font-bold text-[#baffd3] shadow-[0_0_16px_rgba(90,255,160,0.12)] transition group-hover:scale-105">
                      {app.icon}
                    </div>

                    <div className="max-w-[70px] truncate text-center text-[9px] leading-tight text-[#baffd3]">
                      {app.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 h-1 w-8 -translate-x-1/2 rounded-full bg-emerald-200/25" />
          </>
        ) : (
          <>
            <div className="relative z-10 flex h-8 items-center justify-between border-b border-white/10 bg-white/5 px-4 text-[8.5px] uppercase tracking-[0.14em] text-[#baffd3]">
              <span className="truncate pr-2">{appContent[openApp].title}</span>

              <button
                onClick={() => setOpenApp("desktop")}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] tracking-[0.12em] text-[#baffd3] transition hover:bg-white/10"
                type="button"
                data-cursor="pointer"
              >
                Back
              </button>
            </div>

            <div className="relative z-10 flex h-[calc(100%-2rem)] flex-col overflow-y-auto overscroll-contain p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid gap-2 pb-4">
                {appContent[openApp].lines.map((line) => (
                  <div
                    key={line}
                    className="rounded-xl border border-emerald-300/10 bg-emerald-300/5 px-3 py-2 text-[11px] text-[#baffd3]"
                  >
                    {line}
                  </div>
                ))}

                <div className="mt-2 rounded-xl border border-emerald-300/10 bg-emerald-300/5 p-3">
                  <div className="mb-2 h-2 w-16 rounded-full bg-emerald-200/25" />
                  <div className="h-2 w-24 rounded-full bg-emerald-200/15" />
                </div>

                <div className="h-2.5 overflow-hidden rounded-full border border-emerald-300/10 bg-emerald-300/10">
                  <div className={`h-full w-[58%] rounded-full bg-gradient-to-r ${windowAccent}`} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-500 ${
          powerOn ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        className={`pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-white shadow-[0_0_20px_rgba(255,255,255,.65)] transition-all duration-500 ${
          powerOn ? "scale-x-0 opacity-0" : "scale-x-100 opacity-70"
        }`}
      />
    </div>
  );
}

function PowerButton({
  powerOn,
  onToggle,
}: {
  powerOn: boolean;
  onToggle: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const handlePress = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setPressed(true);
    onToggle();
  };

  return (
    <button
      type="button"
      aria-label="Toggle PC power"
      data-cursor="pointer"
      onPointerDown={handlePress}
      onPointerUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setPressed(false);
      }}
      onPointerCancel={() => setPressed(false)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }
      }}
      className="absolute right-0 top-0 z-[120] flex h-[88px] w-[88px] cursor-pointer touch-manipulation select-none items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none"
    >
      <span className="absolute inset-0 rounded-full bg-transparent" />

      <span
        className={`relative flex h-[54px] w-[54px] items-center justify-center rounded-full border border-black/10 bg-[#d7cbb8] shadow-[0_10px_18px_rgba(0,0,0,.14),inset_0_2px_0_rgba(255,255,255,.8)] transition ${
          pressed ? "scale-95" : "scale-100"
        }`}
      >
        <span className="relative h-9 w-9 rounded-full border border-black/10 bg-[#cfc2ae] shadow-[inset_0_2px_4px_rgba(0,0,0,.16)]">
          <span
            className={`absolute left-1/2 top-[6px] h-[14px] w-[4px] -translate-x-1/2 rounded-full transition ${
              powerOn
                ? "bg-[#83ff69] shadow-[0_0_12px_rgba(131,255,105,.95)]"
                : "bg-[#7f7a73]"
            }`}
          />

          <span
            className={`absolute left-1/2 top-[10px] h-[19px] w-[24px] -translate-x-1/2 rounded-b-full border-b-[4px] border-l-[4px] border-r-[4px] transition ${
              powerOn
                ? "border-[#83ff69] shadow-[0_0_10px_rgba(131,255,105,.65)]"
                : "border-[#7f7a73]"
            }`}
          />
        </span>
      </span>
    </button>
  );
}

function Keyboard3D() {
  return (
    <div className="relative z-20 mx-auto mt-[-24px] h-[76px] w-[76%] [perspective:1200px]">
      <div className="absolute inset-0 rotate-x-[68deg] rounded-[18px] border border-black/10 bg-[#e8ddcc] shadow-[0_18px_24px_rgba(0,0,0,.08),inset_0_2px_0_rgba(255,255,255,.7)]">
        <div className="absolute inset-x-4 top-3 space-y-1.5">
          {Array.from({ length: 4 }).map((_, row) => (
            <div key={row} className="flex gap-1">
              {Array.from({ length: 12 }).map((__, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-[4px] border border-black/5 shadow-[inset_0_1px_0_rgba(255,255,255,.7)] ${
                    row === 0 || i > 9 ? "w-4 bg-[#8b8378]" : "w-4 bg-[#efe7da]"
                  }`}
                />
              ))}
            </div>
          ))}

          <div className="flex gap-1">
            <div className="h-2 w-8 rounded-[4px] border border-black/5 bg-[#efe7da]" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-2 w-4 rounded-[4px] border border-black/5 bg-[#efe7da]" />
            ))}
            <div className="h-2 flex-1 rounded-[4px] border border-black/5 bg-[#8b8378]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CpuTower3D({ powerOn, onToggle }: { powerOn: boolean; onToggle: () => void }) {
  return (
    <div className="relative z-10 mx-auto mt-[-30px] h-[108px] w-[68%] max-w-[390px]">
      <div className="absolute inset-0 rounded-[22px] border border-black/10 bg-[#e4d8c6] shadow-[0_18px_24px_rgba(0,0,0,.08),inset_0_2px_0_rgba(255,255,255,.75)]">
        <div className="absolute inset-x-5 top-3 h-2 rounded-full bg-white/35 blur-sm" />

        <div className="absolute left-7 top-9 flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-[4px] rounded-full bg-[#90887d]" />
          ))}
        </div>

        <div className="absolute right-[84px] top-8 h-[54px] w-[95px] rounded-[13px] border border-black/5 bg-[#d8ccba] p-2.5">
          <div className="mb-2 h-3.5 rounded-md bg-[#f0e8db]" />
          <div className="h-5 rounded-md bg-[#ede4d8]" />
        </div>

        <div className="absolute bottom-4 left-8 h-2 w-20 rounded-full bg-black/10" />

        <PowerButton powerOn={powerOn} onToggle={onToggle} />
      </div>
    </div>
  );
}

function Monitor3D({ powerOn }: { powerOn: boolean }) {
  return (
    <div className="relative z-30 mx-auto h-[430px] w-full [perspective:1600px]">
      <div className="absolute left-1/2 top-[355px] h-4 w-36 -translate-x-1/2 rounded-full bg-black/10 blur-xl" />

      <div className="absolute left-1/2 top-[326px] h-[86px] w-12 -translate-x-1/2 rounded-b-[16px] rounded-t-[8px] bg-[#ddd2c1] shadow-[inset_0_2px_0_rgba(255,255,255,.45)]" />

      <div className="absolute left-1/2 top-[378px] h-8 w-44 -translate-x-1/2 rounded-[16px] bg-[#ddd2c1] shadow-[0_10px_18px_rgba(0,0,0,.08)]" />

      <div className="absolute left-1/2 top-0 h-[350px] w-[min(92vw,440px)] -translate-x-1/2 rounded-[34px] border border-black/10 bg-[#e7dece] shadow-[0_18px_32px_rgba(0,0,0,.08),inset_0_2px_0_rgba(255,255,255,.75)]">
        <div className="absolute inset-x-4 top-3 h-5 rounded-full bg-white/35 blur-md" />

        <div className="absolute left-1/2 top-[22px] h-[286px] w-[min(78vw,360px)] -translate-x-1/2 rounded-[24px] border border-black/10 bg-[#d7ccbc] p-3 shadow-[inset_0_4px_12px_rgba(0,0,0,.12)]">
          <div className="h-full w-full overflow-hidden rounded-[16px] border border-emerald-300/15 shadow-[0_0_26px_rgba(80,255,160,.2)]">
            <ScreenUI powerOn={powerOn} />
          </div>
        </div>

        <div className="absolute bottom-5 left-8 h-3 w-14 rounded-full bg-black/10" />

        <div
          className={`absolute bottom-5 right-10 h-2.5 w-4 rounded-sm transition ${
            powerOn
              ? "bg-[#95ff73] shadow-[0_0_12px_rgba(149,255,115,.65)]"
              : "bg-[#8b7c62]"
          }`}
        />

        <div className="absolute bottom-5 right-5 h-2 w-3 rounded-sm bg-[#b8a37e]" />
      </div>
    </div>
  );
}

export default function HeroScene() {
  const [powerOn, setPowerOn] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div className="relative flex h-[545px] w-full items-center justify-center overflow-visible md:h-[625px]">
      <div
        className="relative w-full max-w-[760px] [perspective:1600px]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          setTilt({ x, y });
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.y * -5}deg) rotateY(${tilt.x * -7}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-8 h-[330px] w-[420px] -translate-x-1/2 rounded-[48px] bg-[radial-gradient(circle_at_50%_35%,rgba(111,255,186,.16),rgba(255,255,255,0)_62%)] blur-3xl" />

          <Monitor3D powerOn={powerOn} />
          <CpuTower3D powerOn={powerOn} onToggle={() => setPowerOn((v) => !v)} />
          <Keyboard3D />
        </div>
      </div>
    </div>
  );
}