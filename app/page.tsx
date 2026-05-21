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
          <img
            src={src}
            alt={label}
            className="relative z-10 h-11 w-11 object-contain"
          />
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
              className={`relative z-10 object-contain ${
                iconClassName || "h-14 w-14"
              }`}
            />
          </div>
        </a>
      </div>
    </GlassPanel>
  );
}

function AboutSectionMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [insideMusicZone, setInsideMusicZone] = useState(false);

  const clearFadeTimer = () => {
    if (fadeTimerRef.current) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const stopAudioHard = () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeTimer();
    audio.pause();
    audio.muted = true;
    audio.volume = 0;
  };

  const fadeAudio = (targetVolume: number, pauseAtEnd = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeTimer();

    fadeTimerRef.current = window.setInterval(() => {
      const diff = targetVolume - audio.volume;

      if (Math.abs(diff) <= 0.02) {
        audio.volume = targetVolume;

        if (pauseAtEnd) {
          audio.pause();
          audio.muted = true;
        }

        clearFadeTimer();
        return;
      }

      audio.volume = Math.max(0, Math.min(0.35, audio.volume + diff * 0.2));
    }, 40);
  };

  const checkMusicZonePosition = () => {
    const heroSection = document.getElementById("home");
    const aboutSection = document.getElementById("about");
    const viewportCenter = window.innerHeight * 0.5;

    const isSectionAtCenter = (section: HTMLElement | null) => {
      if (!section) return false;

      const rect = section.getBoundingClientRect();
      return rect.top < viewportCenter && rect.bottom > viewportCenter;
    };

    setInsideMusicZone(
      isSectionAtCenter(heroSection) || isSectionAtCenter(aboutSection)
    );
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.muted = true;
      audio.volume = 0;
      audio.loop = true;
    }

    const unlockAudio = () => {
      setAudioUnlocked(true);
    };

    const scheduleCheck = () => {
      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        checkMusicZonePosition();
      });
    };

    checkMusicZonePosition();

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }

      stopAudioHard();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!soundEnabled) {
      stopAudioHard();
      return;
    }

    if (soundEnabled && audioUnlocked && insideMusicZone) {
      audio.muted = false;
      audio.volume = Math.max(audio.volume, 0.02);

      audio.play().catch(() => {
        stopAudioHard();
      });

      fadeAudio(0.35, false);
      return;
    }

    fadeAudio(0, true);
  }, [soundEnabled, audioUnlocked, insideMusicZone]);

  const toggleSound = () => {
    setAudioUnlocked(true);

    setSoundEnabled((current) => {
      const next = !current;

      if (!next) {
        stopAudioHard();
      }

      return next;
    });
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/about-theme.mp3" preload="none" />

      <button
        type="button"
        data-cursor="pointer"
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={toggleSound}
        className="fixed bottom-5 right-5 z-[90] rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black/70 shadow-[0_14px_30px_rgba(0,0,0,.10)] backdrop-blur-xl transition hover:scale-105 hover:bg-white"
      >
        {soundEnabled ? "Sound On" : "Sound Off"}
      </button>
    </>
  );
}

export default function Home() {
  const [sectionsData, setSectionsData] = useState<Record<
    SectionType,
    VideoItem[]
  > | null>(null);

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
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

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
    const buttons = Array.from(
      workSection.querySelectorAll<HTMLButtonElement>("button")
    );

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

  return (
    <main className="min-h-screen bg-transparent text-black">
      <PageBackdrop />
      <AboutSectionMusic />

      <section
        id="home"
        className="section-anchor relative overflow-hidden px-6 pt-24"
      >
        <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="reveal text-center lg:text-left" data-reveal>
            <div className="flex items-start justify-center gap-0 lg:justify-start">
              <div className="pointer-events-none relative hidden h-[660px] w-[350px] shrink-0 overflow-visible lg:block xl:h-[720px] xl:w-[385px]">
                <div className="absolute inset-y-10 left-1/2 w-[220px] -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />

                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="relative z-10 h-full w-full translate-x-20 translate-y-[-18px] scale-[1.22] object-contain drop-shadow-[0_26px_38px_rgba(0,0,0,.14)] xl:translate-x-24 xl:translate-y-[-22px] xl:scale-[1.26]"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source
                    src="/hero-side-avatar.mov"
                    type='video/quicktime; codecs="hvc1"'
                  />
                  <source
                    src="/hero-side-avatar.webm"
                    type='video/webm; codecs="vp9"'
                  />
                </video>
              </div>

              <div className="max-w-3xl lg:-ml-2 xl:-ml-4">
                <p className="mb-5 text-sm uppercase tracking-[0.35em] text-black/45">
                  Ankit, Video Editor, Short-Form & AI Video Creator
                </p>

                <h1 className="text-5xl font-bold leading-[0.95] text-black md:text-7xl lg:text-8xl">
                  I edit content
                  <span className="block text-black/75">
                    that grabs attention
                  </span>
                </h1>

                <p className="mx-auto mt-7 max-w-3xl text-black/65 lg:mx-0">
                  I create high-impact social media edits, trend-driven reels,
                  political creatives, premium AI videos, and viral meme content
                  built to engage modern audiences.
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <a href="#about" data-cursor="pointer">
                    <PastelPill
                      className="border-violet-200/70 from-white/95 via-violet-50/90 to-pink-50/90"
                      glowClass="bg-violet-200/30"
                    >
                      About
                    </PastelPill>
                  </a>

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
            className="relative h-[62vh] w-full overflow-hidden rounded-[38px] border border-white/55 bg-white/10 shadow-[0_28px_70px_rgba(0,0,0,0.09),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md reveal"
            data-reveal
          >
            <div className="pointer-events-none absolute inset-0 rounded-[38px] bg-gradient-to-br from-white/18 via-sky-100/10 to-pink-100/14" />
            <div className="pointer-events-none absolute inset-[10px] rounded-[30px] border border-white/45" />

            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
              <h2 className="max-w-5xl text-3xl font-bold leading-tight text-black/68 md:text-5xl">
                Social Media Edits, Political Creatives, AI Videos
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-7 text-black/52 md:text-lg">
                A selection of fast-paced edits, scroll-stopping reels, campaign
                visuals, cinematic AI content, and standout storytelling.
              </p>
            </div>

            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 z-20 h-full w-full object-cover"
              onContextMenu={(e) => e.preventDefault()}
            >
              <source
                src="/showreel-bg.mov"
                type='video/quicktime; codecs="hvc1"'
              />
              <source
                src="/showreel-bg.webm"
                type='video/webm; codecs="vp9"'
              />
            </video>

            <div className="pointer-events-none absolute inset-0 z-30 rounded-[38px] bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.08),transparent_42%)]" />
          </div>
        </div>
      </section>

      <section
        id="work"
        className="section-anchor relative px-4 py-20 md:px-6 md:py-28"
      >
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
                Editing content that feels sharp, current, and impossible to
                skip.
              </h2>

              <div className="max-w-5xl space-y-5 text-lg leading-relaxed text-black/72">
                <p>
                  I’m Ankit — a video editor focused on creating social media
                  content that’s built to stop the scroll and hold attention.
                </p>
                <p>
                  My work spans memes, political edits, trending reels, and
                  cinematic AI visuals — all designed for platforms where speed,
                  emotion, and impact matter the most.
                </p>
                <p>
                  I keep edits fast, clean, and audience-first. Strong hooks,
                  sharp pacing, and instantly engaging visuals are what I build
                  every project around.
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
            </div>

            <div className="reveal reveal-delay-1 h-full" data-reveal>
              <GlassPanel className="h-full min-h-[330px] p-6 tilt-hover">
                <div className="flex h-full flex-col">
                  <h3 className="mb-6 text-xl font-semibold text-black/90">
                    AI Tools
                  </h3>
                  <div className="grid flex-1 grid-cols-3 gap-4">
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
                    <ExactLogoCard
                      href="https://minimax.io/"
                      label="MiniMax"
                      src="/logos/minimax.svg"
                      glowClass="bg-orange-500/28"
                    />
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
                      bgClass="bg-gradient-to-br from-blue-300/95 via-cyan-300/90 to-sky-200/85"
                      glowClass="bg-cyan-400/30"
                    />
                    <FocusCard
                      title="AI Visuals"
                      onClick={() => jumpToProjectSection("ai")}
                      bgClass="bg-gradient-to-br from-orange-300/95 via-amber-300/90 to-yellow-200/85"
                      glowClass="bg-orange-400/30"
                    />
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="section-anchor relative px-6 py-24 text-center"
      >
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
            <ContactCard
              href="https://instagram.com/bhayankarprani"
              title="Instagram"
              iconSrc="/logos/instagram.svg"
              glowClass="bg-pink-400/24"
              iconClassName="h-14 w-14"
            />
          </div>

          <div className="reveal reveal-delay-1 h-full" data-reveal>
            <ContactCard
              href="https://wa.me/919457993196"
              title="WhatsApp"
              iconSrc="/logos/whatsapp.svg"
              glowClass="bg-emerald-400/24"
              iconClassName="h-16 w-16"
            />
          </div>

          <div className="reveal reveal-delay-2 h-full" data-reveal>
            <ContactCard
              href="mailto:ankitsisodia812658@gmail.com"
              title="Email"
              iconSrc="/logos/gmail.svg"
              glowClass="bg-blue-400/24"
              iconClassName="h-14 w-14"
            />
          </div>
        </div>

        <div
          className="mx-auto mt-14 max-w-4xl reveal reveal-delay-2"
          data-reveal
        >
          <p className="mx-auto max-w-3xl text-balance text-center text-sm leading-7 text-black/45 md:text-base md:leading-8">
            <span className="font-semibold text-black/65">Made By Ankit</span>{" "}
            is the video editing portfolio of Ankit Sisodia, built for
            short-form reels, AI videos, political edits, meme content, and
            social media visuals.
          </p>
        </div>
      </section>
    </main>
  );
}