import MorePageTemplate from "../../components/MorePageTemplate";
import { getProjectVideos } from "../../lib/getProjectVideos";

export default function TrendingPage() {
  const videos = getProjectVideos("trending");

  return (
    <MorePageTemplate
      title="Trending Reels"
      badge="Trending"
      pillClass="border-cyan-300/70 from-blue-300/90 via-cyan-300/85 to-sky-200/80"
      glowClass="bg-cyan-300/40"
      videos={videos}
    />
  );
}