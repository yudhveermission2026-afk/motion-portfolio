"use client";

import type { ReactNode } from "react";

export default function InteractiveShell({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="relative z-[2]">{children}</div>;
}