import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";

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
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}