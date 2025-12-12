"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/profile`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);

        const data = await res.json();
        if (!cancelled) setProfile(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="border border-red-300 bg-red-50 text-red-800 p-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{profile?.name}</h1>
      <p className="mt-3 text-zinc-700 whitespace-pre-wrap">
        {profile?.bio || "No bio yet."}
      </p>
    </main>
  );
}
