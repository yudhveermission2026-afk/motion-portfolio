"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SectionType, VideoItem } from "@/types/hacker";

type ProjectShowcaseSection = {
  key: SectionType;
  title: string;
  pillClass: string;
  glowClass: string;
  videos: VideoItem[];
};

type ProjectsShowcaseProps = {
  sections: ProjectShowcaseSection[];
};

type WheelItem = {
  id: string;
  sectionKey: SectionType;
  sectionTitle: string;
  sectionVideoIndex: number;
  video: VideoItem;
};

type PopOrigin = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

const sectionCopy: Record<SectionType, string> = {
  trending: "Fast, social-first reels with clean pacing and scroll-stopping rhythm.",
  political: "Sharp political creatives, satire edits, and narrative-driven clips.",
  ai: "Cinematic AI visuals, generated scenes, and experimental video concepts.",
  memes: "Punchy meme edits built for quick attention and repeat watches.",
};

const accentMap: Record<SectionType, string> = {
  trending: "from-cyan-300 via-sky-300 to-blue-300",
  political: "from-fuchsia-300 via-pink-300 to-rose-300",
  ai: "from-amber-300 via-yellow-300 to-orange-300",
  memes: "from-emerald-300 via-green-300 to-teal-300",
};

const softAccentMap: Record<SectionType, string> = {
  trending: "bg-cyan-300/30",
  political: "bg-pink-300/30",
  ai: "bg-amber-300/30",
  memes: "bg-emerald-300/30",
};

const wheelColorMap: Record<SectionType, string> = {
  trending:
    "radial-gradient(circle at 50% 0%, rgba(255,255,255,.50), rgba(255,255,255,0) 38%), linear-gradient(135deg, rgba(103,232,249,.98) 0%, rgba(56,189,248,.98) 48%, rgba(96,165,250,.98) 100%)",
  political:
    "radial-gradient(circle at 50% 0%, rgba(255,255,255,.50), rgba(255,255,255,0) 38%), linear-gradient(135deg, rgba(249,168,212,.98) 0%, rgba(244,114,182,.98) 48%, rgba(251,113,133,.98) 100%)",
  ai:
    "radial-gradient(circle at 50% 0%, rgba(255,255,255,.52), rgba(255,255,255,0) 38%), linear-gradient(135deg, rgba(253,224,71,.99) 0%, rgba(251,191,36,.99) 48%, rgba(251,146,60,.98) 100%)",
  memes:
    "radial-gradient(circle at 50% 0%, rgba(255,255,255,.50), rgba(255,255,255,0) 38%), linear-gradient(135deg, rgba(110,231,183,.98) 0%, rgba(74,222,128,.98) 48%, rgba(45,212,191,.98) 100%)",
};

function loopIndex(index: number, total: number) {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

function shortestRelative(index: number, activeIndex: number, total: number) {
  if (total <= 0) return 0;

  let diff = index - activeIndex;

  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  return diff;
}

function pauseAllPortfolioVideos(except?: HTMLVideoElement | null) {
  const videos = document.querySelectorAll("video[data-portfolio-preview='true']");

  videos.forEach((node) => {
    const video = node as HTMLVideoElement;

    if (video !== except) {
      video.pause();
    }
  });

  const showreel = document.querySelector(
    "video[data-showreel-video='true']"
  ) as HTMLVideoElement | null;

  if (showreel) {
    showreel.muted = true;
  }
}

function getFourCardPose(relative: number) {
  const poses: Record<
    number,
    {
      x: number;
      y: number;
      rotate: number;
      scale: number;
      opacity: number;
      zIndex: number;
      pointer: boolean;
    }
  > = {
    [-3]: {
      x: -560,
      y: 260,
      rotate: -32,
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
      pointer: false,
    },
    [-2]: {
      x: -430,
      y: 112,
      rotate: -23,
      scale: 0.68,
      opacity: 1,
      zIndex: 10,
      pointer: true,
    },
    [-1]: {
      x: -215,
      y: 42,
      rotate: -13,
      scale: 0.86,
      opacity: 1,
      zIndex: 24,
      pointer: true,
    },
    0: {
      x: 0,
      y: 14,
      rotate: 0,
      scale: 0.98,
      opacity: 1,
      zIndex: 40,
      pointer: true,
    },
    1: {
      x: 215,
      y: 42,
      rotate: 13,
      scale: 0.86,
      opacity: 1,
      zIndex: 24,
      pointer: true,
    },
    2: {
      x: 430,
      y: 112,
      rotate: 23,
      scale: 0.68,
      opacity: 1,
      zIndex: 10,
      pointer: true,
    },
    3: {
      x: 560,
      y: 260,
      rotate: 32,
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
      pointer: false,
    },
  };

  if (relative < -3) return poses[-3];
  if (relative > 3) return poses[3];

  return poses[relative];
}

function WheelBase({ sectionKey }: { sectionKey: SectionType }) {
  const [previousKey, setPreviousKey] = useState<SectionType>(sectionKey);
  const [currentKey, setCurrentKey] = useState<SectionType>(sectionKey);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (sectionKey === currentKey) return;

    setPreviousKey(currentKey);
    setCurrentKey(sectionKey);
    setIsFading(true);

    const timer = window.setTimeout(() => {
      setPreviousKey(sectionKey);
      setIsFading(false);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [sectionKey, currentKey]);

  const circleClass =
    "absolute left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full shadow-[inset_0_20px_32px_rgba(255,255,255,.26),0_-1px_0_rgba(255,255,255,.58)] transition-opacity duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] md:h-[720px] md:w-[720px]";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-hidden">
      <div className="relative h-[120px] w-full">
        <div
          className={`${circleClass} z-0`}
          style={{
            bottom: "-600px",
            background: wheelColorMap[currentKey],
            opacity: 1,
          }}
        />

        <div
          className={`${circleClass} z-[2]`}
          style={{
            bottom: "-600px",
            background: wheelColorMap[previousKey],
            opacity: isFading ? 1 : 0,
          }}
        />

        <div
          className="absolute left-1/2 z-[3] h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-white/30 md:h-[720px] md:w-[720px]"
          style={{
            bottom: "-600px",
          }}
        />

        <div
          className="absolute left-1/2 z-[4] h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-55 blur-[2px] md:h-[660px] md:w-[660px]"
          style={{
            bottom: "-560px",
            background:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,.38), rgba(255,255,255,0) 54%)",
          }}
        />

        <div
          className="absolute left-1/2 z-[5] h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-35 mix-blend-screen blur-xl md:h-[660px] md:w-[660px]"
          style={{
            bottom: "-562px",
            background:
              "conic-gradient(from 180deg, rgba(255,255,255,.36), rgba(255,255,255,0), rgba(255,255,255,.26), rgba(255,255,255,0))",
          }}
        />
      </div>
    </div>
  );
}

function ProjectVideoCard({
  item,
  relative,
  active,
  transitionMs,
  onOpen,
}: {
  item: WheelItem;
  relative: number;
  active: boolean;
  transitionMs: number;
  onOpen: () => void;
}) {
  const pose = getFourCardPose(relative);

  return (
    <button
      type="button"
      data-cursor="pointer"
      onClick={onOpen}
      className={`absolute left-1/2 bottom-[118px] w-[152px] text-left outline-none ease-[cubic-bezier(.2,.85,.2,1)] sm:w-[166px] md:w-[178px] ${
        pose.pointer ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        zIndex: pose.zIndex,
        opacity: pose.opacity,
        transform: `translateX(-50%) translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${pose.rotate}deg) scale(${pose.scale})`,
        transformOrigin: "50% 120%",
        transitionProperty: "transform, opacity",
        transitionDuration: `${transitionMs}ms`,
      }}
    >
      <div className="project-card-idle">
        <div
          className={`group relative rounded-[22px] border border-white/60 bg-gradient-to-br ${accentMap[item.sectionKey]} p-3 shadow-[0_18px_36px_rgba(0,0,0,.12),inset_0_1px_0_rgba(255,255,255,.7)] transition duration-300 ${
            active ? "hover:scale-[1.045]" : "hover:scale-[1.02]"
          }`}
        >
          <div className="relative overflow-hidden rounded-[15px] bg-black">
            <video
              src={item.video.videoUrl}
              poster={item.video.thumbUrl}
              playsInline
              muted
              preload="metadata"
              controls={false}
              controlsList="nodownload"
              data-portfolio-preview="true"
              className="aspect-[4/5] w-full object-cover"
              onContextMenu={(e) => e.preventDefault()}
            />

            <div className="pointer-events-none absolute inset-0 bg-black/8" />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/85 text-black shadow-[0_10px_22px_rgba(0,0,0,.14)] backdrop-blur-md transition duration-300 group-hover:scale-105">
                <div className="ml-[3px] h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-black" />
              </div>
            </div>
          </div>

          <div className="px-1 pb-1 pt-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                {item.sectionVideoIndex === 0 ? "New" : `#${item.sectionVideoIndex + 1}`}
              </span>

              <span className="max-w-[82px] truncate rounded-full bg-white/32 px-2.5 py-1 text-[9px] font-semibold text-white/95">
                {item.sectionTitle}
              </span>
            </div>

            <h3 className="mt-2 text-[18px] font-black leading-none tracking-tight text-white md:text-[20px]">
              {`Preview ${item.sectionVideoIndex + 1}`}
            </h3>
          </div>
        </div>
      </div>
    </button>
  );
}

function PopOutPlayer({
  item,
  origin,
  onClose,
}: {
  item: WheelItem | null;
  origin: PopOrigin;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<"enter" | "open" | "closing">("enter");

  const requestClose = () => {
    if (phase === "closing") return;

    const node = videoRef.current;
    if (node) {
      node.pause();
    }

    setPhase("closing");

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, 620);
  };

  const handleVideoClick = () => {
    const node = videoRef.current;
    if (!node) return;

    if (!node.paused) {
      requestClose();
    }
  };

  useEffect(() => {
    if (!item) return;

    setPhase("enter");

    const frameOne = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setPhase("open");
      });
    });

    const node = videoRef.current;

    if (node) {
      pauseAllPortfolioVideos(node);
      node.muted = false;

      const playTimer = window.setTimeout(() => {
        void node.play().catch(() => {
          // clicked action normally allows autoplay
        });
      }, 170);

      return () => {
        window.cancelAnimationFrame(frameOne);
        window.clearTimeout(playTimer);

        if (closeTimerRef.current) {
          window.clearTimeout(closeTimerRef.current);
        }

        node.pause();
      };
    }

    return () => {
      window.cancelAnimationFrame(frameOne);

      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [item]);

  if (!item) return null;

  const isOpen = phase === "open";
  const isClosing = phase === "closing";

  const pullX = origin.x * 0.32;
  const pullY = origin.y * 0.38 + 70;
  const pullRotate = origin.rotate * 0.42;
  const pullScale = 0.42 + origin.scale * 0.12;

  const pullTransform = `translate3d(${pullX}px, ${pullY}px, 0) rotate(${pullRotate}deg) scale(${pullScale})`;
  const openTransform = "translate3d(0px, 0px, 0) rotate(0deg) scale(1)";

  return (
    <div
      className={`absolute inset-0 z-[80] flex items-center justify-center px-4 transition-[opacity,backdrop-filter] duration-[520ms] ease-[cubic-bezier(.16,1,.3,1)] ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close video"
        className={`absolute inset-0 cursor-default bg-white/24 transition-all duration-[520ms] ease-[cubic-bezier(.16,1,.3,1)] ${
          isOpen ? "backdrop-blur-[2px] opacity-100" : "backdrop-blur-0 opacity-0"
        }`}
        onClick={requestClose}
      />

      <div
        className={`relative max-h-[calc(100%-34px)] w-[min(72vw,340px)] overflow-hidden rounded-[30px] border border-white/65 bg-gradient-to-br ${accentMap[item.sectionKey]} p-3 shadow-[0_34px_90px_rgba(0,0,0,.22),inset_0_1px_0_rgba(255,255,255,.7)] will-change-transform`}
        style={{
          transform: isOpen ? openTransform : pullTransform,
          opacity: isOpen ? 1 : 0,
          filter: isOpen ? "blur(0px)" : "blur(2px)",
          transitionProperty: "transform, opacity, filter",
          transitionDuration: isClosing ? "620ms" : "720ms",
          transitionTimingFunction: isClosing
            ? "cubic-bezier(.5,0,.22,1)"
            : "cubic-bezier(.13,1.12,.22,1)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[30px]"
          style={{
            opacity: isOpen ? 0 : 1,
            background:
              "radial-gradient(circle at 50% 36%, rgba(255,255,255,.38), rgba(255,255,255,0) 62%)",
            transition: "opacity 520ms cubic-bezier(.16,1,.3,1)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-[30px]"
          style={{
            opacity: isOpen ? 0 : 0.42,
            boxShadow: "inset 0 0 0 999px rgba(255,255,255,.12)",
            transition: "opacity 520ms cubic-bezier(.16,1,.3,1)",
          }}
        />

        <button
          type="button"
          data-cursor="pointer"
          aria-label="Close video"
          onClick={requestClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-white/90 text-lg font-black text-black/70 shadow-[0_12px_24px_rgba(0,0,0,.12)] backdrop-blur-md transition hover:scale-105 hover:text-black"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1)" : "scale(.8)",
            transition: "opacity 360ms ease, transform 360ms ease",
          }}
        >
          ×
        </button>

        <div
          className="overflow-hidden rounded-[24px] bg-black"
          style={{
            transform: isOpen ? "scale(1)" : "scale(.9)",
            transition: "transform 720ms cubic-bezier(.13,1.12,.22,1)",
          }}
        >
          <video
            ref={videoRef}
            src={item.video.videoUrl}
            poster={item.video.thumbUrl}
            playsInline
            controls
            autoPlay
            controlsList="nodownload"
            data-portfolio-preview="true"
            className="max-h-[58vh] w-full object-contain"
            onClick={handleVideoClick}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        <div
          className="px-2 pb-1 pt-3"
          style={{
            transform: isOpen ? "translateY(0px)" : "translateY(18px)",
            opacity: isOpen ? 1 : 0,
            transition: "transform 520ms cubic-bezier(.16,1,.3,1) 90ms, opacity 420ms ease 90ms",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {item.sectionVideoIndex === 0 ? "New" : `#${item.sectionVideoIndex + 1}`}
            </span>

            <span className="rounded-full bg-white/34 px-2.5 py-1 text-[10px] font-semibold text-white">
              {item.sectionTitle}
            </span>
          </div>

          <h3 className="mt-2 text-xl font-black leading-none tracking-tight text-white">
            {`Preview ${item.sectionVideoIndex + 1}`}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsShowcase({ sections }: ProjectsShowcaseProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const wheelLockRef = useRef(false);

  const wheelItems = useMemo<WheelItem[]>(() => {
    return sections.flatMap((section) =>
      section.videos.map((video, index) => ({
        id: `${section.key}-${video.id}`,
        sectionKey: section.key,
        sectionTitle: section.title,
        sectionVideoIndex: index,
        video,
      }))
    );
  }, [sections]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [openItem, setOpenItem] = useState<WheelItem | null>(null);
  const [popOrigin, setPopOrigin] = useState<PopOrigin>({
    x: 0,
    y: 14,
    rotate: 0,
    scale: 0.98,
  });
  const [wheelTransitionMs, setWheelTransitionMs] = useState(520);

  const activeItem = wheelItems[activeIndex];
  const activeSectionKey = activeItem?.sectionKey ?? "trending";
  const activeSectionTitle = activeItem?.sectionTitle ?? "Projects";

  const closePopOut = () => {
    setOpenItem(null);
    pauseAllPortfolioVideos();
  };

  const moveWheel = (direction: 1 | -1, steps = 1, transitionMs = 520) => {
    if (wheelItems.length === 0) return;

    closePopOut();
    setWheelTransitionMs(transitionMs);
    setActiveIndex((current) => loopIndex(current + direction * steps, wheelItems.length));
  };

  const jumpToSection = (sectionKey: SectionType) => {
    const targetIndex = wheelItems.findIndex((item) => item.sectionKey === sectionKey);

    if (targetIndex >= 0) {
      closePopOut();
      setWheelTransitionMs(520);
      setActiveIndex(targetIndex);
    }
  };

  const openPopOut = (item: WheelItem, index: number, relative: number) => {
    const pose = getFourCardPose(relative);

    pauseAllPortfolioVideos();
    setPopOrigin({
      x: pose.x,
      y: pose.y,
      rotate: pose.rotate,
      scale: pose.scale,
    });
    setActiveIndex(index);
    setOpenItem(item);
  };

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes projectCardIdle {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-3px) rotate(0.18deg);
        }
      }

      .project-card-idle {
        animation: projectCardIdle 4.8s ease-in-out infinite;
        will-change: transform;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8) return;

      event.preventDefault();
      event.stopPropagation();

      if (wheelLockRef.current) return;

      const absDelta = Math.abs(event.deltaY);
      const direction = event.deltaY > 0 ? 1 : -1;

      let steps = 1;
      let transitionMs = 460;
      let lockMs = 150;

      if (absDelta > 360) {
        steps = 4;
        transitionMs = 220;
        lockMs = 80;
      } else if (absDelta > 230) {
        steps = 3;
        transitionMs = 260;
        lockMs = 95;
      } else if (absDelta > 120) {
        steps = 2;
        transitionMs = 320;
        lockMs = 115;
      }

      wheelLockRef.current = true;
      moveWheel(direction, steps, transitionMs);

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, lockMs);
    };

    node.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", onWheel);
    };
  }, [wheelItems.length]);

  if (wheelItems.length === 0) {
    return (
      <div className="rounded-[40px] border border-black/8 bg-white/30 p-10 text-center backdrop-blur-xl">
        <p className="font-semibold text-black/70">No project videos found yet.</p>
        <p className="mt-2 text-sm text-black/45">
          Upload videos from admin panel. Homepage will pick them automatically.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="reveal relative mx-auto w-full max-w-[1480px] overflow-hidden rounded-[44px] border border-black/8 bg-white/28 px-2 pb-8 pt-8 shadow-[0_28px_70px_rgba(0,0,0,.075),inset_0_1px_0_rgba(255,255,255,.72)] backdrop-blur-xl md:px-8 md:pb-10 md:pt-10"
      data-reveal
    >
      <div
        className={`pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full ${softAccentMap[activeSectionKey]} blur-[110px] transition-colors duration-700`}
      />
      <div
        className={`pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full ${softAccentMap[activeSectionKey]} blur-[125px] transition-colors duration-700`}
      />

      <div className="relative z-40 flex flex-col items-center gap-4 text-center">
        <div className="inline-flex max-w-full items-center overflow-x-auto rounded-full border border-black/8 bg-white/54 p-1.5 shadow-[0_12px_26px_rgba(0,0,0,.06)] backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              data-cursor="pointer"
              onClick={() => jumpToSection(section.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition md:px-5 ${
                section.key === activeSectionKey
                  ? `bg-gradient-to-br ${accentMap[section.key]} text-black shadow-[0_8px_18px_rgba(0,0,0,.08)]`
                  : "text-black/48 hover:bg-white/45 hover:text-black/75"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-black/42">
            Selected Work
          </p>

          <h2 className="text-4xl font-black leading-none tracking-tight text-black md:text-6xl">
            {activeSectionTitle}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-black/58 md:text-base">
            {sectionCopy[activeSectionKey]}
          </p>
        </div>
      </div>

      <button
        type="button"
        data-cursor="pointer"
        aria-label="Previous project"
        onClick={() => moveWheel(-1, 1, 420)}
        className="absolute left-4 top-[58%] z-50 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-black/8 bg-white/72 text-3xl text-black/55 shadow-[0_16px_28px_rgba(0,0,0,.08)] backdrop-blur-md transition hover:scale-105 hover:text-black md:flex"
      >
        ‹
      </button>

      <button
        type="button"
        data-cursor="pointer"
        aria-label="Next project"
        onClick={() => moveWheel(1, 1, 420)}
        className="absolute right-4 top-[58%] z-50 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-black/8 bg-white/72 text-3xl text-black/55 shadow-[0_16px_28px_rgba(0,0,0,.08)] backdrop-blur-md transition hover:scale-105 hover:text-black md:flex"
      >
        ›
      </button>

      <div className="relative z-10 mx-auto mt-0 h-[390px] max-w-[1320px] overflow-hidden md:h-[415px]">
        <WheelBase sectionKey={activeSectionKey} />

        {wheelItems.map((item, index) => {
          const relative = shortestRelative(index, activeIndex, wheelItems.length);
          const visible = Math.abs(relative) <= 3;

          if (!visible) return null;

          return (
            <ProjectVideoCard
              key={item.id}
              item={item}
              relative={relative}
              active={relative === 0}
              transitionMs={wheelTransitionMs}
              onOpen={() => openPopOut(item, index, relative)}
            />
          );
        })}
      </div>

      <div className="relative z-40 -mt-8 flex flex-wrap items-center justify-center gap-2">
        {wheelItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            data-cursor="pointer"
            onClick={() => {
              closePopOut();
              setWheelTransitionMs(420);
              setActiveIndex(index);
            }}
            aria-label={`Open ${item.sectionTitle} preview ${item.sectionVideoIndex + 1}`}
            className={`h-2.5 rounded-full transition ${
              index === activeIndex
                ? "w-9 bg-black/70"
                : item.sectionKey === activeSectionKey
                  ? "w-2.5 bg-black/25 hover:bg-black/40"
                  : "w-2.5 bg-black/12 hover:bg-black/24"
            }`}
          />
        ))}
      </div>

      <PopOutPlayer item={openItem} origin={popOrigin} onClose={closePopOut} />
    </div>
  );
}