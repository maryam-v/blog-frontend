"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/posts/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load post (${res.status})`);

        const data = await res.json();
        if (!cancelled) {
          setTitle(data.title || "");
          setContent(data.content || "");
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const maybe = await res.json().catch(() => null);
        throw new Error(maybe?.error || `Update failed (${res.status})`);
      }

      router.push(`/posts/${id}`);
      router.refresh();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="text-sm underline mb-6"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

      {error && (
        <div className="border border-red-300 bg-red-50 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Content</label>
          <textarea
            className="w-full border rounded p-2 min-h-[160px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
