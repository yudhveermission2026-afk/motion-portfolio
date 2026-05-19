import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import InteractiveShell from "../components/InteractiveShell";

const siteUrl = "https://www.madebyankit.xyz";

const seoTitle =
  "Made By Ankit | Ankit Sisodia - Video Editor, AI Video Editor & Political Content Creator";

const seoDescription =
  "Made By Ankit is the portfolio of Ankit Sisodia, a video editor and AI video creator specializing in short-form reels, political edits, meme content, social media videos, trend-driven edits, and cinematic AI visuals.";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ankit Sisodia",
  alternateName: ["Made By Ankit", "MadeByAnkit", "Ankit", "Ankit Editor"],
  url: siteUrl,
  image: `${siteUrl}/profile.png`,
  jobTitle: [
    "Video Editor",
    "AI Video Editor",
    "Short-Form Video Creator",
    "Political Content Editor",
    "Social Media Editor",
  ],
  description: seoDescription,
  knowsAbout: [
    "Video Editing",
    "AI Video Creation",
    "Political Video Editing",
    "Meme Editing",
    "Short Form Reels",
    "Instagram Reels Editing",
    "YouTube Shorts Editing",
    "Premiere Pro",
    "After Effects",
    "Photoshop",
    "CapCut",
    "Kling AI",
    "Higgsfield AI",
    "Grok",
    "ChatGPT",
    "Gemini",
  ],
  sameAs: ["https://www.instagram.com/bhayankarprani"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Made By Ankit",
  alternateName: ["MadeByAnkit", "Ankit Sisodia Portfolio"],
  url: siteUrl,
  description: seoDescription,
  creator: {
    "@type": "Person",
    name: "Ankit Sisodia",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Made By Ankit - Video Editing Portfolio",
  url: siteUrl,
  description:
    "Freelance video editing, AI video creation, political edits, meme content, reels editing, and social media video editing by Ankit Sisodia.",
  founder: {
    "@type": "Person",
    name: "Ankit Sisodia",
  },
  areaServed: ["India", "Worldwide"],
  serviceType: [
    "Video Editing",
    "AI Video Editing",
    "Political Video Editing",
    "Reels Editing",
    "Meme Editing",
    "Social Media Video Editing",
    "YouTube Shorts Editing",
    "Instagram Reels Editing",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: seoTitle,
    template: "%s | Made By Ankit",
  },

  description: seoDescription,

  applicationName: "Made By Ankit",
  authors: [{ name: "Ankit Sisodia", url: siteUrl }],
  creator: "Ankit Sisodia",
  publisher: "Made By Ankit",

  keywords: [
    "Made By Ankit",
    "MadeByAnkit",
    "Ankit Sisodia",
    "Ankit Sisodia video editor",
    "Ankit video editor",
    "video editor Ankit",
    "AI video editor",
    "AI video creator India",
    "political video editor",
    "political edits",
    "meme editor",
    "reels editor",
    "short form video editor",
    "Instagram reels editor",
    "YouTube shorts editor",
    "social media video editor",
    "Premiere Pro editor",
    "After Effects editor",
    "CapCut editor",
  ],

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    title: seoTitle,
    description: seoDescription,
    siteName: "Made By Ankit",
    locale: "en_IN",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Made By Ankit - Ankit Sisodia Video Editor Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@bhayankarprani",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "portfolio",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll>
          <InteractiveShell>{children}</InteractiveShell>
        </SmoothScroll>
      </body>
    </html>
  );
}