import MorePageTemplate from "../../components/MorePageTemplate";
import { getProjectVideos } from "../../lib/getProjectVideos";

export default function MemesPage() {
  const videos = getProjectVideos("memes");

  return (
    <MorePageTemplate
      title="Memes"
      badge="Memes"
      pillClass="border-emerald-300/70 from-emerald-300/90 via-green-300/85 to-teal-200/80"
      glowClass="bg-emerald-300/40"
      videos={videos}
    />
  );
}