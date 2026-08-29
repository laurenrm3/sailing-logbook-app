import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: { crew: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(trips);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.date || !body.boatLabel || !body.durationMin) {
    return NextResponse.json(
      { error: "date, boatLabel, and durationMin are required" },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.create({
    data: {
      date: new Date(body.date),
      boatLabel: body.boatLabel,
      durationMin: Number(body.durationMin),
      distanceNm: body.distanceNm ? Number(body.distanceNm) : null,
      conditions: body.conditions || null,
      notes: body.notes || null,
      userId: session.user.id,
      crew: {
        connect: (body.crewIds || []).map((id: string) => ({ id })),
      },
    },
    include: { crew: true },
  });

  return NextResponse.json(trip, { status: 201 });
}
