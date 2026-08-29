"use client";

import { useEffect, useState } from "react";

type CrewMember = {
  id: string;
  name: string;
  email: string | null;
};

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadCrew() {
    setLoading(true);
    const res = await fetch("/api/crew");
    if (res.ok) {
      setCrew(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCrew();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/crew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: email || undefined }),
    });

    if (res.ok) {
      setName("");
      setEmail("");
      await loadCrew();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
    }

    setSubmitting(false);
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Crew</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3 rounded border bg-white p-4">
        <h2 className="font-medium">Add a crew member</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded border p-2"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded border p-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : crew.length === 0 ? (
        <p className="text-slate-500">No crew members yet.</p>
      ) : (
        <ul className="divide-y rounded border bg-white">
          {crew.map((member) => (
            <li key={member.id} className="p-3">
              <p className="font-medium">{member.name}</p>
              {member.email && (
                <p className="text-sm text-slate-500">{member.email}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
