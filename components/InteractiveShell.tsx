"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function InteractiveShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isHacker = pathname?.startsWith("/hacker");

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHacker) {
      document.body.classList.remove("has-fancy-cursor");
      return;
    }

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) {
      document.body.classList.remove("has-fancy-cursor");
      return;
    }

    document.body.classList.add("has-fancy-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const over = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target || !ringRef.current) return;

      const clickable = target.closest(
        "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='pointer']"
      );

      if (clickable) {
        ringRef.current.classList.add("cursor-ring-active");
      } else {
        ringRef.current.classList.remove("cursor-ring-active");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });

    let raf = 0;
    const animate = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(animate);
    };

    move({ clientX: mouseX, clientY: mouseY } as MouseEvent);
    raf = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("has-fancy-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, [isHacker]);

  if (isHacker) return <>{children}</>;

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full"
      />

      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 rounded-full bg-black/72"
      />

      <div className="relative z-[2]">{children}</div>
    </>
  );
}