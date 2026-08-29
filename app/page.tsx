import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Welcome to your Sailing Logbook</h1>
        <p className="mt-2 text-slate-600">
          Log trips, track crew, and look back on where you&apos;ve sailed.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white"
        >
          Log in to get started
        </Link>
      </div>
    );
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: { crew: true },
  });

  const totalTrips = trips.length;
  const totalHours =
    trips.reduce((sum: number, t: { durationMin: number }) => sum + t.durationMin, 0) / 60;

  const crewCounts = new Map<string, number>();
  trips.forEach((trip: { crew: { name: string }[] }) => {
    trip.crew.forEach((member: { name: string }) => {
      crewCounts.set(member.name, (crewCounts.get(member.name) || 0) + 1);
    });
  });
  const topCrew = [...crewCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-2 text-slate-600">Here&apos;s your sailing summary.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{totalTrips}</p>
          <p className="text-sm text-slate-500">Trips logged</p>
        </div>
        <div className="rounded border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
          <p className="text-sm text-slate-500">Hours on the water</p>
        </div>
        <div className="rounded border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{topCrew ? topCrew[0] : "—"}</p>
          <p className="text-sm text-slate-500">Most frequent crew</p>
        </div>
      </div>

      <Link
        href="/trips"
        className="mt-6 inline-block rounded bg-slate-900 px-4 py-2 text-white"
      >
        View all trips
      </Link>
    </div>
  );
}
