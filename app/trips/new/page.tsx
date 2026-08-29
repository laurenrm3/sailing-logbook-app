"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CrewMember = {
  id: string;
  name: string;
};

const CONDITIONS = ["calm", "windy", "choppy"];

export default function NewTripPage() {
  const router = useRouter();
  const [crewOptions, setCrewOptions] = useState<CrewMember[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [form, setForm] = useState({
    date: "",
    boatLabel: "",
    durationMin: "",
    distanceNm: "",
    conditions: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCrew() {
      const res = await fetch("/api/crew");
      if (res.ok) {
        setCrewOptions(await res.json());
      }
    }
    loadCrew();
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCrew(id: string) {
    setSelectedCrew((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.date || !form.boatLabel || !form.durationMin) {
      setError("Date, boat name, and duration are required.");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        crewIds: selectedCrew,
      }),
    });

    if (res.ok) {
      router.push("/trips");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Log a trip</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Boat name</label>
          <input
            type="text"
            value={form.boatLabel}
            onChange={(e) => updateField("boatLabel", e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={form.durationMin}
              onChange={(e) => updateField("durationMin", e.target.value)}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Distance (nm, optional)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={form.distanceNm}
              onChange={(e) => updateField("distanceNm", e.target.value)}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Conditions</label>
          <select
            value={form.conditions}
            onChange={(e) => updateField("conditions", e.target.value)}
            className="mt-1 w-full rounded border p-2"
          >
            <option value="">Select conditions...</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Crew</label>
          {crewOptions.length === 0 ? (
            <p className="mt-1 text-sm text-slate-500">
              No crew members yet. Add some on the Crew page first.
            </p>
          ) : (
            <div className="mt-1 space-y-1">
              {crewOptions.map((member) => (
                <label key={member.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCrew.includes(member.id)}
                    onChange={() => toggleCrew(member.id)}
                  />
                  {member.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save trip"}
        </button>
      </form>
    </div>
  );
}
