import MorePageTemplate from "../../components/MorePageTemplate";
import { getProjectVideos } from "../../lib/getProjectVideos";

export default function PoliticalPage() {
  const videos = getProjectVideos("political");

  return (
    <MorePageTemplate
      title="Political Edits"
      badge="Political"
      pillClass="border-pink-300/70 from-fuchsia-300/90 via-pink-300/85 to-rose-200/80"
      glowClass="bg-pink-300/40"
      videos={videos}
    />
  );
}