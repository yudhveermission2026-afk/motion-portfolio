"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { deleteVideoItem, getNextOrder, reorderSectionItems, saveVideoItem, subscribeToVideos } from "@/lib/hacker/realtime-db";
import { getErrorMessage, uploadToCloudinary } from "@/lib/hacker/cloudinary";
import { captureFrameFromVideoFile } from "@/lib/hacker/frame-capture";
import HackerHeader from "@/components/hacker/HackerHeader";
import SingleUploadPanel from "@/components/hacker/SingleUploadPanel";
import BulkUploadPanel from "@/components/hacker/BulkUploadPanel";
import UploadedSection from "@/components/hacker/UploadedSection";
import type { BulkVideoItem, SectionType, UploadMode, VideoItem } from "@/types/hacker";

const ALLOWED_EMAIL = "ankitsisodia812658@gmail.com";
const sections: SectionType[] = ["trending", "political", "ai", "memes"];

export default function HackerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState(ALLOWED_EMAIL);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [section, setSection] = useState<SectionType>("trending");
  const [mode, setMode] = useState<UploadMode>("single");

  const [items, setItems] = useState<VideoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [draggingId, setDraggingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const groupedItems = useMemo(() => {
    const grouped: Record<SectionType, VideoItem[]> = {
      trending: [],
      political: [],
      ai: [],
      memes: [],
    };

    items.forEach((item) => grouped[item.section].push(item));
    return grouped;
  }, [items]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    const unsubDb = subscribeToVideos(setItems);

    return () => {
      unsubAuth();
      unsubDb();
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email aur password dono daal.");
      return;
    }

    try {
      setLoginLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(`Login failed: ${getErrorMessage(error)}`);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSingleUpload = async (data: { video: File; thumb: File | Blob }) => {
    setUploading(true);
    setTotalProgress(0);
    setStatusText("Uploading...");

    try {
      const videoPromise = uploadToCloudinary(data.video, "video", section, (p) => {
        setTotalProgress(Math.max(0, Math.round(p * 0.7)));
      });

      const thumbPromise = uploadToCloudinary(data.thumb, "image", section, (p) => {
        setTotalProgress((prev) => Math.max(prev, 70 + Math.round(p * 0.2)));
      });

      const [videoUrl, thumbUrl] = await Promise.all([videoPromise, thumbPromise]);

      setStatusText("Saving...");
      setTotalProgress(95);

      const order = getNextOrder(items, section);
      await saveVideoItem(section, videoUrl, thumbUrl, order);

      setTotalProgress(100);
      setStatusText("Upload successful!");
    } catch (error) {
      alert(`Upload failed: ${getErrorMessage(error)}`);
      setStatusText("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = async (bulkItems: BulkVideoItem[]) => {
    if (!bulkItems.length) {
      alert("Bulk videos select kar.");
      return;
    }

    setUploading(true);
    setTotalProgress(0);
    setStatusText("Bulk uploading...");

    try {
      let completed = 0;
      const total = bulkItems.length;
      let nextOrder = getNextOrder(items, section);

      for (let i = 0; i < bulkItems.length; i++) {
        const current = bulkItems[i];
        const finalThumb = current.savedThumbBlob || (await captureFrameFromVideoFile(current.file));

        const videoUrl = await uploadToCloudinary(current.file, "video", section, (p) => {
          const base = Math.round((completed / total) * 100);
          const chunk = Math.round(100 / total);
          setTotalProgress(Math.max(base, base + Math.round((p / 100) * chunk * 0.7)));
        });

        const thumbUrl = await uploadToCloudinary(finalThumb, "image", section, (p) => {
          const base = Math.round((completed / total) * 100);
          const chunk = Math.round(100 / total);
          setTotalProgress(Math.max(base, base + Math.round(chunk * 0.7) + Math.round((p / 100) * chunk * 0.2)));
        });

        await saveVideoItem(section, videoUrl, thumbUrl, nextOrder);
        nextOrder += 1;
        completed += 1;

        setTotalProgress(Math.round((completed / total) * 100));
        setStatusText(`Bulk uploaded ${completed}/${total}`);
      }

      setStatusText("Bulk upload successful!");
    } catch (error) {
      alert(`Bulk upload failed: ${getErrorMessage(error)}`);
      setStatusText("Bulk upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete karna hai?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await deleteVideoItem(id);
    } catch (error) {
      alert(`Delete failed: ${getErrorMessage(error)}`);
    } finally {
      setDeletingId("");
    }
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDropOnItem = async (sectionName: SectionType, targetId: string) => {
    if (!draggingId || draggingId === targetId) return;

    const sectionItems = [...groupedItems[sectionName]].sort((a, b) => a.order - b.order);
    const draggedIndex = sectionItems.findIndex((item) => item.id === draggingId);
    const targetIndex = sectionItems.findIndex((item) => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedItem] = sectionItems.splice(draggedIndex, 1);
    sectionItems.splice(targetIndex, 0, draggedItem);

    try {
      await reorderSectionItems(sectionItems);
    } catch (error) {
      alert(`Order update failed: ${getErrorMessage(error)}`);
    } finally {
      setDraggingId("");
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white p-4 text-black">
        <div className="mx-auto max-w-md rounded-lg border p-4">Checking login...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-white p-4 text-black">
        <div className="mx-auto max-w-md rounded-lg border p-4">
          <h1 className="mb-4 text-2xl font-bold">Hacker Login</h1>

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
              placeholder="Email"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
              placeholder="Password"
            />

            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-60"
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (user.email !== ALLOWED_EMAIL) {
    return (
      <main className="min-h-screen bg-white p-4 text-black">
        <div className="mx-auto max-w-md rounded-lg border p-4">
          <h1 className="mb-3 text-2xl font-bold">Access Denied</h1>
          <button
            onClick={() => signOut(auth)}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-4 text-black">
      <div className="mx-auto max-w-6xl space-y-4">
        <HackerHeader
          email={user.email || ""}
          section={section}
          mode={mode}
          onSectionChange={setSection}
          onModeChange={setMode}
          onLogout={() => signOut(auth)}
        />

        {mode === "single" ? (
          <SingleUploadPanel
            section={section}
            uploading={uploading}
            totalProgress={totalProgress}
            statusText={statusText}
            onUpload={handleSingleUpload}
          />
        ) : (
          <BulkUploadPanel
            uploading={uploading}
            totalProgress={totalProgress}
            statusText={statusText}
            onUpload={handleBulkUpload}
          />
        )}

        <div className="space-y-4">
          {sections.map((sec) => (
            <UploadedSection
              key={sec}
              title={sec}
              items={groupedItems[sec]}
              draggingId={draggingId}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDropOnItem={(targetId) => handleDropOnItem(sec, targetId)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}