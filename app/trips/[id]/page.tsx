"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Trip = {
  id: string;
  date: string;
  boatLabel: string;
  durationMin: number;
  distanceNm: number | null;
  conditions: string | null;
  notes: string | null;
  crew: { id: string; name: string }[];
};

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      const res = await fetch(`/api/trips/${params.id}`);
      if (res.status === 404) {
        setNotFound(true);
      } else if (res.ok) {
        setTrip(await res.json());
      }
      setLoading(false);
    }
    loadTrip();
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Delete this trip? This can't be undone.")) return;

    setDeleting(true);
    const res = await fetch(`/api/trips/${params.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/trips");
    } else {
      setDeleting(false);
    }
  }

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (notFound || !trip) return <p className="text-slate-500">Trip not found.</p>;

  return (
    <div>
      <Link href="/trips" className="text-sm text-slate-500 underline">
        ← Back to trips
      </Link>

      <div className="mt-4 rounded border bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{trip.boatLabel}</h1>
            <p className="text-slate-500">
              {new Date(trip.date).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Duration</dt>
            <dd>{(trip.durationMin / 60).toFixed(1)} hrs</dd>
          </div>
          {trip.distanceNm && (
            <div>
              <dt className="text-slate-500">Distance</dt>
              <dd>{trip.distanceNm} nm</dd>
            </div>
          )}
          {trip.conditions && (
            <div>
              <dt className="text-slate-500">Conditions</dt>
              <dd className="capitalize">{trip.conditions}</dd>
            </div>
          )}
        </dl>

        {trip.crew.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-slate-500">Crew</p>
            <p>{trip.crew.map((c) => c.name).join(", ")}</p>
          </div>
        )}

        {trip.notes && (
          <div className="mt-4">
            <p className="text-sm text-slate-500">Notes</p>
            <p className="whitespace-pre-wrap">{trip.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
