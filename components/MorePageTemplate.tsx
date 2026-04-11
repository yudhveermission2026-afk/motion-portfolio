"use client";

import Link from "next/link";
import { useEffect } from "react";
import MorePreviewVideo from "./MorePreviewVideo";

type MorePageTemplateProps = {
  title: string;
  badge: string;
  videos: string[];
  pillClass: string;
  glowClass: string;
};

function PastelPill({
  children,
  className = "",
  glowClass = "",
}: {
  children: React.ReactNode;
  className?: string;
  glowClass?: string;
}) {
  return (
    <div className="group relative inline-flex">
      <div
        className={`pointer-events-none absolute -inset-3 rounded-full opacity-40 blur-xl transition duration-300 group-hover:opacity-100 ${glowClass}`}
      />
      <div
        className={`relative inline-flex items-center justify-center rounded-full border bg-gradient-to-br px-6 py-3 text-sm font-semibold text-black/80 shadow-[0_8px_20px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.65)] transition duration-300 group-hover:scale-[1.02] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f5f3ef]">
      <div className="absolute -left-24 top-0 h-[520px] w-[520px] rounded-full bg-pink-200/55 blur-[150px]" />
      <div className="absolute left-[28%] top-[20%] h-[420px] w-[420px] rounded-full bg-rose-200/35 blur-[130px]" />
      <div className="absolute left-[40%] top-[48%] h-[460px] w-[460px] rounded-full bg-amber-200/50 blur-[150px]" />
      <div className="absolute -right-16 top-0 h-[540px] w-[540px] rounded-full bg-sky-200/60 blur-[160px]" />
      <div className="absolute right-[18%] bottom-[8%] h-[340px] w-[340px] rounded-full bg-violet-200/36 blur-[140px]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(0,0,0,0.07)_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.20),rgba(255,255,255,0.04))]" />
    </div>
  );
}

export default function MorePageTemplate({
  title,
  badge,
  videos,
  pillClass,
  glowClass,
}: MorePageTemplateProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 text-black md:px-6 md:py-10">
      <PageBackdrop />

      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 flex items-center justify-between gap-4">
          <PastelPill className={pillClass} glowClass={glowClass}>
            {badge}
          </PastelPill>

          <Link href="/" className="group relative inline-flex">
            <div
              className={`pointer-events-none absolute -inset-3 rounded-full opacity-40 blur-xl transition duration-300 group-hover:opacity-100 ${glowClass}`}
            />
            <div
              className={`relative inline-flex items-center justify-center rounded-full border bg-gradient-to-br px-6 py-3 text-sm font-semibold text-black/80 shadow-[0_8px_20px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.65)] transition duration-300 group-hover:scale-[1.02] ${pillClass}`}
            >
              Back Home
            </div>
          </Link>
        </div>

        <div className="mb-12 text-center">
          <div className="mb-5 flex justify-center">
            <PastelPill
              className="border-violet-200/70 from-violet-100/95 via-fuchsia-50/90 to-sky-100/90"
              glowClass="bg-violet-200/30"
            >
              Selected Work
            </PastelPill>
          </div>

          <div className="flex justify-center">
            <PastelPill
              className={`${pillClass} px-8 py-4 text-3xl md:text-5xl`}
              glowClass={glowClass}
            >
              {title}
            </PastelPill>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {videos.map((video, index) => (
            <MorePreviewVideo
              key={video}
              src={video}
              label={`Video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}