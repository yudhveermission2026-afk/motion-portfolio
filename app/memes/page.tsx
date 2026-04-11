import MorePageTemplate from "../../components/MorePageTemplate";

export default function MemesPage() {
  return (
    <MorePageTemplate
      title="Memes"
      badge="Memes"
      pillClass="border-emerald-300/70 from-emerald-300/90 via-green-300/85 to-teal-200/80"
      glowClass="bg-emerald-300/40"
      videos={[
        "/projects/memes/preview1.mp4",
        "/projects/memes/preview2.mp4",
        "/projects/memes/preview3.mp4",
        "/projects/memes/preview4.mp4",
      ]}
    />
  );
}