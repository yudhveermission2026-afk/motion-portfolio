import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import InteractiveShell from "../components/InteractiveShell";

export const metadata: Metadata = {
  title: {
    default: "Made by Ankit",
    template: "%s | Made by Ankit",
  },
  description:
    "Made by Ankit — video editor portfolio for reels, memes, political edits, and AI visuals.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Made by Ankit",
    description:
      "Video editor portfolio for reels, memes, political edits, and AI visuals.",
    siteName: "Made by Ankit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <InteractiveShell>{children}</InteractiveShell>
        </SmoothScroll>
      </body>
    </html>
  );
}