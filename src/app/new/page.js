"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to create post");
      }

      const post = await res.json();

      // ✅ redirect to the new post detail page
      router.push(`/posts/${post.id}`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">New Post</h1>

      {error && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            className="mt-1 w-full rounded border p-2"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something…"
            required
          />
        </div>

        <button
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create Post"}
        </button>
      </form>
    </div>
  );
}
