import MorePageTemplate from "../../components/MorePageTemplate";
import { getProjectVideos } from "../../lib/getProjectVideos";

export default function AIPage() {
  const videos = getProjectVideos("ai");

  return (
    <MorePageTemplate
      title="AI Videos"
      badge="AI"
      pillClass="border-amber-300/70 from-orange-300/90 via-amber-300/85 to-yellow-200/80"
      glowClass="bg-amber-300/40"
      videos={videos}
    />
  );
}