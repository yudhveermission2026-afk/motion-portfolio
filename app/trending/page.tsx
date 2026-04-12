import MorePageClient from "../../components/MorePageClient";

export default function TrendingPage() {
  return (
    <MorePageClient
      section="trending"
      title="Trending Reels"
      badge="Trending"
      pillClass="border-cyan-300/70 from-blue-300/90 via-cyan-300/85 to-sky-200/80"
      glowClass="bg-cyan-300/40"
    />
  );
}