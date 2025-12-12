export const dynamic = "force-dynamic";

async function getPost(id) {
  const base = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");
  const url = `${base}/posts/${id}`;

  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch post ${id}. Status ${res.status}`);

  return res.json();
}

export default async function PostDetail(props) {
  // ✅ Next 16: params can be a Promise
  const { id } = await props.params;

  const post = await getPost(id);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <a href="/" className="text-sm underline">← Back</a>
        <p className="mt-6">Post not found.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <a href="/" className="text-sm underline">← Back</a>

      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
      <p className="text-xs opacity-60 mt-2">
        Created: {post.created_at ? new Date(post.created_at).toLocaleString() : "—"}
      </p>

      <div className="mt-6 whitespace-pre-wrap">{post.content}</div>
    </main>
  );
}
