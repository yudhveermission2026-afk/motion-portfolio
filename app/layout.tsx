import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import InteractiveShell from "../components/InteractiveShell";

export const metadata = {
  title: "Motion Portfolio",
  description: "Cinematic portfolio website",
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