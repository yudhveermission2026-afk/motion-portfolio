"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "../../lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

type VideoItem = {
  id: string;
  title: string;
  category: string;
  order: number;
  featured: boolean;
  videoUrl: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("trending");
  const [orderValue, setOrderValue] = useState(1);
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      const q = query(collection(db, "videos"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);

      const items: VideoItem[] = snapshot.docs.map((item) => {
        const data = item.data() as Omit<VideoItem, "id">;
        return {
          id: item.id,
          title: data.title,
          category: data.category,
          order: data.order,
          featured: data.featured,
          videoUrl: data.videoUrl,
        };
      });

      setVideos(items);
    } catch (error) {
      console.error("Error fetching videos:", error);
      alert("Videos fetch nahi hue. Firestore check kar.");
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (!checking && user) {
      fetchVideos();
    }
  }, [checking, user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Pehle video select kar.");
      return;
    }

    if (!title.trim()) {
      alert("Title likh.");
      return;
    }

    try {
      setUploading(true);

      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `videos/${category}/${fileName}`);

      await uploadBytes(storageRef, file);
      const videoUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "videos"), {
        title: title.trim(),
        category,
        order: Number(orderValue),
        featured,
        videoUrl,
        createdAt: serverTimestamp(),
      });

      alert("Video upload ho gayi 🔥");

      setTitle("");
      setCategory("trending");
      setOrderValue(1);
      setFeatured(false);
      setFile(null);

      fetchVideos();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Firestore/Storage rules check kar.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Is video ko delete karna hai?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "videos", id));
      fetchVideos();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed.");
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking access...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">
              Admin Panel
            </p>
            <h1 className="mt-2 text-4xl font-bold">Dashboard</h1>
            <p className="mt-3 text-white/60">Logged in as: {user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          {/* Upload Form */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8">
            <h2 className="text-2xl font-semibold">Upload Video</h2>
            <p className="mt-2 text-white/60">
              Yahin se category, order aur featured control hoga.
            </p>

            <form onSubmit={handleUpload} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: Ram Mandir Reel 1"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                >
                  <option value="trending">Trending</option>
                  <option value="political">Political</option>
                  <option value="ai">AI</option>
                  <option value="memes">Memes</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Order Number
                </label>
                <input
                  type="number"
                  value={orderValue}
                  onChange={(e) => setOrderValue(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
                <p className="mt-2 text-xs text-white/40">
                  Chhota number upar aayega. Example: 1, 2, 3...
                </p>
              </div>

              <label className="flex items-center gap-3 text-white/80">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Show on homepage featured section
              </label>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-xl bg-white text-black font-medium py-3 transition hover:opacity-90 disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
            </form>
          </div>

          {/* Info Panel */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900 p-8">
            <h2 className="text-2xl font-semibold">How this will work</h2>
            <div className="mt-6 space-y-4 text-white/60">
              <p>• Category ke hisaab se videos store hongi.</p>
              <p>• Order number se decide hoga kaunsi pehle dikhegi.</p>
              <p>• Featured on karne se homepage pe dikhayenge.</p>
              <p>• More pages me baaki videos automatically la sakte hain.</p>
            </div>
          </div>
        </div>

        {/* Uploaded Videos */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-900 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Uploaded Videos</h2>
            <button
              onClick={fetchVideos}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              Refresh
            </button>
          </div>

          {loadingVideos ? (
            <p className="text-white/60">Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-white/60">Abhi koi video upload nahi hui.</p>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-lg font-medium">{video.title}</p>
                    <p className="mt-1 text-sm text-white/50">
                      Category: {video.category} • Order: {video.order} •{" "}
                      {video.featured ? "Featured" : "Not Featured"}
                    </p>
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-blue-400"
                    >
                      Open video
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(video.id)}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}