import MorePageTemplate from "../../components/MorePageTemplate";

export default function PoliticalPage() {
  return (
    <MorePageTemplate
      title="Political Edits"
      badge="Political"
      pillClass="border-pink-300/70 from-fuchsia-300/90 via-pink-300/85 to-rose-200/80"
      glowClass="bg-pink-300/40"
      videos={[
        "/projects/political/preview1.mp4",
        "/projects/political/preview2.mp4",
        "/projects/political/preview3.mp4",
        "/projects/political/preview4.mp4",
      ]}
    />
  );
}