"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import HomePreviewVideo from "../components/HomePreviewVideo";

const projectSections = [
  {
    key: "trending",
    title: "Trending Reels",
    moreHref: "/trending",
    pillClass:
      "from-blue-300/90 via-cyan-300/85 to-sky-200/80 border-cyan-300/70",
    glowClass: "bg-cyan-300/40",
    videos: [
      "/projects/trending/preview1.mp4",
      "/projects/trending/preview2.mp4",
      "/projects/trending/preview3.mp4",
      "/projects/trending/preview4.mp4",
    ],
  },
  {
    key: "political",
    title: "Political Edits",
    moreHref: "/political",
    pillClass:
      "from-fuchsia-300/90 via-pink-300/85 to-rose-200/80 border-pink-300/70",
    glowClass: "bg-pink-300/40",
    videos: [
      "/projects/political/preview1.mp4",
      "/projects/political/preview2.mp4",
      "/projects/political/preview3.mp4",
      "/projects/political/preview4.mp4",
    ],
  },
  {
    key: "ai",
    title: "AI Videos",
    moreHref: "/ai",
    pillClass:
      "from-amber-300/90 via-yellow-300/85 to-orange-200/80 border-amber-300/70",
    glowClass: "bg-amber-300/40",
    videos: [
      "/projects/ai/preview1.mp4",
      "/projects/ai/preview2.mp4",
      "/projects/ai/preview3.mp4",
      "/projects/ai/preview4.mp4",
    ],
  },
  {
    key: "memes",
    title: "Memes",
    moreHref: "/memes",
    pillClass:
      "from-emerald-300/90 via-green-300/85 to-teal-200/80 border-emerald-300/70",
    glowClass: "bg-emerald-300/40",
    videos: [
      "/projects/memes/preview1.mp4",
      "/projects/memes/preview2.mp4",
      "/projects/memes/preview3.mp4",
      "/projects/memes/preview4.mp4",
    ],
  },
];

const glowThemes = ["pink", "blue", "green", "orange"] as const;

function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f5f3ef]">
      <div className="absolute -left-24 top-0 h-[520px] w-[520px] rounded-full bg-pink-200/55 blur-[150px]" />
      <div className="absolute left-[28%] top-[20%] h-[420px] w-[420px] rounded-full bg-rose-200/35 blur-[130px]" />
      <div className="absolute left-[40%] top-[48%] h-[460px] w-[460px] rounded-full bg-amber-200/50 blur-[150px]" />
      <div className="absolute -right-16 top-0 h-[540px] w-[540px] rounded-full bg-sky-200/60 blur-[160px]" />
      <div className="absolute right-[18%] bottom-[8%] h-[340px] w-[340px] rounded-full bg-violet-200/36 blur-[140px]" />
      <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(0,0,0,0.08)_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:120px_120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.04))]" />
    </div>
  );
}

function GlassPanel({ children, className = "" }: any) {
  return (
    <div className={`relative overflow-hidden rounded-[34px] border border-black/8 bg-white/42 backdrop-blur-xl shadow ${className}`}>
      <div className="pointer-events-none absolute inset-[1px] rounded-[33px] bg-gradient-to-b from-white/55 via-white/18 to-white/10" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function PastelPill({ children, className = "", glowClass = "" }: any) {
  return (
    <div className="group relative inline-flex">
      <div className={`pointer-events-none absolute -inset-3 rounded-full opacity-50 blur-2xl ${glowClass}`} />
      <div className={`relative rounded-full border px-6 py-3 text-sm font-semibold ${className}`}>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("home-scroll-position");
    if (savedScroll) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number(savedScroll), behavior: "auto" });
        sessionStorage.removeItem("home-scroll-position");
      });
    }
  }, []);

  const saveScrollBeforeLeave = () => {
    sessionStorage.setItem("home-scroll-position", String(window.scrollY));
  };

  return (
    <main className="min-h-screen text-black">
      <PageBackdrop />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl space-y-16">
          {projectSections.map((section) => (
            <section key={section.key}>
              <div className="mb-8 flex justify-between">
                <PastelPill className={section.pillClass} glowClass={section.glowClass}>
                  {section.title}
                </PastelPill>

                <Link href={section.moreHref} onClick={saveScrollBeforeLeave}>
                  <PastelPill className={section.pillClass} glowClass={section.glowClass}>
                    More
                  </PastelPill>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {section.videos.map((video, index) => (
                  <HomePreviewVideo
                    key={video}
                    src={video}
                    label={`Preview ${index + 1}`}
                    glowTheme={glowThemes[index % 4]}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}