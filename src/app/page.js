import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPosts(page = 1, limit = 5) {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const res = await fetch(`${base}/posts?page=${page}&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json(); // { page, limit, total, total_pages, posts: [] }
}

export default async function HomePage({ searchParams }) {
  const sp = await searchParams; // Next 16 can provide this as a Promise
  const page = Number(sp?.page ?? 1);
  const limit = Number(sp?.limit ?? 5);

  const data = await getPosts(page, limit);
  const posts = data.posts || [];

  const canPrev = data.page > 1;
  const canNext = data.page < data.total_pages;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Blog</h1>

        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-sm underline">
            Profile
          </Link>

          <Link
            href="/new"
            className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
          >
            New Post
          </Link>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm opacity-70">
          Page {data.page} of {data.total_pages} • Total posts: {data.total}
        </p>

        <div className="flex gap-2">
          <Link
            href={`/?page=${Math.max(1, data.page - 1)}&limit=${data.limit}`}
            className={`border px-3 py-2 rounded ${!canPrev ? "pointer-events-none opacity-50" : ""}`}
          >
            ← Prev
          </Link>

          <Link
            href={`/?page=${data.page + 1}&limit=${data.limit}`}
            className={`border px-3 py-2 rounded ${!canNext ? "pointer-events-none opacity-50" : ""}`}
          >
            Next →
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="opacity-70">No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id} className="border rounded p-4">
              <Link
                href={`/posts/${p.id}`}
                className="text-xl font-semibold hover:underline"
              >
                {p.title}
              </Link>

              <p className="opacity-80 mt-2 line-clamp-2">{p.content}</p>

              <p className="text-xs opacity-60 mt-3">
                Created: {p.created_at ? new Date(p.created_at).toLocaleString() : "—"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
