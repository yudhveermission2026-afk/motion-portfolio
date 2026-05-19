"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import ProjectsShowcase from "../components/ProjectsShowcase";
import HeroScene from "../components/HeroScene";
import AboutScene from "../components/AboutScene";
import { fetchHomeSections } from "@/lib/site/videos";
import type { SectionType, VideoItem } from "@/types/hacker";

const sectionThemeMap: Record<
  SectionType,
  {
    title: string;
    pillClass: string;
    glowClass: string;
  }
> = {
  trending: {
    title: "Trending Reels",
    pillClass:
      "from-blue-300/90 via-cyan-300/85 to-sky-200/80 border-cyan-300/70",
    glowClass: "bg-cyan-300/40",
  },
  political: {
    title: "Political Edits",
    pillClass:
      "from-fuchsia-300/90 via-pink-300/85 to-rose-200/80 border-pink-300/70",
    glowClass: "bg-pink-300/40",
  },
  ai: {
    title: "AI Videos",
    pillClass:
      "from-amber-300/90 via-yellow-300/85 to-orange-200/80 border-amber-300/70",
    glowClass: "bg-amber-300/40",
  },
  memes: {
    title: "Memes",
    pillClass:
      "from-emerald-300/90 via-green-300/85 to-teal-200/80 border-emerald-300/70",
    glowClass: "bg-emerald-300/40",
  },
};

function TopNav() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;

      if (currentY < 80) {
        setVisible(true);
      } else if (diff > 8) {
        setVisible(false);
      } else if (diff < -8) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-1/2 top-5 z-50 w-[min(94vw,900px)] -translate-x-1/2 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-28 opacity-0"
      }`}
    >
      <div className="glass-nav rounded-full px-4 py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          {[
            ["Home", "#home"],
            ["About", "#about"],
            ["Skills", "#skills"],
            ["Contact Me", "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="nav-link rounded-full px-5 py-2.5 text-base font-semibold text-black/72 transition md:text-[19px]"
              data-cursor="pointer"
            >
              <span>{label}</span>
            </a>
          ))}
        </div>
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
  children: ReactNode;
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
  children: ReactNode;
  className?: string;
  glowClass?: string;
}) {
  return (
    <div className="group relative inline-flex tilt-hover" data-cursor="pointer">
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
      className="group flex h-full flex-col items-center gap-3 tilt-hover"
      data-cursor="pointer"
    >
      <div className="relative">
        <div
          className={`absolute -inset-4 rounded-[28px] opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 ${glowClass}`}
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-black/8 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="absolute inset-[2px] rounded-[22px] bg-white" />
          <img src={src} alt={label} className="relative z-10 h-11 w-11 object-contain" />
        </div>
      </div>
      <p className="text-center text-xs text-black/65">{label}</p>
    </a>
  );
}

function FocusCard({
  title,
  bgClass,
  glowClass,
  onClick,
}: {
  title: string;
  bgClass: string;
  glowClass: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="group relative block w-full text-left tilt-hover"
      data-cursor="pointer"
    >
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
    </button>
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
    <GlassPanel className="h-full min-h-[255px] p-8 tilt-hover">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <h3 className="mb-8 text-2xl font-semibold text-black/88">{title}</h3>

        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
          className="group relative inline-flex"
          data-cursor="pointer"
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
  const [sectionsData, setSectionsData] = useState<Record<SectionType, VideoItem[]> | null>(null);
  const [showreelHovered, setShowreelHovered] = useState(false);
  const showreelRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetchHomeSections()
      .then(setSectionsData)
      .catch(() => {
        setSectionsData({
          trending: [],
          political: [],
          ai: [],
          memes: [],
        });
      });
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("reveal-visible");
          } else {
            el.classList.remove("reveal-visible");
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((node) => {
      node.classList.add("reveal");
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [sectionsData]);

  const projectSections = useMemo(() => {
    if (!sectionsData) return [];

    return (Object.keys(sectionThemeMap) as SectionType[]).map((key) => ({
      key,
      ...sectionThemeMap[key],
      videos: sectionsData[key] || [],
    }));
  }, [sectionsData]);

  const projectTabLabelMap: Record<SectionType, string> = {
    trending: "Trending Reels",
    political: "Political Edits",
    ai: "AI Videos",
    memes: "Memes",
  };

  const activateProjectTab = (section: SectionType) => {
    const workSection = document.getElementById("work");
    if (!workSection) return;

    const targetLabel = projectTabLabelMap[section].toLowerCase();
    const buttons = Array.from(workSection.querySelectorAll<HTMLButtonElement>("button"));

    const targetButton = buttons.find(
      (button) => button.textContent?.trim().toLowerCase() === targetLabel
    );

    targetButton?.click();
  };

  const jumpToProjectSection = (section: SectionType) => {
    const workSection = document.getElementById("work");

    workSection?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    activateProjectTab(section);

    window.setTimeout(() => activateProjectTab(section), 120);
    window.setTimeout(() => activateProjectTab(section), 320);
    window.setTimeout(() => activateProjectTab(section), 620);
  };

  const handleShowreelEnter = () => {
    setShowreelHovered(true);

    const previews = document.querySelectorAll("video[data-portfolio-preview='true']");

    previews.forEach((node) => {
      const preview = node as HTMLVideoElement;
      preview.pause();
      preview.currentTime = 0;
    });

    if (showreelRef.current) {
      showreelRef.current.muted = false;
      showreelRef.current.volume = 1;
      showreelRef.current.play().catch(() => {});
    }
  };

  const handleShowreelLeave = () => {
    setShowreelHovered(false);

    if (showreelRef.current) {
      showreelRef.current.muted = true;
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-black">
      <PageBackdrop />
      <TopNav />

      <section id="home" className="section-anchor relative overflow-hidden px-6 pt-24">
        <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="reveal text-center lg:text-left" data-reveal>
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-black/45">
              Ankit, Video Editor, Short-Form & AI Video Creator
            </p>

            <h1 className="text-5xl font-bold leading-[0.95] text-black md:text-7xl lg:text-8xl">
              I edit content
              <span className="block text-black/75">that grabs attention</span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-black/65 lg:mx-0">
              I create high-impact social media edits, trend-driven reels,
              political creatives, premium AI videos, and viral meme content
              built to engage modern audiences.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a href="#skills" data-cursor="pointer">
                <PastelPill
                  className="border-sky-200/70 from-white/95 via-sky-50/90 to-pink-50/90"
                  glowClass="bg-sky-200/30"
                >
                  Explore Skills
                </PastelPill>
              </a>
              <a href="#contact" data-cursor="pointer">
                <PastelPill
                  className="border-pink-200/70 from-pink-100/95 via-white/90 to-sky-100/90"
                  glowClass="bg-pink-200/30"
                >
                  Contact Me
                </PastelPill>
              </a>
            </div>
          </div>

          <div className="reveal reveal-delay-1" data-reveal>
            <HeroScene />
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <div
            className="group relative h-[62vh] w-full overflow-hidden rounded-[36px] border border-black/8 bg-white shadow-[0_28px_70px_rgba(0,0,0,0.10)] reveal tilt-hover"
            data-reveal
            data-cursor="pointer"
            onMouseEnter={handleShowreelEnter}
            onMouseLeave={handleShowreelLeave}
          >
            <video
              ref={showreelRef}
              src="/showreel.mp4"
              autoPlay
              muted={!showreelHovered}
              loop
              playsInline
              data-showreel-video="true"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.00))]" />

            <div className="pointer-events-none absolute right-5 top-5 z-20">
              <div className="rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
                {showreelHovered ? "Sound On" : "Hover For Sound"}
              </div>
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center transition-all duration-500 group-hover:scale-95 group-hover:opacity-0">
              <PastelPill
                className="mb-4 border-fuchsia-200/70 from-fuchsia-100/90 via-pink-100/85 to-rose-100/80"
                glowClass="bg-pink-200/40"
              >
                Featured Showreel
              </PastelPill>

              <h2 className="text-2xl font-semibold text-white md:text-4xl">
                Social Media Edits, Political Creatives, AI Videos
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-white/80 md:text-base">
                A selection of fast-paced edits, scroll-stopping reels, campaign
                visuals, cinematic AI content, and standout storytelling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section-anchor relative px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ProjectsShowcase sections={projectSections} />
        </div>
      </section>

      <section id="about" className="section-anchor relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr]">
            <div className="reveal" data-reveal>
              <AboutScene />
            </div>

            <div className="reveal reveal-delay-1" data-reveal>
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
                  I’m Ankit, a video editor focused on creating social media content
                  that’s built to stop the scroll and hold attention.
                </p>
                <p>
                  My work spans memes, political edits, trending reels, and cinematic
                  AI visuals, all designed for platforms where speed, emotion, and
                  impact matter the most.
                </p>
                <p>
                  I keep edits fast, clean, and audience first. Strong hooks, sharp
                  pacing, and instantly engaging visuals are what I build every
                  project around.
                </p>
                <p>
                  I don’t just cut videos. I shape content that feels relevant,
                  watchable, and made for today’s internet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section-anchor relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex justify-center reveal" data-reveal>
            <PastelPill
              className="border-sky-200/70 from-white/95 via-sky-50/90 to-pink-50/90 px-8 py-4 text-4xl"
              glowClass="bg-sky-200/30"
            >
              Skills &amp; Tools
            </PastelPill>
          </div>

          <div className="grid items-stretch grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="reveal h-full" data-reveal>
              <GlassPanel className="h-full min-h-[330px] p-6 tilt-hover">
                <div className="flex h-full flex-col">
                  <h3 className="mb-6 text-xl font-semibold text-black/90">
                    Editing Stack
                  </h3>
                  <div className="grid flex-1 grid-cols-2 gap-5">
                    <ExactLogoCard href="https://www.adobe.com/products/premiere.html" label="Premiere Pro" src="/logos/premiere-pro.svg" glowClass="bg-blue-500/28" />
                    <ExactLogoCard href="https://www.adobe.com/products/aftereffects.html" label="After Effects" src="/logos/after-effects.svg" glowClass="bg-fuchsia-500/28" />
                    <ExactLogoCard href="https://www.adobe.com/products/photoshop.html" label="Photoshop" src="/logos/photoshop.svg" glowClass="bg-cyan-500/28" />
                    <ExactLogoCard href="https://www.capcut.com/" label="CapCut" src="/logos/capcut.svg" glowClass="bg-zinc-400/22" />
                  </div>
                </div>
              </GlassPanel>
            </div>

            <div className="reveal reveal-delay-1 h-full" data-reveal>
              <GlassPanel className="h-full min-h-[330px] p-6 tilt-hover">
                <div className="flex h-full flex-col">
                  <h3 className="mb-6 text-xl font-semibold text-black/90">
                    AI Tools
                  </h3>
                  <div className="grid flex-1 grid-cols-3 gap-4">
                    <ExactLogoCard href="https://kling.ai/" label="Kling" src="/logos/kling.svg" glowClass="bg-blue-500/28" />
                    <ExactLogoCard href="https://higgsfield.ai/" label="Higgsfield" src="/logos/higgsfield.svg" glowClass="bg-lime-400/28" />
                    <ExactLogoCard href="https://grok.com/" label="Grok" src="/logos/grok.svg" glowClass="bg-zinc-400/22" />
                    <ExactLogoCard href="https://chatgpt.com/" label="ChatGPT" src="/logos/chatgpt.svg" glowClass="bg-emerald-500/28" />
                    <ExactLogoCard href="https://gemini.google.com/" label="Gemini" src="/logos/gemini.svg" glowClass="bg-sky-500/28" />
                    <ExactLogoCard href="https://minimax.io/" label="MiniMax" src="/logos/minimax.svg" glowClass="bg-orange-500/28" />
                  </div>
                </div>
              </GlassPanel>
            </div>

            <div className="reveal reveal-delay-2 h-full" data-reveal>
              <GlassPanel className="h-full min-h-[330px] p-6 tilt-hover">
                <div className="flex h-full flex-col">
                  <h3 className="mb-6 text-xl font-semibold text-black/90">
                    Content Focus
                  </h3>
                  <div className="grid flex-1 grid-cols-2 gap-5">
                    <FocusCard
                      title="Memes"
                      onClick={() => jumpToProjectSection("memes")}
                      bgClass="bg-gradient-to-br from-emerald-300/95 via-green-300/90 to-teal-200/85"
                      glowClass="bg-emerald-400/30"
                    />
                    <FocusCard
                      title="Political"
                      onClick={() => jumpToProjectSection("political")}
                      bgClass="bg-gradient-to-br from-fuchsia-300/95 via-pink-300/90 to-rose-200/85"
                      glowClass="bg-pink-400/30"
                    />
                    <FocusCard
                      title="Reels"
                      onClick={() => jumpToProjectSection("trending")}
                      bgClass="bg-gradient-to-br from-cyan-300/95 via-sky-300/90 to-blue-200/85"
                      glowClass="bg-cyan-400/30"
                    />
                    <FocusCard
                      title="AI Visuals"
                      onClick={() => jumpToProjectSection("ai")}
                      bgClass="bg-gradient-to-br from-amber-300/95 via-yellow-300/90 to-orange-200/85"
                      glowClass="bg-amber-400/30"
                    />
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-anchor relative px-6 py-24 text-center">
        <div className="mb-6 flex justify-center reveal" data-reveal>
          <PastelPill
            className="border-sky-200/70 from-white/95 via-sky-50/90 to-pink-50/90 px-8 py-4 text-4xl"
            glowClass="bg-sky-200/30"
          >
            Let&apos;s Work
          </PastelPill>
        </div>

        <p className="mb-10 text-black/60 reveal reveal-delay-1" data-reveal>
          Available for freelance projects, reels, memes, political edits, and
          AI video work.
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="reveal h-full" data-reveal>
            <ContactCard href="https://instagram.com/bhayankarprani" title="Instagram" iconSrc="/logos/instagram.svg" glowClass="bg-pink-400/24" iconClassName="h-14 w-14" />
          </div>

          <div className="reveal reveal-delay-1 h-full" data-reveal>
            <ContactCard href="https://wa.me/919457993196" title="WhatsApp" iconSrc="/logos/whatsapp.svg" glowClass="bg-emerald-400/24" iconClassName="h-16 w-16" />
          </div>

          <div className="reveal reveal-delay-2 h-full" data-reveal>
            <ContactCard href="mailto:ankitsisodia812658@gmail.com" title="Email" iconSrc="/logos/gmail.svg" glowClass="bg-blue-400/24" iconClassName="h-14 w-14" />
          </div>
        </div>
      </section>
    </main>
  );
}