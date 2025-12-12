import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPosts() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const res = await fetch(`${base}/posts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Blog</h1>

        <div className="flex items-center gap-4">
          {/* 👇 Profile link */}
          <Link href="/profile" className="text-sm underline">
            Profile
          </Link>

          {/* 👇 New post button */}
          <Link
            href="/new"
            className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
          >
            New Post
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

              <p className="text-xs text-zinc-500 mt-1">
                By {p.author?.name || "Unknown"}
              </p>

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
