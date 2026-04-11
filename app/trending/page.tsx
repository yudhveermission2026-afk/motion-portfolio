import MorePageTemplate from "../../components/MorePageTemplate";

export default function TrendingPage() {
  return (
    <MorePageTemplate
      title="Trending Reels"
      badge="Trending"
      pillClass="border-cyan-300/70 from-blue-300/90 via-cyan-300/85 to-sky-200/80"
      glowClass="bg-cyan-300/40"
      videos={[
        "/projects/trending/preview1.mp4",
        "/projects/trending/preview2.mp4",
        "/projects/trending/preview3.mp4",
        "/projects/trending/preview4.mp4",
      ]}
    />
  );
}