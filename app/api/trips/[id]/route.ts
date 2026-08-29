import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: { crew: true },
  });

  if (!trip || trip.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(trip);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const existing = await prisma.trip.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();

  const trip = await prisma.trip.update({
    where: { id: params.id },
    data: {
      date: body.date ? new Date(body.date) : undefined,
      boatLabel: body.boatLabel,
      durationMin: body.durationMin ? Number(body.durationMin) : undefined,
      distanceNm:
        body.distanceNm !== undefined ? Number(body.distanceNm) : undefined,
      conditions: body.conditions,
      notes: body.notes,
      crew: body.crewIds
        ? { set: body.crewIds.map((id: string) => ({ id })) }
        : undefined,
    },
    include: { crew: true },
  });

  return NextResponse.json(trip);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const existing = await prisma.trip.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.trip.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
