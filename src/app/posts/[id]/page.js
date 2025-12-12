"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/posts/${id}`, { cache: "no-store" });
        if (res.status === 404) {
          if (!cancelled) setPost(null);
          return;
        }
        if (!res.ok) throw new Error(`Failed to load post (${res.status})`);

        const data = await res.json();
        if (!cancelled) setPost(data);
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

  async function handleDelete() {
    const ok = confirm("Delete this post? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Delete failed (${res.status})`);
      }

      router.push("/");
      router.refresh();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Link href="/" className="text-sm underline">← Back</Link>
        <p className="mt-6">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-sm underline">← Back</Link>

      <div className="flex items-center justify-between mt-4 gap-3">
        <h1 className="text-3xl font-bold">{post.title}</h1>

        <div className="flex gap-2">
          <Link
            href={`/posts/${post.id}/edit`}
            className="border px-3 py-2 rounded"
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-3 py-2 rounded disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-red-300 bg-red-50 text-red-800 p-3 rounded mt-4">
          {error}
        </div>
      )}

      <p className="text-sm text-gray-500 mt-2">
        By {post.author?.name || "Unknown"}
      </p>     

      <p className="text-sm text-gray-500 mt-2">
        Created: {new Date(post.created_at).toLocaleString()}
      </p>

      <div className="mt-6 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </div>
  );
}
