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
        className={`pointer-events-none absolute -inset-3 rounded-full opacity-50 blur-2xl transition duration-300 group-hover:opacity-100 ${glowClass}`}
      />
      <div
        className={`relative inline-flex items-center justify-center rounded-full border bg-gradient-to-br px-6 py-3 text-sm font-semibold text-black/80 shadow-[0_10px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.65)] transition duration-300 group-hover:scale-[1.03] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[34px] border border-black/8 bg-white/42 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.09),inset_0_1px_0_rgba(255,255,255,0.75)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-[1px] rounded-[33px] bg-gradient-to-b from-white/55 via-white/18 to-white/10" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(0,0,0,0.08)_0.7px,transparent_0.7px)] [background-size:16px_16px]" />
      <div className="pointer-events-none absolute left-6 top-4 h-16 w-24 rounded-full bg-white/55 blur-2xl" />
      <div className="relative z-10">{children}</div>
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
      <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(0,0,0,0.08)_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:120px_120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.04))]" />
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
    <main className="min-h-screen bg-transparent px-6 py-10 text-black">
      <PageBackdrop />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <PastelPill className={pillClass} glowClass={glowClass}>
            {badge}
          </PastelPill>

          <Link href="/" className="group relative inline-flex">
            <div
              className={`pointer-events-none absolute -inset-3 rounded-full opacity-50 blur-2xl transition duration-300 group-hover:opacity-100 ${glowClass}`}
            />
            <div
              className={`relative inline-flex items-center justify-center rounded-full border bg-gradient-to-br px-6 py-3 text-sm font-semibold text-black/80 shadow-[0_10px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.65)] transition duration-300 group-hover:scale-[1.03] ${pillClass}`}
            >
              Back Home
            </div>
          </Link>
        </div>

        <div className="mb-12 text-center">
          <div className="mb-5 flex justify-center">
            <PastelPill
              className="border-violet-200/70 from-violet-100/95 via-fuchsia-50/90 to-sky-100/90"
              glowClass="bg-violet-200/35"
            >
              Selected Work
            </PastelPill>
          </div>

          <div className="flex justify-center">
            <PastelPill
              className={`${pillClass} px-8 py-4 text-4xl md:text-6xl`}
              glowClass={glowClass}
            >
              {title}
            </PastelPill>
          </div>
        </div>

        <GlassPanel className="p-5 md:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video, index) => (
              <MorePreviewVideo
                key={video}
                src={video}
                label={`Video ${index + 1}`}
              />
            ))}
          </div>
        </GlassPanel>
      </div>
    </main>
  );
}