"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Trip = {
  id: string;
  date: string;
  boatLabel: string;
  durationMin: number;
  distanceNm: number | null;
  conditions: string | null;
  crew: { id: string; name: string }[];
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      const res = await fetch("/api/trips");
      if (res.ok) {
        setTrips(await res.json());
      }
      setLoading(false);
    }
    loadTrips();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trips</h1>
        <Link
          href="/trips/new"
          className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white"
        >
          Log a trip
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : trips.length === 0 ? (
        <p className="text-slate-500">
          No trips logged yet.{" "}
          <Link href="/trips/new" className="underline">
            Log your first one
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {trips.map((trip) => (
            <li key={trip.id} className="rounded border bg-white p-4">
              <Link href={`/trips/${trip.id}`} className="block">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{trip.boatLabel}</span>
                  <span className="text-sm text-slate-500">
                    {new Date(trip.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {(trip.durationMin / 60).toFixed(1)} hrs
                  {trip.distanceNm ? ` · ${trip.distanceNm} nm` : ""}
                  {trip.conditions ? ` · ${trip.conditions}` : ""}
                </p>
                {trip.crew.length > 0 && (
                  <p className="mt-1 text-sm text-slate-500">
                    Crew: {trip.crew.map((c) => c.name).join(", ")}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
