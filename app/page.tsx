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

function ExactLogoCard({
  href,
  label,
  src,
  glowClass,
}: {
  href: string;
  label: string;
  src: string;
  glowClass: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col items-center gap-3"
    >
      <div className="relative">
        <div
          className={`absolute -inset-4 rounded-[28px] opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 ${glowClass}`}
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-black/8 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="absolute inset-[2px] rounded-[22px] bg-white" />
          <img
            src={src}
            alt={label}
            className="relative z-10 h-11 w-11 object-contain"
          />
        </div>
      </div>
      <p className="text-xs text-black/65">{label}</p>
    </a>
  );
}

function FocusCard({
  href,
  title,
  bgClass,
  glowClass,
  onClick,
}: {
  href: string;
  title: string;
  bgClass: string;
  glowClass: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="group relative block">
      <div
        className={`pointer-events-none absolute -inset-3 rounded-[30px] opacity-70 blur-2xl transition duration-300 group-hover:opacity-100 ${glowClass}`}
      />
      <div
        className={`relative flex min-h-[122px] items-center justify-center overflow-hidden rounded-[26px] border border-black/8 ${bgClass} shadow-[0_16px_30px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-300 hover:scale-[1.03]`}
      >
        <div className="pointer-events-none absolute inset-[1px] rounded-[25px] bg-white/10" />
        <span className="relative z-10 px-5 text-center text-2xl font-semibold text-black/85">
          {title}
        </span>
      </div>
    </Link>
  );
}

function ContactCard({
  href,
  title,
  iconSrc,
  glowClass,
  iconClassName = "",
}: {
  href: string;
  title: string;
  iconSrc: string;
  glowClass: string;
  iconClassName?: string;
}) {
  return (
    <GlassPanel className="min-h-[255px] p-8">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <h3 className="mb-8 text-2xl font-semibold text-black/88">{title}</h3>

        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
          className="group relative inline-flex"
        >
          <div
            className={`absolute -inset-5 rounded-[28px] opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 ${glowClass}`}
          />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-black/8 bg-white shadow-[0_14px_30px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] transition duration-300 group-hover:scale-[1.04]">
            <img
              src={iconSrc}
              alt={title}
              className={`relative z-10 object-contain ${iconClassName || "h-14 w-14"}`}
            />
          </div>
        </a>
      </div>
    </GlassPanel>
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
    <main className="min-h-screen bg-transparent text-black">
      <PageBackdrop />

      {/* HERO */}
      <section className="relative px-6">
        <div className="flex min-h-screen items-center justify-center text-center">
          <div className="max-w-6xl">
            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-black/45">
              Ankit • Video Editor • Short-Form & AI Video Creator
            </p>

            <h1 className="text-5xl font-bold leading-[0.95] text-black md:text-7xl lg:text-8xl">
              I edit content
              <span className="block text-black/75">that grabs attention</span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-black/65">
              I create high-impact social media edits, trend-driven reels,
              political creatives, premium AI videos, and viral meme content
              built to engage modern audiences.
            </p>
          </div>
        </div>
      </section>

      {/* SHOWREEL */}
      <section className="relative px-6 py-20">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <div className="group relative h-[62vh] w-full overflow-hidden rounded-[36px] border border-black/8 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.10)]">
            <video
              src="/showreel.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.00))]" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center transition-all duration-500 group-hover:opacity-0 group-hover:scale-95">
              <PastelPill
                className="mb-4 border-fuchsia-200/70 from-fuchsia-100/90 via-pink-100/85 to-rose-100/80"
                glowClass="bg-pink-200/40"
              >
                Featured Showreel
              </PastelPill>

              <h2 className="text-2xl font-semibold text-white md:text-4xl">
                Social Media Edits • Political Creatives • AI Videos
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-white/80 md:text-base">
                A selection of fast-paced edits, scroll-stopping reels, campaign
                visuals, cinematic AI content, and standout storytelling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
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
                className="border-sky-200/70 from-white/95 via-sky-50/85 to-pink-50/85 px-8 py-4 text-4xl md:text-6xl"
                glowClass="bg-sky-200/30"
              >
                Projects &amp; Edits
              </PastelPill>
            </div>
          </div>

          <div className="space-y-16">
            {projectSections.map((section) => (
              <section key={section.key}>
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <PastelPill
                    className={`${section.pillClass} px-7 py-4 text-2xl md:text-3xl`}
                    glowClass={section.glowClass}
                  >
                    {section.title}
                  </PastelPill>

                  <Link href={section.moreHref} onClick={saveScrollBeforeLeave}>
                    <PastelPill
                      className={`${section.pillClass} px-6 py-3`}
                      glowClass={section.glowClass}
                    >
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
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-[260px,1fr]">
            <div className="flex justify-center md:justify-start">
              <div className="relative h-56 w-56 overflow-hidden rounded-full border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <Image
                  src="/profile.jpg"
                  alt="Ankit profile"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <PastelPill
                  className="border-pink-200/70 from-pink-100/95 via-white/90 to-sky-100/90"
                  glowClass="bg-pink-200/30"
                >
                  About
                </PastelPill>
              </div>

              <h2 className="mb-8 max-w-5xl text-4xl font-bold leading-[1.02] text-black md:text-6xl">
                Editing content that feels sharp, current, and impossible to skip.
              </h2>

              <div className="max-w-5xl space-y-5 text-lg leading-relaxed text-black/72">
                <p>
                  I’m Ankit — a video editor focused on creating social media content
                  that’s built to stop the scroll and hold attention.
                </p>
                <p>
                  My work spans memes, political edits, trending reels, and cinematic
                  AI visuals — all designed for platforms where speed, emotion, and
                  impact matter the most.
                </p>
                <p>
                  I keep edits fast, clean, and audience-first. Strong hooks, sharp
                  pacing, and instantly engaging visuals are what I build every
                  project around.
                </p>
                <p>
                  I don’t just cut videos — I shape content that feels relevant,
                  watchable, and made for today’s internet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex justify-center">
            <PastelPill
              className="border-sky-200/70 from-white/95 via-sky-50/90 to-pink-50/90 px-8 py-4 text-4xl"
              glowClass="bg-sky-200/30"
            >
              Skills &amp; Tools
            </PastelPill>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <GlassPanel className="min-h-[300px] p-6">
              <div className="w-full">
                <h3 className="mb-6 text-xl font-semibold text-black/90">
                  Editing Stack
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <ExactLogoCard
                    href="https://www.adobe.com/products/premiere.html"
                    label="Premiere Pro"
                    src="/logos/premiere-pro.svg"
                    glowClass="bg-blue-500/28"
                  />
                  <ExactLogoCard
                    href="https://www.adobe.com/products/aftereffects.html"
                    label="After Effects"
                    src="/logos/after-effects.svg"
                    glowClass="bg-fuchsia-500/28"
                  />
                  <ExactLogoCard
                    href="https://www.adobe.com/products/photoshop.html"
                    label="Photoshop"
                    src="/logos/photoshop.svg"
                    glowClass="bg-cyan-500/28"
                  />
                  <ExactLogoCard
                    href="https://www.capcut.com/"
                    label="CapCut"
                    src="/logos/capcut.svg"
                    glowClass="bg-zinc-400/22"
                  />
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="min-h-[300px] p-6">
              <div className="w-full">
                <h3 className="mb-6 text-xl font-semibold text-black/90">
                  AI Tools
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <ExactLogoCard
                    href="https://kling.ai/"
                    label="Kling"
                    src="/logos/kling.svg"
                    glowClass="bg-blue-500/28"
                  />
                  <ExactLogoCard
                    href="https://higgsfield.ai/"
                    label="Higgsfield"
                    src="/logos/higgsfield.svg"
                    glowClass="bg-lime-400/28"
                  />
                  <ExactLogoCard
                    href="https://grok.com/"
                    label="Grok"
                    src="/logos/grok.svg"
                    glowClass="bg-zinc-400/22"
                  />
                  <ExactLogoCard
                    href="https://chatgpt.com/"
                    label="ChatGPT"
                    src="/logos/chatgpt.svg"
                    glowClass="bg-emerald-500/28"
                  />
                  <ExactLogoCard
                    href="https://gemini.google.com/"
                    label="Gemini"
                    src="/logos/gemini.svg"
                    glowClass="bg-sky-500/28"
                  />
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="min-h-[300px] p-6">
              <div className="w-full">
                <h3 className="mb-6 text-xl font-semibold text-black/90">
                  Content Focus
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <FocusCard
                    href="/memes"
                    title="Memes"
                    onClick={saveScrollBeforeLeave}
                    bgClass="bg-gradient-to-br from-fuchsia-300/95 via-pink-300/90 to-rose-200/85"
                    glowClass="bg-fuchsia-400/30"
                  />
                  <FocusCard
                    href="/political"
                    title="Political"
                    onClick={saveScrollBeforeLeave}
                    bgClass="bg-gradient-to-br from-blue-300/95 via-cyan-300/90 to-sky-200/85"
                    glowClass="bg-blue-400/30"
                  />
                  <FocusCard
                    href="/trending"
                    title="Reels"
                    onClick={saveScrollBeforeLeave}
                    bgClass="bg-gradient-to-br from-emerald-300/95 via-green-300/90 to-teal-200/85"
                    glowClass="bg-emerald-400/30"
                  />
                  <FocusCard
                    href="/ai"
                    title="AI Visuals"
                    onClick={saveScrollBeforeLeave}
                    bgClass="bg-gradient-to-br from-orange-300/95 via-amber-300/90 to-yellow-200/85"
                    glowClass="bg-orange-400/30"
                  />
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="relative px-6 py-24 text-center">
        <div className="mb-6 flex justify-center">
          <PastelPill
            className="border-sky-200/70 from-white/95 via-sky-50/90 to-pink-50/90 px-8 py-4 text-4xl"
            glowClass="bg-sky-200/30"
          >
            Let&apos;s Work
          </PastelPill>
        </div>

        <p className="mb-10 text-black/60">
          Available for freelance projects, reels, memes, political edits, and
          AI video work.
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <ContactCard
            href="https://instagram.com/bhayankarprani"
            title="Instagram"
            iconSrc="/logos/instagram.svg"
            glowClass="bg-pink-400/24"
            iconClassName="h-14 w-14"
          />

          <ContactCard
            href="https://wa.me/919457993196"
            title="WhatsApp"
            iconSrc="/logos/whatsapp.svg"
            glowClass="bg-emerald-400/24"
            iconClassName="h-16 w-16"
          />

          <ContactCard
            href="mailto:ankitsisodia812658@gmail.com"
            title="Email"
            iconSrc="/logos/gmail.svg"
            glowClass="bg-blue-400/24"
            iconClassName="h-14 w-14"
          />
        </div>
      </section>
    </main>
  );
}