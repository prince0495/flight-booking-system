import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfDay } from "date-fns"; // Recommended library for date math

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetDate = searchParams.get("date") 
    ? new Date(searchParams.get("date")!) 
    : new Date();

  const normalizedDate = startOfDay(targetDate);

  const schedule = await prisma.schedule.findFirst({
    where: { date: normalizedDate },
    include: {
      flights: {
        include: {
          aircraft: { include: { airline: true } },
          departure_airport: true,
          arrival_airport: true,
        },
      },
    },
  });

  return NextResponse.json(schedule?.flights || []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      aircraftId, 
      departure_airport_id, 
      arrival_airport_id, 
      departure_time, 
      duration_minutes 
    } = body;

    const depDate = new Date(departure_time);
    const normalizedScheduleDate = startOfDay(depDate);

    const flight = await prisma.$transaction(async (tx) => {
      let schedule = await tx.schedule.findFirst({
        where: { date: normalizedScheduleDate }
      });

      if (!schedule) {
        schedule = await tx.schedule.create({
          data: { date: normalizedScheduleDate }
        });
      }

      return await tx.flight.create({
        data: {
          aircraftId,
          departure_airport_id,
          arrival_airport_id,
          departure_time: depDate,
          duration_minutes: parseInt(duration_minutes),
          schedule_id: schedule.id,
        },
      });
    });

    return NextResponse.json(flight, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to schedule flight" }, { status: 500 });
  }
}