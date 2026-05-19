"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AboutScene() {
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes aboutFloat {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes aboutGlowPulse {
        0%, 100% {
          opacity: 0.55;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.04);
        }
      }

      @keyframes orbFloat1 {
        0%, 100% {
          transform: translateY(0px) translateX(0px);
        }
        50% {
          transform: translateY(-10px) translateX(6px);
        }
      }

      @keyframes orbFloat2 {
        0%, 100% {
          transform: translateY(0px) translateX(0px);
        }
        50% {
          transform: translateY(8px) translateX(-8px);
        }
      }

      @keyframes orbFloat3 {
        0%, 100% {
          transform: translateY(0px) translateX(0px);
        }
        50% {
          transform: translateY(-6px) translateX(-5px);
        }
      }

      @keyframes softSpin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative flex h-[470px] w-full items-center justify-center overflow-visible md:h-[560px]">
      <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_50%_68%,rgba(255,233,158,.18),rgba(255,255,255,0)_58%)]" />

      <div
        className="relative flex h-[400px] w-[min(92vw,390px)] items-center justify-center rounded-[42px] border border-black/10 bg-white/25 shadow-[0_24px_48px_rgba(40,45,70,.08),inset_0_1px_0_rgba(255,255,255,.78)] backdrop-blur-md transition duration-300 hover:-translate-y-1 md:h-[470px] md:w-[440px]"
        style={{
          transform: `rotateX(${tilt.y * -5}deg) rotateY(${tilt.x * -7}deg)`,
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setTilt({ x: 0, y: 0 });
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          setTilt({ x, y });
        }}
      >
        <div
          className="pointer-events-none absolute -inset-8 rounded-[56px] bg-[radial-gradient(circle_at_50%_50%,rgba(121,213,255,.13),rgba(255,255,255,0)_64%)] blur-3xl"
          style={{ animation: "aboutGlowPulse 4s ease-in-out infinite" }}
        />

        <div
          className={`absolute left-1/2 top-[-92px] z-10 h-[132px] w-[132px] -translate-x-1/2 overflow-hidden rounded-full border border-white/80 shadow-[0_18px_30px_rgba(0,0,0,.08)] transition-all duration-500 ${
            hover ? "-translate-y-7 scale-100 opacity-100" : "translate-y-10 scale-90 opacity-0"
          }`}
        >
          <Image
            src="/profile.jpg"
            alt="Ankit profile"
            fill
            sizes="132px"
            className="object-cover"
            priority={false}
          />
        </div>

        <div
          className={`pointer-events-none absolute -left-8 top-[128px] z-30 max-w-[170px] rounded-[22px] border border-black/10 bg-white/95 px-5 py-3 text-base font-semibold text-black shadow-[0_12px_28px_rgba(0,0,0,.09)] backdrop-blur-md transition-all duration-500 ${
            hover
              ? "translate-x-0 translate-y-0 scale-100 opacity-100"
              : "translate-x-4 translate-y-3 scale-95 opacity-0"
          }`}
        >
          <div className="relative">
            Hi, I&apos;m Ankit
            <div className="absolute -right-3 top-4 h-4 w-4 rotate-45 border-r border-t border-black/10 bg-white/95" />
          </div>
        </div>

        <div
          className="pointer-events-none absolute left-8 top-10 h-12 w-12 rounded-full bg-sky-200/70 blur-[1px]"
          style={{ animation: "orbFloat1 4.4s ease-in-out infinite" }}
        />

        <div
          className="pointer-events-none absolute right-10 top-16 h-14 w-14 rounded-[18px] border border-white/70 bg-white/35 backdrop-blur-md"
          style={{ animation: "orbFloat2 5s ease-in-out infinite" }}
        />

        <div
          className="pointer-events-none absolute left-9 bottom-14 h-20 w-20 rounded-full border-[10px] border-indigo-200/65"
          style={{ animation: "softSpin 18s linear infinite" }}
        />

        <div
          className="pointer-events-none absolute right-7 bottom-10 h-9 w-9 rounded-full bg-pink-200/60"
          style={{ animation: "orbFloat3 4.8s ease-in-out infinite" }}
        />

        <div
          className="pointer-events-none absolute right-12 top-[48%] h-0 w-0 border-l-[26px] border-r-[26px] border-t-[38px] border-l-transparent border-r-transparent border-t-violet-200/75 drop-shadow-[0_8px_16px_rgba(140,120,255,.12)]"
          style={{ animation: "orbFloat2 5.6s ease-in-out infinite" }}
        />

        <div className="pointer-events-none absolute inset-x-8 bottom-8 top-8 rounded-[36px] border border-white/35 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,.35)]" />

        <div
          className="relative z-20"
          style={{
            animation: "aboutFloat 4.2s ease-in-out infinite",
            transform: hover
              ? "translateZ(18px) scale(1.03)"
              : "translateZ(0px) scale(1)",
            transition: "transform 300ms ease",
          }}
        >
          <div className="relative h-[385px] w-[290px] md:h-[440px] md:w-[330px]">
            <div className="pointer-events-none absolute bottom-2 left-1/2 h-10 w-44 -translate-x-1/2 rounded-full bg-black/10 blur-xl" />

            <div className="pointer-events-none absolute inset-x-6 bottom-8 top-10 rounded-[40px] bg-[radial-gradient(circle_at_50%_55%,rgba(255,243,189,.5),rgba(255,255,255,0)_65%)] blur-2xl" />

            <video
              src="/about-wave.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,.12)]"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}