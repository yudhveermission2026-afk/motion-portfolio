import MorePageTemplate from "../../components/MorePageTemplate";

export default function AIPage() {
  return (
    <MorePageTemplate
      title="AI Videos"
      badge="AI"
      pillClass="border-amber-300/70 from-orange-300/90 via-amber-300/85 to-yellow-200/80"
      glowClass="bg-amber-300/40"
      videos={[
        "/projects/ai/preview1.mp4",
        "/projects/ai/preview2.mp4",
        "/projects/ai/preview3.mp4",
        "/projects/ai/preview4.mp4",
      ]}
    />
  );
}